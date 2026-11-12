'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { APPLICATION_STEP_FIELDS, ApplicationData, ApplicationErrors, ApplicationFieldName, EMPTY_APPLICATION, validateApplication } from '@/lib/application';

interface Field { name: ApplicationFieldName; label: string; type?: string; options?: {value:string;label:string}[]; required?: boolean; wide?: boolean; autoComplete?: string; }

export default function RentalApplication({ es = false }: { es?: boolean }) {
  const t = (en: string, spanish: string) => es ? spanish : en;
  const [data, setData] = useState<ApplicationData>({ ...EMPTY_APPLICATION });
  const [step, setStep] = useState(0);
  const [visited, setVisited] = useState(0);
  const [errors, setErrors] = useState<ApplicationErrors>({});
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState('');
  const [failure, setFailure] = useState('');
  const title = useRef<HTMLHeadingElement>(null);
  const inFlight = useRef(false);
  const initialRender = useRef(true);
  const steps = [t('About you','Sobre usted'),t('Household','Hogar'),t('Employment & income','Empleo e ingresos'),t('Rental history','Historial de renta'),t('Your next home','Su próximo hogar'),t('Review & submit','Revisar y enviar')];
  const communities = ['Kings Haven Apartments, 410 S 2nd St','Kings Manor Townhomes, 328 S 2nd St','Kings Haven Apartments, 100 S 2nd St','French Quarter Residency, 2550 S Bypass 35','The White House Apartments, 1606 W Sealy St','The Royal Oaks Townhomes, 418 S Jackson St'];
  const options = (values: string[]) => values.map(value => ({value,label:value}));
  const fields: Field[][] = [
    [
      {name:'firstName',label:t('First name','Nombre'),required:true,autoComplete:'given-name'},
      {name:'lastName',label:t('Last name','Apellido'),required:true,autoComplete:'family-name'},
      {name:'email',label:t('Email address','Correo electrónico'),type:'email',required:true,autoComplete:'email'},
      {name:'phone',label:t('Phone number','Teléfono'),type:'tel',required:true,autoComplete:'tel'},
      {name:'dob',label:t('Date of birth','Fecha de nacimiento'),type:'date',autoComplete:'bday'},
      {name:'currentAddress',label:t('Current address','Dirección actual'),wide:true,autoComplete:'street-address'},
    ],
    [
      {name:'coApplicants',label:t('Other applicants aged 18+','Otros solicitantes de 18 años o más'),type:'select',options:options(['0','1','2','3','4+'])},
      {name:'vehicles',label:t('Vehicles','Vehículos'),type:'select',options:options(['0','1','2','3+'])},
      {name:'pets',label:t('Do you have pets?','¿Tiene mascotas?'),type:'select',options:[{value:'no',label:t('No','No')},{value:'yes',label:t('Yes','Sí')}]},
      {name:'petDesc',label:t('Pet details','Detalles de las mascotas'),type:'textarea',wide:true},
    ],
    [
      {name:'employer',label:t('Employer or income source','Empleador o fuente de ingresos'),required:true,autoComplete:'organization'},
      {name:'jobTitle',label:t('Job title','Cargo'),autoComplete:'organization-title'},
      {name:'income',label:t('Monthly income ($)','Ingresos mensuales ($)'),type:'number',required:true},
      {name:'employedSince',label:t('Employed since','Fecha de inicio de empleo'),type:'date'},
    ],
    [
      {name:'prevLandlord',label:t('Previous landlord name','Nombre del arrendador anterior')},
      {name:'prevLandlordPhone',label:t('Landlord phone','Teléfono del arrendador'),type:'tel'},
      {name:'reasonLeaving',label:t('Reason for leaving','Motivo de mudanza'),type:'textarea',wide:true},
    ],
    [
      {name:'property',label:t('Preferred community','Comunidad preferida'),type:'select',wide:true,required:true,options:[...options(communities),{value:'No preference, recommend one for me',label:t('No preference, help me choose','Sin preferencia, ayúdenme a elegir')}]},
      {name:'unitType',label:t('Preferred layout','Distribución preferida'),type:'select',required:true,options:options(['1 Bed · 1 Bath','2 Bed · 1 Bath','2 Bed · 2 Bath','2 Bed · 2.5 Bath','3 Bed · 2 Bath','3 Bed · 2.5 Bath'])},
      {name:'moveIn',label:t('Earliest move in date','Primera fecha de mudanza'),type:'date',required:true},
      {name:'budget',label:t('Monthly rent budget ($)','Presupuesto mensual de renta ($)'),type:'number'},
      {name:'notes',label:t('Anything else we should know?','¿Algo más que debamos saber?'),type:'textarea',wide:true},
    ],
  ];
  useEffect(() => {
    if (initialRender.current) { initialRender.current = false; return; }
    title.current?.focus();
  }, [step,submitted]);

  function change(name: ApplicationFieldName, value: string) {
    setData(current => ({...current,[name]:value}));
    setErrors(current => ({...current,[name]:undefined}));
    setFailure('');
  }
  function next() {
    const allErrors = validateApplication(data,es);
    const currentErrors = Object.fromEntries(APPLICATION_STEP_FIELDS[step].filter(name => allErrors[name]).map(name => [name,allErrors[name]]));
    setErrors(currentErrors);
    if (Object.keys(currentErrors).length) { setTimeout(() => document.getElementById(`application-${Object.keys(currentErrors)[0]}`)?.focus(),0); return; }
    setStep(step+1);setVisited(Math.max(visited,step+1));
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (step < 5) { next(); return; }
    if (inFlight.current) return;
    const allErrors = validateApplication(data,es);
    setErrors(allErrors);
    if (Object.keys(allErrors).length) {
      const invalidStep = APPLICATION_STEP_FIELDS.findIndex(names => names.some(name => allErrors[name]));
      if (invalidStep >= 0) setStep(invalidStep);
      return;
    }
    inFlight.current = true;setSending(true);setFailure('');
    try {
      const response = await fetch('/api/apply',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data, firstName:data.firstName.trim(),lastName:data.lastName.trim(),email:data.email.trim(),phone:data.phone.trim()})});
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || t('Your application could not be sent. Please try again or call the office.','No se pudo enviar su solicitud. Intente de nuevo o llame a la oficina.'));
      setReference(result.leadId || result.id || '');setSubmitted(true);
    } catch (error) { setFailure(error instanceof Error ? error.message : t('Please try again or call the office.','Intente de nuevo o llame a la oficina.')); }
    finally { inFlight.current = false;setSending(false); }
  }
  if (submitted) return <div className="application-success"><span className="application-success-mark" aria-hidden="true">✓</span><p className="application-eyebrow">{t('Sent to our leasing team','Enviado al equipo de arrendamiento')}</p><h2 ref={title} tabIndex={-1}>{t('Application received.','Solicitud recibida.')}</h2><p>{t('Thank you for applying. Our leasing team will review your information and contact you about next steps.','Gracias por su solicitud. El equipo revisará su información y se comunicará con usted sobre los siguientes pasos.')}</p>{reference && <p>{t('Your reference','Su referencia')} <strong>{reference}</strong></p>}<a className="application-primary" href={es ? '/es' : '/'}>{t('Back to the website','Volver al sitio')}</a></div>;

  return <div className="application-layout">
    <aside className="application-sidebar"><p className="application-eyebrow">{t('Your application','Su solicitud')}</p><ol>{steps.map((label,index) => <li key={label}><button type="button" disabled={index>visited || sending} aria-current={index===step ? 'step' : undefined} onClick={() => {setStep(index);setErrors({});}}><span>{index<step ? '✓' : index+1}</span>{label}</button></li>)}</ol><div className="application-help"><strong>{t('A question along the way?','¿Tiene alguna pregunta?')}</strong><p>{t('Our local leasing team can help.','Nuestro equipo local puede ayudarle.')}</p><a href="tel:8322103968">(832) 210 3968</a></div></aside>
    <form className="application-card" onSubmit={submit} noValidate>
      <p className="application-eyebrow">{t('Step','Paso')} {step+1} {t('of','de')} 6</p><progress value={step+1} max={6} aria-label={t('Application progress','Progreso de la solicitud')} />
      <h2 ref={title} tabIndex={-1}>{steps[step]}</h2>
      <p className="application-step-note">{step===3 ? t('First time renter? You can leave these fields blank.','¿Es su primera renta? Puede dejar estos campos en blanco.') : step===5 ? t('Check each section below. You can edit your details before sending.','Revise cada sección. Puede editar sus datos antes de enviar.') : t('Fields marked * are required.','Los campos marcados con * son obligatorios.')}</p>
      {failure && <div className="application-error-banner" role="alert">{failure} <a href="tel:8322103968">{t('Call the office','Llamar a la oficina')}</a></div>}
      <fieldset disabled={sending}>
      {step<5 ? <div className="application-fields">{fields[step].filter(field => field.name!=='petDesc' || data.pets==='yes').map(field => {
        const id=`application-${field.name}`;
        const shared={id,name:field.name,value:data[field.name],required:field.required,'aria-invalid':!!errors[field.name],'aria-describedby':errors[field.name] ? `${id}-error` : undefined,onChange:(event:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>change(field.name,event.target.value)};
        return <div key={field.name} className={field.wide ? 'application-field wide' : 'application-field'}><label htmlFor={id}>{field.label}{field.required && <span> *</span>}</label>{field.type==='select' ? <select {...shared}><option value="">{t('Choose an option','Elija una opción')}</option>{field.options?.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select> : field.type==='textarea' ? <textarea {...shared} rows={3} maxLength={4000} /> : <input {...shared} type={field.type||'text'} autoComplete={field.autoComplete} maxLength={field.type==='number'||field.type==='date' ? undefined : 300} min={field.type==='number' ? '0.01' : undefined} step={field.type==='number' ? '0.01' : undefined} inputMode={field.type==='number' ? 'decimal' : undefined} />}{errors[field.name] && <p id={`${id}-error`} className="application-field-error" role="alert">{errors[field.name]}</p>}</div>;
      })}</div> : <div>{fields.map((group,index)=><section key={index} className="application-review"><div className="application-review-heading"><h3>{steps[index]}</h3><button type="button" onClick={()=>setStep(index)} aria-label={`${t('Edit','Editar')} ${steps[index]}`}>{t('Edit','Editar')}</button></div><dl>{group.filter(field=>field.name!=='petDesc'||data.pets==='yes').map(field=><div key={field.name}><dt>{field.label}</dt><dd>{field.options?.find(option=>option.value===data[field.name])?.label || data[field.name] || t('Not provided','No proporcionado')}</dd></div>)}</dl></section>)}<label className="application-consent"><input type="checkbox" checked={data.consent} onChange={event=>{setData(current=>({...current,consent:event.target.checked}));setErrors(current=>({...current,consent:undefined}));}} /><span>{t('I authorize Yellowstone Asset Management to verify the information above, including credit history, rental history, employment and background. I understand the $40 application fee is non refundable. Equal Housing Opportunity.','Autorizo a Yellowstone Asset Management a verificar la información anterior, incluyendo historial de crédito, historial de renta, empleo y antecedentes. Entiendo que la cuota de aplicación de $40 no es reembolsable. Igualdad de Oportunidades de Vivienda.')}</span></label>{errors.consent && <p role="alert" className="application-field-error">{errors.consent}</p>}</div>}
      </fieldset>
      <div className="application-controls"><button type="button" className="application-back" disabled={step===0||sending} onClick={()=>{setStep(step-1);setErrors({});}}>{t('Back','Atrás')}</button><button type="submit" className="application-primary" disabled={sending}>{sending ? t('Sending application…','Enviando solicitud…') : step===5 ? t('Submit application','Enviar solicitud') : t('Continue','Continuar')} <span aria-hidden="true">→</span></button></div>
      <p className="application-privacy"><a href="/privacy">{t('Privacy policy','Política de privacidad')}</a> · {t('Submitting an application does not reserve a home or guarantee approval.','Enviar una solicitud no reserva una vivienda ni garantiza aprobación.')}</p>
    </form>
  </div>;
}
