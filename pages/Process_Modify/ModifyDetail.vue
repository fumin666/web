<template>
  <div class="processDetail processModifyDetail" style="display: flex;">
    <div style="width: 175px; margin-right: 20px">
      <div class="process-detail-title">
        <span class="process-detail-text">变更管理</span>
      </div>
      <div class="leftMenu">
        <div class="title">-- 功能菜单 --</div>
        <s-button @click="attention" class="attention" v-if="orderForm.isConcern===0">关注</s-button>
        <s-button @click="cancelAttention" class="attention attention-empty" v-if="orderForm.isConcern===1">取消关注</s-button>
        <s-button @click="assignToMe"  icon="click" :disabled="allDisabled && assignMeDisabled">指派给我</s-button>
        <s-button @click="assignToOthers" icon="assist" :disabled="allDisabled">指派给他人</s-button>
        <s-button @click="goBack" icon="back-square" :disabled="allDisabled && backDisabled">回退</s-button>
        <s-button @click="waitDecideBack" icon="retreat" v-if="orderForm.changeStatus===7" :disabled="allDisabled && retreatDisabled">待决恢复</s-button>
        <s-button @click="waitDecide" icon="underway" v-else :disabled= "allDisabled">待决</s-button>
        <s-button @click="cancelHandle" icon="cancel" :disabled="allDisabled">取消</s-button>
        <s-button @click="createAssociation" icon="bangding">创建关联关系</s-button>
        <s-button @click="openModifyFlowchart" icon="manage-process">流程图</s-button>
        <s-button @click="changeSchedule" icon="flag" :disabled="allDisabled && scheduleDisabled">变更排期
        </s-button>
        <s-button @click="createTaskHandle" icon="order-add" :disabled="allDisabled && createTaskDisabled">
          创建任务单
        </s-button>
        <s-button @click="showCalendar" icon="log">变更日历</s-button>
        <s-button @click="showPrintDialog" icon="printer">打印</s-button>
        <s-button @click="showUploadDialog" icon="export">附件上传</s-button>
        <s-button @click="showModifyConflict" icon="export">变更冲突检测</s-button>
      </div>
    </div>
    <div style="flex: 1;">
      <s-steps :current="currentStep" finish-status="success" step-width="calc(20% - 23px)" style="margin-left: 15px">
        <s-step title="启动"></s-step>
        <s-step title="复核与确认"></s-step>
        <s-step title="计划与安排"></s-step>
        <s-step title="执行"></s-step>
        <s-step title="关闭"></s-step>
      </s-steps>
      <div style="margin-top: 20px">
        <s-scrollbar wrap-style="max-height: calc(100vh - 215px);">
          <s-row :gutter="20" style="margin: 0 0 0 0">
            <s-col span="10" style="padding:0 9px 0 10px;border-right: 1px dashed rgba(0, 0, 0, 0.1);">
              <s-form :model="orderForm" :rules="orderRules" ref="orderForm" label-width="120px">
                <s-form-item label="变更编号" prop="">
                  <s-input v-model="orderForm.serialCode" disabled></s-input>
                </s-form-item>
                <s-form-item label="变更模板" prop="">
                  <s-input v-model="orderForm.templateName" disabled></s-input>
                </s-form-item>
                <s-form-item label="简要描述" prop="briefDesc">
                  <s-input v-model="orderForm.briefDesc" type="textarea" :rows="3" :disabled="formDisabled && allDisabled"></s-input>
                </s-form-item>
                <s-form-item label="详细描述" prop="">
                  <s-input v-model="orderForm.detailDesc" type="textarea" :rows="3" :disabled="formDisabled && allDisabled"></s-input>
                </s-form-item>
                <s-form-item label="分类一级" prop="">
                  <s-select v-model="orderForm.categoryFirst"
                            :anonLabel="orderForm.categoryFirstName"
                            style="width: 100%" :disabled="formDisabled && allDisabled">
                    <s-option v-for="item in categoryFirstList" :label="item.categoryName" :value="item.uuid"
                              :key="item.uuid"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="分类二级" prop="">
                  <s-select v-model="orderForm.categorySecond"
                            :anonLabel="orderForm.categorySecondName"
                            style="width: 100%" :disabled="formDisabled && allDisabled">
                    <s-option v-for="item in categorySecondList" :label="item.categoryName" :value="item.uuid"
                              :key="item.uuid"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="分类三级" prop="">
                  <s-select v-model="orderForm.categoryThird"
                            :anonLabel="orderForm.categoryThirdName"
                            clearable
                            style="width: 100%" :disabled="formDisabled && allDisabled">
                    <s-option v-for="item in categoryThirdList" :label="item.categoryName" :value="item.uuid"
                              :key="item.uuid"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="风险等级" prop="">
                  <s-select v-model="orderForm.riskLevel" disabled style="width: 100%">
                    <s-option v-for="(value, key, index) in orderForm.changeRiskLevelMap" :label="value"
                              :value="parseInt(key)" :key="index"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="变更路径" prop="">
                  <s-select v-model="orderForm.changePath" disabled style="width: 100%">
                    <s-option v-for="(value, key, index) in orderForm.changePathMap" :label="value"
                              :value="parseInt(key)" :key="key"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="变更动作" prop="">
                  <s-select v-model="orderForm.changeAction" style="width: 100%" :disabled="formDisabled && allDisabled">
                    <s-option v-for="(value, key, index) in orderForm.changeActionMap" :label="value"
                              :value="parseInt(key)" :key="key"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="变更环境" prop="">
                  <s-select v-model="orderForm.changeEnvironment" style="width: 100%" :disabled="formDisabled && allDisabled">
                    <s-option v-for="(value, key, index) in orderForm.changeEnvironmentMap" :label="value"
                              :value="parseInt(key)" :key="key"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="受影响单位" prop="">
                  <s-select v-model="orderForm.effectOrgnizition"
                            clearable
                            style="width: 100%" :disabled="formDisabled && allDisabled">
                    <s-option v-for="item in orderForm.companyAndOrganizationList" :label="item.departName"
                              :value="item.uuid" :key="item.uuid"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="变更经理组" prop="">
                  <s-select v-model="orderForm.managerGroup"
                            :anonLabel="orderForm.managerGroupName"
                            clearable
                            style="width: 100%" :disabled="formDisabled && allDisabled">
                    <s-option v-for="item in managerGroupList" :label="item.groupName" :value="item.uuid"
                              :key="item.uuid"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="变更经理" prop="">
                  <NameCardHover :useruuid="orderForm.managerUser" :placement="'right'">
                    <s-select v-model="orderForm.managerUser"
                              :anonLabel="orderForm.managerUserName"
                              clearable
                              @focus="getAllChangeMangerUserByGroup"
                              style="width: 100%" :disabled="formDisabled && allDisabled">
                    <s-option v-for="item in managerUserList" :label="item.userRealName" :value="item.uuid"
                              :key="item.uuid"></s-option>
                    </s-select>
                  </NameCardHover>
                </s-form-item>
                <s-form-item label="变更管理员组" prop="">
                  <s-select v-model="orderForm.adminGroup"
                            :anonLabel="orderForm.adminGroupName"
                            clearable
                            style="width: 100%" :disabled="formDisabled || allDisabled">
                    <s-option v-for="item in adminGroupList" :label="item.groupName" :value="item.uuid"
                              :key="item.uuid"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="变更管理员" prop="">
                  <NameCardHover :useruuid="orderForm.adminUser" :placement="'right'">
                    <s-select v-model="orderForm.adminUser"
                              :anonLabel="orderForm.adminUserName"
                              clearable
                              @focus="getAllChangeAdminUser"
                              style="width: 100%" :disabled="formDisabled || allDisabled">
                      <s-option v-for="item in adminUserList" :label="item.userRealName" :value="item.uuid"
                                :key="item.uuid"></s-option>
                    </s-select>
                  </NameCardHover>
                </s-form-item>
                <s-form-item label="状态" prop="">
                  <s-select v-model="orderForm.changeStatus" disabled style="width: 100%">
                    <s-option :label="orderForm.changeStatusName" :value="orderForm.changeStatus"
                              :key="orderForm.changeStatus"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="复核意见" prop="checkBill">
                  <s-input v-model="orderForm.checkBill" autofocus type="textarea" :rows="3" :disabled="formDisabled && allDisabled"></s-input>
                </s-form-item>
                <s-form-item label="关闭代码" prop="">
                  <s-select v-model="orderForm.closeCode" disabled style="width: 100%">
                    <s-option v-for="(value, key, index) in orderForm.changeCloseCodeMap" :label="value"
                              :value="parseInt(key)" :key="key"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="待决原因" prop="">
                  <s-select v-model="orderForm.pendingReason" disabled style="width: 100%">
                    <s-option v-for="(value, key, index) in orderForm.changePendingReasonMap" :label="value"
                              :value="parseInt(key)" :key="key"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="回退原因" prop="">
                  <s-input v-model="orderForm.rollbackReason" type="textarea" :rows="3" disabled></s-input>
                </s-form-item>
                <s-form-item label="取消原因" prop="">
                  <s-input v-model="orderForm.cancelReason" type="textarea" :rows="3" disabled></s-input>
                </s-form-item>
                <s-form-item label="拒绝原因" prop="">
                  <s-input v-model="orderForm.refuseReason" type="textarea" :rows="3" disabled></s-input>
                </s-form-item>
              </s-form>
            </s-col>
            <s-col span="14" id="modifyDetailRight">
              <s-tab v-model="activeTab" @tab-click="handleClick">
                <s-tab-pane name="0" label="工作详细信息">
                  <s-button icon="plus" @click="addWorkInfoDialog" style="margin-bottom: 10px;">添加工作信息</s-button>
                  <s-table-page :data="workInfoData">
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
                    :data="associationData">
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
                      <s-col :span="5" class="grid-content bg-purple">计划开始时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.planStartTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">计划结束时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.planEndTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">实际开始时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.startTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">实际结束时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.endTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">待决时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.pendingTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">待决恢复时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.pendingRefuseTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">完成时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.finishTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">关闭时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.closeTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">取消时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.cancelTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">拒绝时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.refuseTime }} </s-col>
                    </s-row>
                  </div>
                </s-tab-pane>
                <s-tab-pane name="3" label="任务">
                  <s-table-page
                    ref="taskTable"
                    :data=taskData>
                    <s-table-column prop="taskSort" width="90px" label="执行顺序" show-overflow-tooltip>
                    </s-table-column>
                    <s-table-column prop="serialCode" label="任务id" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span class="clickLink" v-text="scope.row.serialCode"
                              @click="goToTaskOrderDetail(scope.row.uuid)"></span>
                      </template>
                    </s-table-column>
                    <s-table-column prop="title" label="任务标题" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span class="clickLink" v-text="scope.row.title"
                              @click="goToTaskOrderDetail(scope.row.uuid)"></span>
                      </template>
                    </s-table-column>
                    <s-table-column prop="createUserName" label="创建人" show-overflow-tooltip>
                    </s-table-column>
                    <s-table-column prop="taskStatusName" label="任务状态" show-overflow-tooltip>
                    </s-table-column>
                    <s-table-column prop="createTime" label="创建时间" show-overflow-tooltip>
                    </s-table-column>
                    <s-table-column label="操作" width="200px">
                      <template slot-scope="scope">
                        <s-button
                          v-if="scope.row.taskAssignDisabled === true || scope.row.taskAssignDisabled === false"
                          size="mini"
                          @click="assignTaskOrder(scope.$index, scope.row)"
                          :disabled="scope.row.taskAssignDisabled">指派
                        </s-button>
                        <s-button
                          v-else
                          size="mini"
                          @click="assignTaskOrder(scope.$index, scope.row)"
                          :disabled="taskAssignDisabled">指派
                        </s-button>
                        <s-button
                          v-if="scope.row.taskCancleDisabled === true || scope.row.taskCancleDisabled === false"
                          size="mini"
                          @click="cancelTaskOrder(scope.$index, scope.row)"
                          :disabled="scope.row.taskCancleDisabled">取消
                        </s-button>
                        <s-button
                          v-else
                          size="mini"
                          @click="cancelTaskOrder(scope.$index, scope.row)"
                          :disabled="taskCancleDisabled">取消
                        </s-button>
                        <i
                          class="iconfont icon-update"
                          @click="sort(1, scope.row.uuid, scope.row.taskSort)"
                          :class="{ disabledIcon: allDisabled && taskIconDisabled}">
                        </i>
                        <i
                          class="iconfont icon-download"
                          @click="sort(0, scope.row.uuid, scope.row.taskSort)"
                          :class="{ disabledIcon: allDisabled && taskIconDisabled}">
                        </i>
                      </template>
                    </s-table-column>
                  </s-table-page>
                </s-tab-pane>
                <s-tab-pane name="4" label="请求内容" v-if="orderForm.desiUuid">
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
      <s-row style="text-align: center; margin-top: 5px; margin-bottom: 0; margin-left: -195px">
        <s-button @click="saveOrder" :disabled="allDisabled && saveDisabled">保存</s-button>
        <s-button @click="nextStep" :disabled="allDisabled && nextDisabled">下一阶段</s-button>
      </s-row>
    </div>

    <detail-upload-dialog v-if="uploadDialogFlag" v-model="uploadDialogFlag" @getWorkInfo="serachItilLog">
    </detail-upload-dialog>

    <!--变更模板-->
    <s-dialog
      title="变更模板"
      width="1000px"
      ref="templateDialog"
      v-if="templateDialog"
      v-model="templateDialog">
      <order-template></order-template>
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
    <!--变更风险问卷-->
    <s-dialog
      title="变更风险问卷"
      ref="riskQuestionDialog"
      v-if="riskQuestionDialog"
      v-model="riskQuestionDialog">
      <risk-question></risk-question>
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

    <!--回退-->
    <s-dialog
      title="回退"
      width="500px"
      ref="goBackDialog"
      v-if="goBackDialog"
      v-model="goBackDialog">
      <go-back :orderData="orderForm" @closeBack="closeGoBack"></go-back>
    </s-dialog>

    <!--待决-->
    <s-dialog
      title="待决"
      width="500px"
      ref="waitDecideDialog"
      v-if="waitDecideDialog"
      v-model="waitDecideDialog">
      <wait-decide :orderUuid="orderUuid" :changeStatus="orderForm.changeStatus"
                   @closeWaitDec="handelCloseWaitDec"></wait-decide>
    </s-dialog>

    <!--创建关联关系-->
    <s-dialog
      title="创建关联关系"
      width="900px"
      ref="createAssoDialog"
      v-if="createAssoDialog"
      v-model="createAssoDialog">
      <s-scrollbar wrap-style="max-height: 600px;">
        <create-asso :uuid="orderUuid" @closeAsso="createAssoDialog=false"></create-asso>
      </s-scrollbar>
    </s-dialog>

    <!--变更排期-->
    <s-dialog
      title="变更单排期"
      width="600px"
      ref="scheduleDialog"
      v-if="scheduleDialog"
      v-model="scheduleDialog">
      <change-schedule :orderUuid="orderUuid" @closeSchedule="closeScheduleDialog"></change-schedule>
    </s-dialog>

    <!--变更详情打印预览-->
    <s-dialog
      title="变更详情打印预览" top="10%" width="600px"
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
    <div style="position: absolute; top: -9999px;">
      <print-modify-task ref="storePrintModifyData" :uuid="orderUuid"></print-modify-task>
      <iframe frameborder="0" scrolling="no" ref="printTaskIframe" id="printTaskIframe"></iframe>
    </div>

    <!--变更冲突检测-->
    <s-dialog
      title="变更冲突检测"
      width="500px"
      ref="modifyConflictDialog"
      v-if="modifyConflictDialog"
      v-model="modifyConflictDialog">
      <modify-conflict :orderUuid="orderUuid"></modify-conflict>
    </s-dialog>

    <!--创建任务单-->
    <s-dialog
      v-model="createDialog"
      width="840px"
      title="创建任务单"
      v-if="createDialog">
      <create-task ref="createTask"></create-task>
      <template slot="footer" class="dialog-footer">
        <s-button @click="createTaskOk">确定</s-button>
        <s-button type="cancel" @click="createDialog=false">取消</s-button>
      </template>
    </s-dialog>

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

    <!--关闭代码-->
    <s-dialog
      v-if="closeDialogBloom"
      v-model="closeDialogBloom"
      title="关单">
      <close-dialog ref="closeCode" :changeCloseCodeMap="orderForm.changeCloseCodeMap"></close-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="closeOk">确定</s-button>
        <s-button type="cancel" @click="closeDialogBloom=false">取消</s-button>
      </template>
    </s-dialog>

    <!--右侧任务tab的指派-->
    <s-dialog
      title="任务单指派"
      width="500px"
      ref="assignTaskOrderDialog"
      v-if="assignTaskOrderDialog"
      v-model="assignTaskOrderDialog">
      <assign-task-order
        ref="assignTaskOrderForm"
        :taskOrderUuid="taskOrderUuid"
        :companyUuid="companyUuid"
        @closeAssignTaskOrder="closeAssignDialog"></assign-task-order>
    </s-dialog>

    <!--右侧任务tab的取消-->
    <s-dialog
      title="取消"
      v-if="cancelTaskOrderDialog"
      v-model="cancelTaskOrderDialog">
      <cancel ref="cancelTaskOrderForm"></cancel>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveCancelTaskOrder">确定</s-button>
        <s-button type="cancel" @click="cancelTaskOrderCancel">取消</s-button>
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
  </div>
