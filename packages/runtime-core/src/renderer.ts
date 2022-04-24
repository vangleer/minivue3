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

    const normalize = (children, i) => {
      if (isString(children[i])) {
        const vnode = createVnode(Text, null, children[i])
        children[i] = vnode
      }
      return children[i]
    }
    const mountChildren = (children, container) => {
      forEach(children, (item, i) => {
        let child = normalize(children, i)
        patch(null, child, container)
      })
    }
    const mountElement = (vnode, container, anchor = null) => {
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
        mountChildren(children, el)
      }
      hostInsert(el, container, anchor)
    }

    const patchProps = (oldProps, newProps, el) => {
      forEach(newProps, key => {
        hostPatchProp(el, key, oldProps[key], newProps[key])
      })

      forEach(oldProps, key => {
        if (!newProps[key]) {
          hostPatchProp(el, key, oldProps[key], null)
        }
      })
    }

    const unmountChildren = (children) => {
      forEach(children, item => {
        unmount(item)
      })
    }

    const patchKeyChildren = (c1, c2, el) => {
      // 定义4个指针
      let i = 0
      let e1 = c1.length - 1
      let e2 = c2.length - 1
      // sync from start
      while(i <= e1 && i <= e2) {
        const n1 = c1[i]
        const n2 = c2[i]
        if (isSameVnode(n1, n2)) {
          patch(n1, n2, el) // 比较两个节点的属性和子节点
        } else {
          break
        }
        i++
      }
      // sync from end
      while(i <= e1 && i <= e2) {
        const n1 = c1[e1]
        const n2 = c2[e2]
        if (isSameVnode(n1, n2)) {
          patch(n1, n2, el) // 比较两个节点的属性和子节点
        } else {
          break
        }
        e1--
        e2--
      }
      // common sequence + mount
      // i比e1大说明有新增的
      // i和e2之间的是新增部分
      if (i > e1) {
        if (i <= e2) {
          while(i <= e2) {
            const nextPos = e2 + 1
            const anchor = nextPos < c2.length ? c2[nextPos].el : null
            patch(null, c2[i], el, anchor) // 创建新节点，添加到容器中
            i++
          }
        }
      } else if (i > e2) {
        // common sequence + unmount
        // i比e2大说明有要卸载的
        // i到e1之间的卸载

        if (i <= e1) {
          while(i <= e1) {
            unmount(c1[i])
            i++
          }
        }
      }
      
      // 移除老的
      while(e1 > 0 && i <= e1) {
        unmount(c1[e1--])
      }

      while (e2 > 0 && i <= e2) { // 新增
        patch(null, c2[i++], el)
      }
      console.log(i, e1, e2)
    }
    const patchChildren = (n1, n2, el) => {
      // 比较两个虚拟节点的子节点，el就是当前父节点
      console.log(patchChildren, 'patchChildren')
      const c1 = n1 && n1.children
      const c2 = n2 && n2.children
      const prevShapeFlag = n1.shapeFlag // 之前的
      const shapeFlag = n2.shapeFlag // 之后的
       /**
       * 比较两个儿子的差异
       * 文本 数组 （删除老儿子，设置文本内容）
       * 文本 文本 （更新新文本）
       * 数组 数组 （diff算法）
       * 数组 文本 （清空文本，进行挂载）
       * 空   数组 （删除所有儿子）
       * 空   文本 （清空文本）
       */
       if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
         if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          //  删除所有子节点
          unmountChildren(c1) // 文本 数组 （删除老儿子，设置文本内容）
         }
         if (c1 !== c2) { // 文本 文本 （更新新文本）包括文本和空
           hostSetElementText(el, c2)
         }
       } else {
        // 现在为数组和空
        if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            // 数组 数组 diff
            console.log('diff')
            patchKeyChildren(c1, c2, el)
          } else {
            // 之前树数组，现在是文本
            unmountChildren(c1)
          }
        } else {
          if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
            hostSetElementText(el, '')
          }
          if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(c2, el)
          }
        }
       }
    }
    const patchElement = (n1, n2, container) => {
      // 先复用节点，在比较属性，在比较儿子
      const el = n2.el = n1.el
      const oldProps = n1.props || {}
      const newProps =  n2.props || {}
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

    const processElement = (n1, n2, container, anchor = null) => {
      if (n1 === null) {
        mountElement(n2, container, anchor)
      } else {
        // 元素比对
        patchElement(n1, n2, container)
      }
    }
    const unmount = (vnode) => {
      hostRemove(vnode.el)
    }
    const patch = (n1, n2, container, anchor = null) => {
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
            processElement(n1, n2, container, anchor)
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