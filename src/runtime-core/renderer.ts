import { isObject } from '../share/index'
import { createComponnentInstance, setupComponnent } from './component'

export function render(vnode, container) {
  patch(vnode, container)
}

function patch(vnode: any, container: any) {
  // 判断vnode是否是element
  // console.log(vnode.type)
  if (typeof vnode.type === 'string') {
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container)
  }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container)
}
function mountElement(vnode: any, container: any) {
  const el = (vnode.el= document.createElement(vnode.type))
  // console.log(el)
  const { children } = vnode
  if (typeof children === 'string') {
    el.textContent = children
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el)
    
  }

  const { props } = vnode
  for (const key in props) {
    const val = props[key]
    el.setAttribute(key, val)
  }
  // console.log(el)
  container.append(el)
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountComponent(initialVNode: any, container: any) {
  // 组件实例对象 instance
  const instance = createComponnentInstance(initialVNode)

  // 初始化组件，初始化一些属性挂载
  setupComponnent(instance)

  setupRenderEffect(instance, initialVNode, container)
}
function setupRenderEffect(instance: any,initialVNode:any, container: any) {
  const {proxy} = instance
  console.log(instance)

  const subTree = instance.render.call(proxy)
  // vnode - patch
  // vnode -element - mountElement;
  patch(subTree, container)
  initialVNode.el = subTree.el
}
function mountChildren(vnode: any, container: any) {
  vnode.children.forEach(v => {
    patch(v, container)
  })
}

