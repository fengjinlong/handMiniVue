export const extend = Object.assign

export function isObject(obj) {
  return obj !== null && typeof obj === "object"
}

export const hasChange = (val, newVal) => !Object.is(val, newVal) 