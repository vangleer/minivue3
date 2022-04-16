import { isObject } from '@vue/shared'
import { track, trigger } from './effect'
import { reactive } from './reactivity'
export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}
export const mutableHandlers = {
  get(target, key, receiver) {
    // 在代理商取值，触发get
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }

    track(target, 'get', key)
    const res = Reflect.get(target, key, receiver)
    if (isObject(res)) {
      // 深度代理
      return reactive(res)
    }
    return res
  },
  set(target, key, value, receiver) {
    // 为代理对象设置值，执行set
    // 拿到更新前的值
    const oldValue = target[key]
    const result = Reflect.set(target, key, value, receiver)
    if (oldValue !== value) {
      // 触发依赖
      trigger(target, 'set', key, value, oldValue)
    }
    return result
  }
}
