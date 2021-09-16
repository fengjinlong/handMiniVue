import {readonlyHandlers, mutableHandlers, shallowReadonlyHandlers } from './baseHandlers'
export const enum ReactiveFlegs {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isREADONLY'
}

export function reactive(raw) {
  return createReactiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers)
}
export function isReadOnly(raw) {
  return !!raw[ReactiveFlegs.IS_READONLY]
}
function createReactiveObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers)
}

export function isReactive (raw) {
  return !!raw[ReactiveFlegs.IS_REACTIVE]
}

export function isProxy (raw) {
  return isReadOnly(raw) || isReactive(raw)
}
export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandlers) 
}