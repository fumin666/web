<template>
  <section id="taskOrderDetail">
    <s-scrollbar wrap-style="max-height: calc(100vh - 180px);">
      <div style="float: left; width: 37%;">
        <s-form
          id="taskOrderForm"
          ref="taskOrderForm"
          :model="taskOrderForm"
          :rules="taskOrderFormRules"
          label-width="130px">
          <s-form-item label="任务编号：" prop="serialCode">
            <s-input v-model="taskOrderForm.serialCode" disabled></s-input>
          </s-form-item>
          <s-form-item label="任务标题：" prop="title">
            <s-input v-model="taskOrderForm.title" :disabled="allDisabled"></s-input>
          </s-form-item>
          <s-form-item label="任务描述：" prop="detailDesc">
            <s-input v-model="taskOrderForm.detailDesc" type="textarea" :rows="3" :disabled="allDisabled"></s-input>
          </s-form-item>
          <s-form-item label="分类一级：" prop="categoryFirst">
            <s-select
              v-model="taskOrderForm.categoryFirst"
              :anonLabel="taskOrderForm.categoryFirstName"
              @focus="getItilCategory(taskOrderForm.companyUuid)"
              :disabled="allDisabled">
              <s-option
                v-for="item in categoryLevels.firstLevel"
                :label="item.categoryName"
                :value="item.uuid"
                :key="item.uuid">
              </s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="分类二级：" prop="categorySecond">
            <s-select
              v-model="taskOrderForm.categorySecond"
              :anonLabel="taskOrderForm.categorySecondName"
              :disabled="allDisabled">
              <s-option
                v-for="item in categoryLevels.secondLevel"
                :label="item.categoryName"
                :value="item.uuid"
                :key="item.uuid">
              </s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="分类三级：" prop="categoryThird">
            <s-select
              v-model="taskOrderForm.categoryThird"
              :anonLabel="taskOrderForm.categoryThirdName"
              :clearable="true"
              :disabled="allDisabled">
              <s-option
                v-for="item in categoryLevels.thirdLevel"
                :label="item.categoryName"
                :value="item.uuid"
                :key="item.uuid">
              </s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="任务来源：" prop="taskSource">
            <s-select v-model="taskOrderForm.taskSource" :disabled="allDisabled">
              <s-option
                v-for="(value, key, idx) in preGetFormData.taskSourceMap"
                :label="value" :value="parseInt(key)" :key="idx">
              </s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="紧急程度：" prop="criticality">
            <s-select v-model="taskOrderForm.criticality" :disabled="allDisabled">
              <s-option
                v-for="(value, key, idx) in preGetFormData.taskCriticalityMap"
                :label="value" :value="parseInt(key)" :key="idx">
              </s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="紧急程度说明：" prop="criticalityDesc">
            <s-input v-model="taskOrderForm.criticalityDesc" type="textarea" :rows="3" :disabled="allDisabled"></s-input>
          </s-form-item>
          <s-form-item label="受派组：" prop="assignGroup">
            <s-select
              v-model="taskOrderForm.assignGroup"
              :anonLabel="taskOrderForm.assignGroupName"
              :clearable="true"
              :disabled="allDisabled || assignDisabled">
              <s-option v-for="item in assignGroups" :label="item.groupName" :value="item.uuid" :key="item.uuid"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="受派人：" prop="assignUser" class="assignUser">
            <!--受派人详细信息-->
            <NameCardHover :useruuid="taskOrderForm.assignUser" :placement="'right'" :type="'hover'">
              <s-select
                v-model="taskOrderForm.assignUser"
                :anonLabel="taskOrderForm.assignUserName"
                :clearable="true"
                :disabled="allDisabled || assignDisabled">
                <s-option v-for="item in assignUsers" :label="item.userRealName" :value="item.uuid" :key="item.uuid"></s-option>
              </s-select>
            </NameCardHover>
          </s-form-item>
          <s-form-item label="状态：" prop="taskStatusName">
            <s-select
              v-model="taskOrderForm.taskStatusName"
              :anonLabel="taskOrderForm.taskStatusName"
              disabled>
              <!--暂时无法获取状态列表！！！-->
            </s-select>
          </s-form-item>
          <s-form-item label="执行结果描述：" prop="taskResult">
            <s-input v-model="taskOrderForm.taskResult" type="textarea" :rows="3" :disabled="allDisabled"></s-input>
          </s-form-item>
          <s-form-item label="关闭代码：" prop="closeCode">
            <s-select v-model="taskOrderForm.closeCode" disabled>
              <s-option
                v-for="(value, key, idx) in preGetFormData.taskCloseCodeMap"
                :label="value" :value="parseInt(key)" :key="idx">
              </s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="取消原因：" prop="cancelReason">
            <s-input v-model="taskOrderForm.cancelReason" type="textarea" :rows="3" disabled></s-input>
          </s-form-item>
        </s-form>
      </div>

      <div style="float: left; width: 61%; margin-left: 20px;">
        <s-tab v-model="activeTab">
          <s-tab-pane label="工作详细信息">
            <s-button icon="plus" @click="addWorkInfoDialog" style="margin-bottom: 10px;">添加工作信息</s-button>
            <s-table-page
              id="workDetailInfo"
              :data="workDetailInfo"

              actions-col-width="15"
              :row-actions="setRowActionsDef()"
              :header-search="setSearchDef()">
              <s-table-column prop="logTypeStr" label="类型" width="130">
              </s-table-column>
              <s-table-column prop="logDetail" label="工作信息">
              </s-table-column>
              <s-table-column label="文件" width="80">
                <template slot-scope="scope">
                  <span v-text="(scope.row.attachmentList||[]).length"></span>
                </template>
              </s-table-column>
              <s-table-column prop="createTime" label="提交日期" width="180">
              </s-table-column>
              <s-table-column prop="createUserName" label="提交人名称" width="130">
              </s-table-column>
            </s-table-page>
          </s-tab-pane>
          <s-tab-pane label="关联关系">
            <s-table-page
              ref="associationTable"
              :data="associationList"

              :header-actions="setAssoActionDef()"
              actions-col-width="30"
              :row-actions="setAssoRowActionsDef()"
              :header-search="setAssoSearchDef()"
              @selection-change="getAssoMultiSelection">
              <s-table-column type="selection">
              </s-table-column>
              <s-table-column label="工单编号">
                <template slot-scope="scope">
                  <span
                    class="clickLink"
                    v-text="scope.row.serialCode"
                    @click="JumpToAssoOrder(scope.row)">
                  </span>
                </template>
              </s-table-column>
              <s-table-column prop="orderTypeStr" label="工单类型">
              </s-table-column>
              <s-table-column prop="briefDesc" label="简要描述">
              </s-table-column>
              <s-table-column prop="statusName" label="状态">
              </s-table-column>
            </s-table-page>
          </s-tab-pane>
          <s-tab-pane label="日期/系统">
            <div id="systemDate">
              <s-row>
                <s-col :span="4" class="grid-content bg-purple">创建人：</s-col>
                <s-col :span="20" class="grid-content bg-purple-light"> {{ timeInfoForm.createUserName }} </s-col>
              </s-row>
              <s-row>
                <s-col :span="4" class="grid-content bg-purple">计划开始时间：</s-col>
                <s-col :span="20" class="grid-content bg-purple-light"> {{ timeInfoForm.planStartTime }} </s-col>
              </s-row>
              <s-row>
                <s-col :span="4" class="grid-content bg-purple">计划结束时间：</s-col>
                <s-col :span="20" class="grid-content bg-purple-light"> {{ timeInfoForm.planEndTime }} </s-col>
              </s-row>
              <s-row>
                <s-col :span="4" class="grid-content bg-purple">实际开始时间：</s-col>
                <s-col :span="20" class="grid-content bg-purple-light"> {{ timeInfoForm.startTime }} </s-col>
              </s-row>
              <s-row>
                <s-col :span="4" class="grid-content bg-purple">实际结束时间：</s-col>
                <s-col :span="20" class="grid-content bg-purple-light"> {{ timeInfoForm.endTime }} </s-col>
              </s-row>
              <s-row>
                <s-col :span="4" class="grid-content bg-purple">指派时间：</s-col>
                <s-col :span="20" class="grid-content bg-purple-light"> {{ timeInfoForm.assignTime }} </s-col>
              </s-row>
              <s-row>
                <s-col :span="4" class="grid-content bg-purple">修改时间：</s-col>
                <s-col :span="20" class="grid-content bg-purple-light"> {{ timeInfoForm.updateTime }} </s-col>
              </s-row>
              <s-row>
                <s-col :span="4" class="grid-content bg-purple">关闭时间：</s-col>
                <s-col :span="20" class="grid-content bg-purple-light"> {{ timeInfoForm.closeTime }} </s-col>
              </s-row>
              <s-row>
                <s-col :span="4" class="grid-content bg-purple">取消时间：</s-col>
                <s-col :span="20" class="grid-content bg-purple-light"> {{ timeInfoForm.cancelTime }} </s-col>
              </s-row>
            </div>
          </s-tab-pane>
        </s-tab>
      </div>
    </s-scrollbar>

    <s-row class="footerBar">
      <s-button
        @click="saveTaskOrder"
        :disabled="allDisabled || saveDisabled">保存
      </s-button>
      <s-button
        @click="assignTaskOrder"
        :disabled="allDisabled || assignDisabled">指派
      </s-button>
      <s-button
        @click="receiveTaskOrder"
        :disabled="allDisabled || receiveDisabled">接单
      </s-button>
      <s-button
        @click="finishTaskOrder"
        :disabled="allDisabled || finishDisabled">完成
      </s-button>
      <s-button
        @click="closeTaskOrder"
        :disabled="allDisabled || closeDisabled">关闭
      </s-button>
      <s-button
        @click="cancelTaskOrder"
        :disabled="allDisabled || cancelDisabled">取消
      </s-button>
    </s-row>


    <!--工作信息详情-->
    <s-dialog
      title="工作信息详情"
      width="700px"
      ref="workInfoDetailDialog"
      v-if="workInfoDetailDialog"
      v-model="workInfoDetailDialog">
      <work-info-detail :detailData="workInfoDetailData"></work-info-detail>
    </s-dialog>

    <!--创建关联关系-->
    <s-dialog
      title="创建关联关系"
      width="900px"
      ref="createAssoDialog"
      v-if="createAssoDialog"
      v-model="createAssoDialog">
      <s-scrollbar wrap-style="max-height: 600px;">
        <create-asso :uuid="taskOrderUuid" @afterChange="closeCreateAsso()"></create-asso>
      </s-scrollbar>
    </s-dialog>

    <!--指派变更任务单-->
    <s-dialog
      title="任务单指派"
      width="500px"
      ref="assignTaskOrderDialog"
      v-if="assignTaskOrderDialog"
      v-model="assignTaskOrderDialog">
      <assign-task-order
        ref="assignTaskOrderForm"
        :taskOrderUuid="taskOrderUuid"
        :companyUuid="taskOrderForm.companyUuid"
        @closeAssignTaskOrder="closeAssignDialog"></assign-task-order>
    </s-dialog>

    <!--完成-->
    <s-dialog
      title="执行结果描述"
      ref="finishTaskOrderDialog"
      v-if="finishTaskOrderDialog"
      v-model="finishTaskOrderDialog">
      <finish-task-order
        :taskOrderUuid="taskOrderUuid"
        @closeFinishTaskOrder="closeFinishTaskOrder"></finish-task-order>
    </s-dialog>

    <!--关闭变更任务单-->
    <s-dialog
      title="关单"
      width="500px"
      ref="closeTaskOrderDialog"
      v-if="closeTaskOrderDialog"
      v-model="closeTaskOrderDialog">
      <close-dialog  ref="closeTaskOrderForm" :changeCloseCodeMap="taskOrderSelect"></close-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveCloseTaskOrder">保存</s-button>
        <s-button type="cancel" @click="cancelCloseTaskOrder">取消</s-button>
      </template>
    </s-dialog>

    <s-dialog
      title="添加工作信息" top="10%" width="600px"
      v-if="addWorkinfoFlag"
      v-model="addWorkinfoFlag">
      <s-form ref="workInfoForm" :model="workInfoForm" :rules="workInfoFormRules" label-width="120px">
        <s-form-item label="工作信息" prop="content">
          <s-input type="textarea" :rows="3" v-model="workInfoForm.content"></s-input>
        </s-form-item>
        <s-form-item label="附件信息">
          <s-row>
            <s-upload class="upload"
                      ref="upload"
                      :action="workInfoUrl"
                      multiple
                      :on-success="uploadSuccess"
                      :on-remove="uploadRemove"
                      :file-list="fileListUpload"
                      :with-credentials="true">
              <s-button slot="trigger" icon="export">上传</s-button>
            </s-upload>
          </s-row>
        </s-form-item>
      </s-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addWorkInfo">添加</s-button>
      </template>
    </s-dialog>
    <!--取消变更任务单-->
    <s-dialog
      title="取消"
      ref="cancelTaskOrderDialog"
      v-if="cancelTaskOrderDialog"
      v-model="cancelTaskOrderDialog">
      <cancel ref="cancelTaskOrderForm"></cancel>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveCancelTaskOrder">确定</s-button>
        <s-button type="cancel" @click="cancelTaskOrderCancel">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {intersectObj} from 'sunflower-common-utils';
  import mixin from './DetailDialog/MethodsMixin';

  import {NameCardHover} from '@/components/nameCard/NameCard';
  import workInfoDetail from '@/pages/Process_Components/WorkInfoDetail.vue'
  import createAsso from '@/pages/Process_Components/CreateAssociationRelationship.vue';
  import assignTaskOrder from './DetailDialog/PublishAssignTaskOrder.vue';
  import finishTaskOrder from './DetailDialog/PublishFinishTaskOrder.vue';
  import closeDialog from './DetailDialog/PublishCloseDialog.vue';
  import cancel from './DetailDialog/PublishCancel.vue';

  export default{
    data() {
      return {
        userUuid: this.$store.state.userData.uuid,
        taskOrderUuid: this.$route.params.uuid,          // 当前任务工单的uuid
        activeTab: 0,
        allDisabled: false,       // 所有按钮是否禁用
        saveDisabled: false,      // 禁用'保存'
        assignDisabled: false,    // 禁用'指派'
        receiveDisabled: false,   // 禁用'接单'
        finishDisabled: false,    // 禁用'完成'
        closeDisabled: false,     // 禁用'关单'
        cancelDisabled: false,    // 禁用'取消'
        // 左侧任务工单详情表单--预先获取的下拉框数据
        preGetFormData: {
          taskSourceMap: {},
          taskCriticalityMap: {},
          taskStatusName: '',
          taskCloseCodeMap: {}
        },
        taskOrderForm: {                // 左侧任务单详细信息表单
          serialCode: '',
          title: '',
          detailDesc: '',
          categoryFirst: '',
          categorySecond: '',
          categoryThird: '',
          taskSource: '',
          criticality: '',
          criticalityDesc: '',
          assignGroup: '',
          assignUser: '',
          taskStatus: '',
          taskResult: '',
          closeCode: '',
          cancelReason: '',
          companyUuid: ''
        },
        taskOrderFormRules: {
          title: [{required: true, message: '不能为空', trigger: 'blur'}],
          categoryFirst: [{required: true, message: '不能为空', trigger: 'blur'}],
          categorySecond: [{required: true, message: '不能为空', trigger: 'blur'}],
          taskSource: [{type: 'number', required: true, message: '不能为空', trigger: 'blur'}],
          criticality: [{type: 'number', required: true, message: '不能为空', trigger: 'blur'}]
        },
        assignGroups: [],               // 左侧任务单详细信息-受派组
        assignUsers: [],                // 左侧任务单详细信息-受派人
        workDetailInfo: [],             // 右侧工作详细信息
        workInfoDetailDialog: false,    // 右侧查看工作详细信息详情弹框
        workInfoDetailData: {},         // 右侧查看工作详细信息详情数据
        associationList: [],            // 右侧关联关系列表
        assoCiationMultiSele: [],       // 右侧关联关系多选值数组
        createAssoDialog: false,        // 右侧新建关联关系弹框
        timeInfoForm: {                 // 右侧时间信息表单
          createUserName: '',
          planStartTime: '',
          planEndTime: '',
          startTime: '',
          endTime: '',
          assignTime: '',
          updateTime: '',
          closeTime: '',
          cancelTime: ''
        },
        timeInfoFormRules: {},
        // 右侧添加工作信息相关数据
        workInfoForm: {                     // 右侧添加工作信息表单
          content: ''
        },
        workInfoFormRules: {},
        fileList: [],
        fileListUpload: [],
        workInfoUrl: `${$axios.basePath()}/fileUpload/uploadItilattach`,  // 附件列表上传地址
        // 任务单弹框数据
        taskOrderSelect: {},                // 任务单下拉框
        assignTaskOrderDialog: false,       // 指派变更任务单
        finishTaskOrderDialog: false,       // 完成任务单
        closeTaskOrderDialog: false,        // 关闭任务单弹框
        cancelTaskOrderDialog: false,        // 取消变更任务单
        addWorkinfoFlag: false
      }
    },
    components: {

      NameCardHover,
      workInfoDetail,
      createAsso,
      assignTaskOrder,
      finishTaskOrder,
      closeDialog,
      cancel
    },
    mixins: [mixin],
    watch: {
      'taskOrderForm.categoryFirst'(newVal, oldVal) {
        if (oldVal) {
          this.taskOrderForm.categorySecond = ''
          this.taskOrderForm.categoryThird = ''
        }
        this.getSecondCategory(this.taskOrderForm.companyUuid, newVal)
      },
      'taskOrderForm.categorySecond'(newVal, oldVal) {
        if (oldVal) {
          this.taskOrderForm.categoryThird = ''
        }
        this.getThirdCategory(this.taskOrderForm.companyUuid, this.taskOrderForm.categoryFirst, newVal)
      },
      'taskOrderForm.assignGroup'(newVal) {
        this.getAssignUsers(newVal)
      }
    },
    methods: {
      addWorkInfoDialog() {
        this.addWorkinfoFlag = true
      },
      // 判断当前用户对于按钮的可用性
      judgeDisabled(data) {
        this.allDisabled = this.saveDisabled = this.assignDisabled = this.receiveDisabled = false
        this.finishDisabled = this.closeDisabled = this.cancelDisabled = false
        let userUuid = this.userUuid
        let threeJudge = (userUuid === data.assignUser || userUuid === data.changeManagerUser || userUuid === data.changeAdminUser)
        // 当前用户 !== 流程提交人 && 当前用户 !== 任务受派人
        if (userUuid !== data.createUser && !threeJudge) {
          this.allDisabled = true
        } else if (userUuid === data.createUser && !threeJudge) {
          // 当前用户 === 流程提交人 && 当前用户 !== 任务受派人
          if (data.taskStatus === 1) {
            this.receiveDisabled = this.finishDisabled = this.closeDisabled = this.cancelDisabled = true
          } else {
            this.allDisabled = true
          }
        } else if (threeJudge && userUuid !== data.createUser) {
          // 当前用户=== 任务受派人 && 当前用户 !== 流程提交人
          switch (data.taskStatus) {
            case 1:
            case 5:
            case 6:
              this.allDisabled = true
              break;
            case 2:
              this.finishDisabled = this.closeDisabled = true
              break;
            case 3:
              this.receiveDisabled = this.closeDisabled = true
              break;
            case 4:
              this.assignDisabled = this.receiveDisabled = this.finishDisabled = this.cancelDisabled = true
              break;
          }
        } else if (userUuid === data.createUser && threeJudge) {
          // 当前用户 === 流程提交人 && 当前用户 === 任务受派人
          switch (data.taskStatus) {
            case 1:
              this.receiveDisabled = this.finishDisabled = this.closeDisabled = this.cancelDisabled = true
              break;
            case 2:
              this.finishDisabled = this.closeDisabled = true
              break;
            case 3:
              this.receiveDisabled = this.closeDisabled = true
              break;
            case 4:
              this.assignDisabled = this.receiveDisabled = this.finishDisabled = this.cancelDisabled = true
              break;
            case 5:
            case 6:
              this.allDisabled = true
              break;
          }
        }
      },
      // 获取受派组
      getAssignGroups(companyUuid) {
        return new Promise((resolve, reject) => {
          $axios.get(`/itilPublishOrder/getAllPublishTaskAssignGroup/${companyUuid}`).then(({data}) => {
            if (data && data instanceof Object) {
              this.assignGroups = data
              resolve(1)
            } else {
              reject(0)
            }
          })
        })
      },
      // 获取受派人
      getAssignUsers(groupUuid) {
        $axios.get(`/itilPublishOrder/getAllPublishTaskAssignUserByGroup/${groupUuid}`).then(({data}) => {
          if (data && data instanceof Object) {
            this.assignUsers = data
          }
        })
      },
      /**
       * 预先获取左侧详情表单中下拉框选项数据
       * - 获取三个分类级别
       * - 获取任务来源、紧急程度、状态、关闭代码
       * - 获取时间信息表单
       */
      preGetSelectsList() {
        $axios.get(`/itilPublishOrder/getPublishTaskDetail/${this.taskOrderUuid}`).then(({data}) => {
          if (data && data instanceof Object) {
            this.judgeDisabled(data)          // 判断当前用户对于页面按钮的可用性
            this.preGetFormData = Object.assign({}, data)         // 左侧变更单详情-任务来源、紧急程度、状态、关闭代码下拉选项
            this.timeInfoForm = Object.assign({}, data)           // 获取右侧时间信息表单
            // 获取三个分类级别下拉选项
            let {categoryFirst, categorySecond, companyUuid} = data
            Promise.all([
              this.getItilCategory(companyUuid),      // 一级
              this.getSecondCategory(companyUuid, categoryFirst),     // 二级
              this.getThirdCategory(companyUuid, categoryFirst, categorySecond),     // 三级
              this.getAssignGroups(companyUuid)      // 获取受派组下拉选项
            ]).then((statusArr) => {
              // 获取详情，填充左侧表单
              this.$nextTick(() => {
                this.taskOrderForm = Object.assign({}, data)
              })
            }).catch((err) => {
              if (err === 0) this.$message.error('数据获取失败，请刷新重新！')
            })
          }
        })
      },
      // 初始化/刷新详情页
      initFreshDetail() {
        this.preGetSelectsList()      // 预先获取左侧详情表单中下拉框选项数据
        this.getAssociationList()     // 获取右侧关联关系列表
        this.getWorkDetailInfo()      // 获取工作详细信息
      },
      /**
       * '工作详细信息' 表格初始化
       */
      // 行内操作 - 查看
      setRowActionsDef() {
        let vm = this;
        return [{
          name: '查看',
          icon: 'eye',
          click(row) {
            vm.workInfoDetailData = row
            vm.workInfoDetailDialog = true
          }
        }]
      },
      // 表头查询
      setSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询内容',
          searchProps: ['logTypeStr', 'logDetail', 'createTime', 'createUserName']
        }
      },
      // 获取右侧工作详细信息列表
      getWorkDetailInfo() {
        $axios.get(`/itilIncidentCenter/serachItilLog/${this.taskOrderUuid}`).then(({data}) => {
          if (data instanceof Array) {
            this.workDetailInfo = data
          }
        })
      },
      /**
       *  右侧 tab '关联关系' table 操作
       */
      // 表头操作
      setAssoActionDef() {
        let vm = this
        return {
          width: 12,
          actions: [{
            name: '创建关联关系',
            icon: 'plus',
            click() {
              vm.createAssoDialog = true
            }
          }, {
            name: '取消关联关系',
            icon: 'batch-del',
            click() {
              vm.batchCancelAssociation()
            }
          }]
        }
      },
      // 行内操作
      setAssoRowActionsDef() {
        let vm = this;
        return [{
          name: '取消关联',
          icon: 'bind-remove',
          click(row) {
            vm.cancelAssociation([row.relationOrderUuid])
          }
        }]
      },
      // 表头查询
      setAssoSearchDef() {
        return {
          width: 8,
          offset: 4,
          placeholder: '请输入查询内容',
          searchProps: ['serialCode', 'orderTypeStr', 'briefDesc', 'statusName']
        }
      },
      // 获取关联工单
      getAssociationList() {
        $axios.get(`/ItilCommonWorkflow/getRelationOrderlist/${this.taskOrderUuid}`).then(({data}) => {
          if (data && data instanceof Object) {
            for (let key in data) {
              if (!(data[key] instanceof Array)) {
                data[key] = []
              }
            }
            let {changeOrderList, changeTaskList, incidentOrderList, problemOrderList} = data
            changeOrderList = changeOrderList.map(item => Object.assign({}, item, {
              status: item.changeStatus,
              statusName: item.changeStatusName,
              orderTypeStr: '变更'
            }))
            changeTaskList = changeTaskList.map(item => Object.assign({}, item, {
              status: item.status,
              statusName: item.statusName,
              orderTypeStr: '任务'
            }))
            incidentOrderList = incidentOrderList.map(item => Object.assign({}, item, {
              status: item.incidentStatus,
              statusName: item.incidentStatusName,
              orderTypeStr: '事件'
            }))
            problemOrderList = problemOrderList.map(item => Object.assign({}, item, {
              status: item.problemStatus,
              statusName: item.problemStatusName,
              orderTypeStr: '问题'
            }))
            this.associationList = [...changeOrderList, ...changeTaskList, ...incidentOrderList, ...problemOrderList]
          }
        })
      },
      // 获取关联关系多选数组
      getAssoMultiSelection(val) {
        this.assoCiationMultiSele = val;
      },
      // 批量取消关联关系
      batchCancelAssociation() {
        let uuids = this.assoCiationMultiSele.map((item, index) => {
          return item.relationOrderUuid
        })
        this.cancelAssociation(uuids)
      },
      // 取消关联
      cancelAssociation(uuids) {
        if (uuids instanceof Array && uuids.length > 0) {
          $axios.post('ItilCommonWorkflow/cancelRelationOrder', uuids).then(({data}) => {
            if (data.state === true) {
              this.$message({
                type: 'success',
                message: '关联已取消！'
              })
              this.initFreshDetail()
            } else {
              this.$message({
                type: 'error',
                message: '取消关联失败，请重试！'
              })
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请至少选择一项关联工单！'
          })
        }
      },
      // 关闭'创建关联关系'弹框
      closeCreateAsso() {
        this.initFreshDetail()
        this.createAssoDialog = false
      },
      JumpToAssoOrder(row) {
        let orderTypePath = ''
        switch (row.orderTypeStr) {
          case '变更': orderTypePath = 'modifyDetail'; break;
          case '事件': orderTypePath = 'eventDetail'; break;
          case '任务': orderTypePath = 'taskOrderDetail'; break;
          case '问题': orderTypePath = 'problemDetail'; break;
        }
        window.open(`${location.protocol}//${location.host}/#/ProcessCenter/${orderTypePath}/${row.uuid}`);
      },
      /**
       * 附件信息列表表格初始化
       */
      // 附件信息文件上传成功回调
      uploadSuccess(res) {
        this.fileList.push(res)
      },
      // 移除上传对列
      uploadRemove(file, fileList) {
        this.fileList.forEach((itemFile, indexFile) => {
          if (itemFile.attachuuid === file.response.attachuuid) {
            this.fileList.splice(indexFile, 1)
          }
        })
        this.deleteFile([file.response.attachuuid])
      },
      // 删除附件接口
      deleteFile(deleteUuid) {
        $axios.post(`/ItilCommonWorkflow/itilOrderFileDelete/`, deleteUuid).then(({data}) => {
          if (data.state === true) {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败，请重试！'
            })
          }
        })
      },
      // 附件信息文件上传失败回调
      uploadError() {},
      // 添加工作信息
      addWorkInfo() {
        if (this.workInfoForm.content || this.fileList.length > 0) {
          let uuid = this.fileList.map((item) => {
            return item.attachuuid
          })
          let param = {
            logDetail: this.workInfoForm.content,
            relationOrderUuid: this.taskOrderUuid,
            orderType: 2,
            attachments: uuid.join(',')
          }
          $axios.post(`/ItilCommonWorkflow/saveOrderLog`, param).then(({data}) => {
            if (data.state === true) {
              this.$message({
                type: 'success',
                message: '添加成功！'
              })
              this.fileList = []  // 添加工作信息的uuid参数
              this.fileListUpload = []  // 上传显示列表绑定的List
              this.workInfoForm.content = ''
              this.addWorkinfoFlag = false
              this.getWorkDetailInfo()
            } else {
              this.$message({
                type: 'error',
                message: '添加失败！'
              })
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请填写"工作信息"内容或上传"附件信息"！'
          })
          return false
        }
      },
      /**
       * 变更任务单底部功能按钮方法
       */
      // 保存
      saveTaskOrder() {
        this.$delete(this.taskOrderFormRules, 'taskResult')
        this.$refs.taskOrderForm.validate((valid) => {
          if (valid) {
            let saveData = intersectObj({
              uuid: '',
              title: '',
              detailDesc: '',
              categoryFirst: '',
              categorySecond: '',
              categoryThird: '',
              taskSource: '',
              criticality: '',
              criticalityDesc: '',
              assignGroup: '',
              assignUser: '',
              closeCode: '',
              taskResult: '',
              cancelReason: ''
            }, this.taskOrderForm)      // 取交集
            $axios.post('/itilChangeOrder/updateChangeTask', saveData).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: '保存成功！'
                })
                this.initFreshDetail()
              } else {
                this.$message({
                  type: 'error',
                  message: data.errormsg
                })
              }
            })
          } else {
            this.$message({
              type: 'warning',
              message: '请完善必要信息！'
            })
            return false
          }
        })
      },
      // 指派
      assignTaskOrder() {
        this.assignTaskOrderDialog = true
      },
      // 关闭 '指派'弹框
      closeAssignDialog() {
        this.initFreshDetail()
        this.assignTaskOrderDialog = false
      },
      // 接单
      receiveTaskOrder() {
        $axios.get(`/itilChangeOrder/changeTaskTaking/${this.taskOrderUuid}`).then(({data}) => {
          if (data.state === true) {
            this.initFreshDetail()
            this.$message({
              type: 'success',
              message: '接单成功！'
            })
          } else {
            this.$message({
              type: 'error',
              message: '接单失败，请重试！'
            })
          }
        })
      },
      // 完成
      finishTaskOrder() {
        // this.finishTaskOrderDialog = true
        this.$set(this.taskOrderFormRules, 'taskResult', [{required: true, message: '不能为空', trigger: 'blur'}])
        this.$refs.taskOrderForm.validate((valid) => {
          if (valid) {
            $axios.post('/itilChangeOrder/changeTaskComplete', {
              taskUuid: this.taskOrderUuid,
              taskResult: this.taskOrderForm.taskResult
            }).then(({data}) => {
              if (data.state === true) {
                this.initFreshDetail()
                this.$message({
                  type: 'success',
                  message: '该任务单已完成！'
                })
              } else {
                this.$message({
                  type: 'success',
                  message: '操作失败，请重试！'
                })
              }
            })
          } else {
            if (!this.taskOrderForm.taskResult) {
              this.$message({
                type: 'warning',
                message: '请填写"执行结果描述"内容！'
              })
            }
            return false
          }
        })
      },
      // 关闭 '完成'弹框
      closeFinishTaskOrder() {
        this.initFreshDetail()
        this.finishTaskOrderDialog = false
      },
      // 关单-获取'关闭代码'下拉选项
      closeTaskOrder() {
        $axios.get('/itilChangeOrder/getChangeTaskSelectData').then(({data}) => {
          if (data && data.hasOwnProperty('taskCloseCodeMap')) {
            this.taskOrderSelect = data.taskCloseCodeMap
            this.closeTaskOrderDialog = true
          }
        })
      },
      // 保存 '关单'操作
      saveCloseTaskOrder() {
        let closeCode = this.$refs['closeTaskOrderForm'].closeform.closeCode
        $axios.get(`/itilChangeOrder/changeTaskClose/${this.taskOrderUuid}/${closeCode}`).then(({data}) => {
          if (data.state === true) {
            this.initFreshDetail()
            this.closeTaskOrderDialog = false
            this.$message({
              type: 'success',
              message: '变更任务单已关闭！'
            })
          } else {
            this.$message({
              type: 'error',
              message: '关闭失败，请重试！'
            })
          }
        })
      },
      // 关闭 '关单'弹框
      cancelCloseTaskOrder() {
        this.closeTaskOrderDialog = false
      },
      // 取消
      cancelTaskOrder() {
        this.cancelTaskOrderDialog = true
      },
      // 保存 '取消'操作
      saveCancelTaskOrder() {
        let cancelReason = this.$refs['cancelTaskOrderForm'].cancelForm.cancel
        this.$refs['cancelTaskOrderForm'].$refs['cancelForm'].validate((valid) => {
          if (valid) {
            $axios.post('/itilChangeOrder/changeTaskCancel', {
              taskUuid: this.taskOrderUuid,
              cancelReason: cancelReason
            }).then(({data}) => {
              if (data.state === true) {
                this.initFreshDetail()
                this.cancelTaskOrderDialog = false
                this.$message({
                  type: 'success',
                  message: '取消成功！'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: '取消失败，请重试！'
                })
              }
            })
          } else {
            this.$message({
              type: 'warning',
              message: '请填写"取消原因"内容！'
            })
            return false
          }
        })
      },
      // 关闭 '取消'弹框
      cancelTaskOrderCancel() {
        this.cancelTaskOrderDialog = false
      }
    },
    created() {
      this.initFreshDetail()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #taskOrderDetail
    padding 10px
    padding-top 20px
    .addWorkInfo
      margin-top 20px
      .title
        font-size 14px
        font-weight bold
        margin-bottom 10px
    .footerBar
      text-align center
      margin-top 5px
      margin-bottom 0
    .s-button
      margin-right 20px
    #taskOrderForm
      .assignUser .s-tooltip, .s-select
        width 100% !important
    #workDetailInfo
      .s-table-header, .s-table-body
        width 100% !important
    .clickLink
      cursor pointer
      text-decoration underline
    #systemDate
      .grid-content
        font-size 14px
        margin-bottom 10px
</style>
