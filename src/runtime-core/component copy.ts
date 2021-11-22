import { shallowReadonly } from '../reactivity/reactive'
import { proxyRefs } from '../reactivity/ref'
import { emit } from './componentEmit'
import { initProps } from './componentProps'
import { PublicInstanceProxyHandlers } from './componentPublicInstance'
import { initSlots } from './componentSlots'

export function createComponentInstance(vnode, parent) {
  console.log('createComponentInstance:', parent)
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    parent,
    provides: parent ? parent.provides : {},
    emit: () => {},
  }
  component.emit = emit.bind(null, component) as any;
  return component
}

export function setupComponent(instance) {
  // TODO
  // console.log(instance)
  initProps(instance, instance.vnode.props);
  // initProps(instance, instance.props);
  initSlots(instance, instance.vnode.children);

  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type

  instance.proxy = new Proxy({_: instance}, PublicInstanceProxyHandlers)
  const { setup } = Component
  if (setup) {
    setCurrentInstance(instance)
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    })
    setCurrentInstance(null)
    handleSetupResult(instance, setupResult)
  }
}
function handleSetupResult(instance: any, setupResult: any) {
  // function object
  // TODO function
  if (typeof setupResult === 'object') {
    instance.setupState = proxyRefs(setupResult)
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const Component = instance.type
  // if(Component.render) {
  instance.render = Component.render
  // }
}
let currentInstance = null
export function  getCurrentInstance () {
  return currentInstance
}
export function setCurrentInstance (instance) {
  currentInstance = instance
}

