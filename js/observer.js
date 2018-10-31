function defineReactive(data, key, val) {
  observe(val)
  var dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true,
    configrable: true,
    get () {
      if(Dep.target) {
        dep.addSub(Dep.target) // 添加订阅者
      }
      return val
    },
    set (newVal) {
      if (val === newVal) {
        return
      }
      val = newVal
      console.log('属性' + key + '已经被监听，现在值为:"' + newVal + '"' )
      dep.notify()
    }
  })
}
function Dep() {
  this.subs = []
}
Dep.prototype = {
  addSub (sub) {
    this.subs.push(sub)
  },
  notify () {
    this.subs.forEach((sub) => {
      sub.update()
    })
  }
}
function observe(data) {
  if(!data || typeof data!=='object') {
    return
  }
  Object.keys(data).forEach((key)=>{
    defineReactive(data, key, data[key])
  })
}

var library = {
  book1: {
    name: ''
  },
  book2: ''
}
observe(library)
library.book1.name = 'vue权位指南'
library.book2 = '没有此书籍'