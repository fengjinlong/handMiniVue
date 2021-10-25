import { hasChanged, isObject } from '../shared/index'
import { isTracking, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

class RefImp {
  private _value
  public dep
  private _rawValue: any
  public __v_isRef = true
  constructor(val) {
    this._rawValue = val
    this._value = convert(val)
    this.dep = new Set()
  }
  get value() {
    trackRefValue(this)
    return this._value
  }
  set value(newVal) {
    if (hasChanged(this._value, newVal)) {
      this._rawValue = newVal
      this._value = convert(newVal)

      triggerEffects(this.dep)
    }
  }
}
function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}
function convert(value) {
  return isObject(value) ? reactive(value) : value
} 

export function ref(value) {
  return new RefImp(value)
}
export function isRef(ref) {
  return !!ref.__v_isRef
}
export function unRef(ref) {
  return !!ref.__v_isRef ? ref.value : ref
}
export function proxyRefs(objectWithRef) {
  return new Proxy(objectWithRef, {
    get(target, key) {
      return unRef(Reflect.get(target, key))
    },
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return target[key].value = value
      } else {
        return Reflect.set(target, key, value)
      }
    }
  })
}
