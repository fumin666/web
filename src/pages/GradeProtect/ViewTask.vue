<template>
  <section>
    <s-collapse v-model="activeNames" accordion>
      <s-collapse-item title="基础设置" name="base">
        <s-form ref="tReportSendTaskForm" :model="baseForm.tReportSendTask" label-width="120px" :rules="rules">
          <s-form-item label="任务名称" prop="reportSendTaskName">
            <s-input v-model="baseForm.tReportSendTask.reportSendTaskName" style="width:400px;" :disabled="true"></s-input>
          </s-form-item>
          <s-form-item label="是否周期任务">
            <s-radio-group v-model="baseForm.tReportSendTask.isPeriodicTask" :disabled="true">
              <s-radio :label="0">否</s-radio>
              <s-radio :label="1">是</s-radio>
            </s-radio-group>
          </s-form-item>
          <s-period disableFromProp v-model="baseForm.tScheduleTime" :showPeriodItem="showPeriodItem" ref="period"></s-period>
        </s-form>
      </s-collapse-item>
      <s-collapse-item title="报表选择" name="select">
        <s-table-page
          :data="logList"
          :page-layout="getPaginationDef()">
          <s-table-column label="报表名称" prop="reportTypeName"></s-table-column>
         <!-- <s-table-column label="操作" width="65px">
            <template slot-scope="scope">
              <i class="iconfont icon-delete delete" title="删除"></i>
            </template>
          </s-table-column>-->
        </s-table-page>
      </s-collapse-item>
      <s-collapse-item title="发送方式" name="type">
        <div style="margin: 10px 0;">
          <span>启用邮件发送方式</span>
          <s-switch :disabled="true" v-model="isOpenEmail" :active-value="1" :inactive-value="0"></s-switch>
        </div>
        <s-table-page
          v-show="isOpenEmail"
          :data="tReportSendTaskNotices"
          @selection-change="handleEmailSelect"
          :page-layout="getPaginationDef()">
          <s-table-column label="真实姓名" prop="userRealName"></s-table-column>
          <s-table-column label="Email" prop="userMail"></s-table-column>
        <!--  <s-table-column label="操作" width="65px">
            <template slot-scope="scope">
              <i class="iconfont icon-delete delete" title="删除"></i>
            </template>
          </s-table-column>-->
        </s-table-page>
      </s-collapse-item>
    </s-collapse>
    <!--添加-->
    <s-dialog
      v-model="addLogDialog"
      v-if="addLogDialog"
      title="添加"
      width="1000px"
      append-to-body>
      <add-log ref="addlog" @getLogList="getLogList" :checkLists="checkListUuids"></add-log>
    </s-dialog>
    <!--手动邮件-->
    <s-dialog v-model="bloomEmail" v-if="bloomEmail" title="邮件" append-to-body>
      <my-email ref="myEmail"></my-email>
      <template slot="footer">
        <s-button @click="myEmailOk">确定</s-button>
        <s-button type="cancel" @click="bloomEmail = false">取消</s-button>
      </template>
    </s-dialog>
    <!--添加引用-->
    <s-dialog v-model="bloomUser" v-if="bloomUser" title="账号" width="800px" append-to-body>
      <my-user :data="userList" :has-select="hasSelectUser" :type="userType" ref="myUser"></my-user>
      <template slot="footer">
        <s-button @click="myUserOk">确定</s-button>
        <s-button type="cancel" @click="bloomUser = false">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import sPeriod from '@/components/periodFormItem/Period'
  import AddLog from './AddLog.vue'
  import MyEmail from './../Event_AlarmCfg/MyEmail.vue'
  import MyUser from './../Event_AlarmCfg/MyUser.vue'
  import {delDiffArray} from 'sunflower-common-utils'
  // import { getTime } from 'sunflower-common-utils'
  export default {
    data () {
      return {
        activeNames: 'base',
        baseForm: {
          tReportSendTask: {
            reportSendTaskName: '',
            isPeriodicTask: 0
          },
          tScheduleTime: {
            timeType: 1,
            day: 1,
            week: 1,
            month: 1,
            year: 1,
            dayOfWeek: [2],
            dayOfMonth: [1],
            monthOfYear: 1,
            isForever: 0,
            firstFireTime: undefined,
            endFireTime: undefined
          },
          reportTypeUuidList: []
        },
        tReportSendTaskNotices: [],
        rules: {
          reportSendTaskName: [{required: true, message: '不能为空', trigger: 'blur'}],
          isPeriodicTask: [{required: true, message: '不能为空', trigger: 'blur'}]
        },
        showPeriodItem: false,
        logList: [],
        addLogDialog: false,
        selections: [],
        isOpenEmail: false,
        bloomEmail: false,
        bloomUser: false,
        userList: [],
        hasSelectUser: [],
        userType: 'listEmail',
        delEmail: [],
        checkListUuids: []
      }
    },
    components: {
      sPeriod,
      AddLog,
      MyEmail,
      MyUser
    },
    methods: {
      getPaginationDef() {
        return 'prev, pager, next'
      },
      // 表内操作列功能初始化
      getRowActionsDef() {
        let vm = this;
        return [{
          name: '删除',
          icon: 'delete',
          click(row) {
            vm.logList = vm.logList.filter((item) => {
              return item.uuid !== row.uuid
            })
          }
        }]
      },
      getLogList(checkList, checkListUuids) {
        this.logList = checkList
        this.baseForm.reportTypeUuidList = checkListUuids
        this.addLogDialog = false
      },
      handleEmailSelect(val) {
        this.delEmail = val;
      },
      showMyEmail() {
        this.bloomEmail = true
      },
      myEmailOk() {
        this.$refs.myEmail.$refs.myEmailForm.validate((valid) => {
          if (valid) {
            this.tReportSendTaskNotices.push(this.$refs.myEmail.myEmailForm);
            this.bloomEmail = false;
          } else {
            return false;
          }
        });
      },
      linkEmail() {
        this.hasSelectUser = this.tReportSendTaskNotices
        this.bloomUser = true
      },
      delEmailList() {
        if (this.delEmail.length < 1) {
          this.$message({type: 'info', message: '请选择要删除的数据'});
        } else {
          delDiffArray(this.tReportSendTaskNotices, this.delEmail);
        }
      },
      getUsers() {
        $axios.post('/iamUserInfo/list', {}).then((res) => {
          if (res.data && res.data instanceof Array) {
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].userPhone = res.data[i].userCellphone;
            }
            this.userList = res.data;
          }
        });
      },
      myUserOk() {
        let userData = this.$refs['myUser'].$refs['myUserList'].getAllSelectedData();
        this.tReportSendTaskNotices = userData;
        this.bloomUser = false;
      }
    },
    mounted() {
    },
    created() {
      this.getUsers()
      if (this.currentData) {
        let {tReportSendTask, tScheduleTime, tReportSendTaskNoticeList, tReportTypeInfoList} = this.currentData;
        this.baseForm.tReportSendTask = tReportSendTask
        this.baseForm.tScheduleTime = tScheduleTime
        this.logList = tReportTypeInfoList
        this.checkListUuids = tReportTypeInfoList.map((item) => { return item.uuid })
        this.baseForm.reportTypeUuidList = tReportTypeInfoList.map((item) => { return item.uuid })
        if (tReportSendTaskNoticeList.length > 0) {
          this.isOpenEmail = 1
          this.tReportSendTaskNotices = tReportSendTaskNoticeList
        }
      }
    },
    props: {
      currentData: {
        type: Object
      }
    },
    watch: {
      'baseForm.tReportSendTask.isPeriodicTask': {
        handler: function (val) {
          val === 0 ? this.showPeriodItem = false : this.showPeriodItem = true
        },
        deep: true
      },
      activeNames: {
        handler: function (val) {
          if (val === 'select') {
            $axios.get('/logCenterIndex/getAllReportTypeMap').then((res) => {
              if (res.data && res.data.length > 0) {
                // this.logList = res.data.field_14
              }
            })
          }
        }
      }
    }
  }
</script>
<style>
  .s-table tbody .cell .delete {
    color: #bbc1c8
  }
</style>
