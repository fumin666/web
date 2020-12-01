/**
* Created by alex on 2019/3/6.
*/
<template>
  <section class="content eventAccount">
    <s-form :inline="true">
      <select-time ref="selecttime">
        <template slot="serachForm">
          <s-form-item label="数据库名称：">
            <s-input v-model="params.dbaName"></s-input>
          </s-form-item>
          <s-form-item label="登录名称：">
            <s-input v-model="params.AccountName"></s-input>
          </s-form-item>
          <s-form-item label="规则名称：">
            <s-input v-model="params.ruleName"></s-input>
          </s-form-item>
          <s-form-item label="告警级别：">
            <s-select v-model="params.eventLevel" clearable @clear="clearfn">
              <s-option v-for="item in alarmLevel" :label="item.name" :value="item.value" :key="item.value"></s-option>
            </s-select>
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
    <s-page-infinite-table
      ref="infiniteTable"
      loading-text="正在加载中"
      :ajax-obj="axiosObj"
      :startAjax="getFlag">
      <s-table-column label="时间" prop="alarm_time" width="170px"></s-table-column>
      <s-table-column label="数据库名称" prop="dbi_name"></s-table-column>
      <s-table-column label="数据库类型" prop="db_type"></s-table-column>
      <s-table-column label="数据库IP" prop="dbi_ip"></s-table-column>
      <s-table-column label="登录名" prop="account_name"></s-table-column>
      <s-table-column label="登录IP" prop="client_ip"></s-table-column>
      <s-table-column label="规则名称" prop="policy_name"></s-table-column>
      <s-table-column label="告警级别" prop="alarm_name"></s-table-column>
      <s-table-column label="告警内容" prop="alarm_value"></s-table-column>
    </s-page-infinite-table>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  
  import SelectTime from '@/components/selectTime/SelectTime.vue'
  import sPageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  export default {
    components: {
      SelectTime,
      sPageInfiniteTable
    },
    data() {
      return {
        params: {
          dbaName: '',
          AccountName: '',
          ruleName: '',
          eventLevel: null
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
        period: {},
        axiosObj: {
          type: 'post',
          url: '/dbauditReport/dbAlarm',
          params: {
            condition: {
            }
          }
        },
        getFlag: false,
        condition: {}
      }
    },
    methods: {
      clearfn() {
        this.params.eventLevel = null
      },
      getList() {
        let vm = this;
        vm.period = {
          start_time: new Date(this.$refs.selecttime.beginTimes).getTime() / 1000,
          end_time: new Date(this.$refs.selecttime.endTimes).getTime() / 1000
        };
        this.axiosObj.params.condition = Object.assign({}, vm.params, vm.period)
        this.getFlag = true
      },
      DownloadHandle(type) {
        let vm = this;
        vm.period = {
          start_time: new Date(this.$refs.selecttime.beginTimes).getTime() / 1000,
          end_time: new Date(this.$refs.selecttime.endTimes).getTime() / 1000
        };
        vm.condition = Object.assign({}, vm.params, vm.period, {reportType: type})
        $axios.post('/dbauditReport/dbAlarmExport', {'condition': vm.condition}).then((res) => {
          if (res.data) {
            Download(`/dbauditReport/dbAlarmExportDownload/${type}`);
          } else {
            this.$message('导出失败');
          }
        });
      }
    },
    mounted() {
      this.getList();
    }
  }
</script>
