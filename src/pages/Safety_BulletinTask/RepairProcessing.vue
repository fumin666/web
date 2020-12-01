<template>
  <div class="Bulletin">
    <s-row>
      <div style="width:10%;float:left;min-width:200px">
        <div class="left_safe">
          <div class="left_header">{{details.safeId}}</div>
          <div class="title">-- 功能菜单 --</div>
          <div class="left_btn" style="font-size:14px;" v-if='details.isConcern === 1' @click='attention(0)'>取消关注</div>
          <div class="left_btn_yes" style="font-size:14px" v-if='details.isConcern === 0' @click='attention(1)'>关注</div>
          <div class="left_content">
            <!-- <s-row style="margin:20px 0">
                <s-col span='8' style="padding-left:10px">
                    <div class="left_icon icon iconfont icon-event" ></div>
                </s-col>
                <s-col span='16'>
                    <s-button class="left_iconText" :class="deadlineflag === true ? 'power' : 'iconText1'" :disabled='deadlineflag' @click="deadline">任务排期</s-button>
                </s-col>
            </s-row> -->
            <s-row style="margin:20px 0;">
              <s-button class="left_iconText " icon='order-add' :class="taskFlag === true ? 'power' : 'iconText2'"
                        :disabled='taskFlag' @click="addSafeTask">创建任务单
              </s-button>
            </s-row>
            <s-row style="margin:20px 0">
              <s-button class="left_iconText" icon='assigned' :class="assignflag === true ? 'power' : 'iconText3'"
                        :disabled='assignflag' @click="appoint">指派
              </s-button>
            </s-row>
            <s-row style="margin:20px 0">
              <s-button class="left_iconText iconText4" icon='nav-process-center' @click="flowChart">流程图</s-button>
            </s-row>
          </div>
        </div>
      </div>
      <div style="padding:10px 0 10px 0px;float:left;width:calc(100vw - 250px);">
        <div>
          <s-steps :current="currentStep" finish-status="success">
            <s-step v-for="(val, index) in orderNodeList" :key='index' :title="val.nodeName"></s-step>
          </s-steps>
        </div>
        <div class="details" style="padding:10px;font-size:14px">
          <s-row>
            <s-col span='6'>
              <s-col class="title ellipsis" span='6' v-if="details.safeId && details.safeId.indexOf('DB') !== -1">
                工作类型：
              </s-col>
              <s-col class="title ellipsis" span='6' v-else>通报类型：</s-col>
              <s-col span='18'>{{details.safeType}}</s-col>
            </s-col>
            <s-col span='6'>
              <s-col class="title ellipsis" span='6'>工单状态：</s-col>
              <s-col span='18'>{{details.orderStatusName}}</s-col>
            </s-col>
            <s-col span='6'>
              <s-col class="title ellipsis" span='6'>创建人：</s-col>
              <s-col span='18'>{{details.creator}}</s-col>
            </s-col>
            <s-col span='6'>
              <s-col class="title ellipsis" span='6'>创建时间：</s-col>
              <s-col span='18'>{{details.createTime}}</s-col>
            </s-col>
            <s-col span='6' style="margin-top:20px" v-for='val in details.safeAttrList' :key='val.uuid'>
              <s-col v-if='val.attrType != 6' class="title ellipsis" span='6'>{{val.attrName + '：'}}</s-col>
              <s-col v-if='val.attrType != 6' class="ellipsis " span='18'>{{val.attrValue}}</s-col>
              <s-col v-if='val.attrType === 6' class="title ellipsis" span='6'>{{val.attrName}}：</s-col>
              <s-col v-if='val.attrType === 6' class="ellipsis "><span span='18' style="cursor: pointer;color:#199fed"
                                                                       @click='fileDownload(val)'>{{val.safeTaskAttachmentList.length}}</span><span> 个</span>
              </s-col>
            </s-col>
          </s-row>
        </div>
        <s-tab style="margin-top:20px" v-model="activeTab">
          <s-tab-pane label="工单处理" name='pane1'>
            <work-order v-if="activeTab === 'pane1'" :orderUuid='orderUuid' :disButton='disButton'
                        :curNodeUuid='currentNodeUuid'></work-order>
          </s-tab-pane>
          <s-tab-pane label="工单流转信息" name='pane2'>
            <transfer v-if="activeTab === 'pane2'" :orderUuid='orderUuid' :currentNodeUuid='currentNodeUuid'></transfer>
          </s-tab-pane>
          <s-tab-pane label="任务" name='pane3'>
            <task-list v-if="activeTab === 'pane3' && $route.name !== 'gradeProtect_workRemind'" :refer='refer'
                       :disButton='taskFlag' @refstate='refstate' :orderUuid='orderUuid'
                       :curNodeUuid='currentNodeUuid'></task-list>
            <task-grade-list v-if="activeTab === 'pane3' && $route.name === 'gradeProtect_workRemind'" :refer='refer'
                             :disButton='taskFlag' @refstate='refstate' :orderUuid='orderUuid'
                             :curNodeUuid='currentNodeUuid'></task-grade-list>
          </s-tab-pane>
          <s-tab-pane label="任务历史" name='pane4'>
            <task-history v-if="activeTab === 'pane4' && $route.name !== 'gradeProtect_workRemind'" :refer='refer'
                          :disButton='taskFlag' @refstate='refstate' :orderUuid='orderUuid'
                          :curNodeUuid='currentNodeUuid'></task-history>
            <task-grade-history v-if="activeTab === 'pane4' && $route.name === 'gradeProtect_workRemind'" :refer='refer'
                                :disButton='taskFlag' @refstate='refstate' :orderUuid='orderUuid'
                                :curNodeUuid='currentNodeUuid'></task-grade-history>
          </s-tab-pane>
        </s-tab>
        <s-form style="margin-top:10px">
          <s-form-item label="任务执行人：" v-if="showFlag === 1 && nodeType !== 2">
            <s-select v-model="assignUser">
              <s-option v-for='val in userData' :key='val.uuid' :value='val.uuid' :label='val.userRealName'>
                {{val.userRealName}}
              </s-option>
            </s-select>
            <s-button :disabled='disButton' @click="commit">提交</s-button>
          </s-form-item>
        </s-form>
        <div>
          <s-form style="margin-top:10px">
            <s-form-item>
              <s-button v-if="nodeType === 2" :disabled='disButton' @click="submit">审批</s-button>
              <s-button v-if="showFlag === 2" :disabled='disButton' @click="accomplish">完成</s-button>
            </s-form-item>
          </s-form>
        </div>
      </div>
    </s-row>
    <!-- 排期 -->
    <s-dialog
      v-model="deadlineDialog"
      v-if="deadlineDialog"
      :before-close="deadlineClose"
      width="600px"
      title="排期">
      <s-date-picker v-model="planStartTime" @change="getDateRangeStart" type="datetime"
                     value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择起始时间"
                     :editable="false">
      </s-date-picker>
      ~
      <s-date-picker v-model="planEndTime" @change="getDateRangeEnd" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                     format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" :editable="false">
      </s-date-picker>
      <template slot="footer" class="dialog-footer">
        <s-button @click="deadlineSubmit">保存</s-button>
        <s-button type="cancel" @click="deadlineClose">关闭</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="fileDialog"
      v-if="fileDialog"
      width="600px"
      title="附件下载">
      <s-table-page :data='fileData' style="margin-top:10px">
        <s-table-column prop="attacthmentName" label="文件名称"></s-table-column>
        <s-table-column prop="attacthmentSize" label="大小"></s-table-column>
        <s-table-column label="操作" width="150">
          <template slot-scope="scope">
            <i class="iconfont icon-download" title="下载" @click="download(scope.row)"> </i>
          </template>
        </s-table-column>
      </s-table-page>
    </s-dialog>
    <s-dialog
      v-model="appoveDialog"
      v-if="appoveDialog"
      width="600px"
      append-to-body
      :before-close="appoveClose"
      class="createProcess"
      title="审批工单">
      <s-form :model="appoveForm" :rules="appoveRule" ref="appoveForm" label-width='125px'>
        <s-form-item label="审批意见：" prop='approvalResult'>
          <s-radio class="radio" v-model="appoveForm.approvalResult" :value='1' :label="1">通过</s-radio>
          <s-radio class="radio" v-model="appoveForm.approvalResult" :value='0' :label="0">拒绝</s-radio>
        </s-form-item>
        <s-form-item label="工作信息：" prop='workInfo'>
          <s-input type='textarea' v-model="appoveForm.workInfo"></s-input>
        </s-form-item>
        <s-form-item label="下一节点处理人" prop='assignUser'>
          <s-select v-model="appoveForm.assignUser">
            <s-option v-for='val in userData' :key='val.uuid' :label='val.userRealName' :value='val.uuid'>
              {{val.userRealName}}
            </s-option>
          </s-select>
        </s-form-item>
      </s-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="appoveSave">保存</s-button>
        <s-button type="cancel" @click="appoveClose">关闭</s-button>
      </template>
    </s-dialog>
    <!-- 创建任务单 -->
    <safeTask v-model="addSafetaskDialog" :title='title' v-if="addSafetaskDialog" :typeUuid='typeUuid'
              :orderUuid='orderUuid' :currentNodeUuid='currentNodeUuid' @safeTask='safeTask'></safeTask>
    <appoint-dialog v-model="appointDialog" @receive='receive' :taskName='taskName' v-if="appointDialog"
                    :orderUuid='orderUuid' :currentNodeUuid='currentNodeUuid'></appoint-dialog>
  </div>
