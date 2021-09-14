import { track, trigger } from "./effect"
import { ReactiveFlegs } from './reactive'

const get = createGetter()
const set = createSetter()

const readonlyGet = createGetter(true)

function createGetter(isReadOnly: boolean = false): any {
  return function get(target, key) {
    if (key === ReactiveFlegs.IS_REACTIVE) {
      return !isReadOnly
    }
    if (key === ReactiveFlegs.IS_READONLY) {
      return isReadOnly
    }
    const res = Reflect.get(target, key)
    if (!isReadOnly) {
      track(target, key)
    }
    return res
  }
}
function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value)
    // 触发依赖
    trigger(target, key)
    return res
  }
}

export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    console.warn(`${key} 不能set，readonly！`)
    return true
  }
}

