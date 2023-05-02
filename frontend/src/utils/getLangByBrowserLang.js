// ブラウザの言語設定取得
const getBrowserLang = () => {
  const _language = (window.navigator.languages && window.navigator.languages[0]) || window.navigator.language || window.navigator.userLanguage || window.navigator.browserLanguage

  return _language
}

const convertOriginalLang = lang => {
  if (lang == 'zh' || lang == 'ch') return 'ch'
  if (lang == 'ko' || lang == 'kr') return 'kr'
  if (lang.includes('ja')) return 'ja'
  return 'en'
}

const func = () => convertOriginalLang(getBrowserLang())

export const getLangByBrowserLang = func
