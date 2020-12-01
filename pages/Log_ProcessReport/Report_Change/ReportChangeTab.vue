/**
* Created by songyf on 2019/7/29.
* 报表中心-流程统计报表-事件流程报表.
*/

<template>
  <div style="margin: 20px 0 20px 5px">
    <s-tab type="card" v-model="activeTab">
      <s-tab-pane label="按变更路径统计变更总数" name="pane1" v-if="judgeRoleBtn('logCenter_changePath')">
        <change-path v-if="activeTab === 'pane1'"></change-path>
      </s-tab-pane>
      <s-tab-pane label="变更积压数统计" name="pane2" v-if="judgeRoleBtn('logCenter_changeNumber')">
        <change-backlog v-if="activeTab === 'pane2'"></change-backlog>
      </s-tab-pane>
      <s-tab-pane label="变更成功率统计" name="pane3" v-if="judgeRoleBtn('logCenter_changeSuccessRate')">
        <change-success v-if="activeTab === 'pane3'"></change-success>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script>
  import ChangePath from './ChangePath'
  import ChangeBacklog from './ChangeBacklog'
  import ChangeSuccess from './ChangeSuccess'
  export default {
    data() {
      return {
        tabNameArr: ['logCenter_changePath', 'logCenter_changeNumber', 'logCenter_changeSuccessRate'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    components: {
      ChangePath,
      ChangeBacklog,
      ChangeSuccess
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    }
  }
</script>
<style lang="stylus">

</style>
