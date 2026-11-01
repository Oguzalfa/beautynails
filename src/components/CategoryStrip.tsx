const items = ['Tırnak Sanatı', 'İpek Kirpik', 'Kalıcı Makyaj', 'Kaş & Yüz']

function Sparkle() {
  return (
    <svg className="category-strip__sep" viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 0.6c.2 2.7 1.5 4.5 3.7 5.4C9.5 7 8.2 8.8 8 11.5 7.8 8.8 6.5 7 4.3 6 6.5 5.1 7.8 3.3 8 .6Z"
      />
      <path
        fill="currentColor"
        opacity="0.7"
        d="M13.2 9.2c.1 1.2.7 2 1.7 2.4-1 .4-1.6 1.2-1.7 2.4-.1-1.2-.7-2-1.7-2.4 1-.4 1.6-1.2 1.7-2.4Z"
      />
    </svg>
  )
}

export function CategoryStrip() {
  return (
    <div className="category-strip" aria-label="Hizmet kategorileri">
      <ul>
        {items.map((item, i) => (
          <li key={item}>
            {i > 0 ? <Sparkle /> : null}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
