<template>
  <section class="content eventAccount">
    <s-form :inline="true">
      <select-time ref="selecttime">
        <template slot="serachForm">
          <s-form-item label="客户端工具名：" label-width="110px">
            <s-input v-model="params.tools" style="width: 165px;"></s-input>
          </s-form-item>
          <s-form-item label="数据库名称：">
            <s-input v-model="params.dbName" style="width: 185px;"></s-input>
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
      <s-table-column label="客户端工具名" prop="clientTools" width="170px"></s-table-column>
      <s-table-column label="数据库名称" prop="dbiName"></s-table-column>
      <s-table-column label="数据库类型" prop="dbiType"></s-table-column>
      <s-table-column label="数据库IP" prop="dbiIp"></s-table-column>
      <s-table-column label="审计记录数" prop="count"></s-table-column>
      <s-table-column label="访问次数" prop="count"></s-table-column>
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
          dbName: '',
          tools: ''
        },
        topLists: [],
        period: {}
      }
    },
    methods: {
      getList() {
        var vm = this;
        this.period = {
          startTime: new Date(this.$refs.selecttime.beginTimes).getTime() / 1000,
          endTime: new Date(this.$refs.selecttime.endTimes).getTime() / 1000
        }
        $axios.post(`/dbauditReport/loginTools/`, Object.assign({}, vm.params, vm.period)).then((res) => {
          if (res.data && res.data.length > 0) {
            vm.topLists = res.data;
          } else {
            vm.topLists = []
          }
        });
      },
      ExcelDownloadHandle() {
        let vm = this;
        $axios.post('/dataAlarmLog/exportAssetAlarmLog', Object.assign({}, vm.params, vm.period, {exportType: 'excel'})).then((res) => {
          if (res.data === 'success') {
            Download(`/dbauditReport/loginToolsExport/${vm.period.startTime}/${vm.period.endTime}/excel`);
          }
        });
      },
      PdfDownloadHandle() {
        let vm = this;
        $axios.post('/dataAlarmLog/exportAssetAlarmLog', Object.assign({}, vm.params, vm.period, {exportType: 'pdf'})).then((res) => {
          if (res.data === 'success') {
            Download(`/dbauditReport/loginToolsExport/${vm.period.startTime}/${vm.period.endTime}/pdf`);
          }
        });
      },
      WordDownloadHandle() {
        let vm = this;
        $axios.post('/dataAlarmLog/exportAssetAlarmLog', Object.assign({}, vm.params, vm.period, {exportType: 'word'})).then((res) => {
          if (res.data === 'success') {
            Download(`/dbauditReport/loginToolsExport/${vm.period.startTime}/${vm.period.endTime}/word`);
          }
        });
      }
    },
    mounted() {
      this.getList();
    }
  }
</script>
