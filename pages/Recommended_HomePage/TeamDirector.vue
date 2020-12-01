<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-30 16:55:05
 * @LastEditTime: 2019-09-05 15:14:35
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="diy-ramd">
    <s-row style="margin:20px 10px">
      <s-button icon="plus" style="float:left;margin-left:10px;" @click="newAppDialog = true">添加申请</s-button>
      <div class="client-download" style="float:right;margin-right:10px;">
        <div style="width:300px;height:32px;margin:-7px 200px 0 0;">
          <div style="float:right;margin:5px 20px 0 0;" class="icontool linux" @click="downLinux"></div>
          <div style="float:right;margin:5px 20px 0 0;" class="icontool win" @click="downWin"></div>
          <div style="float:right;margin:5px 20px 0 0;" class="icontool mac" @click="downMac"></div>
          <div style="float:right;margin:0px 20px 0 0;">客户端下载 :</div>
        </div>
      </div>
    </s-row>
    <s-row>
      <s-col span="18" style="padding:15px;">
        <s-row>
          <s-col span="12" style="padding:0 15px;">
            <s-card class="box-card">
              <div class="team_Rectangle">
                <div class="team_icon">
                  <div class="icon iconfont icon-special-oper" style="font-size:40px;"></div>
                  <div style="margin-top:5px;">特殊运维</div>
                </div>
              </div>
              <div class="team_Approval">
                <div class="team_me">
                  <div style="text-align:center;margin:0 auto;margin-top:45px;">
                    <div
                      class="font_color"
                      style="font-size:30px;cursor: pointer;"
                      @click="Apply"
                    >{{teamData.mySubOrder}}</div>
                    <div style="margin-top:5px;opacity: 0.45;cursor: pointer;" @click="Apply">我申请</div>
                  </div>
                </div>
                <div class="team_he">
                  <div style="text-align:center;margin:0 auto;margin-top:45px;">
                    <div
                      class="font_color"
                      style="font-size:30px;cursor: pointer;"
                      @click="ApplyOther"
                    >{{teamData.approvedOrder}}</div>
                    <div
                      style="margin-top:5px;opacity: 0.45;cursor: pointer;"
                      @click="ApplyOther"
                    >他人已审批</div>
                  </div>
                </div>
              </div>
            </s-card>
          </s-col>
          <s-col span="12" style="padding:0 15px;">
            <s-card class="box-card">
              <div class="team_Rectangle">
                <div class="team_icon">
                  <div class="icon iconfont icon-batch-execution" style="font-size:40px;"></div>
                  <div style="margin-top:5px;">批量执行</div>
                </div>
              </div>
              <div class="team_Approval">
                <div class="team_me">
                  <div style="text-align:center;margin:0 auto;margin-top:45px;">
                    <div
                      class="font_color"
                      style="font-size:30px;cursor: pointer;"
                      @click="batchwho"
                    >{{teamData.mySubTask}}</div>
                    <div style="margin-top:5px;opacity: 0.45;cursor: pointer;" @click="batchwho">我申请</div>
                  </div>
                </div>
                <div class="team_he">
                  <div style="text-align:center;margin:0 auto;margin-top:45px;">
                    <div
                      class="font_color"
                      style="font-size:30px;cursor: pointer;"
                      @click="batchOtherhe"
                    >{{teamData.approvedTask}}</div>
                    <div
                      style="margin-top:5px;opacity: 0.45;cursor: pointer;"
                      @click="batchOtherhe"
                    >他人已审批</div>
                  </div>
                </div>
              </div>
            </s-card>
          </s-col>
        </s-row>
        <s-row>
          <s-col span="24" style="padding:0 15px;margin-top:20px;">
            <s-card class="table_card">
              <s-scrollbar wrap-style="height: 640px;">
                <div class="table_id">运维资产</div>
                <div style="margin:0 20px;">
                  <div class="oper-right-table" style="margin-bottom:25px;">
                    <s-form
                      id="formToSearch"
                      :inline="true"
                      :model="formInline"
                      class="demo-form-inline"
                    >
                      <s-form-item label="协议名称">
                        <s-select v-model="formInline.condition.protocolName" multiple filterable >
                          <s-option
                            v-for="(item, index) in protocolOption"
                            :key="index"
                            :label="item"
                            :value="item"
                          ></s-option>
                        </s-select>
                      </s-form-item>
                      <s-form-item label="IP地址">
                        <s-input
                          v-model="formInline.condition.ipAddress"
                          @keyup.enter.native="enterAction"
                        ></s-input>
                      </s-form-item>
                      <s-form-item label="资产名称">
                        <s-input
                          v-model="formInline.condition.itcompName"
                          @keyup.enter.native="enterAction"
                        ></s-input>
                      </s-form-item>
                      <s-form-item label="账号">
                        <s-input
                          v-model="formInline.condition.device_account"
                          @keyup.enter.native="enterAction"
                        ></s-input>
                      </s-form-item>
                      <s-form-item>
                        <s-button @click="getSearchActionDef">统计</s-button>
                      </s-form-item>
                      <br />
                      <s-form-item>
                        <s-button icon="backup" @click="batchOps">批量运维</s-button>
                      </s-form-item>
                    </s-form>
                    <div>
                      <div :style="{'float': 'right', 'margin': '-30px 10px 10px 0'}">
                        <span>半自动代填</span>
                        <s-switch
                          v-model="isOpen"
                          @change="changeOpen"
                          :active-value="1"
                          :inactive-value="0"
                        ></s-switch>
                      </div>
                      <!--真分页表格-->
                      <s-table
                        :data="equipmentList"
                        style="width:100%;"
                        @selection-change="handleSelectionChange"
                      >
                        <s-table-column type="selection" :selectable="isSelectable" width="45"></s-table-column>
                        <s-table-column
                          :key="index"
                          v-for="(item, index) in propList"
                          :label="item.colName"
                          show-overflow-tooltip
                        >
                          <template slot-scope="scope">
                            <template
                              v-if="item.colKey !== 'device_name'"
                            >{{scope.row[item.colKey]}}</template>
                            <template v-if="item.colKey === 'device_name'">
                              <a
                                class="detailLink"
                                @click="gotoAssetDetail(scope.row)"
                              >{{scope.row[item.colKey]}}</a>
                            </template>
                          </template>
                        </s-table-column>
                        <s-table-column label="操作" width="120">
                          <template slot-scope="scope">
                            <i
                              class="iconfont icon-oper-equip"
                              v-if="scope.row.canOperate === true"
                              @click="operation(scope.row)"
                              title="运维"
                            ></i>
                            <i
                              class="iconfont icon-ban"
                              v-if="scope.row.canOperate === false"
                              @click="handleBan()"
                              title="禁止运维"
                            ></i>
                            <i
                              class="iconfont icon-special-oper"
                              v-if="isShowRapid(scope.row)"
                              @click="handleRapid(scope.row)"
                              title="快速运维"
                            ></i>
                          </template>
                        </s-table-column>
                      </s-table>
                      <s-row class="pageRow">
                        <s-pagination
                          @size-change="handleSizeChange"
                          @current-change="handleCurrentChange"
                          :current-page="formInline.currentPage"
                          :page-size="formInline.pageSize"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="formInline.totalCount"
                        ></s-pagination>
                      </s-row>
                    </div>
                  </div>
                </div>
              </s-scrollbar>
            </s-card>
          </s-col>
        </s-row>
      </s-col>
      <s-col span="6" style="padding:15px;">
        <s-card class="right-card">
          <s-scrollbar wrap-style="height: 310px;">
            <s-row>
              <s-col span='8' class="team_li" >
                <div class="team_box" style="background:#60ACFC" @click="Order">
                  <div
                    class="icon iconfont icon-alter"
                    style="font-size:35px;color:#fff;padding:20px;"
                  ></div>
                </div>
                <div style="text-align:center;width:80px; margin:10px 20px;">命令复核</div>
              </s-col>
              <s-col span='8' class="team_li" >
                <div class="team_box" style="background:#5BC49F" @click="Synchronization">
                  <div
                    class="icon iconfont icon-union"
                    style="font-size:35px;color:#fff;padding:20px;"
                  ></div>
                </div>
                <div style="text-align:center;width:80px; margin:10px 20px;">密码会同</div>
              </s-col>
              <s-col span='8' class="team_li" >
                <div class="team_box" style="background:#5BC49F" @click="assistance">
                  <div
                    class="icon iconfont icon-assist"
                    style="font-size:35px;color:#fff;padding:20px;"
                  ></div>
                </div>
                <div style="text-align:center;width:80px; margin:10px 20px;">邀请协助</div>
              </s-col>
              <s-col span='8' class="team_li" >
                <div class="team_box" style="background:#FEB64D" @click="clientset">
                  <div
                    class="icon iconfont icon-config-safe"
                    style="font-size:35px;color:#fff;padding:20px;"
                  ></div>
                </div>
                <div style="text-align:center;width:80px; margin:10px 20px;">客户端全局设置</div>
              </s-col>
              <s-col span='8' class="team_li" >
                <div class="team_box" style="background:#FF7C7C" @click="equipmentConfig">
                  <div
                    class="icon iconfont icon-backup"
                    style="font-size:35px;color:#fff;padding:20px;"
                  ></div>
                </div>
                <div style="text-align:center;width:80px; margin:10px 20px;">资产配置保存</div>
              </s-col>
            </s-row>
          </s-scrollbar>
        </s-card>
        <s-card class="notice_card">
          <s-scrollbar wrap-style="height: 450px;">
            <div class="table_id">
              最新通知
              <div style="float:right;color:#199FED;cursor: pointer;" @click="Updatednot">更多</div>
            </div>
            <div style="margin:0 20px;" v-for="(item, index) in newEvents" :key="index">
              <div v-if="item.typeStr==='审批通过'">
                <div style="height:20px;">
                  <div class="circular"></div>
                  <div class="notice_time">{{item.updateTime}}</div>
                <div class="notice_maintenance" style="border:1px solid #FDA85C;color:#FDA85C;" >运维审批</div>
                </div>
                <div class="notice_content">
                  <div class="notice_font">名称：{{item.taskName}}</div>
                  <div class="notice_font">执行时间：{{item.beginTime}}～{{item.endTime}}</div>
                  <div class="notice_font">执行周期：{{item.strPeriod}}</div>
                  <div class="notice_font" style="color:#00FF0D;margin-top:20px;">{{item.typeStr}}</div>
                </div>
              </div>
              <div v-if="item.typeStr==='审批拒绝'">
                <div style="height:20px;">
                  <div class="circular"></div>
                  <div class="notice_time">{{item.updateTime}}</div>
                  <div class="notice_maintenance" style="border:1px solid #FDA85C;color:#FDA85C;" >运维审批</div>
                </div>
                <div class="notice_content">
                  <div class="notice_font">名称：{{item.taskName}}</div>
                  <div class="notice_font">执行时间：{{item.beginTime}}～{{item.endTime}}</div>
                  <div class="notice_font">执行周期：{{item.strPeriod}}</div>
                  <div class="notice_font" style="color:red;margin-top:20px;">{{item.typeStr}}</div>
                </div>
              </div>
            </div>
          </s-scrollbar>
        </s-card>
      </s-col>
    </s-row>
    <s-dialog v-model="newAppDialog" v-if="newAppDialog" width="400px" title="新建申请">
      <s-radio-group v-model="radio">
        <s-radio :label="1">特殊运维</s-radio>
        <s-radio :label="2">批量执行</s-radio>
      </s-radio-group>
      <template slot="footer" class="dialog-footer">
        <s-button @click="nextGoApply">下一步</s-button>
        <s-button type="cancel" @click="newAppDialog = false">关闭</s-button>
      </template>
    </s-dialog>
    <!--特殊运维-->
    <s-dialog v-model="chooseSpecialDialog" v-if="chooseSpecialDialog" width="900px" title="特殊运维">
      <Add-Apply ref="AddApply" @saveApp="ApplySave"></Add-Apply>
      <template slot="footer" class="dialog-footer">
        <s-button @click="uploadFile">保存</s-button>
        <s-button type="cancel" @click="chooseSpecialDialog = false">关闭</s-button>
      </template>
    </s-dialog>
    <!--批量-->
    <s-dialog v-model="chooseBatchDialog" v-if="chooseBatchDialog" width="900px" title="批量执行">
      <Add-Batch :uuid="uploadUuid" ref="addBatchDialog"></Add-Batch>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addOk">下一步</s-button>
        <s-button type="cancel" @click="chooseBatchDialog = false">关闭</s-button>
      </template>
    </s-dialog>
    <!--运维弹框-->
    <s-dialog v-model="opsDialog" v-if="opsDialog" width="700px" title="运维访问">
      <ops-add :decisionData="rowData" :showModel="showModel" :isOpen="isOpen" ref="ops"></ops-add>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveOps">保存</s-button>
        <s-button type="cancel" @click="opsDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--快速运维弹框-->
    <s-dialog v-model="RapidopsDialog" v-if="RapidopsDialog" width="700px" title="快速运维">
      <rapid-add :decisionData="rowData" :userShow="usershow" :isOpen="isOpen" ref="Rapidops"></rapid-add>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveRapidops">保存</s-button>
        <s-button type="cancel" @click="RapidopsDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--审批操作-->
    <s-dialog v-model="approveDialog" v-if="approveDialog" width="50%" title="审批">
      <view-dialog :uuid="approveUuid" :taskUuid="viewUuid" ref="approveDia"></view-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button v-if="doing" @click="approveOk">确定</s-button>
        <s-button v-if="!doing" disabled style="width:100px">
          <div style="float: left">正在审批</div>
          <s-spin color="#30a6fd" type="clip" size="8px"></s-spin>
        </s-button>
        <s-button type="cancel" @click="approveDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--运维-->
    <s-dialog v-model="assistDialog" v-if="assistDialog" width="600px" title="接受邀请协助">
      <ops-assist :uuid="uuids" :sessionUuid="sessionUuids" ref="getOps"></ops-assist>
      <template slot="footer" class="dialog-footer">
        <s-button @click="reciveOps">确定</s-button>
        <s-button type="cancel" @click="assistDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--会同弹窗-->
    <s-dialog v-model="huiDialog" v-if="huiDialog" width="600px" title="密码会同">
      <s-form ref="jointlyWith" :model="form" label-width="120px">
        <s-form-item label="密码" prop="devicePasswd">
          <s-input type="password" v-model="form.devicePasswd"></s-input>
        </s-form-item>
      </s-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveHui">确定</s-button>
        <s-button type="cancel" @click="huiDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--运维访问(new)-->
    <s-dialog
      v-model="opsAccessNewDialog"
      v-if="opsAccessNewDialog"
      width="700px"
      title="运维访问">
      <ops-access-new :rowData="rowData" :isOpen="isOpen" ref="opsAccessNew"></ops-access-new>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveOpsAccessNew">运维</s-button>
        <s-button type="cancel" @click="opsAccessNewDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <Apply-Me v-model="teamApply" v-if="teamApply"></Apply-Me>
    <Others v-model="teamother" v-if="teamother"></Others>
    <batch-Me v-model="batch" v-if="batch"></batch-Me>
    <batch-Other v-model="batchOther" v-if="batchOther"></batch-Other>
    <operation-NewDialog v-model="newOpera" v-if="newOpera"></operation-NewDialog>
    <Updated-Notice v-model="Updated" v-if="Updated" @chooseDialog="takeGo"></Updated-Notice>
  </div>
