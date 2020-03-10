import storageAvailable from '@/utils/storageAvailable'

const state = {
  todos: [],
  selectedStatus: '',
  loading: false
}

const getters = {
  getTodos: ({ todos }) => {
    return todos
  },
  getTodosByStatus: ({ todos, selectedStatus }) => {
    if (selectedStatus === 'completed') {
      return todos.filter(todo => todo.status === 'completed')
    }
    return todos.filter(todo => todo.status !== 'completed')
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
  REPLACE_TODOS(state, payload) {
    const prevIndex = payload.prevIndex
    const nextIndex = payload.nextIndex
    const prevTodo = state.todos[prevIndex]

    state.todos.splice(prevIndex, 1)
    state.todos.splice(nextIndex, 0, prevTodo)
  },
  UPDATE_SELECTED_STATUS(state, payload) {
    state.selectedStatus = payload
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

    const types = [
      'todos/ADD_TODO',
      'todos/EDIT_TODO',
      'todos/REMOVE_TODO',
      'todos/REPLACE_TODOS'
    ]
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
