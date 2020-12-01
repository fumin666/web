<template>
  <section class="content eventAccount">
    <s-form :inline="true">
      <select-time ref="selecttime">
        <template slot="serachForm">
          <s-form-item label="规则名称：">
            <s-input v-model="params.strategyName"></s-input>
          </s-form-item>
          <s-form-item label="资产类别：">
            <s-input v-model="params.citype"></s-input>
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
    <s-page-infinite-table
      ref="infiniteTable"
      loading-text="正在加载中"
      :ajax-obj="axiosObj"
      :startAjax="getFlag">
      <s-table-column label="时间" prop="alarmTimeStr" width="180px"></s-table-column>
      <s-table-column label="资产类别" prop="citypeName" width="200px"></s-table-column>
      <s-table-column label="资产IP" prop="ip" width="200px"></s-table-column>
      <s-table-column label="规则名称" prop="strategyName" width="250px"></s-table-column>
      <s-table-column label="告警级别" prop="eventLevelStr" width="150px"></s-table-column>
      <s-table-column label="告警内容" prop="eventContent"></s-table-column>
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
          strategyName: '',
          citype: '',
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
        axiosObj: {
          type: 'post',
          url: '/syslogReport/auditAlarmReport',
          params: {
            condition: {
            }
          }
        },
        getFlag: false,
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
        if (vm.params.eventLevel === '') {
          vm.params.eventLevel = null
        }
        this.axiosObj.params.condition = Object.assign({}, vm.params, vm.period)
        this.getFlag = true;
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
        vm.params.type = 1
        $axios.post('/syslogReport/auditAlarmReportExport', Object.assign({}, vm.params, vm.period)).then((res) => {
          Download(`/syslogReport/downLoadLogReport/${res.data}`);
        });
      },
      PdfDownloadHandle() {
        let vm = this;
        vm.period = {
          startTime: new Date(this.$refs.selecttime.beginTimes).getTime() / 1000,
          endTime: new Date(this.$refs.selecttime.endTimes).getTime() / 1000
        };
        vm.params.type = 2
        $axios.post('/syslogReport/auditAlarmReportExport', Object.assign({}, vm.params, vm.period)).then((res) => {
          Download(`/syslogReport/downLoadLogReport/${res.data}`);
        });
      },
      WordDownloadHandle() {
        let vm = this;
        vm.period = {
          startTime: new Date(this.$refs.selecttime.beginTimes).getTime() / 1000,
          endTime: new Date(this.$refs.selecttime.endTimes).getTime() / 1000
        };
        vm.params.type = 3
        $axios.post('/syslogReport/auditAlarmReportExport', Object.assign({}, vm.params, vm.period)).then((res) => {
          Download(`/syslogReport/downLoadLogReport/${res.data}`);
        });
      }
    },
    mounted() {
      this.getList();
    }
  }
</script>
