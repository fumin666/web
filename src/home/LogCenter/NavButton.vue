/*
* @Author: alex
* @Date: 2019/10/28
* @Last Modified by: fumin
* @Last Modified time: 2019-10-28 13:59:38
*/

<template>
  <div>
    <ul class="accountBtns">
      <li v-for="item in itemList" :key="item.id" @click="click(item.data)" class="logTabClass" :class="[tabIndex === item.data ? 'active' : '']">
        <i :class="`iconfont icon-${item.icon}`"></i>
        <span>
          {{item.name}}
        </span>
      </li>
      <div class="clr"></div>
    </ul>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        itemList: [],
        tabIndex: 'logCenter_base',
        nav: {
          logCenterDynamic1: [
            {icon: 'BasicUniversal-Report', name: '基础通用', type: 'goto', data: 'logCenter_base'},
            {icon: 'Monitoring-Report', name: '资产监控', type: 'goto', data: 'logCenter_imp'},
            {icon: 'Basicoperations-Report', name: '基础运维', type: 'goto', data: 'logCenter_oma'},
            {icon: 'Logaudit-Report', name: '日志审计', type: 'goto', data: 'logCenter_siem'},
            {icon: 'Process-Report', name: '流程管理', type: 'goto', data: 'logCenter_itil'},
            {icon: 'database-audit', name: '数据库审计', type: 'goto', data: 'logCenter_dba'}
          ]
        }
      }
    },
    props: {
      modelName: {
        type: String
      }
    },
    created() {
      let navObj = this.nav
      let parameter = ''
      this.modelName.indexOf('logCenterDynamic') > -1 ? parameter = 'logCenter' : parameter = this.modelName
      $axios.get(`/iamUserInfo/getSecondMenuListByKeyWord/${parameter}`).then(({data}) => {
        if (data) {
          let menuList = data.map(item => {
            return item.menuName
          })
          let currentNav = navObj[this.modelName].filter(item => menuList.indexOf(item.name) !== -1)
          this.itemList = currentNav
          this.$emit('buttonCount', currentNav.length)
        }
      });
    },
    methods: {
      click(data) {
        this.tabIndex = data
        this.$emit('goto', data)
      }
    }
  }
</script>
<style lang="stylus">
.accountBtns
  .active
    color #ffffff;
    opacity 1
</style>
