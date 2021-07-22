import { getLangByBrowserLang } from '@/utils/getLangByBrowserLang'
import { zeroPadding } from '@/utils/zeroPadding'

export const getDate = date => {
  const hours = date.hours || '00'
  const minutes = date.minutes || '00'
  const _date = date === 'today'
    ? new Date()
    : new Date(date.year, date.month - 1, date.date, hours, minutes)
  const dayOfWeekList = getLangByBrowserLang() === 'ja'
    ? ['日', '月', '火', '水', '木', '金', '土']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return {
    year: _date.getFullYear(),
    month: zeroPadding(_date.getMonth() + 1, 2),
    date: zeroPadding(_date.getDate(), 2),
    hours: zeroPadding(_date.getHours(), 2),
    minutes: zeroPadding(_date.getMinutes(), 2),
    dayOfWeek: dayOfWeekList[_date.getDay()]
  }
}

export const getToday = () => {
  return getDate('today')
}

