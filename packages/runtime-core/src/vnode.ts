// type props children

import { isArray, isString, ShapeFlags } from "@vue/shared"

export function isVnode(value) {
  return value && value.__v_isVnode
}
// 虚拟节点有很多：组件、元素、文本
export function createVnode(type, props, children = null) {
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0

  const vnode = {
    el: null,
    type,
    props,
    children,
    key: props?.key,
    __v_isVnode: true,
    shapeFlag
  }
  if (children) {
    let type = 0
    if (isArray(children)) {
      type = ShapeFlags.ARRAY_CHILDREN
    } else {
      children = String(children)
      type = ShapeFlags.TEXT_CHILDREN
    }

    vnode.shapeFlag |= type
  }

  return vnode
}