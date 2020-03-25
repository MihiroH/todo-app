import { suggestDateFromTo } from '@/utils/suggestDateFromTo'

export const mixinSuggestDateFromTo = {
  data () {
    return {
      mixinIsVisibleSuggestionList: false,
      mixinCurrentFromDate: '',
      mixinCurrentToDate: '',
      mixinFromDateVisibleList: [],
      mixinFromDateHistoryList: [],
      mixinToDateVisibleList: [],
      mixinToDateHistoryList: []
    }
  },
  computed: {
    mixinSuggestionDateList() {
      return [
        ...this.mixinFromDateVisibleList,
        ...this.mixinToDateVisibleList
      ]
    }
  },
  methods: {
    mixinUpdateText(selected) {
      const el = this.$el.querySelector(`.${this.$style.input}`)
      const value = this.text

      const regexDefault = new RegExp(`${selected.label} ([0-9]| |/)*`)

      const regexEnglishMonths = '(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)'
      const regexEnglishDates = '[0-9]+(st|nd|rd|th)'
      const regexEnglish = new RegExp(`${selected.label} ${regexEnglishMonths}.*( |${regexEnglishDates})*`, 'ig')

      const beforeWords = value.match(regexEnglish)
        ? value.split(regexEnglish)[0]
        : value.split(regexDefault)[0]

      const currentWords = value.match(regexEnglish)
        ? value.match(regexEnglish)[0]
        : value.match(regexDefault)[0]

      const selectionRange = beforeWords.length + currentWords.length

      el.setSelectionRange(selectionRange, selectionRange)

      const cursorStartPosition = el.selectionStart
      const afterWords = value.substr(cursorStartPosition, value.length)

      const words = `${beforeWords}${selected.label} ${selected.textContent} ${afterWords}`

      this.mixinCloseSuggestionList()
      this.text = words
    },
    mixinSelectedDateFromTo(text) {
      let fromDate = {}
      let toDate = {}

      if (this.mixinCurrentFromDate && /From /g.test(text)) {
        fromDate = this.mixinFromDateHistoryList.filter(date => {
          return date.textContent === this.mixinCurrentFromDate
        })[0].dateObj
      }

      if (this.mixinCurrentToDate && /To /g.test(text)) {
        toDate = this.mixinToDateHistoryList.filter(date => {
          return date.textContent === this.mixinCurrentToDate
        })[0].dateObj
      }
      return {
        fromDate,
        toDate
      }
    },
    mixinOpenSuggestionList() {
      this.mixinIsVisibleSuggestionList = true
    },
    mixinCloseSuggestionList() {
      this.mixinIsVisibleSuggestionList = false
    },
    mixinCheckValue(value) {
      const el = this.$el.querySelector(`.${this.$style.input}`)
      const regex = new RegExp(`(From |To ).*$`)
      const cursorStartPosition = el.selectionStart
      const beforeWords = value.substr(0, cursorStartPosition)

      if (regex.test(beforeWords)) {
        this.mixinStartGuess(beforeWords)
        return
      }
      this.mixinCloseSuggestionList()
    },
    mixinStartGuess(value) {
      this.mixinFromDateVisibleList = []
      this.mixinToDateVisibleList = []

      if (/From (?!.*T).*$/.test(value)) {
        this.mixinFromDateVisibleList = suggestDateFromTo('From', value.split('From ')[1])
        this.mixinFromDateHistoryList = [
          ...this.mixinFromDateHistoryList,
          ...suggestDateFromTo('From', value.split('From ')[1])
        ]
        this.mixinOpenSuggestionList()
      }

      if (/To (?!.*F).*$/.test(value)) {
        this.mixinToDateVisibleList = suggestDateFromTo('To', value.split('To ')[1])
        this.mixinToDateHistoryList = [
          ...this.mixinToDateHistoryList,
          ...suggestDateFromTo('To', value.split('To ')[1])
        ]
        this.mixinOpenSuggestionList()
      }
    },
    mixinHandleSelectSuggestion(selected) {
      this.mixinUpdateText(selected)

      if (selected.label === 'From') {
        this.mixinCurrentFromDate = selected.textContent
      }
      if (selected.label === 'To') {
        this.mixinCurrentToDate = selected.textContent
      }
    }
  }
}
