import { createVNode } from '../vnode'

export function renderSolts(slots, name, props) {
  console.log('render')
  const slot = slots[name]
  if (slot) {
    if(typeof slot === "function") {

      return createVNode('div', {}, slot(props))
    }
  }
}
