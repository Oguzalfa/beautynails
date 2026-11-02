import { services } from '../config/site'

function Spark() {
  return (
    <svg className="bn-spark" viewBox="0 0 16 16" aria-hidden="true">
      <path fill="currentColor" d="M8 0.5 9.1 6.9 15.5 8 9.1 9.1 8 15.5 6.9 9.1 0.5 8 6.9 6.9Z" />
    </svg>
  )
}

export function CategoryStrip() {
  return (
    <nav className="bn-strip" aria-label="Hizmet grupları">
      <ul>
        {services.map((service, index) => (
          <li key={service.id}>
            {index > 0 ? <Spark /> : null}
            <a href={`#${service.id}`}>{service.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
