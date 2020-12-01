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
            <s-button icon="excel" title="EXCEL报表" @click="ExcelDownloadHandle()">EXCEL报表</s-button>
          </s-form-item>
          <s-form-item>
            <s-button icon="word" title="WORD报表" @click="WordDownloadHandle()">WORD报表</s-button>
          </s-form-item>
          <s-form-item>
            <s-button icon="pdf" title="PDF报表" @click="PdfDownloadHandle()">PDF报表</s-button>
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
                        prop="levelStr"
                        width="170px"
                        :filters="filters"
                        :filter-method="filterTag"
                        show-overflow-tooltip></s-table-column>
        <s-table-column label="时间" prop="modifyTimeStr" width="170px"></s-table-column>
        <s-table-column label="规则名称" prop="thresholdName"></s-table-column>
        <s-table-column label="资产名称" prop="itcompName"></s-table-column>
        <s-table-column label="IP地址" prop="controlAdderss"></s-table-column>
        <s-table-column label="监控项类别" prop="typeStr"></s-table-column>
        <s-table-column label="监控项名称" prop="miTypeName"></s-table-column>
        <s-table-column label="设备类型" prop="ciTypeName"></s-table-column>
        <s-table-column label="事件内容" prop="incidentContent"></s-table-column>
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
        return row.levelStr === value
      },
      getList() {
        var vm = this;
        let period = {startTime: new Date(this.$refs.selecttime.beginTimes).getTime() / 1000, endTime: new Date(this.$refs.selecttime.endTimes).getTime() / 1000}
        $axios.post('/incidentCount/getMonitorIncidentCountByTime/', period).then((res) => {
          vm.chart2.data = res.data;
        });
        $axios.post('/incidentCount/incidentGroupList', period).then((res) => {
          vm.topLists = res.data;
        });
      },
      ExcelDownloadHandle() {
        $axios.post('incidentCount/exportMonitorIncidentList/', {startTime: new Date(this.$refs.selecttime.beginTimes).getTime() / 1000, endTime: new Date(this.$refs.selecttime.endTimes).getTime() / 1000, exportType: 'excel'}).then((res) => {
          if (res.data === 'success') {
            Download(`incidentCount/downMonitorIncidentList/excel?t=${new Date().getTime()}`);
          }
        });
      },
      PdfDownloadHandle() {
        $axios.post('incidentCount/exportMonitorIncidentList/', {startTime: new Date(this.$refs.selecttime.beginTimes).getTime() / 1000, endTime: new Date(this.$refs.selecttime.endTimes).getTime() / 1000, exportType: 'pdf'}).then((res) => {
          if (res.data === 'success') {
            Download(`incidentCount/downMonitorIncidentList/pdf?t=${new Date().getTime()}`);
          }
        });
      },
      WordDownloadHandle() {
        $axios.post('incidentCount/exportMonitorIncidentList/', {startTime: new Date(this.$refs.selecttime.beginTimes).getTime() / 1000, endTime: new Date(this.$refs.selecttime.endTimes).getTime() / 1000, exportType: 'word'}).then((res) => {
          if (res.data === 'success') {
            Download(`incidentCount/downMonitorIncidentList/word?t=${new Date().getTime()}`);
          }
        });
      }
    },
    mounted() {
      this.getList();
    }
  }
</script>
