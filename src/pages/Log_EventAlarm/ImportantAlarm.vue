/**
 * @author fumin
 * @date 2019/7/23
 * @Description: 报表中心 -》告警统计报表 -》登录重要资产告警报表
*/
<template>
  <section class="content eventAccount" id="logAudit">
    <s-form :inline="true">
      <select-time ref="selecttime">
        <template slot="serachForm">
          <s-form-item label="运维用户：">
            <s-input v-model="params.userName"></s-input>
          </s-form-item>
          <s-form-item label="客户端IP：">
            <s-input v-model="params.clientIp"></s-input>
          </s-form-item>
          <s-form-item label="目标资产IP：">
            <s-input v-model="params.targetIp"></s-input>
          </s-form-item>
          <s-form-item label="目标资产名称：" label-width="110px">
            <s-input v-model="params.targetName"></s-input>
          </s-form-item>
        </template>
        <template slot="searchBtn">
          <div class="search_btn">
            <s-button title="查询" icon='magnifier' @click="getList">查询</s-button>
          </div>
        </template>
      </select-time>
    </s-form>
    <s-row style="margin: 15px 0 10px;">
      <s-button title="EXCEL报表" icon="excel" @click="DownloadHandle('excel')">EXCEL报表</s-button>
      <s-button title="WORD报表" icon="word" @click="DownloadHandle('word')">WORD报表</s-button>
      <s-button title="PDF报表" icon="pdf" @click="DownloadHandle('pdf')">PDF报表</s-button>
    </s-row>
    <s-table-page :data="topLists" >
      <s-table-column label="告警时间" prop="createTimeStr" width="170px" show-overflow-tooltip></s-table-column>
      <s-table-column label="级别" prop="levelStr" show-overflow-tooltip></s-table-column>
      <s-table-column label="运维用户" prop="userName" show-overflow-tooltip></s-table-column>
      <s-table-column label="客户端IP" prop="clientIp" show-overflow-tooltip></s-table-column>
      <s-table-column label="目标资产IP" prop="targetIp" show-overflow-tooltip></s-table-column>
      <s-table-column label="目标资产名称" prop="targetName" show-overflow-tooltip></s-table-column>
      <s-table-column label="资产账号" prop="accountName" show-overflow-tooltip></s-table-column>
      <s-table-column label="登录协议" prop="protocolName" show-overflow-tooltip></s-table-column>
      <s-table-column label="告警内容" prop="eventInfo" show-overflow-tooltip></s-table-column>
      <s-table-column label="会话ID" prop="sessionId"></s-table-column>
    </s-table-page>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  
  import SelectTime from '@/components/selectTime/SelectTime.vue'
  export default {
    components: {
      SelectTime
    },
    data() {
      return {
        params: {
          userName: '',
          targetIp: '',
          targetName: '',
          levelList: null,
          clientIp: '',
          eventInfo: ''
        },
        alarmLevel: [
          {name: '未知', value: 0},
          {name: '正常', value: 1},
          {name: '提示', value: 2},
          {name: '警告', value: 3},
          {name: '次要', value: 4},
          {name: '主要', value: 5},
          {name: '严重', value: 6}
        ],
        topLists: []
      }
    },
    methods: {
      // 点击会话ID跳转
      // showDetail(row) {
      //   this.$router.push({path: `/LogCenter/log_operationcount`, query: {sessionId: row.sessionId}})
      // },
      getList() {
        let vm = this;
        if (vm.params.levelList === '') {
          vm.params.levelList = null
        }
        let param = {currentPage: 1, pageSize: 10, condition: {}}
        param.condition = Object.assign({}, vm.params, {startTime: new Date(this.$refs.selecttime.beginTimes).getTime() / 1000, endTime: new Date(this.$refs.selecttime.endTimes).getTime() / 1000})
        $axios.post(`/operationEventStat/getMajorAssetAlarmList`, param).then((res) => {
          vm.topLists = res.data;
        });
      },
      DownloadHandle(type) {
        let vm = this;
        if (vm.params.levelList === '') {
          vm.params.levelList = null
        }
        let form = {
          reportType: type,
          startTime: new Date(this.$refs.selecttime.beginTimes).getTime() / 1000,
          endTime: new Date(this.$refs.selecttime.endTimes).getTime() / 1000,
          userName: this.params.userName,
          clientIp: this.params.clientIp,
          targetName: this.params.targetName,
          targetIp: this.params.targetIp
        }
        $axios.post('/operationEventStat/createMajorAssetAlarmReport', form).then((res) => {
          console.log(res);
          if (res.data) {
            Download(`/operationEventStat/downMajorAssetAlarmReport/${type}`);
          }
        });
      }
    },
    mounted() {
      this.getList();
    }
  }
</script>
