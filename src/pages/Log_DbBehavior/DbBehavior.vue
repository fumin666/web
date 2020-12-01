<template>
  <section class="content" style="margin-top: 20px;">
    <s-form :inline="true">
      <select-time ref="selecttime">
        <template slot="serachForm">
          <s-form-item label="数据库账户：">
            <s-input v-model="params.accountName"></s-input>
          </s-form-item>
          <s-form-item label="数据库名称：">
            <s-input v-model="params.dbName"></s-input>
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
      <s-table-column label="数据库账号" prop="accountName" width="170px"></s-table-column>
      <s-table-column label="数据库名称" prop="dbiName"></s-table-column>
      <s-table-column label="数据库类型" prop="dbiType"></s-table-column>
      <s-table-column label="数据库IP" prop="dbiIp"></s-table-column>
      <s-table-column label="权限变更次数" prop="permissionCnt"></s-table-column>
      <s-table-column label="登录失败次数统计" prop="loginFailCnt"></s-table-column>
      <s-table-column label="SQL执行失败次数" prop="execFailCnt"></s-table-column>
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
          accountName: ''
        },
        topLists: [],
        period: {}
      }
    },
    methods: {
      getList() {
        var vm = this;
        vm.period = {
          startTime: new Date(this.$refs.selecttime.beginTimes).getTime() / 1000,
          endTime: new Date(this.$refs.selecttime.endTimes).getTime() / 1000
        }
        $axios.post(`/dbauditReport//behavior/account`, Object.assign({}, vm.params, vm.period)).then((res) => {
          if (res.data && res.data.length > 0) {
            res.data.forEach(ele => {
              if (ele.loginFailCnt == null) {
                ele.loginFailCnt = 0
              }
              if (ele.execFailCnt == null) {
                ele.execFailCnt = 0
              }
              if (ele.permissionCnt == null) {
                ele.permissionCnt = 0
              }
            });
            vm.topLists = res.data;
          } else {
            vm.topLists = []
          }
        });
      },
      ExcelDownloadHandle() {
        let vm = this;
        vm.period = {
          startTime: new Date(this.$refs.selecttime.beginTimes).getTime() / 1000,
          endTime: new Date(this.$refs.selecttime.endTimes).getTime() / 1000
        }
        $axios.post('/dbauditReport/behavior/accountExport', Object.assign({}, vm.params, vm.period, {exportType: 'excel'})).then((res) => {
          if (res.data) {
            Download(`/dbauditReport/behavior/accountExportDownload/excel?t=${new Date().getTime()}`);
          }
        });
      },
      PdfDownloadHandle() {
        let vm = this;
        vm.period = {
          startTime: new Date(this.$refs.selecttime.beginTimes).getTime() / 1000,
          endTime: new Date(this.$refs.selecttime.endTimes).getTime() / 1000
        }
        $axios.post('/dbauditReport/behavior/accountExport', Object.assign({}, vm.params, vm.period, {exportType: 'pdf'})).then((res) => {
          if (res.data) {
            Download(`/dbauditReport/behavior/accountExportDownload/pdf?t=${new Date().getTime()}`);
          }
        });
      },
      WordDownloadHandle() {
        let vm = this;
        vm.period = {
          startTime: new Date(this.$refs.selecttime.beginTimes).getTime() / 1000,
          endTime: new Date(this.$refs.selecttime.endTimes).getTime() / 1000
        }
        $axios.post('/dbauditReport/behavior/accountExport', Object.assign({}, vm.params, vm.period, {exportType: 'word'})).then((res) => {
          if (res.data) {
            Download(`/dbauditReport/behavior/accountExportDownload/word?t=${new Date().getTime()}`);
          }
        });
      }
    },
    mounted() {
      this.getList();
    }
  }
</script>