</template>
<script>
  import $axios from 'sunflower-ajax'
  import SafeTask from '@/pages/Safety_BulletinTask/components/SafeTask';
  import AppointDialog from '@/pages/Safety_BulletinTask/components/dialog/AppointDialog';
  import WorkOrder from '@/pages/Safety_BulletinTask/components/WorkOrder';
  import TaskList from '@/pages/Safety_BulletinTask/components/TaskDispose';
  import TaskGradeList from '@/pages/GradeProtect_WorkFlow/components/TaskDispose';
  import TaskHistory from '@/pages/Safety_BulletinTask/components/TaskHistory';
  import TaskGradeHistory from '@/pages/GradeProtect_WorkFlow/components/TaskHistory';
  import Transfer from '@/pages/Safety_BulletinTask/components/Transfer';
  import {Download} from 'sunflower-common-utils';

  export default {
    data() {
      return {
        currentStep: 0,
        orderNodeList: [],
        details: [],
        deadlineDialog: false,
        addSafetaskDialog: false,
        activeTab: 'pane1',
        orderUuid: '',
        currentNodeUuid: '',
        title: '创建',
        planStartTime: null,
        planEndTime: null,
        appointDialog: false,
        typeUuid: '',
        userData: [],
        assignUser: '',
        showFlag: 1,
        fileDialog: false,
        fileData: [],
        refer: false,
        jurisdiction: false,
        disButton: false,
        appoveDialog: false,
        appoveForm: {
          approvalResult: 1,
          workInfo: '',
          assignUser: ''
        },
        appoveRule: {
          workInfo: [{required: true, message: '不能为空', trigger: 'blur'}, {
            max: 120,
            message: '最大长度为120',
            trigger: 'blur'
          }],
          assignUser: [{required: true, message: '不能为空', trigger: 'blur'}]
        },
        nodeType: 1,
        taskFlag: false,
        assignflag: false,
        deadlineflag: false,
        taskName: ''
      }
    },
    watch: {},
    created() {
      this.getData()
      this.getUsers()
    },
    methods: {
      // 获取人员列表信息
      getUsers() {
        if (this.$route.name === 'gradeProtect_workRemind') {
          $axios.get('/safetyPlatform/safeOrder/getGradeProtectUserList').then(res => {
            this.userData = res.data
          })
        } else {
          $axios.get('/safetyPlatform/safeOrder/getSafeUserInfoList').then(res => {
            this.userData = res.data
          })
        }
      },
      download(val) {
        Download(`/safetyPlatform/fileUpload/downloadOrderTaskFile/${val.uuid}/3`)
      },
      getData() {
        $axios.get(`/safetyPlatform/safeOrder/getSafeOrderDetail/${this.$route.params.tbUuid}`).then(res => {
          this.orderNodeList = res.data.orderNodeList
          this.taskName = res.data.safeId
          this.details = res.data
          res.data.orderNodeList.map((val, index) => {
            if (res.data.currentNodeUuid === val.uuid) {
              this.nodeType = val.nodeType
              this.currentStep = index
            }
          })
          if (this.details.orderStatus === 1) {
            this.disButton = true
            this.assignflag = true
            this.taskFlag = true
            this.deadlineflag = true
          } else if (this.details.orderStatus === 2 && this.$store.state.userData.uuid === this.details.assignUser) {
            if (this.details.isStartTask === 1) {
              this.disButton = false
              this.taskFlag = true
              this.assignflag = false
              this.deadlineflag = false
            } else if (this.nodeType === 2) {
              this.disButton = false
              this.taskFlag = false
              this.deadlineflag = false
              this.assignflag = true
            } else {
              this.deadlineflag = false
              this.disButton = false
              this.taskFlag = false
              this.assignflag = false
            }
          } else {
            this.disButton = true
            this.assignflag = true
            this.taskFlag = true
            this.deadlineflag = true
          }
          this.orderUuid = res.data.uuid
          this.typeUuid = res.data.typeUuid
          this.currentNodeUuid = res.data.currentNodeUuid
          if (res.data.currentNodeUuid === res.data.orderNodeList[res.data.orderNodeList.length - 1].uuid) {
            this.showFlag = 2
          }
        })
      },
      // 提交按钮
      commit() {
        if (this.assignUser === '') {
          this.$message({message: '请选择任务执行人!', type: 'error'});
          return
        } else {
          $axios.get(`/safetyPlatform/safeOrder/jumpNextNode/${this.orderUuid}/${this.currentNodeUuid}/${this.assignUser}`).then(res => {
            if (res.data.state) {
              this.$message({message: '提交成功!', type: 'success'});
              this.getData()
              this.assignUser = ''
            } else {
              this.$message({message: res.data.errormsg, type: 'error'});
            }
          })
        }
      },
      receive() {
        this.getData()
      },
      getDateRangeStart() {
        let start = this.planStartTime ? new Date(this.planStartTime).getTime() / 1000 : 0
        let end = this.planEndTime ? new Date(this.planEndTime).getTime() / 1000 : 0
        if (end) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.planStartTime = '';
          }
        }
      },
      getDateRangeEnd() {
        let start = this.planStartTime ? new Date(this.planStartTime).getTime() / 1000 : 0
        let end = this.planEndTime ? new Date(this.planEndTime).getTime() / 1000 : 0
        if (start) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.planEndTime = '';
          }
        }
      },
      deadlineSubmit() {
        let parms = {
          orderUuid: this.orderUuid,
          currentNodeUuid: this.currentNodeUuid,
          planStartTime: new Date(this.planStartTime).getTime() / 1000,
          planEndTime: new Date(this.planEndTime).getTime() / 1000
        }
        $axios.post(`/safetyPlatform/safeOrderTask/planCurNodeTaskList`, parms).then(res => {
          if (res.data.state) {
            this.$message({message: '保存成功!', type: 'success'});
            this.getData()
            this.deadlineDialog = false
          } else {
            this.$message({message: res.data.errormsg, type: 'error'});
          }
        })
      },
      flowChart() {
        if (this.$route.name === 'gradeProtect_workRemind') {
          this.$router.push(`/GradeProtect/safetyBulletin_flowChart/${this.details.uuid}/${this.details.safeId}`)
        } else {
          this.$router.push(`/SafetyBulletin/safetyBulletin_flowChart/${this.details.uuid}/${this.details.safeId}`)
        }
      },
      appoveSave() {
        let str = ''
        if (this.$route.name === 'gradeProtect_workRemind') {
          str = '处理|我的待办>等保工作(#safeId#)'
        } else {
          str = '处理|通报(#safeId#)'
        }
        this.$refs['appoveForm'].validate((valid) => {
          if (valid) {
            let parms = Object.assign({}, this.appoveForm)
            parms.orderUuid = this.details.uuid
            $axios.post('/safetyPlatform/safeOrder/approvalOrder', parms, {
              data: [this.details],
              logTemplate: str
            }).then(res => {
              if (res.data.state) {
                this.$message({message: '审批成功!', type: 'success'});
                this.getData()
                this.appoveClose()
              } else {
                this.$message({message: res.data.errormsg, type: 'error'});
              }
            })
          }
        })
      },
      deadlineClose() {
        this.planStartTime = null
        this.planEndTime = null
        this.deadlineDialog = false
      },
      deadline() {
        this.deadlineDialog = true
        this.planStartTime = this.details.planStartTime
        this.planEndTime = this.details.planEndTime
      },
      // 附件下载
      Download(val) {
        Download(`/safetyPlatform/fileUpload/downloadOrderTaskFile/${val.uuid}/1`);
      },
      fileDownload(val) {
        this.fileDialog = true
        this.fileData = val.safeTaskAttachmentList
      },
      // 指派
      appoint() {
        this.appointDialog = true
      },
      safeTask(val) {
        this.refer = val
      },
      refstate(val) {
        this.refer = val
        this.getData()
      },
      addSafeTask() {
        this.addSafetaskDialog = true
      },
      // 提交按钮
      submit() {
        this.appoveDialog = true
      },
      appoveClose() {
        this.appoveForm = {
          approvalResult: 1,
          workInfo: '',
          assignUser: ''
        }
        this.appoveDialog = false
      },
      // 完成
      accomplish() {
        $axios.get(`/safetyPlatform/safeOrder/finishSafeOrder/${this.orderUuid}/${this.currentNodeUuid}`).then(res => {
          if (res.data.state) {
            this.$message({message: '处理成功!', type: 'success'});
            this.getData()
          } else {
            this.$message({message: res.data.errormsg, type: 'error'});
          }
        })
      },
      attention(val) {
        let parms = {
          orderUuid: this.orderUuid,
          orderType: 1,
          type: val
        }
        let str = ''
        if (this.$route.name === 'gradeProtect_workRemind') {
          str = val === 1 ? '关注|我的待办>等保工作(#safeId#)' : '取消关注|我的待办>等保工作(#safeId#)'
        } else {
          str = val === 1 ? '关注|通报(#safeId#)' : '取消关注|通报(#safeId#)'
        }
        $axios.post(`/safetyPlatform/safeOrder/concernOrderOrTask`, parms, {
          data: [this.details],
          logTemplate: str
        }).then(res => {
          if (res.data.state) {
            if (val === 1) {
              this.$message({message: '关注成功!', type: 'success'});
            } else {
              this.$message({message: '取消关注成功!', type: 'success'});
            }
            this.getData()
          }
        })
      }
    },
    components: {
      WorkOrder,
      SafeTask,
      TaskList,
      TaskGradeList,
      TaskGradeHistory,
      Transfer,
      AppointDialog,
      TaskHistory
    }
  }
</script>
<style lang="stylus">

</style>
