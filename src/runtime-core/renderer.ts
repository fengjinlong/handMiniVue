import { createComponnentInstance, setupComponnent } from './component'

export function render(vnode, container) {
  patch(vnode, container)
}

function patch(vnode: any, container: any) {
  // 判断vnode是否是element 
  // processElement() 
  processComponent(vnode, container)
}
function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountComponent(vnode: any, container: any) {
  // 组件实例对象 instance
  const instance = createComponnentInstance(vnode)

  // 初始化组件，初始化一些属性挂载
  setupComponnent(instance)
  
  setupRenderEffect(instance, container)
}
function setupRenderEffect(instance: any, container: any) {
  const subTree = instance.render()
  // vnode - patch
  // vnode -element - mountElement;
  patch(subTree, container)
}



