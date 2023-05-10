import { formatTodosForDisplay, formatTodoForDisplay, formatTodoForApi } from '@/utils/formatTodos'
import { request } from '@/utils/request'

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
    const statusMap = {
      todo: 'todoList',
      done: 'doneList'
    }
    const formattedTodos = formatTodosForDisplay(payload)
    const newTodos = Object.entries(statusMap).reduce((acc, [status, key]) => {
      const list = formattedTodos.filter((todo) => todo.status === status)
      return {
        ...acc,
        [key]: list
      }
    }, {})
    state.todos = newTodos
  },
  ADD_TODO(state, payload) {
    const statusMap = {
      todo: 'todoList',
      done: 'doneList'
    }
    if (!statusMap.hasOwnProperty(payload.status)) return

    const target = statusMap[payload.status]
    state.todos[target].push(payload)
  },
  EDIT_TODO(state, payload) {
    const todos = state.todos.todoList
    const length = todos.length
    // 速度改善: https://qiita.com/akumachan/items/2ed3ecfc648707689cb7
    for (let i = 0; i < length; i = (i+1) | 0) {
      if (todos[i].id !== payload.id) continue

      const newTodo = Object.assign({}, todos[i], payload)
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
  async fetchTodos({ commit }) {
    commit('UPDATE_LOADING_FLG', true)

    try {
      const { data } = await request.get('/todos')
      commit('INIT_TODOS', data)
    } catch (e) {
      console.log(e)
    }

    commit('UPDATE_LOADING_FLG', false)
  },
  async createTodo({ commit }, payload) {
    const params = formatTodoForApi(payload)
    try {
      const { data } = await request.post(`/todos`, params)
      commit('ADD_TODO', formatTodoForDisplay(data))
    } catch (e) {
      console.log(e)
    }
  },
  async updateTodo({ commit }, payload) {
    const params = formatTodoForApi(payload)
    try {
      await request.put(`/todos/${payload.id}`, params)
      commit('EDIT_TODO', payload)
    } catch (e) {
      console.log(e)
    }
  },
  async deleteTodo({ commit }, payload) {
    try {
      await request.delete(`/todos/${payload.id}`)
      commit('REMOVE_TODO', payload)
    } catch (e) {
      console.log(e)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
