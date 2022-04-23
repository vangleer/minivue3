import { forEach, ShapeFlags } from "@vue/shared"

export function createRenderer(renderOptions) {
  const render = (vnode, container) => {
    console.log(vnode, container)

    const {
      insert: hostInsert,
      remove: hostRemove,
      setElementText: hostSetElementText,
      setText: hostSetText,
      querySelector: hostQuerySelector,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      createElement: hostCreateElement,
      createTex: hostCreateText,
      patchProp: hostPatchProp
    } = renderOptions

    const mountChildren = (children, container) => {
      forEach(children, item => {
        patch(null, item, container)
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

    const patch = (n1, n2, container) => {
      if (n1 === n2) return

      if (n1 === null) {
        // 初次渲染
        mountElement(n2, container)
      } else {

      }
    }

    if (vnode === null) {
      // 如果当前的vnode为空，卸载
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