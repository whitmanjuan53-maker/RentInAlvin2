export const EMPTY_APPLICATION = {
  firstName: '', lastName: '', email: '', phone: '', dob: '', currentAddress: '',
  coApplicants: '0', pets: 'no', petDesc: '', vehicles: '1', employer: '', jobTitle: '',
  income: '', employedSince: '', prevLandlord: '', prevLandlordPhone: '', reasonLeaving: '',
  property: '', unitType: '', moveIn: '', budget: '', notes: '', consent: false,
};
export type ApplicationData = typeof EMPTY_APPLICATION;
export type ApplicationFieldName = Exclude<keyof ApplicationData, 'consent'>;
export type ApplicationErrors = Partial<Record<keyof ApplicationData, string>>;

export const APPLICATION_STEP_FIELDS: ApplicationFieldName[][] = [
  ['firstName', 'lastName', 'email', 'phone', 'dob', 'currentAddress'],
  ['coApplicants', 'pets', 'petDesc', 'vehicles'],
  ['employer', 'jobTitle', 'income', 'employedSince'],
  ['prevLandlord', 'prevLandlordPhone', 'reasonLeaving'],
  ['property', 'unitType', 'moveIn', 'budget', 'notes'],
];

export function validateApplication(data: ApplicationData, es = false): ApplicationErrors {
  const errors: ApplicationErrors = {};
  const required = ['firstName','lastName','email','phone','employer','income','property','unitType','moveIn'] as const;
  for (const name of required) {
    if (!data[name].trim()) errors[name] = es ? 'Complete este campo.' : 'Please complete this field.';
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = es ? 'Ingrese un correo válido.' : 'Enter a valid email address.';
  if (data.phone && data.phone.replace(/\D/g, '').length < 10) errors.phone = es ? 'Ingrese un teléfono válido.' : 'Enter a phone number with at least 10 digits.';
  for (const name of ['income','budget'] as const) {
    if (data[name] && (!Number.isFinite(Number(data[name])) || Number(data[name]) <= 0)) errors[name] = es ? 'Ingrese un monto mayor que cero.' : 'Enter an amount greater than zero.';
  }
  const today = new Date();
  const localDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  for (const name of ['dob','employedSince','moveIn'] as const) {
    const value = data[name];
    if (!value) continue;
    const parsed = new Date(`${value}T12:00:00`);
    const valid = /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(parsed.getTime()) && parsed.getFullYear() === Number(value.slice(0,4)) && parsed.getMonth()+1 === Number(value.slice(5,7)) && parsed.getDate() === Number(value.slice(8,10));
    if (!valid) errors[name] = es ? 'Ingrese una fecha válida.' : 'Enter a valid date.';
    else if (name === 'moveIn' && value < localDate) errors[name] = es ? 'Elija hoy o una fecha futura.' : 'Choose today or a future move date.';
    else if (name !== 'moveIn' && value > localDate) errors[name] = es ? 'Elija hoy o una fecha anterior.' : 'Choose today or an earlier date.';
  }
  if (!data.consent) errors.consent = es ? 'Revise y acepte la autorización antes de enviar.' : 'Please review and accept the authorization before submitting.';
  return errors;
}
