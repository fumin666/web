<template>
  <div class="processDetail" style="display: flex;">
    <div style="width: 175px; margin-right: 20px">
      <div class="process-detail-title">
        <span class="process-detail-text">知识库</span>
      </div>
      <div class="leftMenu">
        <div class="title">-- 功能菜单 --</div>
        <s-button @click="attention" class="attention" v-if="orderForm.isConcern===0">关注</s-button>
        <s-button @click="cancelAttention" class="attention attention-empty" v-if="orderForm.isConcern===1">取消关注</s-button>
        <s-button @click="assignToMe" icon="click" :disabled="allDisabled && assignMeDisabled">指派给我</s-button>
        <s-button @click="assignToOthers" icon="assist" :disabled="allDisabled && assignOthersDisabled">指派给他人</s-button>
        <s-button @click="setVisibleLevel" icon="order" :disabled="allDisabled && visibleLevelDisabled">知识能见度</s-button>
        <s-button @click="updateNewVersion" icon="order" :disabled="allDisabled && newVersionDisabled">新版本</s-button>
        <s-button @click="createAssociation" icon="bangding">创建关联关系</s-button>
        <s-button @click="openModifyFlowchart" icon="manage-process">流程图</s-button>
        <s-button @click="showPrintDialog" icon="printer">打印</s-button>
        <s-button @click="showUploadDialog" icon="export">附件上传</s-button>
        <s-button @click="cancelHandle" icon="cancel" :disabled="allDisabled && cancelDisabled">取消</s-button>
      </div>
    </div>
    <div style="flex: 1;">
      <s-steps :current="currentStep" finish-status="success" step-width="calc(20% - 23px)" style="margin-left: 15px">
        <s-step title="草稿"></s-step>
        <s-step title="启动"></s-step>
        <s-step title="审批"></s-step>
        <s-step title="发布"></s-step>
        <s-step title="关闭"></s-step>
      </s-steps>
      <s-tab style="margin-top: 20px">
        <s-tab-pane label="内容">
          <s-form :model="orderForm" :rules="detailRules" label-position="top" class="detailTab">
            <s-form-item label="问题描述" prop="detailDesc">
              <s-input v-model="orderForm.detailDesc" type="textarea" :rows="10" :disabled="formDisabled && allDisabled"></s-input>
            </s-form-item>
            <s-form-item label="解决方案" prop="solutionContent" class="quillFormItem">
              <quill-editor v-model="orderForm.solutionContent"
                            ref="myQuillEditor"
                            :options="editorOption"
                            :disabled="formDisabled && allDisabled"
              >
              </quill-editor>
            </s-form-item>
          </s-form>
        </s-tab-pane>
        <s-tab-pane label="详情">
          <div style="margin-top: 20px">
            <s-scrollbar wrap-style="max-height: calc(100vh - 215px);">
              <s-row :gutter="20" style="margin: 0 0 0 0">
                <s-col span="10" class="formContainer">
                  <s-form :model="orderForm" :rules="orderRules" ref="orderForm" label-width="130px">
                    <s-form-item label="知识库文章编号" prop="serialCode">
                      <s-input v-model="orderForm.serialCode" disabled></s-input>
                    </s-form-item>
                    <s-form-item label="标题" prop="briefDesc">
                      <s-input v-model="orderForm.briefDesc" :disabled="formDisabled && allDisabled"></s-input>
                    </s-form-item>
                    <s-form-item label="知识库类别" prop="knowledgeType">
                      <s-select
                        v-model="orderForm.knowledgeType"
                        placeholder="请选择"
                        style="width: 300px"
                        :disabled="formDisabled && allDisabled">
                        <s-option
                          v-for="(item, index) in itilKnowledgeTypeSelect"
                          :label="item.name"
                          :value="item.value"
                          :key="item.value"></s-option>
                      </s-select>
                    </s-form-item>
                    <s-form-item label="知识分类一级" prop="categoryFirst">
                      <s-select v-model="orderForm.categoryFirst"
                                :anonLabel="orderForm.categoryFirstName"
                                :disabled="formDisabled && allDisabled"
                                style="width: 100%">
                        <s-option v-for="item in categoryFirstList" :label="item.categoryName" :value="item.uuid"
                                  :key="item.uuid"></s-option>
                      </s-select>
                    </s-form-item>
                    <s-form-item label="知识分类二级" prop="categorySecond">
                      <s-select v-model="orderForm.categorySecond"
                                :anonLabel="orderForm.categorySecondName"
                                :disabled="formDisabled && allDisabled"
                                style="width: 100%">
                        <s-option v-for="item in categorySecondList" :label="item.categoryName" :value="item.uuid"
                                  :key="item.uuid"></s-option>
                      </s-select>
                    </s-form-item>
                    <s-form-item label="知识分类三级" prop="categoryThird">
                      <s-select v-model="orderForm.categoryThird"
                                :anonLabel="orderForm.categoryThirdName"
                                :disabled="formDisabled && allDisabled"
                                clearable
                                style="width: 100%">
                        <s-option v-for="item in categoryThirdList" :label="item.categoryName" :value="item.uuid"
                                  :key="item.uuid"></s-option>
                      </s-select>
                    </s-form-item>
                    <s-form-item label="应用系统名称" prop="appSystemName">
                      <s-input v-model="orderForm.appSystemName" :disabled="formDisabled && allDisabled"></s-input>
                    </s-form-item>
                    <s-form-item label="关键字" prop="keyword">
                      <s-input v-model="orderForm.keyword" :disabled="formDisabled && allDisabled"></s-input>
                    </s-form-item>
                    <s-form-item label="知识库管理员组:" prop="adminGroup">
                      <s-select v-model="orderForm.adminGroup" @change="getAdminUser" :disabled="formDisabled && allDisabled" style="width: 300px">
                        <s-option v-for="item in adminGroupSelect" :label="item.groupName" :value="item.uuid"  :key="item.uuid"></s-option>
                      </s-select>
                    </s-form-item>
                    <s-form-item label="知识库管理员" prop="adminUser">
                      <NameCardHover :useruuid="orderForm.adminUser" :placement="'right'">
                        <s-select v-model="orderForm.adminUser" :disabled="formDisabled && allDisabled" style="width: 300px">
                          <s-option v-for="item in adminUserSelect" :label="item.userRealName" :value="item.uuid"  :key="item.uuid"></s-option>
                        </s-select>
                      </NameCardHover>
                    </s-form-item>
                    <s-form-item label="知识所属组:" prop="knowledgeGroup">
                      <s-select v-model="orderForm.knowledgeGroup" @change="getKnowledgeUser" :disabled="formDisabled && allDisabled" clearable style="width: 300px">
                        <s-option v-for="item in knowledgeGroupSelect" :label="item.groupName" :value="item.uuid"  :key="item.uuid"></s-option>
                      </s-select>
                    </s-form-item>
                    <s-form-item label="知识拥有者" prop="knowledgeUser">
                      <NameCardHover :useruuid="orderForm.knowledgeUser" :placement="'right'">
                        <s-select v-model="orderForm.knowledgeUser" :disabled="formDisabled && allDisabled" clearable style="width: 300px">
                          <s-option v-for="item in knowledgeUserSelect" :label="item.userRealName" :value="item.uuid"  :key="item.uuid"></s-option>
                        </s-select>
                      </NameCardHover>
                    </s-form-item>
                    <s-form-item label="IT内部运维使用" prop="isItOperation">
                      <s-switch v-model="orderForm.isItOperation" :active-value="1" :inactive-value="0" :disabled="formDisabled && allDisabled"></s-switch>
                    </s-form-item>
                    <s-form-item label="版本号" prop="knowledgeVersion">
                      <s-input v-model="orderForm.knowledgeVersion" style="width: 300px" disabled></s-input>
                    </s-form-item>
                    <s-form-item label="引用次数" prop="citeTimes">
                      <s-input v-model="orderForm.citeTimes" style="width: 300px" disabled></s-input>
                    </s-form-item>
                    <s-form-item label="状态" prop="knowledgeStatus">
                      <s-select v-model="orderForm.knowledgeStatus" style="width: 100%" disabled>
                        <s-option :label="orderForm.knowledgeStatusName" :value="orderForm.knowledgeStatus"
                                  :key="orderForm.knowledgeStatus"></s-option>
                      </s-select>
                    </s-form-item>
                  </s-form>
                </s-col>
                <s-col span="14" id="modifyDetailRight" class="detailBox">
                  <s-tab v-model="activeTab" @tab-click="handleClick">
                    <s-tab-pane name="0" label="工作详细信息">
                      <s-button icon="plus" @click="addWorkInfoDialog" style="margin-bottom: 10px;">添加工作信息</s-button>
                      <s-table-page :data="workInfoData" >
                        <s-table-column prop="logTypeStr" label="类型" show-overflow-tooltip>
                        </s-table-column>
                        <s-table-column prop="logDetail" label="工作信息" show-overflow-tooltip>
                        </s-table-column>
                        <s-table-column label="文件" show-overflow-tooltip width="60px">
                          <template slot-scope="scope">
                            <span v-text="(scope.row.attachmentList||[]).length"></span>
                          </template>
                        </s-table-column>
                        <s-table-column prop="createTime" label="提交日期" show-overflow-tooltip>
                        </s-table-column>
                        <s-table-column prop="createUserName" label="提交人名称"  width="100px" show-overflow-tooltip>
                        </s-table-column>
                        <s-table-column label="操作" width="65px">
                          <template slot-scope="scope">
                            <i class="iconfont icon-eye" title="查看" @click="checkWorkDeatail(scope.$index, scope.row)"></i>
                          </template>
                        </s-table-column>
                      </s-table-page>
                    </s-tab-pane>
                    <s-tab-pane name="1" label="关联关系">
                      <s-table-page
                        :data="associationData"
                        :header-search="{show: false}"
                        :hasActionCol=false>
                        <s-table-column
                          label="工单类型"
                          show-overflow-tooltip>
                          <template slot-scope="scope">{{scope.row.orderTypeStr}}</template>
                        </s-table-column>
                        <s-table-column label="工单编号" show-overflow-tooltip>
                          <template slot-scope="scope">
                            <a @click="gotoEvent(scope.row.orderTypeStr, scope.row.uuid)" class="clickLink">{{scope.row.serialCode}}</a>
                          </template>
                        </s-table-column>
                        <s-table-column
                          label="简要描述"
                          prop="briefDesc">
                        </s-table-column>
                        <s-table-column
                          label="状态">
                          <template slot-scope="scope">{{(scope.row.statusName)}}</template>
                        </s-table-column>
                        <s-table-column
                          label="操作">
                          <template slot-scope="scope">
                            <i class="iconfont icon-bind-remove" title="取消关联" @click="cancelEvent(scope.row)"></i>
                          </template>
                        </s-table-column>
                      </s-table-page>
                    </s-tab-pane>
                    <s-tab-pane name="2" label="日期/系统">
                      <div id="systemDate">
                        <s-row>
                          <s-col :span="5" class="grid-content bg-purple">提交人姓名：</s-col>
                          <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.createUserName }} </s-col>
                        </s-row>
                        <s-row>
                          <s-col :span="5" class="grid-content bg-purple">提交时间：</s-col>
                          <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.createTime }} </s-col>
                        </s-row>
                        <s-row>
                          <s-col :span="5" class="grid-content bg-purple">草稿保存时间：</s-col>
                          <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.draftSaveTime }} </s-col>
                        </s-row>
                        <s-row>
                          <s-col :span="5" class="grid-content bg-purple">启动时间：</s-col>
                          <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.startupTime }} </s-col>
                        </s-row>
                        <s-row>
                          <s-col :span="5" class="grid-content bg-purple">发布审批开始时间：</s-col>
                          <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.publishApproveStartTime }} </s-col>
                        </s-row>
                        <s-row>
                          <s-col :span="5" class="grid-content bg-purple">发布审批结束时间：</s-col>
                          <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.publishApproveEndTime }} </s-col>
                        </s-row>
                        <s-row>
                          <s-col :span="5" class="grid-content bg-purple">已发布时间：</s-col>
                          <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.publishTime }} </s-col>
                        </s-row>
                        <s-row>
                          <s-col :span="5" class="grid-content bg-purple">注销审批开始时间：</s-col>
                          <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.destroyApproveStartTime }} </s-col>
                        </s-row>
                        <s-row>
                          <s-col :span="5" class="grid-content bg-purple">注销审批结束时间：</s-col>
                          <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.destroyApproveEndTime }} </s-col>
                        </s-row>
                        <s-row>
                          <s-col :span="5" class="grid-content bg-purple">已拒绝时间：</s-col>
                          <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.refuseTime }} </s-col>
                        </s-row>
                        <s-row>
                          <s-col :span="5" class="grid-content bg-purple">已取消时间：</s-col>
                          <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.cancelTime }} </s-col>
                        </s-row>
                        <s-row>
                          <s-col :span="5" class="grid-content bg-purple">已废弃时间：</s-col>
                          <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.destroyTime }} </s-col>
                        </s-row>
                      </div>
                    </s-tab-pane>
                    <s-tab-pane name="3" label="版本记录">
                      <version-records
                        v-if="activeTab==='3'"
                        :isFreshTable="freshTable"
                        @viewRecords="viewRecords"></version-records>
                    </s-tab-pane>
                    <s-tab-pane name="4" label="反馈评分">
                      <feedback-score
                        v-if="activeTab==='4'"
                        :isFreshTable="freshTable"></feedback-score>
                    </s-tab-pane>
                  </s-tab>
                </s-col>
              </s-row>
            </s-scrollbar>
          </div>
        </s-tab-pane>
      </s-tab>
      <s-row style="text-align: center; margin-top: 5px; margin-bottom: 0; margin-left: -195px">
        <s-button @click="saveOrder" :disabled="allDisabled && saveDisabled">保存</s-button>
        <s-button @click="nextStep" :disabled="allDisabled && nextDisabled">下一阶段</s-button>
      </s-row>
    </div>

    <detail-upload-dialog v-if="uploadDialogFlag" v-model="uploadDialogFlag" @getWorkInfo="serachItilLog">
    </detail-upload-dialog>

    <!--创建关联关系-->
    <s-dialog
      title="创建关联关系"
      width="900px"
      ref="createAssoDialog"
      v-if="createAssoDialog"
      v-model="createAssoDialog"
      :before-close="closeAssoDialog">
      <s-scrollbar wrap-style="max-height: 600px;">
        <create-asso :uuid="orderUuid" @closeAsso="closeAssoDialog"></create-asso>
      </s-scrollbar>
    </s-dialog>

    <!--变更详情打印预览-->
    <s-dialog
      title="知识库打印预览" top="10%" width="600px"
      id="printTaskDetailDialog"
      ref="printTaskDetailDialog"
      v-if="printTaskDetailDialog"
      v-model="printTaskDetailDialog">
      <s-scrollbar wrap-style="max-height: 450px;">
        <print-modify-task ref="preLookPrintTask" :uuid="orderUuid"></print-modify-task>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="printModifyDetail">打印</s-button>
      </template>
    </s-dialog>

    <!--打印-->
    <div style="position: absolute; top: -9999px;">
      <print-modify-task ref="storePrintModifyData" :uuid="orderUuid"></print-modify-task>
      <iframe frameborder="0" scrolling="no" ref="printTaskIframe" id="printTaskIframe"></iframe>
    </div>

    <!--取消-->
    <s-dialog
      v-if="cancelDialog"
      v-model="cancelDialog"
      title="取消">
      <cancel ref="cancel"></cancel>
      <template slot="footer" class="dialog-footer">
        <s-button @click="cancelOk">确定</s-button>
        <s-button type="cancel" @click="closeCancel">取消</s-button>
      </template>
    </s-dialog>

    <!--指派给我-->
    <s-dialog
      title="指派给我"
      ref="assignToMeDialog"
      v-if="assignToMeDialog"
      v-model="assignToMeDialog">
      <assign-to-me
        :orderUuid="orderUuid"
        @closeAssignToMe="closeAssignToMe"></assign-to-me>
    </s-dialog>

    <!--指派给他人-->
    <s-dialog
      title="指派给他人"
      ref="assignToOthersDialog"
      v-if="assignToOthersDialog"
      v-model="assignToOthersDialog">
      <assign-to-others
        :orderUuid="orderUuid"
        :companyUuid="orderForm.companyUuid"
        @closeAssignToOthers="closeAssignToOthers"></assign-to-others>
    </s-dialog>

    <!--知识能见度-->
    <s-dialog
      v-if="visibleLevelDialog"
      v-model="visibleLevelDialog"
      title="知识库能见度设置">
      <visible-level ref="visiblelevel" :companyUuid="orderForm.companyUuid" :visibleLevel="orderForm.visibleLevel" :visibleGroupUuids="orderForm.visibleGroupUuid"></visible-level>
      <template slot="footer" class="dialog-footer">
        <s-button @click="visibleLevelOk">确定</s-button>
        <s-button type="cancel" @click="visibleLevelDialog = false">取消</s-button>
      </template>
    </s-dialog>

    <!--右侧工作详细信息的查看-->
    <s-dialog
      title="查看"
      v-if="workInfoDialog"
      v-model="workInfoDialog"
      width="700px">
      <work-info-detail :detailData="workInfoRow" ref="workInfoDialogForm"></work-info-detail>
    </s-dialog>
    <s-dialog
      title="添加工作信息" top="10%" width="600px"
      v-if="addWorkinfoFlag"
      v-model="addWorkinfoFlag">
      <s-form :model="workInfoForm" label-width="120px">
        <s-form-item label="工作信息">
          <s-input type="textarea" :rows="3" v-model="workInfoForm.content"></s-input>
        </s-form-item>
        <s-form-item label="附件信息">
          <s-upload class="upload"
                    ref="upload"
                    :action="workInfoUrl"
                    multiple
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :on-remove="uploadRemove"
                    :before-upload="beforeUpload"
                    :file-list="fileListUpload"
                    :with-credentials="true">
            <s-button slot="trigger" icon="export">上传</s-button>
          </s-upload>
        </s-form-item>
      </s-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addWorkInfo">添加</s-button>
      </template>
    </s-dialog>
    <!--右侧版本记录查看详情-->
    <s-dialog
      v-model="recordDetailDialog"
      v-if="recordDetailDialog"
      title="版本详情"
      width="900px"
      top="10vh"
      ref="recordDetailDialog">
      <view-version-records :record="record"></view-version-records>
    </s-dialog>
  </div>