</template>
<style lang="stylus">
.s-card-body
  height: calc(100% - 0px);
</style>
<script>
// import Wrapper from '@/home/Wrapper'
import AddApply from '@/pages/Operation_SpecialOperation/ApplySpecial';
import AddBatch from '@/pages/Operation_BatchExecution/AddBatchExe';
import viewDialog from '@/pages/Operation_BatchExecution/ViewList';
import opsAssist from '@/pages/Operation_AssistInvite/OpsAssist';
import {Download} from 'sunflower-common-utils';
import $axios from 'sunflower-ajax';
import ApplyMe from './Dialog/ApplyMe';
import Others from './Dialog/Others';
import batchMe from './Dialog/batchMe';
import batchOther from './Dialog/batchOther';
import UpdatedNotice from './Dialog/UpdatedNotice';
// import SearchBox from '@/components/tableCom/src/SearchBox';
import OpsAccessNew from '@/pages/Operation_Equipment/OpsAccessNew';
import opsAdd from '../Operation_Equipment/OpsAdd';
import rapidAdd from '../Operation_Equipment/RapidOpsAdd';
// import operColSet from './OperColSetDialog';
import { cloneDeep, isEmpty } from 'lodash';
import operationNewDialog from './SafetyDialog/operationNewDialog';

const VNC = '00000000000000000000000000000078';
const RDP = '00000000000000000000000000000077';
const account = 'noneaccount000000000000000000000';
const mysql = '00000000000000000000000000000084';
const sqlserver = '00000000000000000000000000000085';
const db2 = '00000000000000000000000000000081';
const informix = '00000000000000000000000000000082';
const sybase = '00000000000000000000000000000086';
const oracle = '00000000000000000000000000000080';
const plsql = '00000000000000000000000000000114';
const toadoracle = '00000000000000000000000000000120';
const SSH = '00000000000000000000000000000072';
const SFTP = '00000000000000000000000000000074';
const mssqlserver = '00000000000000000000000000000113';
export default {
  components: {
    ApplyMe,
    Others,
    batchMe,
    batchOther,
    UpdatedNotice,
    // SearchBox,
    opsAdd,
    rapidAdd,
    viewDialog,
    // operColSet,
    opsAssist,
    AddApply,
    AddBatch,
    operationNewDialog,
    // Wrapper,
    OpsAccessNew
  },
  created() {
    this.getSwitch();
    this.getTeamData();
    this.getColData();
    this.getSearchOption();
    this.getSearchActionDef();
    this.getNewEventList();
  },
  watch: {
    huiDialog(val) {
      if (val === false) {
        this.$refs['jointlyWith'].resetFields();
      }
    }
  },
  data() {
    return {
      teamData: {
        mySubOrder: 0,
        approvedOrder: 0,
        mySubTask: 0,
        approvedTask: 0
      },
      opsAccessNewDialog: false,
      newAppDialog: false,
      Updated: false,
      teamApply: false,
      teamother: false,
      batch: false,
      newOpera: false,
      batchOther: false,
      radio: 1,
      dynaColSetDialog: false,
      showModel: '',
      rowData: [],
      opsDialog: false,
      RapidopsDialog: false,
      positionTreeData: [],
      organizationTree: [],
      defaultExpandKeys: [],
      currentLeftTreeUuid: '',
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      currentNodeValue: '',
      currentPositionValue: '',
      currentDepartValue: '',
      equipmentList: [],
      propList: [],
      protocolOption: [],
      portOption: [],
      departOption: [],
      usershow: '',
      multipleSelection: [],
      searchFlag: 1,
      formInline: {
        // 根据分页、查询条件查询列表的参数
        condition: {
          departName: [],
          protocolName: [],
          port: [],
          device_account: '',
          itcompName: '',
          ipAddress: '',
          citypeuuid: ''
        },
        currentPage: 1,
        orderByClause: '',
        pageSize: 10,
        totalCount: 0
      },
      isOpen: 0,
      newEvents: [],
      doing: true,
      approveDialog: false,
      approveUuid: '',
      viewUuid: '',
      assistDialog: false,
      uuids: '',
      sessionUuids: '',
      huiDialog: false,
      form: {
        devicePasswd: '',
        protocolName: '',
        uuid: ''
      },
      chooseSpecialDialog: false,
      chooseBatchDialog: false,
      uploadUuid: ''
    };
  },
  methods: {
    // 左边图标跳转
    Order() {
      console.log(1)
      this.$router.push({path: '/OperationCenter/oper_command'})
    },
    Synchronization() {
      this.$router.push({ name: 'operationCenter_pwdCon' });
    },
    assistance() {
      this.$router.push({ name: 'operationCenter_inviteHelp' });
    },
    clientset() {
      this.$router.push({ path: '/OperationCenter/oper_param_tab' });
    },
    equipmentConfig() {
      this.$router.push({ name: 'operationCenter_assetsConfiguration' });
    },
    ApplySave() {
      let applyData = this.$refs['AddApply']
      let form = applyData.addForm
      for (let v of applyData.selectionsCommand) {
        form.relcommandList.push(
          {
            type: v.commandtype,
            accountUuid: v.accountUuid,
            commandType: v.commandinfoType,
            commandUuid: v.comanduuid,
            maintainedDeviceUuid: v.maintainedDeviceUuid
          }
        )
      }
      $axios.post('/specialOperationApply/addSpecialoperApply', form, {
          data: [{ title: form.specialoperName }],
          logTemplate: '添加|运维申请(#title#)'
        }).then(res => {
          if (res.data.result === true) {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.chooseSpecialDialog = false;
            this.getTeamData()
          }
        });
    },
    uploadFile() {
      let files = this.$refs['AddApply'].fileList;
      let formObj = this.$refs['AddApply'].$refs['addSpecialForm'];
      let form = this.$refs['AddApply'].addForm;
      if (files.length > 5) {
        this.$message({ message: '最多上传五个附件', type: 'error' });
        return false;
      }
      if (Date.parse(form.endTimeStr) - Date.parse(form.startTimeStr) < 0) {
        this.$message({
          message: '结束时间必须大于开始时间',
          type: 'error'
        });
        return false;
      }
      if (form.relresourceList.length < 1) {
        this.$message({
          message: '您还没有选择资产',
          type: 'error'
        });
        return false;
      }
      formObj.validate(valid => {
        if (!valid) {
          return false;
        }
        if (files.length !== 0) {
          this.$refs['AddApply'].$refs['upload'].submit();
        } else {
          this.ApplySave();
        }
      });
    },
    addOk() {
      let self = this;
      let addForm = this.$refs['addBatchDialog'].addForm;
      this.$refs['addBatchDialog'].$refs['addScriptForm'].validate(valid => {
        if (!valid) return;
        $axios
          .post('/operationBatchExcute/addBatchExcuteTask', addForm, {
            data: [{ name: addForm.taskName }],
            logTemplate: '添加|申请列表>设置任务(#name#)'
          })
          .then(res => {
            if (res.data.status === 'true') {
              self.uploadUuid = res.data.uuid;
              self.relatedEquipmentDialog = true;
            } else {
              self.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          })
          .then(function() {
            self.chooseBatchDialog = false;
          });
      });
    },
    /* 时间格式化(s->yy-mm-dd hh:mm:ss) */
    getNewEventList() {
      $axios.get('/omaIndex/getMyApplyApprovalOrder/10').then(res => {
        this.newEvents = res.data.slice(0, 3);
      });
    },
    EventGo(data) {
      let message = data;
      switch (data.operationIncidentType) {
        case 1:
          $axios
            .get(
              `/operationBatchExcute/getAddFormInfo/${message.scripttask.uuid}`
            )
            .then(res => {
              if (isEmpty(res.data)) {
                this.$message({
                  message: '此运维申请已被申请人取消'
                });
              } else if (res.data.hasOwnProperty('approved')) {
                this.$message({
                  message: '此运维申请已被审批'
                });
              } else {
                this.viewUuid = message.scripttask.uuid;
                this.viewUuidName = message.scripttask.taskName;
                this.approveUuid = res.data.ScriptAudit.uuid;
                this.approveDialog = true;
              }
            });
          break;
        case 2:
          this.huiDialog = true;
          this.form.uuid = message.content.uuid;
          this.form.protocolName = message.content.protocolName;
          break;
        case 3:
          this.assistDialog = true;
          this.uuids = message.content.vMainUuid;
          this.sessionUuids = message.content.uuid;
          break;
        case 4:
          let uuid = message.content.uuid;
          $axios.get(`checkCmd/isCanDoCheck/${uuid}`).then(res => {
            if (res.data === false) {
              this.$message({
                type: 'error',
                message: '复核已结束'
              });
            } else {
              $axios
                .get(`/checkCmd/doReplayOrBlockCheck/replay/${uuid}`)
                .then(res => {
                  if (res.status === 200) {
                    if (res.data.status === 'true') {
                      this.$message({
                        type: 'success',
                        message: res.data.msg
                      });
                      if (
                        res.data.url !== '' ||
                        res.data.url !== null ||
                        res.data.url !== undefined
                      ) {
                        window.location.href = res.data.url;
                      }
                    }
                    if (res.data.status === 'false') {
                      this.$message({
                        type: 'error',
                        message: res.data.msg
                      });
                    }
                  }
                });
            }
          });
          break;
      }
    },
    reciveOps() {
      const form = this.$refs['getOps'].form;
      const formObj = this.$refs['getOps'].$refs['addForm'];
      formObj.validate(valid => {
        if (!valid) return;
        $axios
          .post(`invitHelp/isCanReciveInvite/${form.sessionUuid}`)
          .then(res => {
            if (res.data.state === false) {
              this.$message({ message: res.data.errormsg, type: 'error' });
            } else {
              $axios.post('/invitHelp/startClient', form).then(res => {
                if (res.status === 200) {
                  if (res.data.status === 'true') {
                    this.$message({ message: res.data.msg, type: 'success' });
                    this.assistDialog = false;
                    if (
                      res.data.url !== '' ||
                      res.data.url !== null ||
                      res.data.url !== undefined
                    ) {
                      window.location.href = res.data.url;
                    }
                  } else {
                    this.$message({ message: res.data.msg, type: 'error' });
                  }
                }
              });
            }
          });
      });
    },
    saveHui() {
      $axios.post('/pwdConnect/pwdCon', this.form).then(res => {
        if (res.data.status === 'true') {
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
          this.huiDialog = false;
        } else if (res.data.status === 'false') {
          this.$message({
            message: res.data.msg,
            type: 'error'
          });
        }
      });
    },
    approveOk() {
      let addForm = this.$refs['approveDia'].addForm;
      this.$refs['approveDia'].$refs['addForm'].validate(valid => {
        if (!valid) return;
        this.doing = false;
        $axios
          .post('/operationBatchExcute/batchExcuteAudit', addForm, {
            data: [{ name: this.viewUuidName }],
            logTemplate: '审批|审批列表>审批任务（#name#）'
          })
          .then(res => {
            if (res.data.status === 'true') {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.approveDialog = false;
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
            this.doing = true;
          });
      });
    },
    takeGo(data) {
      let detail = JSON.parse(data.detailInfo);
      let message = JSON.parse(detail.message);
      switch (data.incidentType) {
        case 1:
          $axios
            .get(
              `/operationBatchExcute/getAddFormInfo/${message.scripttask.uuid}`
            )
            .then(res => {
              if (isEmpty(res.data)) {
                this.$message({
                  message: '此运维申请已被申请人取消'
                });
              } else if (res.data.hasOwnProperty('approved')) {
                this.$message({
                  message: '此运维申请已被审批'
                });
              } else {
                this.viewUuid = message.scripttask.uuid;
                this.viewUuidName = message.scripttask.taskName;
                this.approveUuid = res.data.ScriptAudit.uuid;
                this.approveDialog = true;
              }
            });
          break;
        case 2:
          this.huiDialog = true;
          this.form.uuid = message.content.uuid;
          this.form.protocolName = message.content.protocolName;
          break;
        case 3:
          this.assistDialog = true;
          this.uuids = message.content.vMainUuid;
          this.sessionUuids = message.content.uuid;
          break;
        case 4:
          let uuid = message.content.uuid;
          $axios.get(`checkCmd/isCanDoCheck/${uuid}`).then(res => {
            if (res.data === false) {
              this.$message({
                type: 'error',
                message: '复核已结束'
              });
            } else {
              $axios
                .get(`/checkCmd/doReplayOrBlockCheck/replay/${uuid}`)
                .then(res => {
                  if (res.status === 200) {
                    if (res.data.status === 'true') {
                      this.$message({
                        type: 'success',
                        message: res.data.msg
                      });
                      if (
                        res.data.url !== '' ||
                        res.data.url !== null ||
                        res.data.url !== undefined
                      ) {
                        window.location.href = res.data.url;
                      }
                    }
                    if (res.data.status === 'false') {
                      this.$message({
                        type: 'error',
                        message: res.data.msg
                      });
                    }
                  }
                });
            }
          });
          break;
      }
    },
    getTeamData() {
      $axios.get('/omaIndex/getOrderAndTaskCount').then(res => {
        this.teamData = res.data;
      });
    },
    Updatednot() {
      this.newOpera = true;
    },
    Apply() {
      this.teamApply = true;
    },
    ApplyOther() {
      this.teamother = true;
    },
    batchwho() {
      this.batch = true;
    },
    batchOtherhe() {
      this.batchOther = true;
    },
    nextGoApply() {
      this.newAppDialog = false;
      if (this.radio === 1) {
        $axios
          .get('/specialOperationApply/isCanAddSpecialoperApply')
          .then(res => {
            if (res.data.hasOwnProperty('false')) {
              this.$message({
                type: 'error',
                message: res.data.false
              });
            }
            if (res.data.hasOwnProperty('true')) {
              this.chooseSpecialDialog = true;
            }
          });
      } else if (this.radio === 2) {
        $axios.get('/operationBatchExcute/isCanAdd').then(res => {
          if (res.data.status === 'false') {
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          } else {
            this.chooseBatchDialog = true;
          }
        });
      }
    },
    downLinux() {
      this.$confirm('确定下载linux客户端?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Download(`/operationSettings/downLoadClientTool/linux`, {
            logTemplate: '下载|工具下载>客户端下载(Linux)'
          });
        })
        .catch(() => {});
    },
    downWin() {
      this.$confirm('确定下载Windows客户端?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Download(`/operationSettings/downLoadClientTool/win`, {
            logTemplate: '下载|工具下载>客户端下载(Windows)'
          });
        })
        .catch(() => {});
    },
    downMac() {
      this.$confirm('确定下载Mac客户端?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Download(`/operationSettings/downLoadClientTool/mac`, {
            logTemplate: '下载|工具下载>客户端下载(Mac)'
          });
        })
        .catch(() => {});
    },
    // 获取开关状态
    getSwitch() {
      $axios.get('/basicOperation/getAutoSetInfo').then(res => {
        this.isOpen = res.data;
      });
    },
    changeOpen(isOpen) {
      $axios.get(`/basicOperation/openOrCloseAutoSet/${isOpen}`).then(res => {
        if (res.data.state === true) {
        }
      });
    },
    showDynamicColSet() {
      this.dynaColSetDialog = true;
    },
    getWidth(i) {
      if (i.colKey === 'device_ip') {
        return 160;
      }
    },
    /* 批量运维 */
    batchOps() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'error',
          message: '请至少选择一个'
        });
        return false;
      }
      let equimentAry = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        let row = this.multipleSelection[i];
        equimentAry.push(row.uuid);
      }
      $axios
        .post('/basicOperation/batchOperationUrl', equimentAry)
        .then(res => {
          if (res.data !== '' || res.data !== null || res.data !== undefined) {
            if (res.data.length > 0) {
              window.location.href = res.data;
            } else {
              this.$message({
                type: 'error',
                message: '无法运维,请检查！'
              });
            }
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '无法运维,请检查！'
          });
        });
    },
    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /* 是否选中 */
    isSelectable(row) {
      let flag;
      row.accountUuid === account || row.accountUuid === null
        ? (flag = false)
        : (flag = true);
      return flag;
    },

    /* 普通运维 */
    goToOperation(form) {
      $axios.post('/basicOperation/webOperation', form).then(res => {
        if (res.status === 200) {
          if (res.data !== '' || res.data !== null || res.data !== undefined) {
            if (res.data.length > 0 && res.data.indexOf('ssi://') !== -1) {
              window.location.href = res.data;
              this.opsAccessNewDialog = false
              this.opsDialog = false;
              this.getAssetTableData()
            } else {
              this.opsDialog = false;
              this.$message({
                type: 'error',
                message: res.data
              });
            }
          } else {
            this.opsDialog = false;
            this.$message({
              type: 'error',
              message: '无法运维,请检查！'
            });
          }
        }
      });
    },
    /* 快速运维 */
    goQuickOperation(form) {
      $axios.post('/basicOperation/quickWebOperation', form).then(res => {
        if (res.status === 200) {
          if (res.data !== '' || res.data !== null || res.data !== undefined) {
            if (res.data.length > 0 && res.data.indexOf('ssi://') !== -1) {
              window.location.href = res.data;
              this.RapidopsDialog = false;
            } else {
              this.RapidopsDialog = false;
              this.$message({
                type: 'error',
                message: res.data
              });
            }
          } else {
            this.RapidopsDialog = false;
            this.$message({
              type: 'error',
              message: '快速运维失败,请检查！'
            });
          }
        }
      });
    },
    saveOps() {
      let form = this.$refs.ops.form;
      this.$refs['ops'].$refs['addForm'].validate(valid => {
        if (!valid) return;
        if (form.passwordType === 1 && form.strKeyPath === '') {
          this.$message({ type: 'warning', message: '请先上传文件' });
          return;
        }
        this.goToOperation(form);
      });
      let isAutoRecord = this.$refs.ops.userShow;
      if (!isAutoRecord) {
        form.isAutoRecord = null;
      }
    },
    saveRapidops() {
      let form = this.$refs['Rapidops'].form;
      let row = this.$refs['Rapidops'].decisionData;
      let argumentObj = JSON.parse(row.arguments);
      if (form.accountName !== '') {
        argumentObj.params.strAccount = form.accountName;
      }
      let isAutoRecord = 0;
      if (this.usershow === false) {
        isAutoRecord = null;
      } else {
        isAutoRecord = form.isAutoRecord;
      }
      argumentObj.params.strPw = form.accountPwd;
      argumentObj.params.strClipboard = row.clipboardNum.toString();
      argumentObj.params.strDiskMapping = row.disk_mappingNum.toString();
      let argumentStr = JSON.stringify(argumentObj);
      let formObj = {
        isAutoRecord: isAutoRecord,
        accountName: form.accountName,
        accountPwd: form.accountPwd,
        arguments: argumentStr,
        operationuuid: row.uuid
      };
      this.$refs['Rapidops'].$refs['rapid'].validate(valid => {
        if (!valid) return;
        this.goQuickOperation(formObj);
      });
    },
    operation(row) {
      if (!row.portUuid) {
        this.rowData = row
        this.opsAccessNewDialog = true
      } else {
        this.handleOps(row)
      }
    },
    saveOpsAccessNew() { // 保存运维访问（new）
      let form = this.$refs.opsAccessNew.searchForm
      if (!this.opsAccessNewDialog) {
        form.isAutoRecord = 0
      } else if (!this.$refs.opsAccessNew.userShow && !this.$refs.opsAccessNew.pwdShow) {
        form.isAutoRecord = 0
      }
      this.$refs['opsAccessNew'].$refs['searchForm'].validate(valid => {
        if (!valid) return;
        if (form.passwordType === 1 && form.strKeyPath === '') {
          this.$message({type: 'warning', message: '请先上传文件'});
          return
        }
        this.goToOperation(form)
      })
    },
    handleOps(row) {
      this.rowData = row;
      let isAutoRecord = 1;
      let opsForm = {
        accountuuid: row.accountUuid,
        diskMapping: row.disk_mappingNum,
        operationuuid: row.uuid,
        oprationIp: row.device_ip,
        portuuid: row.portUuid,
        protocluuid: row.protocolUuid,
        clipboard: row.clipboardNum,
        isAutoRecord: isAutoRecord,
        accountName: '',
        accountPwd: '',
        colorDepth: '',
        rdpConsole: '',
        dbname: row.dbName || row.dbServerName,
        resolution: '',
        serverip: ''
      };
      let pid = row.protocolUuid;
      let pType = row.protocolType;
      let aid = row.accountUuid;
      let authorized = false;
      if (aid === account || aid === null) {
        authorized = true;
      } // 未授权
      if (
        pType === 2 ||
        pType === 5 ||
        pid === db2 ||
        pid === informix ||
        pid === sybase ||
        pid === sqlserver ||
        pid === mysql
      ) {
        if (authorized) {
          if (pid === SSH || pid === SFTP) {
            this.showModel = 8;
            this.opsDialog = true;
          } else {
            this.showModel = 1;
            this.opsDialog = true;
          }
        } else {
          opsForm.isAutoRecord = null;
          this.goToOperation(opsForm);
        }
      } else if (
        pid === oracle ||
        pid === plsql ||
        pid === toadoracle ||
        pid === mssqlserver
      ) {
        if (authorized) {
          this.showModel = 3;
          this.opsDialog = true;
        } else {
          this.showModel = 2;
          this.opsDialog = true;
        }
      } else if (
        pid === RDP ||
        (pType === 1 &&
          pid !== toadoracle &&
          pid !== plsql &&
          pid !== mssqlserver)
      ) {
        if (authorized) {
          this.showModel = 5;
          this.opsDialog = true;
        } else {
          this.showModel = 4;
          this.opsDialog = true;
        }
      } else if (pid === VNC) {
        if (authorized) {
          this.showModel = 7;
          this.opsDialog = true;
        } else {
          this.showModel = 6;
          this.opsDialog = true;
        }
      } else {
        if (authorized) {
          this.showModel = 1;
          this.opsDialog = true;
        } else {
          opsForm.isAutoRecord = null;
          this.goToOperation(opsForm);
        }
      }
    },
    handleRapid(row) {
      this.rowData = row;
      const arg = JSON.parse(row.arguments);
      arg.params.strClipboard = row.clipboardNum.toString();
      arg.params.strDiskMapping = row.disk_mappingNum.toString();
      let isAutoRecord = 1;
      let quickForm = {
        isAutoRecord: isAutoRecord,
        accountName: row.accountName,
        accountPwd: row.accountPwd,
        arguments: JSON.stringify(arg),
        operationuuid: row.uuid
      };
      let pid = row.protocolUuid;
      let pType = row.protocolType;
      let aid = row.accountUuid;
      let authorized = false;
      if (aid === account || aid === null) {
        authorized = true;
      } // 未授权
      if (pid === RDP || pType === 1) {
        if (!authorized) {
          quickForm.isAutoRecord = null;
          this.goQuickOperation(quickForm);
        } else {
          this.RapidopsDialog = true;
        }
      } else if (pid === VNC) {
        if (authorized) {
          this.RapidopsDialog = true;
          this.usershow = false;
        } else {
          quickForm.isAutoRecord = null;
          this.goQuickOperation(quickForm);
        }
      } else {
        if (authorized) {
          this.showModel = 1;
          this.opsDialog = true;
        } else {
          quickForm.isAutoRecord = null;
          this.goQuickOperation(quickForm);
        }
      }
    },
    // 能否快速运维
    isShowRapid(row) {
      let flag;
      let pid = row.protocolUuid;
      let ppType = row.protocolType;
      if (row.canOperate === false) {
        flag = false;
        return flag;
      }
      if (pid === VNC || pid === RDP || ppType === 1) {
        row.arguments !== null ? (flag = true) : (flag = false);
      }
      return flag;
    },
    // 禁止运维
    handleBan() {
      this.$message({
        type: 'warning',
        message: '禁止运维'
      });
    },
    getSearchOption() {
      $axios.get('/basicOperation/getSearchBoxCondition').then(res => {
        this.protocolOption = res.data.protocolName;
        this.portOption = res.data.port;
        this.departOption = res.data.departName;
      });
    },
    // 获取数据
    getTableList(uuid) {
      this.formInline.condition.citypeuuid = uuid;
      this.getAssetTableData();
    },
    // 搜索
    enterAction() {
      let vm = this;
      let param = cloneDeep(vm.formInline);
      switch (vm.searchFlag) {
        case 1:
          param.condition.citypeuuid = vm.currentNodeValue;
          break;
      }
      $axios.post('/basicOperation/getBasicOplist', param).then(res => {
        this.equipmentList = res.data.pageList;
        this.formInline.totalCount = res.data.totalCount;
        this.formInline.pageSize = res.data.pageSize;
      });
    },
    getAssetTableData() {
      let vm = this;
      let param = cloneDeep(vm.formInline);
      $axios.post('/basicOperation/getBasicOplist', param).then(res => {
        this.equipmentList = res.data.pageList;
        this.formInline.totalCount = res.data.totalCount;
      });
    },
    getSearchActionDef() {
      // 统计
      let vm = this;
      let param = cloneDeep(vm.formInline);
      switch (vm.searchFlag) {
        case 1:
          param.condition.citypeuuid = null;
          break;
      }
      $axios.post('/basicOperation/getBasicOplist', param).then(res => {
        this.equipmentList = res.data.pageList;
        this.formInline.totalCount = res.data.totalCount;
        this.formInline.pageSize = res.data.pageSize;
      });
    },
    gotoAssetDetail(row) {
      this.$router.push(`/OperationCenter/oper_assets/${row.itcompUuid}`);
    },
    /* 页码 */
    handleSizeChange(curPageSize) {
      this.formInline.currentPage = 1;
      this.formInline.pageSize = curPageSize;
      this.getAssetTableData();
    },
    /* 分页 */
    handleCurrentChange(current) {
      if (current === this.formInline.currentPage) return;
      this.formInline.currentPage = current;
      this.getAssetTableData();
    },
    getColData() {
      $axios.get('/operationSettings/getShowOperationPage').then(response => {
        this.propList = response.data;
      });
    }
  }
};
</script>
<style scoped>

</style>

