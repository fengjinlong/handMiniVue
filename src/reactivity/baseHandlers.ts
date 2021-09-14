import { track, trigger } from "./effect"

const get = createGetter()
const set = createSetter()

const readonlyGet = createGetter(true)

function createGetter(idReadOnly: boolean = false): any {
  return function get(target, key) {
    const res = Reflect.get(target, key)
    if (!idReadOnly) {
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

