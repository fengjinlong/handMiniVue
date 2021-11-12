import { getCurrentInstance } from "./component";

export function provide(key, value) {
  // 存
  const currentInstance = getCurrentInstance();

  let {providers} = currentInstance;
  const parentProvides = currentInstance.parent.providers;

  if (providers === parentProvides) {
    providers = currentInstance.providers = Object.create(parentProvides)
  }

  if (currentInstance) {
    const {providers} = currentInstance;
     providers[key] = value;
  }
}
export function inject(key, defaultValue) {
  // 取
  const currentInstance = getCurrentInstance();
  if (currentInstance) {
    const parentProvides = currentInstance.parent.providers;
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