</template>

<script>
  import VersionRecords from './DetailTabs/VersionRecords';
  import FeedbackScore from './DetailTabs/FeedbackScore';
  import ViewVersionRecords from './DetailDialog/ViewVersionRecords';
  import assignToMe from './DetailDialog/AssignToMe.vue';
  import assignToOthers from './DetailDialog/AssignToOthers.vue';
  // import DateRange from '@/components/tableCom/src/DateRange';

  import createAsso from '@/pages/Process_Components/CreateAssociationRelationship.vue';
  import printModifyTask from './DetailDialog/PrintModifyTask.vue';
  import workInfoDetail from '../Process_Components/WorkInfoDetail.vue';
  import cancel from './DetailDialog/Cancel.vue';
  // import closeDialog from './DetailDialog/CloseDialog.vue';
  import visibleLevel from './DetailDialog/VisibleLevel.vue'
  import $axios from 'sunflower-ajax';
  import detailMixin from './KnowledgeDetailMixin';
  import {NameCardHover} from '@/components/nameCard/NameCard';
  import { quillEditor } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  export default {
    mixins: [detailMixin],
    data() {
      return {
        addWorkinfoFlag: false,
        freshTable: false,    // 是否刷新右侧"版本记录"/"反馈评分"
        recordDetailDialog: false,
        record: {},
        userUuid: this.$store.state.userData.uuid,
        currentStep: 0,
        activeTab: 0,
        orderForm: {  // 展示form
          isConcern: 0,
          serialCode: '',
          briefDesc: '',
          detailDesc: '',
          knowledgeVersion: 1,
          citeTimes: 0,
          knowledgeType: '',
          solutionText: '',
          keyword: '',
          isItOperation: 1,
          appSystemName: '',
          adminGroup: '',
          adminUser: '',
          visibleLevel: '',
          visibleGroupUuid: '',
          knowledgeGroup: '',
          knowledgeUser: '',
          author: '',
          createUser: '',
          categoryFirst: '',
          categorySecond: '',
          categoryThird: '',
          uuid: this.$route.params.uuid,
          solutionContent: '',
          knowledgeStatus: '',
          knowledgeStatusName: '',
          concernUuid: ''
        },
        submitOrderForm: {},  // 每次保存的orderForm
        orderRules: {
          briefDesc: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {min: 1, max: 100, message: '长度为1-100的字符', trigger: 'blur'}
          ],
          keyword: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {min: 1, max: 100, message: '长度为1-100的字符', trigger: 'blur'}
          ],
          serialCode: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
          knowledgeType: [
            { required: true,
              message: '请选择知识类别',
              trigger: 'blur',
              transform (value) {
                return String(value)
              }
            }
          ],
          categoryFirst: [
            { required: true, message: '请选择一级分类', trigger: 'blur' }
          ],
          categorySecond: [
            { required: true, message: '请选择二级分类', trigger: 'blur' }
          ],
          knowledgeGroup: [
            { required: true, message: '请选择知识所属组', trigger: 'blur' }
          ],
          knowledgeUser: [
            { required: true, message: '请选择知识拥有者', trigger: 'blur' }
          ],
          knowledgeStatus: [
            { required: true,
              message: '请选择知识状态',
              trigger: 'blur',
              transform (value) {
                return String(value)
              }
            }
          ],
          isItOperation: [
            { required: true,
              message: '请选择是否IT运维内部使用',
              trigger: 'blur',
              transform (value) {
                return String(value)
              }
            }
          ],
          knowledgeVersion: [
            { required: true,
              message: '请输入版本号',
              trigger: 'blur',
              transform (value) {
                return String(value)
              }
            }
          ],
          citeTimes: [
            { required: true,
              message: '请输入引用次数',
              trigger: 'blur',
              transform (value) {
                return String(value)
              }
            }
          ]
        },
        detailRules: {
          detailDesc: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
          ],
          solutionContent: [
            { required: true, message: '请输入活动名称,字数不限', trigger: 'blur' }
          ]
        },
        editorOption: {
          // some quill options
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
//               [{ 'header': 1 }, { 'header': 2 }],
//              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{'script': 'sub'}, {'script': 'super'}],
//              [{ 'indent': '-1' }, { 'indent': '+1' }],
//              [{ 'direction': 'rtl' }],
//              [{ 'size': ['small', false, 'large', 'huge'] }],
//             [{ 'font': [] }],
//              [{ 'color': [] }, { 'background': [] }],
              [{'align': []}],
//             ['clean'],
//              ['link', 'image', 'video']
              ['image'],
              [{'header': [1, 2, 3, 4, 5, 6, false]}]
            ]
          }
        },
        workInfoForm: {
          content: ''
        },       // 添加工作信息
        taskData: [],
        fileList: [],
        fileListUpload: [],
        categoryFirstList: [],    // 一级列表
        categorySecondList: [],   // 二级列表
        categoryThirdList: [],    // 三级列表
        adminUserSelect: [],
        adminGroupSelect: [],
        knowledgeGroupSelect: [],
        knowledgeUserSelect: [],
        workInfoData: [],         // 工作详细信息数据
        associationData: [],         // 右侧关联关系表格数据
        allDisabled: true,        // 全部按钮是否禁用
        formDisabled: true,       // 工单数据是否禁用
        saveDisabled: true,  // 保存按钮是否禁用
        nextDisabled: true,  // 下一阶段按钮是否禁用
        assignMeDisabled: true,   // 指派给我按钮是否禁用
        assignOthersDisabled: true,   // 指派给他人按钮是否禁用
        visibleLevelDisabled: true,   // 可见度按钮是否禁用
        newVersionDisabled: true,    // 新版本按钮是否禁用
        cancelDisabled: true,       // 取消按钮是否禁用
        isClickNewVersion: false,
        // 左侧功能菜单弹框
        createAssoDialog: false,            // 创建关联关系
        printTaskDetailDialog: false,       // 打印变更详情预览弹框
        printLoading: false,                // 打印变更详情预览弹框loading遮罩
        cancelDialog: false,                // 取消弹框
        assignToMeDialog: false,            // 指派给我弹框
        assignToOthersDialog: false,        // 指派给他人弹框
        visibleLevelDialog: false,          // 能见度设置弹框
        workInfoDialog: false,              // 查看信息详情弹框
        orderUuid: this.$route.params.uuid,  // 路由跳转时获取工单的uuid
        iframeSRC: `#/PrintModifyTask?uuid=${this.$route.params.uuid}`,
        role: '',
        workInfoRow: {},       // 查看工作详细信息当前行的data
        orderFormIsChange: false,   // orderForm表单内容是否改变，未改变保存不掉接口
        nextBtn: true,
        ItilRole: [],
        itilKnowledgeTypeSelect: {},
        inited: false
      }
    },
    components: {
      VersionRecords,
      FeedbackScore,
      ViewVersionRecords,
      // DateRange,
      assignToMe,
      assignToOthers,
      cancel,
      createAsso,
      printModifyTask,
      // closeDialog,
      visibleLevel,
      workInfoDetail,
      NameCardHover,
      quillEditor
    },
    computed: {
      workInfoUrl() {
        return `${$axios.basePath()}/fileUpload/uploadItilattach`
      }
    },
    methods: {
      addWorkInfoDialog() {
        this.addWorkinfoFlag = true
      },
      printModifyDetail() {
        this.$refs.printTaskIframe.contentWindow.print()
      },
      /**
       * 左侧菜单栏功能
       */
      // 关注
      attention() {
        $axios.get(`/ItilCommonWorkflow/concernIncidentOrder/${this.orderUuid}/4`).then(({data}) => {
          if (typeof data === 'string') {
            this.$message({
              type: 'success',
              message: '已关注该工单！'
            })
            this.itilChangeOrder()
          } else {
            this.$message({
              type: 'error',
              message: '关注失败，请重试！'
            })
          }
        })
      },
      updateNewVersion() {
        this.isClickNewVersion = true
        this.judgeRole()
      },
      // 取消关注
      cancelAttention() {
        $axios.get(`/ItilCommonWorkflow/cancelIncidentOrder/${this.orderForm.concernUuid}`).then(({data}) => {
          if (data.state === true) {
            this.$message({
              type: 'success',
              message: '该工单关注已取消！'
            })
            this.itilChangeOrder()
          } else {
            this.$message({
              type: 'error',
              message: '取消关注失败，请重试！'
            })
          }
        })
      },
      // 取消
      cancelHandle() {
        this.cancelDialog = true
      },
      // 取消弹框关闭
      closeCancel() {
        this.cancelDialog = false;
      },
      // 指派给我
      assignToMe() {
        this.assignToMeDialog = true
      },
      // 指派给我弹框关闭
      closeAssignToMe(flag) {
        if (flag !== 'cancle') {
          this.itilChangeOrder();
        }
        this.assignToMeDialog = false;
      },
      // 指派给他人
      assignToOthers() {
        this.assignToOthersDialog = true
      },
      // 指派给他人弹框关闭
      closeAssignToOthers(flag) {
        if (flag !== 'cancle') {
          this.itilChangeOrder();
        }
        this.assignToOthersDialog = false
      },
      setVisibleLevel() {
        this.visibleLevelDialog = true
      },
      // 创建关联关系
      createAssociation() {
        this.createAssoDialog = true
      },
      closeAssoDialog(close) {
        this.getAssociationData() // 关闭弹框刷新关联关系列表
        close()
      },
      // 查看变更单流程图
      openModifyFlowchart() {
        this.$router.push(`/ProcessCenter/knowledgeFlowchart/${this.orderForm.serialCode}/${this.orderUuid}`)
      },
      // 打开打印变更详情弹框
      showPrintDialog() {
        this.printTaskDetailDialog = true
        let theme = document.querySelector('#sunflower-theme').href
        this.$refs.printTaskIframe.contentWindow.document.head.innerHTML = `
          <link rel="stylesheet" href="${theme}"></link>
          <link rel="stylesheet" href="../../../static/css/index.css"></link>`
        this.$refs.printTaskIframe.contentWindow.document.body.appendChild(this.$refs.storePrintModifyData.$el)
      },
      // 取消
      cancelOk() {
        let cancelReason = this.$refs['cancel'].cancelForm.cancel
        this.$refs['cancel'].$refs['cancelForm'].validate((valid) => {
          if (valid) {
            $axios.post(`/itilKnowledgeOrder/knowledgeOrderCancel`, {
              orderUuid: this.orderUuid,
              cancelReason: cancelReason
            }).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: '取消成功！'
                })
                this.cancelDialog = false
                this.itilChangeOrder()
              } else {
                this.$message({
                  type: 'error',
                  message: '取消失败，请重试！'
                })
              }
            })
          } else {
            return false
          }
        })
      },
      // 知识库能见度设置
      visibleLevelOk() {
        this.$refs.visiblelevel.$refs.visibleForm.validate((valid) => {
          if (valid) {
            if (this.$refs.visiblelevel.groupShowList.length > 0) {
              let visibleLevel = this.$refs.visiblelevel.visibleLevel1
              let visibleGroupUuid = this.$refs.visiblelevel.groupShowList.map((item) => item.uuid).join(',')
              $axios.post(`/itilKnowledgeOrder/updateKnowledgeOrder`, {
                uuid: this.orderForm.uuid,
                visibleLevel,
                visibleGroupUuid
              }).then(({data}) => {
                if (data.state === true) {
                  this.$message({
                    type: 'success',
                    message: '设置成功！'
                  })
                  this.cancelTaskOrderDialog = false
                  this.itilChangeOrder()
                } else {
                  this.$message({
                    type: 'error',
                    message: '设置失败，请重试！'
                  })
                }
              })
              this.visibleLevelDialog = false
            } else {
              this.$message({
                type: 'warning',
                message: '请选择支持组！'
              })
            }
          } else {
            return false
          }
        })
      },
      // 关联关系查看工单
      gotoEvent(orderTypeStr, uuid) {
        switch (orderTypeStr) {
          case '变更': orderTypeStr = 'modifyDetail'; break;
          case '事件': orderTypeStr = 'eventDetail'; break;
          case '任务': orderTypeStr = 'taskOrderDetail'; break;
          case '问题': orderTypeStr = 'problemDetail'; break;
          case '服务请求': orderTypeStr = 'requestServiceDetail'; break;
          case '发布': orderTypeStr = 'publishDetail'; break;
          case '知识': orderTypeStr = 'knowDetail'; break;
        }
        window.open(`${location.protocol}/#/ProcessCenter/${orderTypeStr}/${uuid}`);
      },
      // 工单信息以及下拉框
      getData() {
        $axios.get('/itilKnowledgeOrder/getKnowledgeOrderSelectDate').then(res => {
          this.itilKnowledgeTypeSelect = res.data.itilKnowledgeTypeSelect; // 知识工单类型
        })
      },
      getAdminGroup(val) {
        $axios.get('/itilKnowledgeOrder/getAllKnowledgeAdminGroup/' + val).then(res => {
          if (res.data && res.data.length > 0) {
            this.adminGroupSelect = res.data;
            // this.orderForm.adminGroup = this.adminGroupSelect[0].uuid;
            // this.getAdminUser(this.orderForm.adminGroup);
          }
        })
      },
      getAdminUser(val) {
        $axios.get('/itilKnowledgeOrder/getAllKnowledgeaAdminUserByGroup/' + val).then(res => {
          if (res.data && res.data.length > 0) {
            this.adminUserSelect = res.data;
            // this.orderForm.adminUser = this.adminUserSelect[0].uuid;
          }
        })
      },
      getKnowledgeGroup(val) {
        $axios.get('/itilWorkflowConfig/getAllSupportGroupByCompanyUuid/' + val).then(res => {
          if (res.data && res.data.length > 0) {
            this.knowledgeGroupSelect = res.data;
            // this.orderForm.knowledgeGroup = this.knowledgeGroupSelect[0].uuid;
            // this.getKnowledgeUser(this.orderForm.knowledgeGroup);
          }
        })
      },
      getKnowledgeUser(val) {
        $axios.get('/itilWorkflowConfig/getIamUserInfoListByGroupUuid/' + val).then(res => {
          if (res.data && res.data.length > 0) {
            this.knowledgeUserSelect = res.data;
            // this.orderForm.knowledgeUser = this.knowledgeUserSelect[0].uuid;
          }
        })
      },
      // 所有select
      getSelect() {
        this.getData()
        this.getAdminGroup(this.orderForm.companyUuid);
        this.getAdminUser(this.orderForm.adminGroup)
        this.getKnowledgeGroup(this.orderForm.companyUuid);
        this.getKnowledgeUser(this.orderForm.knowledgeGroup)
        this.getItilCategory(4, this.orderForm.companyUuid)
        this.getSecondCategory(4, this.orderForm.companyUuid, this.orderForm.categoryFirst)
        this.getThirdCategory(4, this.orderForm.companyUuid, this.orderForm.categoryFirst, this.orderForm.categorySecond)
      },
      saveOrder() {
       var {
          uuid,
          serialCode,
          briefDesc,
          knowledgeVersion,
          citeTimes,
          knowledgeType,
          detailDesc,
          solutionText,
          solutionContent,
          companyUuid,
          keyword,
          isItOperation,
          categoryFirst,
          categorySecond,
          categoryThird,
          appSystemName,
          adminGroup,
          adminUser,
          visibleLevel,
          visibleGroupUuid,
          knowledgeGroup,
          knowledgeUser,
          author,
          createUser
       } = this.orderForm;
       let form = {
          uuid,
          serialCode,
          briefDesc,
          knowledgeVersion,
          citeTimes,
          knowledgeType,
          detailDesc,
          solutionText,
          solutionContent,
          companyUuid,
          keyword,
          isItOperation,
          categoryFirst,
          categorySecond,
          categoryThird,
          appSystemName,
          adminGroup,
          adminUser,
          visibleLevel,
          visibleGroupUuid,
          knowledgeGroup,
          knowledgeUser,
          author,
          createUser
        }
        if (this.orderFormIsChange === true) {
          $axios.post(`/itilKnowledgeOrder/updateKnowledgeOrder`, form).then((res) => {
            if (res.data.state === true) {
              this.$message.success('保存成功！')
              this.itilChangeOrder()
              this.orderFormIsChange = false
              this.isClickNewVersion = false
            }
          })
        }
      },
      // 下一阶段按钮
      nextStep() {
        var {
          uuid,
          serialCode,
          briefDesc,
          knowledgeVersion,
          citeTimes,
          knowledgeType,
          detailDesc,
          solutionText,
          solutionContent,
          companyUuid,
          keyword,
          isItOperation,
          categoryFirst,
          categorySecond,
          categoryThird,
          appSystemName,
          adminGroup,
          adminUser,
          visibleLevel,
          visibleGroupUuid,
          knowledgeGroup,
          knowledgeUser,
          author,
          createUser
        } = this.orderForm
        let form = {
          uuid,
          serialCode,
          briefDesc,
          knowledgeVersion,
          citeTimes,
          knowledgeType,
          detailDesc,
          solutionText,
          solutionContent,
          companyUuid,
          keyword,
          isItOperation,
          categoryFirst,
          categorySecond,
          categoryThird,
          appSystemName,
          adminGroup,
          adminUser,
          visibleLevel,
          visibleGroupUuid,
          knowledgeGroup,
          knowledgeUser,
          author,
          createUser
        }
        if (this.nextBtn) {
          this.$refs['orderForm'].validate((valid) => {
            if (valid) {
              $axios.post(`/itilKnowledgeOrder/nextStep`, form).then(({data}) => {
                if (data.state === true) {
                  this.orderFormIsChange = false
                  this.nextBtn = false
                  // 知识单状态以改变，需要重新获取接口
                  this.itilChangeOrder().then(() => {
                    this.nextBtn = true
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: data.errormsg
                  })
                  // this.nextBtn = true
                }
              })
            }
          })
        }
      },
      // 切换tab事件
      handleClick(tab) {
        switch (tab.name) {
          case '0':
            this.serachItilLog();
            break;
          case '1':
            this.getAssociationData();
            break;
        }
      },
      // 右侧工作详细信息
      serachItilLog() {
        $axios.get(`/itilIncidentCenter/serachItilLog/${this.orderUuid}`).then(({data}) => {
          if (data instanceof Array) {
            this.workInfoData = data;
          }
        });
      },
      // 查看右侧工作详细信息
      checkWorkDeatail(index, row) {
        this.workInfoDialog = true
        this.workInfoRow = row
      },
      // 右侧关联关系数据
      getAssociationData() {
        $axios.get(`/ItilCommonWorkflow/getRelationOrderlist/${this.orderUuid}`).then(({data}) => {
          let {changeOrderList, changeTaskList, incidentOrderList, knowledgeOrderList, problemOrderList, publishOrderList, requestOrderList} = data;
          changeOrderList = (changeOrderList || []).map(item => Object.assign({}, item, {
            statusName: item.changeStatusName,
            orderTypeStr: '变更'
          }));
          changeTaskList = (changeTaskList || []).map(item => Object.assign({}, item, {
            statusName: item.statusName,
            orderTypeStr: '任务'
          }));
          incidentOrderList = (incidentOrderList || []).map(item => Object.assign({}, item, {
            statusName: item.incidentStatusName,
            orderTypeStr: '事件'
          }));
          knowledgeOrderList = (knowledgeOrderList || []).map(item => Object.assign({}, item, {
            statusName: item.knowledgeStatusName,
            orderTypeStr: '知识'
          }));
          problemOrderList = (problemOrderList || []).map(item => Object.assign({}, item, {
            statusName: item.problemStatusName,
            orderTypeStr: '问题'
          }));
          publishOrderList = (publishOrderList || []).map(item => Object.assign({}, item, {
            statusName: item.publishStatusName,
            orderTypeStr: '发布'
          }))
          requestOrderList = (requestOrderList || []).map(item => Object.assign({}, item, {
            status: item.status,
            orderTypeStr: '服务请求'
          }))
          this.associationData = [...changeOrderList, ...changeTaskList, ...incidentOrderList, ...knowledgeOrderList, ...problemOrderList, ...publishOrderList, ...requestOrderList]
        })
      },
      // 右侧取消关联关系
      cancelEvent(row) {
        if (row.relationOrderUuid) {
          this.$confirm('确定取消关联此工单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.post(`ItilCommonWorkflow/cancelRelationOrder/`, [row.relationOrderUuid]).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: '取消成功！'
                })
                this.getAssociationData();
              } else {
                this.$message({
                  type: 'error',
                  message: '取消失败！'
                })
              }
            })
          }).catch(() => {});
        }
      },
      // 附件上传成功
      uploadSuccess(res, file, fileList) {
        this.fileList.push(res)
      },
      // 附件上传失败
      uploadError() {
        this.$message({type: 'error', message: '上传失败'});
      },
      // 附件移除
      uploadRemove(file, fileList) {
        this.fileList.forEach((itemFile, indexFile) => {
          if (itemFile.attachuuid === file.response.attachuuid) {
            this.fileList.splice(indexFile, 1)
          }
        })
        this.deleteFile([file.response.attachuuid])
      },
      beforeUpload(file) {
        if (this.fileList.length >= 10) {
          this.$message({type: 'error', message: '一次最多上传10个!'});
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
          this.$message({type: 'error', message: '单个文件大小不能超过10M!'});
          return false;
        }
      },
      // 添加工作信息
      addWorkInfo() {
        if (this.fileList.length > 10) {
          this.$message({type: 'error', message: '一次最多上传10个!'});
          return;
        }
        if (this.fileList.length > 0 || this.workInfoForm.content) {
          let uuid = this.fileList.map((item) => {
            return item.attachuuid
          })
          let param = {
            logDetail: this.workInfoForm.content,
            relationOrderUuid: this.orderUuid,
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
              this.serachItilLog()
            } else {
              this.$message({
                type: 'error',
                message: '添加失败！'
              })
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '请先添加工作信息或者附件！'
          })
        }
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
              message: '删除失败！'
            })
          }
        })
      },
      // 查看版本记录详情
      viewRecords(record) {
        this.record = record;
        this.recordDetailDialog = true;
      },
      // 判断角色信息
      judgeRole() {
// 除指派给我和指派给他人按钮
//        if(当前用户==知识提交人 && 当前用户！= 知识管理员){
//          草稿、已启动：所有权限放开
//          已发布：默认页面数据、保存按钮不可点击，点击新版本后可以修改点击；其他权限按钮禁止
//          待发布、发布审批、注销审批、已废弃、已取消、已拒绝：所有权限按钮禁止
//        }else if(当前用户== 知识管理员){
//          草稿、已启动、待发布：所有权限放开
//          已发布：默认页面数据、保存按钮不可点击，点击新版本后可以修改点击；其他权限按钮放开
//          发布审批、注销审批、已废弃、已取消、已拒绝：所有权限按钮禁止
//        }else if(当前用户 ！= 知识提交人 && 当前用户！=知识管理员 ){
//          所有权限禁止
//        }
//        指派给我按钮:
//        if(当前用户拥有知识管理员角色 && 当前用户！=知识管理员){
//          草稿、已启动、待发布：按钮放开
//          已发布、发布审批、注销审批、已废弃、已取消、已拒绝：按钮禁止
//        }else{
//          草稿、已启动、待发布、已发布、发布审批、注销审批、已废弃、已取消、已拒绝（所有状态）:禁止
//        }
//
//        指派给他人按钮:
//        if(当前用户==知识提交人 || 当前用户==知识管理员){
//          草稿、已启动、待发布：按钮放开
//          已发布、发布审批、注销审批、已废弃、已取消、已拒绝：按钮禁止
//        }else{
//          草稿、已启动、待发布、已发布、发布审批、注销审批、已废弃、已取消、已拒绝（所有状态）:禁止
//        }
        let orderForm = this.orderForm
        let status = this.orderForm.knowledgeStatus
        let userIsKnowManager = false
        // 默认所有都为true，在判断是否需要放开按钮，并且每次重新重置为true
        this.allDisabled = this.assignMeDisabled = this.assignOthersDisabled = this.formDisabled = this.saveDisabled = this.nextDisabled = this.newVersionDisabled = this.cancelDisabled = this.visibleLevelDisabled = true
        if (this.ItilRole instanceof Array && this.ItilRole.length > 0) {
          userIsKnowManager = this.ItilRole.some((item) => {
            return item.roleKey === 'knowledge_minstrator'
          })
        }
        if (this.userUuid === orderForm.createUser && this.userUuid !== orderForm.adminUser) {
          switch (status) {
            case 1: this.formDisabled = this.saveDisabled = this.nextDisabled = this.cancelDisabled = this.visibleLevelDisabled = false; break;
            case 2: this.allDisabled = false; break;
            case 5:
              if (this.isClickNewVersion) {
                this.formDisabled = this.saveDisabled = false
              }
              break;
          }
        } else if (this.userUuid === orderForm.adminUser) {
          switch (status) {
            case 1: this.formDisabled = this.saveDisabled = this.nextDisabled = this.cancelDisabled = this.visibleLevelDisabled = false; break;
            case 2: this.allDisabled = false; break;
            case 4: this.formDisabled = this.saveDisabled = this.nextDisabled = this.newVersionDisabled = this.visibleLevelDisabled = false; break;
            case 5:
              this.visibleLevelDisabled = this.newVersionDisabled = this.nextDisabled = false;
              if (this.isClickNewVersion) {
                this.formDisabled = this.saveDisabled = false
              }
              break;
          }
        }
        // 指派给我按钮
        if (userIsKnowManager && this.userUuid !== orderForm.adminUser) {
          if (status === 1 || status === 2 || status === 4) {
            this.assignMeDisabled = false
          }
        }
        // 指派给他人按钮
        if (this.userUuid === orderForm.createUser || this.userUuid === orderForm.adminUser) {
          if (status === 1 || status === 2 || status === 4) {
            this.assignOthersDisabled = false
          }
        }
      },
      // 初始化
      itilChangeOrder() {
        this.inited = false
        return $axios.get(`/itilKnowledgeOrder/getKnowledgeOrderDetail/${this.orderUuid}`).then(({data}) => {
          if (data) {
            this.orderForm = data
            this.orderForm.knowledgeType = String(this.orderForm.knowledgeType)
            switch (this.orderForm.knowledgeStatus) {
              case 1:
                this.currentStep = 0;
                break;     // 草稿
              case 2:
                this.currentStep = 1;
                break;     // 已启动
              case 3:
                this.currentStep = 2;
                break;     // 发布审批
              case 4:
                this.currentStep = 3;
                break;     // 待发布
              case 5:
                this.currentStep = 3;
                break;     // 已发布
              case 6:
                this.currentStep = 4;
                break;     // 注销审批
              case 7:
                this.currentStep = 4;
                break;     // 已废弃
              case 8:
                this.currentStep = 4;
                break;     // 已拒绝
              case 9:
                this.currentStep = 4;
                break;     // 已取消
            }
          }
        }).then(() => {
          this.judgeRole();
          this.getSelect();
          this.serachItilLog();     // 刷新"工作信息"
          this.freshTable = true;   // 传参，刷新右侧"版本记录"/"反馈评分"
        }).then(() => {
          this.inited = true
        })
      }
    },
    created() {
      $axios.get(`/itilWorkflowConfig/getItilRoleByUserUuid/${this.$store.state.userData.uuid}`).then((res) => {
        this.ItilRole = res.data
        this.itilChangeOrder()
      })
    },
    watch: {
      orderForm: {
        deep: true,
        handler() {
          if (!this.inited) {
            return
          }
          this.orderFormIsChange = true
        }
      }
    }
  }
</script>

<style lang="stylus">
  .processDetail
    .upload
      width 100%
    .clickLink
      text-decoration underline
      cursor pointer
    #processModifyDetail .s-tabs-border-card .s-tabs-content
      padding 5px 0!important
    #printTaskIframe
      width 100%
      min-height 500px
    #printTaskDetailDialog
      .s-dialog-body
        padding-bottom 0
      .s-dialog-footer
        padding-top 0
    #modifyDetailRight .s-tabs-border-card .s-tabs-content
      padding 5px 0 !important
    .detailTab
      .quillFormItem
        .s-form-item-content
          height 250px
      .quill-editor
        height 200px
#index-body
  padding-left:0 !important
#systemDate
  .grid-content
    font-size 14px
    margin-bottom 10px
</style>
