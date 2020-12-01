/*
 * @Author: fumin
 * @Description:这个指令是表头筛选框打开时滑动滚动条，触发回调函数
 * 是为了防止筛选框不关闭且跟着滚动条滑到弹框外。
 * @Date: 2020-03-26 17:55:47
 * @LastEditors: fumin
 */
// v-dialogclose="{id:'.class'}"
export default {
  bind(el, binding, vnode) {
    const SELECTWRAP_DOM = el.querySelector(binding.value.id)// 节点id或者class
    SELECTWRAP_DOM.addEventListener('scroll', function () {
      SELECTWRAP_DOM.click()
    });
  },
  unbind(el, binding, vnode) {
    const SELECTWRAP_DOM = el.querySelector(binding.value.id)// 节点id或者class
    SELECTWRAP_DOM.removeEventListener('scroll', function () {
      SELECTWRAP_DOM.click()
    });
  }
}
