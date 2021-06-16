import storageAvailable from '@/utils/storageAvailable'

const state = {
  todos: {
    todoList: [],
    doneList: []
  },
  selectedStatus: 'todo',
  loading: false
}

const getters = {
  getTodos: ({ todos }) => {
    return todos
  },
  getTodosByStatus: ({ todos, selectedStatus }) => {
    if (selectedStatus === 'done') return todos.doneList
    return todos.todoList
  },
  getSelectedStatus: ({ selectedStatus }) => {
    return selectedStatus
  }
}

const mutations = {
  INIT_TODOS(state, payload) {
    for (const key of Object.keys(payload)) {
      if (!state.todos.hasOwnProperty(key)) continue
      state.todos[key] = payload[key]
    }
  },
  ADD_TODO(state, payload) {
    const targetObj = {
      todo: 'todoList',
      done: 'doneList'
    }
    if (!targetObj.hasOwnProperty(payload.status)) return

    const target = targetObj[payload.status]
    state.todos[target].push(payload)
  },
  EDIT_TODO(state, payload) {
    const todos = state.todos.todoList
    const length = todos.length
    // 速度改善: https://qiita.com/akumachan/items/2ed3ecfc648707689cb7
    for (let i = 0; i < length; i = (i+1) | 0) {
      if (todos[i].id !== payload.id) continue

      const newTodo = Object.assign({}, todos[i], payload.params)
      todos.splice(i, 1, newTodo)
      break
    }
  },
  REMOVE_TODO(state, payload) {
    const targetObj = {
      todo: 'todoList',
      done: 'doneList'
    }
    if (!targetObj.hasOwnProperty(payload.status)) return

    const target = targetObj[payload.status]
    state.todos[target] = state.todos[target].filter(todo => todo.id !== payload.id)
  },
  TOGGLE_TODO_LIST_TIMER(state, payload) {
    const array = state.todos.todoList.map(todo => {
      let startTimerFlg = false
      if (todo.id === payload.id) {
        startTimerFlg = !payload.startTimerFlg
      }
      return {
        ...todo,
        startTimerFlg
      }
    })

    return state.todos.todoList = array
  },
  REPLACE_TODOS(state, payload) {
    const prevIndex = payload.prevIndex
    const nextIndex = payload.nextIndex
    const prevTodo = state.todos.todoList[prevIndex]

    state.todos.todoList.splice(prevIndex, 1)
    state.todos.todoList.splice(nextIndex, 0, prevTodo)
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
    commit('INIT_TODOS', todos)

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
      'todos/TOGGLE_TODO_LIST_TIMER',
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
