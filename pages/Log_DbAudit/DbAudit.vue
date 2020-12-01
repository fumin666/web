<template>
  <section class="content" style="margin-top: 20px;">
    <s-tab type="card" v-model="activeTab">
      <s-tab-pane label="客户端工具统计" name="pane1" v-if="judgeRoleBtn('logCenter_dbaAuditClientTool')">
        <client v-if="activeTab === 'pane1'"></client>
      </s-tab-pane>
      <s-tab-pane label="数据库账号统计" name="pane2" v-if="judgeRoleBtn('logCenter_dbaAuditAccount')">
        <db-account v-if="activeTab === 'pane2'"></db-account>
      </s-tab-pane>
    </s-tab>
  </section>
</template>

<script type="text/babel">
  // import $axios from 'sunflower-ajax';
  import Client from './Client.vue'
  import DbAccount from './DbAccount.vue'
  export default {
    data () {
      return {
        tabNameArr: ['logCenter_dbaAuditClientTool', 'logCenter_dbaAuditAccount'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    components: {
      Client,
      DbAccount
    },
    methods: {
    },
    mounted() {
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    }
  }
</script>
