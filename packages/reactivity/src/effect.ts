export let activeEffect = undefined
class ReactiveEffect {
  public active = true // 这个effect是激活状态
  public parent = null
  public deps = []
  constructor(public fn) {}
  run() { // 执行effect
    if (!this.active) { // 如果是非激活的情况，只需要执行函数，不需要收集依赖
      return this.fn()
    }

    // 这里需要收集依赖，核心就是将当前的 effect 和稍后渲染的属性关联在一起
    try {
      this.parent = activeEffect
      activeEffect = this
      this.fn() // 当稍后取值的时候就可以获取到这个全局变量了
    } finally {
      activeEffect = this.parent
      this.parent = null
    }
  }
}

export function effect(fn) {
  // 这里fn可以根据状态变化 重复执行，effect可以嵌套着写
  const _effect = new ReactiveEffect(fn) // 创建响应式的effect

  _effect.run()
}

const targetMap = new WeakMap()
export function track(target, type, key) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target) // 第一次没有
  if (!depsMap) { // 没有就用target为key创建一个map
    targetMap.set(target, depsMap = new Map())
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, dep = new Set())
  }
  let shouldTrack = !dep.has(activeEffect)
  if (shouldTrack) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
  }
  // 对象 某个属性 -》多个effect
  // WeakMap = { 对象: Map: { name: Set } }
}

export function trigger(target, type, key, value, oldValue) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const effects = depsMap.get(key)

  effects && effects.forEach(effect => {
    // 避免重复执行，造成执行栈溢出
    if (effect !== activeEffect) effect.run()
  })
}