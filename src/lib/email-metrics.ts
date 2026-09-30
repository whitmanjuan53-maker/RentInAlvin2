export interface DeliverySummaryInput {
  sent: number;
  delivered: number;
  bounced: number;
}

export interface DeliverySummary {
  rate: string;
  hint: string | undefined;
  pending: number;
}

/**
 * A delivery percentage should only use emails with a confirmed outcome.
 * Provider-accepted emails remain pending until a delivery or bounce webhook
 * arrives, so they must not be presented as failed deliveries.
 */
export function getDeliverySummary({ sent, delivered, bounced }: DeliverySummaryInput): DeliverySummary {
  const pending = Math.max(sent - delivered - bounced, 0);
  const confirmed = delivered + bounced;
  const rate = confirmed > 0 ? `${Math.round((delivered / confirmed) * 100)}%` : pending > 0 ? 'Pending' : '—';
  const details = [
    delivered > 0 ? `${delivered} confirmed` : '',
    pending > 0 ? `${pending} awaiting confirmation` : '',
    bounced > 0 ? `${bounced} bounced` : '',
  ].filter(Boolean);

  return { rate, hint: details.length ? details.join(' · ') : undefined, pending };
}
