import { getDate } from '@/utils/getDate'

const validDate = (date) => {
  const today = new Date()
  return date.getTime() <= today.getTime()
}

const formatDate = (date) => {
  const dateObj = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
  }
  return { ...getDate(dateObj), valid: validDate(date) }
}

export const formatTodosForDisplay = (todos) => {
  return todos.map((todo) => formatTodoForDisplay(todo))
}

export const formatTodoForDisplay = (todo) => {
  const fromDate = todo.startDate ? formatDate(new Date(todo.startDate)) : {}
  const toDate = todo.dueDate ? formatDate(new Date(todo.dueDate)) : {}

  return {
    ...todo,
    workingTime: {
      minutes: todo.workingMinutes,
    },
    estimatedTime: {
      minutes: todo.estimatedMinutes,
    },
    date: {
      fromDate,
      toDate,
    }
  }
}

export const formatTodoForApi = (todo) => {
  const { fromDate, toDate } = todo.date

  let startDate = null
  let dueDate = null

  if (Object.keys(fromDate).length) {
    startDate = `${fromDate.year}/${fromDate.month}/${fromDate.date} ${fromDate.hours}:${fromDate.minutes}`
  }

  if (Object.keys(toDate).length) {
    dueDate = `${toDate.year}/${toDate.month}/${toDate.date} ${toDate.hours}:${toDate.minutes}`
  }

  return {
    title: todo.title,
    status: todo.status,
    isTimerStarted: todo.isTimerStarted,
    workingMinutes: todo.workingTime.minutes,
    estimatedMinutes: todo.estimatedTime.minutes,
    startDate,
    dueDate,
  }
}
