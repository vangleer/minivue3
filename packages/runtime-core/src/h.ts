import { isArray, isObject, isString } from '@vue/shared'
import { createVnode, isVnode } from './vnode'
export function h(type, propsChildren, children) {
  const l = arguments.length

  if (l === 2) {
    if (isObject(propsChildren) && !isArray(propsChildren)) {
      if (isVnode(propsChildren)) {
        return createVnode(type, null, [propsChildren]) // vnode
      }
      return createVnode(type, propsChildren) // 属性
    } else {
      return createVnode(type, null, propsChildren) // 数组
    }
  } else {
    if (l > 3) {
      children = Array.from(arguments).slice(2)
    } else if(l === 3) {
      children = [children]
    }

    // 其它
    return createVnode(type, propsChildren, children) 
  }
}