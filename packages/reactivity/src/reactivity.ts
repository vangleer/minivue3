// 将数据转化为响应式
import { isObject } from '@vue/shared'
import { mutableHandlers, ReactiveFlags } from './baseHandler'
const reactiveMap = new WeakMap()

export function reactive(target) {
  if (!isObject(target)) return
  // 如果该对象是代理对象直接返回
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  const exisitingProxy = reactiveMap.get(target)
  if (exisitingProxy) {
    return exisitingProxy
  }

  // 并没有重新定义属性，只是代理，在取值的时候会调用get，赋值的时候会调用set
  const proxy = new Proxy(target, mutableHandlers)

  reactiveMap.set(target, proxy)

  return proxy
}