import { getCurrentInstance } from "./component";

export function provide(key, value) {
  // 存
  const currentInstance = getCurrentInstance();

  let {provides} = currentInstance;
  const parentProvides = currentInstance.parent.provides;

  if (provides === parentProvides) {
    provides = currentInstance.provides = Object.create(parentProvides)
  }

  if (currentInstance) {
    const {provides} = currentInstance;
     provides[key] = value;
  }
}
export function inject(key, defaultValue) {
  // 取
  const currentInstance = getCurrentInstance();
  if (currentInstance) {
    const parentProvides = currentInstance.parent.provides;
    // return parentProvides && parentProvides[key]
    if (key in parentProvides) {
      return parentProvides[key];
    }else if(defaultValue){
      if(typeof defaultValue === "function"){
        return defaultValue()
      }
      return defaultValue
    }
  }
}