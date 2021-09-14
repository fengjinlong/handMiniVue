import {readonlyHandlers, mutableHandlers } from './baseHandlers'
export const enum ReactiveFlegs {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isREADONLY'
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers)
}
export function isReadOnly(raw) {
  return !!raw[ReactiveFlegs.IS_READONLY]
}
function createActiveObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers)
}

export function isReactive (raw) {
  return !!raw[ReactiveFlegs.IS_REACTIVE]
}