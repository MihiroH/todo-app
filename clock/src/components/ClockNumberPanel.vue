<template lang="pug">
div(:class="$style.wrap")
  ClockLightStick(
    v-for="(item, index) in 7"
    :key="index"
    :isInactive="isInactive(index + 1)"
    :direction="direction(index + 1)"
    :class="$style[`item-${index + 1}`]"
  )
</template>

<script>
import ClockLightStick from '@/components/ClockLightStick'
export default {
  name: 'ClockNumberPanel',
  components: {
    ClockLightStick
  },
  props: {
    number: {
      type: Number,
      required: true
    }
  },
  mounted() {
  },
  computed: {
    inActiveIndexList() {
      /**
       * ClockLightStickの位置
       * 1番目: 中央上
       * 2番目: 中央中央
       * 3番目: 中央下
       * 4番目: 右上
       * 5番目: 右下
       * 6番目: 左上
       * 7番目: 左下
      */

      // 非アクティブ箇所のインデックス
      const zero = [2]
      const one = [1, 2, 3, 6, 7]
      const two = [5, 6]
      const three = [6, 7]
      const four = [1, 3, 7]
      const five = [4, 7]
      const six = [4]
      const seven = [2, 3, 7]
      const eight = []
      const nine = [3, 7]
      const numbers = [zero, one, two, three, four, five, six, seven, eight, nine]

      return numbers[this.number]
    },
    isInactive() {
      return index => {
        return this.inActiveIndexList.indexOf(index) !== -1 ? true : false
      }
    },
    direction() {
      return index => {
        return index < 4 ? 'horizontal' : 'vertical'
      }
    }
  }
}
</script>

<style lang="stylus" module>
.wrap
  position relative
  height 130px
  width 70px
  [class*="item"]
    position absolute
.item-1,
.item-2,
.item-3
  margin auto
.item-1
  top 0
.item-1,
.item-2,
.item-3,
.item-4,
.item-5
  right 0
.item-1,
.item-2,
.item-3,
.item-6,
.item-7
  left 0
.item-4,
.item-6
  top 10px
.item-5,
.item-7
  bottom 10px
.item-3
  bottom 0
.item-2
  top 50%
  transform translateY(-50%)
</style>
