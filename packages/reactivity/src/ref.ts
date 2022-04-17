import { isArray, isObject } from "@vue/shared"
import { trackEffects, triggerEffects } from "./effect"
import { reactive } from "./reactivity"

class RefImpl {
  public _value
  public __v_isRef = true
  public dep = new Set()
  constructor(public rawValue) {
    this._value = toReactive(rawValue)
  }

  get value() {
    // 做依赖收集
    trackEffects(this.dep)
    return this._value
  }
  set value(newValue) {
    if (newValue !== this.rawValue) {
      this._value = toReactive(newValue)
      this.rawValue = newValue
      triggerEffects(this.dep)
    }
  }
}

class ObjectRefImpl {
  constructor(public object, public key) {}
  get value() {
    return this.object[this.key]
  }

  set value(newValue) {
    this.object[this.key] = newValue
  }
}
export function ref(value) {
  return new RefImpl(value)
}

export function toRef(object, key) {
  return new ObjectRefImpl(object, key)
}
export function toRefs(object) {
  const result = isArray(object) ? new Array(object.length) : {}
  for (const key in result) {
    result[key] = toRef(object, key)
  }
  return result
}

function toReactive(value) {
  return isObject(value) ? reactive(value) : value
}