import { forEach, isString, ShapeFlags } from "@vue/shared"
import { createVnode, isSameVnode, Text } from './vnode'

export function createRenderer(renderOptions) {
  const render = (vnode, container) => {
    const {
      insert: hostInsert,
      remove: hostRemove,
      setElementText: hostSetElementText,
      setText: hostSetText,
      querySelector: hostQuerySelector,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      createElement: hostCreateElement,
      createText: hostCreateText,
      patchProp: hostPatchProp
    } = renderOptions

    const normalize = (child) => {
      if (isString(child)) {
        return createVnode(Text, null, child)
      }
      return child
    }
    const mountChildren = (children, container) => {
      forEach(children, item => {
        let child = normalize(item)
        patch(null, child, container)
      })
    }
    const mountElement = (vnode, container) => {
      const { type, props, children, shapeFlag } = vnode

      // 将真实元素挂载到虚拟节点上，用于后序更新
      const el = vnode.el = hostCreateElement(type)

      if (props) {
        forEach(props, key => {
          hostPatchProp(el, key, null, props[key])
        })
      }

      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(el, children)
      } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        console.log(children, el)
        mountChildren(children, el)
      }
      hostInsert(el, container)
    }

    const patchProps = (oldProps, newProps, el) => {
      console.log(oldProps, newProps, el)
      forEach(newProps, key => {
        hostPatchProp(el, key, oldProps[key], newProps[key])
      })

      forEach(oldProps, key => {
        if (!newProps[key]) {
          hostPatchProp(el, key, oldProps[key], null)
        }
      })
    }

    const patchChildren = (n1, n2, el) => {
      // 比较两个虚拟节点的子节点，el就是当前父节点
      const c1 = n1 && n1.children
      const c2 = n2 && n2.children
      // 文本 空的 数组
    }
    const patchElement = (n1, n2, container) => {
      // 先复用节点，在比较属性，在比较儿子
      const el = n2.el = n1.el

      const oldProps = n1.props || {}
      const newProps =  n2.props || {}
      console.log(n1, n2, container)
      patchProps(oldProps, newProps, el)

      patchChildren(n1, n2, el)
    }
    const processText = (n1, n2, container) => {
      if (n1 === null) {
        hostInsert(n2.el = hostCreateText(n2.children), container)
      } else {
        // 文本的内容变化
        const el = n2.el = n1.el

        if (n1.children !== n2.children) {
          hostSetText(el, n2.children)
        }
      }
    }

    const processElement = (n1, n2, container) => {
      if (n1 === null) {
        mountElement(n2, container)
      } else {
        // 元素比对
        patchElement(n1, n2, container)
      }
    }
    const unmount = (vnode) => {
      hostRemove(vnode.el)
    }
    const patch = (n1, n2, container) => {
      if (n1 === n2) return

      if (n1 && !isSameVnode(n1, n2)) { // 判断两个元素是否相同，不相同卸载老的
        unmount(n1)
        n1 = null
      }
      const { type, shapeFlag } = n2
      // 初次渲染
      switch(type) {
        case Text:
          processText(n1, n2, container)
          break
        default:
          if (shapeFlag & ShapeFlags.ELEMENT) {
            processElement(n1, n2, container)
          }
      }
    }

    if (vnode === null) {
      // 如果当前的vnode为空，卸载
      if (container._vnode) {
        unmount(container._vnode)
      }
      
    } else {
      // 这里既有初始化逻辑，又有更新逻辑
      patch(container._vnode || null, vnode, container)
    }

    container._vnode = vnode
  }
  return {
    render
  }
}

/**
 * 更新的逻辑
 * 1. 如果前后完全没关系，解除老的，添加新的
 * 2. 老的和新的一样，复用，属性可能不一样，再对比属性，更新属性
 * 3. 比儿子
 */