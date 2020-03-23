<template lang="pug">
div(:class="[$style.wrap, { [$style['is-active']]: isVisible }]")
  BaseInput(
    v-model="text"
    type="text"
    :class="$style.input"
    @input="handleInput"
    @input-end="end"
    @shortcut_key-meta-enter="end"
  )
  ul(
    v-if="isVisible"
    :class="$style.list"
  )
    li(
      v-for="(dateObj, index) in suggestionDateList"
      :key="index"
      :class="[$style.item, { [$style.invalid]: invalid(dateObj.valid) }]"
    ) {{ formatDate(dateObj) }}
      span(:class="$style.preposition") {{ dateObj.preposition }}
      span(:class="$style.dayOfWeek") {{ dateObj.dayOfWeek }}
</template>

<script>
import BaseInput from '@/components/BaseInput'

import getLangByBrowserLang from '@/utils/getLangByBrowserLang'

export default {
  name: 'InputSuggest',
  components: {
    BaseInput
  },
  data() {
    return {
      text: '',
      isVisible: false,
      today: {
        year: null,
        month: null,
        date: null,
        dayOfWeek: null
      },
      exception: [
        'tomorrow',
        'day after tomorrow'
      ],
      errorFlg: false,
      fromDateList: [],
      toDateList: [],
    }
  },
  computed: {
    suggestionDateList() {
      return [
        ...this.fromDateList,
        ...this.toDateList
      ]
    },
    formatDate() {
      return dateObj => {
        if (!dateObj) return ''
        if (!Object.keys(dateObj).length) return ''

        if (dateObj.valid) {
          return `${dateObj.month}/${dateObj.date}, ${dateObj.year}`
        }
        return '無効な日付です'
      }
    },
    invalid() {
      return bool => {
        return !bool
      }
    }
  },
  methods: {
    end() {
      this.$emit('input-end')
    },
    openSuggestionList() {
      if (this.isVisible) return

      this.today = this.getDate('today')
      this.expectedException = 'today'
      this.isVisible = true
    },
    closeSuggestionList() {
      this.isVisible = false
    },
    checkValue(value) {
      if (/from |to /g.test(value)) {
        this.openSuggestionList()
        this.array = this.startGuess(value)
        return
      }
      this.closeSuggestionList()
    },
    zeroSuppress(value) {
      return value.replace(/^0+/, '')
    },
    startGuess(value) {
      if (/from /g.test(value)) {
        this.fromDateList = this.guessFromTo('from', value.split('from ')[1])
      }
      if (/to /g.test(value)) {
        this.toDateList = this.guessFromTo('to', value.split('to ')[1])
      }
    },
    guessFromTo(preposition, value) {
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
        dateObj = Object.assign(dateObj, this.getDate(dateObj))
        dateObj.preposition = preposition === 'from' ? 'From' : 'To'
        // console.log(dateObj)
        resultList.push(dateObj)
      })

      return resultList
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
    getDate(date) {
      const _date = date === 'today'
        ? new Date()
        : new Date(date.year, date.month - 1, date.date)
      const dayOfWeekList = getLangByBrowserLang() === 'ja'
        ? ['日', '月', '火', '水', '木', '金', '土']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      return {
        year: _date.getFullYear(),
        month: _date.getMonth() + 1,
        date: _date.getDate(),
        dayOfWeek: dayOfWeekList[_date.getDay()]
      }
    },
    getDateWithMonthAbbreviation(value) {
      const val = value.replace(/(,|\s)+/g, ' ')
      const dateArray = val.split(/\s/, 3)
      const _month = dateArray[0]
      const _date = dateArray[1]
        ? Number(dateArray[1].replace(/(th|st|nd|rd)/, ''))
        : this.today.date
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
      const _date = Number(dateArray[2]) || this.today.date

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
      const _date = Number(dateArray[1]) || this.today.date

      if (!this.isMonth(_month)) return {}
      if (!this.isDate(_date)) return {}

      console.log({
        month: _month,
        date: _date
      })
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

      console.log(_date)
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

      const today = this.getDate('today')
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

      if (todayObj.getTime() < targetObj.getTime()) {
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
      if (resultObj.getTime() < todayObj.getTime()) {
        results.valid = false
      }

      results.date = targetDate

      return results
    },
    handleInput(newValue) {
      this.checkValue(newValue)
      this.$emit('input', newValue)
    }
  }
}
</script>

<style lang="stylus" module>
.wrap
  position relative
  &.is-active
    border-bottom-left-radius initial
    border-bottom-right-radius @border-bottom-left-radius
.list
  border-bottom-left-radius 25px
  border-bottom-right-radius @border-bottom-left-radius
  box-sizing content-box
  background #111
  border 2px solid #9acd32
  position absolute
  top 100%
  left -2px
  right 0
  width 100%
  z-index 10
.item
  padding 10px
  position relative
  &:not(:first-child)
    border-top 1px solid #9acd32
  &.invalid
    color #df5656
    .preposition
      color inherit
    .dayOfWeek
      display none
.preposition
  position absolute
  top 50%
  left 20px
  transform translateY(-50%)
  color rgba(#fff, .8)
.dayOfWeek
  position absolute
  top 50%
  right 20px
  transform translateY(-50%)
  color rgba(#fff, .8)
</style>

