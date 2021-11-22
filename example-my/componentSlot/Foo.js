import {
  h,
  renderSolts
} from "../../lib/guide-mini-vue.esm.js";

export const Foo = {
  setup() {
    return {}
  },
  render() {
    const foo = h('p', {}, 'foo')
    console.log(this.$slots)

    // 具名
    // 获取到渲染元素
    // 获取渲染位置
    
    // 作用域
    const age = 18

    return h("div", {}, [
      renderSolts(this.$slots, 'header',{
        age
      }),
      foo,
      renderSolts(this.$slots, 'footer')
    ]);
  },
};