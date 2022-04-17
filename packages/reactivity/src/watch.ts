import { isFunction, isObject } from '@vue/shared'
import { ReactiveEffect } from './effect'
import { isReactive } from './reactivity'
/**
 * watch
 * @param source 用户传入的对象
 * @param cb 数据改变触发的回调
 */
export function watch(source, cb) {
  let getter
  if (isReactive(source)) {
    // 对用户的数据进行循环（递归循环，只要循环就会访问对象上的每个属性，访问属性时收集effect）
    getter = () => traversal(source)
  } else if (isFunction(source)) {
    getter = source
  } else {
    return console.warn('[vue watch]: watch source must be a reactive object OR a function')
  }
  let clean
  const onCleanup = (fn) => {
    clean = fn // 保存用户的函数
  }
  let oldValue
  const job = () => {
    if (clean) clean() // 下次watch触发，上次watch清理
    const newValue = effect.run()
    cb(newValue, oldValue, onCleanup)
    oldValue = newValue
  }
  const effect = new ReactiveEffect(getter, job)

  oldValue = effect.run()
}

function traversal(source, set = new Set()) {
  if (!isObject(source)) return source

  if (set.has(source)) return source
  set.add(source)

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const element = source[key]
      traversal(element, set)
    }
  }

  return source
}