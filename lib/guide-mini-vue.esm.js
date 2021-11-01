var extend = Object.assign;
var isObject = function (value) {
    return value !== null && typeof value === 'object';
};
var hasOwn = function (val, key) { return Object.prototype.hasOwnProperty.call(val, key); };
var camelize = function (str) {
    return str.replace(/-(\w)/g, function (_, c) {
        return c ? c.toUpperCase() : '';
    });
};
var capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
var toHandlerKey = function (str) {
    return str ? 'on' + capitalize(str) : '';
};

var targetMap = new Map();
function trigger(target, key) {
    var depsMap = targetMap.get(target);
    var dep = depsMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    for (var _i = 0, dep_1 = dep; _i < dep_1.length; _i++) {
        var effect_1 = dep_1[_i];
        if (effect_1.scheduler) {
            effect_1.scheduler();
        }
        else {
            effect_1.run();
        }
    }
}

var get = createGetter();
var set = createSetter();
var shallowReadonlyGer = createGetter(false, true);
var readonlyGet = createGetter(true);
function createGetter(isReadOnly, shallow) {
    if (isReadOnly === void 0) { isReadOnly = false; }
    if (shallow === void 0) { shallow = false; }
    return function get(target, key) {
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadOnly;
        }
        if (key === "__v_isREADONLY" /* IS_READONLY */) {
            return isReadOnly;
        }
        var res = Reflect.get(target, key);
        if (shallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadOnly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        var res = Reflect.set(target, key, value);
        // 触发依赖
        trigger(target, key);
        return res;
    };
}
var mutableHandlers = {
    get: get,
    set: set,
};
var readonlyHandlers = {
    get: readonlyGet,
    set: function (target, key) {
        console.warn(key + " \u4E0D\u80FDset\uFF0Creadonly\uFF01");
        return true;
    },
};
var shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGer
});

function reactive(raw) {
    return createReactiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers);
}
function createReactiveObject(raw, baseHandlers) {
    return new Proxy(raw, baseHandlers);
}
function shallowReadonly(raw) {
    return createReactiveObject(raw, shallowReadonlyHandlers);
}

function emit(instance, event) {
    var arg = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        arg[_i - 2] = arguments[_i];
    }
    var props = instance.props;
    // add -> Add
    // add-add -> addAdd
    var handlerName = toHandlerKey(camelize(event));
    console.log(handlerName);
    var handler = props[handlerName];
    handler && handler.apply(void 0, arg);
}

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; },
    $slots: function (i) { return i.slots; },
};
var PublicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        var setupState = instance.setupState, props = instance.props;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        // $el
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
};

function initSlots(instance, children) {
    var vnode = instance.vnode;
    if (vnode.shapeFlag & 16 /* SLOT_CHILDREN */) {
        normalizeObjectSlots(children, instance.slots);
    }
}
function normalizeObjectSlots(children, slots) {
    var _loop_1 = function (key) {
        var value = children[key];
        slots[key] = function (props) { return normalizeSlotValue(value(props)); };
    };
    for (var key in children) {
        _loop_1(key);
    }
    // instance.slots = slots;
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        emit: function () { },
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    // TODO
    // console.log(instance)
    initProps(instance, instance.vnode.props);
    // initProps(instance, instance.props);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    var Component = instance.type;
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
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

var Fragment = Symbol("Fragment");
var Text = Symbol("Text");
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
    // 组件 + children object
    if (vnode.shapeFlag & 2 /* STATEFUL_COMPONENT */) {
        if (typeof children === "object") {
            vnode.shapeFlag |= 16 /* SLOT_CHILDREN */;
        }
    }
    return vnode;
}
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}
function getShapeFlag(type) {
    return typeof type === 'string' ? 1 /* ELEMENT */ : 2 /* STATEFUL_COMPONENT */;
}

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    // 判断vnode是否是element
    // console.log(vnode.type)
    var type = vnode.type, shapeFlag = vnode.shapeFlag;
    // Framement -> 只渲染 children
    // element
    // if (typeof vnode.type === 'string') {
    //  0001 & 0001 ? 0010 & 0001
    switch (type) {
        case Fragment:
            processFragment(vnode, container);
            break;
        case Text:
            processText(vnode, container);
            break;
        default:
            if (shapeFlag & 1 /* ELEMENT */) {
                processElement(vnode, container);
                // } else if (isObject(vnode.type)) {
                // 0001 & 0010 ? 0010 & 0010
            }
            else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
                processComponent(vnode, container);
            }
            break;
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
    var instance = createComponentInstance(initialVNode);
    // 初始化组件，初始化一些属性挂载
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    var proxy = instance.proxy;
    // console.log(instance)
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
function processFragment(vnode, container) {
    mountChildren(vnode, container);
}
function processText(vnode, container) {
    var children = vnode.children;
    var textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
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

function renderSolts(slots, name, props) {
    console.log('render');
    var slot = slots[name];
    if (slot) {
        if (typeof slot === "function") {
            return createVNode(Fragment, {}, slot(props));
        }
    }
}

export { createApp, createTextVNode, h, renderSolts };
