import { isObject } from '../shared/index'
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text } from './vnode'

export function render(vnode, container) {
  patch(vnode, container, null)
}

function patch(vnode: any, container: any, parentComponent) {
  // 判断vnode是否是element
  // console.log(vnode.type)
  const { type, shapeFlag } = vnode

  // Framement -> 只渲染 children

  // element
  // if (typeof vnode.type === 'string') {
  //  0001 & 0001 ? 0010 & 0001

  switch (type) {
    case Fragment:
      processFragment(vnode, container, parentComponent)
      break

    case Text:
      processText(vnode, container)
      break
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container, parentComponent)
        // } else if (isObject(vnode.type)) {
        // 0001 & 0010 ? 0010 & 0010
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container, parentComponent)
      }

      break
  }
}

function processElement(vnode: any, container: any, parentComponent) {
  mountElement(vnode, container,parentComponent)
}
function mountElement(vnode: any, container: any, parentComponent) {
  const el = (vnode.el = document.createElement(vnode.type))
  // console.log(el)
  const { children, shapeFlag } = vnode
  // if (typeof children === 'string') {
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
    // } else if (Array.isArray(children)) {
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el, parentComponent)
  }

  const { props } = vnode
  for (const key in props) {
    const val = props[key]
    const isOn = (key: string) => /^on[A-Z]/.test(key)
    if (isOn(key)) {
      const event = key.slice(2).toLocaleLowerCase()
      el.addEventListener(event, val)
    } else {
      el.setAttribute(key, val)
    }
  }
  // console.log(el)
  container.append(el)
}

function processComponent(vnode: any, container: any, parentComponent) {
  mountComponent(vnode, container, parentComponent)
}

function mountComponent(initialVNode: any, container: any, parentComponent) {
  // 组件实例对象 instance
  const instance = createComponentInstance(initialVNode, parentComponent)

  // 初始化组件，初始化一些属性挂载
  setupComponent(instance)

  setupRenderEffect(instance, initialVNode, container)
}
function setupRenderEffect(instance: any, initialVNode: any, container: any) {
  const { proxy } = instance
  // console.log(instance)

  const subTree = instance.render.call(proxy)
  // vnode - patch
  // vnode -element - mountElement;
  patch(subTree, container, instance)
  initialVNode.el = subTree.el
}
function mountChildren(vnode: any, container: any, parentComponent: any) {
  vnode.children.forEach(v => {
    patch(v, container, parentComponent)
  })
}
function processFragment(vnode: any, container: any,parentComponent) {
  mountChildren(vnode, container, parentComponent)
}
function processText(vnode: any, container: any) {
  const {children} = vnode
  const textNode = (vnode.el = document.createTextNode(children))
  container.append(textNode)
}


