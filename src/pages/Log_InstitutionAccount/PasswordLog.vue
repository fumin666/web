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

    <RealPageTable
      :ajax-obj="ajaxObj">
      <s-table-column
        label="任务名称"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="score-td" @click="showPasswordDetail(scope.row.taskUuid, scope.row.uuid)">{{ scope.row.taskName }}
          </div>
        </template>
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
        label="账号总数"
        prop="totalCnt">
      </s-table-column>
      <s-table-column
        label="成功数量"
        prop="successCnt">
      </s-table-column>
      <s-table-column
        label="失败数量"
        prop="failCnt">
      </s-table-column>
      <s-table-column label="操作">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看" @click="viewPassLog(scope.row)"> </i>
        </template>
      </s-table-column>
    </RealPageTable>
    <s-dialog
      width="1100px"
      v-model="bloomDetail"
      v-if="bloomDetail"
      title="查看详情"
      key="bloomDetail">
      <password-detail ref="passwordDetail" :pwDetail="passwordDetail"></password-detail>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  import PasswordDetail from './PasswordDetail'
  import {Download} from 'sunflower-common-utils'
  import SelectTime from '@/components/selectTime/SelectTime.vue'

  export default {
    components: {
      RealPageTable,
      PasswordDetail,
      SelectTime
    },
    data() {
      return {
        bloomDetail: false,
        taskUuid: '',
        passwordDetail: [],
        taskName: '',
        ajaxObj: {
          type: 'post',
          url: '/changePwdLog/list',
          params: {
            condition: {}
          }
        }
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      getList() {
        let params = {
          startTime: new Date(this.$refs.selecttime1.beginTimes).getTime() / 1000,
          endTime: new Date(this.$refs.selecttime1.endTimes).getTime() / 1000,
          taskName: this.taskName,
          type: 0
        }
        this.ajaxObj.params.condition = params;
      },
      viewPassLog(row) {
        this.bloomDetail = true;
        $axios.post('/changePwdLog/view/', {taskuuid: row.taskUuid, loguuid: row.uuid}).then((res) => {
          this.passwordDetail = res.data;
        })
      },
      showPasswordDetail(taskUuid, uuid) {
        let vm = this;
        $axios.post('/changePwdLog/view/', {taskuuid: taskUuid, loguuid: uuid}).then((res) => {
          vm.bloomDetail = true;
          vm.passwordDetail = res.data;
        })
      },
      ExcelDownloadHandle() {
        let vm = this;
        $axios.post('changePwdLog/passwdChangeLogExport', {
          exportType: 'excel',
          startTime: new Date(this.$refs.selecttime1.beginTimes).getTime() / 1000,
          endTime: new Date(this.$refs.selecttime1.endTimes).getTime() / 1000,
          taskName: vm.taskName,
          passwdChangeType: 0
        }).then((res) => {
          if (res.data === 'success') {
            Download(`/changePwdLog/downPasswdChangeLog/excel?t=${new Date().getTime()}`);
          }
        });
      },
      PdfDownloadHandle() {
        let vm = this;
        $axios.post('/changePwdLog/passwdChangeLogExport', {
          exportType: 'pdf',
          startTime: new Date(this.$refs.selecttime1.beginTimes).getTime() / 1000,
          endTime: new Date(this.$refs.selecttime1.endTimes).getTime() / 1000,
          taskName: vm.taskName,
          passwdChangeType: 0
        }).then((res) => {
          if (res.data === 'success') {
            Download(`/changePwdLog/downPasswdChangeLog/pdf?t=${new Date().getTime()}`);
          }
        });
      },
      WordDownloadHandle() {
        let vm = this;
        $axios.post('/changePwdLog/passwdChangeLogExport', {
          exportType: 'word',
          startTime: new Date(this.$refs.selecttime1.beginTimes).getTime() / 1000,
          endTime: new Date(this.$refs.selecttime1.endTimes).getTime() / 1000,
          taskName: vm.taskName,
          passwdChangeType: 0
        }).then((res) => {
          if (res.data === 'success') {
            Download(`/changePwdLog/downPasswdChangeLog/word?t=${new Date().getTime()}`);
          }
        });
      }
    }
  }
</script>
