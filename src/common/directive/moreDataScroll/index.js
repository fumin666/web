/*
 * @Author: 高建鹏
 * @Description:这个指令是滚动到最下端时触发回调函数
 * 是为了渲染大数据而准备的，因为如果数据太多，会导致渲染dom时卡死。
 * @Date: 2019-09-02 17:55:47
 * @LastEditors: 高建鹏
 */
// v-loadmoredata="{id:'.class',callback:function(){},arg:{page:2,onceCount:100}}"
export default {
  bind(el, binding, vnode) {
    const SELECTWRAP_DOM = el.querySelector(binding.value.id)// 节点id或者class
    SELECTWRAP_DOM.addEventListener('scroll', function () {
      const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight
      if (CONDITION) {
        binding.value.callback(...Object.values(binding.value.arg))// callback是回调函数，arg是参数对象
      }
    });
  }
}
