<template>
  <section class="content">
    <s-form :inline="true">
      <select-time ref="selecttime">
        <template slot="serachForm">
          <s-form-item label="数据库账户：">
            <s-input v-model="params.accountName"></s-input>
          </s-form-item>
          <s-form-item label="数据库名称：">
            <s-input v-model="params.dbName"></s-input>
          </s-form-item>
          <s-form-item label="DML操作指令：" label-width="110px">
            <s-input v-model="params.cmd" style="width: 165px;"></s-input>
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
    <s-table-page
      :data="topLists">
      <s-table-column label="数据库账号" prop="accountName" width="170px"></s-table-column>
      <s-table-column label="登录名" prop="accountName"></s-table-column>
      <s-table-column label="登录IP" prop="clientIp"></s-table-column>
      <s-table-column label="客户端MAC" prop="clientMac"></s-table-column>
      <s-table-column label="数据库名称" prop="dbiName"></s-table-column>
      <s-table-column label="数据库类型" prop="dbiType"></s-table-column>
      <s-table-column label="数据库IP" prop="dbiIp"></s-table-column>
      <s-table-column label="DML操作指令" prop="cmd"></s-table-column>
      <s-table-column label="操作次数" prop="count"></s-table-column>
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
          cmd: '',
          accountName: '',
          type: 'dml'
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
          endTime: new Date(this.$refs.selecttime.endTimes).getTime() / 1000,
          type: vm.params.type
        }
        $axios.post(`/dbauditReport/operation`, Object.assign({}, vm.params, vm.period)).then((res) => {
          vm.topLists = res.data;
        });
      },
      DownloadHandle(type) {
        let vm = this;
        $axios.post('/dbauditReport/operationExport', Object.assign({}, vm.params, vm.period, {exportType: type})).then((res) => {
          if (res.data === true) {
            Download(`/dbauditReport/operationExportDownload/dml/${type}`);
          }
        });
      }
    },
    mounted() {
      this.getList();
    }
  }
</script>
