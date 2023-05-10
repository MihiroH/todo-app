import { request } from '@/utils/request'

const state = {
  items: [],
  loading: false
}

const getters = {
  getItems: ({ items }) => {
    return items
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
  UPDATED_LOADING(state, payload) {
    if (typeof payload !== 'boolean') {
      return
    }

    state.loading = payload
  }
}

const actions = {
  async fetchBlogs({ commit }) {
    commit('UPDATED_LOADING', true)

    try {
      const res = await request({
        method: 'get',
        url: '/trendTech',
        baseURL: process.env.VUE_APP_BASE_ZENN_API_URL,
      })

      commit('UPDATE_ITEMS', res.data)
    } catch (e) {
      console.log(e)
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
