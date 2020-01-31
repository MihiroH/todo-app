<template lang="pug">
div(:class="$style.wrap")
  ClockNumberPanel(
    v-for="(item, index) in 2"
    :key="`hours-${index}`"
    :class="$style.item"
    :number="getNumber(index + 1)"
  )
  Separation(:class="$style.separation")
  ClockNumberPanel(
    v-for="(item, index) in 2"
    :key="`minutes-${index}`"
    :class="$style.item"
    :number="getNumber(index + 3)"
  )
  Separation(:class="$style.separation")
  ClockNumberPanel(
    v-for="(item, index) in 2"
    :key="`seconds-${index}`"
    :class="$style.item"
    :number="getNumber(index + 5)"
  )
</template>

<script>
import ClockNumberPanel from '@/components/ClockNumberPanel';
import Separation from '@/components/Separation'
export default {
  name: 'TheClock',
  components: {
    ClockNumberPanel,
    Separation
  },
  data() {
    return {
      moment: {}
    }
  },
  created() {
    this.getMoment()
  },
  computed: {
    getNumber() {
      return index => {
        const hours = this.moment.hours
        const minutes = this.moment.minutes
        const seconds = this.moment.seconds
        if (!hours) return 0
        if (!minutes) return 0
        if (!seconds) return 0

        let number = 0
        if (index === 1) number = hours.length === 2 ? hours.substr(0, 1) : 0
        if (index === 2) number = hours.length === 2 ? hours.substr(1, 2) : hours
        if (index === 3) number = minutes.length === 2 ? minutes.substr(0, 1) : 0
        if (index === 4) number = minutes.length === 2 ? minutes.substr(1, 2) : minutes
        if (index === 5) number = seconds.length === 2 ? seconds.substr(0, 1) : 0
        if (index === 6) number = seconds.length === 2 ? seconds.substr(1, 2) : seconds

        return Number(number)
      }
    }
  },
  methods: {
    getMoment() {
      setInterval(() => {
        const now = new Date()
        this.moment = {
          hours: String(now.getHours()),
          minutes: String(now.getMinutes()),
          seconds: String(now.getSeconds())
        }
      }, 1000);
    },
  }
}
</script>

<style lang="stylus" module>
.wrap
  background-color #111
  filter drop-shadow(10px 10px 10px rgba(0,0,0,0.6))
  display flex
  justify-content center
  padding 50px
.item
  margin-right 15px
.separation
  margin-right 15px
  height 130px
</style>
