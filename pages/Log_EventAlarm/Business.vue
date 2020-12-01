<template>
  <section class="content eventAccount">
    <s-form :inline="true">
      <select-time ref="selecttime">
        <template slot="serachForm">
          <s-form-item label="业务名称：">
            <s-input v-model="params.bizName"></s-input>
          </s-form-item>
          <s-form-item label="应用系统：">
            <s-input v-model="params.appName"></s-input>
          </s-form-item>
          <s-form-item label="规则名称：">
            <s-input v-model="params.ruleName"></s-input>
          </s-form-item>
          <s-form-item label="告警级别：">
            <s-select v-model="params.eventLevel" clearable>
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
      <s-button title="EXCEL报表" icon="excel" @click="ExcelDownloadHandle()">EXCEL报表</s-button>
      <s-button title="WORD报表" icon="word" @click="WordDownloadHandle()">WORD报表</s-button>
      <s-button title="PDF报表" icon="pdf" @click="PdfDownloadHandle()">PDF报表</s-button>
    </s-row>
      <s-table-page :data="topLists" >
        <s-table-column label="时间" width="170px" prop="alarmTime">
          <!--<template slot-scope="scope">-->
            <!--<span>{{getTimes(scope.row.alarmTime)}}</span>-->
          <!--</template>-->
        </s-table-column>
        <s-table-column label="业务名称" prop="bizName"></s-table-column>
        <s-table-column label="应用系统" prop="appName"></s-table-column>
        <s-table-column label="应用系统IP" prop="serverIp"></s-table-column>
        <s-table-column label="规则名称" prop="ruleName"></s-table-column>
        <s-table-column label="告警级别" prop="eventLevelName"></s-table-column>
        <s-table-column label="告警内容" prop="eventContent"></s-table-column>
      </s-table-page>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import { Download, getTime } from 'sunflower-common-utils'
  import SelectTime from '@/components/selectTime/SelectTime.vue'
  export default {
    components: {
      SelectTime
    },
    data() {
      return {
        params: {
          bizName: '',
          appName: '',
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
        period: {}
      }
    },
    methods: {
      getTimes(val) {
        return getTime(val)
      },
      getList() {
        let vm = this;
        vm.period = {
          startTime: new Date(this.$refs.selecttime.beginTimes).getTime() / 1000,
          endTime: new Date(this.$refs.selecttime.endTimes).getTime() / 1000
        }
        if (vm.params.eventLevel === '') {
          vm.params.eventLevel = null
        }
        $axios.post(`/businessAuditEventCount/getBusinessAuditEventAlarmList/`, Object.assign({}, vm.params, vm.period)).then((res) => {
          console.log(res)
          vm.topLists = res.data;
        });
      },
      ExcelDownloadHandle() {
        let vm = this;
        vm.period = {
          startTime: new Date(this.$refs.selecttime.beginTimes).getTime() / 1000,
          endTime: new Date(this.$refs.selecttime.endTimes).getTime() / 1000
        };
        if (vm.params.eventLevel === '') {
          vm.params.eventLevel = null
        }
        $axios.post('/businessAuditEventCount/createBusinessAuditEventAlarmReportFile/excel', Object.assign({}, vm.params, vm.period)).then((res) => {
          if (res.data === true) {
            Download(`/businessAuditEventCount/exportBusinessAuditEventAlarmReport/excel?t=${new Date().getTime()}`);
          }
        });
      },
      PdfDownloadHandle() {
        let vm = this;
        vm.period = {
          startTime: new Date(this.$refs.selecttime.beginTimes).getTime() / 1000,
          endTime: new Date(this.$refs.selecttime.endTimes).getTime() / 1000
        };
        $axios.post('/businessAuditEventCount/createBusinessAuditEventAlarmReportFile/pdf', Object.assign({}, vm.params, vm.period)).then((res) => {
          if (res.data === true) {
            Download(`/businessAuditEventCount/exportBusinessAuditEventAlarmReport/pdf?t=${new Date().getTime()}`);
          }
        });
      },
      WordDownloadHandle() {
        let vm = this;
        vm.period = {
          startTime: new Date(this.$refs.selecttime.beginTimes).getTime() / 1000,
          endTime: new Date(this.$refs.selecttime.endTimes).getTime() / 1000
        };
        $axios.post('/businessAuditEventCount/createBusinessAuditEventAlarmReportFile/word', Object.assign({}, vm.params, vm.period)).then((res) => {
          if (res.data === true) {
            Download(`/businessAuditEventCount/exportBusinessAuditEventAlarmReport/word?t=${new Date().getTime()}`);
          }
        });
      }
    },
    mounted() {
      this.getList();
    }
  }
</script>
