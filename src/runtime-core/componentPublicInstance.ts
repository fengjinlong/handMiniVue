const publicPropertiesMap = {
  $el: (i) => i.vnode.el
}
export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setupState } = instance
    if (key in setupState) {
      console.log(key)
      return setupState[key]
    }
    // $el
    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) {
      return publicGetter(instance)
    }
  },
}
