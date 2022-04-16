export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}
export const mutableHandlers = {
  get(target, key, receiver) {
    // 在代理商取值，触发get
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    // 为代理对象设置值，执行set
    return Reflect.set(target, key, value, receiver)
  }
}