<template>
  <section class="content" style="margin-top: 20px;">
    <s-tab type="card" v-model="activeTab">
      <s-tab-pane label="DDL操作报表" name="pane1" v-if="judgeRoleBtn('logCenter_dbaOperationDDLReport')">
        <ddl v-if="activeTab === 'pane1'"></ddl>
      </s-tab-pane>
    <s-tab-pane label="DML操作报表" name="pane2" v-if="judgeRoleBtn('logCenter_dbaOperationDMLReport')">
        <dml v-if="activeTab === 'pane2'"></dml>
      </s-tab-pane>
    <s-tab-pane label="DCL操作报表" name="pane3" v-if="judgeRoleBtn('logCenter_dbaOperationDCLReport')">
        <dcl v-if="activeTab === 'pane3'"></dcl>
      </s-tab-pane>
    </s-tab>
  </section>
</template>

<script type="text/babel">
  // import $axios from 'sunflower-ajax';
  import Ddl from './Ddl.vue'
  import Dml from './Dml.vue'
  import Dcl from './Dcl.vue'
  export default {
    data () {
      return {
        tabNameArr: ['logCenter_dbaOperationDDLReport', 'logCenter_dbaOperationDMLReport', 'logCenter_dbaOperationDCLReport'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    components: {
      Ddl,
      Dml,
      Dcl
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

<style lang="stylus" rel="stylesheet/stylus">
</style>
