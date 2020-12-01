<template>
  <div class="processDetail processServiceDetail" style="display: flex;">
    <div style="width: 175px; margin-right: 20px">
      <div class="process-detail-title">
        <span class="process-detail-text">服务请求</span>
      </div>
      <div class="leftMenu">
        <div class="title">-- 功能菜单 --</div>
        <s-button class="attention attention-empty" v-if="orderForm.isConcern===1" @click="cancelAttention">取消关注</s-button>
        <s-button class="attention" v-else @click="attention">关注</s-button>
        <s-button @click="assignToMe"  icon="click" :disabled="allDisabled && assignToMeDisabled">指派给我</s-button>
        <s-button @click="assignToOthers" icon="assist" :disabled="allDisabled && assignToOthersDisabled">指派给他人</s-button>
        <s-button @click="waitDecideBack" icon="retreat" :disabled="allDisabled && retreatDisabled" v-if="orderForm.status===9">待决恢复</s-button>
        <s-button @click="waitDecide" icon="underway" :disabled="allDisabled && waiteDeviceDisabled" v-else>待决</s-button>
        <s-button @click="cancelHandle" icon="cancel" :disabled="allDisabled && cancleDisabled">取消</s-button>
        <s-button @click="createAssociation" icon="bangding">创建关联关系</s-button>
        <s-button @click="openModifyFlowchart" icon="manage-process">流程图</s-button>
        <s-button @click="knowDialog = true" icon="association" :disabled="allDisabled && createKnowDisabled">创建知识库</s-button>
        <s-button @click="searchKnowledge" icon="association" :disabled="allDisabled && searchKnowDisabled">搜索知识库</s-button>
        <s-button @click="showPrintDialog" icon="printer">打印</s-button>
        <s-button @click="showUploadDialog" icon="export">附件上传</s-button>
      </div>
      <div class="leftMenu">
        <div class="title">-- SLA状态 --</div>
        <div style="margin:0 10px">
          <div class="leftSla" style="font-size: 14px;margin: 10px 0;">响应目标时间
            <span class="tag tag-warning" v-if="slaStatus.responseStatus === 1" >警告</span>
            <span class="tag tag-sucess" v-else-if="slaStatus.responseStatus === 2">满足</span>
            <span class="tag tag-error" v-else-if="slaStatus.responseStatus === 3">不满足</span>
            <span class="tag tag-disabled" v-else-if="slaStatus.responseStatus === 4" >已废弃</span>
            <span class="tag tag-ing" v-else-if="slaStatus.responseStatus === 5" >进行中</span>
          </div>
          <s-input :disabled="true" v-model="slaStatus.responseTime"></s-input>
          <div class="leftSla" style="font-size: 14px;margin: 10px 0;">解决目标时间
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
      <s-steps :current="currentStep" finish-status="success" step-width="calc(20% - 23px)" style="margin-left: 15px">
        <s-step title="启动"></s-step>
        <s-step title="审批"></s-step>
        <s-step title="执行"></s-step>
        <s-step title="完成"></s-step>
        <s-step title="关闭"></s-step>
      </s-steps>
      <div style="margin-top: 20px">
        <s-scrollbar wrap-style="max-height: calc(100vh - 215px);">
          <s-row :gutter="20" style="margin: 0 0 0 0">
            <s-col span="10" class="formContainer">
              <s-form :model="orderForm" :rules="orderRules" ref="orderForm" label-width="120px">
                <s-form-item label="请求编号" prop="serialCode">
                  <s-input v-model="orderForm.serialCode" disabled></s-input>
                </s-form-item>
                <s-form-item label="最终用户公司" prop="endCompany">
                  <s-select v-model="orderForm.endCompany"
                            style="width: 100%"
                            :disabled="formDisabled && allDisabled">
                    <s-option v-for="item in endCompanyList" :label="item.departName" :value="item.uuid"
                              :key="item.uuid"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="最终用户姓名" prop="endUser">
                  <NameCardHover :useruuid="orderForm.endUser" :placement="'right'">
                    <s-select v-model="orderForm.endUser"
                              @focus="getendUser"
                              style="width: 100%"
                              :disabled="formDisabled && allDisabled">
                      <s-option v-for="item in endUserList" :label="item.userRealName" :value="item.uuid"
                                :key="item.uuid"></s-option>
                    </s-select>
                  </NameCardHover>
                </s-form-item>
                <s-form-item label="简要描述" prop="briefDesc">
                  <s-input v-model="orderForm.briefDesc" type="textarea" :rows="3" :disabled="formDisabled && allDisabled"></s-input>
                </s-form-item>
                <s-form-item label="详细描述" prop="detailDesc">
                  <s-input v-model="orderForm.detailDesc" type="textarea" :rows="3" :disabled="formDisabled && allDisabled"></s-input>
                </s-form-item>
                <s-form-item label="分类一级" prop="categoryFirst">
                  <s-select v-model="orderForm.categoryFirst"
                            :anonLabel="orderForm.categoryFirstName"
                            style="width: 100%"
                            :disabled="formDisabled && allDisabled">
                    <s-option v-for="item in categoryFirstList" :label="item.categoryName" :value="item.uuid"
                              :key="item.uuid"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="分类二级" prop="categorySecond">
                  <s-select v-model="orderForm.categorySecond"
                            :anonLabel="orderForm.categorySecondName"
                            style="width: 100%"
                            :disabled="formDisabled && allDisabled">
                    <s-option v-for="item in categorySecondList" :label="item.categoryName" :value="item.uuid"
                              :key="item.uuid"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="分类三级" prop="categoryThird">
                  <s-select v-model="orderForm.categoryThird"
                            :anonLabel="orderForm.categoryThirdName"
                            clearable
                            style="width: 100%"
                            :disabled="formDisabled && allDisabled">
                    <s-option v-for="item in categoryThirdList" :label="item.categoryName" :value="item.uuid"
                              :key="item.uuid"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="应用系统" prop="application">
                  <s-input v-model="orderForm.application" :disabled="formDisabled && allDisabled"></s-input>
                </s-form-item>
                <s-form-item label="目标完成时间" prop="expectTime">
                  <s-input v-model="orderForm.expectTime" :disabled="formDisabled && allDisabled"></s-input>
                </s-form-item>
                <s-form-item label="优先级" prop="">
                  <s-select v-model="orderForm.priority"
                            style="width: 100%"
                            :disabled="formDisabled && allDisabled">
                    <s-option v-for="(value, key) in orderForm.criticality" :label="value" :value="Number(key)"
                              :key="key"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="请求管理员组" prop="managerGroup">
                  <s-select v-model="orderForm.managerGroup"
                            :anonLabel="orderForm.managerGroupName"
                            style="width: 100%"
                            :disabled="formDisabled && allDisabled">
                    <s-option v-for="item in managerGroupList" :label="item.groupName" :value="item.uuid"
                              :key="item.uuid"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="请求管理员" prop="managerUser">
                  <NameCardHover :useruuid="orderForm.managerUser" :placement="'right'">
                    <s-select v-model="orderForm.managerUser"
                              :anonLabel="orderForm.managerUserName"
                              @focus="getAllChangemanagerUser"
                              style="width: 100%"
                              :disabled="formDisabled && allDisabled">
                      <s-option v-for="item in managerUserList" :label="item.userRealName" :value="item.uuid"
                                :key="item.uuid"></s-option>
                    </s-select>
                  </NameCardHover>
                </s-form-item>
                <s-form-item label="请求受派组：" prop="assigneGroup">
                  <s-select v-model="orderForm.assigneGroup"
                            style="width: 100%"
                            :anonLabel="orderForm.assigneGroupName"
                            :disabled="formDisabled && allDisabled">
                    <s-option v-for="(item, i) in adminGroup" :label="item.groupName" :value="item.uuid" :key="i"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="请求受派者：" prop="assigneUser">
                  <NameCardHover :useruuid="orderForm.assigneUser" :placement="'right'">
                    <s-select v-model="orderForm.assigneUser"
                              @focus="getRequestOrderUser"
                              style="width: 100%"
                              :anonLabel="orderForm.assigneUserName"
                              :disabled="formDisabled && allDisabled">
                      <s-option v-for="(item, i) in adminUser" :label="item.userRealName" :value="item.uuid" :key="i"></s-option>
                    </s-select>
                  </NameCardHover>
                </s-form-item>
                <s-form-item label="状态" prop="status">
                  <s-select v-model="orderForm.status" disabled style="width: 100%">
                    <s-option :label="orderForm.statusName" :value="orderForm.status"
                              :key="orderForm.status"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="待决理由" prop="refuseReason">
                  <s-input v-model="orderForm.refuseReason" type="textarea" :rows="3" disabled></s-input>
                </s-form-item>
                <s-form-item label="取消原因" prop="cancleReason">
                  <s-input v-model="orderForm.cancleReason" type="textarea" :rows="3" disabled></s-input>
                </s-form-item>
                <s-form-item label="关闭代码" prop="closeCode">
                  <s-select v-model="orderForm.closeCode" style="width: 100%" disabled>
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
              </s-form>
            </s-col>
            <s-col span="14" id="requestServiceRight" class="detailBox">
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
                <s-tab-pane name="3" label="请求内容">
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
                        v-model="serviceRequestForm.valueList[idx].attributeValue" v-if="item.htmlType==='udf_char_list'&&item.colnumName!=='当前人员角色'">
                        <s-option
                          v-for="(option, idx) in item.listvalues"
                          :label="option.listvalues" :value="option.listvalues" :key="idx"></s-option>
                      </s-select>
                      <s-select
                        placeholder="请选择" style="width:100%;" disabled :multiple="true"
                        v-model="serviceRequestForm.valueList[idx].attributeValue" v-if="item.htmlType==='udf_char_list'&&item.colnumName==='当前人员角色'">
                        <s-option
                          v-for="(option, idx) in item.listvalues"
                          :label="option.label" :value="option.value" :key="idx"></s-option>
                      </s-select>
                      <!--时间日期-->
                      <s-date-picker
                        :type="timeType(serviceRequestForm.valueList[idx].attributeValue)" placeholder="选择日期时间" style="width: 100%;" disabled
                        v-model="serviceRequestForm.valueList[idx].attributeValue" v-if="item.htmlType==='udf_date'"></s-date-picker>
                    </s-form-item>
                  </s-form>
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
                      <s-col :span="5" class="grid-content bg-purple">草稿时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.draftTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">启动审批开始时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.startTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">启动审批结束时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.endTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">接单时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.acceptTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">已完成时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.finishTimeStr }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">已关闭时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.closeTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">已取消时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.cancelTime }} </s-col>
                    </s-row>
                    <s-row>
                      <s-col :span="5" class="grid-content bg-purple">已拒绝时间：</s-col>
                      <s-col :span="19" class="grid-content bg-purple-light"> {{ orderForm.refuseTime }} </s-col>
                    </s-row>
                  </div>
                </s-tab-pane>
                <s-tab-pane name="4" label="审批记录">
                  <s-table-page
                    ref="approval"
                    :data="approvalList"

                    :header-search="getSearchDef()">
                    <s-table-column label="顺序" prop="executeSort"></s-table-column>
                    <s-table-column label="审批人姓名" prop="approveUserName"></s-table-column>
                    <s-table-column label="拒绝原因" prop="refuseReason"></s-table-column>
                    <s-table-column label="审批时间" prop="executeTimeStr"></s-table-column>
                  </s-table-page>
                </s-tab-pane>
              </s-tab>
            </s-col>
          </s-row>
        </s-scrollbar>
      </div>
      <s-row style="text-align: center; margin-top: 5px; margin-bottom: 0; margin-left: -195px">
        <s-button @click="saveOrder" :disabled="allDisabled && saveDisabled">保存</s-button>
        <s-button @click="orderTakling" :disabled="allDisabled && acceptDisabled">接单</s-button>
        <s-button @click="finishOrder" :disabled="allDisabled && completeDisabled">完成</s-button>
        <s-button @click="closeOrder" :disabled="allDisabled && closeDisabled">关单</s-button>
      </s-row>
    </div>

    <detail-upload-dialog v-if="uploadDialogFlag" v-model="uploadDialogFlag" @getWorkInfo="serachItilLog">
    </detail-upload-dialog>
    <close-dialog v-if="closeDialogFlag" v-model="closeDialogFlag" @finish="itilChangeOrder"></close-dialog>
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

    <!--待决-->
    <s-dialog
      title="待决"
      width="500px"
      ref="waitDecideDialog"
      v-if="waitDecideDialog"
      v-model="waitDecideDialog">
      <wait-decide :orderUuid="orderUuid" :pendensMap="orderForm.pendensMap"
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

    <!--服务请求打印预览-->
    <s-dialog
      title="服务请求详情打印预览" top="10%" width="600px"
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
    <!--创建知识库弹框-->
    <s-dialog
      v-model="knowDialog"
      v-if="knowDialog"
      width="700px"
      class="createKnow"
      title="创建知识库">
      <create-know ref="knowForm"></create-know>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveKnow" :disabled="saveKnowDisabled">保存</s-button>
        <s-button type="cancel" @click="knowDialog = false">关闭</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
  import { getTime } from 'sunflower-common-utils'
  // import DateRange from '@/components/tableCom/src/DateRange';

  import assignToMe from './DetailDialog/AssignToMe.vue';
  import assignToOthers from './DetailDialog/AssignToOthers.vue';
  import createAsso from '@/pages/Process_Components/CreateAssociationRelationship.vue';
  import printModifyTask from './DetailDialog/PrintServiceTask.vue';
  import workInfoDetail from '../Process_Components/WorkInfoDetail.vue';
  import cancel from './DetailDialog/Cancel.vue';
  import waitDecide from './DetailDialog/WaitDecide.vue';
  import createKnow from '@/home/ProcessCenter/ProcessCreatOrder/KnowDialog'
  import CloseDialog from './DetailDialog/CloseDialog.vue';
  import $axios from 'sunflower-ajax';
  import detailMixin from './RequestServiceDetailMixin';
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
          isConcern: 0,
          serialCode: '',
          endUser: '',
          endCompany: '',
          briefDesc: '',
          detailDesc: '',
          categoryFirst: '',
          categorySecond: '',
          categoryThird: '',
          application: '',
          expectTime: '',
          priority: '',
          managerGroup: '',
          managerUser: '',
          assigneGroup: '',
          assigneUser: ''
        },
        submitOrderForm: {},  // 每次保存的orderForm
        orderRules: {
          serialCode: [
            { required: true, message: '', trigger: 'blur' }
          ],
          endUser: [
            { required: true, message: '请选择最终用户名称', trigger: 'blur' }
          ],
          endCompany: [
            { required: true, message: '请选择最终用户公司', trigger: 'blur' }
          ],
          briefDesc: [
            { required: true, message: '请输入简要描述内容', trigger: 'blur' },
            { min: 1, max: 100, message: '长度在1-100个字符', trigger: 'blur' }
          ],
          categoryFirst: [
            { required: true, message: '请选择一级分类', trigger: 'blur' }
          ],
          categorySecond: [
            { required: true, message: '请选择二级分类', trigger: 'blur' }
          ],
          priority: [
            { required: true, message: '请选择优先级', trigger: 'blur' }
          ],
          managerGroup: [
            { required: true, message: '请选择请求管理员组', trigger: 'blur' }
          ],
          managerUser: [
            { required: true, message: '请选择请求管理员', trigger: 'blur' }
          ],
          statusName: [{
            required: true, message: '不能为空', trigger: 'blur'
          }]
        },
        workInfoForm: {
          content: ''
        },       // 添加工作信息
        fileList: [],
        fileListUpload: [],
        categoryFirstList: [],    // 一级列表
        categorySecondList: [],   // 二级列表
        categoryThirdList: [],    // 三级列表
        managerGroupList: [],       // 变更管理员组
        managerUserList: [],        // 变更管理员用户
        adminGroup: [],         // 请求管理员组
        adminUser: [],          // 请求管理员用户
        endCompanyList: [],   // 公司
        endUserList: [],      // 人员
        priorityList: [],         // 优先级列表
        workInfoData: [],         // 工作详细信息数据
        associationData: [],         // 右侧关联关系表格数据
        cancleDisabled: true,     // 取消禁用
        searchKnowDisabled: true,  // 搜索知识库禁用
        createKnowDisabled: true,  // 创建知识库禁用
        assignToMeDisabled: true,  // 指派给我按钮禁用
        assignToOthersDisabled: true,  // // 指派给他人按钮禁用
        saveDisabled: true,   // 保存按钮禁用
        acceptDisabled: true,   // 接单按钮禁用
        completeDisabled: true,   // 完成按钮禁用
        closeDisabled: true,   // 关闭按钮禁用
        allDisabled: true,        // 全部按钮是否禁用
        formDisabled: true,       // 工单数据是否禁用
        waiteDeviceDisabled: true,       // 待决是否禁用
        retreatDisabled: true, // 待决恢复是否禁用
        closeDialogFlag: false,
        // 左侧功能菜单弹框
        assignToMeDialog: false,            // 指派给我弹框
        assignToOthersDialog: false,        // 指派给他人弹框
        waitDecideDialog: false,            // 待决弹框
        createAssoDialog: false,            // 创建关联关系
        printTaskDetailDialog: false,       // 打印变更详情预览弹框
        printLoading: false,                // 打印变更详情预览弹框loading遮罩
        cancelDialog: false,                // 取消弹框
        workInfoDialog: false,              // 查看信息详情弹框
        orderUuid: this.$route.params.uuid,  // 路由跳转时获取工单的uuid
        desiUuid: this.$route.params.desiUuid,
        iframeSRC: `#/PrintModifyTask?uuid=${this.$route.params.uuid}`,
        role: '',
        workInfoRow: {},       // 查看工作详细信息当前行的data
        approvalList: [],
        serviceRequestForm: {
          valueList: []             // 当前服务请求设计器生成的表单数据列表
        },
        serviceRequestDetail: [],   // 当前服务请求的定义详情
        inited: false,
        orderFormIsChange: false,   // orderForm表单内容是否改变，未改变保存不掉接口
        userGroups: false,   // 当前用户所有组
        ItilRole: [],
        knowDialog: false,
        saveKnowDisabled: false,
        // 以下两个是sla部分的变量
        slaStatus: {
          responseTime: null,
          solveTime: null,
          responseStatus: null,
          solveStatus: null
        },
        addWorkinfoFlag: false
      }
    },
    components: {
      // DateRange,
      cancel,
      waitDecide,
      createKnow,
      CloseDialog,
      assignToMe,
      assignToOthers,
      createAsso,
      printModifyTask,
      workInfoDetail,
      NameCardHover
    },
    computed: {
      workInfoUrl() {
        return `${$axios.basePath()}/fileUpload/uploadItilattach`
      },
      userarr() {
        return this.$store.state.serviceRequest.userList; // 人员下拉框数据
      },
      oranginazearr() {
        return this.$store.state.serviceRequest.departList; // 人员下拉框数据
      },
      rolearr() {
        return this.$store.state.serviceRequest.roleList; // 人员下拉框数据
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
      timeType(time) {
        if (time && time.indexOf(' 00:00:00') !== -1) {
          return 'date';
        } else {
          return 'datetime';
        }
      },
      printModifyDetail() {
        this.$refs.printTaskIframe.contentWindow.print()
      },
      getSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询内容',
          searchProps: ['executeSort', 'approveUserName', 'refuseReason', 'executeTimeStr']
        }
      },
      /**
       * 左侧菜单栏功能
       */
      // 关注
      attention() {
        $axios.get(`/ItilCommonWorkflow/concernIncidentOrder/${this.orderUuid}/6`).then(({data}) => {
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
      // 知识库搜索，知识引用
      searchKnowledge() {
        window.open(`#/ProcessCenter/searchKnowledge?orderUuid=${this.orderUuid}&orderType=6`);
        // this.$router.push({path: '/ProcessCenter/knowledgeLibrary', query: {orderUuid: this.orderUuid}});
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
        $axios.get(`/itilServiceRequest/requestOrderRecovery/${this.orderUuid}`).then(({data}) => {
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
        this.$router.push(`/ProcessCenter/requestServiceFlowchart/${this.orderForm.serialCode}/${this.orderUuid}`)
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
            $axios.post(`/itilServiceRequest/requestOrderCancle`, {
              requestOrderUuid: this.orderUuid,
              reason: cancelReason
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
      // 受派者组
      getRequestAcceptList() {
        return $axios.get(`/itilServiceRequest/getRequestAcceptListByCompanyUuid/${this.orderForm.companyUuid}`).then(({data}) => {
          if (data && data instanceof Array) {
            this.adminGroup = data
          }
        })
      },
      // 受派者
      getRequestOrderUser() {
        if (this.orderForm.assigneGroup && this.adminGroup.length > 0) {
          return $axios.get(`/itilServiceRequest/getRequestOrderUser/${this.orderForm.assigneGroup}`).then(({data}) => {
            if (data instanceof Array && data.length > 0) {
              this.adminUser = data
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '请先选择受派者组！'
          });
          this.orderForm.assigneUser = ''
          this.adminUser = []
        }
      },
      // 管理员组
      getAllChangemanagerGroup() {
        return $axios.get(`/itilServiceRequest/getRequestManagerList/${this.orderForm.companyUuid}`).then(({data}) => {
          if (data instanceof Array && data.length > 0) {
            this.managerGroupList = data
          }
        })
      },
      // 管理用户
      getAllChangemanagerUser() {
        if (this.orderForm.managerGroup && this.managerGroupList.length > 0) {
          return $axios.get(`/itilServiceRequest/getIamUserInfoListByGroupUuidAndRole/${this.orderForm.managerGroup}`).then(({data}) => {
            if (data instanceof Array && data.length > 0) {
              this.managerUserList = data
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '请先选择变更管理员组！'
          });
          this.orderForm.managerUser = ''
          this.managerUserList = []
        }
      },
      // 公司
      getendCompanyList() {
        return $axios.get(`/departmentInfo/queryAllDepartmentInfo`).then(({data}) => {
          this.endCompanyList = data.departmentList
        })
      },
      // 人员
      getendUser() {
        if (this.orderForm.endCompany && this.endCompanyList.length > 0) {
          return $axios.post(`/departmentInfo/viewDepartIncludeUsers`, {departUuid: this.orderForm.endCompany}).then(({data}) => {
            if (data.userList instanceof Array && data.userList.length > 0) {
              this.endUserList = data.userList
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '请先选择公司！'
          });
          this.orderForm.endUser = ''
          this.endUserList = []
        }
      },
      // 所有select
      getSelect() {
        this.getAllChangemanagerGroup().then(() => {
          if (this.orderForm.managerGroup && this.managerGroupList.length > 0) {
            this.getAllChangemanagerUser()
          }
        })
        this.getRequestAcceptList().then(() => {
          if (this.orderForm.assigneGroup && this.adminGroup.length > 0) {
            this.getRequestOrderUser()
          }
        })
        this.getendCompanyList().then(() => {
          if (this.orderForm.endCompany) {
            this.getendUser()
          }
        })
        this.getItilCategory(6, this.orderForm.companyUuid)
        this.getSecondCategory(6, this.orderForm.companyUuid, this.orderForm.categoryFirst)
        this.getThirdCategory(6, this.orderForm.companyUuid, this.orderForm.categoryFirst, this.orderForm.categorySecond)
      },
      saveOrder() {
        var {
          serialCode,
          endUser,
          endCompany,
          briefDesc,
          detailDesc,
          categoryFirst,
          categorySecond,
          categoryThird,
          application,
          expectTime,
          priority,
          managerGroup,
          managerUser,
          assigneGroup,
          assigneUser
        } = this.orderForm
        this.submitOrderForm = Object.assign({}, {uuid: this.orderUuid}, {
          serialCode,
          endUser,
          endCompany,
          briefDesc,
          detailDesc,
          categoryFirst,
          categorySecond,
          categoryThird,
          application,
          expectTime,
          priority,
          managerGroup,
          managerUser,
          assigneGroup,
          assigneUser
        })
        this.submitOrderForm.expectTime = new Date(this.submitOrderForm.expectTime).getTime() / 1000
        if (this.orderFormIsChange === true) {
          this.$refs.orderForm.validate((valid) => {
            if (valid) {
              $axios.post(`/itilServiceRequest/saveDetail`, this.submitOrderForm).then(({data}) => {
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
      // 接单
      orderTakling() {
        $axios.get(`/itilServiceRequest/orderTakling/${this.orderUuid}`).then(({data}) => {
          if (data.state === true) {
            this.itilChangeOrder()
            this.$message({
              type: 'success',
              message: '接单成功！'
            })
          } else {
            this.$message({
              type: 'error',
              message: '接单失败！'
            })
          }
        })
      },
      // 完成
      finishOrder() {
        $axios.get(`/itilServiceRequest/finishOrder/${this.orderUuid}`).then(({data}) => {
          if (data.state === true) {
            this.itilChangeOrder()
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
          } else {
            this.$message({
              type: 'error',
              message: '操作失败！'
            })
          }
        })
      },
      // 关闭
      closeOrder() {
        this.closeDialogFlag = true;
      },
//      closedOrder() {
//        $axios.get(`/itilServiceRequest/closedOrder/${this.orderUuid}`).then(({data}) => {
//          if (data.state === true) {
//            this.itilChangeOrder()
//            this.$message({
//              type: 'success',
//              message: '关闭成功！'
//            })
//          } else {
//            this.$message({
//              type: 'error',
//              message: '关闭失败！'
//            })
//          }
//        })
//      },
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
            this.getServiceRequestAttr()
            break;
          case '4':
            this.getItilApproveDetailByDetail()
            break;
        }
      },
      getServiceRequestAttr() {
        $axios.get(`/itilServiceRequest/getattrAndValues/${this.serviceRequestUuid}/${this.orderUuid}`).then(({data}) => {
          this.serviceRequestDetail = []
          let arr = Object.values(data).sort((a, b) => a.orderIndex - b.orderIndex)
          for (let item of arr) {
            /* 设置内置设计器下拉框初始值 */
            if (item.colnumName === '所属机构' || item.colnumName === '原组织机构' || item.colnumName === '转入部门') {
              // this.$set(item, 'listvalues', this.oranginazearr);
              let arr = [{listvalues: item.defaultValue}]
              this.$set(item, 'listvalues', arr);
            } else if (item.colnumName === '真实姓名' || item.colnumName === '直接汇报领导' || item.colnumName === '实际离职人' || item.colnumName === '实际申请人' || item.colnumName === '实际调岗人' || item.colnumName === '申请人姓名' || item.colnumName === '工作移交人') {
              // this.$set(item, 'listvalues', this.userarr);
              let arr = [{listvalues: item.defaultValue}]
              this.$set(item, 'listvalues', arr);
            } else if (item.colnumName === '当前人员角色') {
              // this.$set(item, 'listvalues', this.rolearr);
              let arr = item.defaultValue ? item.defaultValue.split(',') : [];
              var ArrNew = []
              arr.forEach(function(v, i) {
                ArrNew.push({label: v, value: v})
              })
              this.$set(item, 'listvalues', ArrNew);
            }
            this.serviceRequestDetail.push(item)
          }
          if (this.serviceRequestUuid === 'bc350009600748dfacaffd8a5734d002') {
            let obj = this.serviceRequestDetail.find(function(item) { return item.uuid === 'a0e7d489bc0246e69d38c0d51e3ee283' });
            let index = this.serviceRequestDetail.findIndex(function(item) { return item.uuid === 'a0e7d489bc0246e69d38c0d51e3ee283' });
            this.serviceRequestDetail.splice(index, 1);
            this.serviceRequestDetail.splice(0, 0, obj);
            let objtype = this.serviceRequestDetail.find(function(item) { return item.uuid === 'a0e7d489bc0246e69d38c0d51e3ee225' });
            let indextype = this.serviceRequestDetail.findIndex(function(item) { return item.uuid === 'a0e7d489bc0246e69d38c0d51e3ee225' });
            this.serviceRequestDetail.splice(indextype, 1);
            this.serviceRequestDetail.splice(3, 0, objtype);
          }
          this.serviceRequestForm.valueList = this.serviceRequestDetail.map(item => {
            if (item.colnumName === '当前人员角色') {
              let arr = item.defaultValue ? item.defaultValue.split(',') : [];
              return {attributeValue: arr, attributeUuid: item.uuid}
            } else {
              return {attributeValue: item.defaultValue, attributeUuid: item.uuid}
            }
          });
        });
      },
      // 创建知识单的保存
      saveKnow() {
        this.$refs['knowForm'].$refs['knowledgeForm'].validate(valid => {
          if (!valid) return;
          this.saveKnowDisabled = true // 保存按钮暂时禁用
          let form = Object.assign({}, this.$refs['knowForm'].knowledgeForm)
          form.knowledgeType = Number(form.knowledgeType)
          $axios.post('/itilKnowledgeOrder/saveKnowledgeOrder', form).then((res) => {
            if (res.data.state) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.knowDialog = false;
              this.saveKnowDisabled = false;
            } else {
              this.$message({
                message: res.data.errormsg,
                type: 'error'
              });
              this.saveKnowDisabled = false;
            }
          })
        })
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
      // 右侧工作详细信息
      getItilApproveDetailByDetail() {
        $axios.get(`/itilServiceRequest/getItilApproveDetailByDetail/${this.orderUuid}`).then(({data}) => {
          if (data instanceof Array) {
            this.approvalList = data
          }
        })
      },
      // 右侧关联关系数据
      getAssociationData() {
        $axios.get(`/ItilCommonWorkflow/getRelationOrderlist/${this.orderUuid}`).then(({data}) => {
          let {changeOrderList, changeTaskList, incidentOrderList, problemOrderList, knowledgeOrderList, publishOrderList} = data
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
          this.associationData = [...changeOrderList, ...changeTaskList, ...incidentOrderList, ...problemOrderList, ...knowledgeOrderList, ...publishOrderList]
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
            orderType: 6,
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
      // 服务请求管理员权限
      publicPermission(status, flag = 1) {
        this.searchKnowDisabled = this.createKnowDisabled = false
        if (status === 0 || status === 1) {
          if (flag) {
            this.formDisabled = this.saveDisabled = this.acceptDisabled = false
          }
        } else if (status === 3) {
          this.formDisabled = this.saveDisabled = this.acceptDisabled = false
        } else if (status === 4) {
          this.waiteDeviceDisabled = this.cancleDisabled = this.formDisabled = this.saveDisabled = this.completeDisabled = false
        } else if (status === 5) {
          this.formDisabled = this.closeDisabled = false
        } else if (status === 9) {
          this.retreatDisabled = false
        }
      },
      // 判断角色信息
//  无权限部分：左侧菜单栏：关注、创建关联关系、流程图、打印、附件上传、工作详细信息、请求内容、关联关系、日期/系统、审批记录
//  有权限部分：左侧菜单栏：待决、取消、搜索知识库、创建知识库、页面数据、保存、接单、完成、关单
//
//  指派给我、指派给他人权限单独控制
//
//  if(当前用户所有的组.indexOf(服务请求管理员组) && 当前用户角色===服务请求管理员){
//    草稿、已提交：开放：搜索知识库、创建知识库、页面数据、保存、接单
//      禁止：待决、完成、关单-
//    已指派：开放：搜索知识库、创建知识库、页面数据、保存、接单
//      禁止：待决、完成、关单
//    进行中：开放：待决、取消、搜索知识库、创建知识库、页面数据、保存、完成
//    禁止：接单、关单
//    已完成：开放：搜索知识库、创建知识库、页面数据、关单
//    禁止：待决、取消、接单、完成、保存
//    待决：开放：搜索知识库、创建知识库、待决恢复
//    禁止：取消、页面数据、保存、接单、完成、关单
//    启动审批、已拒绝、已取消、已关闭：开放：搜索知识库、创建知识库
//    禁止：待决、取消、页面数据、保存、接单、完成、关单
//  }else(){
//    if(当前用户 == 服务请求提交人 && 当前用户 == 服务请求受派人){
//      与服务请求管理员权限保持一致
//    }else if(当前用户 == 服务请求提交人 && 当前用户 ！= 服务请求受派人){
//      草稿、已提交：开放：取消、搜索知识库、创建知识库、页面数据、保存、接单
//      禁止：待决、完成、关单
//      已指派、进行中、已完成、待决、启动审批、已拒绝、已取消、已关闭：开放：搜索知识库、创建知识库
//      禁止：待决、取消、页面数据、保存、接单、完成、关单
//    }else if(当前用户 ！= 服务请求提交人 && 当前用户 == 服务请求受派人){
//      草稿、已提交：开放：搜索知识库、创建知识库
//      禁止：待决、取消、页面数据、保存、接单、完成、关单
//      已指派：开放：搜索知识库、创建知识库、页面数据、保存、接单
//        禁止：待决、完成、关单
//      进行中：开放：待决、取消、搜索知识库、创建知识库、页面数据、保存、完成
//      禁止：接单、关单
//      已完成：开放：搜索知识库、创建知识库、页面数据、关单
//      禁止：待决、取消、接单、完成、保存
//      待决：开放：搜索知识库、创建知识库、待决恢复
//      禁止：取消、页面数据、保存、接单、完成、关单
//      启动审批、已拒绝、已取消、已关闭：开放：搜索知识库、创建知识库
//      禁止：待决、取消、页面数据、保存、接单、完成、关单
//    }else{
//      全部权限禁止
//    }
//  }
//
//  //指派给我、指派给他人按钮判断
//  指派给我按钮：
//  if(当前用户拥有服务请求受派人角色 && 当前用户！=服务请求受派人|| 当前用户拥有服务请求管理员角色 && 当前用户！=服务请求管理员){
//    已指派 进行中：按钮放开
//    草稿、已提交、已完成、待决、启动审批、已拒绝、已取消、已关闭：按钮禁止
//  }else{
//    草稿、已提交、已指派、进行中、已完成、待决、启动审批、已拒绝、已取消、已关闭（所有状态）:禁止
//  }
//
//  指派给他人按钮：
//  if(当前用户==服务请求受派人|| 当前用户==服务请求管理员){
//    已指派 进行中：按钮放开
//    草稿、已提交、进行中、已完成、待决、启动审批、已拒绝、已取消、已关闭：按钮禁止
//  }else{
//    草稿、已提交、已指派、进行中、已完成、待决、启动审批、已拒绝、已取消、已关闭（所有状态）:禁止
//  }
//
//  补充： 服务管理员可以处理同组的所有服务请求单
//  补充： 服务请求生成对应事件单或变更单时，在进行中状态时没有任何操作权限；等待变更和事件单完成后自动变为已完成阶段。
      judgeRole() {
        let orderForm = this.orderForm
        let status = this.orderForm.status
        // 服务请求受派者角色
        let userIsAssign = false
        if (this.ItilRole instanceof Array && this.ItilRole.length > 0) {
          userIsAssign = this.ItilRole.some((item) => {
            return item.roleKey === 'service_assignee'
          })
        }
        // 服务请求管理员角色
        let userIsManager = false
        if (this.ItilRole instanceof Array && this.ItilRole.length > 0) {
          userIsManager = this.ItilRole.some((item) => {
            return item.roleKey === 'service_minstrator'
          })
        }
        // 默认所有都为true，在判断是否需要放开按钮，并且每次重新重置为true
        this.waiteDeviceDisabled = this.cancleDisabled = this.searchKnowDisabled = this.createKnowDisabled = this.formDisabled = this.saveDisabled =
          this.closeDisabled = this.completeDisabled = this.retreatDisabled = this.assignToMeDisabled = this.assignToOthersDisabled = this.acceptDisabled =
            this.allDisabled = true
        if (!(status === 4 && this.orderForm.isOtherOrder === 1)) { // 如果生成的是其他单并且是进行中状态，有按钮权限全部禁掉
          if ((this.userGroups.indexOf(orderForm.managerGroup) > -1) && userIsManager) {
            this.publicPermission(status)
          } else {
            if (this.userUuid === orderForm.createUser && this.userUuid === orderForm.assigneUser) {
              this.publicPermission(status)
            } else if (this.userUuid === orderForm.createUser && this.userUuid !== orderForm.assigneUser) {
              this.searchKnowDisabled = this.createKnowDisabled = false
              if (status === 0 || status === 1) {
                this.cancleDisabled = this.formDisabled = this.saveDisabled = this.acceptDisabled = false
              }
            } else if (this.userUuid !== orderForm.createUser && this.userUuid === orderForm.assigneUser) {
              this.publicPermission(status, 0)
            }
          }
          // 指派给我、指派给他人按钮判断
          // 指派给我按钮
          if (userIsAssign && this.userUuid !== orderForm.assigneUser || userIsManager && this.userUuid !== orderForm.managerUser) {
            if (status === 3 || status === 4) {
              this.assignToMeDisabled = false
            }
          }
          // 指派给他人按钮
          if (this.userUuid === orderForm.assigneUser || this.userUuid === orderForm.managerUser) {
            if (status === 3 || status === 4) {
              this.assignToOthersDisabled = false
            }
          }
        }
      },
      // 待决比较特殊，需要判断他的前一个状态pendingStatus，根据pendingStatus显示对应阶段
      pendingStatus() {
        switch (this.orderForm.pendingStatus) {
          case 0:
            this.currentStep = 0;
            break;     // 草稿
          case 1:
            this.currentStep = 0;
            break;     // 已提交
          case 2:
            this.currentStep = 1;
            break;     // 启动审批
          case 3:
            this.currentStep = 2;
            break;     // 已指派
          case 4:
            this.currentStep = 2;
            break;     // 进行中
          case 5:
            this.currentStep = 3;
            break;     // 已完成
          case 6:
            this.currentStep = 4;
            break;     // 已关闭
          case 7:
            this.currentStep = 4;
            break;     // 已拒绝
          case 8:
            this.currentStep = 4;
            break;     // 已取消
          case 9:
            this.currentStep = 2;
            break;     // 待决
        }
      },
      getSLATime() {
        $axios.get(`/itilSla/incidentOrRequestOrderDetails/${this.orderUuid}`).then((res) => {
          this.orderForm.expectTime = res.data.solveTime ? getTime(res.data.solveTime) : ''
        })
      },
      // 初始化
      itilChangeOrder() {
        this.inited = false
        // 获取当前用户所有组
        this.getUserGroups()
        // 获取详情接口
        $axios.get(`/itilServiceRequest/getRequestOrderDetail/${this.orderUuid}`).then(({data}) => {
          if (data) {
            this.orderForm = data
            this.serviceRequestUuid = this.orderForm.desiUuid
            switch (this.orderForm.status) {
              case 0:
                this.currentStep = 0;
                break;     // 草稿
              case 1:
                this.currentStep = 0;
                break;     // 已提交
              case 2:
                this.currentStep = 1;
                break;     // 启动审批
              case 3:
                this.currentStep = 2;
                break;     // 已指派
              case 4:
                this.currentStep = 2;
                break;     // 进行中
              case 5:
                this.currentStep = 3;
                break;     // 已完成
              case 6:
                this.currentStep = 4;
                break;     // 已关闭
              case 7:
                this.currentStep = 4;
                break;     // 已拒绝
              case 8:
                this.currentStep = 4;
                break;     // 已取消
              case 9:
                this.pendingStatus();
                break;     // 待决
            }
          }
        }).then(() => {
          Promise.all([
            this.judgeRole(),
            this.getSelect(),
            // 右侧工作详细信息
            this.serachItilLog(),
            this.getSLATime(),
            this.getServiceRequestAttr()
          ]).then(() => {
            this.inited = true
          })
        })
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
      $axios.get(`/itilWorkflowConfig/getItilRoleByUserUuid/${this.$store.state.userData.uuid}`).then((res) => {
        this.ItilRole = res.data
        this.itilChangeOrder()
      })
      this.axiosSlaStatus();
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
          this.getAllChangemanagerUser().then(() => {
            this.orderForm.managerUser = this.managerUserList[0].uuid
          })
        }
      },
      'orderForm.assigneGroup': {
        deep: true,
        handler() {
          if (!this.inited) {
            return
          }
          this.getRequestOrderUser().then(() => {
            this.orderForm.assigneUser = this.adminUser[0].uuid
          })
        }
      },
      'orderForm.endCompany': {
        deep: true,
        handler() {
          if (!this.inited) {
            return
          }
          this.getendUser().then(() => {
            this.orderForm.endUser = this.endUserList[0].uuid
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
    #processServiceDetail .s-tabs-border-card .s-tabs-content
      padding 5px 0!important
    #printTaskIframe
      width 100%
      min-height 500px
    #printTaskDetailDialog
      .s-dialog-body
        padding-bottom 0
      .s-dialog-footer
        padding-top 0
    #requestServiceRight
      .s-tabs-border-card
        .s-tabs-content
          padding 5px 0 !important
    .tag
      margin-left: 10px;
      display: inline-block;
      font-size: 12px;
      padding: 5px 8px;
      color: #fff;
      border-radius: 2px;
      line-height: 13px;
    .tag-ing
      background-color: #89ceff;
    .tag-error
      background-color: #ff6357;
    .tag-sucess
      background-color: #7fd071;
    .tag-warning
      background-color: #fecb19;
    .tag-disabled
      background-color: #bbbdc9;
  #index-body
    padding-left:0 !important
  #systemDate
    .grid-content
      font-size 14px
      margin-bottom 10px
</style>
