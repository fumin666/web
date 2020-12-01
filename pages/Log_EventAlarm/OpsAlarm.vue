/**
* Created by alex on 2019/3/6.
*/
<template>
  <section class="content eventAccount">
    <s-form :inline="true">
      <select-time ref="selecttime">
        <template slot="serachForm">
          <s-form-item label="级别：">
            <s-select v-model="params.levelList" clearable>
              <s-option v-for="item in alarmLevel" :label="item.name" :value="item.value" :key="item.value"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="规则名称：">
            <s-input v-model="params.bwName"></s-input>
          </s-form-item>
          <s-form-item label="运维用户：">
            <s-input v-model="params.userName" placeholder="请输入"></s-input>
          </s-form-item>
          <s-form-item label="客户端IP：" prop="clientIP">
            <s-input v-model="params.clientIP" placeholder="请输入"></s-input>
          </s-form-item>
          <s-form-item label="目标资产名称：" prop="deviceName" label-width="110px">
            <s-input v-model="params.deviceName" placeholder="请输入" style="width:165px;"></s-input>
          </s-form-item>
          <s-form-item label="目标资产IP：" prop="deviceIP">
            <s-input v-model="params.deviceIP" placeholder="请输入"></s-input>
          </s-form-item>
          <s-form-item label="资产账号：" prop="accountName">
            <s-input v-model="params.accountName" placeholder="请输入"></s-input>
          </s-form-item>
          <s-form-item label="命令名：">
            <s-input v-model="params.commandName" placeholder="请输入"></s-input>
          </s-form-item>
          <s-form-item label="命令类型：">
            <s-select v-model="params.commandType" placeholder="请选择" clearable>
              <s-option label="会话阻断" :value="4" ></s-option>
              <s-option label="命令阻断" :value="3" ></s-option>
              <s-option label="命令告警" :value="2" ></s-option>
            </s-select>
          </s-form-item>
        </template>
        <template slot="searchBtn">
          <div class="search_btn">
            <s-button title="查询" icon='magnifier' @click="getList">查询</s-button>
          </div>
        </template>
      </select-time>
      <!--<s-form-item label="主账号">-->
        <!--<s-input v-model="params.userName"></s-input>-->
      <!--</s-form-item>-->
      <!--<s-form-item label="从账号">-->
        <!--<s-input v-model="params.accountName"></s-input>-->
      <!--</s-form-item>-->
      <!--<s-form-item label="协议名称">-->
        <!--<s-input v-model="params.protocolName"></s-input>-->
      <!--</s-form-item>-->
      <!--<s-form-item label="规则名称">-->
        <!--<s-input v-model="params.bwName"></s-input>-->
      <!--</s-form-item>-->
    </s-form>
    <s-row style="margin: 15px 0 10px;">
      <s-button title="EXCEL报表" icon="excel" @click="DownloadHandle('excel')">EXCEL报表</s-button>
      <s-button title="WORD报表" icon="word" @click="DownloadHandle('word')">WORD报表</s-button>
      <s-button title="PDF报表" icon="pdf" @click="DownloadHandle('pdf')">PDF报表</s-button>
    </s-row>
    <s-table-page :data="topLists">
      <s-table-column label="告警时间" prop="createTime" width="170px" show-overflow-tooltip></s-table-column>
      <s-table-column label="级别" prop="commandRiskName" show-overflow-tooltip></s-table-column>
      <s-table-column label="规则名称" prop="bwName" show-overflow-tooltip></s-table-column>
      <s-table-column label="运维用户" prop="userName" show-overflow-tooltip></s-table-column>
      <s-table-column label="客户端IP" prop="clientIP" show-overflow-tooltip></s-table-column>
      <s-table-column label="目标资产名称" prop="deviceName" show-overflow-tooltip></s-table-column>
      <s-table-column label="目标资产IP" prop="deviceIP" show-overflow-tooltip></s-table-column>
      <s-table-column label="资产账号" prop="accountName" show-overflow-tooltip></s-table-column>
      <s-table-column label="协议" prop="protocolName" show-overflow-tooltip></s-table-column>
      <s-table-column label="命令名" prop="commandName" show-overflow-tooltip></s-table-column>
      <s-table-column label="命令类型" prop="commandTypeStr" show-overflow-tooltip></s-table-column>
      <s-table-column label="告警内容" prop="comment" show-overflow-tooltip></s-table-column>
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
          citypeName: '',
          thresholdName: '',
          userName: '',
          protocolName: '',
          bwName: '',
          clientIP: '',
          levelList: null,
          accountName: '',
          commandName: '',
          commandType: null,
          deviceIP: '',
          deviceName: '',
          endTime: null,
          startTime: null
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
        topLists: [],
        period: {}
      }
    },
    methods: {
      getList() {
        let vm = this;
        vm.period = {
          startTime: new Date(this.$refs.selecttime.beginTimes).getTime() / 1000,
          endTime: new Date(this.$refs.selecttime.endTimes).getTime() / 1000
        };
        if (vm.params.levelList === '') {
          vm.params.levelList = null
        }
        $axios.post(`/operationEventStat/getOperationAlertEvent`, Object.assign({}, vm.params, vm.period)).then((res) => {
          vm.topLists = res.data;
        });
      },
      DownloadHandle(type) {
        let vm = this;
        vm.period = {
          startTime: new Date(this.$refs.selecttime.beginTimes).getTime() / 1000,
          endTime: new Date(this.$refs.selecttime.endTimes).getTime() / 1000
        };
        if (vm.params.levelList === '') {
          vm.params.levelList = null
        }
        $axios.post('/operationEventStat/makeOperationAlertEventFile', Object.assign({}, vm.params, vm.period, {exportType: type})).then((res) => {
          if (res.data) {
            Download(`/operationEventStat/downOperationAlertEvent/${type}`);
          }
        });
      }
    },
    mounted() {
      this.getList();
    }
  }
</script>
