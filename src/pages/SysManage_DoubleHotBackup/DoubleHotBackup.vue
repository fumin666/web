/*
create by YOU
*/
<template>
  <div class="sys-ope-log">
    <s-tab type="card" v-model="tab">
      <s-tab-pane label="双机热备设置" name="1">
        <d-h-b-set v-if="tab === '1' && completed" :isRealIP="isRealIP"></d-h-b-set>
      </s-tab-pane>
      <s-tab-pane label="双机热备告警设置" name="2" :vif="!isRealIP">
        <d-h-b-alarm-set v-if="tab === '2'"></d-h-b-alarm-set>
      </s-tab-pane>
      <s-tab-pane label="双机热备告警日志" name="3">
        <d-h-b-alarm-log v-if="tab === '3'"></d-h-b-alarm-log>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import DHBSet from './DHBSet.vue'
  import DHBAlarmSet from './DHBAlarmSet.vue'
  import DHBAlarmLog from './DHBAlarmLog.vue'
  export default {
    components: {
      DHBSet,
      DHBAlarmSet,
      DHBAlarmLog
    },
    data() {
      return {
        tab: '1',
        isRealIP: false,
        completed: false
      }
    },
    created() {
      this.completed = false
      $axios.post(`/systemmanager/sysConfig/isVirtualIp`, {
        ip: window.theIP || $axios.basePath().replace(/[^\/]*[\/]{2}/, '').replace(/\//, '')
      }).then(({data}) => {
        this.isRealIP = !data
        this.completed = true
      })
      // 判断ip类型
    },
    methods: {}
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
