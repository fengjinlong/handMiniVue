import { extend } from "../share";

class ReactiveEffect {
  private fn:any
  onStop:any;
  deps = [];
  active = true;
  constructor(fn, public scheduler?: Function | undefined) {
    this.fn = fn
  }
  run() {
    activeEffect = this
    return this.fn()
  }
  stop() {
    if (this.active) {
      cleanupEffect(this)
      this.onStop && this.onStop()
      this.active = false
    }
    // this.deps.forEach(dep => {
    //   dep.delete(this)
    // })
  }
}

function cleanupEffect(effect) {
    
    effect.deps.forEach(dep => {
      dep.delete(effect)
    });
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
  activeEffect && activeEffect.deps.push(dep)
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
  onStop?: Function
}
export function effect(fn, options?: O) {
  const _effect = new ReactiveEffect(fn, options?.scheduler)
  extend(_effect, options)

  _effect.run()

  const runner = _effect.run.bind(_effect)

  runner.effect = _effect

  return runner
}
export function stop(runner) {
  runner.effect.stop()
}
