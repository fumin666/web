<template>
  <section class="content eventAccount">
    <s-row>
      <s-col :span="24">
        <s-form :inline="true">
          <select-time ref="selecttime">
            <template slot="searchBtn">
              <div class="search_btn">
                <s-button title="查询" icon='magnifier' @click="getList">查询</s-button>
              </div>
            </template>
          </select-time>
          <s-form-item>
            <s-button icon="excel" title="EXCEL报表" @click="DownloadHandle('excel')">EXCEL报表</s-button>
          </s-form-item>
          <s-form-item>
            <s-button icon="word" title="WORD报表" @click="DownloadHandle('word')">WORD报表</s-button>
          </s-form-item>
          <s-form-item>
            <s-button icon="pdf" title="PDF报表" @click="DownloadHandle('pdf')">PDF报表</s-button>
          </s-form-item>
        </s-form>
      </s-col>
    </s-row>
    <s-row>
      <s-row>
            <span class="title">
              <i class="iconfont icon-tag"></i>事件级别分布
            </span>
      </s-row>
      <s-chart :chart="chart2"></s-chart>
      <s-row>
            <span class="title">
              <i class="iconfont icon-trophy"></i>事件详情
            </span>
      </s-row>
      <s-table-page :data="topLists">
        <s-table-column label="事件级别"
                        prop="commandRiskName"
                        width="170px"
                        :filters="filters"
                        :filter-method="filterTag"></s-table-column>
        <!--<s-table-column label="流程状态" prop="workflowStatus" width="170px"></s-table-column>-->
        <s-table-column label="事件时间" prop="create_time" width="170px"></s-table-column>
        <s-table-column label="规则名称" prop="bwName"></s-table-column>
        <s-table-column label="运维用户" prop="userRealName"></s-table-column>
        <s-table-column label="客户端IP" prop="sessionClientIp"></s-table-column>
        <s-table-column label="目标资产名称" prop="deviceName"></s-table-column>
        <s-table-column label="目标资产IP" prop="deviceIp"></s-table-column>
        <s-table-column label="资产账号" prop="accountName"></s-table-column>
        <s-table-column label="协议" prop="protocolName"></s-table-column>
        <s-table-column label="命令名" prop="command_name"></s-table-column>
        <s-table-column label="命令类型" prop="commandType"></s-table-column>
        <s-table-column label="事件内容" prop="eventContent"></s-table-column>
      </s-table-page>
    </s-row>
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
        filters: [
          {text: '未知', value: '未知'},
          {text: '正常', value: '正常'},
          {text: '提示', value: '提示'},
          {text: '警告', value: '警告'},
          {text: '次要', value: '次要'},
          {text: '主要', value: '主要'},
          {text: '严重', value: '严重'}],
        levelLists: [],
        topLists: [],
        chart2: {
          name: 'chart2',
          type: 'colorfulBarChart',
          width: '90%',
          height: '300px',
          data: [],
          option: {
            series: [{
              barWidth: 30
            }]
          }
        }
      }
    },
    methods: {
      filterTag(value, row) {
        return row.commandRiskName === value
      },
      getList() {
        var vm = this;
        let period = {startTime: this.$refs.selecttime.beginTimes, endTime: this.$refs.selecttime.endTimes}
        $axios.post('/operationEventStat/getOperationLevelEvent', period).then((res) => {
          vm.chart2.data = res.data
        });
        $axios.post('/operationEventStat/getOperationEventListByLevel', period).then((res) => {
          vm.topLists = res.data;
          console.log(res.data)
        });
      },
      DownloadHandle(type) {
        let form = {
          exportType: type,
          startTime: this.$refs.selecttime.beginTimes,
          endTime: this.$refs.selecttime.endTimes
        }
        $axios.post('/operationEventStat/makeOperationEventFile', form).then((res) => {
          if (res.data) {
            Download(`/operationEventStat/downOperationEvent/${type}`);
          }
        });
      }
    },
    mounted() {
      this.getList();
    }
  }
</script>
