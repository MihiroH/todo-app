import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 参照: https://qiita.com/jkr_2255/items/d23e66323857d3189a00
const modules = {}
const context = require.context('./modules/', true, /\.js$/)
context.keys().forEach(filePath => { // コンテキストに含まれるパスの配列を返す
  let fileName = filePath.replace(/^.\//, '').replace(/\.\w+$/, '')
  let test = context(filePath) // 指定されたパスのモジュールをrequireする
  test = test.default || test

  modules[fileName] = test
})

export default new Vuex.Store ({
  modules
})
