(() => {
  const routes = { tr: '/', en: '/en/', de: '/de/', ar: '/ar/', ru: '/ru/', uz: '/uz/', tk: '/tk/' }
  const preferenceKey = 'sazi-language'
  const visitedKey = 'sazi-language-visited'

  function closePickers(except) {
    document.querySelectorAll('.sz-language[open]').forEach(picker => {
      if (picker !== except) picker.open = false
    })
  }

  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null
    const link = target?.closest('a[data-site-language]')
    if (link && Object.hasOwn(routes, link.dataset.siteLanguage)) {
      try { localStorage.setItem(preferenceKey, link.dataset.siteLanguage) } catch { /* The link works without storage. */ }
    } else {
      closePickers(target?.closest('.sz-language'))
    }
  })

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return
    const picker = document.activeElement?.closest('.sz-language[open]')
    if (picker) {
      picker.open = false
      picker.querySelector('summary')?.focus()
    }
  })

  // Keep each localized URL directly accessible. Select a language only on entry at the root.
  if (location.pathname !== '/' || location.hash || location.search) return
  let language
  try {
    language = localStorage.getItem(preferenceKey)
    if (!Object.hasOwn(routes, language)) {
      if (sessionStorage.getItem(visitedKey)) return
      const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language]
      language = browserLanguages
        .map(tag => tag.toLowerCase().split(/[-_]/, 1)[0])
        .find(tag => Object.hasOwn(routes, tag))
      sessionStorage.setItem(visitedKey, '1')
    }
  } catch {
    return
  }
  if (language && language !== 'tr') location.replace(routes[language])
})()
