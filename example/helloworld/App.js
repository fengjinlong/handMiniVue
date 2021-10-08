import { h } from '../../lib/guide-mini-vue.esm.js'
export const APP = {
  render() {
    return h('div', this.msg)
  },
  setup() {
    return {
      msg: 'min-vue'
    }
  }
}