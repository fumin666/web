<template>
  <section class="log-alarm-more content">
    <s-tab type="card"
           v-model="activeTab">
      <!--<s-tab-pane label="账号关系统计" name="1">-->
      <!--<account-relationShip :show2="show2"></account-relationShip>-->
      <!--</s-tab-pane>-->
      <s-tab-pane label="账号稽核日志" name="pane1" v-if="judgeRoleBtn('logCenter_itcompCollectLog')">
        <audit-account v-if="activeTab ==='pane1'"></audit-account>
      </s-tab-pane>
      <s-tab-pane label="账号改密日志" name="pane2" v-if="judgeRoleBtn('logCenter_itcompModityPwLog')">
        <password-log v-if="activeTab ==='pane2'"></password-log>
      </s-tab-pane>
      <s-tab-pane label="验证改密日志" name="pane3" v-if="judgeRoleBtn('logCenter_itcompValidationModityPwLog')">
        <check-ps v-if="activeTab ==='pane3'"></check-ps>
      </s-tab-pane>
    </s-tab>
  </section>
</template>

<script>

  // import AccountRelationShip from './AccountRelationShip'
  import AuditAccount from './AuditAccount'
  import PasswordLog from './PasswordLog'
  import checkPs from './CheckPs.vue'
  import authCheck from '@/common/mixins/auth.js'
  // import {batchUuid} from 'sunflower-common-utils'

  export default {
    mixins: [authCheck],
    components: {

      // AccountRelationShip,
      AuditAccount,
      PasswordLog,
      checkPs
    },
    data() {
      return {
        tabNameArr: ['logCenter_itcompCollectLog', 'logCenter_itcompModityPwLog', 'logCenter_itcompValidationModityPwLog'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    methods: {
    },
    mounted() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
      if (this.$route.params.id) {
        // 定位到当前的选项卡并查询
        this.activeTab = `pane${Number(this.$route.params.id)}`;
      }
    }
  }
</script>
