function MyAbortController() {
  this.controllers = {}
}

MyAbortController.prototype.signal = function (controllerKey = '') {
  const key = controllerKey || Math.random().toString(32).substring(2)
  this.controllers[key] = new AbortController()

  return this.controllers[key].signal
}

MyAbortController.prototype.abort = function (controllerKey = '') {
  const key = controllerKey

  if (key) {
    if (typeof this.controllers[key] !== 'undefined') {
      this.controllers[key].abort()
      console.log(`${key}: Request has been aborted.`)
    }
    return
  }

  Object.entries(this.controllers).forEach(([key, controller]) => {
    controller.abort()
    console.log(`${key}: Request has been aborted.`)
  })
}

MyAbortController.prototype.delete = function (controllerKey = '') {
  if (typeof this.controllers[controllerKey] !== 'undefined') {
    delete this.controllers[controllerKey]
  }
}

export default new MyAbortController()
