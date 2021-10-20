var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; }
};
var PublicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        var setupState = instance.setupState;
        if (key in setupState) {
            console.log(key);
            return setupState[key];
        }
        // $el
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
};

function createComponnentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupResult: {},
    };
    return component;
}
function setupComponnent(instance) {
    // TODO
    // initProps();
    // initSlots
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    var Component = instance.type;
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // function object
    // TODO function
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    // if(Component.render) {
    instance.render = Component.render;
    // }
}

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    // 判断vnode是否是element
    // console.log(vnode.type)
    var shapeFlag = vnode.shapeFlag;
    // element
    // if (typeof vnode.type === 'string') {
    //  0001 & 0001 ? 0010 & 0001
    if (shapeFlag & 1 /* ELEMENT */) {
        processElement(vnode, container);
        // } else if (isObject(vnode.type)) {
        // 0001 & 0010 ? 0010 & 0010
    }
    else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    var el = (vnode.el = document.createElement(vnode.type));
    // console.log(el)
    var children = vnode.children, shapeFlag = vnode.shapeFlag;
    // if (typeof children === 'string') {
    if (shapeFlag & 4 /* TEXT_CHILDREN */) {
        el.textContent = children;
        // } else if (Array.isArray(children)) {
    }
    else if (shapeFlag & 8 /* ARRAY_CHILDREN */) {
        mountChildren(vnode, el);
    }
    var props = vnode.props;
    for (var key in props) {
        var val = props[key];
        var isOn = function (key) { return /^on[A-Z]/.test(key); };
        if (isOn(key)) {
            var event_1 = key.slice(2).toLocaleLowerCase();
            el.addEventListener(event_1, val);
        }
        else {
            el.setAttribute(key, val);
        }
    }
    // console.log(el)
    container.append(el);
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
    // 组件实例对象 instance
    var instance = createComponnentInstance(initialVNode);
    // 初始化组件，初始化一些属性挂载
    setupComponnent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    var proxy = instance.proxy;
    console.log(instance);
    var subTree = instance.render.call(proxy);
    // vnode - patch
    // vnode -element - mountElement;
    patch(subTree, container);
    initialVNode.el = subTree.el;
}
function mountChildren(vnode, container) {
    vnode.children.forEach(function (v) {
        patch(v, container);
    });
}

function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        shapeFlag: getShapeFlag(type),
        el: null,
    };
    if (typeof children === "string") {
        vnode.shapeFlag |= 4 /* TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ARRAY_CHILDREN */;
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === 'string' ? 1 /* ELEMENT */ : 2 /* STATEFUL_COMPONENT */;
}

function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            // 组件转换为虚拟节点
            var vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
