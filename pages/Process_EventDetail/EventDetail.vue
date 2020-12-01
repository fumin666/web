<template>
  <div class="processDetail processEventDetail" style="display: flex; padding-bottom: 0;">
    <div style="width: 175px; margin-right: 20px">
      <div class="process-detail-title">
        <span class="process-detail-text">事件管理</span>
      </div>
      <div class="leftMenu">
        <div class="title">-- 功能菜单 --</div>
        <s-button @click="attention" :class="data.concernUuid ? 'attention attention-empty' : 'attention'" :disabled="inactive">{{data.concernUuid ? '取消关注' : '关注'}}</s-button>
        <s-button @click="assignToMe" icon="click" :disabled="userDisable || form.incidentStatus >= 4 || form.incidentStatus === 2">指派给我</s-button>
        <s-button @click="assignToOther" icon="assist" :disabled="userDisable || form.incidentStatus >= 4 || form.incidentStatus === 2">指派给他人</s-button>
        <s-button @click="urge" icon="alarm" :disabled="rolePro < 0 || inactive || form.incidentStatus === 4">催办</s-button>
        <!--已指派、进行中 可以取消-->
        <s-button @click="cancel" icon="cancel" :disabled="userDisable || [1, 3].indexOf(form.incidentStatus) === -1">取消</s-button>
        <!-- 已指派1、进行中3 可以待决 -->
        <s-button @click="pengding" :icon="form.incidentStatus === 2 ? 'retreat' : 'underway'" :disabled="userDisable || [1, 2, 3].indexOf(form.incidentStatus) === -1">{{form.incidentStatus === 2 ? '恢复' : '待决'}}</s-button>
        <s-button @click="createAssociationRelationship" icon="bangding" :disabled="inactive">创建关联关系</s-button>
        <s-button @click="openEventFlowchart" icon="manage-process">流程图</s-button>
        <s-button @click="showUploadDialog" icon="export" :disabled="inactive">附件上传</s-button>
        <s-button @click="showPrintDialog" icon="printer">打印</s-button>
        <s-button @click="searchKnowledge" icon="association">搜索知识库</s-button>
        <s-button @click="createKnowledge" icon="order-add">创建知识库</s-button>
      </div>
      <div class="leftMenu">
        <div class="title">-- SLA状态 --</div>
        <div style="margin:0 10px">
          <div class="leftSla">响应目标时间
            <span class="tag tag-warning" v-if="slaStatus.responseStatus === 1" >警告</span>
            <span class="tag tag-sucess" v-else-if="slaStatus.responseStatus === 2">满足</span>
            <span class="tag tag-error" v-else-if="slaStatus.responseStatus === 3">不满足</span>
            <span class="tag tag-disabled" v-else-if="slaStatus.responseStatus === 4" >已废弃</span>
            <span class="tag tag-ing" v-else-if="slaStatus.responseStatus === 5" >进行中</span>
          </div>
          <s-input :disabled="true" v-model="slaStatus.responseTime"></s-input>
          <div class="leftSla">解决目标时间
            <span class="tag tag-warning" v-if="slaStatus.solveStatus === 1" >警告</span>
            <span class="tag tag-sucess" v-else-if="slaStatus.solveStatus === 2">满足</span>
            <span class="tag tag-error" v-else-if="slaStatus.solveStatus === 3">不满足</span>
            <span class="tag tag-disabled" v-else-if="slaStatus.solveStatus === 4" >已废弃</span>
            <span class="tag tag-ing" v-else-if="slaStatus.solveStatus === 5" >进行中</span>
          </div>
          <s-input :disabled="true" v-model="slaStatus.solveTime"></s-input>
        </div>
      </div>
    </div>
    <div style="flex: 1;">
      <s-steps :current="currentStep" finish-status="success" style="text-align: center;" step-width="calc(20% - 23px)">
        <s-step title="标识与记录"></s-step>
        <s-step title="调查与分派"></s-step>
        <s-step title="诊断与恢复"></s-step>
        <s-step title="解决与回顾"></s-step>
        <s-step title="关闭"></s-step>
      </s-steps>
      <div style="margin-top: 20px">
        <s-scrollbar wrap-style="max-height: calc(100vh - 222px);">
          <s-row :gutter="20" style="margin: 0 0 0 0">
            <s-col span="10" class="formContainer" style="padding:0 9px 0 10px;border-right: 1px dashed rgba(0, 0, 0, 0.1);">
              <s-form :model="form" :rules="rules" ref="form" label-width="120px">
                <s-form-item label="事件编号">
                  <span>{{form.serialCode}}</span>
                </s-form-item>
                <s-form-item label="最终用户姓名">
                  <NameCardHover :useruuid="form.endUser" style="width: 100%;">
                    <s-select v-model="form.endUser" disabled :anonLabel="form.endUserName">
                      <s-option v-for="(item, index) in endUserList" :label="item.userRealName" :key="'endUser' + index" :value="item.uuid">
                      </s-option>
                    </s-select>
                  </NameCardHover>
                </s-form-item>
                <s-form-item label="事件模板">
                  <s-input v-model="data.templateName" disabled></s-input>
                </s-form-item>
                <s-form-item label="简要描述" prop="briefDesc">
                  <s-input v-model="form.briefDesc" type="textarea" :rows="3" :maxlength="100"></s-input>
                </s-form-item>
                <s-form-item label="详细描述" prop="detailDesc">
                  <s-input v-model="form.detailDesc" type="textarea" :rows="3" :maxlength="300"></s-input>
                </s-form-item>
                <s-form-item label="分类一级" prop="categoryFirst">
                  <s-select v-model="form.categoryFirst" @change="axiosCategory(2)" :anonLabel="form.categoryFirstName">
                    <s-option v-for="opt in topCategory" :label="opt.categoryName" :value="opt.uuid" :key="opt.uuid"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="分类二级" prop="categorySecond">
                  <s-select v-model="form.categorySecond" @change="axiosCategory(3)" :anonLabel="form.categorySecondName">
                    <s-option v-for="opt in secondary" :label="opt.categoryName" :value="opt.uuid" :key="opt.uuid"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="分类三级">
                  <s-select v-model="form.categoryThird" clearable :anonLabel="form.categoryThirdName">
                    <s-option v-for="opt in thirdary" :label="opt.categoryName" :value="opt.uuid" :key="opt.uuid"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="事件来源" prop="">
                  <s-select v-model="form.incidentSource">
                    <s-option v-for="(value, key, index) in options.incidentSourceMap" :label="value" :value="key - 0" :key="'incidentSourceMap' + index"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="紧急性" prop="">
                  <s-select v-model="form.criticality" :disabled="userDisable || rolePro<2">
                    <s-option v-for="(value, key, index) in options.criticalityMap" :label="value" :value="key - 0" :key="'criticalityMap' + index"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="影响度" prop="">
                  <s-select v-model="form.effect" :disabled="userDisable || rolePro<2">
                    <s-option v-for="(value, key, index) in options.effectMap" :label="value" :value="key - 0" :key="'effect' + index"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="优先级" prop="">
                  <s-select v-model="form.priority" disabled>
                    <s-option v-for="(value, key, index) in options.priorityMap" :label="value" :value="key - 0" :key="'priority' + index"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="处理组" prop="">
                  <s-select v-model="form.assignGroup" @change="changeGroup" :disabled="userDisable || form.incidentStatus >= 4 || form.incidentStatus === 2">
                    <s-option v-for="(item, index) in groupList" :key="'group' + index" :label="item.groupName" :value="item.uuid">
                    </s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="处理人" prop="">
                  <NameCardHover :useruuid="form.assignUser">
                    <s-select v-model="form.assignUser" :anonLabel="form.assignUserName" :disabled="userDisable || form.incidentStatus >= 4 || form.incidentStatus === 2">
                      <s-option v-for="(item, index) in userList" :key="'user' + index" :label="item.userRealName" :value="item.uuid">
                      </s-option>
                    </s-select>
                  </NameCardHover>
                </s-form-item>
                <s-form-item label="状态" prop="">
                  <s-select v-model="form.incidentStatus" disabled>
                    <s-option v-for="(value, key, index) in options.statusMap" :key="'status' + index" :label="value" :value="key - 0">
                    </s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="解决方案" prop="solutioninfo">
                  <s-input v-model="form.solutioninfo" type="textarea" :rows="3" :maxlength="500"></s-input>
                </s-form-item>
                <s-form-item label="关闭代码" disabled v-if="form.closeCode || form.closeCode === 0">
                  <s-select v-model="form.closeCode" disabled>
                    <s-option label="成功解决" :value="0"></s-option>
                    <s-option label="变更解决" :value="1"></s-option>
                    <s-option label="不成功" :value="2"></s-option>
                    <s-option label="转交开发" :value="3"></s-option>
                    <s-option label="误报" :value="4"></s-option>
                    <s-option label="用户撤销" :value="5"></s-option>
                    <s-option label="自动关闭" :value="6"></s-option>
                    <s-option label="其他" :value="7"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="待决原因" v-if="form.pendens || form.pendens === 0">
                  <s-select v-model="form.pendens" disabled>
                    <s-option label="等待用户提供进一步的信息" :value="0"></s-option>
                    <s-option label="等待其他厂商/供应商处理" :value="1"></s-option>
                    <s-option label="等待问题管理" :value="2"></s-option>
                    <s-option label="等待变更实施" :value="3"></s-option>
                    <s-option label="其他" :value="4"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="取消原因" prop="" v-if="form.cancleReason">
                  <s-input v-model="form.cancleReason" type="textarea" :rows="3" disabled></s-input>
                </s-form-item>
              </s-form>
            </s-col>
            <s-col span="14" class="detailBox">
              <s-tab v-model="activeTab">
                <s-tab-pane label="工作详细信息">
                  <s-button icon="plus" @click="addWorkInfoDialog" style="margin-bottom: 10px;">添加工作信息</s-button>
                  <s-table-page :data="workInfo">
                    <s-table-column prop="logTypeStr" label="类型" show-overflow-tooltip>
                    </s-table-column>
                    <s-table-column prop="logDetail" label="工作信息" show-overflow-tooltip>
                    </s-table-column>
                    <s-table-column label="文件" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span>{{scope.row.attachmentList ? scope.row.attachmentList.length : 0}}</span>
                      </template>
                    </s-table-column>
                    <s-table-column prop="createTime" label="提交日期" show-overflow-tooltip>
                    </s-table-column>
                    <s-table-column prop="createUserName" label="提交人名称" show-overflow-tooltip>
                    </s-table-column>
                    <s-table-column label="操作" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <i class="iconfont icon-eye" title="查看" @click="rowShowWork(scope.row)"></i>
                      </template>
                    </s-table-column>
                  </s-table-page>
                </s-tab-pane>
                <s-tab-pane label="关联关系">
                  <s-table-page :data="relateRelation">
                    <s-table-column prop="orderTypeStr" label="工单类型" show-overflow-tooltip>
                    </s-table-column>
                    <s-table-column label="工单编号" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <a @click="gotoEvent(scope.row)" class="clickLink">{{scope.row.serialCode}}</a>
                      </template>
                    </s-table-column>
                    <s-table-column prop="briefDesc" label="简要描述" show-overflow-tooltip>
                    </s-table-column>
                    <s-table-column prop="status" label="状态" show-overflow-tooltip>
                    </s-table-column>
                    <s-table-column label="操作" align="center" width="80" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <i class="iconfont icon-bind-remove" title="取消关联" @click="rowDisconnect(scope.row)"></i>
                      </template>
                    </s-table-column>
                  </s-table-page>
                </s-tab-pane>
                <s-tab-pane label="日期/系统">
                  <div id="systemDate">
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">提交人姓名：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ dateForm.createUserName }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">提交时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ dateForm.createTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">目标时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ dateForm.expectTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">接单时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ dateForm.acceptTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">分派时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ dateForm.assignTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">待决时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ dateForm.pendingTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">待决恢复时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ dateForm.pendesRecover }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">解决时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ dateForm.finishTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">关闭时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ dateForm.closeTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">取消时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ dateForm.cancelTime }} </s-col>
                    </s-row>
                  </div>
                </s-tab-pane>
                <s-tab-pane label="催办列表">
                  <s-table-page :data="urgeList">
                    <s-table-column prop="allType" label="催办类型" show-overflow-tooltip>
                      <template slot-scope="scope">
                        {{urgeTypeMap[scope.row.allType]}}
                      </template>
                    </s-table-column>
                    <s-table-column prop="context" label="催办消息" show-overflow-tooltip>
                    </s-table-column>
                    <s-table-column prop="assignUser" label="处理人" show-overflow-tooltip>
                    </s-table-column>
                    <s-table-column prop="createTime" label="提交日期" show-overflow-tooltip>
                    </s-table-column>
                    <s-table-column prop="pressUser" label="催办人" show-overflow-tooltip>
                    </s-table-column>
                    <s-table-column prop="allSendStatus" label="发送状态" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <i class="iconfont" v-for="(item,i) in scope.row.allSendStatus.length" :key="i" :class="getUrgeStateIcon(item, scope.row)"></i>
                      </template>
                    </s-table-column>
                  </s-table-page>
                </s-tab-pane>
                <s-tab-pane label="请求内容" v-if="serviceRequestUuid">
                  <s-form
                    ref="serviceRequestForm"
                    :model="serviceRequestForm"
                    label-width="100px">
                    <s-form-item
                      v-for="(item, idx) in serviceRequestDetail"
                      :label="item.colnumName" :key="item.uuid">
                      <!--文本-->
                      <s-input v-if="item.colnumName==='个人地址' && item.htmlType==='udf_char_single_line'" disabled
                               :value="serviceRequestForm.valueList[idx].attributeValue | capitalizeUserAddress()"></s-input>
                      <s-input
                        v-else-if="item.colnumName==='身份证号码' && item.htmlType==='udf_char_single_line'" disabled
                        :value="serviceRequestForm.valueList[idx].attributeValue | capitalizeIdCard()">
                      </s-input>
                      <s-input
                        v-else-if="item.colnumName==='微信号' && item.htmlType==='udf_char_single_line'" disabled
                        :value="serviceRequestForm.valueList[idx].attributeValue | capitalizeWechat()">
                      </s-input>
                      <s-input
                        v-else-if="(item.colnumName!=='个人地址' && item.htmlType==='udf_char_single_line')
                         || (item.colnumName!=='身份证号码' && item.htmlType==='udf_char_single_line')
                         || (item.colnumName!=='微信号' && item.htmlType==='udf_char_single_line')" disabled
                        v-model="serviceRequestForm.valueList[idx].attributeValue">
                      </s-input>
                      <!--数值-->
                      <s-input
                        v-if="item.colnumName==='手机号码' && item.htmlType==='udf_long'" disabled
                        :value="serviceRequestForm.valueList[idx].attributeValue | capitalize()">
                      </s-input>
                      <s-input
                        v-else-if="item.colnumName!=='手机号码' && item.htmlType==='udf_long'" disabled
                        v-model="serviceRequestForm.valueList[idx].attributeValue">
                      </s-input>
                      <!--下拉选项-->
                      <s-select
                        placeholder="请选择" style="width:100%;" disabled
                        v-model="serviceRequestForm.valueList[idx].attributeValue" v-if="item.htmlType==='udf_char_list'">
                        <s-option
                          v-for="(option, idx) in item.listvalues"
                          :label="option.listvalues" :value="option.listvalues" :key="idx"></s-option>
                      </s-select>
                      <!--时间日期-->
                      <s-date-picker
                        type="datetime" placeholder="选择日期时间" style="width: 100%;" disabled
                        v-model="serviceRequestForm.valueList[idx].attributeValue" v-if="item.htmlType==='udf_date'"></s-date-picker>
                    </s-form-item>
                  </s-form>
                </s-tab-pane>
              </s-tab>
            </s-col>
          </s-row>
        </s-scrollbar>
      </div>
      <s-row style="text-align: center; margin-top: 5px; margin-bottom: 0;">
        <!--完成后不可编辑-->
        <s-button @click="saveOrder" :disabled="userDisable || inactive || form.incidentStatus >= 4">保存</s-button>
        <s-button @click="receiveOrder" :disabled="userDisable || form.incidentStatus!==1">接单</s-button>
        <s-button @click="finishOrder" :disabled="userDisable || form.incidentStatus!==3">完成</s-button>
        <s-button @click="closeOrder" :disabled="userDisable || rolePro<2 || form.incidentStatus!==4">关单</s-button>
      </s-row>
    </div>

    <!--事件详情打印预览-->
    <s-dialog
      title="事件详情打印预览" top="10%" width="600px"
      id="printEventDetailDialog"
      ref="printEventDetailDialog"
      v-if="printEventDetailDialog"
      v-model="printEventDetailDialog">
      <s-scrollbar wrap-style="max-height: 450px;">
        <print-event-dialog ref="preLookPrintTask" :uuid="orderUuid"></print-event-dialog>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="printEventDetail">打印</s-button>
      </template>
    </s-dialog>
    <s-dialog
      title="添加工作信息" top="10%" width="600px"
      v-if="addWorkinfoFlag"
      v-model="addWorkinfoFlag">
      <s-form :model="workForm" :rules="wordRules" ref="workForm" label-width="120px">
        <s-form-item label="工作信息" prop="logDetail">
          <s-input type="textarea" :rows="3" v-model="workForm.logDetail"></s-input>
        </s-form-item>
        <s-form-item label="附件信息">
          <s-upload class="upload" ref="upload" :action="baseUrl +'/fileUpload/uploadItilattach'" multiple :before-upload="beforeUpload" :on-success="uploadSuccess" :on-error="uploadError" :on-remove="uploadRemove" :with-credentials="true" :disabled="inactive">
            <s-button slot="trigger" icon="export" :disabled="inactive">上传</s-button>
          </s-upload>
        </s-form-item>
      </s-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addWorkInfo" :disabled="inactive">添加</s-button>
      </template>
    </s-dialog>
    <div style="position: absolute; top: -9999px;">
      <print-event-dialog ref="storePrintEventData" :uuid="orderUuid"></print-event-dialog>
      <iframe frameborder="0" scrolling="no" ref="printEventIframe" id="printEventIframe"></iframe>
    </div>

    <assign-dialog v-if="assignDialogFlag" v-model="assignDialogFlag" :type="assignType" :companyUuid="form.companyUuid" @finish="reload">
    </assign-dialog>

    <urge-dialog v-if="urgeDialogFlag" v-model="urgeDialogFlag" @reload="reload(false, 3)"></urge-dialog>

    <cancel-dialog v-if="cancelDialogFlag" v-model="cancelDialogFlag" @finish="reload"></cancel-dialog>

    <pending-dialog v-if="pendingDialogFlag" v-model="pendingDialogFlag" @finish="reload"></pending-dialog>

    <close-dialog v-if="closeDialogFlag" v-model="closeDialogFlag" @finish="reload"></close-dialog>

    <detail-upload-dialog v-if="uploadDialogFlag" v-model="uploadDialogFlag" @finish="reload">
    </detail-upload-dialog>

    <s-dialog v-model="createAssociationRelationshipDialog" v-if="createAssociationRelationshipDialog" title="创建关联关系" width="1000px">
      <s-scrollbar wrap-style="height: 600px;">
        <create-association-relationship :uuid="orderUuid">
        </create-association-relationship>
      </s-scrollbar>
    </s-dialog>

    <work-detail-dialog v-if="workDetailDialogFlag" v-model="workDetailDialogFlag" :work-info="curWorkInfo">
    </work-detail-dialog>

    <!--创建知识库弹框-->
    <s-dialog v-model="knowDialog" v-if="knowDialog" width="700px" class="createKnow" title="创建知识库">
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
import detailMixin from './EventDetailMixin';
import createAssociationRelationship from '../Process_Components/CreateAssociationRelationship'
import DetailUploadDialog from './DetailDialog/DetailUploadDialog.vue';
import AssignDialog from './DetailDialog/AssignDialog.vue';
import UrgeDialog from './DetailDialog/UrgeDialog.vue';
import CancelDialog from './DetailDialog/CancelDialog.vue';
import PendingDialog from './DetailDialog/PendingDialog.vue';
import CloseDialog from './DetailDialog/CloseDialog.vue';
import {NameCardHover} from '@/components/nameCard/NameCard';
import WorkDetailDialog from './DetailDialog/WorkDetailDialog.vue';
import PrintEventDialog from './DetailDialog/PrintEventDialog.vue';
import createKnow from '@/home/ProcessCenter/ProcessCreatOrder/KnowDialog';
import {Validaters} from 'sunflower-common-utils';
import processRoleMixin from '@/home/ProcessCenter/processRoleMixin.js'

