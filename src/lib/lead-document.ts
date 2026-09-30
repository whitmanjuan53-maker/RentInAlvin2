import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';

export interface ExportLead {
  id: string;
  createdAt: Date;
  leadType: string;
  name: string;
  email: string | null;
  phone: string | null;
  property: string | null;
  status: string;
  message: string | null;
  sourcePage: string | null;
  metadata: string | null;
}

const labels: Record<string, string> = {
  booking: 'Tour booking', contact: 'Contact', property_inquiry: 'Property sale',
  application_interest: 'Application', newsletter: 'Newsletter', other: 'Other',
};
const detailLabels: Record<string, string> = {
  date: 'Tour date', time: 'Tour time', moveBy: 'Move-in timeframe', moveIn: 'Move-in date',
  bedrooms: 'Bedrooms', unitType: 'Unit type', propertyType: 'Property type',
  beds: 'Beds', baths: 'Baths', sqft: 'Square feet', timeline: 'Timeline',
};

function field(label: string, value: string | null): Paragraph {
  const lines = (value || '—').split(/\r?\n/);
  return new Paragraph({
    spacing: { after: 100 },
    children: [new TextRun({ text: `${label}: `, bold: true }),
      ...lines.map((text, index) => new TextRun({ text, ...(index ? { break: 1 } : {}) }))],
  });
}

export async function buildLeadDocument(leads: ExportLead[], generatedAt = new Date()): Promise<Buffer> {
  const date = (value: Date) => value.toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short' });
  const children: Paragraph[] = [
    new Paragraph({ text: 'RentInAlvin — All Leads', heading: HeadingLevel.TITLE }),
    new Paragraph({ text: `Generated ${date(generatedAt)} (Central Time) • ${leads.length} leads • All dates`, spacing: { after: 300 } }),
  ];
  if (!leads.length) children.push(new Paragraph('No leads have been saved yet.'));
  for (const [index, lead] of leads.entries()) {
    children.push(
      new Paragraph({ text: `${index + 1}. ${lead.name}`, heading: HeadingLevel.HEADING_1, keepNext: true }),
      field('Received', `${date(lead.createdAt)} (Central Time)`),
      field('Type', labels[lead.leadType] || lead.leadType),
      field('Email', lead.email), field('Phone', lead.phone), field('Property', lead.property),
      field('Status', lead.status), field('Message / notes', lead.message),
    );
    try {
      const details = JSON.parse(lead.metadata || '{}');
      for (const [key, label] of Object.entries(detailLabels)) {
        if (typeof details?.[key] === 'string' || typeof details?.[key] === 'number') {
          children.push(field(label, String(details[key])));
        }
      }
    } catch { /* Old malformed metadata must not prevent exporting the lead. */ }
    children.push(field('Source', lead.sourcePage), field('Lead ID', lead.id));
  }
  return Packer.toBuffer(new Document({
    creator: 'RentInAlvin', title: 'All Leads — RentInAlvin',
    styles: { default: { document: { run: { font: 'Calibri', size: 22 } } } },
    sections: [{ properties: { page: { margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } }, children }],
  }));
}
