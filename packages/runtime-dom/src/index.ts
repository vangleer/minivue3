
import { createRenderer } from '@vue/runtime-core'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

const renderOptions = Object.assign(nodeOps, { patchProp })

export function render(vnode, container) {
  createRenderer(renderOptions).render(vnode, container)
}

console.log(renderOptions)

export * from '@vue/runtime-core'

