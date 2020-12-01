<template>
  <section class="content eventAccount">
    <s-form :inline="true">
      <select-time ref="selecttime">
        <template slot="serachForm">
          <s-form-item label="账号名称：">
            <s-input v-model="params.accountName"></s-input>
          </s-form-item>
          <s-form-item label="数据库名称：">
            <s-input v-model="params.dbName"></s-input>
          </s-form-item>
          <s-form-item label="数据库IP：">
            <s-input v-model="params.dbiIp"></s-input>
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
    <s-table-page :data="topLists">
      <s-table-column label="账号名称" prop="accountName" width="170px"></s-table-column>
      <s-table-column label="数据库名称" prop="dbiName"></s-table-column>
      <s-table-column label="数据库类型" prop="dbiType"></s-table-column>
      <s-table-column label="数据库IP" prop="dbiIp"></s-table-column>
      <s-table-column label="成功登录次数">
        <template slot-scope="scope">
          <span>{{ scope.row.successCnt !== null ? scope.row.successCnt : 0}}</span>
        </template>
      </s-table-column>
      <s-table-column label="失败登录次数">
        <template slot-scope="scope">
          <span>{{ scope.row.failCnt !== null ? scope.row.failCnt : 0}}</span>
        </template>
      </s-table-column>
      <s-table-column label="审计记录数">
        <template slot-scope="scope">
          <span>{{ scope.row.successCnt !== null ? scope.row.successCnt + (scope.row.failCnt !== null ? scope.row.failCnt : 0) : 0 + scope.row.failCnt !== null ? scope.row.failCnt : 0}}</span>
        </template>
      </s-table-column>
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
          dbiIp: '',
          accountName: ''
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
        $axios.post(`/dbauditReport/dbAccount/`, Object.assign({}, vm.params, vm.period)).then((res) => {
          if (res.data && res.data.length > 0) {
            vm.topLists = res.data;
          } else {
            vm.topLists = []
          }
        });
      },
      ExcelDownloadHandle() {
        this.period = {
          startTime: this.$refs.selecttime.beginTimes === '' ? null : new Date(this.$refs.selecttime.beginTimes).getTime() / 1000,
          endTime: this.$refs.selecttime.endTimes === '' ? null : new Date(this.$refs.selecttime.endTimes).getTime() / 1000
        }
        $axios.post(`/dbauditReport/dbAccountExport/excel`, Object.assign({}, this.params, this.period)).then((res) => {
          if (res.data) {
            Download(`/dbauditReport/dbAccountDownloadExportFile/excel`);
          }
        })
      },
      PdfDownloadHandle() {
        this.period = {
          startTime: this.$refs.selecttime.beginTimes === '' ? null : new Date(this.$refs.selecttime.beginTimes).getTime() / 1000,
          endTime: this.$refs.selecttime.endTimes === '' ? null : new Date(this.$refs.selecttime.endTimes).getTime() / 1000
        }
        $axios.post(`/dbauditReport/dbAccountExport/pdf`, Object.assign({}, this.params, this.period)).then((res) => {
          if (res.data) {
            Download(`/dbauditReport/dbAccountDownloadExportFile/pdf`);
          }
        })
      },
      WordDownloadHandle() {
        this.period = {
          startTime: this.$refs.selecttime.beginTimes === '' ? null : new Date(this.$refs.selecttime.beginTimes).getTime() / 1000,
          endTime: this.$refs.selecttime.endTimes === '' ? null : new Date(this.$refs.selecttime.endTimes).getTime() / 1000
        }
        $axios.post(`/dbauditReport/dbAccountExport/word`, Object.assign({}, this.params, this.period)).then((res) => {
          if (res.data) {
            Download(`/dbauditReport/dbAccountDownloadExportFile/word`);
          }
        })
      }
    },
    mounted() {
      this.getList();
    }
  }
</script>
