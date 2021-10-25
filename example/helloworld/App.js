import {
  h
} from '../../lib/guide-mini-vue.esm.js'
import {
  Foo
} from './Foo.js'
window.self = null
export const APP = {
  render() {
    window.self = this
    return h('div', {
        id: 'root',
        class: ['red', 'head'],
        onClick() {
          console.log('click')
        }
        // string
      }, [
        h('div', {}, 'hi' + this.msg),
        h(Foo, {count: 1})
      ]
      // array
      // }, [
      //   h('p', {
      //     class: 'red'
      //   }, 'hi ' + this.msg),
      //   h('p', {
      //     class: 'green'
      //   }, 'mini-vue')
      // ]
    )
  },
  setup() {
    return {
      msg: 'this setState'
    }
  }
}