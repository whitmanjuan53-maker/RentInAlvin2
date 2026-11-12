// Keep punctuation in public copy consistent, including content from the manager.
export function cleanWebsiteText(text: string, locale: 'en' | 'es' = 'en'): string {
  const range = locale === 'es' ? ' a ' : ' to ';
  return text.split(/(https?:\/\/[^\s<>]+|[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\+1[- ]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4})/gi)
    .map((part, index) => index % 2 ? (/@|https?:/.test(part) ? part : part.replace(/-/g, ' ')) : part
    .replace(/\s*[–]\s*/g, range)
    .replace(/\s*(?:—|&mdash;)\s*/g, ', ')
    .replace(/\s*&ndash;\s*/g, range)
    .replace(/(?<=[A-Za-z])-(?=[A-Za-z])/g, ' ')
    .replace(/(?<=[A-Za-z])-(?=\d)/g, ' ')
    .replace(/(?<=\d)-(?=[A-Za-z])/g, ' ')
    .replace(/(?<=[A-Za-z])-(?=\s)/g, '')
    .replace(/(?<=\d)\s*-\s*(?=\d)/g, range))
    .join('');
}
