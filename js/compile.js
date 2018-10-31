function Compile(el, vm) {
  this.vm = vm
  this.el = document.getElementById(el)
  this.fragment = null
  this.init()
}
Compile.prototype = { 
  init () {
    if(this.el) {
      this.fragment = this.nodeToFragment(this.el)
      this.compileElement(this.fragment)
      this.el.appendChild(this.fragment)
    }else{
      console.log('Dom 元素不存在')
    }
  },
  nodeToFragment(el) {
    let fragment = document.createDocumentFragment()
    let child = el.firstChild
    while (child) {
      fragment.appendChild(child)
      child = el.firstChild
    }
    return fragment
  },
  compileElement(el) {
    let childNodes = el.childNodes
    let arr = []
    arr.slice.call(childNodes).forEach((node) => {
      let reg = /\{\{(.*)\}\}/
      let text = node.textContent

      if(this.isTextNode(node) && reg.test(text)) {
        this.compileText(node, reg.exec(text)[1])
      }
      if(node.childNodes && node.childNodes.length) {
        this.compileElement(node)
      }
    })
  },
  compile(node) {
    let nodeAttrs = node.attributes
    Array.prototype.forEach.call(nodeAttrs, (attr) => {
      let attrName = attr.value
      if(this.isDirective(attrName)) {
        let exp = attr.value
        let dir = attrName.substring(2)
        if(this.isEventDirective(dir)) {
          this.compileEvent(node, this.vm, exp, dir)
        } else {
          this.compileModel(node, this.vm, exp, dir)
        }
        node.removeAttribute(attrName)
      }

    })
  },
  compileText(node, exp) {
    let initText = this.vm[exp]
    this.updateText(node, initText)
    new Watcher(this.vm, exp, (value) => {
      this.updateText(node, value)
    })
  },
  compileEvent (node, vm, exp, dir) {
    let evnetType = dir.split(':')[1]
    let cb = vm.methods && vm.methods[exp]
    if(evnetType && cb) {
      node.addEventListener(evnetType, cb.bind(vm), false)
    }
  },
  compileModel (node, vm, exp, dir) {
    let val = this.vm[exp]
    new Watcher(this.vm, exp, (val) => {
      this.modelUpdater(node,val)
    })
    node.addEventListener('input', (e) => {
      let newVal = e.target.value
      if(val === newVal) {
        return
      }
      this.vm[exp] = newVal
      val = newVal
    })
  },
  updateText(node, value) {
    node.texContent = typeof value == 'undefined' ? '' : value
  },
  modelUpdater (node,value,oldVal) {
    node.value = typeof value == 'undefined' ? '' : value
  },
  
  isDirective (attr) {
    return attr.indexOf('v-') == 0
  },
  isEventDirective(dir) {
    return dir.indexOf('on:') == 0
  },
  isElementNode(node) {
    return node. nodeType == 1
  },
  isTextNode(node) {
    return node.nodeType == 3
  },
}