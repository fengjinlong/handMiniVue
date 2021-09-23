import { extend } from '../share'
let activeEffect
let shouldTrack
class ReactiveEffect {
  private fn: any
  onStop: any
  deps = []
  active = true
  constructor(fn, public scheduler?: Function | undefined) {
    this.fn = fn
  }
  run() {
    if (!this.active) {
      return this.fn()
    }
    // 可以收集依赖
    shouldTrack = true
    activeEffect = this

    // 收集完关闭
    let result = this.fn()
    shouldTrack = false
    return result
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
  })
  effect.deps.length = 0
}

const targetMap = new Map()
export function track(target, key) {
  if (!isTracking()) return
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

  trackEffects(dep)
}

export function trackEffects(dep) {
  if (dep.has(activeEffect)) return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function isTracking() {
  return !!activeEffect && !!shouldTrack
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)
  triggerEffects(dep)
}
export function triggerEffects(dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

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
