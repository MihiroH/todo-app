<template lang="pug">
div
  VueCtkDateTimePicker(
    v-model="date"
    :no-value-to-custom-elem="true"
    :format="'YYYY-MM-DD HH:mm'"
    :color="themeColor"
    :button-color="themeColor"
    :minute-interval="5"
    :min-date="formatMinDate"
    :right="true"
    @is-shown="handleShown"
    @is-hidden="handleHidden"
  )
    button(
      type="button"
      :class="[$style.btn, {[$style.isDone]: isDone}]"
    )
      img(
        :src="imgSrc"
        :alt="imgAlt"
      )
      span(
        :style="{backgroundColor: themeColor}"
        :class="$style.date"
      ) {{ `${imgAlt}: ${date}` }}
</template>

<script>
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

import { getDate, getToday } from '@/utils/getDate'

export default {
  name: 'Calendar',
  components: {
    VueCtkDateTimePicker
  },
  props: {
    themeColor: {
      type: String,
      required: true
    },
    imgSrc: {
      type: String,
      required: true
    },
    imgAlt: {
      type: String,
      required: true
    },
    minDate: {
      type: String,
      required: false
    },
    currentDate: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formatMinDate: '',
      isDone: false
    }
  },
  computed: {
    date: {
      get () {
        if (Object.keys(this.currentDate).length) {
          return this.$_getFormatDate(this.currentDate)
        }
        return this.$_getFormatDate('today')
      },
      set (newValue) {
        const onlyDate = newValue.split(' ')[0]
        const onlyTime = newValue.split(' ')[1]
        const susfix = newValue.split(' ')[2]
        const [year, month, date] = onlyDate.split('-')
        const [hours, minutes] = onlyTime.split(':')

        const obj = Object.assign(getDate({ year, month, date, hours, minutes }), { susfix })
        this.$emit('calendar-set', obj)
      }
    },
    labelBackgroundColor() {
      if (this.themeColor === '#4eaad4') return 'blue'
      if (this.themeColor === '#df5656') return 'red'
      return 'default'
    }
  },
  async mounted() {
    // mountedされてからminDateを設定しないとVueCtkDateTimePicker側でエラーになることがある
    await this.$nextTick()
    this.$_minDate()
  },
  methods: {
    $_minDate() {
      const target = this.minDate || 'today'
      this.formatMinDate = this.$_getFormatDate(target).split(' ')[0]
    },
    $_getFormatDate(dateObj) {
      const _date = dateObj === 'today' ? getToday() : dateObj
      const year = _date.year
      const month = _date.month
      const date = _date.date
      const hours = _date.hours
      const minutes = _date.minutes
      return `${year}-${month}-${date} ${hours}:${minutes}`
    },
    handleShown() {
      this.isDone = false
    },
    handleHidden() {
      this.isDone = true
      this.$emit('calendar-hidden')
    }
  }
}
</script>

<style lang="stylus" module>
@keyframes scale
  50%
    transform scale(1.5)
  100%
    transform scale(1)
.btn
  background transparent
  position relative
  width 100%
  &:hover
    cursor pointer
    .date
      display block
  &:focus
    outline none
  &.isDone
    animation scale .3s
.date
  display none
  position absolute
  padding 5px 6px
  border-radius 3px
  right calc(100% + 5px)
  bottom 0
  background #333
  color #fff
  font-size 14px
  white-space nowrap
  letter-spacing .05em
</style>
