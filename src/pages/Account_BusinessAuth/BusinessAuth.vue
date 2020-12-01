<!--
 * @Author: mybells
 * @Version://Q1IAM模块功能增强
 * @Description:业务权限管理
 * @Date: 2020-02-12 09:41:00
 * @LastEditors: mybells
 -->


<template>
  <section style="padding-top:15px; margin-left: -20px;">
    <s-col span="4">
      <s-menu :active-name="activeTab" @on-select="selection" style="font-size:14px">
        <s-menu-item name="pane1">
          <i class="icon iconfont icon-business-server"></i>
          应用系统资源管理
        </s-menu-item>
        <s-menu-item name="pane2">
          <i class="icon iconfont icon-user"></i>
          应用系统授权管理
        </s-menu-item>
        <s-menu-item name="pane3">
          <i class="icon iconfont icon-log"></i>
          应用授权认证日志
        </s-menu-item>
      </s-menu>
    </s-col>
    <s-col span="20" style="padding-left:20px;">
      <system-resource v-if="activeTab === 'pane1'"></system-resource>
      <system-auth v-if="activeTab === 'pane2'"></system-auth>
      <system-log v-if="activeTab === 'pane3'"></system-log>
    </s-col>
  </section>
</template>
<script>
import systemResource from './SystemResource'
import systemAuth from './SystemAuth'
import systemLog from './SystemLog'
export default {
  data() {
    return {
      // tabNameArr: ['assetsManage_businessSysManagement', 'assetsManage_businessRoleManagement', 'assetsManage_businessAccountManagement', 'assetsManage_timedTaskManagement'], // 页签名字的集合(顺序和页签一致)
      activeTab: 'pane1'
    }
  },
  created() {
    // this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
  },
  methods: {
    selection(key) {
      this.activeTab = key
    }
  },
  components: {
    systemResource,
    systemAuth,
    systemLog
  }
}
</script>

