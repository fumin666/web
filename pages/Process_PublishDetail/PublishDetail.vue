<template>
  <div class="processDetail processProblemDetail" style="display: flex">
    <div style="width: 175px; margin-right: 20px">
      <div class="process-detail-title">
        <span class="process-detail-text">发布管理</span>
      </div>
      <div class="leftMenu">
        <div class="title">-- 功能菜单 --</div>
        <s-button class="attention attention-empty" v-if="form.concernUuid" @click="addAttention">取消关注</s-button>
        <s-button class="attention" v-else @click="addAttention">关注</s-button>
        <s-button icon="back-square" @click="goBack" :disabled="disabledBackBtn">回退</s-button>
        <s-button icon="retreat" v-if="form.publishStatus===8" @click="recoveryDecide" :disabled="disPendingRecovery">待决恢复</s-button>
        <s-button icon="underway" v-else @click="waitDecide" :disabled="disabledPendingBtn">待决</s-button>
        <s-button icon="cancel" :disabled="disabledCancelBtn" @click="cancelPublishOrder">取消</s-button>
        <s-button icon="manage-process" @click="openPublishFlowChart">流程图</s-button>
        <s-button icon="printer" @click="showPrintDialog">打印</s-button>
        <s-button icon="export" @click="showUploadDialog">附件上传</s-button>
      </div>
    </div>
    <div style="flex: 1;">
      <s-steps :current="currentStep" :active="currentStep" finish-status="success" step-width="calc(16.6% - 23px)"
               style="margin-left: 15px">
        <s-step title="启动"></s-step>
        <s-step title="计划"></s-step>
        <s-step title="开发"></s-step>
        <s-step title="测试"></s-step>
        <s-step title="部署"></s-step>
        <s-step title="关闭"></s-step>
      </s-steps>
      <div style="margin-top: 20px">
        <s-scrollbar wrap-style="max-height: calc(100vh - 215px);">
          <s-row :gutter="20" style="margin: 0 0 0 0">
            <s-col span="10" id="problemDetailLeft" style="padding:0 9px 0 10px;border-right: 1px dashed rgba(0, 0, 0, 0.1);">
              <s-form :model="form" :rules="rules" ref="form" label-width="120px">
                <s-form-item label="发布单号" prop="serialCode">
                  <s-input v-model="form.serialCode" disabled></s-input>
                </s-form-item>
                <s-form-item label="受益人公司" prop="benefitCompany">
                  <s-select v-model="form.benefitCompany" :disabled="disabledAll" style="width: 100%" @change="changeCompany" filterable clearable>
                    <s-option v-for="item in benefitCompanyArr" :key="item.uuid" :label="item.departName" :value="item.uuid"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="受益人姓名" prop="benefitPersonName">
                  <s-select v-model="form.benefitPersonName" :disabled="disabledAll" style="width: 100%" filterable clearable>
                    <s-option v-for="item in benefitPersonNameArr" :key="item.uuid" :label="item.userRealName" :value="item.uuid"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="简要描述" prop="briefDesc">
                  <s-input v-model="form.briefDesc" type="textarea" :autosize="{ minRows: 3}" :disabled="disabledAll"></s-input>
                </s-form-item>
                <s-form-item label="详细描述" prop="detailDesc">
                  <s-input v-model="form.detailDesc" type="textarea" :autosize="{ minRows: 3}" :disabled="disabledAll"></s-input>
                </s-form-item>
                <s-form-item label="发布分级" prop="publishLevel">
                  <s-select v-model="form.publishLevel" style="width: 100%" :disabled="disabledAll">
                    <s-option v-for="(value, key, index) in form.publishLevelMap" :key="index" :value="parseInt(key)"
                              :label="value"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="业务理由" prop="businessReason">
                  <s-select v-model="form.businessReason" style="width: 100%" :disabled="disabledAll">
                    <s-option v-for="(value, key, index) in form.businessReasonMap" :key="index" :value="parseInt(key)"
                              :label="value"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="发布类型" prop="publishType">
                  <s-select v-model="form.publishType" style="width: 100%" :disabled="disabledAll">
                    <s-option v-for="(value, key, index) in form.publishTypeMap" :key="index" :value="parseInt(key)"
                              :label="value"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="应用系统" prop="appSystem">
                  <s-input v-model="form.appSystem" :disabled="disabledAll"></s-input>
                </s-form-item>
                <s-form-item label="目标完成时间" prop="planFinishTime">
                  <s-date-picker v-model="planFinishTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" @change="handleTimeChange" :disabled="disabledAll"></s-date-picker>
                </s-form-item>
                <s-form-item label="分类一级" prop="categoryFirst">
                  <s-select v-model="form.categoryFirst" @change="changeCF" style="width: 100%" :anonLabel="form.categoryFirstName" :disabled="disabledAll">
                    <s-option v-for="(item, index) in categoryFirstArr" :key="index" :value="item.uuid"
                              :label="item.name"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="分类二级" prop="categorySecond">
                  <s-select v-model="form.categorySecond" @change="changeCS" style="width: 100%" :anonLabel="form.categorySecondName" :disabled="disabledAll">
                    <s-option v-for="(item, index) in categorySecondArr" :key="index" :value="item.uuid"
                              :label="item.categoryName"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="分类三级" prop="categoryThird">
                  <s-select v-model="form.categoryThird" style="width: 100%" :anonLabel="form.categoryThirdName" :disabled="disabledAll">
                    <s-option v-for="(item, index) in categoryThirdArr" :key="index" :value="item.uuid"
                              :label="item.categoryName"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="影响度" prop="impactLevel">
                  <s-select v-model="form.impactLevel" style="width: 100%" :disabled="disabledAll">
                    <s-option v-for="(value, key, index) in form.impactLevelMap" :key="index" :value="parseInt(key)"
                              :label="value"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="紧急性" prop="emergencyLevel">
                  <s-select v-model="form.emergencyLevel" style="width: 100%" :disabled="disabledAll">
                    <s-option v-for="(value, key, index) in form.emergencyLevelMap" :key="index" :value="parseInt(key)"
                              :label="value"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="优先级" prop="priorityLevel">
                  <s-select v-model="form.priorityLevel" style="width: 100%" :disabled="disabledAll">
                    <s-option v-for="(value, key, index) in form.priorityLevelMap" :key="index" :value="parseInt(key)"
                              :label="value"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="风险等级" prop="riskLevel">
                  <s-select v-model="form.riskLevel" style="width: 100%" :disabled="disabledAll">
                    <s-option v-for="(value, key, index) in form.riskLevelMap" :key="index" :value="parseInt(key)"
                              :label="value"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="发布经理组" prop="managerGroup">
                  <s-select v-model="form.managerGroup" @change="handleMGChange" style="width: 100%" :anonLabel="form.managerGroupName" :disabled="disabledAll">
                    <s-option v-for="(item, index) in managerGroupArr" :key="index" :value="item.uuid"
                              :label="item.groupName"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="发布经理" prop="managerUser">
                  <NameCardHover :useruuid="form.managerUser" :placement="'right'">
                    <s-select v-model="form.managerUser" style="width: 100%" :anonLabel="form.managerUserName" :disabled="disabledAll">
                      <s-option v-for="(item, index) in managerUserArr" :key="index" :value="item.uuid"
                                :label="item.userRealName"></s-option>
                    </s-select>
                  </NameCardHover>
                </s-form-item>
                <s-form-item label="发布协调员组	" prop="coordinateGroup">
                  <s-select v-model="form.coordinateGroup" style="width: 100%" :anonLabel="form.coordinateGroupName" disabled>
                    <s-option v-for="(item, index) in coordinateGroupArr" :key="index" :value="item.uuid"
                              :label="item.groupName"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="发布协调员	" prop="coordinateUser">
                  <NameCardHover :useruuid="form.coordinateUser" :placement="'right'">
                    <s-select v-model="form.coordinateUser" style="width: 100%" :anonLabel="form.coordinateUserName" disabled>
                      <s-option v-for="(item, index) in coordinateUserArr" :key="index" :value="item.uuid"
                                :label="item.userRealName"></s-option>
                    </s-select>
                  </NameCardHover>
                </s-form-item>
                <s-form-item label="状态	" prop="publishStatusName">
                  <s-input v-model="form.publishStatusName" disabled></s-input>
                </s-form-item>
                <s-form-item label="待决理由	" prop="pendingReason">
                  <s-input v-model="form.pendingReason" disabled></s-input>
                </s-form-item>
                <s-form-item label="取消原因	" prop="cancelReason">
                  <s-input v-model="form.cancelReason" disabled></s-input>
                </s-form-item>
                <s-form-item label="关闭代码	" prop="closeCode">
                  <s-input v-model="form.closeCode" disabled></s-input>
                </s-form-item>
                <s-form-item label="回退原因	" prop="rollbackReason">
                  <s-input v-model="form.rollbackReason" disabled></s-input>
                </s-form-item>
                <s-form-item label="拒绝原因" prop="refuseReason">
                  <s-input v-model="form.refuseReason" disabled></s-input>
                </s-form-item>
              </s-form>
            </s-col>
            <s-col span="14" id="problemDetailRight">
              <s-tab v-model="activeTab" @tab-click="handleClick">
                <s-tab-pane name="0" label="工作详细信息">
                  <s-button icon="plus" @click="addWorkInfoDialog" style="margin-bottom: 10px;">添加工作信息</s-button>
                  <s-table-page :data="workDetail" >
                    <s-table-column prop="logTypeStr" label="类型" ></s-table-column>
                    <s-table-column prop="logDetail" label="工作信息" ></s-table-column>
                    <s-table-column prop="fileNum" label="文件" ></s-table-column>
                    <s-table-column prop="createTime" label="提交日期" ></s-table-column>
                    <s-table-column prop="createUserName" label="提交人名称" ></s-table-column>
                    <s-table-column label="操作" width="65px">
                      <template slot-scope="scope">
                        <i class="iconfont icon-eye" title="查看" @click="checkWorkDetail(scope.$index, scope.row)"></i>
                      </template>
                    </s-table-column>
                  </s-table-page>
                </s-tab-pane>
                <s-tab-pane name="1" :label="getAuth()">
                  <s-row>
                    <div style="position: absolute; display: flex; flex-direction: row; justify-content: flex-start;">
                      <div style="display: flex; align-items: center">
                        <span style="font-weight: bold;">任务列表</span>
                      </div>
                      <s-select v-model="publishTaskStage" @change="changePublishTaskStage" placeholder="发布的阶段" style="margin-left: 15px;">
                        <s-option v-for="(item, index) in publishTaskStageArr" :label="item.name" :value="item.value"
                                  :key="index"></s-option>
                      </s-select>
                      <div style="margin-left: 15px;">
                        <s-button @click="showCreateTaskOrder" :disabled="disabledCreateBtn">创建工单</s-button>
                      </div>
                    </div>
                    <s-table-page
                      :data="taskOrderList"
                      
                      :header-search="getTaskSearchDef()"
                      
                      >
                      <s-table-column prop="taskSort" label="执行顺序" show-overflow-tooltip></s-table-column>
                      <s-table-column prop="serialCode" label="任务id" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <a @click="goDetail('任务', scope.row)" href="javascript:;">{{ scope.row.serialCode }}</a>
                        </template>
                      </s-table-column>
                      <s-table-column prop="title" label="任务标题" show-overflow-tooltip></s-table-column>
                      <s-table-column prop="createUserName" label="创建人" show-overflow-tooltip></s-table-column>
                      <s-table-column prop="taskStatusName" label="任务状态" show-overflow-tooltip></s-table-column>
                      <s-table-column prop="publishStage" label="发布阶段" show-overflow-tooltip>
                        <template slot-scope="scope">
                          {{ scope.row.publishStage | filterPublishStage }}
                        </template>
                      </s-table-column>
                      <s-table-column prop="createTime" label="创建时间" show-overflow-tooltip></s-table-column>
                      <s-table-column prop="" label="操作" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <s-button
                            size="mini"
                            @click="showAssignDialog(scope.$index, scope.row)"
                            :disabled="scope.row.taskAssignDisabled">指派
                          </s-button>
                          <s-button
                            size="mini"
                            @click="showCancelDialog(scope.$index, scope.row)"
                            :disabled="scope.row.taskCancelDisabled">取消
                          </s-button>
                          <i class="iconfont icon-update" @click="ascendingTaskOrder(scope.$index, scope.row)" :class="{ disabledIcon: scope.row.canUse }" title="升序"></i>
                          <i class="iconfont icon-download" @click="descendingTaskOrder(scope.$index, scope.row)" :class="{ disabledIcon: scope.row.canUse }" title="降序"></i>
                        </template>
                      </s-table-column>
                    </s-table-page>
                  </s-row>

                  <s-row style="margin-top: 50px;" v-if="ChangeAuth">
                    <div style="position: absolute; display: flex; flex-direction: row; justify-content: flex-start;">
                      <div style="display: flex; align-items: center">
                        <span style="font-weight: bold;">变更列表</span>
                      </div>
                      <s-select v-model="publishChangeStage" @change="changeOrderStage" style="margin-left: 15px;">
                        <s-option v-for="(item, index) in publishTaskStageArr" :label="item.name" :value="item.value"
                                  :key="index"></s-option>
                      </s-select>
                      <div style="margin-left: 15px;">
                        <s-button @click="showCreateChangeOrder" :disabled="disabledCreateBtn">创建工单</s-button>
                      </div>
                    </div>
                    <s-table-page
                      :data="changeOrderList"
                      
                      :header-search="getChangeSearchDef()"
                      
                      
                    >
                      <s-table-column prop="changeSort" label="执行顺序" show-overflow-tooltip></s-table-column>
                      <s-table-column prop="publishStage" label="发布阶段" show-overflow-tooltip>
                        <template slot-scope="scope">
                          {{ scope.row.publishStage | filterChangePublishStage }}
                        </template>
                      </s-table-column>
                      <s-table-column prop="serialCode" label="变更单号" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <a @click="goDetail('变更', scope.row)" href="javascript:;">{{ scope.row.serialCode }}</a>
                        </template>
                      </s-table-column>
                      <s-table-column prop="briefDesc" label="简要描述" show-overflow-tooltip></s-table-column>
                      <s-table-column prop="createUserName" label="创建人" show-overflow-tooltip></s-table-column>
                      <s-table-column prop="changeStatusName" label="状态" show-overflow-tooltip></s-table-column>
                      <s-table-column prop="createTime" label="创建时间" show-overflow-tooltip></s-table-column>
                      <s-table-column label="操作" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <s-button
                            size="mini"
                            @click="showCancelChangeDialog(scope.$index, scope.row)"
                            :disabled="scope.row.disabledChangeOrderCancel">
                            取消
                          </s-button>
                          <i class="iconfont icon-update"
                             @click="ascendingChangeOrder(scope.$index, scope.row)"
                             :class="{ disabledIcon: scope.row.canSort }"
                             title="升序"></i>
                          <i class="iconfont icon-download"
                             @click="descendingChangeOrder(scope.$index, scope.row)"
                             :class="{ disabledIcon: scope.row.canSort }"
                             title="降序"></i>
                        </template>
                      </s-table-column>
                    </s-table-page>
                  </s-row>
                </s-tab-pane>
                <s-tab-pane name="2" label="日期/系统">
                  <div id="systemDate">
                    <s-row>
                      <s-col :span="6" class="grid-content bg-purple">提交人：</s-col>
                      <s-col :span="18" class="grid-content bg-purple-light">{{ form.createUserName }}</s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="6" class="grid-content bg-purple">提交时间：</s-col>
                      <s-col :span="18" class="grid-content bg-purple-light">{{ form.createTime }}</s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="6" class="grid-content bg-purple">草稿时间：</s-col>
                      <s-col :span="18" class="grid-content bg-purple-light">{{ form.draftTime }}</s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="6" class="grid-content bg-purple">启动审批开始时间：</s-col>
                      <s-col :span="18" class="grid-content bg-purple-light">{{ form.openStartTime }}</s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="6" class="grid-content bg-purple">启动审批结束时间：</s-col>
                      <s-col :span="18" class="grid-content bg-purple-light">{{ form.openEndTime }}</s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="6" class="grid-content bg-purple">计划审批开始时间：</s-col>
                      <s-col :span="18" class="grid-content bg-purple-light">{{ form.planStartTime }}</s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="6" class="grid-content bg-purple">计划审批结束时间：</s-col>
                      <s-col :span="18" class="grid-content bg-purple-light">{{ form.planEndTime }}</s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="6" class="grid-content bg-purple">开发审批开始时间：</s-col>
                      <s-col :span="18" class="grid-content bg-purple-light">{{ form.developStartTime }}</s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="6" class="grid-content bg-purple">开发审批结束时间：</s-col>
                      <s-col :span="18" class="grid-content bg-purple-light">{{ form.developEndTime }}</s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="6" class="grid-content bg-purple">测试审批开始时间：</s-col>
                      <s-col :span="18" class="grid-content bg-purple-light">{{ form.testStartTime }}</s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="6" class="grid-content bg-purple">测试审批结束时间：</s-col>
                      <s-col :span="18" class="grid-content bg-purple-light">{{ form.testEndTime }}</s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="6" class="grid-content bg-purple">部署审批开始时间：</s-col>
                      <s-col :span="18" class="grid-content bg-purple-light">{{ form.deployStartTime }}</s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="6" class="grid-content bg-purple">部署审批结束时间：</s-col>
                      <s-col :span="18" class="grid-content bg-purple-light">{{ form.deployEndTime }}</s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="6" class="grid-content bg-purple">关闭审批开始时间：</s-col>
                      <s-col :span="18" class="grid-content bg-purple-light">{{ form.closeStartTime }}</s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="6" class="grid-content bg-purple">关闭审批结束时间：</s-col>
                      <s-col :span="18" class="grid-content bg-purple-light">{{ form.closeEndTime }}</s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="6" class="grid-content bg-purple">已完成时间：</s-col>
                      <s-col :span="18" class="grid-content bg-purple-light">{{ form.finishTime }}</s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="6" class="grid-content bg-purple">已关闭时间：</s-col>
                      <s-col :span="18" class="grid-content bg-purple-light">{{ form.closeTime }}</s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="6" class="grid-content bg-purple">已取消时间：</s-col>
                      <s-col :span="18" class="grid-content bg-purple-light">{{ form.cancelTime }}</s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="6" class="grid-content bg-purple">已拒绝时间：</s-col>
                      <s-col :span="18" class="grid-content bg-purple-light">{{ form.refuseTime }}</s-col>
                    </s-row>
                  </div>
                </s-tab-pane>
                <s-tab-pane name="3" label="审批记录">
                  <s-row>
                    <s-row>
                      <div style="display: flex; flex-direction: row; justify-content: flex-start;">
                        <div style="display: flex; align-items: center">
                          <span style="font-weight: bold;">审批阶段:</span>
                        </div>
                        <s-select v-model="approveStage" @change="changeApproveStage" clearable style="margin-left: 15px;" clear>
                          <s-option v-for="(item, index) in approveStageArr" :label="item.name" :value="item.value"
                                    :key="index"></s-option>
                        </s-select>
                      </div>
                    </s-row>

                    <s-table-page
                      :data="approveDetailList"
                      >
                      <s-table-column prop="approveStageName" label="审批阶段" show-overflow-tooltip></s-table-column>
                      <s-table-column prop="executeSort" label="顺序" show-overflow-tooltip></s-table-column>
                      <s-table-column prop="approveUserName" label="审批人姓名" show-overflow-tooltip></s-table-column>
                      <s-table-column prop="approveResult" label="状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                          {{ scope.row.approveResult | filterApproveResult }}
                        </template>
                      </s-table-column>
                      <s-table-column prop="refuseReason" label="审批意见" show-overflow-tooltip>
                        <template slot-scope="scope">
                          {{ scope.row | filterRefuseReason }}
                        </template>
                      </s-table-column>
                      <s-table-column prop="executeTime" label="审批时间" show-overflow-tooltip>
                        <template slot-scope="scope">
                          {{ filterExecuteTime(scope.row.executeTime) }}
                        </template>
                      </s-table-column>
                    </s-table-page>
                  </s-row>
                </s-tab-pane>
              </s-tab>
            </s-col>
          </s-row>
        </s-scrollbar>
      </div>
      <s-row style="text-align: center; margin-top: 5px; margin-bottom: 0; margin-left: -195px">
        <s-button @click="savePublicOrderDetail" :disabled="disabledAll">保存</s-button>
        <s-button @click="nextStage" :disabled="disabledNextStep">下一阶段</s-button>
      </s-row>

      <!--发布详情打印预览-->
      <s-dialog
        title="发布详情打印预览" top="10%" width="600px"
        id="printPublishDetailDialog"
        ref="printPublishDetailDialog"
        v-if="printPublishDetailDialog"
        v-model="printPublishDetailDialog">
        <s-scrollbar wrap-style="max-height: 450px;">
          <print-publish-detail ref="preLookPrintPublish" :detail="detailData"></print-publish-detail>
        </s-scrollbar>
        <template slot="footer" class="dialog-footer">
          <s-button @click="printPublishDetail">打印</s-button>
        </template>
      </s-dialog>
      <div style="position: absolute; top: -9999px;">
        <print-publish-detail ref="storePrintPublishData" :detail="detailData"></print-publish-detail>
        <iframe frameborder="0" scrolling="no" ref="printPublishIframe" id="printPublishIframe"></iframe>
      </div>

      <!--回退-->
      <s-dialog
        title="回退"
        width="500px"
        ref="goBackDialog"
        v-if="goBackDialog"
        v-model="goBackDialog">
        <publish-go-back :orderData="form" @closeBack="closeGoBack"></publish-go-back>
      </s-dialog>

      <!--待决-->
      <s-dialog
        title="待决"
        width="500px"
        ref="waitDecideDialog"
        v-if="waitDecideDialog"
        v-model="waitDecideDialog">
        <publish-wait-decide :orderUuid="orderUuid" :publishStatus="form.publishStatus"
                             :waitDecideReason="form.paddingReasonMap" @closeWaitDec="handelCloseWaitDec"></publish-wait-decide>
      </s-dialog>

      <!--左侧上传附件-->
      <detail-upload-dialog v-if="uploadDialogFlag" v-model="uploadDialogFlag" @getWorkInfo="getOrderWorkDetail">
      </detail-upload-dialog>

      <!--关闭发布任务单-->
      <s-dialog
        title="关单"
        width="500px"
        ref="closeTaskOrderDialog"
        v-if="closeTaskOrderDialog"
        v-model="closeTaskOrderDialog">
        <close-order-dialog  ref="closeTaskOrderForm"></close-order-dialog>
        <template slot="footer" class="dialog-footer">
          <s-button @click="saveCloseTaskOrder">保存</s-button>
          <s-button type="cancel" @click="cancelCloseTaskOrder">取消</s-button>
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

      <!--创建任务单-->
      <s-dialog
        v-model="createTaskDialog"
        width="840px"
        title="创建任务单"
        v-if="createTaskDialog">
        <publish-create-task-order ref="createTask"></publish-create-task-order>
        <template slot="footer" class="dialog-footer">
          <s-button @click="createTaskOk">确定</s-button>
          <s-button type="cancel" @click="createTaskDialog=false">取消</s-button>
        </template>
      </s-dialog>

      <!--任务列表 指派任务单-->
      <s-dialog
        title="任务单指派"
        width="500px"
        ref="assignPublishOrderDialog"
        v-if="assignPublishOrderDialog"
        v-model="assignPublishOrderDialog">
        <assign-publish-order
          ref="assignPublishOrderFrom"
          :taskOrderUuid="taskOrderUuid"
          :companyUuid="companyUuid"
          :orderUuid = 'orderUuid'
          @refreshTaskOrderList = "getPublishTaskList"
          @cancelAssignPublishOrder="closeAssignDialog"></assign-publish-order>
      </s-dialog>

      <!--取消发布单-->
      <s-dialog
        title="发布单取消"
        v-if="cancelPublishDialog"
        v-model="cancelPublishDialog">
        <cancel-order ref="cancelPublishOrderForm"></cancel-order>
        <template slot="footer" class="dialog-footer">
          <s-button @click="saveCancelPublishOrder">确定</s-button>
          <s-button type="cancel" @click="cancelPublishDialog = false">取消</s-button>
        </template>
      </s-dialog>

      <!--任务列表 取消任务单-->
      <s-dialog
        title="任务单取消"
        v-if="cancelOrderDialog"
        v-model="cancelOrderDialog">
        <cancel-order ref="cancelTaskOrderForm"></cancel-order>
        <template slot="footer" class="dialog-footer">
          <s-button @click="saveCancelTaskOrder">确定</s-button>
          <s-button type="cancel" @click="cancelOrderDialog = false">取消</s-button>
        </template>
      </s-dialog>

      <!--创建变更单-->
      <s-dialog
        v-model="changeDialog"
        v-if="changeDialog"
        width="600px"
        class="createProcess"
        title="创建工单">
        <create-change ref="changeForm" @show-template="showOrderTemDialog"
                       :changePath="changePath" :riskLevel="riskLevel"
                       @show-riskTemplate="showRiskTemplate"></create-change>
        <template slot="footer" class="dialog-footer">
          <s-button @click="saveChangeOrder">保存</s-button>
          <s-button type="cancel" @click="changeDialog = false">关闭</s-button>
        </template>
      </s-dialog>
      <!--变更模板-->
      <order-template-dialog v-if="orderTemDialog" v-model="orderTemDialog" :cur-template="orderCurTemplate">
      </order-template-dialog>
      <!--变更风险问卷弹窗-->
      <change-risk-question
        v-model="changeRiskQuestion"
        v-if="changeRiskQuestion"
        :cur-template="riskTemplate"
        ref="changeRiskQuestion">
      </change-risk-question>

      <s-dialog
        title="添加工作信息" top="10%" width="600px"
        v-if="addWorkinfoFlag"
        v-model="addWorkinfoFlag">
        <s-form label-width="120px">
          <s-form-item label="工作信息" prop="content">
            <s-input v-model="content" type="textarea" :autosize="{ minRows: 3}"></s-input>
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
      <!--变更列表 取消变更单-->
      <s-dialog
        title="变更单取消"
        v-if="cancelChangeDialog"
        v-model="cancelChangeDialog">
        <cancel-order ref="cancelChangeOrderForm"></cancel-order>
        <template slot="footer" class="dialog-footer">
          <s-button @click="saveCancelChangeOrder">确定</s-button>
          <s-button type="cancel" @click="cancelChangeDialog = false">取消</s-button>
        </template>
      </s-dialog>

    </div>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  
  import {Validaters} from 'sunflower-common-utils'
  import workInfoDetail from '../Process_Components/WorkInfoDetail.vue';
  import publishCreateTaskOrder from './PublishCreateTaskOrder.vue';
  import assignPublishOrder from './AssignPublishOrder.vue';
  import cancelOrder from './CancelOrder.vue';
  import createChange from '@/home/ProcessCenter/ProcessCreatOrder/ChangeOrderDialog';
  import orderTemplateDialog from '@/home/ProcessCenter/ProcessCreatOrder/OrderTemplateDialog.vue';
  import changeRiskQuestion from '@/home/ProcessCenter/ProcessCreatOrder/ChangeRiskQuestionDialog.vue';
  import PublishGoBack from './PublishGoBack.vue';
  import PublishWaitDecide from './PublishWaitDecide.vue';
  import PrintPublishDetail from './PrintPublishDetail.vue';
  import DetailUploadDialog from './PublishDetailUpload.vue';
  import CloseOrderDialog from './DetailDialog/CloseOrderDialog.vue';
  import {NameCardHover} from '@/components/nameCard/NameCard';
  import authCheck from '@/common/mixins/auth.js'
  import {pick} from 'lodash'
  export default {
    mixins: [authCheck],
    data() {
      return {
        activeTab: '',
        inited: false,
        form: {
          planFinishTime: ''
        }, // 详情数据
        benefitCompanyArr: [],      // 受益人公司
        personNameArr: [],          // 受益人姓名（过滤前）
        benefitPersonNameArr: [],   // 受益人姓名 （过滤后）
        categoryFirstArr: [], // 分类一级
        categorySecondArr: [],  // 分类二级
        categoryThirdArr: [], // 分类三级
        managerGroupArr: [], // 发布经理组
        managerUserArr: [],  // 发布经理
        coordinateGroupArr: [],  // 发布协调员组
        coordinateUserArr: [], // 发布协调员用户
        planFinishTime: '',         // 目标完成时间
        categoryFirstOptions: [],
        detailData: {}, // 详情数据
        printPublishDetailDialog: false,       // 打印发布详情预览弹框
        printLoading: false,                // 打印发布详情预览弹框loading遮罩
        // 附件
        fileList: [],
        uploadDialogFlag: false, // 附件上传弹窗
        goBackDialog: false, // 回退弹窗
        waitDecideDialog: false, // 待决弹窗
        workDetail: [], // 工作详细信息
        content: '', // 工作信息 内容
        workInfoDialog: false,              // 查看信息详情弹框
        workInfoRow: {},       // 查看工作详细信息当前行的data
        taskOrderList: [], // 任务列表
        taskOrderArr: [], // 任务列表
        approveDetailList: [], // 审批记录
        createTaskDialog: false, // 创建任务单弹框
        publishTaskStage: '', // 发布阶段下拉框选中值 (任务单)
        publishChangeStage: '', // 发布阶段下拉框选中值 (变更单)
        assignPublishOrderDialog: false, // 指派任务单弹窗
        cancelOrderDialog: false, // 取消任务单弹窗
        cancelPublishDialog: false, // 取消发布单弹窗
        taskOrderUuid: '', // 任务单uuid
        companyUuid: '', // 公司uuid
        orderUuid: '', // 发布工单uuid
        ItilRole: [], // 权限相关
        disabledBackBtn: true, // 是否禁用回退按钮
        disabledPendingBtn: true, // 是否禁用待决按钮
        disPendingRecovery: true, // 是否禁用待决恢复按钮
        disabledCancelBtn: true, // 是否禁用取消按钮
        disabledAssignAndCancel: true, // 是否禁用指派按钮
        disabledAll: true, // 是否禁用保存按钮/表单可编辑性
        disabledNextStep: true, // 是否禁用下一阶段按钮
        changeDialog: false, // 创建变更单弹窗
        closeTaskOrderDialog: false, // 完成工单弹窗
        changePath: 0, // 变更路径
        riskLevel: 0,
        orderTemDialog: false, // 变更模板弹窗
        locked: true,
        orderCurTemplate: {},
        changeRiskQuestion: false, // 变更风险问卷弹窗
        changeOrderArr: [], // 变更列表
        changeOrderList: [], // 变更列表
        riskTemplate: {},
        cancelChangeDialog: false, // 取消变更单 弹窗
        changeOrderUuid: '', // 变更单UUid
        publishTaskStageArr: [ // 发布阶段 任务列表
//          {
//            name: '计划',
//            value: 2
//          },
          {
            name: '开发',
            value: 3
          },
          {
            name: '测试',
            value: 4
          },
          {
            name: '部署',
            value: 5
          },
          {
            name: '关闭',
            value: 6
          }
        ],
        approveStage: '', // 审批阶段选中值
        approveStageArr: [
          {
            name: '启动审批',
            value: 1
          },
          {
            name: '计划审批',
            value: 2
          },
          {
            name: '开发审批',
            value: 3
          },
          {
            name: '测试审批',
            value: 4
          },
          {
            name: '部署审批',
            value: 5
          },
          {
            name: '关闭审批',
            value: 6
          }
        ], // 审批阶段下拉内容
        categoryFirstProps: {
          label: 'name',
          value: 'uuid',
          children: 'childrenList'
        },
        rules: {
          serialCode: [{required: true, message: '不能为空', trigger: 'blur'}],
          benefitCompany: [{required: true, message: '不能为空', trigger: 'blur'}],
          benefitPersonName: [{required: true, message: '不能为空', trigger: 'blur'}],
          briefDesc: [{required: true, message: '不能为空', trigger: 'blur'}, Validaters.Max(100)],
          publishLevel: [{required: true, message: '不能为空', type: 'number', trigger: 'blur'}],
          businessReason: [{required: true, message: '不能为空', type: 'number', trigger: 'blur'}],
          publishType: [{required: true, message: '不能为空', type: 'number', trigger: 'blur'}],
          planFinishTime: [{required: true, type: 'number', message: '不能为空', trigger: 'blur'}],
          categoryFirst: [{required: true, message: '不能为空', trigger: 'blur'}],
          categorySecond: [{required: true, message: '不能为空', trigger: 'blur'}],
          impactLevel: [{required: true, message: '不能为空', type: 'number', trigger: 'blur'}],
          emergencyLevel: [{required: true, message: '不能为空', type: 'number', trigger: 'blur'}],
          priorityLevel: [{required: true, message: '不能为空', type: 'number', trigger: 'blur'}],
          riskLevel: [{required: true, message: '不能为空', type: 'number', trigger: 'blur'}],
          coordinateGroup: [{required: true, message: '不能为空', trigger: 'blur'}],
          coordinateUser: [{required: true, message: '不能为空', trigger: 'blur'}],
          publishStatusName: [{required: true, message: '不能为空', trigger: 'blur'}]
        },
        currentStep: 0,
        addWorkinfoFlag: false
      }
    },
    components: {
      workInfoDetail,
      publishCreateTaskOrder,
      assignPublishOrder,
      cancelOrder,
      createChange,
      orderTemplateDialog,
      changeRiskQuestion,
      PublishGoBack,
      PublishWaitDecide,
      PrintPublishDetail,
      DetailUploadDialog,
      CloseOrderDialog,
      NameCardHover
    },
    created() {
      $axios.get(`/itilWorkflowConfig/getItilRoleByUserUuid/${this.$store.state.userData.uuid}`).then((res) => {
        this.ItilRole = res.data
        this.uuid = this.$route.params.uuid;
        this.getInfo();
      })
    },
    methods: {
      addWorkInfoDialog() {
        this.addWorkinfoFlag = true
      },
      // 判断是否有变更权限
      getAuth() {
        if (this.ChangeAuth) {
          return '任务或变更'
        } else {
          return '任务'
        }
      },
      // 发布经理组Change事件
      handleMGChange(val) {
        if (val) {
          this.getManagerUser();
        }
        // 修改发布经理组时，清空发布经理
        this.form.managerUser = '';
      },
      // 获取发布经理组 下 发布经理用户, params => 发布经理组UUID
      async getManagerUser() {
        let resMU = await $axios.get(`/itilPublishOrder/getAllPubMangerByGroup/${this.form.managerGroup}`);
        this.managerUserArr = resMU.data;
      },
      // 进入流程图
      openPublishFlowChart() {
        this.$router.push(`/ProcessCenter/publishFlowchart/${this.form.serialCode}/${this.form.uuid}`)
      },
      printPublishDetail() {
        this.$refs.printPublishIframe.contentWindow.print()
      },
      // 切换右侧tab
      handleClick(tab) {
        switch (tab.name) {
          case '0':
            this.getOrderWorkDetail(this.form.uuid); // 获取工单 工作详细信息
            break;
          case '1':
            this.getPublishTaskList(this.form.uuid); // 获取任务列表
            this.getChangeOrderList(this.form.uuid); // 获取变更列表
            break;
          case '3':
            this.getPublishApproveDetail(this.form.uuid); // 获取审批记录
            break;
        }
      },
      // 获取详情
      getInfo() {
        return $axios.get(`/itilPublishOrder/getPublishOrderDetail/${this.uuid}`).then(res => {
                this.form = res.data;
                for (let i in this.form.paddingReasonMap) {
                  if (i === this.form.paddingReason) {
                    this.form.paddingReason = this.form.paddingReasonMap[i];
//                    return;
                  }
                }
                this.axiosCompanyArr().then(() => { this.axiosUserName(); })
                this.judgeRole(); // 判断权限
                this.currentStep = this.form.publishStage - 1; // 发布阶段
                this.publishTaskStage = this.publishChangeStage = this.form.publishStage; // 默认展示当前阶段的 任务/变更 列表
                this.planFinishTime = res.data.planFinishTime;
                this.handleTimeChange(res.data.planFinishTime); // 手动将时间转化为int类型
                // 获取所有 发布经理组
                this.getAllPublishMangerGroup().then(() => {
                  this.getAllPubMangerByGroup(this.form.managerGroup); // 获取 发布经理组 下 发布经理用户
                });
                // 获取所有 发布协调员组
                this.getAllPublishCoordGroup().then(() => {
                  this.getAllPubCoordByGroup(this.form.coordinateGroup); // 获取 发布协调员组 下 发布协调员用户
                });
                this.axiosCategoryFirst();  // 获取分类一级
                this.axiosCategoryOther().then(() => { this.axiosCategoryOther('categoryThird') }) // 获取分类二/三级
                this.activeTab = 0;
                this.handleClick({name: '0'});
                this.getOrderWorkDetail(this.form.uuid); // 获取工单 工作详细信息
                return this.form;
        })
      },
      axiosCompanyArr() {
        return $axios.get('/itilPublishOrder/getAllDepartInfo').then(res => {
          this.benefitCompanyArr = res.data;
          // if (this.benefitCompanyArr.length > 0) {
          //   this.form.benefitCompany = this.benefitCompanyArr[0].uuid;
          // }
          return this.benefitCompanyArr;
        })
      },
      axiosUserName() {
        return $axios.get('/itilPublishOrder/getAllUserInfo').then(res => {
          this.personNameArr = res.data;
          this.filterUser(this.personNameArr);
          return this.personNameArr;
        })
      },
      filterUser(val) {
        if (val.length > 0) {
          for (let i in val) {
            if (val[i].departUuid === this.form.benefitCompany) {
              this.benefitPersonNameArr.push(val[i])
            }
          }
        }
      },
      changeCompany(val) {
        if (val !== '') {
          this.form.benefitPersonName = '';
          this.benefitPersonNameArr = [];
          for (let i in this.personNameArr) {
            if (this.personNameArr[i].departUuid === val) {
              this.benefitPersonNameArr.push(this.personNameArr[i]);
            }
          }
        }
      },
      // 切换三级分类
      // 更换一级分类
      changeCF(val) {
        let param = {
          categoryFirst: val,
          companyUuid: this.form.companyUuid,
          ownerType: '5'
        }
        this.form.categorySecond = '';
        this.form.categoryThird = '';
        this.categorySecondArr = [];
        this.categoryThirdArr = [];
        return $axios.post('/ItilCommonWorkflow/getItilCategorySelect', param).then(res => {
          this.categorySecondArr = res.data;
          return this.categorySecondArr;
        })
      },
      // 更改二级分类
      changeCS(val) {
        let param = {
          categoryFirst: this.form.categoryFirst,
          companyUuid: this.form.companyUuid,
          ownerType: '5',
          categorySecond: val
        }
        this.form.categoryThird = '';
        this.categoryThirdArr = [];
        return $axios.post('/ItilCommonWorkflow/getItilCategorySelect', param).then(res => {
          this.categoryThirdArr = res.data;
          return this.categoryThirdArr;
        })
      },
      // 判断权限
      judgeRole() {
        let form = this.form;
        let publishStatus = form.publishStatus;
        let publishStage = form.publishStage;
        let curUuid = this.$store.state.userData.uuid; // 当前登录人uuid
        let isPublishCoordinator = false; // 是否为发布协调员
        let isPublishSubmitter = false; // 是否为发布提交人
        let isPublishManage = false;// 发布经理
        this.disabledBackBtn = this.disabledPendingBtn = this.disabledCancelBtn = this.disabledAssignAndCancel = this.disabledAll = this.disabledNextStep = true;
        // 判断当前登录人是否为发布协调员
        if (curUuid === form.coordinateUser) {
          isPublishCoordinator = true
        }
        // 判断当前登录人是否为发布提交人
        if (curUuid === form.createUser) {
          isPublishSubmitter = true;
        }
        // 判断当前登录人是否为发布经理
        if (curUuid === form.managerUser) {
          isPublishManage = true;
        }
        // 回退
        if (isPublishCoordinator && publishStatus === 7) {
          this.disabledBackBtn = false;
        }
        // 待决
        if ((isPublishSubmitter && publishStage === 1 && publishStatus !== 1) || (isPublishCoordinator && publishStatus === 7)) {
          this.disabledPendingBtn = false;
        }
        // 待决恢复
        if ((isPublishSubmitter && publishStage === 1) || isPublishCoordinator && publishStage !== 1) {
          this.disPendingRecovery = false;
        }
        // 取消
        if (isPublishSubmitter && publishStatus === 0) {
          this.disabledCancelBtn = false;
        }
        // 下一阶段
        if ((isPublishCoordinator || isPublishManage) && (publishStatus === 0 || publishStatus === 7 || publishStatus === 9)) {
          this.disabledNextStep = false;
        }
        // 保存
        if ((isPublishCoordinator || isPublishSubmitter || isPublishManage) && publishStatus < 10) {
          this.disabledAll = false;
        }
      },
      // 完成时间Change事件
      handleTimeChange(val) {
        if (val) {
          let date = new Date(val);
          this.form.planFinishTime = parseInt(date.getTime() / 1000);
        } else {
          this.form.planFinishTime = '';
        }
      },
      // 关注、取消关注
      addAttention() {
        if (this.form.concernUuid) {
          // 取消关注
          $axios.get('/ItilCommonWorkflow/cancelIncidentOrder/' + this.form.concernUuid).then((res) => {
            if (res.data.state) {
              this.form.concernUuid = ''
            }
            this.$message({type: res.data.state ? 'success' : 'error', message: res.data.errormsg})
          })
        } else {
          // 关注
          $axios.get('/ItilCommonWorkflow/concernIncidentOrder/' + this.form.uuid + '/5').then(res => {
            if (res.data) {
              this.form.concernUuid = res.data;
              this.$message({type: 'success', message: '关注成功'})
            } else {
              this.$message({type: 'error', message: '关注失败'})
            }
          })
        }
      },
      // 取消发布单
      cancelPublishOrder() {
        this.cancelPublishDialog = true
      },
      saveCancelPublishOrder() {
        let cancelReason = this.$refs['cancelPublishOrderForm'].cancelForm.cancel
        this.$refs['cancelPublishOrderForm'].$refs['cancelForm'].validate((valid) => {
          if (valid) {
            $axios.get(`/itilPublishOrder/publishOrderCancel/${this.form.uuid}/${cancelReason}`).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: '取消成功！'
                })
                this.cancelPublishDialog = false;
                this.getInfo();
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
      // 获取分类一级
      axiosCategoryFirst() {
        $axios.get('/ItilCommonWorkflow/getCompanyAndCategory/5').then(res => {
          this.categoryFirstArr = res.data[0].childrenList;
        })
      },
      // 获取分类二/三级
      axiosCategoryOther(type) {
        let param = {
          categoryFirst: this.form.categoryFirst,
          companyUuid: this.form.companyUuid,
          ownerType: '5'
        }
        if (type === 'categoryThird') {
          param = Object.assign({categorySecond: this.form.categorySecond}, param);
          return $axios.post('/ItilCommonWorkflow/getItilCategorySelect', param).then(res => {
            this.categoryThirdArr = res.data;
            return this.categoryThirdArr;
          })
        } else {
          return $axios.post('/ItilCommonWorkflow/getItilCategorySelect', param).then(res => {
            this.categorySecondArr = res.data;
            return this.categorySecondArr;
          })
        }
      },
      // 获取所有 发布经理组
      getAllPublishMangerGroup() {
        return $axios.get(`/itilPublishOrder/getAllPublishMangerGroup/${this.form.companyUuid}`).then(res => {
                  this.managerGroupArr = res.data;
                  return this.managerGroupArr;
               })
      },
      // 获取 发布经理组 下 发布经理用户
      getAllPubMangerByGroup(groupUuid) {
        return $axios.get(`/itilPublishOrder/getAllPubMangerByGroup/${groupUuid}`).then(res => {
          this.managerUserArr = res.data;
          return this.managerUserArr;
        })
      },
      // 获取所有 发布协调员组
      getAllPublishCoordGroup() {
        return $axios.get(`/itilPublishOrder/getAllPublishCoordGroup/${this.form.companyUuid}`).then(res => {
          this.coordinateGroupArr = res.data;
          return this.coordinateGroupArr;
        })
      },
      // 获取 发布协调员组 下 发布协调员用户
      getAllPubCoordByGroup(groupUuid) {
        return $axios.get(`/itilPublishOrder/getAllPubCoordByGroup/${groupUuid}`).then(res => {
          this.coordinateUserArr = res.data;
          return this.coordinateUserArr;
        })
      },
      // 获取工单 工作详细信息
      getOrderWorkDetail(publishOrderUuid) {
        return $axios.get(`/itilPublishOrder/serachItilLog/${publishOrderUuid}`).then(res => {
          if (res.data.length > 0) {
            for (let i in res.data) {
              if (res.data[i].attachmentList) {
                if (res.data[i].attachmentList.length > 0) {
                  res.data[i].fileNum = res.data[i].attachmentList.length;
                }
              } else {
                res.data[i].fileNum = 0;
              }
            }
            this.workDetail = res.data;
            return this.workDetail;
          }
        })
      },
      // 发布工单 保存【更新】
      savePublicOrderDetail() {
        this.$refs.form.validate(valid => {
          if (valid) {
            $axios.post('/itilPublishOrder/uptPublishOrder', pick(this.form, ['uuid', 'benefitCompany', 'benefitPersonName',
              'briefDesc', 'detailDesc', 'publishLevel', 'publishStage',
              'businessReason', 'publishType', 'appSystem', 'planFinishTime', 'companyUuid', 'categoryFirst',
              'categorySecond', 'categoryThird', 'impactLevel', 'emergencyLevel', 'priorityLevel', 'riskLevel',
              'managerGroup', 'managerUser', 'coordinateGroup', 'coordinateUser'])).then(res => {
              if (res.data.state === true) {
                this.getInfo();
                this.$message({type: 'success', message: res.data.errormsg})
              } else {
                this.$message({type: 'error', message: res.data.errormsg})
              }
            })
          }
        })
      },
      // 回退
      goBack() {
        this.goBackDialog = true
      },
      // 关闭回退弹框
      closeGoBack(flag) {
        if (flag !== 'cancle') {
          this.getInfo();
        }
        this.goBackDialog = false;
      },
      // 待决
      waitDecide() {
        this.waitDecideDialog = true
        this.orderUuid = this.form.uuid;
      },
      // 待决弹框关闭
      handelCloseWaitDec(flag) {
        if (flag !== 'cancle') {
          this.getInfo();
        }
        this.waitDecideDialog = false
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
      },
      // 添加工作信息
      addWorkInfo() {
        if (this.fileList.length > 0 || this.content.length > 0) {
          if (this.content.length > 500) {
            this.$message('工作信息最大长度为500!')
            return
          }
          this.$confirm('确定添加?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let uuid = (this.fileList || []).map((item) => {
              return item.attachuuid
            })
            let param = {
              relationOrderUuid: this.form.uuid,
              orderType: 5,
              logDetail: this.content,
              attachments: uuid.join(',')
            }
            this.fileList = []
            this.$refs.uploadField.clearFiles()
            this.content = '';
            $axios.post(`/ItilCommonWorkflow/saveOrderLog`, param).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: '添加成功！'
                })
                this.addWorkinfoFlag = false
                this.getInfo();
              } else {
                this.$message({
                  type: 'error',
                  message: '添加失败！'
                })
              }
            })
          }).catch(() => {});
        } else {
          this.$message('请填写工作信息!')
        }
      },
      // 获取任务列表
      getPublishTaskList(orderUuid) {
        return $axios.get(`/itilPublishOrder/getPublishTaskList/${orderUuid}`).then(res => {
          this.taskOrderList = res.data;
          this.taskOrderArr = res.data;
          if (this.taskOrderArr.length > 0) {
            let newArr = [];
            this.taskOrderArr.forEach((item) => {
              if (item.publishStage === this.publishTaskStage) {
                newArr.push(item);
              }
              item.taskAssignDisabled = this.judgeAssignCancel(item).assign;
              item.taskCancelDisabled = this.judgeAssignCancel(item).cancel;
              item.canUse = this.judgeCanUse(item).canUse;
            })
            this.taskOrderList = newArr;
          }
          return this.taskOrderList;
        })
      },
      // 获取任务列表 并 过滤
      changePublishTaskStage() {
        if (this.taskOrderArr.length > 0) {
          let newArr = [];
          for (let i in this.taskOrderArr) {
            if (this.taskOrderArr[i].publishStage === this.publishTaskStage) {
              newArr.push(this.taskOrderArr[i]);
            }
          }
          this.taskOrderList = newArr;
        }
      },
      // 查看右侧工作详细信息
      checkWorkDetail(index, row) {
        this.workInfoDialog = true
        this.workInfoRow = row
      },
      // 查询任务列表
      getTaskSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入任务单号、任务标题进行搜索',
          searchProps: ['serialCode', 'title']
        }
      },
      // 显示创建任务单dialog
      showCreateTaskOrder() {
        this.createTaskDialog = true
      },
      // 创建任务
      createTaskOk() {
        this.$refs['createTask'].$refs['createTaskForm'].validate((valid) => {
          if (valid) {
            $axios.post(`itilPublishOrder/savePublishTask`,
              Object.assign({}, this.$refs['createTask'].form,
                {changeOrderUuid: this.form.uuid, orderType: 5, publishStage: this.form.publishStage + 1})).then((res) => {
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
              this.createTaskDialog = false;
              this.getPublishTaskList(this.form.uuid);
            })
          } else {
            this.$message({
              type: 'error',
              message: '请填写必要内容!'
            })
          }
        });
      },
      // 判断按钮是否可用（升序、降序）
      judgeCanUse(data) {
        let curUuid = this.$store.state.userData.uuid;
        let form = this.form;
        if ((curUuid === form.coordinateUser || curUuid === form.managerUser) && form.publishStatus === 7 && (data.publishStage === parseInt(form.publishStage + 1)) && data.taskStatus === 1) {
          return {canUse: false}
        } else {
          return {canUse: true}
        }
      },
      // 判断任务单按钮是否可用（指派、取消）
      judgeAssignCancel(data) {
        let curUuid = this.$store.state.userData.uuid;
        let form = this.form;
        if ((curUuid === form.coordinateUser || curUuid === form.managerUser) && form.publishStatus === 7 && data.publishStage === form.publishStage && data.taskStatus <= 3) {
          return {assign: false, cancel: false}
        } else {
          return {assign: true, cancel: true}
        }
      },
      // 显示指派给他人弹窗
      showAssignDialog(index, row) {
        this.assignPublishOrderDialog = true;
        this.taskOrderUuid = row.uuid;
        this.orderUuid = row.changeOrderUuid;
        this.companyUuid = row.companyUuid
      },
      // 关闭指派给他人弹窗
      closeAssignDialog() {
        this.assignPublishOrderDialog = false;
      },
     // 显示取消任务单弹窗
      showCancelDialog(index, row) {
        this.cancelOrderDialog = true;
        this.taskOrderUuid = row.uuid;
        this.orderUuid = row.changeOrderUuid;
      },
      // 保存 '取消'操作
      saveCancelTaskOrder() {
        let cancelReason = this.$refs['cancelTaskOrderForm'].cancelForm.cancel
        this.$refs['cancelTaskOrderForm'].$refs['cancelForm'].validate((valid) => {
          if (valid) {
            let param = {
              taskUuid: this.taskOrderUuid,
              cancelReason: cancelReason
            }
            $axios.post('/itilChangeOrder/changeTaskCancel', param).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: '取消成功！'
                })
                this.cancelOrderDialog = false;
                this.getPublishTaskList(this.orderUuid);
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
      // 点击跳转详情
      goDetail(orderType, row) {
        switch (orderType) {
          case '变更':
            this.goto('/ProcessCenter/modifyDetail/' + row.uuid);
            break;
          case '任务':
            this.goto('/ProcessCenter/publishTaskOrderDetail/' + row.uuid);
            break;
        }
      },
      goto(path) {
        this.$router.push(path)
      },
      // 升序 任务单
      ascendingTaskOrder(index, row) {
        // 置灰的同时阻止点击事件
        if (row.canUse) {
          event.stopPropagation()
        } else {
          if (row.taskSort !== 1) {
            let sort = row.taskSort - 1;
            $axios.get(`/itilPublishOrder/sortPublishTask/${row.changeOrderUuid}/${row.uuid}/${row.publishStage}/${sort}`).then(res => {
              if (res.data.state) {
                this.$message({type: 'success', message: '设置成功'})
                this.getPublishTaskList(this.form.uuid);
              } else {
                this.$message({type: 'error', message: '设置失败'})
              }
            })
          }
        }
      },
      // 降序 任务单
      descendingTaskOrder(index, row) {
        // 置灰的同时阻止点击事件
        if (row.canUse) {
          event.stopPropagation()
        } else {
          let sort = row.taskSort + 1;
          $axios.get(`/itilPublishOrder/sortPublishTask/${row.changeOrderUuid}/${row.uuid}/${row.publishStage}/${sort}`).then(res => {
            if (res.data.state) {
              this.$message({type: 'success', message: '设置成功'})
              this.getPublishTaskList(this.form.uuid);
            } else {
              this.$message({type: 'error', message: '设置失败'})
            }
          })
        }
      },
      // 下一阶段
      nextStage() {
        // 如果工单处于 完成状态，点击下一阶段，需要弹出关闭窗口
        if (this.form.publishStatus === 9) {
          this.closeTaskOrderDialog = true;
        } else {
          this.$refs.form.validate(valid => {
            if (valid) {
              $axios.post('/itilPublishOrder/nextStep', pick(this.form, ['uuid', 'benefitCompany', 'benefitPersonName',
                'briefDesc', 'detailDesc', 'publishLevel', 'publishStage',
                'businessReason', 'publishType', 'appSystem', 'planFinishTime', 'companyUuid', 'categoryFirst',
                'categorySecond', 'categoryThird', 'impactLevel', 'emergencyLevel', 'priorityLevel', 'riskLevel',
                'managerGroup', 'managerUser', 'coordinateGroup', 'coordinateUser', 'publishStatus'])).then(res => {
                if (res.data.state === true) {
                  this.getInfo();
                } else {
                  this.$message({type: 'error', message: res.data.errormsg})
                }
              })
            }
          })
        }
      },
      saveCloseTaskOrder() {
        let closeCode = this.$refs['closeTaskOrderForm'].closeform.closeCode
        $axios.get(`/itilPublishOrder/publishOrderClose/${this.form.uuid}/${closeCode}`).then(res => {
          if (res.data.state === true) {
            this.getInfo()
            this.closeTaskOrderDialog = false
            this.$message({
              type: 'success',
              message: '关单成功！'
            })
          } else {
            this.$message({
              type: 'error',
              message: '关单失败，请重试！'
            })
          }
        })
      },
      cancelCloseTaskOrder() {
        this.closeTaskOrderDialog = false;
      },
      showOrderTemDialog(template) {
        this.orderTemDialog = true;
        this.orderCurTemplate = template;
      },
      showRiskTemplate(template) {
        this.changeRiskQuestion = true;
        this.riskTemplate = template;
      },
      saveChangeOrder() {
        if (this.locked) {
          this.$refs['changeForm'].$refs['Form'].validate(valid => {
            if (!valid) return;
            let form = this.$refs['changeForm'].form;
            this.locked = false;
            $axios.post('/itilPublishOrder/saveChangeOrder', Object.assign({}, form, {
              publishOrderUuid: this.form.uuid,
              publishStage: this.form.publishStage + 1
            })).then((res) => {
              if (res.data.state) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.changeDialog = false;
                this.getChangeOrderList(this.form.uuid);
                this.locked = true;
              } else {
                this.locked = true;
                this.$message({
                  message: res.data.errormsg,
                  type: 'error'
                });
              }
            })
          })
        }
      },
      showCreateChangeOrder() {
        this.changeDialog = true;
      },
      // 获取变更列表
      getChangeOrderList(orderUuid) {
        return $axios.get(`/itilPublishOrder/getPublishChangeList/${orderUuid}`).then(res => {
          this.changeOrderList = res.data;
          this.changeOrderArr = res.data;
          if (this.changeOrderArr.length > 0) {
            let newArr = [];
            this.changeOrderArr.forEach((item) => {
              if (item.publishStage === this.publishChangeStage) {
                newArr.push(item);
              }
              item.disabledChangeOrderCancel = this.judgeChangeCancel(item).disabledChangeOrderCancel;
              item.canSort = this.judgeChangeSort(item).canSort;
            })
            this.changeOrderList = newArr;
          }
          return this.changeOrderList;
        })
      },
      // 判断变更单取消是否禁用
      judgeChangeCancel(item) {
        let curUuid = this.$store.state.userData.uuid;
        let form = this.form;
        if ((curUuid === form.coordinateUser || curUuid === form.managerUser) && form.publishStatus === 7 && item.publishStage === form.publishStage && item.changeStatus <= 7) {
          return {disabledChangeOrderCancel: false}
        } else {
          return {disabledChangeOrderCancel: true}
        }
      },
      judgeChangeSort(item) {
        let curUuid = this.$store.state.userData.uuid;
        let form = this.form;
        if ((curUuid === form.coordinateUser || curUuid === form.managerUser) && form.publishStatus === 7 && (item.publishStage === parseInt(form.publishStage + 1)) && item.changeStatus === 1) {
          return {canSort: false}
        } else {
          return {canSort: true}
        }
      },
      // 搜索变更单
      getChangeSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入变更单号、简要描述进行搜索',
          searchProps: ['serialCode', 'briefDesc', 'createUserName']
        }
      },
      // 过滤变更列表
      changeOrderStage() {
        if (this.changeOrderArr.length > 0) {
          let newArr = [];
          for (let i in this.changeOrderArr) {
            if (this.changeOrderArr[i].publishStage === this.publishChangeStage) {
              newArr.push(this.changeOrderArr[i]);
            }
          }
          this.changeOrderList = newArr;
        }
      },
      // 显示取消变更单弹窗
      showCancelChangeDialog(index, row) {
        this.cancelChangeDialog = true;
        this.changeOrderUuid = row.uuid;
      },
      // 保存 ‘取消’变更单
      saveCancelChangeOrder() {
        let cancelReason = this.$refs['cancelChangeOrderForm'].cancelForm.cancel
        this.$refs['cancelChangeOrderForm'].$refs['cancelForm'].validate((valid) => {
          if (valid) {
            let param = {
              orderUuid: this.changeOrderUuid,
              cancelReason: cancelReason
            }
            $axios.post('/itilPublishOrder/changeOrderCancel', param).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: '取消成功！'
                })
                this.cancelChangeDialog = false;
                this.getChangeOrderList(this.form.uuid);
              } else {
                this.$message({
                  type: 'error',
                  message: data.errormsg
                })
              }
            })
          } else {
            return false
          }
        })
      },
      // 变更单 升序
      ascendingChangeOrder(index, row) {
        if (row.changeSort !== 1) {
          let sort = row.changeSort - 1;
          $axios.get(`/itilPublishOrder/sortChangeOrder/${row.publishOrderUuid}/${row.uuid}/${row.publishStage}/${sort}`).then(res => {
            if (res.data.state) {
              this.$message({
                type: 'success',
                message: '设置成功！'
              })
              this.getChangeOrderList(this.form.uuid);
            } else {
              this.$message({
                type: 'error',
                message: '设置失败！'
              })
            }
          })
        }
      },
      // 变更单 降序
      descendingChangeOrder(index, row) {
        let sort = row.changeSort + 1;
        $axios.get(`/itilPublishOrder/sortChangeOrder/${row.publishOrderUuid}/${row.uuid}/${row.publishStage}/${sort}`).then(res => {
          if (res.data.state) {
            this.$message({
              type: 'success',
              message: '设置成功！'
            })
            this.getChangeOrderList(this.form.uuid);
          } else {
            this.$message({
              type: 'error',
              message: '设置失败！'
            })
          }
        })
      },
      // 获取审批记录
      getPublishApproveDetail(orderUuid) {
        return $axios.get(`/itilPublishOrder/getPublishApproveDetail/${orderUuid}`).then(res => {
          this.approveDetailList = res.data;
          this.approveDetailArr = res.data;
          if (this.approveDetailArr.length > 0) {
            let newArr = [];
            this.approveDetailArr.forEach((item) => {
              if (this.approveStage === '') {
                newArr.push(item);
              } else if (this.approveStage !== '') {
                if (item.approveStage === this.approveStage) {
                  newArr.push(item);
                }
              }
            })
            this.approveDetailList = newArr;
          }
          return this.approveDetailList;
        })
      },
      changeApproveStage(val) {
        if (this.approveDetailArr.length > 0) {
          let newArr = [];
          this.approveDetailArr.forEach((item) => {
            if (val === '') {
              newArr.push(item);
            } else if (val !== '') {
              if (val === item.approveStage) {
                newArr.push(item);
              }
            }
          })
          this.approveDetailList = newArr;
        }
      },
      // 待决恢复
      recoveryDecide() {
        $axios.get(`/itilPublishOrder/publishOrderPengingRecover/${this.form.uuid}`).then(res => {
          if (res.data.state === true) {
            this.$message({type: 'success', message: '待决已恢复!'})
            this.getInfo();
          } else {
            this.$message({type: 'error', message: '待决恢复失败，请重试！'})
          }
        })
      },
      // 打开打印变更详情弹框
      showPrintDialog() {
        this.detailData = Object.assign({}, this.form);
        this.printPublishDetailDialog = true
        let theme = document.querySelector('#sunflower-theme').href
        this.$refs.printPublishIframe.contentWindow.document.head.innerHTML = `
          <link rel="stylesheet" href="${theme}"></link>
          <link rel="stylesheet" href="../../../static/css/index.css"></link>`
        this.$refs.printPublishIframe.contentWindow.document.body.appendChild(this.$refs.storePrintPublishData.$el)
      },
      // 附件上传
      showUploadDialog() {
        this.uploadDialogFlag = true;
      },
      // 右侧工作详细信息
      serachItilLog() {
        $axios.get(`/itilIncidentCenter/serachItilLog/${this.orderUuid}`).then(({data}) => {
          if (data instanceof Array) {
            this.workInfoData = data
          }
        })
      },
      filterExecuteTime(val) {
        if (val !== '' && val !== null) {
          return new Date(val * 1000).toLocaleString();
        } else {
          return '';
        }
      }
    },
    computed: {
      workInfoUrl() {
        return `${$axios.basePath()}/fileUpload/uploadItilattach`
      },
      disabledCreateBtn() {
        let curUuid = this.$store.state.userData.uuid;
        let form = this.form;
        let publishStage = form.publishStage;
        let publishStatus = form.publishStatus;
        if ((curUuid === form.coordinateUser || curUuid === form.managerUser) && (publishStage >= 2 && publishStage <= 5) && publishStatus === 7) {
          return false;
        } else {
          return true;
        }
      },
      loginUserId() {
        return this.$store.state.userData.uuid
      }
    },
    filters: {
      filterPublishStage(val) {
        // 1-启动 2-计划 3-开发 4-测试 5-部署 6-关闭
        switch (val) {
          case 1:
            return '启动';
          case 2:
            return '计划';
          case 3:
            return '开发';
          case 4:
            return '测试';
          case 5:
            return '部署';
          case 6:
            return '关闭';
        }
      },
      filterChangePublishStage(val) {
        switch (val) {
          case 3:
            return '开发';
          case 4:
            return '测试';
          case 5:
            return '部署';
          case 6:
            return '关闭';
        }
      },
      filterApproveResult(val) {
        switch (val) {
          case 0:
            return '已拒绝';
          case 1:
            return '已审批';
          case 2:
            return '未审批';
        }
      },
      filterRefuseReason(row) {
        if (row.approveResult === 1 && row.refuseReason === null) {
          return '通过';
        } else {
          return row.refuseReason;
        }
      }
    },
    watch: {
      'publishTaskStage': {
        handler: function (val) {
          if (val !== 1 && val !== 5 && val !== 6) {
            if (val > parseInt(this.form.publishStage + 1)) {
              this.canUse = false;
            } else {
              this.canUse = true;
            }
          } else {
            this.canUse = true;
          }
        }
      },
      'form.pendingReason': {
        handler: function (val) {
          if (val !== '') {
            for (let i in this.form.paddingReasonMap) {
              if (i === val) {
                this.form.pendingReason = this.form.paddingReasonMap[i];
              }
            }
          }
        }
      },
      'form.closeCode': {
        handler: function (val) {
          if (val !== '') {
            for (let i in this.form.closeCodeMap) {
              if (parseInt(i) === val) {
                this.form.closeCode = this.form.closeCodeMap[i];
              }
            }
          }
        }
      }
    }
  }
</script>

<style lang="stylus">
  // 创建工单
  .createProcess
    .s-form-item-content
      & > .s-input, .s-select, .s-textarea, .upload
        width: calc(100% - 49px)
  #printPublishIframe
    width 100%
    min-height 500px
  #printPublishDetailDialog
    .s-dialog-body
      padding-bottom 0
    .s-dialog-footer
      padding-top 0
</style>
