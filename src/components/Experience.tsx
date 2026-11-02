import { experienceHighlights } from '../config/site'

function Icon({ name }: { name: string }) {
  if (name === 'diamond') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 9.5 12 21 21 9.5 17 4H7L3 9.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }
  if (name === 'heart') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19.5s-6.5-4.1-6.5-8.2A3.6 3.6 0 0 1 12 8.4a3.6 3.6 0 0 1 6.5 2.9c0 4.1-6.5 8.2-6.5 8.2Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.5 19.2c1.2-3 3.5-4.4 6.5-4.4s5.3 1.4 6.5 4.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function Experience() {
  return (
    <section id="deneyim" className="bn-section bn-experience">
      <div className="bn-container bn-experience__grid">
        <div>
          <p className="bn-font-label">Deneyimimiz</p>
          <h2 className="bn-font-section">
            <span>Size <em className="bn-font-display">özel</em> ilgi.</span>
          </h2>
          <p className="bn-font-body">
            Güzelliğiniz için kişiselleştirilmiş bakım, uzman dokunuşlar ve premium bir deneyim.
          </p>
          <ul className="bn-benefits">
            {experienceHighlights.map((item) => (
              <li key={item.title} className="bn-benefit">
                <span className="bn-benefit__icon"><Icon name={item.icon} /></span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bn-scene" aria-hidden="true">
          <img className="bn-decor-float" src="/images/bn/experience-glass.webp" alt="" width={1024} height={682} />
        </div>
      </div>
    </section>
  )
}
