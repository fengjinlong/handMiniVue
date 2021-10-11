import {
  h
} from '../../lib/guide-mini-vue.esm.js'
window.self = null
export const APP = {
  render() {
    window.self = this
    return h('div', {
      id: 'root',
      class: ['red', 'head']
    // string
    // }, 'hi ' + this.msg
    // array
    }, [
      h('p', {class: 'red'}, 'hi ' + this.msg),
      h('p', {class: 'green'}, 'mini-vue')
    ]
    )
  },
  setup() {
    return {
      msg: 'this setState'
    }
  }
}