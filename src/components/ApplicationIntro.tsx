export default function ApplicationIntro({ es = false }: { es?: boolean }) {
  return <section className="application-teaser" id={es ? 'aplicar' : 'apply'}>
    <div><p className="application-eyebrow">{es ? 'Su próximo hogar' : 'Your next home'}</p><h2>{es ? 'Una solicitud, todo en un lugar.' : 'Your application, all in one place.'}</h2><p>{es ? 'Complete sus datos, elija su comunidad y revise todo antes de enviar.' : 'Tell us about yourself, choose a community and review your details before sending.'}</p></div>
    <a className="application-primary" href={es ? '/es/apply' : '/apply'}>{es ? 'Comenzar solicitud' : 'Start your application'} <span aria-hidden="true">→</span></a>
  </section>;
}