</template>

<script>
  // import DateRange from '@/components/tableCom/src/DateRange';
  import orderTemplate from './DetailDialog/OrderTemplate.vue';
  import assignToMe from './DetailDialog/AssignToMe.vue';
  import assignToOthers from './DetailDialog/AssignToOthers.vue';
  import createAsso from '@/pages/Process_Components/CreateAssociationRelationship.vue';
  import modifyConflict from './DetailDialog/ModifyConflict.vue'
  import changeSchedule from './DetailDialog/ChangeSchedule.vue';
  import printModifyTask from './DetailDialog/PrintModifyTask.vue';
  import createTask from './DetailDialog/CreateTask.vue';
  import workInfoDetail from '../Process_Components/WorkInfoDetail.vue';
  import cancel from './DetailDialog/Cancel.vue';
  import goBack from './DetailDialog/GoBack.vue';
  import waitDecide from './DetailDialog/WaitDecide.vue';
  import riskQuestion from './DetailDialog/RiskQuestion.vue';
  import closeDialog from './DetailDialog/CloseDialog.vue';
  import $axios from 'sunflower-ajax';
  import detailMixin from './ModifyDetailMixin';
  import assignTaskOrder from './DetailDialog/AssignTaskOrder.vue';
  import {NameCardHover} from '@/components/nameCard/NameCard';

  export default {
    mixins: [detailMixin],
    data() {
      return {
        userUuid: this.$store.state.userData.uuid,
        serviceRequestUuid: '',
        currentStep: 0,
        activeTab: 0,
        orderForm: {  // 展示form
          serialCode: '',
          briefDesc: '',
          detailDesc: '',
          templateName: '',
          categoryFirst: '',
          categorySecond: '',
          categoryThird: '',
          riskLevel: '',
          changePath: '',
          changeAction: '',
          changeEnvironment: '',
          effectOrgnizition: '',
          managerGroup: '',
          managerUser: '',
          adminGroup: '',
          adminUser: '',
          changeStatus: '',
          rollbackReason: '',
          pendingReason: '',
          cancelReason: '',
          refuseReason: '',
          checkBill: '',
          closeCode: ''
        },
        submitOrderForm: {},  // 每次保存的orderForm
        serviceRequestForm: {
          valueList: []             // 当前服务请求设计器生成的表单数据列表
        },
        serviceRequestDetail: [],   // 当前服务请求的定义详情
        orderRules: {
          briefDesc: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
          ]
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
        adminGroupList: [],       // 变更管理员组
        adminUserList: [],        // 变更管理员用户
        managerGroupList: [],     // 变更经理组
        managerUserList: [],      // 变更经理用户
        workInfoData: [],         // 工作详细信息数据
        associationData: [],         // 右侧关联关系表格数据
        assignMeDisabled: true,   // 指派给我按钮是否禁用
        taskAssignDisabled: true,   // 任务tab的指派按钮是否禁用
        taskCancleDisabled: true,   // 任务tab的取消按钮是否禁用
        taskBtnFlag: false,   // 任务tab的按钮是否是否满足需要和任务单保持一致的状态
        taskIconDisabled: true,   // 任务tab的Icon是否禁用
        allDisabled: true,        // 全部按钮是否禁用
        formDisabled: true,       // 工单数据是否禁用
        saveDisabled: true,  // 保存按钮是否禁用
        nextDisabled: true,  // 下一阶段按钮是否禁用
        scheduleDisabled: true,   // 变更排期是否禁用
        createTaskDisabled: true, // 创建任务单是否禁用
        retreatDisabled: true, // 待决恢复是否禁用
        backDisabled: true, // 回退是否禁用
        riskQuestionDialog: false,          // 风险调查问卷弹框
        // 左侧功能菜单弹框
        templateDialog: false,              // 选择变更模板弹框
        assignToMeDialog: false,            // 指派给我弹框
        assignToOthersDialog: false,        // 指派给他人弹框
        goBackDialog: false,                // 回退弹框
        waitDecideDialog: false,            // 待决弹框
        createAssoDialog: false,            // 创建关联关系
        scheduleDialog: false,              // 变更排期弹框
        printTaskDetailDialog: false,       // 打印变更详情预览弹框
        modifyConflictDialog: false,        // 变更冲突检测
        printLoading: false,                // 打印变更详情预览弹框loading遮罩
        createDialog: false,                // 创建变更单弹框
        cancelDialog: false,                // 取消弹框
        closeDialogBloom: false,            // 关闭代码弹框
        workInfoDialog: false,              // 查看信息详情弹框
        orderUuid: this.$route.params.uuid,  // 路由跳转时获取工单的uuid
        assignTaskOrderDialog: false,       // 右侧任务的指派弹框
        taskOrderUuid: '',        // 右侧任务的uuid
        cancelTaskOrderDialog: false,        // 右侧任务的取消弹框
        iframeSRC: `#/PrintModifyTask?uuid=${this.$route.params.uuid}`,
        role: '',
        workInfoRow: {},       // 查看工作详细信息当前行的data
        inited: false,
        orderFormIsChange: false,   // orderForm表单内容是否改变，未改变保存不掉接口
        userGroups: false,   // 当前用户所有组
        ItilRole: [],
        addWorkinfoFlag: false
      }
    },
    components: {
      // DateRange,
      cancel,
      riskQuestion,
      createTask,
      orderTemplate,
      assignToMe,
      assignToOthers,
      goBack,
      waitDecide,
      createAsso,
      modifyConflict,
      changeSchedule,
      printModifyTask,
      closeDialog,
      assignTaskOrder,
      workInfoDetail,
      NameCardHover
    },
    computed: {
      workInfoUrl() {
        return `${$axios.basePath()}/fileUpload/uploadItilattach`
      },
      roleProService() {
        return this.$store.state.processCenter.rolePro.serviceArr;
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
        $axios.get(`/ItilCommonWorkflow/concernIncidentOrder/${this.orderUuid}/2`).then(({data}) => {
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
      // 回退
      goBack() {
        this.goBackDialog = true
      },
      // 关闭回退弹框
      closeGoBack(flag) {
        if (flag !== 'cancle') {
          this.itilChangeOrder();
        }
        this.goBackDialog = false;
      },
      // 待决
      waitDecide() {
        this.waitDecideDialog = true
      },
      // 待决弹框关闭
      handelCloseWaitDec(flag) {
        if (flag !== 'cancle') {
          this.itilChangeOrder();
        }
        this.waitDecideDialog = false
      },
      // 待决恢复
      waitDecideBack() {
        $axios.get(`/itilChangeOrder/changrOrderPengingRecover/${this.orderUuid}`).then(({data}) => {
          if (data.state === true) {
            this.$message({
              type: 'success',
              message: '待决已恢复！'
            })
            this.itilChangeOrder()
          } else {
            this.$message({
              type: 'error',
              message: '待决恢复失败，请重试！'
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
      // 创建关联关系
      createAssociation() {
        this.createAssoDialog = true
      },
      // 查看变更单流程图
      openModifyFlowchart() {
        this.$router.push(`/ProcessCenter/modifyFlowchart/${this.orderForm.serialCode}/${this.orderUuid}`)
      },
      // 变更日历
      showCalendar() {
        this.$router.push('/ProcessCenter/modifycalendar')
      },
      // 变更排期
      changeSchedule() {
        this.scheduleDialog = true
      },
      // 关闭 '变更排期'弹框
      closeScheduleDialog(flag) {
        if (flag !== 'cancle') {
          this.itilChangeOrder();
        }
        this.scheduleDialog = false
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
      // 变更冲突检测
      showModifyConflict() {
        this.modifyConflictDialog = true
      },
      // 创建任务
      createTaskOk() {
        this.$refs['createTask'].$refs['createTaskForm'].validate((valid) => {
          if (valid) {
            $axios.post(`/itilChangeOrder/saveChangeTask`, Object.assign({}, this.$refs['createTask'].form, {changeOrderUuid: this.orderUuid})).then((res) => {
              if (res.data.state === true) {
                this.$message({
                  type: 'success',
                  message: '创建成功!'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: '创建失败!'
                })
              }
              this.createDialog = false
              this.showChangeTaskList(this.orderForm.changeStatus); // 刷新右侧tab并判断是否置灰下一阶段按钮
              if (this.orderForm.changeStatus === 4) {
                this.currentStep = 2
                this.judgeRole()
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: '请填写必要内容!'
            })
          }
        });
      },
      // 取消
      cancelOk() {
        let cancelReason = this.$refs['cancel'].cancelForm.cancel
        this.$refs['cancel'].$refs['cancelForm'].validate((valid) => {
          if (valid) {
            $axios.post(`/itilChangeOrder/changeOrderCancel/`, {
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
      // 变更管理员组
      getAllChangeAdminGroup() {
        return $axios.get(`/itilChangeOrder/getAllChangeAdminGroup/` + this.orderForm.companyUuid).then(({data}) => {
          if (data instanceof Array && data.length > 0) {
            this.adminGroupList = data
          }
        })
      },
      // 变更管理用户
      getAllChangeAdminUser() {
        if (this.orderForm.adminGroup && this.adminGroupList.length > 0) {
          return $axios.get(`/itilChangeOrder/getAllChangeAdminUserByGroup/${this.orderForm.adminGroup}`).then(({data}) => {
            if (data instanceof Array && data.length > 0) {
              this.adminUserList = data
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '请先选择变更管理员组！'
          });
          this.orderForm.adminUser = ''
          this.adminUserList = []
        }
      },
      // 变更经理组
      getAllChangeMangerGroup() {
        return $axios.get(`/itilChangeOrder/getAllChangeMangerGroup/` + this.orderForm.companyUuid).then(({data}) => {
          if (data instanceof Array && data.length > 0) {
            this.managerGroupList = data
          }
        })
      },
      // 变更经理用户
      getAllChangeMangerUserByGroup() {
        if (this.orderForm.managerGroup && this.managerGroupList.length > 0) {
          return $axios.get(`/itilChangeOrder/getAllChangeMangerUserByGroup/${this.orderForm.managerGroup}`).then(({data}) => {
            if (data instanceof Array && data.length > 0) {
              this.managerUserList = data
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '请先选择变更经理组！'
          });
          this.orderForm.managerUser = ''
          this.managerUserList = []
        }
      },
      // 所有select
      getSelect() {
        this.getAllChangeMangerGroup().then(() => {
          if (this.orderForm.managerGroup && this.managerGroupList.length > 0) {
            this.getAllChangeMangerUserByGroup()
          }
        })
        this.getAllChangeAdminGroup().then(() => {
          if (this.orderForm.adminGroup && this.adminGroupList.length > 0) {
            this.getAllChangeAdminUser()
          }
        })
        this.getItilCategory(2, this.orderForm.companyUuid)
        this.getSecondCategory(2, this.orderForm.companyUuid, this.orderForm.categoryFirst)
        this.getThirdCategory(2, this.orderForm.companyUuid, this.orderForm.categoryFirst, this.orderForm.categorySecond)
      },
      saveOrder() {
        var {
          serialCode,
          briefDesc,
          detailDesc,
          templateName,
          categoryFirst,
          categorySecond,
          categoryThird,
          riskLevel,
          changePath,
          changeAction,
          changeEnvironment,
          effectOrgnizition,
          managerGroup,
          managerUser,
          adminGroup,
          adminUser,
          changeStatus,
          rollbackReason,
          pendingReason,
          cancelReason,
          refuseReason,
          checkBill,
          closeCode
        } = this.orderForm
        this.submitOrderForm = Object.assign({}, {uuid: this.orderUuid}, {
          serialCode,
          briefDesc,
          detailDesc,
          templateName,
          categoryFirst,
          categorySecond,
          categoryThird,
          riskLevel,
          changePath,
          changeAction,
          changeEnvironment,
          effectOrgnizition,
          managerGroup,
          managerUser,
          adminGroup,
          adminUser,
          changeStatus,
          rollbackReason,
          pendingReason,
          cancelReason,
          refuseReason,
          checkBill,
          closeCode
        })
        if (this.orderFormIsChange === true) {
          this.$refs.orderForm.validate((valid) => {
            if (valid) {
              $axios.post(`/itilChangeOrder/updateChangeOrder/`, this.submitOrderForm).then(({data}) => {
                if (data.state === true) {
                  this.$message({
                    type: 'success',
                    message: '保存成功！'
                  })
                  this.itilChangeOrder()
                  this.orderFormIsChange = false
                } else {
                  this.$message({
                    type: 'error',
                    message: data.errormsg
                  })
                  this.$refs['orderForm'].resetFields()
                }
              })
            } else {
              return false
            }
          })
        } else {
          return false
        }
      },
      // 下一阶段按钮
      nextStep() {
        // 先获取提交参数
        var {
          serialCode,
          briefDesc,
          detailDesc,
          templateName,
          categoryFirst,
          categorySecond,
          categoryThird,
          riskLevel,
          changePath,
          changeAction,
          changeEnvironment,
          effectOrgnizition,
          managerGroup,
          managerUser,
          adminGroup,
          adminUser,
          changeStatus,
          rollbackReason,
          pendingReason,
          cancelReason,
          refuseReason,
          checkBill,
          closeCode
        } = this.orderForm
        this.submitOrderForm = Object.assign({}, {uuid: this.orderUuid}, {
          serialCode,
          briefDesc,
          detailDesc,
          templateName,
          categoryFirst,
          categorySecond,
          categoryThird,
          riskLevel,
          changePath,
          changeAction,
          changeEnvironment,
          effectOrgnizition,
          managerGroup,
          managerUser,
          adminGroup,
          adminUser,
          changeStatus,
          rollbackReason,
          pendingReason,
          cancelReason,
          refuseReason,
          checkBill,
          closeCode
        })
        // 变更单状态为“变更请求”，需要变更管理员进行复核与确认的操作
        if (this.orderForm.changeStatus === 2) {
          this.orderRules.checkBill = [{ required: true, message: '请填写复核意见！', trigger: 'blur' }]
          if (!this.orderForm.checkBill) {
            this.$message({
              type: 'error',
              message: '请填写复核意见!'
            })
          }
          // 变更关闭
        } else if (this.orderForm.changeStatus === 8) {
          this.closeDialogBloom = true
          return
        }
        this.$refs['orderForm'].validate((valid) => {
          if (valid) {
            $axios.post(`/itilChangeOrder/nextStep/`, this.submitOrderForm).then(({data}) => {
              if (data.state === true) {
                this.orderFormIsChange = false
                // 变更单状态以改变，需要重新获取接口
                this.itilChangeOrder()
              } else {
                this.$message({
                  type: 'error',
                  message: data.errormsg
                })
              }
            })
          }
        })
      },
      // 关闭代码确定
      closeOk() {
        this.submitOrderForm.closeCode = this.$refs.closeCode.closeform.closeCode
        $axios.post(`/itilChangeOrder/nextStep`, this.submitOrderForm).then(({data}) => {
          if (data.state === true) {
            // 变更单状态以改变，需要重新获取接口
            this.itilChangeOrder()
            this.closeDialogBloom = false
            this.$message({
              type: 'success',
              message: '关单成功！'
            })
          } else {
            this.$message({
              type: 'error',
              message: '关单失败！'
            })
          }
        })
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
          case '3':
            this.showChangeTaskList(this.orderForm.changeStatus);
            break;
          case '4':
            this.getServiceRequestAttr()
            break;
        }
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
      // 右侧工作详细信息
      serachItilLog() {
        $axios.get(`/itilIncidentCenter/serachItilLog/${this.orderUuid}`).then(({data}) => {
          if (data instanceof Array) {
            this.workInfoData = data
          }
        })
      },
      // 查看右侧工作详细信息
      checkWorkDeatail(index, row) {
        this.workInfoDialog = true
        this.workInfoRow = row
      },
      // 右侧任务
      showChangeTaskList(status) {
        return $axios.get(`/itilChangeOrder/showChangeTaskList/${this.orderUuid}`).then(({data}) => {
          if (data instanceof Array && data.length > 0) {
            if (status === 6 && this.taskBtnFlag === true) {
              data.forEach((item) => {
                item.taskAssignDisabled = this.judgeAssignCancel(item).assign
                item.taskCancleDisabled = this.judgeAssignCancel(item).cancel
              })
            }
            this.taskData = data
          }
        })
      },
      // 右侧任务的执行顺序
      sort(isUp, taskUuid, taskSort) {
        // 禁灰同时要阻止点击事件
        if (this.allDisabled && this.taskIconDisabled) {
          event.stopPropagation()
        } else {
          if (isUp) {
            if (taskSort === 1) return;
            taskSort = taskSort - 1
          } else {
            taskSort = taskSort + 1
          }
          $axios.get(`/itilChangeOrder/sortChangeTask/${this.orderUuid}/${taskUuid}/${taskSort}`).then(({data}) => {
            if (data.state === true) {
              this.$message({
                type: 'success',
                message: '操作成功！'
              })
              this.showChangeTaskList(this.orderForm.changeStatus)
            } else {
              this.$message({
                type: 'error',
                message: data.errormsg
              })
            }
          })
        }
      },
      // 右侧任务->任务详情页跳转
      goToTaskOrderDetail(uuid) {
        this.$router.push(`/ProcessCenter/taskOrderDetail/${uuid}`)
      },
      // 指派
      assignTaskOrder(index, row) {
        this.assignTaskOrderDialog = true
        this.taskOrderUuid = row.uuid
        this.companyUuid = row.companyUuid
      },
      // 关闭 '指派'弹框
      closeAssignDialog() {
        this.assignTaskOrderDialog = false
      },
      // 右侧任务取消弹框打开
      cancelTaskOrder(index, row) {
        this.cancelTaskOrderDialog = true
        this.taskOrderUuid = row.uuid
      },
      // 保存 '取消'操作
      saveCancelTaskOrder() {
        let cancelReason = this.$refs['cancelTaskOrderForm'].cancelForm.cancel
        this.$refs['cancelTaskOrderForm'].$refs['cancelForm'].validate((valid) => {
          if (valid) {
            $axios.post(`/itilChangeOrder/changeTaskCancel/`, {
              taskUuid: this.taskOrderUuid,
              cancelReason: cancelReason
            }).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: '取消成功！'
                })
                this.cancelTaskOrderDialog = false
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
      // 关闭 '取消'弹框
      cancelTaskOrderCancel() {
        this.cancelTaskOrderDialog = false
      },
      // 右侧关联关系数据
      getAssociationData() {
        $axios.get(`/ItilCommonWorkflow/getRelationOrderlist/${this.orderUuid}`).then(({data}) => {
          let {changeOrderList, changeTaskList, incidentOrderList, problemOrderList, knowledgeOrderList, publishOrderList, requestOrderList} = data
          changeOrderList = (changeOrderList || []).map(item => Object.assign({}, item, {
            statusName: item.changeStatusName,
            orderTypeStr: '变更'
          }))
          changeTaskList = (changeTaskList || []).map(item => Object.assign({}, item, {
            statusName: item.statusName,
            orderTypeStr: '任务'
          }))
          incidentOrderList = (incidentOrderList || []).map(item => Object.assign({}, item, {
            statusName: item.incidentStatusName,
            orderTypeStr: '事件'
          }))
          problemOrderList = (problemOrderList || []).map(item => Object.assign({}, item, {
            statusName: item.problemStatusName,
            orderTypeStr: '问题'
          }))
          knowledgeOrderList = (knowledgeOrderList || []).map(item => Object.assign({}, item, {
            statusName: item.knowledgeStatusName,
            orderTypeStr: '知识'
          }))
          publishOrderList = (publishOrderList || []).map(item => Object.assign({}, item, {
            statusName: item.publishStatusName,
            orderTypeStr: '发布'
          }))
          requestOrderList = (requestOrderList || []).map(item => Object.assign({}, item, {
            statusName: item.statusName,
            orderTypeStr: '服务请求'
          }))
          this.associationData = [...changeOrderList, ...changeTaskList, ...incidentOrderList, ...problemOrderList, ...knowledgeOrderList, ...publishOrderList, ...requestOrderList]
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
        if (file.size > 10 * 1024 * 1024) {
          this.$message({type: 'error', message: '单个文件大小不能超过10M!'});
          return false;
        }
      },
      // 添加工作信息
      addWorkInfo() {
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
      // 当前用户所有的组
      getUserGroups() {
        // 获取当前用户组
        $axios.get('/ItilCommonWorkflow/getGroupListByUser').then(({data}) => {
          this.userGroups = data.map(item => item.uuid)
        })
      },
      // 判断角色信息
      judgeRole() {
        // 由于正在执行的任务栏的指派取消是根据任务单的指派取消状态判断的，所以单独提出来
        /*
        *
        * if (当前用户！=流程提交人 && !(当前用户所有的组.indexOf(变更经理组) && 当前用户角色是变更经理) && 当前用户！=变更管理员)｛  ----------
            if (当前用户有流程管理员角色 && 工单状态为变更请求)｛
              有权限按钮中可以点击指派给我
            ｝else {
              有权限按钮全部置灰
            }
          ｝else if(当前用户 == 变更管理员 || (当前用户所有的组.indexOf(变更经理组) && 当前用户角色是变更经理))｛ ----------------
              判断工单状态限制有权限按钮：
                已计划审批、技术审批、已关闭、已取消、已拒绝：有权限按钮全部置灰
                正在执行： 除了任务栏的指派取消其他有权限按钮全部置灰【根据任务单的指派取消状态判断】
                草稿、变更请求：除了任务栏的指派取消其他有权限按钮全部开放
                计划：开放：变更排期、创建任务单、页面数据【除了变更管理员和组】、保存、下一阶段、任务栏的排序图标
                      置灰：指派给我、指派给他人、回退、待决、待决恢复、取消
                待决：除待决恢复，其余有权限按钮全部置灰
                已完成：开放：if (变更路径 ！== 紧急变更) { 回退 }、页面数据【除了变更管理员和组】、保存、下一阶段
                       置灰：指派给我、指派给他人、待决、待决恢复、取消、变更排期、创建任务单、任务栏图标、任务栏按钮
           ｝else if(当前用户 ==  流程提交人 && !(当前用户 == 变更管理员 || (当前用户所有的组.indexOf(变更经理组) && 当前用户角色是变更经理)))｛  ---------
              判断工单状态限制有权限按钮：
                草稿：可以编辑工单数据、可以保存、可以下一阶段
                其他状态：有权限按钮全部置灰
           }
        *
        * */
        let orderForm = this.orderForm
        let status = this.orderForm.changeStatus
        let userIsChangeManager = false
        if (this.ItilRole instanceof Array && this.ItilRole.length > 0) {
          userIsChangeManager = this.ItilRole.some((item) => {
            return item.roleKey === 'change_manager'
          })
        }
        // 默认所有都为true，在判断是否需要放开按钮，并且每次重新重置为true
        this.allDisabled = this.assignMeDisabled = this.formDisabled = this.saveDisabled = this.nextDisabled = this.scheduleDisabled = this.createTaskDisabled = this.taskIconDisabled = this.taskAssignDisabled = this.taskCancleDisabled = this.retreatDisabled = this.backDisabled = true
        this.taskBtnFlag = false
        if (this.userUuid !== orderForm.createUser && !(this.userGroups.indexOf(orderForm.managerGroup) > -1 && userIsChangeManager) && this.userUuid !== orderForm.adminUser) {
          if (this.ItilRole instanceof Array && this.ItilRole.length > 0) {
            let flag = this.ItilRole.some((item) => {
              return item.roleKey === 'change_minstrator'
            })
            if (flag && status === 2) {
              this.assignMeDisabled = false
            }
          }
        } else if (this.userUuid === orderForm.adminUser || this.roleProService.includes(2) || (this.userGroups.indexOf(orderForm.managerGroup) > -1 && userIsChangeManager)) {
          if (status === 6) {
            this.taskBtnFlag = true // 只有在这个情况下才与任务单的指派取消保持一致
            this.taskData = this.taskData.forEach((item) => {
              item.taskAssignDisabled = this.judgeAssignCancel(item).assign
              item.taskCancleDisabled = this.judgeAssignCancel(item).cancel
            })
            // this.taskIconDisabled = false
          } else if (status === 1 || status === 2) {
            this.allDisabled = this.assignMeDisabled = this.formDisabled = this.saveDisabled = this.nextDisabled = this.scheduleDisabled = this.createTaskDisabled = this.retreatDisabled = this.backDisabled = false
            // 变更单状态为计划时候，手动获取任务列表数据，因为初始化只加载工作详细信息数据，任务数据为空，会导致判断错误
          } else if (status === 4) {
            this.scheduleDisabled = false
            this.createTaskDisabled = false
            this.saveDisabled = false
            this.formDisabled = false
            this.taskIconDisabled = false
            if (!(this.orderForm.planStartTime && this.orderForm.planEndTime)) {
              return
            }
            // 刷新右侧tab
            this.showChangeTaskList(this.orderForm.changeStatus).then(() => {
              if (this.taskData.length > 0) {
                this.nextDisabled = false
              }
            });
          } else if (status === 7) {
            this.retreatDisabled = false
          } else if (status === 8) {
            if (orderForm.changePathMap[orderForm.changePath] !== '紧急变更') {
              this.backDisabled = false
            }
            this.formDisabled = false
            this.saveDisabled = false
            this.nextDisabled = false
          }
        } else if (this.userUuid === orderForm.createUser && !(this.userUuid === orderForm.adminUser || (this.userGroups.indexOf(orderForm.managerGroup) > -1 && userIsChangeManager))) {
          if (status === 1) {
            this.formDisabled = false
            this.saveDisabled = false
            this.nextDisabled = false
          }
        }
        if (orderForm.isAssign === 0) {
          this.allDisabled = true
          this.nextDisabled = true
          this.saveDisabled = true
        }
      },
      // 待决比较特殊，需要判断他的前一个状态pendingStatus，根据pendingStatus显示对应阶段
      pendingStatus() {
        switch (this.orderForm.pendingStatus) {
          case 1:
            this.currentStep = 0;
            break;     // 草稿
          case 2:
            this.currentStep = 1;
            break;     // 变更请求
          case 3:
            this.currentStep = 1;
            break;     // 已经计划审批
          case 4:
            this.currentStep = 2;
            break;     // 计划
          case 5:
            this.currentStep = 2;
            break;     // 技术审批
          case 6:
            this.currentStep = 3;
            break;     // 正在执行
          case 8:
            this.currentStep = 3;
            break;     // 已完成
          case 9:
            this.currentStep = 4;
            break;    // 已关闭
          case 10:
            this.currentStep = 4;
            break;     // 已取消
          case 11:
            this.currentStep = 4;
            break;    // 已拒绝
        }
      },
      // 初始化
      itilChangeOrder() {
        this.inited = false
        // 获取当前用户所有组
        this.getUserGroups()
        // 获取详情接口
        $axios.get(`/itilChangeOrder/getChangeOrderDetail/${this.orderUuid}`).then(({data}) => {
          if (data) {
            this.orderForm = data
            this.serviceRequestUuid = this.orderForm.desiUuid
            switch (this.orderForm.changeStatus) {
              case 1:
                this.currentStep = 0;
                break;     // 草稿
              case 2:
                this.currentStep = 1;
                break;     // 变更请求
              case 3:
                this.currentStep = 1;
                break;     // 已经计划审批
              case 4:
                this.currentStep = 2;
                break;     // 计划
              case 5:
                this.currentStep = 2;
                break;     // 技术审批
              case 6:
                this.currentStep = 3;
                break;     // 正在执行
              case 7:
                this.pendingStatus();
                break;     // 待决
              case 8:
                this.currentStep = 3;
                break;     // 已完成
              case 9:
                this.currentStep = 4;
                break;     // 已关闭
              case 10:
                this.currentStep = 4;
                break;   // 已取消
              case 11:
                this.currentStep = 4;
                break;   // 已拒绝
            }
          }
        }).then(() => {
          Promise.all([
            this.judgeRole(),
            this.getSelect(),
            // 右侧工作详细信息
            this.serachItilLog(),
            // 为了右侧任务数据实时刷新
            this.showChangeTaskList(this.orderForm.changeStatus),
            this.getServiceRequestAttr()
          ]).then(() => {
            this.inited = true
          })
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
      },
      'orderForm.managerGroup': {
        deep: true,
        handler() {
          if (!this.inited) {
            return
          }
          this.getAllChangeMangerUserByGroup().then(() => {
            this.orderForm.managerUser = this.managerUserList[0].uuid
          })
        }
      },
      'orderForm.adminGroup': {
        deep: true,
        handler() {
          if (!this.inited) {
            return
          }
          this.getAllChangeAdminUser().then(() => {
            this.orderForm.adminUser = this.adminUserList[0].uuid
          })
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
#index-body
  padding-left:0 !important
#systemDate
  .grid-content
    font-size 14px
    margin-bottom 10px
  </style>
