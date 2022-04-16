import { isFunction } from "@vue/shared"
import { ReactiveEffect, triggerEffects, trackEffects } from "./effect"


class ComputedRefImpl {
  public effect: ReactiveEffect
  public _dirty = true // 默认取值的时候计算
  public __v_isReadonly = true
  public __v_isRef = true
  public _value
  public dep = new Set()
  constructor(getter, public setter) {
    // 将用户的getter放到effect中，这里面使用用的响应式数据就会被这个effect收集起来
    this.effect = new ReactiveEffect(getter, () => {
      // 稍后依赖的属性变化后会调用次函数
      if (!this._dirty) {
        this._dirty = true
        triggerEffects(this.dep)
      }
    })
  }

  get value() {
    // 做依赖收集
    trackEffects(this.dep)
    if (this._dirty) {
      this._dirty = false
      this._value = this.effect.run()
    }
    return this._value
  }

  set value(newValue) {
    this.setter(newValue, this._value)
  }
}
export function computed(getterOrOptions) {
  let onlyGetter = isFunction(getterOrOptions)
  let getter, setter

  if (onlyGetter) {
    getter = getterOrOptions
    setter = () => console.warn('[vue computed]: no set')
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  return new ComputedRefImpl(getter, setter)
}