import { track, trigger } from './effect'
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
    return Reflect.get(target, key, receiver)
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
