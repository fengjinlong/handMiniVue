import { PublicInstanceProxyHandlers } from "./componentPublicInstance"

export function createComponnentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupResult: {},
  }
  return component
}

export function setupComponnent(instance) {
  // TODO
  // initProps();
  // initSlots

  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type


  instance.proxy = new Proxy({_: instance}, PublicInstanceProxyHandlers)
  const { setup } = Component
  if (setup) {
    const setupResult = setup()
    handleSetupResult(instance, setupResult)
  }
}
function handleSetupResult(instance: any, setupResult: any) {
  // function object
  // TODO function
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const Component = instance.type
  // if(Component.render) {
  instance.render = Component.render
  // }
}
