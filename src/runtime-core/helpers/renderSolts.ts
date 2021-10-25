import { createVNode } from "../vnode";

export function renderSolts (slots) {
  return createVNode('div', {}, slots);
}

