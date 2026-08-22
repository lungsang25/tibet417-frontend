/**
 * Fails the build if a translation key exists in one locale but not another.
 * i18next's fallbackLng masks this silently at runtime — a page just quietly
 * shows English for the missing key — so nothing else would catch it.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LOCALES_DIR = join(__dirname, '..', 'src', 'i18n', 'locales')
const LANGS = ['en', 'de', 'fr', 'it']

const flatten = (obj, prefix = '') => {
  let keys = []
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      keys = keys.concat(flatten(v, full))
    } else if (Array.isArray(v)) {
      v.forEach((item, i) =>
        item !== null && typeof item === 'object'
          ? (keys = keys.concat(flatten(item, `${full}[${i}]`)))
          : keys.push(`${full}[${i}]`),
      )
    } else {
      keys.push(full)
    }
  }
  return keys
}

const namespaces = readdirSync(join(LOCALES_DIR, 'en')).map((f) => f.replace('.json', ''))

let hasDrift = false
for (const ns of namespaces) {
  const keySets = {}
  for (const lang of LANGS) {
    const path = join(LOCALES_DIR, lang, `${ns}.json`)
    try {
      keySets[lang] = new Set(flatten(JSON.parse(readFileSync(path, 'utf8'))))
    } catch (err) {
      hasDrift = true
      console.error(`✗ ${ns}.json missing or invalid for "${lang}": ${err.message}`)
    }
  }
  const enKeys = keySets.en
  if (!enKeys) continue
  for (const lang of LANGS) {
    if (lang === 'en' || !keySets[lang]) continue
    const missing = [...enKeys].filter((k) => !keySets[lang].has(k))
    const extra = [...keySets[lang]].filter((k) => !enKeys.has(k))
    if (missing.length || extra.length) {
      hasDrift = true
      console.error(`✗ ${ns}.json ("${lang}" vs "en") key drift:`)
      if (missing.length) console.error(`  missing in ${lang}: ${missing.join(', ')}`)
      if (extra.length) console.error(`  extra in ${lang}:   ${extra.join(', ')}`)
    }
  }
}

if (hasDrift) {
  console.error('\ni18n key check failed.')
  process.exit(1)
}
console.log(`✓ i18n keys match across ${LANGS.join('/')} (${namespaces.length} namespaces)`)
