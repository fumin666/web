<template>
  <section>
    <s-form
      :inline="true">
      <select-time ref="selecttime1">
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
    <s-table-page
      :data="auditList"
      :row-actions="getRowActionsDef()"
    >
      <s-table-column
        label="执行时间"
        prop="execTime">
      </s-table-column>
      <s-table-column
        label="资产名称"
        prop="deviceName"
        show-overflow-tooltip>
      </s-table-column>
      <s-table-column
        label="资产IP"
        prop="deviceIp">
      </s-table-column>
      <s-table-column
        label="登录账号"
        prop="assetAccountName">
      </s-table-column>
      <s-table-column
        label="登录协议"
        prop="protocolName"
        show-overflow-tooltip>
      </s-table-column>
      <s-table-column
        label="结果"
        prop="resultName">
      </s-table-column>
      <s-table-column
        label="执行者"
        prop="userName">
      </s-table-column>
      <s-table-column
        label="收集账号总数"
        prop="count">
      </s-table-column>
    </s-table-page>
    <s-dialog
      width="900px"
      v-model="bloomDetail"
      v-if="bloomDetail"
      title="查看稽核结果详情"
      key="bloomDetail">
      <audit-detail ref="auditDetail" :audDetail="auditDetaillist"></audit-detail>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'

  import AuditDetail from './AuditDetail'
  import {Download} from 'sunflower-common-utils'
  import SelectTime from '@/components/selectTime/SelectTime.vue'
  export default {
    components: {

      AuditDetail,
      // Download,
      SelectTime
    },
    data() {
      return {
        bloomDetail: false,
        auditDetaillist: [],
        auditList: []
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      getList() {
        let vm = this;
        $axios.post('/collectTask/getAutoCheckLogList', {startTime: new Date(this.$refs.selecttime1.beginTimes).getTime() / 1000, endTime: new Date(this.$refs.selecttime1.endTimes).getTime() / 1000}).then((res) => {
          if (res.data && res.data instanceof Array) {
            vm.auditList = res.data;
          }
        })
      },
      getRowActionsDef() {
        let vm = this;
        return [{
          name: '查看',
          icon: 'eye',
          click(row) {
            vm.bloomDetail = true;
            $axios.post('/collectTask/getAutoCheckResultDetail', {excutetime: row.execTime, taskuuid: row.taskUuid, deviceuuid: row.deviceUuid}).then((res) => {
                // 过滤掉public项
              res.data.sysLogList = res.data.sysLogList.filter((item, index) => {
                return item.assetAccountName.indexOf('public') === -1
              })
              vm.auditDetaillist = res.data;
            })
          }
        }]
      },
      ExcelDownloadHandle() {
        $axios.post('/collectTask/autoCheckLogListExport', {exportType: 'excel', startTime: new Date(this.$refs.selecttime1.beginTimes).getTime() / 1000, endTime: new Date(this.$refs.selecttime1.endTimes).getTime() / 1000}).then((res) => {
          if (res.data === 'success') {
            Download(`/collectTask/downAutoCheckLogList/excel?t=${new Date().getTime()}`);
          }
        });
      },
      PdfDownloadHandle() {
        $axios.post('/collectTask/autoCheckLogListExport', {exportType: 'pdf', startTime: new Date(this.$refs.selecttime1.beginTimes).getTime() / 1000, endTime: new Date(this.$refs.selecttime1.endTimes).getTime() / 1000}).then((res) => {
          if (res.data === 'success') {
            Download(`/collectTask/downAutoCheckLogList/pdf?t=${new Date().getTime()}`);
          }
        });
      },
      WordDownloadHandle() {
        $axios.post('/collectTask/autoCheckLogListExport', {exportType: 'word', startTime: new Date(this.$refs.selecttime1.beginTimes).getTime() / 1000, endTime: new Date(this.$refs.selecttime1.endTimes).getTime() / 1000}).then((res) => {
          if (res.data === 'success') {
            Download(`/collectTask/downAutoCheckLogList/word?t=${new Date().getTime()}`);
          }
        });
      }
    }
  }
</script>
