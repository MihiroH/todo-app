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
      v-for="(suggestion, index) in suggestionList"
      :key="index"
      :class="$style.item"
    ) {{ suggestion }}
</template>

<script>
import BaseInput from '@/components/BaseInput'

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
      month: {
        number: [
          '12',
          '11',
          '10',
          '9',
          '8',
          '7',
          '6',
          '5',
          '4',
          '3',
          '2',
          '1'
        ],
        English: [
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
      },
      week: [
        '日',
        '月',
        '火',
        '水',
        '木',
        '金',
        '土',
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
      ],
      exception: [
        'tomorrow',
        'day after tomorrow'
      ],
      expectedMonth: '',
      expectedDate: '',
      expectedDayOfWeek: '',
      expectedException: '',
      errorFlg: false
    }
  },
  computed: {
    suggestionList() {
      console.log(`${this.expectedMonth}${this.expectedDate} (${this.expectedDayOfWeek})`)
      const params = {}
      if (this.expectedMonth) params.month = this.expectedMonth
      if (this.expectedDate) params.date = this.expectedDate
      this.compareWithToday(params)
      console.log(`${this.expectedMonth}${this.expectedDate}, ${this.expectedYear} (${this.expectedDayOfWeek})`)
      const date = `${this.expectedMonth}${this.expectedDate} (${this.expectedDayOfWeek})`
      const array = [this.expectedException]

      if (date !== ' ()') array.unshift(date)

      return array
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
      if (/from /g.test(value)) {
        this.openSuggestionList()
        this.guessAll(value)
        return
      }
      this.closeSuggestionList()
    },
    zeroSuppress(value) {
      return value.replace(/^0+/, '')
    },
    guessAll(value) {
      const valueWithRemovedPreposition = value.replace(/from |to /g, '')
      const formatValue = this.zeroSuppress(valueWithRemovedPreposition)

      this.guessMonth(formatValue.replace(/on /g, ''))
      this.guessDate(formatValue.replace(/on /g, ''))
    },
    guessMonth(value) {
      const month = this.month.number
      const length = month.length

      for (let i = 0; i < length; i=(i+1)|0) {
        const reg = new RegExp(`^${month[i]}.*$`, 'i')
        const matchedMonth = value.match(reg)

        if (matchedMonth) {
          const separation = /^\d/.test(month[i]) ? '/' : ' '
          this.expectedMonth = this.zeroSuppress(`${month[i]}${separation}`)
          break
        }

      }
    },
    guessDate(value) {
      const valueWithMonthRemoved = value.replace(/^(1[0-2]|[1-9])./, '')
      const valueWithOtherThanNumbersRemoved = valueWithMonthRemoved.replace(/\D/g, '')
      const suffixObj = {
        1: 'st',
        2: 'nd',
        3: 'rd',
        other: 'th'
      }
      let suffix = ''

      if (valueWithOtherThanNumbersRemoved < 1) return
      if (valueWithOtherThanNumbersRemoved > 31) return

      if (/^\D/.test(value)) {
        suffix = suffixObj.hasOwnProperty(valueWithOtherThanNumbersRemoved)
          ? suffixObj[valueWithOtherThanNumbersRemoved]
          : suffixObj['other']
      }

      this.expectedDate = this.zeroSuppress(`${valueWithOtherThanNumbersRemoved}${suffix}`)
    },
    getDate(date) {
      const _date = date === 'today'
        ? new Date()
        : new Date(date.year, date.month - 1, date.date)
      return {
        year: _date.getFullYear(),
        month: _date.getMonth() + 1,
        date: _date.getDate(),
        dayOfWeek: ['日', '月', '火', '水', '木', '金', '土'][_date.getDay()]
      }
    },
    compareWithToday(target) {
      if (!Object.keys(target).length) return

      const today = this.getDate('today')
      const hasYear = target.hasOwnProperty('year') ? true : false
      const hasMonth = target.hasOwnProperty('month') ? true : false
      const targetYear = hasYear ? target.year : today.year
      const targetMonth = hasMonth ? target.month : today.month
      const todayObj = new Date(today.year, today.month, today.date)
      const targetObj = new Date(targetYear, targetMonth, target.date)
      console.log(todayObj.getTime() , targetObj.getTime())

      if (todayObj.getTime() < targetObj.getTime()) {
        return this.expectedYear = targetYear
      }
      if (hasYear && !hasMonth) {
        return this.errorFlg = true
      }
      if (hasYear && hasMonth) {
        return this.errorFlg = true
      }
      if (!hasYear && hasMonth) {
        this.expectedYear = targetYear + 1
      }
      if (!hasYear && !hasMonth) {
        if (targetMonth === 12) {
          this.expectedYear = targetYear + 1
          this.expectedMonth = 1
          return
        }
        this.expectedMonth = targetMonth + 1
      }
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
  background rgba(#111, .8)
  border 2px solid #9acd32
  position absolute
  top 100%
  left -2px
  right 0
  width 100%
  z-index 10
.item
  padding 10px
  &:not(:first-child)
    border-top 1px solid #9acd32
</style>

