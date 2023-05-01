import axios from 'axios'

const state = {
  items: [],
  errorMessage: '',
  loading: false
}

const getters = {
  getItems: ({ items }) => {
    return items
  },
  getErrorMessage: ({ errorMessage }) => {
    return errorMessage
  },
  isLoading: ({ loading }) => {
    return loading
  }
}

const mutations = {
  UPDATE_ITEMS(state, payload) {
    if (!Array.isArray(payload)) {
      return
    }

    state.items = payload
  },
  UPDATE_ERROR_MESSAGE(state, payload) {
    if (typeof payload !== 'string') {
      return
    }

    state.errorMessage = payload
  },
  UPDATED_LOADING(state, payload) {
    if (typeof payload !== 'boolean') {
      return
    }

    state.loading = payload
  }
}

const actions = {
  async fetchBlogs({ commit }, payload) {
    commit('UPDATED_LOADING', true)

    try {
      const params = {}
      if (payload.query) {
        params.query = payload.query
      }

      const res = await axios.get('https://qiita.com/api/v2/items', { params })

      commit('UPDATE_ITEMS', res.data)
    } catch (e) {
      console.log(e)
      commit('UPDATE_ERROR_MESSAGE', e.message)
    }

    commit('UPDATED_LOADING', false)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
