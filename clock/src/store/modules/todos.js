import storageAvailable from '@/utils/storageAvailable'

const state = {
  todos: [],
  loading: false
}

const getters = {
  getTodos: ({ todos }) => {
    return todos
  }
}

const mutations = {
  UPDATE_TODOS(state, payload) {
    state.todos = payload
  },
  ADD_TODO(state, payload) {
    state.todos.push(payload)
  },
  EDIT_TODO(state, payload) {
    const todos = state.todos
    const length = todos.length
    // 速度改善: https://qiita.com/akumachan/items/2ed3ecfc648707689cb7
    for (let i = 0; i < length; i = (i+1) | 0) {
      if (todos[i].id !== payload.id) continue
      todos.splice(i, 1, payload)
      break
    }
  },
  REMOVE_TODO(state, payload) {
    state.todos = state.todos.filter(todo => todo.id !== payload)
  },
  UPDATE_LOADING_FLG(state, payload) {
    state.loading = payload
  }
}

const actions = {
  fetchTodos({ commit }) {
    if (!storageAvailable('localStorage')) {
      return alert('localStorageが有効ではありません')
    }

    commit('UPDATE_LOADING_FLG', true)

    const todos = JSON.parse(localStorage.getItem('todos')) || []
    commit('UPDATE_TODOS', todos)

    commit('UPDATE_LOADING_FLG', false)
  }
}

export const pluginTodos = store => {
  // ストアが更新されたときに呼ばれます
  store.subscribe((mutation, { todos }) => {
    if (!storageAvailable('localStorage')) {
      return alert('localStorageが有効ではありません')
    }

    const types = ['todos/ADD_TODO','todos/EDIT_TODO', 'todos/REMOVE_TODO']
    types.forEach(type => {
      if (mutation.type === type) {
        localStorage.setItem('todos', JSON.stringify(todos.todos))
      }
    })
  })
}


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
