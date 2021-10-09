import {
  h
} from '../../lib/guide-mini-vue.esm.js'
export const APP = {
  render() {
    return h('div', {
      id: 'root',
      class: ['red', 'head']
    // string
    // }, 'hi ' + this.msg
    // array
    }, [
      h('p', {class: 'red'}, 'hi '),
      h('p', {class: 'green'}, 'mini-vue')
    ]
    )
  },
  setup() {
    return {
      msg: 'min-vue'
    }
  }
}