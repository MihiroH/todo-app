<template lang="pug">
div(:class="$style.wrapper")
  router-link(
    :to="'/todos'"
    :class="$style.backTo"
  ) Todosへ
  h1(:class="$style.category") {{ title }}
  ul(:class="$style.tabs")
    li(
      :class="[$style.tab, $style.qiita]"
      @click="onSelectQiita"
    )
      div(:class="$style.blogIcon")
        img(src="@/assets/icon_qiita.png" alt="Qiita")
      p(:class="$style.blogName") Qiita
    li(
      :class="[$style.tab, $style.zenn]"
      @click="onSelectZenn"
    )
      div(:class="$style.blogIcon")
        img(src="@/assets/icon_zenn.svg" alt="Zenn")
      p(:class="$style.blogName") Zenn
  div(:class="$style.body")
    div(
      v-if="currentBlogType === 'qiita'"
      :class="$style.search"
    )
      input(
        v-model="searchWords"
        :class="$style.search_textField"
        @keydown.enter="onKeyDownEnter"
      )
      button(
        type="button"
        :class="[$style.search_button, $style[currentBlogType]]"
        @click="searchBlogs(currentBlogType)"
      ) 検索
    template(v-if="errorMessage")
      p(:class="$style.errorMessage") {{ errorMessage }}
    template(v-else-if="currentBlogType === 'qiita'")
      ol(
        v-if="getQiitaItems.length"
        :class="$style.list"
      )
        li(
          v-for="(item, index) in getQiitaItems"
          :key="index"
        )
          BlogsItem(
            :title="item.title"
            :url="item.url"
            :updatedAt="item.updated_at"
          )
    template(v-else-if="currentBlogType === 'zenn'")
      ol(
        v-if="getZennItems.length"
        :class="$style.list"
      )
        li(
          v-for="(item, index) in getZennItems"
          :key="index"
        )
          BlogsItem(
            :theme="'blue'"
            :title="item.title"
            :url="`https://zenn.dev/${item.user && item.user.username}/articles/${item.slug}`"
            :updatedAt="item.updatedAt"
          )
  div(
    v-if="isLoading"
    :class="$style.loadingWrapper"
  )
    div(:class="$style.loading")
      div(:class="$style.loading_part")
      div(:class="$style.loading_part")
      div(:class="$style.loading_part")
      div(:class="$style.loading_part")
</template>

<script>
import BlogsItem from '@/components/BlogsItem'

import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'Blogs',
  components: {
    BlogsItem
  },
  data() {
    return {
      currentBlogType: 'qiita',
      searchWords: 'javascript'
    }
  },
  computed: {
    ...mapGetters('blogQiita', {
      errorMessage: 'getErrorMessage',
      getQiitaItems: 'getItems',
      isLoadingQiita: 'isLoading'
    }),
    ...mapGetters('blogZenn', {
      getZennItems: 'getItems',
      isLoadingZenn: 'isLoading'
    }),
    title() {
      if (this.currentBlogType === 'zenn') {
        return 'Trending Tech'
      }

      return this.searchWords || 'Blogs'
    },
    isLoading() {
      return this.isLoadingQiita || this.isLoadingZenn
    }
  },
  created() {
    this.searchBlogs(this.currentBlogType)
  },
  methods: {
    ...mapMutations('blogQiita', ['UPDATE_ERROR_MESSAGE']),
    ...mapActions('blogQiita', { fetchQiitaBlogs: 'fetchBlogs' }),
    ...mapActions('blogZenn', { fetchZennBlogs: 'fetchBlogs' }),
    onSelectQiita() {
      this.UPDATE_ERROR_MESSAGE('')
      this.updateCurrentBlogType('qiita')
      this.searchBlogs(this.currentBlogType)
    },
    onSelectZenn() {
      this.UPDATE_ERROR_MESSAGE('')
      this.updateCurrentBlogType('zenn')
      this.searchBlogs('zenn')
    },
    onKeyDownEnter(e) {
      const isEnterKey = e.keyCode !== 13
      if (isEnterKey) return

      this.searchBlogs(this.currentBlogType)
    },
    updateCurrentBlogType(type = '') {
      if (!type) {
        return
      }
      if (typeof type !== 'string') {
        return
      }
      this.currentBlogType = type
    },
    searchBlogs(type = '') {
      if (!type) {
        return
      }

      if (type === 'qiita') {
        this.fetchQiitaBlogs({ query: this.searchWords })
      }

      if (type === 'zenn') {
        this.fetchZennBlogs()
      }
    }
  }
}
</script>

<style lang="stylus" module>
$color_green = #55c500
$color_blue = #3ea8ff

.wrapper
  padding 30px
  position relative

.backTo
  position absolute
  left 16px
  top 16px
  font-size 16px

.title
  text-align center
  font-size 52px
  font-weight bold

.tabs
  width 498px
  margin 56px auto 0
  display flex
  justify-content center

.tab
  font-size 18px
  font-weight bold
  width 50%
  text-align center
  display flex
  align-items center
  justify-content center
  padding 5px
  &:hover
    cursor pointer
  &.qiita
    border-bottom 2px solid $color_green
  &.zenn
    border-bottom 2px solid $color_blue

.blogIcon
  width 30px
  img
    width 100%

.blogName
  margin-left 16px

.body
  width 498px
  margin 20px auto 0

.category
  font-size 44px
  text-align center
  font-weight bold

.search
  margin-top 24px
  display flex
  align-items stretch
  justify-content flex-end
  &_textField
    width 180px
    font-size 14px
    padding 0 12px
    outline none
    border none
    border-radius 3px
  &_button
    text-align center
    font-size 14px
    width 60px
    padding 6px 0
    font-size 12px
    border-radius 3px
    margin-left 8px
    color #fff
    background $color_green
    &:hover
      opacity .9
      cursor pointer

.list
  margin-top 20px

.errorMessage
  color #f00
  font-size 16px
  text-align center
  margin-top 50px

.loadingWrapper
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  z-index 1

.loading
  display inline-block
  position absolute
  top 50%
  left 50%
  z-index 1
  transform translate(-50%, -50%)
  width 80px
  height 80px
  &_part
    box-sizing border-box
    display block
    position absolute
    width 64px
    height 64px
    margin 8px
    border 8px solid #fff
    border-radius 50%
    animation loading-ring 1.2s cubic-bezier(.5, 0, .5, 1) infinite
    border-color #fff transparent transparent transparent
    &:nth-child(1)
      animation-delay -.45s
    &:nth-child(2)
      animation-delay -.3s
    &:nth-child(3)
      animation-delay -.15s

@keyframes loading-ring
  0%
    transform rotate(0)
  100%
    transform rotate(360deg)
</style>