export default {
  mixins: [processRoleMixin, detailMixin],
  data() {
    return {
      serviceRequestUuid: '',
      assignUser: '',
      addWorkinfoFlag: false,
      baseUrl: $axios.basePath(),
      currentStep: 0,
      orderType: '0', // 工单类型：事件 0; 问题 1; 变更 2;任务 3;
      activeTab: 0,
      uploadDialogFlag: false,
      assignDialogFlag: false, // 指派给我、指派给他人弹框
      urgeDialogFlag: false, // 催办弹框
      printEventDetailDialog: false,       // 打印事件详情预览弹框
      cancelDialogFlag: false,
      pendingDialogFlag: false,
      createAssociationRelationshipDialog: false,
      closeDialogFlag: false,
      workDetailDialogFlag: false,
      knowDialog: false,      // 创建知识库工单弹框
      assignType: '我',
      serviceRequestForm: {
        valueList: []             // 当前服务请求设计器生成的表单数据列表
      },
      serviceRequestDetail: [],   // 当前服务请求的定义详情
      detailForm: {
        incidentStatus: 0,
        solutioninfo: '',
        closeCode: '',
        pendens: '',
        cancleReason: ''
      },
      originForm: {},
      data: {
        concernUuid: '',
        templateName: ''
      },
      workForm: {
        logDetail: ''
      },
      workInfo: [],
      curWorkInfo: {},
      relateRelation: [],
      dateForm: {
        createUserName: null,
        createTime: null,
        expectTime: null,
        acceptTime: null,
        assignTime: null,
        pendingTime: null,
        pendesRecover: null,
        finishTime: null,
        closeTime: null,
        cancelTime: null
      },
      urgeList: [],
      fileList: [],
      urgeTypeMap: {
        '2': '邮件',
        '3': '短信',
        '23': '邮件、短信',
        '32': '邮件、短信'
      },
      wordRules: {
        logDetail: [Validaters.Max(500)]
      },
      // 以下两个是sla部分的变量
      slaStatus: {
        responseTime: null,
        solveTime: null,
        responseStatus: null,
        solveStatus: null
      }
    }
  },
  computed: {
    type() {
      let path = this.$route.path;
      return path.slice(path.lastIndexOf('/') + 1);
    },
    orderUuid() {
      return this.$route.params.orderUuid;
    },
    rolePro() {
      return this.$store.state.processCenter.rolePro.incident;
    },
    roleProService() {
      return this.$store.state.processCenter.rolePro.serviceArr;
    },
    inactive() { // 工单待决或已关闭或者已取消，待决相当于暂停
      return this.form.incidentStatus === 2 || this.form.incidentStatus === 5 || this.form.incidentStatus === 6;
    },
    userDisable() {
      if (this.rolePro === 1 && this.$store.state.userData.uuid === this.assignUser) {
        return false;
      } else if ((this.rolePro === 2 || this.roleProService.includes(2)) && this.data.isHandle) { // 服务台只能处理同一支持组的工单，isHandle 为 1 表示在同一组
        return false;
      } else if (this.rolePro === 3) { // 事件经理可以处理所有的工单
        return false;
      }
      return true;
    }
  },
  filters: {
    capitalize: (value, flag) => {
      if (!value) return ''
      if (value.length > 3 && !flag) {
        return value.substring(0, 3) + '****' + value.substring((value.length - 4), value.length)
      } else {
        return value
      }
    },
    capitalizeUserAddress: (value) => {
      if (!value) return ''
      if (value.length > 0) {
        return value.substring(0, 1) + '******'
      } else {
        return value
      }
    },
    capitalizeIdCard: (value) => {
      if (!value) return ''
      if (value.length > 0) {
        return value.substring(0, 1) + '****************' + value.substring(17, 18)
      } else {
        return value
      }
    },
    capitalizeWechat: (value) => {
      if (!value) return ''
      if (value.length > 0) {
        return value.substring(0, 1) + '******'
      } else {
        return value
      }
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
    this.form = Object.assign({}, this.form, this.detailForm);
    // 获取下拉框
    this.axiosOptions();
    // 请求一级分类
    this.axiosCategoryFirst();
    this.axiosEndUser();
    // 获取详情数据
    this.axiosOrderDetail().then(() => {
      if (this.serviceRequestUuid) {
        this.getServiceRequestAttr()
      }
    })
    this.axiosTabData();
    this.axiosSlaStatus();
  },
  methods: {
    addWorkInfoDialog() {
      this.addWorkinfoFlag = true
    },
    axiosSlaStatus() {
      $axios.get(`/itilSla/incidentOrRequestOrderDetails/${this.orderUuid}`).then(({data}) => {
        for (let key in this.slaStatus) {
          if (key === 'responseTime' || key === 'solveTime') {
            if (!data[key]) {
              this.slaStatus[key] = '无'
            } else {
              this.slaStatus[key] = this.dateFormat(data[key]);
            }
          } else {
            this.slaStatus[key] = data[key];
          }
        }
      })
    },
    axiosCategoryFirst() {
      let param = {
        ownerType: 0
      }
      $axios.post('/ItilCommonWorkflow/getItilCategorySelect', param).then(({data}) => {
        this.topCategory = data;
      })
    },
    axiosCategorySecond(msg) {
      let param = {};
      param.categoryFirst = msg.categoryFirst;
      param.ownerType = 0;
      $axios.post('/ItilCommonWorkflow/getItilCategorySelect', param).then(({data}) => {
        this.secondary = data;
      });
    },
    axiosCategoryThird(msg) {
      let param = {};
      param.categoryFirst = msg.categoryFirst;
      param.categorySecond = msg.categorySecond;
      param.ownerType = 0;
      $axios.post('/ItilCommonWorkflow/getItilCategorySelect', param).then(({data}) => {
        this.thirdary = data;
      })
    },
    axiosOrderDetail() { // 获取工单详情
      return $axios.get(`/itilIncidentCenter/getItilIncidentOrderByUuid/${this.orderUuid}`).then(({data}) => {
        let obj = {};
        for (let i in data) {
          if (this.form.hasOwnProperty(i)) {
            this.form[i] = data[i]
          } else if (this.dateForm.hasOwnProperty(i)) {
            this.dateForm[i] = data[i]
          }
          obj[i] = data[i]
        }
        this.originForm = Object.assign({}, this.form);
        this.data = obj;
        this.assignUser = this.form.assignUser;
        this.serviceRequestUuid = obj.desiUuid
        this.form.assignUserName = data.assignUserName;
        this.axiosCategorySecond(this.form);
        this.axiosCategoryThird(this.form);
        $axios.get(`/itilIncidentCenter/getGroup/${this.form.companyUuid}`).then(({data}) => {
          this.groupList = data;
        })
        this.axiosUser();
      })
    },
    axiosTabData() { // 获取右侧选项卡对应数据
      switch (this.activeTab) {
        case 0:
          this.axiosWorkInfo(); break;
        case 1:
          this.axiosRelateRelation(); break;
        case 3:
          this.axiosUrgeList(); break;
        case 4:
          this.getServiceRequestAttr()
      }
    },
    axiosWorkInfo() { // 获取工作信息
      $axios.get(`/ItilCommonWorkflow/getOrderLogByOrderUuid/${this.orderUuid}`).then(({data}) => {
        this.workInfo = data;
      });
    },
    axiosRelateRelation() { // 获取关联关系
      let relateMap = {
        'incident': '事件',
        'problem': '问题',
        'change': '变更',
        'knowledge': '知识',
        'publish': '发布',
        'request': '服务请求'
      };
      $axios.get(`/ItilCommonWorkflow/getRelationOrderlist/${this.orderUuid}`).then(({data}) => {
        let arr = [];
        for (let i in data) {
          if (i !== 'changeTaskList') {
            let key = i.slice(0, i.indexOf('OrderList'));
            let temArr = data[i] || [];
            temArr.forEach(item => {
              item.orderTypeStr = relateMap[key];
              item.status = item[key + 'StatusName']
              arr.push(item)
            })
          }
        }
        this.relateRelation = arr;
      })
    },
    axiosUrgeList() { // 获取催办列表
      $axios.get(`/itilIncidentCenter/getPressLogByOrderUuid/${this.orderUuid}`).then(({data}) => {
        this.urgeList = data;
      })
    },
    reload(detailFlag = true, reloadTab = 0) {
      if (detailFlag) {
        this.axiosOrderDetail();
      }
      if (this.activeTab === reloadTab) {
        this.axiosTabData();
      }
    },
    // 左侧通用功能----------------------------------------------------------------------
    attention() {
      if (!this.data.concernUuid) {
        $axios.get(`/ItilCommonWorkflow/concernIncidentOrder/${this.orderUuid}/${this.orderType}`).then(({data}) => {
          if (data) {
            this.data.concernUuid = data;
            this.$message({type: 'success', message: '关注成功!'});
          } else {
            this.$message({type: 'error', message: '关注失败!'});
          }
        })
      } else {
        $axios.get(`/ItilCommonWorkflow/cancelIncidentOrder/${this.data.concernUuid}`).then(({data}) => {
          if (data.state) {
            this.data.concernUuid = '';
          }
          this.$message({type: data.state ? 'success' : 'error', message: data.errormsg});
        })
      }
    },
    assignToMe() {
      this.assignType = '我';
      this.assignDialogFlag = true;
    },
    assignToOther() {
      this.assignType = '他人';
      this.assignDialogFlag = true;
    },
    urge() {
      this.urgeDialogFlag = true;
    },
    cancel() {
      this.cancelDialogFlag = true;
    },
    pengding() {
      if (this.form.incidentStatus !== 2) {
        this.pendingDialogFlag = true;
      } else {
        $axios.get(`/itilIncidentCenter/incidentOrderRecovery/${this.orderUuid}`).then(({data}) => {
          this.$message({type: data.state ? 'success' : 'error', message: data.errormsg});
          if (data.state) {
            this.reload();
          }
        })
      }
    },
    createAssociationRelationship() {
      this.createAssociationRelationshipDialog = true
    },
    // 知识库搜索，知识引用
    searchKnowledge() {
      // window.open(`#/ProcessCenter/searchKnowledge?orderUuid=${this.orderUuid}&orderType=0`);
      // window.open(`#/ProcessCenter/searchKnowledge/${this.orderUuid}`);
      this.$router.push({path: '/ProcessCenter/knowledgeLibrary', query: {orderUuid: this.orderUuid}});
    },
    // 创建知识库
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
            this.reload();    // 刷新详情页
          }
        })
      })
    },
    showUploadDialog() {
      this.uploadDialogFlag = true;
    },
    // 打开打印事件详情弹框
    showPrintDialog() {
      this.printEventDetailDialog = true
      let theme = document.querySelector('#sunflower-theme').href
      this.$refs.printEventIframe.contentWindow.document.head.innerHTML = `
          <link rel="stylesheet" href="${theme}"></link>
          <link rel="stylesheet" href="../../../static/css/index.css"></link>`
      this.$refs.printEventIframe.contentWindow.document.body.appendChild(this.$refs.storePrintEventData.$el)
    },
    printEventDetail() {
      this.$refs.printEventIframe.contentWindow.print()
    },
    getServiceRequestAttr() {
      $axios.get(`/itilServiceRequest/getattrAndValues/${this.serviceRequestUuid}/${this.orderUuid}`).then(({data}) => {
        this.serviceRequestDetail = []
        for (let key in data) {
          this.serviceRequestDetail.push(data[key])
        }
        this.serviceRequestForm.valueList = this.serviceRequestDetail.map(item => {
          return {attributeValue: item.defaultValue, attributeUuid: item.uuid}
        });
      });
    },
    // 工作详细信息相关-------------------------------------------------------------------------
    rowShowWork(row) {
      this.curWorkInfo = row;
      this.workDetailDialogFlag = true;
    },
    rowDisconnect(row) { // 关联列表下取消关联
      /*   if (this.userDisable || this.inactive) {
           this.$message({type: 'warning', message: '此角色没有操作权限!'})
           return false;
         } */
      this.$confirm('确定取消关联所选工单?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
        $axios.post('/ItilCommonWorkflow/cancelRelationOrder', [row.relationOrderUuid]).then(({data}) => {
          if (data.state) {
            this.$message.success('取消关联成功')
            this.reload(false, 1)
          } else {
            this.$message.error('取消关联失败')
          }
        })
      }).catch(() => {});
    },
    addWorkInfo() {
      if (!this.workForm.logDetail && this.fileList.length === 0) {
        this.$message({type: 'warning', message: '缺少信息，请填写！'});
        return;
      }
      this.$refs.workForm.validate(valid => {
        if (!valid) {
          return
        }
        let param = {
          relationOrderUuid: this.orderUuid,
          orderType: 0,
          attachments: this.fileList.map(item => item.response.attachuuid).join(','),
          ...this.workForm
        };
        $axios.post(`/ItilCommonWorkflow/saveOrderLog`, param).then(({data}) => {
          if (data.state) {
            this.$message({type: 'success', message: '添加成功！'});
            this.reload(false, 0)
            this.workForm.logDetail = '';
            this.fileList = [];
            this.$refs.upload.clearFiles();
            this.addWorkinfoFlag = false
          } else {
            this.$message({type: 'error', message: '添加失败！'});
          }
        });
      })
    },
    // 底部操作按钮--------------------------------------------------------
    saveOrder() {
      let flag = true;
      for (let i in this.originForm) {
        if (this.form[i] !== this.originForm[i]) {
          flag = false;
        }
      }
      if (flag) {
        this.$message({type: 'warning', message: '您未修改数据!'});
        return;
      }
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.$message({type: 'warning', message: '请检查您的表单填写!'});
          return;
        }
        let param = Object.assign({
          uuid: this.orderUuid,
          itilAttachment: this.fileList
        }, this.form);
        $axios.post(`/itilIncidentCenter/updateIncidentOrder`, param).then(({data}) => {
          this.$message({type: data.state ? 'success' : 'error', message: data.errormsg});
          if (data.state) {
            this.reload();
          }
        });
      })
    },
    receiveOrder() {
      $axios.get(`/itilIncidentCenter/OrderTalking/${this.orderUuid}`).then(({data}) => {
        this.$message({type: data.state ? 'success' : 'error', message: data.errormsg});
        if (data.state) {
          this.reload();
        }
      })
    },
    finishOrder() {
      this.$set(this.rules, 'solutioninfo', [Validaters.NotNull]);
      this.$refs.form.validateField('solutioninfo', validMsg => {
        if (validMsg) {
          this.$message({type: 'warning', message: '请填写解决方案!'});
          return;
        }
        let param = {
          incidentOrderUuid: this.orderUuid,
          solutioninfo: this.form.solutioninfo
        }
        $axios.post(`/itilIncidentCenter/incidentOrderFinish`, param).then(({data}) => {
          this.$message({type: data.state ? 'success' : 'error', message: data.errormsg});
          if (data.state) {
            this.reload();
          }
        })
      })
    },
    closeOrder() {
      this.closeDialogFlag = true;
    },
    // 查看事件单流程图
    openEventFlowchart() {
      this.$router.push(`/ProcessCenter/eventFlowchart/${this.form.serialCode}/${this.orderUuid}`)
    },
    gotoEvent(row) {
      let orderUrl = 'eventDetail';
      if (row.orderTypeStr === '问题') {
        orderUrl = 'problemDetail';
      } else if (row.orderTypeStr === '变更') {
        orderUrl = 'modifyDetail';
      } else if (row.orderTypeStr === '知识') {
        orderUrl = 'knowDetail';
      } else if (row.orderTypeStr === '发布') {
        orderUrl = 'publishDetail';
      } else if (row.orderTypeStr === '服务请求') {
        orderUrl = 'requestServiceDetail';
      } else if (row.orderTypeStr === '事件') {
        orderUrl = 'eventDetail';
      } else if (row.orderTypeStr === '任务') {
        orderUrl = 'taskOrderDetail';
      } else if (row.orderTypeStr === '问题') {
        orderUrl = 'problemDetail';
      }
      let temUrl = location.href.replace('eventDetail', orderUrl);
      window.open(temUrl.slice(0, temUrl.lastIndexOf('/') + 1) + row.uuid);
    },
    // 工具方法----------------------------------
    getUrgeStateIcon(i, row) {
      let type = row.allType.split('')[i - 1];
      let state = row.allSendStatus.split('')[i - 1];
      let iconName = '';
      let iconState = '';
      let iconStateColor = '';
      if (type === '2') {
        iconName = 'email';
      } else if (type === '3') {
        iconName = 'sms';
      }
      if (state === '1') {
        iconState = 'success';
        iconStateColor = 'success-state';
      } else if (state === '0') {
        iconState = 'failed';
        iconStateColor = 'failed-state';
      }
      return `icon-${iconName}-${iconState} ${iconStateColor}`;
    },
    dateFormat(timeStamp, format) {
      const date = new Date(parseInt(timeStamp) * 1000)
      let fmt = format || 'yyyy-MM-dd hh:mm:ss'
      const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length))
      for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)))
      }
      return fmt
    }
  },
  watch: {
    activeTab() {
      this.axiosTabData();
    },
    'form.incidentStatus': {
      deep: true,
      handler(val) {
        switch (val) { // 由状态决定步骤
          case 0: this.currentStep = 0; break; // 新建
          case 1: this.currentStep = 1; break; // 已指派
          case 2: break; // 待决
          case 3: this.currentStep = 2; break; // 进行中
          case 4: this.currentStep = 3; break; // 已解决
          case 5: this.currentStep = 4; break; // 已关闭
          case 6: this.currentStep = 4; break; // 已取消
        }
      }
    },
    createAssociationRelationshipDialog(val) {
      if (!val) {
        this.reload(false, 1)
      }
    }
  },
  components: {
    // DateRange,
    AssignDialog,
    UrgeDialog,
    CancelDialog,
    PendingDialog,
    createAssociationRelationship,
    DetailUploadDialog,
    CloseDialog,
    NameCardHover,
    WorkDetailDialog,
    createKnow,
    PrintEventDialog
  }
}
</script>

<style lang="stylus">
.processEventDetail {
  /* .leftMenu */
  /* padding-bottom: 50px; */
  /* .s-button */
  /* width: 90% */
  .leftSla {
    font-size: 14px;
    margin: 10px 0;
  }

  .tag {
    margin-left: 10px;
    display: inline-block;
    font-size: 12px;
    padding: 5px 8px;
    color: #fff;
    border-radius: 2px;
    line-height: 13px;
  }

  .tag-ing {
    background-color: #89ceff;
  }

  .tag-error {
    background-color: #ff6357;
  }

  .tag-sucess {
    background-color: #7fd071;
  }

  .tag-warning {
    background-color: #fecb19;
  }

  .tag-disabled {
    background-color: #bbbdc9;
  }
}

.clickLink {
  text-decoration: underline;
  cursor: pointer;
}

.s-form-item-content {
  & > .s-input, .s-select, .s-textarea, .upload {
    width: 100%;
  }
}

#systemDate {
  .grid-content {
    font-size: 14px;
    margin-bottom: 10px;
  }
}
</style>
