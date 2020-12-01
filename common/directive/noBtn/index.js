import store from '@/store'
export default { // 细粒度权限按钮控制
  inserted: function (el, binding) {
    if (!permissionJudge(binding.value)) {
      el.parentNode.removeChild(el);
    }
    function permissionJudge(value) {
      let authMenu = store.getters.authMenu;// 获取所有一级目录
      for (let item of authMenu) {
        if (item.keyWord === value) {
          return true;
        }
      }
      return false;
    }
  }
}
