<!--
 * @Description: In User Settings Edit
 * @Author: 仝希博
 * @LastEditors  : mybells
 * @Date: 2019-04-19 13:26:57
 * @LastEditTime : 2019-12-26 10:09:50
 -->

<template>
  <section style="padding-top:15px;">
    <s-col span="4">
      <s-menu :active-name="activeTab" @on-select="selection" style="font-size:14px">
        <s-menu-item name="pane1" v-if="judgeRoleBtn('assetsManage_businessSysManagement')">
          <i class="icon iconfont icon-business-server"></i>
          业务系统管理
        </s-menu-item>
        <s-menu-item name="pane2" v-if="judgeRoleBtn('assetsManage_businessRoleManagement')">
          <i class="icon iconfont icon-user"></i>
          业务角色管理
        </s-menu-item>
        <s-menu-item name="pane3" v-if="judgeRoleBtn('assetsManage_businessAccountManagement')">
          <i class="iconfont icon-admin-configuration"></i>
          业务账号管理
        </s-menu-item>
        <s-menu-item name="pane4" v-if="judgeRoleBtn('assetsManage_timedTaskManagement')">
          <i class="iconfont icon-time"></i>
          定时任务管理
        </s-menu-item>
      </s-menu>
    </s-col>
    <s-col span="20" style="padding-left:20px;">
      <Business-system v-if="activeTab === 'pane1'"></Business-system>
      <Role-System v-if="activeTab === 'pane2'"></Role-System>
      <business-account v-if="activeTab === 'pane3'"></business-account>
      <Timing-Task v-if="activeTab === 'pane4'"></Timing-Task>
    </s-col>
  </section>
</template>
<script>
import BusinessSystem from './BusinessSystem'
import RoleSystem from './RoleSystem'
import BusinessAccount from './BusinessAccount'
import TimingTask from './TimingTask'
export default {
  data() {
    return {
      tabNameArr: ['assetsManage_businessSysManagement', 'assetsManage_businessRoleManagement', 'assetsManage_businessAccountManagement', 'assetsManage_timedTaskManagement'], // 页签名字的集合(顺序和页签一致)
      activeTab: 'pane1'
    }
  },
  created() {
    this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
  },
  methods: {
    selection(key) {
      this.activeTab = key
    }
  },
  components: {
    BusinessSystem,
    BusinessAccount,
    RoleSystem,
    TimingTask
  }
}
</script>

