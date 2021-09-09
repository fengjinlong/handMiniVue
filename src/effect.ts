class ReactiveEffect {
  private fn
  constructor(fn, public scheduler?: Function | undefined) {
    this.fn = fn
  }
  run() {
    activeEffect = this
    return this.fn()
  }
}

const targetMap = new Map()
export function track(target, key) {
  // track -- key -- dep
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  dep.add(activeEffect)
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target)
  let deps = depsMap.get(key)
  for (const effect of deps) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

let activeEffect

interface O {
  scheduler?: Function 
}
export function effect(fn, options?:O) {
  const _effect = new ReactiveEffect(fn, options?.scheduler)
  _effect.run()

  return _effect.run.bind(_effect)
}
