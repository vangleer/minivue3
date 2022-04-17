export let activeEffect = undefined
export class ReactiveEffect {
  public active = true // 这个effect是激活状态
  public parent = null
  public deps = []
  constructor(public fn, public scheduler) {}
  run() { // 执行effect
    if (!this.active) { // 如果是非激活的情况，只需要执行函数，不需要收集依赖
      return this.fn()
    }

    // 这里需要收集依赖，核心就是将当前的 effect 和稍后渲染的属性关联在一起
    try {
      this.parent = activeEffect
      activeEffect = this
      cleanupEffect(this)
      return this.fn() // 当稍后取值的时候就可以获取到这个全局变量了
    } finally {
      activeEffect = this.parent
    }
  }

  stop() {
    if (this.active) {
      this.active = false
      cleanupEffect(this) // 停止effect的收集
    }
  }
}

export function effect(fn, options: any = {}) {
  // 这里fn可以根据状态变化 重复执行，effect可以嵌套着写
  const _effect = new ReactiveEffect(fn, options.scheduler) // 创建响应式的effect

  _effect.run()
  const runner = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
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
  trackEffects(dep)
  // 对象 某个属性 -》多个effect
  // WeakMap = { 对象: Map: { name: Set } }
}

export function trackEffects(dep) {
  let shouldTrack = !dep.has(activeEffect)
  if (shouldTrack && activeEffect) {
    dep.add(activeEffect)
    console.log(activeEffect)
    activeEffect.deps?.push(dep)
  }
}

export function trigger(target, type, key, value, oldValue) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  let effects = depsMap.get(key)
  if (effects) {
    triggerEffects(effects)
  }
}

export function triggerEffects(effects) {
  effects = new Set(effects)
  effects.forEach(effect => {
    // 避免重复执行，造成执行栈溢出
    if (effect !== activeEffect) {
      if (effect.scheduler) {
        effect.scheduler()
      } else {
        effect.run()
      }
    }
  })
}

/**
 * 先生成一个响应式对象 proxy
 * effect 默认数据变化要能更新，我们先将正在执行的effect作为全局变量，渲染（取值），
 * 我们在get方法中收集依赖。
 * 数据变化的时候会通过对象属性来查找对应的effect集合，找到effect全部执行
 */

function cleanupEffect(effect: ReactiveEffect) {
  const { deps } = effect
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effect)
  }

  effect.deps.length = 0
}