import { createVNode } from './vnode'
export function createAppAPI(render) {
  return function createApp(rootComponent) {
    return {
      mount(rootContainer) {
        // 组件转换为虚拟节点
        const vnode = createVNode(rootComponent)
        render(vnode, rootContainer)
      },
    }
  }
}
