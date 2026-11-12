'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { answerLeasingQuestion, ChatAnswer, ChatProperty } from '@/lib/leasing-chat';
import { COMMUNITIES } from '@/lib/data';

interface Message extends ChatAnswer { id: number; role: 'assistant' | 'user'; }

export default function LeasingChat() {
  const pathname = usePathname();
  const locale = pathname.startsWith('/es') || pathname.startsWith('/vivir') ? 'es' : 'en';
  const es = locale === 'es';
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [properties, setProperties] = useState<ChatProperty[]>(COMMUNITIES);
  const input = useRef<HTMLInputElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  useEffect(() => { setMessages([]); setDraft(''); }, [locale]);
  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const controller = new AbortController();
    fetch('/api/properties', { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Unable to load communities'); return response.json(); })
      .then(data => { if (Array.isArray(data.properties)) setProperties(data.properties); })
      .catch(() => { /* The built-in listing information remains available. */ });
    return () => controller.abort();
  }, [open]);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages]);

  function close() { setOpen(false); launcher.current?.focus(); }
  function ask(question: string) {
    const value = question.trim().slice(0, 500);
    if (!value) return;
    const answer = answerLeasingQuestion(value, locale, properties, messages.filter(message => message.role === 'user').map(message => message.text));
    setMessages(previous => [...previous.slice(-38), { id: nextId.current++, role: 'user', text: value }, { id: nextId.current++, role: 'assistant', ...answer }]);
    setDraft('');
    input.current?.focus();
  }
  function submit(event: FormEvent) { event.preventDefault(); ask(draft); }
  if (/^\/(manager|dev)(\/|$)/.test(pathname) || pathname === '/apply' || pathname === '/es/apply') return null;

  return (
    <aside className="leasing-chat" aria-label={es ? 'Asistente de arrendamiento' : 'Leasing assistant'}>
      {open && <section className="leasing-chat-panel" id="leasing-chat-panel" role="dialog" aria-labelledby="leasing-chat-title" onKeyDown={event => { if (event.key === 'Escape') close(); }}>
        <header className="leasing-chat-header">
          <div><h2 id="leasing-chat-title">{es ? '¿Busca un hogar?' : 'Looking for a home?'}</h2><p>{es ? 'Asistente automático de RentInAlvin' : 'RentInAlvin automated assistant'}</p></div>
          <button type="button" className="leasing-chat-close" onClick={close} aria-label={es ? 'Cerrar chat' : 'Close chat'}>×</button>
        </header>
        <div className="leasing-chat-log" role="log" aria-live="polite" aria-relevant="additions" ref={log}>
          <div className="leasing-chat-bubble assistant">{es ? '¡Hola! Pregunte por rentas de 1, 2 o 3 habitaciones, mascotas, servicios, solicitudes o visitas. También puede indicar una comunidad.' : 'Hi! Ask me about 1, 2 or 3 bedroom rents, pets, utilities, applications or tours. You can also name a community.'}</div>
          {messages.map(message => <div key={message.id} className={`leasing-chat-bubble ${message.role}`}><span className="leasing-chat-sr">{message.role === 'user' ? (es ? 'Usted: ' : 'You: ') : (es ? 'Asistente: ' : 'Assistant: ')}</span>{message.text}{message.href && <a href={message.href}>{message.label}</a>}</div>)}
        </div>
        <div className="leasing-chat-prompts" aria-label={es ? 'Preguntas frecuentes' : 'Suggested questions'}>
          {(es ? ['Renta de 1 habitación', 'Renta de 2 habitaciones', 'Renta de 3 habitaciones', 'Mascotas', 'Servicios incluidos', 'Solicitar visita', 'Aplicar'] : ['1 bedroom rent', '2 bedroom rent', '3 bedroom rent', 'Pets', 'Utilities included', 'Book a tour', 'Apply']).map(question => <button key={question} type="button" onClick={() => ask(question)}>{question}</button>)}
        </div>
        <form className="leasing-chat-form" onSubmit={submit}>
          <label htmlFor="leasing-chat-question" className="leasing-chat-sr">{es ? 'Su pregunta' : 'Your question'}</label>
          <input ref={input} id="leasing-chat-question" value={draft} maxLength={500} onChange={event => setDraft(event.target.value)} placeholder={es ? 'Escriba su pregunta' : 'Type your question'} autoComplete="off" />
          <button type="submit" disabled={!draft.trim()}>{es ? 'Enviar' : 'Send'}</button>
        </form>
        <p className="leasing-chat-note">{es ? 'Para confirmar precios y disponibilidad, ' : 'Confirm current rent and availability with '}<a href="tel:8322103968">{es ? 'llame a la oficina' : 'our leasing team'}</a>.</p>
      </section>}
      <button ref={launcher} type="button" className="leasing-chat-launcher" aria-expanded={open} aria-controls="leasing-chat-panel" onClick={() => open ? close() : setOpen(true)}><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H8l-5 2 1.5-5A8.5 8.5 0 1 1 21 11.5Z" /></svg>{open ? (es ? 'Cerrar chat' : 'Close chat') : (es ? 'Pregúntenos' : 'Ask about a home')}</button>
    </aside>
  );
}
