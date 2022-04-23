
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

const renderOptions = Object.assign(nodeOps, { nodeOps })


export function createRenderer(renderOptions) {
  const render = (vnode, container) => {

  }
  return {
    render
  }
}
export function render(vnode, container) {
  createRenderer(renderOptions).render(vnode, container)
}

// createRenderer(renderOptions).render(h('h1', 'Hello'), document.querySelector('#app'))
console.log(renderOptions)

