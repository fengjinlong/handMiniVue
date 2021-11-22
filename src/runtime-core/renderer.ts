import { effect } from "../reactivity/effect";
import { isObject } from "../shared/index";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
  } = options;
  function render(vnode, container) {
    patch(null,vnode, container, null);
  }

  // n1 老的
  // n2 新的
  function patch(n1, n2: any, container: any, parentComponent) {
    // 判断vnode是否是element
    // console.log(vnode.type)
    const { type, shapeFlag } = n2;

    // Framement -> 只渲染 children

    // element
    // if (typeof vnode.type === 'string') {
    //  0001 & 0001 ? 0010 & 0001

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent);
        break;

      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent);
          // } else if (isObject(vnode.type)) {
          // 0001 & 0010 ? 0010 & 0010
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent);
        }

        break;
    }
  }

  function processElement(n1, n2: any, container: any, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container);
    }
  }
  function patchElement(n1: any, n2, container) {
    console.log('n1',n1)
    console.log('n2',n2)
  }
  function mountElement(vnode: any, container: any, parentComponent) {
    // const el = (vnode.el = document.createElement(vnode.type))
    const el = (vnode.el = hostCreateElement(vnode.type));
    // console.log(el)
    const { children, shapeFlag } = vnode;
    // if (typeof children === 'string') {
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
      // } else if (Array.isArray(children)) {
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent);
    }

    const { props } = vnode;
    for (const key in props) {
      const val = props[key];
      // const isOn = (key: string) => /^on[A-Z]/.test(key)
      // if (isOn(key)) {
      //   const event = key.slice(2).toLocaleLowerCase()
      //   el.addEventListener(event, val)
      // } else {
      //   el.setAttribute(key, val)
      // }
      hostPatchProp(el, key, val);
    }
    // container.append(el)
    hostInsert(el, container);
  }

  function processComponent(n1,n2: any, container: any, parentComponent) {
    mountComponent(n2, container, parentComponent);
  }

  function mountComponent(initialVNode: any, container: any, parentComponent) {
    // 组件实例对象 instance
    const instance = createComponentInstance(initialVNode, parentComponent);

    // 初始化组件，初始化一些属性挂载
    setupComponent(instance);

    setupRenderEffect(instance, initialVNode, container);
  }
  function setupRenderEffect(instance: any, initialVNode: any, container: any) {
    console.log(111);
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance;

        const subTree = (instance.subTree = instance.render.call(proxy));
        // vnode - patch
        // vnode -element - mountElement;
        patch(null,subTree, container, instance);
        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log("update");
        const {proxy} = instance
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree
        // 更新subTree
        instance.subTree = subTree
        patch(prevSubTree,subTree,container,instance)

        console.log('current', subTree)
        console.log('prev', prevSubTree)
      }
    });
  }
  function mountChildren(vnode: any, container: any, parentComponent: any) {
    vnode.children.forEach((v) => {
      patch(null,v, container, parentComponent);
    });
  }
  function processFragment(n1,n2: any, container: any, parentComponent) {
    mountChildren(n2, container, parentComponent);
  }
  function processText(n1,n2: any, container: any) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }
  return {
    createApp: createAppAPI(render),
  };
}
