<template lang="pug">
ul(:class="$style.wrap")
  li(
    v-for="(result, index) in resultList"
    :key="index"
    :class="classNameItem(result, index)"
  ) {{ result.textContent }}
    span(:class="$style.label") {{ result.label }}
    span(:class="$style.supplement") {{ result.supplement }}
</template>

<script>

export default {
  name: 'SuggestResultList',
  props: {
    resultList: {
      type: Array,
      required: true
    },
    currentText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      oldText: '',
      selectedIndex: -1
    }
  },
  computed: {
    notExistsResult() {
      return !this.resultList.length ? true : false
    },
    list() {
      return this.$el
    },
    classNameItem() {
      return (resultObj, index) => {
        return [
          this.$style.item,
          {
            [this.$style.invalid]: resultObj.invalid,
            [this.$style.selected]: this.selectedIndex === index
          }
        ]
      }
    }
  },
  mounted() {
    this.handleKeypress()
  },
  methods: {
    updateSelected() {
      if (this.selectedIndex === -1) return

      const selected = this.resultList[this.selectedIndex]
      this.$emit('suggestion-selected', selected)
    },
    focusPrev() {
      if (this.notExistsResult) return
      if (this.selectedIndex === -1) {
        this.selectedIndex = this.resultList.length - 1
        return
      }
      if (this.selectedIndex === 0) {
        this.selectedIndex = -1
        return
      }

      this.oldText = this.currentText
      this.selectedIndex--
    },
    focusNext() {
      if (this.notExistsResult) return
      if (this.selectedIndex === this.resultList.length - 1) {
        this.selectedIndex = -1
        return
      }

      this.oldText = this.currentText
      this.selectedIndex++
    },
    handleKeypress() {
      // キーが押されたら実行する処理
      const shortcutKey = (e) => {
        // Ctrl キー + something
        if (e.ctrlKey) return this.shortcutKeyMulti(e)
        if (e.keyCode === 13) return this.updateSelected()
      }

      const initSelectedIndex = () => {
        if (this.oldText === this.currentText) return
        this.selectedIndex = -1
      }

      document.addEventListener('keydown', shortcutKey)
      document.addEventListener('keyup', initSelectedIndex)

      this.$once('hook:beforeDestroy', () => {
        document.removeEventListener('keydown', shortcutKey);
        document.removeEventListener('keyup', initSelectedIndex)
      })
    },
    shortcutKeyMulti(e) {
      // p
      if(e.keyCode === 80) {
        e.preventDefault()
        return this.focusPrev()
      }
      // n
      if(e.keyCode === 78) {
        e.preventDefault()
        return this.focusNext()
      }
    }
  }
}
</script>

<style lang="stylus" module>
.wrap
  overflow hidden
  $borderWidth = 2px
  box-sizing content-box
  background rgba(#111, .8)
  border $borderWidth solid #9acd32
  border-top none
  position absolute
  top 100%
  left 0
  right 0
  width 'calc(100% - %s * 2)' % $borderWidth
  z-index 10
.item
  padding 10px
  position relative
  color #fff
  text-align center
  &:not(:first-child)
    border-top 1px solid #9acd32
  &.selected
    background rgba(#9acd32, .8)
    color #fff
    backface-visibility hidden
    .label,
    .supplement
      color inherit
  &.invalid
    color #df5656
    .label
      color inherit
    .supplement
      display none
.label
  position absolute
  top 50%
  left 20px
  transform translateY(-50%)
  color rgba(#fff, .8)
.supplement
  position absolute
  top 50%
  right 20px
  transform translateY(-50%)
  color rgba(#fff, .8)
</style>


