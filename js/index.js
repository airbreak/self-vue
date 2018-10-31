function SelfVue(options) {
  this.data = options.data
  this.vm = this
  Object.keys(this.data).forEach((key) => {
    this.proxyKeys(key)
  })
  observe(this.data)
  // el.innerHTML = this.data[exp]
  // new Watcher(this, exp, (value) => {
  //   el.innerHTML = value
  // })
  new Compile(options.el, this);
  options.mounted.call(this)
}

SelfVue.prototype = {
  proxyKeys (key) {
    let self = this
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable:true,
      get: function proxyGetter () {
        return self.data[key]
      },
      set: function proxySetter(newVal) {
        self.data[key] = newVal
      }
    })
  }
}