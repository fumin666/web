<template>
  <section class="content eventAccount">
    <s-row>
      <s-col :span="24">
        <s-form :inline="true">
          <select-time ref="selecttime">
            <template slot="searchBtn">
              <div class="search_btn">
                <s-button title="查询" icon='magnifier' @click="getDbLists">查询</s-button>
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
      <page-infinite-table
        ref="infiniteTable"
        loading-text="正在加载中"
        :ajax-obj="axiosHistoryObj"
        @filter-change="selectFilter"
        :startAjax="getHistoryFlag">
          <s-table-column label="事件级别"
          prop="alarm_name"
          width="170px"
          :filters="filters"
          column-key="alarm_name"
          show-overflow-tooltip></s-table-column>
          <s-table-column label="时间" prop="alarm_time" width="170px"></s-table-column>
          <s-table-column label="规则名称" prop="policy_name"></s-table-column>
          <s-table-column label="数据库名" prop="dbi_name"></s-table-column>
          <s-table-column label="数据库IP" prop="dbi_ip"></s-table-column>
          <s-table-column label="数据库账号" prop="account_name"></s-table-column>
          <s-table-column label="客户端IP" prop="client_ip"></s-table-column>
          <s-table-column label="事件内容" prop="alarm_value"></s-table-column>
      </page-infinite-table>
    </s-row>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'

  import SelectTime from '@/components/selectTime/SelectTime.vue'
  import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  export default {
    components: {
      SelectTime,
      pageInfiniteTable
    },
    data() {
      return {
        excel: {name: 'EXCEL报表', val: false},
        word: {name: 'WORD报表', val: false},
        pdf: {name: 'PDF报表', val: false},
        filterArr: [],
        filters: [
          {text: '未知', value: '0'},
          {text: '正常', value: '1'},
          {text: '提示', value: '2'},
          {text: '警告', value: '3'},
          {text: '次要', value: '4'},
          {text: '主要', value: '5'},
          {text: '严重', value: '6'}],
        levelLists: [],
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
        },
        getHistoryFlag: false,
        axiosHistoryObj: {
          type: 'post',
          url: '/dbaIncident/list/t_data_alarm_dbsql',
          params: {
            condition: {}
          }
        },
        alarm_level_list: []
      }
    },
    methods: {
      selectFilter(filters) {
        this.filterArr = filters.alarm_name.map(function(val) {
          return parseInt(val)
        });
        this.getDbLists();
      },
      // filterTag(value, row) {
      //   return row.alarm_level === value
      // },
      getDbLists() {
        var vm = this;
        let period = vm.$refs.selecttime
        let arr = this.filterArr.length ? this.filterArr : null;
        let period2 = {start_time: Number.isNaN(new Date(period.beginTimes).getTime()) ? 0 : new Date(period.beginTimes).getTime() / 1000, end_time: Number.isNaN(new Date(period.endTimes).getTime()) ? 0 : new Date(period.endTimes).getTime() / 1000, alarm_level: arr}
        $axios.get(`/dbauditReport/dbAuditEventLevelCount/${period2.start_time}/${period2.end_time}`).then((res) => {
          vm.chart2.data = res.data;
        });
        this.axiosHistoryObj.params.condition = Object.assign({}, period2)
        this.getHistoryFlag = true;
      },
      DownloadHandle(type) {
        this[type].name = '下载中...';
        this[type].val = true;
        let period = this.$refs.selecttime
        let condition = {
          start_time: Number.isNaN(new Date(period.beginTimes).getTime()) ? 0 : new Date(period.beginTimes).getTime() / 1000,
          end_time: Number.isNaN(new Date(period.endTimes).getTime()) ? 0 : new Date(period.endTimes).getTime() / 1000,
          reportType: type
        }
        $axios.post(`/dbaIncident/listExport/t_data_alarm_dbsql`, {condition: condition, currentPage: 0, pageSize: 0}).then((res) => {
          this[type].val = false;
          if (type === 'excel') {
            this[type].name = 'EXCEL报表';
          } else if (type === 'word') {
            this[type].name = 'WORD报表';
          } else if (type === 'pdf') {
            this[type].name = 'PDF报表';
          }
          if (res.data) {
            Download(`/dbaIncident/listExportDownload/${type}`);
          }
        });
      }
    },
    mounted() {
      this.getDbLists();
    }
  }
</script>
