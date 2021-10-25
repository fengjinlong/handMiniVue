import {
  h
} from '../../lib/guide-mini-vue.esm.js'
import {
  Foo
} from './Foo.js'

export const APP = {
  render() {
    const app = h('div', {}, 'app')
    const foo = h(Foo, {}, [h('p', {}, 'slot-p-123')])
    return h('div', {}, [
      h('div', {}, [
        app, foo
      ])
    ])
  },
  setup() {
    return {
      msg: 'this setState'
    }
  }
}