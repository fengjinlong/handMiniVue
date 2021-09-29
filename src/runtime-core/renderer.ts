import { createComponnentInstance, setupComponnent } from './component'

export function render(vnode, container) {
  patch(vnode, container)
}

function patch(vnode: any, container: any) {
  processComponent(vnode, container)
}
function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountComponent(vnode: any, container: any) {
  const instance = createComponnentInstance(vnode)
  setupComponnent(instance)
  setupRenderEffect(instance, container)
}
function setupRenderEffect(instance: any, container: any) {
  const subTree = instance.render()
  // vnode - patch
  // vnode -element - mountElement;
  patch(subTree, container)
}

