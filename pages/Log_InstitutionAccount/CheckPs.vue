<template>
  <section class="logPassword">
    <s-form
      :inline="true">
      <select-time ref="selecttime1">
        <template slot="serachForm">
          <s-form-item
            label="任务名称：">
            <s-input v-model="taskName"></s-input>
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
    <s-table-page
      ref="ddd"
      :data="passwordList"
      :hasActionCol='false'
    >
      <s-table-column
        label="任务名称"
        prop="taskName"
        show-overflow-tooltip>
      </s-table-column>
      <s-table-column
        label="开始时间"
        prop="beginTime">
      </s-table-column>
      <s-table-column
        label="结束时间"
        prop="endTime">
      </s-table-column>
      <s-table-column
        label="改密目标机器"
        prop="deviceIp">
      </s-table-column>
      <s-table-column
        label= "验证账号"
        prop="accountName"
        show-overflow-tooltip>
      </s-table-column>
      <s-table-column
        label= "验证结果"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.result === 0">成功</div>
          <div v-else-if="scope.row.result === 1">失败</div>
          <div v-else-if="scope.row.result === 2">异常</div>
          <div v-else-if="scope.row.result === 3">旧密码错误</div>
          <div v-else-if="scope.row.result === 4">未知错误</div>
          <div v-else-if="scope.row.result === 5">端口错误</div>
          <div v-else>未关联自定义脚本</div>
        </template>
      </s-table-column>
    </s-table-page>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'

  // import AuditDetail from './AuditDetail'
  // import PasswordDetail from './PasswordDetail'
  import {Download} from 'sunflower-common-utils'
  import SelectTime from '@/components/selectTime/SelectTime.vue'

  export default {
    components: {

      // AuditDetail,
      // PasswordDetail,
      // Download,
      SelectTime
    },
    data() {
      return {
        bloomDetail: false,
        taskUuid: '',
        passwordDetail: [],
        passwordList: [],
        taskName: ''
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        let vm = this;
        $axios.post('/changePwdLog/checkPasswdLog', {startTime: new Date(this.$refs.selecttime1.beginTimes).getTime() / 1000, endTime: new Date(this.$refs.selecttime1.endTimes).getTime() / 1000, taskName: vm.taskName, passwdCheckType: 2}).then((res) => {
          if (res.data && res.data instanceof Array) {
            vm.passwordList = res.data;
          }
        })
      },
      ExcelDownloadHandle() {
        let vm = this;
        $axios.post('/changePwdLog/checkPasswdLogExport', {exportType: 'excel', startTime: new Date(this.$refs.selecttime1.beginTimes).getTime() / 1000, endTime: new Date(this.$refs.selecttime1.endTimes).getTime() / 1000, taskName: vm.taskName, passwdCheckType: 2}).then((res) => {
          if (res.data === 'success') {
            Download(`/changePwdLog//downCheckPasswdLog/excel?t=${new Date().getTime()}`);
          }
        });
      },
      PdfDownloadHandle() {
        let vm = this;
        $axios.post('/changePwdLog/checkPasswdLogExport', {exportType: 'pdf', startTime: new Date(this.$refs.selecttime1.beginTimes).getTime() / 1000, endTime: new Date(this.$refs.selecttime1.endTimes).getTime() / 1000, taskName: vm.taskName, passwdCheckType: 2}).then((res) => {
          if (res.data === 'success') {
            Download(`/changePwdLog//downCheckPasswdLog/pdf?t=${new Date().getTime()}`);
          }
        });
      },
      WordDownloadHandle() {
        let vm = this;
        $axios.post('/changePwdLog/checkPasswdLogExport', {exportType: 'word', startTime: new Date(this.$refs.selecttime1.beginTimes).getTime() / 1000, endTime: new Date(this.$refs.selecttime1.endTimes).getTime() / 1000, taskName: vm.taskName, passwdCheckType: 2}).then((res) => {
          if (res.data === 'success') {
            Download(`/changePwdLog//downCheckPasswdLog/word?t=${new Date().getTime()}`);
          }
        });
      }
    }
  }
</script>
