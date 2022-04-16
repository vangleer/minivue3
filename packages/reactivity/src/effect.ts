class ReactiveEffect {
  constructor(fn) {

  }

  run() { // 执行effect

  }
}

export function effect(fn) {
  // 这里fn可以根据状态变化 重复执行，effect可以嵌套着写

  const _effect = new ReactiveEffect(fn) // 创建响应式的effect

  _effect.run()
}