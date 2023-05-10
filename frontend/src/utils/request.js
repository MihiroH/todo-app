import applyCaseMiddleware from 'axios-case-converter'
import axios from 'axios'

import MyAbortController from '@/utils/myAbortController'

const instance = applyCaseMiddleware(axios.create({
  baseURL: process.env.VUE_APP_BASE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}))

// リクエスト毎にキャンセルトークンをセット
instance.interceptors.request.use((config) => {
  config.signal = MyAbortController.signal()
  return config
})

export const request = instance
