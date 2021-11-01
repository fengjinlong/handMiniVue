import {
  h,
  createTextVNode
} from '../../lib/guide-mini-vue.esm.js'
import {
  Foo
} from './Foo.js'

export const APP = {
  render() {
    const app = h('div', {}, 'app')
    const foo = h(Foo, {}, {

      header: ({
        age
      }) => [h('p', {}, 'header' + age),
        createTextVNode('text node')
      ],
      footer: () => h('p', {}, 'footer')
    })

    return h('div', {},
      [app, foo]
    )
  },
  setup() {
    return {
      msg: 'this setState'
    }
  }
}