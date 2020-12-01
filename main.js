/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-06 15:01:32
 * @LastEditTime: 2020-07-16 13:49:32
 * @LastEditors: mybells
 */

import Vue from 'vue'
import App from './App'
import Sunflower from 'vue-sunflower'
// import Sunflower from './sunflower.js'
import router from './router'
import store from './store'
import Portlet from './portlet/main'
import {setComponentsPath} from 'SunflowerConfig'
import {judgeRoleBtn, tabIndexName} from './common/utils/roleAuth'
import './permission'
import './common/directive'
import $axios from 'sunflower-ajax'

Vue.prototype.judgeRoleBtn = judgeRoleBtn; // 按钮是否拥有权限
Vue.prototype.tabIndexName = tabIndexName;  // 默认显示第一个为true的页签
Vue.config.productionTip = false;
// 处理已经编译好组件的ajax路径问题
setComponentsPath(process.env.BASE_API);

/* 重写window.Date,和服务器时间一致 */
$axios.get('/systemmanager/systemsetting/getCurrentSysTime').then(res => {
  console.log(new Date())
  let serverDate = new Date(res.data);
  let difference = serverDate - new Date();
  let temp = window.Date;
  window.Date = function() {
    if (arguments.length) {
      return new temp(...arguments);
    } else {
      return new temp(difference + new temp().getTime());
    }
  }
  window.Date.prototype = temp.prototype;
  window.Date.parse = temp.parse;
  window.Date.now = function() {
    return Date().getTime();
  };
})
Vue.use(Sunflower)
// 自定义首页功能
Vue.use(Portlet)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
