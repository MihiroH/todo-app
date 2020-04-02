import { getDate, getToday } from '@/utils/getDate'

const guess = {
  init(preposition, value) {
    const val = this.zeroSuppress(value)

    const resultList = []
    const patternList = [
      'monthAbbreviationAndDD',
      'YYYYMMDD',
      'MMDD',
      'DD'
    ]
    patternList.forEach(pattern => {
      let dateObj = Object.assign({}, this.getDateTime(pattern, val))
      if (!Object.keys(dateObj).length) return

      dateObj = this.compareWithToday(dateObj)
      dateObj = Object.assign(dateObj, getDate(dateObj))

      const formatObj = {
        textContent: this.formatDate(dateObj),
        label: preposition,
        supplement: getDate(dateObj).dayOfWeek,
        invalid: !dateObj.valid,
        dateObj: dateObj
      }
      resultList.push(formatObj)
    })

    const today = Object.assign({ valid: true }, getToday())
    const todayObj = {
      textContent: this.formatDate(today),
      label: preposition,
      supplement: getToday().dayOfWeek,
      invalid: false,
      dateObj: today
    }

    return resultList.length ? resultList : [todayObj]
  },
  zeroSuppress(value) {
    return value.replace(/^0+/, '')
  },
  formatDate(dateObj) {
    if (!dateObj) return ''
    if (!Object.keys(dateObj).length) return ''

    if (dateObj.valid) {
      return `${dateObj.year}/${dateObj.month}/${dateObj.date}`
    }
    return '無効な日付です'
  },
  getDateTime(pattern, value) {
    if (!pattern) return
    if (!value) return

    if (pattern === 'monthAbbreviationAndDD') return this.getDateWithMonthAbbreviation(value)
    if (pattern === 'YYYYMMDD') return this.getDateWithYYMMDD(value)
    if (pattern === 'MMDD') return this.getDateWithMMDD(value)
    if (pattern === 'DD') return this.getDateWithDD(value)

    return {}
  },
  getDateWithMonthAbbreviation(value) {
    const val = value.replace(/(,|\s)+/g, ' ')
    const dateArray = val.split(/\s/, 3)
    const _month = dateArray[0]
    const _date = dateArray[1]
      ? Number(dateArray[1].replace(/(th|st|nd|rd)/, ''))
      : getToday().date
    const _year = Number(dateArray[2])
    const results = {}

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]
    const monthsLength = months.length
    for (let i = 0; i < monthsLength; i=(i+1)|0) {
      const regex = new RegExp(`^${months[i]}`, 'i')
      if (regex.test(_month)) {
        results.month = i + 1
        break
      }
    }

    if (!results.hasOwnProperty('month')) return results

    if (1 <= _date && _date <= 31) results.date = _date
    if (this.isYear(_year)) results.year = _year

    return results
  },
  getDateWithYYMMDD(value) {
    const val = value.replace(/(\/|\s)+/g, ' ')
    const dateArray = val.split(/\s/, 3)
    const _year = Number(dateArray[0])
    const _month = Number(dateArray[1])
    const _date = Number(dateArray[2]) || getToday().date

    if (!this.isYear(_year)) return {}
    if (!this.isMonth(_month)) return {}
    if (!this.isDate(_date)) return {}

    return {
      year: _year,
      month: _month,
      date: _date
    }
  },
  getDateWithMMDD(value) {
    const val = value.replace(/(\/|\s)+/g, ' ')
    const dateArray = val.split(/\s/, 2)
    const _month = Number(dateArray[0])
    const _date = Number(dateArray[1]) || getToday().date

    if (!this.isMonth(_month)) return {}
    if (!this.isDate(_date)) return {}

    return {
      month: _month,
      date: _date
    }
  },
  getDateWithDD(value) {
    const test = value.match(/^\d{1,2}$/)
    const _date = test ? test[0] : 0

    if (!_date) return {}
    if (!this.isDate(_date)) return {}

    return {
      date: _date
    }
  },
  isYear(value) {
    const _number = Number(value)
    if (/^[0-9]{4}$/.test(_number)) return true
    return false
  },
  isMonth(value) {
    if (!value) return false

    const valueWithSlashRemoved = String(value).replace(/\/$/, '')
    if (/^([1-9]|1[0-2])$/.test(valueWithSlashRemoved)) return true

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]
    const monthsLength = months.length
    let existMonth = false
    for (let i = 0; i < monthsLength; i=(i+1)|0) {
      const regex = new RegExp(`^${months[i]}`, 'ig')
      if (regex.test(value)) {
        existMonth = true
        break
      }
    }

    if (existMonth) return true
    return false
  },
  isDate(value) {
    const _number = Number(value)
    if (!_number) return false
    if (_number < 1) return false
    if (_number > 31) return false
    return true
  },
  compareWithToday(target) {
    if (!Object.keys(target).length) return {}

    const today = getToday()
    const hasYear = target.hasOwnProperty('year') ? true : false
    const hasMonth = target.hasOwnProperty('month') ? true : false
    const hasDate = target.hasOwnProperty('date') ? true : false
    const targetYear = hasYear ? target.year : today.year
    const targetMonth = hasMonth ? target.month : today.month
    const targetDate = hasDate ? target.date : today.date
    const todayObj = new Date(today.year, today.month, today.date)
    const targetObj = new Date(targetYear, targetMonth, targetDate)

    const results = {
      year: targetYear,
      month: targetMonth,
      date: targetDate,
      valid: true
    }

    if (todayObj.getTime() <= targetObj.getTime()) {
      return results
    }

    if (!hasYear && hasMonth) {
      results.year = targetYear + 1
    }

    if (!hasYear && !hasMonth) {
      if (targetMonth === 12) {
        results.year = targetYear + 1
        results.month = 1
      } else {
        results.month = targetMonth + 1
      }
    }

    const resultObj = new Date(results.year, results.month, results.date)
    if (resultObj.getTime() <= todayObj.getTime()) {
      results.valid = false
    }

    results.date = targetDate

    return results
  }
}

export const suggestDateFromTo = (preposition, value) => {
  const list = guess.init.call(guess, preposition, value)
  return list
}
