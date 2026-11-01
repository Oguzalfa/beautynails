import { experienceHighlights } from '../config/site'

export function Experience() {
  return (
    <section id="deneyim" className="experience section">
      <p className="eyebrow">DENEYİM</p>
      <h2 className="section-title">Size özel ilgi. Her detayda özen.</h2>
      <p className="experience__lead">
        Kendinize ayırdığınız zamanı, özenle tasarlanan bir güzellik deneyimine dönüştürün.
      </p>
      <ul className="experience__list">
        {experienceHighlights.map((item) => (
          <li key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
