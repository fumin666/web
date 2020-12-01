<template>
  <div class="processDetail processProblemDetail" style="display: flex">
    <div style="width: 175px; margin-right: 20px">
      <div class="process-detail-title">
        <span class="process-detail-text">问题管理</span>
      </div>
      <div class="leftMenu">
        <div class="title">-- 功能菜单 --</div>
        <s-button class="attention attention-empty" v-if="form.concernUuid" @click="attention">取消关注</s-button>
        <s-button class="attention" v-else @click="attention">关注</s-button>
        <s-button :disabled="setDisabled('指派给我')" icon="click" @click="showAssignToMeDialog">指派给我</s-button>
        <s-button :disabled="setDisabled('指派给他人')" icon="assist" @click="showAssignToOtherDialog">指派给他人</s-button>
        <s-button :disabled="setDisabled('回退')" icon="back-square" @click="showRemindDialog">
          回退
        </s-button>
        <s-button :disabled="setDisabled('取消')" icon="cancel" @click="showCancelDialog">取消</s-button>
        <s-button :disabled="setDisabled('恢复待决')" icon="retreat" v-if="form.problemStatus === 4"
                  @click="doRecover">恢复待决
        </s-button>
        <!--评审中  已指派  调查中  可以待决-->
        <s-button :disabled="setDisabled('待决')" icon="underway" v-else @click="showUndeterminedDialog">待决
        </s-button>
        <s-button icon="bangding" @click="createAssociationRelationship">创建关联关系</s-button>
        <s-button icon="manage-process" @click="openProblemFlowchart">流程图</s-button>
        <s-button icon="export" @click="showUploadDialog">附件上传</s-button>
        <s-button @click="searchKnowledge" icon="association">搜索知识库</s-button>
        <s-button @click="createKnowledge" icon="order-add">创建知识库</s-button>
      </div>
    </div>
    <div style="flex: 1;">
      <s-steps :current="currentStep" :active="currentStep" finish-status="success" step-width="calc(20% - 23px)"
               style="margin-left: 15px">
        <s-step title="标识与记录"></s-step>
        <s-step title="审查与分派"></s-step>
        <s-step title="调查与诊断"></s-step>
        <s-step title="解决与回顾"></s-step>
        <s-step title="已关闭"></s-step>
      </s-steps>
      <div style="margin-top: 20px">
        <s-scrollbar wrap-style="max-height: calc(100vh - 215px);">
          <s-row :gutter="20" style="margin: 0 0 0 0">
            <s-col span="10" id="problemDetailLeft" style="padding:0 9px 0 10px;border-right: 1px dashed rgba(0, 0, 0, 0.1);">
              <s-form :model="form" :rules="rules" ref="form" label-width="120px">
                <s-form-item label="问题编号" prop="serialCode">
                  <s-input v-model="form.serialCode" disabled></s-input>
                </s-form-item>
                <s-form-item label="简要描述" prop="briefDesc">
                  <s-input v-model="form.briefDesc" type="textarea" :autosize="{ minRows: 3}"></s-input>
                </s-form-item>
                <s-form-item label="详细描述" prop="detailDesc">
                  <s-input v-model="form.detailDesc" type="textarea" :autosize="{ minRows: 3}"></s-input>
                </s-form-item>
                <s-form-item label="分类一级" prop="categoryFirst">
                  <s-select v-model="form.categoryFirst" :anonLabel="form.categoryFirstName" style="width: 100%">
                    <s-option v-for="item in categoryFirst" :key="item.uuid" :value="item.uuid"
                              :label="item.categoryName"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="分类二级" prop="categorySecond">
                  <s-select v-model="form.categorySecond" :anonLabel="form.categorySecondName" style="width: 100%">
                    <s-option v-for="item in categorySecond" :key="item.uuid" :value="item.uuid"
                              :label="item.categoryName"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="分类三级" prop="categoryThird">
                  <s-select v-model="form.categoryThird" :anonLabel="form.categoryThirdName" clearable
                            style="width: 100%">
                    <s-option v-for="item in categoryThird" :key="item.uuid" :value="item.uuid"
                              :label="item.categoryName"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="问题来源" prop="problemSource">
                  <s-select v-model="form.problemSource" style="width: 100%">
                    <s-option v-for="(item, index) in config.problemSource" :key="index" :value="parseInt(item.value)"
                              :label="item.name"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="紧急性" prop="criticality">
                  <s-select v-model="form.criticality" style="width: 100%">
                    <s-option v-for="(item, index) in config.criticality" :key="index" :value="parseInt(item.value)"
                              :label="item.name"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="影响度" prop="effect">
                  <s-select v-model="form.effect" style="width: 100%">
                    <s-option v-for="(item, index) in config.effect" :key="index" :value="parseInt(item.value)"
                              :label="item.name"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="优先级" prop="priority">
                  <s-select v-model="form.priority" disabled style="width: 100%">
                    <s-option v-for="(item, index) in config.priority" :key="index" :value="parseInt(item.value)"
                              :label="item.name"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="问题经理组" prop="managerGroup">
                  <s-select v-model="form.managerGroup" :anonLabel="form.managerGroupName" style="width: 100%"
                            :disabled="setDisabled('问题经理')">
                    <s-option v-for="(item, index) in config.managerGroup" :key="index" :value="item.uuid"
                              :label="item.groupName"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="问题经理" prop="managerUser">
                  <NameCardHover :useruuid="form.managerUser">
                    <s-select v-model="form.managerUser"
                              :anonLabel="form.managerUserName"
                              style="width: 100%"
                              :disabled="setDisabled('问题经理')"
                              :placeholder="config.managerUser && config.managerUser.length > 0 ? '请选择': '请选择问题经理组'">
                      <s-option v-for="(item, index) in config.managerUser" :key="index" :value="item.uuid"
                                :label="item.userRealName"></s-option>
                    </s-select>
                  </NameCardHover>
                </s-form-item>
                <s-form-item label="问题专家组" prop="professerGroup">
                  <s-select v-model="form.professerGroup" :anonLabel="form.professerGroupName" style="width: 100%"
                            :disabled="setDisabled('问题专家')">
                    <s-option v-for="(item, index) in config.professerGroup" :key="index" :value="item.uuid"
                              :label="item.groupName"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="问题专家" prop="professerUser">
                  <NameCardHover :useruuid="form.professerUser">
                    <s-select v-model="form.professerUser"
                              :anonLabel="form.professerUserName"
                              style="width: 100%"
                              :disabled="setDisabled('问题专家')"
                              :placeholder="config.professerUser && config.professerUser.length > 0 ? '请选择': '请先选择问题专家组'">
                      <s-option v-for="(item, index) in config.professerUser" :key="index" :value="item.uuid"
                                :label="item.userRealName"></s-option>
                    </s-select>
                  </NameCardHover>
                </s-form-item>
                <s-form-item label="状态" prop="problemStatus">
                  <s-select v-model="form.problemStatus" disabled style="width: 100%">
                    <s-option v-for="(item, index) in config.problemStatus" :key="index" :value="parseInt(item.value)"
                              :label="item.name"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="临时解决方案" prop="temporarySolution">
                  <s-input v-model="form.temporarySolution" type="textarea" :autosize="{ minRows: 3}"></s-input>
                </s-form-item>
                <s-form-item label="根本原因描述" prop="problemReason">
                  <s-input v-model="form.problemReason" type="textarea" :autosize="{ minRows: 3}"></s-input>
                </s-form-item>
                <s-form-item label="关闭代码" prop="closeCode">
                  <s-select v-model="form.closeCode" style="width: 100%" placeholder="" disabled>
                    <s-option v-for="(item, index) in config.closeCode" :key="index" :value="parseInt(item.value)"
                              :label="item.name"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="待决原因" prop="pendingReason">
                  <s-select v-model="form.pendingReason" disabled style="width: 100%" placeholder="">
                    <s-option v-for="(item, index) in config.pendingReason" :key="index" :value="parseInt(item.value)"
                              :label="item.name"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="回退原因" prop="backReason">
                  <s-input v-model="form.backReason" type="textarea" :autosize="{ minRows: 3}" disabled></s-input>
                </s-form-item>
                <s-form-item label="取消原因" prop="cancelReason">
                  <s-input v-model="form.cancelReason" type="textarea" :autosize="{ minRows: 3}" disabled></s-input>
                </s-form-item>
              </s-form>
            </s-col>
            <s-col span="14" id="problemDetailRight">
              <s-tab v-model="activeTab">
                <s-tab-pane label="工作详细信息">
                  <s-button icon="plus" @click="addWorkInfoDialog" style="margin-bottom: 10px;">添加工作信息</s-button>
                  <s-table-page :data="problemDetails" >
                    <s-table-column prop="logTypeStr" label="类型" width="100px">
                    </s-table-column>
                    <s-table-column prop="logDetail" label="工作信息">
                    </s-table-column>
                    <s-table-column prop="accountName" label="文件" width="60px">
                      <template slot-scope="scope">
                        {{scope.row.attachmentList ? scope.row.attachmentList.length : 0}}
                      </template>
                    </s-table-column>
                    <s-table-column prop="createTime" label="提交日期" width="180px">
                    </s-table-column>
                    <s-table-column prop="createUserName" label="提交人名称" width="100px">
                    </s-table-column>
                    <s-table-column label="操作" width="65px">
                      <template slot-scope="scope">
                        <i class="iconfont icon-eye" @click="seeWorkDeatail(scope.row)"></i>
                      </template>
                    </s-table-column>
                  </s-table-page>
                </s-tab-pane>
                <s-tab-pane label="关联关系">
                  <s-table-page :data="connectList" >
                    <s-table-column
                      label="工单类型"
                      show-overflow-tooltip>
                      <template slot-scope="scope">{{scope.row.orderTypeStr}}</template>
                    </s-table-column>
                    <s-table-column
                      label="工单编号"
                      prop="serialCode">
                      <!--getLink-->
                      <template slot-scope="scope">
                        <a :href="getLink(scope.row.orderType, scope.row.uuid)" target="_blank">
                          {{scope.row.serialCode}}
                        </a>
                      </template>
                    </s-table-column>
                    <s-table-column
                      label="简要描述"
                      prop="briefDesc">
                    </s-table-column>
                    <s-table-column
                      label="状态"
                      prop="status">
                      <template slot-scope="scope">{{getState(scope.row.orderType, scope.row.status)}}</template>
                    </s-table-column>
                    <s-table-column
                      label="操作"
                      prop="propName">
                      <template slot-scope="scope">
                        <i class="iconfont icon-bind-remove" title="取消关联"
                           @click="disconnect(scope.row, false)"></i>
                      </template>
                    </s-table-column>
                  </s-table-page>
                </s-tab-pane>
                <s-tab-pane label="日期/系统">
                  <div id="systemDate">
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">提交人：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ form.createUserName }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">提交时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ form.createTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">目标完成时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ form.expectTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">接单时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ form.acceptTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">分派时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ form.assignTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">待决时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ form.waitTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">待决恢复时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ form.recoverTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">完成时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ form.finishTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">关闭时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ form.closeTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">取消时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ form.cancelTime }} </s-col>
                    </s-row>
                  </div>
                </s-tab-pane>
              </s-tab>
            </s-col>
          </s-row>
        </s-scrollbar>
      </div>
      <s-row style="text-align: center; margin-top: 5px; margin-bottom: 0; margin-left: -195px">
        <s-button :disabled="setDisabled('保存')" @click="updateItilProblemOrder">保存</s-button>
        <s-button :disabled="setDisabled('接单')" @click="takeItilProblemOrder">接单</s-button>
        <s-button :disabled="setDisabled('完成')" @click="finishItilProblemOrder">完成</s-button>
        <!--已完成下 才可以关闭-->
        <s-button :disabled="setDisabled('关单')" @click="closeItilProblemOrder">关单</s-button>
      </s-row>
    </div>
    <detail-upload-dialog v-if="uploadDialogFlag" @submit="getProblemDetails" :uuid="uuid"
                          v-model="uploadDialogFlag"></detail-upload-dialog>
    <AssignToMeDialog v-if="AssignToMeDialog" @submit="updateDataWithNoTrigger" :uuid="uuid" :ouTconfig="config"
                      v-model="AssignToMeDialog"></AssignToMeDialog>
    <AssignToOtherDialog v-if="AssignToOtherDialog" @submit="updateDataWithNoTrigger" :uuid="uuid"
                         :companyUuid="form.companyUuid"
                         v-model="AssignToOtherDialog"></AssignToOtherDialog>
    <CancelDialog v-if="CancelDialog" @submit="updateData" :uuid="uuid" v-model="CancelDialog"></CancelDialog>
    <RemindDialog v-if="RemindDialog" @submit="updateData" :status="status" :uuid="uuid"
                  v-model="RemindDialog"></RemindDialog>
    <UndeterminedDialog v-if="UndeterminedDialog" @submit="updateData" :uuid="uuid" :config="config"
                        v-model="UndeterminedDialog"></UndeterminedDialog>
    <CloseDialog v-if="CloseDialog" @submit="updateData" :config="config" :uuid="uuid"
                 v-model="CloseDialog"></CloseDialog>
    <FinishDialog v-if="FinishDialog" @submit="updateData" v-model="FinishDialog" :uuid="uuid"
                  :problemReason="form.problemReason"></FinishDialog>
    <s-dialog
      v-model="createAssociationRelationshipDialog"
      v-if="createAssociationRelationshipDialog"
      title="创建关联关系"
      width="1000px">
      <s-scrollbar wrap-style="height: 500px;">
        <create-association-relationship @afterChange="getConnectList" :uuid="uuid"></create-association-relationship>
      </s-scrollbar>
    </s-dialog>

    <!-- 工作详细信息的查看 -->
    <s-dialog
      title="查看"
      v-if="workInfoDialog"
      width="700px"
      v-model="workInfoDialog">
      <work-info-detail :detailData="currentDetailData" ref="workInfoDialogForm"></work-info-detail>
      <template slot="footer" class="dialog-footer">
        <s-button @click="workInfoDialog = false">确定</s-button>
      </template>
    </s-dialog>

    <s-dialog
      title="添加工作信息" top="10%" width="600px"
      v-if="addWorkinfoFlag"
      v-model="addWorkinfoFlag">
      <s-form :model="workInfoForm" :rules="workInfoFormRules" ref="workInfoForm" label-width="120px">
        <s-form-item label="工作信息" prop="content">
          <s-input type="textarea" :autosize="{ minRows: 3}" v-model="workInfoForm.content"></s-input>
        </s-form-item>
        <s-form-item label="附件信息">
          <s-upload class="upload"
                    ref="uploadField"
                    :action="workInfoUrl"
                    multiple
                    :before-upload="beforeUpload"
                    :on-success="uploadSuccess"
                    :on-remove="handleRemove"
                    :on-error="uploadError"
                    :with-credentials="true">
            <s-button slot="trigger" icon="export">上传</s-button>
          </s-upload>
        </s-form-item>
      </s-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addWorkInfo">添加</s-button>
      </template>
    </s-dialog>
    <!--创建知识库弹框-->
    <s-dialog
      v-model="knowDialog"
      v-if="knowDialog"
      width="700px"
      class="createKnow"
      title="创建知识库">
      <create-know ref="knowForm"></create-know>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveKnow">保存</s-button>
        <s-button type="cancel" @click="knowDialog = false">关闭</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
  // import DateRange from '@/components/tableCom/src/DateRange';

  import $axios from 'sunflower-ajax';
  import detailMixin from './ProblemDetailMixin';
  import createAssociationRelationship from '../Process_Components/CreateAssociationRelationship'
  import workInfoDetail from '../Process_Components/WorkInfoDetail.vue';
  import createKnow from '@/home/ProcessCenter/ProcessCreatOrder/KnowDialog';
  import {NameCardHover} from '@/components/nameCard/NameCard';

  import {pick} from 'lodash'
  import {Validaters} from 'sunflower-common-utils'

  export default {
    mixins: [detailMixin],
    data() {
      return {
        addWorkinfoFlag: false,
        inited: false,
        uuid: '',
        status: '',
        currentStep: 0,
        activeTab: 0,
        config: {},
        form: {},
        rules: {
          briefDesc: [
            {required: true, message: '不能为空', trigger: 'blur'},
            Validaters.Max(100)
          ],
          detailDesc: [
            Validaters.Max(300)
          ],
          categoryFirst: [{required: true, message: '不能为空', trigger: 'blur'}],
          categorySecond: [{required: true, message: '不能为空', trigger: 'blur'}],
          problemSource: [{required: true, message: '不能为空', type: 'number', trigger: 'blur'}],
          criticality: [{required: true, message: '不能为空', type: 'number', trigger: 'blur'}],
          effect: [{required: true, message: '不能为空', type: 'number', trigger: 'blur'}],
          priority: [{required: true, message: '不能为空', type: 'number', trigger: 'blur'}]
        },
        defaultRules: {
          briefDesc: [
            {required: true, message: '不能为空', trigger: 'blur'},
            Validaters.Max(100)
          ],
          detailDesc: [
            Validaters.Max(300)
          ],
          temporarySolution: [
            Validaters.Max(300)
          ],
          categoryFirst: [{required: true, message: '不能为空', trigger: 'blur'}],
          categorySecond: [{required: true, message: '不能为空', trigger: 'blur'}],
          problemSource: [{required: true, message: '不能为空', type: 'number', trigger: 'blur'}],
          criticality: [{required: true, message: '不能为空', type: 'number', trigger: 'blur'}],
          effect: [{required: true, message: '不能为空', type: 'number', trigger: 'blur'}],
          priority: [{required: true, message: '不能为空', type: 'number', trigger: 'blur'}]
        },
        // 下拉
        categoryFirst: [],
        categorySecond: [],
        categoryThird: [],
        // ------
        DateSystemForm: {},
        problemDetails: [],
        // 关联关系
        connectList: [],
        file1: '',
        createAssociationRelationshipDialog: false,
        auth: {
          isProblemManager: false,
          isProblemExpert: false,
          isProblemUser: false
        },
        // 工作信息详情
        workInfoForm: {
          content: ''
        },
        workInfoFormRules: {
          content: [
            Validaters.Max(500)
          ]
        },
        currentDetailData: {},
        // 附件
        fileList: [],
        workInfoDialog: false,
        knowDialog: false       // 创建知识库工单弹框
      }
    },
    watch: {
      'form.criticality': function (val) {
        $axios.get(`/ItilCommonWorkflow/getPriorityByCriticalityAndEffent/${this.form.criticality}/${this.form.effect}`).then(({data}) => {
          if (data) {
            this.form.priority = data
          }
        })
      },
      'form.effect': function (val) {
        $axios.get(`/ItilCommonWorkflow/getPriorityByCriticalityAndEffent/${this.form.criticality}/${this.form.effect}`).then(({data}) => {
          if (data) {
            this.form.priority = data
          }
        })
      },
      'form.categoryFirst': function (val) {
        if (!this.inited) {
          return
        }
        this.getCategory({companyUuid: this.form.companyUuid, categoryFirst: val}, 'categorySecond').then((data) => {
          this.categoryThird = []
          this.form.categorySecond = ''
          this.form.categoryThird = ''
        })
      },
      'form.categorySecond': function (val) {
        if (!this.inited) {
          return
        }
        this.getCategory({
          companyUuid: this.form.companyUuid,
          categoryFirst: this.form.categoryFirst,
          categorySecond: val
        }, 'categoryThird').then((data) => {
          this.form.categoryThird = ''
        })
      },
      'form.managerGroup': function (val) {
        if (!this.inited) {
          return
        }
        if (val) {
          this.getUserByGroup(val, 'managerUser').then((data) => {
            this.form.managerUser = ''
          })
        }
      },
      'form.professerGroup': function (val) {
        if (!this.inited) {
          return
        }
        if (val) {
          this.getUserByGroup(val, 'professerUser').then((data) => {
            this.form.professerUser = ''
          })
        }
      }
    },
    computed: {
      workInfoUrl() {
        return `${$axios.basePath()}/fileUpload/uploadItilattach`
      },
      type() {
        let path = this.$route.path;
        return path.slice(path.lastIndexOf('/') + 1);
      }
    },
    created() {
      /**
       * 在当前页监听window的storage事件，
       * 当前页新打开的"搜索知识库"tab中引用完知识单后，向localStorage临时写入QUOTE-FRESH字段，触发storage事件
       * 这里需要监听storage事件，刷新表单，回显"解决方案"
       */
      window.addEventListener('storage', (e) => {
        if (e.key === 'QUOTE-FRESH' && e.newValue) {
          this.itilChangeOrder();     // 获取详情数据
          window.localStorage.removeItem('QUOTE-FRESH');  // 清除localStorage数据
        }
      }, false);
      this.init()
    },
    methods: {
      addWorkInfoDialog() {
        this.addWorkinfoFlag = true
      },
      init () {
        this.uuid = this.$route.params.uuid
        // 详情
        this.getProblemDetails()
        $axios.post(`/itilProblemOrder/judgeUserAuthByOrder/${this.uuid}`).then(({data}) => {
          this.auth = data
        })
        $axios.get(`/itilProblemOrder/getItilProblemOrderDetail/${this.uuid}`).then(({data}) => {
          this.$set(this, 'form', data)
          this.status = this.form.problemStatus
          this.currentStep = this.form.stateCirculation - 1
          // 工单类型
          Promise.all([
            $axios.get(`/ItilCommonWorkflow/getOrderType`).then(({data}) => {
            }),
            // 基本数据
            $axios.get(`/itilProblemOrder/getProblemOrderBasicData`).then(({data}) => {
              this.config = data
              return Promise.all([
                // 问题经理组
                $axios.get(`/itilProblemOrder/getProblemManagerList/${this.form.companyUuid}`).then(({data}) => {
                  this.config.managerGroup = data
                  if (this.form.managerGroup) {
                    this.getUserByGroup(this.form.managerGroup, 'managerUser')
                  }
                }),
                // 问题专家组
                $axios.get(`/itilProblemOrder/getProblemProfesserList/${this.form.companyUuid}`).then(({data}) => {
                  this.config.professerGroup = data
                  if (this.form.professerGroup) {
                    this.getUserByGroup(this.form.professerGroup, 'professerUser')
                  }
                })]
              )
            }),
            // 三级下拉框
            this.getCategory({companyUuid: this.form.companyUuid}).then(() => {
              return this.getCategory({
                companyUuid: this.form.companyUuid,
                categoryFirst: this.form.categoryFirst
              }, 'categorySecond').then(() => {
                return this.getCategory({
                  companyUuid: this.form.companyUuid,
                  categoryFirst: this.form.categoryFirst,
                  categorySecond: this.form.categorySecond
                }, 'categoryThird')
              })
            }),
            this.getConnectList()
          ]).then(() => {
            this.inited = true
          })
        })
      },
      updateDataWithNoTrigger() {
        this.getAuth()
        // 防止触发watch
        this.inited = false
        this.getData().then(() => {
          this.inited = true
        })
        this.getProblemDetails()
        Promise.all([
          // 问题经理组
          $axios.get(`/itilProblemOrder/getProblemManagerList/${this.form.companyUuid}`).then(({data}) => {
            this.config.managerGroup = data
            if (this.form.managerGroup) {
              this.getUserByGroup(this.form.managerGroup, 'managerUser')
            }
          }),
          // 问题专家组
          $axios.get(`/itilProblemOrder/getProblemProfesserList/${this.form.companyUuid}`).then(({data}) => {
            this.config.professerGroup = data
            if (this.form.professerGroup) {
              this.getUserByGroup(this.form.professerGroup, 'professerUser')
            }
          })]
        ).then(() => {
          this.inited = true
        })
      },
      getAuth() {
        $axios.post(`/itilProblemOrder/judgeUserAuthByOrder/${this.uuid}`).then(({data}) => {
          this.auth = data
        })
      },
      updateData() {
        this.getAuth()
        this.getData()
        this.getProblemDetails()
      },
      setDisabled(operation) {
        let CA = this.CA
        let state = this.form.problemStatus
        // 状态['草稿', '评审中', '已指派', '调查中', '待决', '已完成', '已关闭', '已取消']
        // 1.isProblemManager 2.isProblemExpert 3.isProblemUser
        // 数字越小权限越大
        let canAssignToMe = this.auth.assignToMe
        let currentAuth = 4
        let authArr = []
        if (this.auth.isProblemUser) {
          currentAuth = 3
          authArr.push(3)
        }
        if (this.auth.isProblemExpert) {
          currentAuth = 2
          authArr.push(2)
        }
        if (this.auth.isProblemManager) {
          currentAuth = 1
          authArr.push(1)
        }
        let alive = false
        // 状态
        // 权限
        if (currentAuth === 1) {
          alive = true
        } else if (currentAuth === 2) {
          // 默认可用
          alive = true
        } else if (currentAuth === 3) {
          // 默认不可用
          alive = false
        } else {
          alive = false
        }
        // 关闭 取消后  无法操作
        if (state > 5) {
          alive = false
        } else if (state === 5 && currentAuth === 2) {
          // 问题专家 完成后没有权限
          alive = false
        } else if (state === 4 && operation !== '恢复待决') {
          // 待决状态下  只能进行 恢复操作
          alive = false
        } else {
          // 其他状态判断
          // 评审中、已指派、调查中，可以待决
          // 评审中，已指派，调查中三种状态下  可以进行取消操作
          // 已完成下 才可以关闭
          // 关闭 取消后  无法操作
          // 问题经理 接单后 评审中  无法再次接单
          // 问题专家 接单后是 调查中  无法再次接单
          // 只能在评审中和已完成状态下 才可以回退
          // 问题请求人在草稿状态下 有指派给他人的权限
          // 问题经理 只有在 草稿 评审中  才可以指派给我，指派给他人，修改中，也只有在评审中才可以修改问题经理组，问题经理，问题专家组，问题专家
          // 问题专家在 已指派 时可以指派给我，指派给他人， 此时可以修改问题专家组和问题专家
          // 问题专家在 调查中 时不能指派给我，只能指派给他人，此时可以修改问题专家组和问题专家
          // 已完成状态下，不能再修改 问题经理组，问题经理，问题专家组，问题专家，根本原因
          // 问题经理field： 问题经理在评审中才可以修改
          // 问题专家field： 问题经理在评审中 和 问题专家在已指派、调查中
          switch (operation) {
            case '问题经理':
              alive = currentAuth === 1 && [0, 1].indexOf(state) !== -1 || currentAuth === 3 && [0].indexOf(state) !== -1 || currentAuth === 2 && [0].indexOf(state) !== -1;
              break;
            case '问题专家':
              alive = currentAuth === 1 && [0, 1].indexOf(state) !== -1 || currentAuth === 2 && [2, 3].indexOf(state) !== -1;
              break;
            case '指派给我':
//              alive = currentAuth === 1 && [0, 1].indexOf(state) !== -1 || currentAuth === 2 && [2].indexOf(state) !== -1;
              alive = canAssignToMe;
              break;
            case '指派给他人':
              alive = currentAuth === 1 && [0, 1].indexOf(state) !== -1 || currentAuth === 2 && [0, 2, 3].indexOf(state) !== -1 || currentAuth === 3 && [0].indexOf(state) !== -1;
              break;
            case '回退':
              alive = alive && [1, 5].indexOf(state) !== -1;
              break;
            case '待决':
              alive = alive && [1, 2, 3].indexOf(state) !== -1;
              break;
            case '关单':
              alive = alive && currentAuth === 1 && [5].indexOf(state) !== -1;
              break;
            case '接单':
              alive = currentAuth === 1 && state < 1 || currentAuth === 2 && state < 3;
              break;
            case '完成':
//              alive = alive && state < 5;
              alive = alive && (CA(1, authArr) && state < 5 || CA(2, authArr) && state === 3); // 测试要求改成经理调查中才可以完成 #50741
              break;
            case '取消':
              alive = alive && [1, 2, 3].indexOf(state) !== -1;
              break;
          }
        }
        // 问题请求人，草稿，可以保存
        if (state === 0 && operation === '保存' && currentAuth === 3) {
          alive = true
        }
        return !alive
      },
      // 多重权限检测
      CA(current, list) {
        return list.includes(current)
      },
      getState(orderType, state) {
        let states = this.$store.state.processCenter.status
        if (orderType === 2) {
          return states[orderType] ? states[orderType][state - 1] : ''
        } else {
          return states[orderType] ? states[orderType][state] : ''
        }
      },
      getLink(orderType, uuid) {
        let url = ''
        switch (orderType) {
          case 0:
            url = '/#/ProcessCenter/eventDetail/' + uuid;
            break;
          case 1:
            url = '/#/ProcessCenter/problemDetail/' + uuid;
            break;
          case 2:
            url = '/#/ProcessCenter/modifyDetail/' + uuid;
            break;
          case 3:
            url = '/#/ProcessCenter/taskOrderDetail/' + uuid;
            break;
        }
        return url
      },
      getConnectList() {
        return $axios.get(`/ItilCommonWorkflow/getRelationOrderlist/${this.uuid}`).then(({data}) => {
          let {changeOrderList, changeTaskList, incidentOrderList, problemOrderList} = data
          incidentOrderList = (incidentOrderList || []).map(item => Object.assign({}, item, {
            orderType: 0,
            status: item.incidentStatus,
            orderTypeStr: '事件'
          }))
          problemOrderList = (problemOrderList || []).map(item => Object.assign({}, item, {
            orderType: 1,
            status: item.problemStatus,
            orderTypeStr: '问题'
          }))
          changeOrderList = (changeOrderList || []).map(item => Object.assign({}, item, {
            orderType: 2,
            status: item.changeStatus,
            orderTypeStr: '变更'
          }))
          changeTaskList = (changeTaskList || []).map(item => Object.assign({}, item, {
            orderType: 3,
            status: item.status,
            orderTypeStr: '任务'
          }))
          this.connectList = [...changeOrderList, ...changeTaskList, ...incidentOrderList, ...problemOrderList]
        })
      },
      getData() {
        return $axios.get(`/itilProblemOrder/getItilProblemOrderDetail/${this.uuid}`).then(({data}) => {
          this.$set(this, 'form', data)
          this.status = this.form.problemStatus
          this.currentStep = this.form.stateCirculation - 1
        })
      },
      // 根据支持组uuid查询用户列表/itilWorkflowConfig/getIamUserInfoListByGroupUuid/
      getUserByGroup(uuid, key) {
        let url = key === 'managerUser' ? '/itilProblemOrder/getProblemManagerByGroup/' : '/itilProblemOrder/getProblemProfesserByGroup/'
        return $axios.get(url + uuid).then(({data}) => {
          if (key) {
            this.$set(this.config, key, data)
          }
          return data
        })
      },
      // 三级下拉
      getCategory(obj, key) {
        let params = Object.assign({ownerType: 1}, obj)
        return $axios.post('/ItilCommonWorkflow/getItilCategorySelect', params).then(({data}) => {
          data = data.filter(item => item)
          this[key || 'categoryFirst'] = data
          return data
        })
      },
      createAssociationRelationship() {
        this.createAssociationRelationshipDialog = true
      },
      // 知识库搜索，知识引用
      searchKnowledge() {
        window.open(`#/ProcessCenter/searchKnowledge?orderUuid=${this.uuid}&orderType=1`);
        // this.$router.push({path: '/ProcessCenter/knowledgeLibrary', query: {orderUuid: this.uuid}});
      },
      // 创建知识库弹框
      createKnowledge() {
        this.knowDialog = true;
      },
      // 保存创建的知识库工单
      saveKnow() {
        this.$refs['knowForm'].$refs['knowledgeForm'].validate(valid => {
          if (!valid) return;
          let form = Object.assign({}, this.$refs['knowForm'].knowledgeForm)
          form.knowledgeType = Number(form.knowledgeType)
          $axios.post('/itilKnowledgeOrder/saveKnowledgeOrder', form).then((res) => {
            if (res.status === 200) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.knowDialog = false;
              // 刷新详情页
              this.getData();
              this.getProblemDetails();
            }
          })
        })
      },
      disconnect(val, disabled) {
        if (disabled) return
        let list = (val ? [val] : this.selectList).map(item => item.relationOrderUuid)
        if (list.length > 0) {
          this.$confirm(val ? '确定取消关联此工单' : '确定取消关联所选工单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.post('/ItilCommonWorkflow/cancelRelationOrder', list).then(({data}) => {
              if (data.state === true) {
                this.$message.success('取消关联成功')
                this.init()
              } else {
                this.$message.error('取消关联失败')
              }
            })
          }).catch(() => {});
        } else {
          this.$message.error('请选择要取消关联的工单')
        }
      },
      updateItilProblemOrder() {
        this.$refs.form.clearValidate()
        this.$set(this, 'rules', this.defaultRules)
        this.$nextTick(() => {
          this.$refs.form.validate(valid => {
            if (valid) {
              $axios.post('/itilProblemOrder/updateItilProblemOrder', pick(this.form, ['uuid', 'serialCode', 'briefDesc', 'detailDesc', 'categoryFirst', 'categorySecond', 'categoryThird', 'problemSource', 'criticality', 'effect', 'priority', 'managerGroup', 'managerUser', 'professerUser', 'professerGroup', 'problemStatus', 'temporarySolution', 'problemReason', 'closeCode', 'pendingReason', 'backReason', 'cancelReason'])).then(({data}) => {
                if (data.state === true) {
                  this.$message.success(data.errormsg)
                  this.getData()
                  this.getAuth()
                } else {
                  this.$message.error(data.errormsg)
                }
                this.getProblemDetails()
              })
            }
          })
        })
      },
      takeItilProblemOrder() {
        $axios.get(`/itilProblemOrder/takeItilProblemOrder/${this.uuid}`).then(({data}) => {
          if (data.state === true) {
            this.$message.success('接单成功')
            this.getProblemDetails()
            this.getData()
          } else {
            this.$message.error(data.data)
          }
        })
      },
      finishItilProblemOrder() {
        this.$refs.form.clearValidate()
        this.rules = {}
        this.$set(this.rules, 'problemReason', [{required: true, message: '不能为空', trigger: 'blur'}]);
        this.$set(this.rules, 'professerGroup', [{required: true, message: '不能为空', trigger: 'blur'}]);
        this.$set(this.rules, 'professerUser', [{required: true, message: '不能为空', trigger: 'blur'}]);
        this.$nextTick(() => {
          Promise.all([
            new Promise((resolve, reject) => {
              this.$refs.form.validateField('problemReason', msg => {
                msg ? resolve('根本原因描述信息') : resolve(true)
              });
            }),
            new Promise((resolve, reject) => {
              this.$refs.form.validateField('professerGroup', msg => {
                msg ? resolve('问题专家组') : resolve(true)
              });
            }),
            new Promise((resolve, reject) => {
              this.$refs.form.validateField('professerUser', msg => {
                msg ? resolve('问题专家') : resolve(true)
              });
            })
          ]).then(data => {
            if (data.reduce((total, current) => total === true && current === true)) {
              $axios.post('/itilProblemOrder/finishItilProblemOrder', {
                uuid: this.uuid,
                problemReason: this.form.problemReason,
                professerGroup: this.form.professerGroup,
                professerUser: this.form.professerUser
              }).then(({data}) => {
                if (data.state === true) {
                  this.$message.success(data.data)
                  this.getData()
                  this.getProblemDetails()
                  // 完成强制刷新
                  location.reload();
                } else {
                  this.$message.error(data.data)
                }
              })
            } else {
              this.$message({type: 'warning', message: `请填写${data.filter(item => item !== true).join(',')}!`});
            }
          })
        })
      },
      closeItilProblemOrder() {
        this.CloseDialog = true
      },
      getProblemDetails() {
        $axios.get(`/ItilCommonWorkflow/getOrderLogByOrderUuid/${this.uuid}`).then(({data}) => {
          this.problemDetails = data
        })
      },
      doRecover() {
        this.$confirm('确定要恢复问题状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.post(`/itilProblemOrder/recoveryItilProblemOrder/${this.uuid}`).then(({data}) => {
            if (data === true) {
              this.$message.success('恢复成功')
              this.getData()
              this.getProblemDetails()
            } else {
              this.$message.error('恢复失败')
            }
          })
        }).catch(() => {});
      },
      // 查看问题单流程图
      openProblemFlowchart() {
        this.$router.push(`/ProcessCenter/problemFlowchart/${this.form.serialCode}/${this.uuid}`)
      },
      // 添加工作信息
      addWorkInfo() {
          if (this.workInfoForm.content.length > 500) {
            this.$message('工作信息最大长度为500!')
            return
          }
          this.$confirm('确定添加?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$refs.workInfoForm.validate((valid) => {
              if (valid) {
                let uuid = (this.fileList || []).map((item) => {
                  return item.attachuuid
                })
                let param = {
                  logDetail: this.workInfoForm.content,
                  relationOrderUuid: this.uuid,
                  orderType: 1,
                  attachments: uuid.join(',')
                }
                this.fileList = []
                this.$refs.uploadField.clearFiles()
                this.workInfoForm.content = ''
                $axios.post(`/ItilCommonWorkflow/saveOrderLog`, param).then(({data}) => {
                  if (data.state === true) {
                    this.$message({
                      type: 'success',
                      message: '添加成功！'
                    })
                    this.addWorkinfoFlag = false
                    this.getProblemDetails()
                  } else {
                    this.$message({
                      type: 'error',
                      message: '添加失败！'
                    })
                  }
                })
              }
            })
          }).catch(() => {});
      },
      // 查看工作信息详情
      seeWorkDeatail(row) {
        this.currentDetailData = row
        this.workInfoDialog = true
      },
      beforeUpload(file) {
        if (file.size > 10 * 1024 * 1024) {
          this.$message({type: 'error', message: '单个文件大小不能超过10M!'});
          return false;
        }
      },
      uploadSuccess(data) {
        this.fileList.push(data)
        this.$message.success('上传成功')
      },
      uploadError() {
        this.$message.error('上传出错')
      },
      handleRemove(file) {
        this.delFile([file.attachuuid]).then(() => {
          this.fileList.forEach((item, index) => {
            if (item.attachuuid === file.attachuuid) {
              this.fileList.splice(index, 1)
            }
          })
        })
      },
      delFile(fileUuidList) {
        return $axios.post('/ItilCommonWorkflow/itilOrderFileDelete', fileUuidList).then(({data}) => {
          if (data.state === true) {
            return data
          }
        })
      }
    },
    components: {
      // DateRange,
      createAssociationRelationship,
      workInfoDetail,
      createKnow,
      NameCardHover
    }
  }
</script>

<style lang="stylus">
  .processEventDetail
    .leftMenu
      text-align left
      .s-button
        width: 100%
        margin-top 8px

  #problemDetailRight .s-tabs-border-card .s-tabs-content
    padding 5px 0 !important

  #systemDate
    .grid-content
      font-size 14px
      margin-bottom 10px
</style>
