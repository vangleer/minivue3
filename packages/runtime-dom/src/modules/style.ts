import { forEach } from "@vue/shared"



export function patchStyle(el, prevValue, nextValue) {
  nextValue = nextValue ? nextValue : {}
  forEach(nextValue, key => {
    // 用新的直接覆盖即可
    el.style[key] = nextValue[key]
  })

  if (prevValue) {
    forEach(prevValue, key => {
      if (!nextValue[key]) { // 如果新样式中没有就去掉原有的样式
        el.style[key] = null
      }
    })
  }
}