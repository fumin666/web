/**
 * 角色验证
 */
import store from '@/store';
// 判断是否拥有权限的方法
export function judgeRoleBtn(val) {
  let authMenu = store.getters.authMenu;// 获取登录时的权限集合
  for (let item of authMenu) {
    if (item.keyWord === val) {
      return true;
    }
  }
  return false;
}
// 高亮第一个是true的页签
export function tabIndexName(tabNameArr) {
  let tabValueArr = [];
  tabNameArr.forEach((v) => {
    tabValueArr.push(judgeRoleBtn(v))
  });
  let tabIndex = tabValueArr.indexOf(true);
  return `pane${tabIndex + 1}`;
}
