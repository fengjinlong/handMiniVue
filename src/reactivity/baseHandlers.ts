import { extend, isObject } from '../share'
import { track, trigger } from './effect'
import { reactive, ReactiveFlegs, readonly } from './reactive'

const get = createGetter()
const set = createSetter()

const shallowReadonlyGer = createGetter(false, true)

const readonlyGet = createGetter(true)

function createGetter(isReadOnly: boolean = false, shallow = false): any {
  return function get(target, key) {
    if (key === ReactiveFlegs.IS_REACTIVE) {
      return !isReadOnly
    }
    if (key === ReactiveFlegs.IS_READONLY) {
      return isReadOnly
    }
    const res = Reflect.get(target, key)
    if (shallow) {
      return res
    }
    if (isObject(res)) {
      return isReadOnly ? readonly(res) : reactive(res)
    }

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
  set,
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    console.warn(`${key} 不能set，readonly！`)
    return true
  },
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
 get: shallowReadonlyGer
}) 
