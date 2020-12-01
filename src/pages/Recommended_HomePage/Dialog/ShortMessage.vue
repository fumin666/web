<template>
  <div>
    <s-dialog v-model="dialogFlag" title="短信服务器设置" width="850px">
      <section class="high-level-set" style="margin-top: 20px">
        <!-- <s-tab type="card" v-model="activeTab"> -->
        <!-- <s-tab-pane label="邮件服务器"> -->
        <!-- <s-form class="s-form-wrapper" key="mailForm" ref="mailForm" :model="mailForm" :rules="mailRule"
                  label-width="120px">
            <s-form-item label="邮件平台类型" prop="type">
              <s-col span="24">
                <s-select v-model="mailForm.type" placeholder="请选择所属机构" style="width:auto;">
                  <s-option v-for="(item,index) in emailPlatformList" :key="index" :label="item.name"
                            :value="item.name"></s-option>
                </s-select>
                <s-button icon="plus" title="自定义类型" @click="emailAndMessagePlatformDialog=true" style="margin-left:5px">
                  自定义类型
                </s-button>
              </s-col>
            </s-form-item>
            <s-form-item label="参数列表" prop="sysconfigs">
              <s-col span="24">
                <div class="s-search-group">
                  <s-scrollbar wrap-style="max-height: 500px;">
                    <ul class="params-list">
                      <li v-for="(item,index) in emailParamsList" :key="index">
                        <div>
                          <s-input v-model="emailParamsList[index].configName" style="width:auto;"></s-input>
                          <span>=</span>
                          <s-input :type="emailParamsList[index].inputtype === 1? 'password' : 'text'"
                                  v-model="emailParamsList[index].configValue" style="width:auto;"></s-input>
                          <s-select v-model="emailParamsList[index].inputtype" placeholder="选择参数类型"
                                    @change="changeHandler(emailParamsList[index])">
                            <s-option label="密码框" :value="1"></s-option>
                            <s-option label="输入框" :value="2"></s-option>
                          </s-select>
                          <i v-if="index === 0" class="iconfont icon-add" @click="paramsListAdd()" title="添加"></i>
                          <i v-else class="iconfont icon-delete" @click="paramsListDel(index)" title="删除"></i>
                        </div>
                      </li>
                    </ul>
                  </s-scrollbar>
                </div>
              </s-col>
            </s-form-item>
            <s-form-item label="收件账号" prop="mailbox">
              <s-col span="24">
                <s-input v-model="mailForm.mailbox" placeholder="测试必须填写"></s-input>
              </s-col>
            </s-form-item>
            <s-form-item>
              <s-button @click="saveMail">保存</s-button>
              <s-button v-if="!isCheckMail" @click="checkMail">保存并测试</s-button>
              <s-button v-if="isCheckMail" disabled style="width:100px">
                <div style="float: left">正在测试</div>
                <s-spin color="#30a6fd" type="clip" size="8px"></s-spin>
              </s-button>
            </s-form-item>
        </s-form>-->
        <!-- </s-tab-pane> -->
        <s-tab-pane label="短信服务器">
          <s-form
            class="s-form-wrapper"
            key="messageForm"
            ref="messageForm"
            :model="messageForm"
            :rules="messageRule"
            label-width="120px"
          >
            <s-form-item label="短信平台类型" prop="ssl">
              <s-col span="24">
                <s-select v-model="messageForm.type">
                  <s-option
                    v-for="(item,index) in messagePlatformList"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  ></s-option>
                </s-select>
                <s-button
                  icon="plus"
                  title="自定义类型"
                  @click="emailAndMessagePlatformDialog=true"
                  style="margin-left:5px"
                >自定义类型</s-button>
              </s-col>
            </s-form-item>
            <s-form-item label="参数列表" prop="sysconfigs">
              <s-col span="24">
                <div class="s-search-group">
                  <s-scrollbar wrap-style="max-height: 500px;">
                    <ul class="params-list">
                      <li v-for="(item,index) in messageParamsList" :key="index">
                        <div>
                          <s-input
                            v-model="messageParamsList[index].configName"
                            style="width:auto;"
                          ></s-input>
                          <span>=</span>
                          <s-input
                            :type="messageParamsList[index].inputtype === 1? 'password' : 'text'"
                            v-model="messageParamsList[index].configValue"
                            style="width:auto;"
                          ></s-input>
                          <s-select
                            v-model="messageParamsList[index].inputtype"
                            placeholder="选择参数类型"
                          >
                            <s-option label="密码框" :value="1"></s-option>
                            <s-option label="输入框" :value="2"></s-option>
                          </s-select>
                          <i
                            v-if="index === 0"
                            class="iconfont icon-add"
                            @click="paramsListAdd()"
                            title="添加"
                          ></i>
                          <i
                            v-else
                            class="iconfont icon-delete"
                            @click="paramsListDel(index)"
                            title="删除"
                          ></i>
                        </div>
                      </li>
                    </ul>
                  </s-scrollbar>
                </div>
              </s-col>
            </s-form-item>
            <s-form-item label="测试手机号" prop="testPhone">
              <s-col span="24">
                <s-input v-model="messageForm.testPhone"></s-input>
              </s-col>
            </s-form-item>
            <s-form-item>
              <s-button @click="saveMessage">保存</s-button>
              <s-button v-if="!isCheckMessage" @click="checkMessage">保存并测试</s-button>
              <s-button v-if="isCheckMessage" disabled style="width:100px">
                <div style="float: left">正在测试</div>
                <s-spin color="#30a6fd" type="clip" size="8px"></s-spin>
              </s-button>
            </s-form-item>
          </s-form>
        </s-tab-pane>
        <!-- <s-tab-pane label="微信服务器">
          <s-form class="s-form-wrapper" key="wechatForm" ref="wechatForm" :model="wechatForm" :rules="wechatFormRules"
                  label-width="120px">
            <s-form-item label="CorpID" prop="weChatCorpID.configValue">
              <s-col span="24">
                <s-input v-model="wechatForm.weChatCorpID.configValue"></s-input>
              </s-col>
            </s-form-item>
            <s-form-item label="Secret" prop="weChatSecret.configValue">
              <s-col span="24">
                <s-input v-model="wechatForm.weChatSecret.configValue"></s-input>
              </s-col>
            </s-form-item>
            <s-form-item label="应用ID" prop="weChatapplyID.configValue">
              <s-col span="24">
                <s-input v-model="wechatForm.weChatapplyID.configValue"></s-input>
              </s-col>
            </s-form-item>
            <s-form-item label="测试微信号">
              <s-col span="24">
                <s-input v-model="wechatNum"></s-input>
              </s-col>
            </s-form-item>
            <s-form-item>
              <s-button @click="saveWechat">保存</s-button>
              <s-button v-if="!isCheckWechat" @click="checkWechat">保存并测试</s-button>
              <s-button v-if="isCheckWechat" disabled style="width:100px">
                <div style="float: left">正在测试</div>
                <s-spin color="#30a6fd" type="clip" size="8px"></s-spin>
              </s-button>
            </s-form-item>
          </s-form>
        </s-tab-pane>-->
        <!-- </s-tab> -->
      </section>
    </s-dialog>
    <!--添加备份服务器-->
    <s-dialog v-model="backupServerDialog" v-if="backupServerDialog" title="添加备份服务器">
      <backup-server ref="addServer"></backup-server>
      <template slot="footer">
        <s-button @click="backupServerSave">保存</s-button>
        <s-button type="cancel" @click="backupServerDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--编辑备份服务器-->
    <s-dialog v-model="editServerDialog" v-if="editServerDialog" title="编辑备份服务器">
      <backup-server ref="editServer" :editData="editData"></backup-server>
      <template slot="footer">
        <s-button @click="editServerSave">保存</s-button>
        <s-button type="cancel" @click="editServerDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--添加策略-->
    <s-dialog
      v-model="addStrategyDialog"
      v-if="addStrategyDialog"
      width="400px"
      title="添加策略"
      append-to-body
    >
      <add-ip-rule ref="addStrategy"></add-ip-rule>
      <template slot="footer">
        <s-button @click="saveStrategyForm">保存</s-button>
        <s-button type="cancel" @click="addStrategyDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!-- 查看代理管理详情 -->
    <s-dialog v-model="eyeManageDialog" v-if="eyeManageDialog" title="查看代理信息" width="700px">
      <eye-manage :rowData="eyeData"></eye-manage>
    </s-dialog>
    <!-- 高级配置 -->
    <s-dialog
      v-model="advanceProxySetDialog"
      v-if="advanceProxySetDialog"
      width="650px"
      title="高级配置"
    >
      <advance-proxy-set
        @colseSet="closeSetDialog"
        :rowData="advanceSetRowData"
        :interfaceInfo="interfaceInfo"
      ></advance-proxy-set>
    </s-dialog>
    <!--编辑代理详情-->
    <s-dialog v-model="editManageDialog" v-if="editManageDialog" width="700px" title="编辑代理信息">
      <edit-manage :manageEditData="manageEditData" ref="editProxy"></edit-manage>
      <template slot="footer">
        <s-button @click="saveHandle">保存</s-button>
        <s-button type="cancel" @click="editManageDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--编辑业务认证-->
    <s-dialog
      v-model="editApproveDialog"
      v-if="editApproveDialog"
      width="700px"
      :title="check?'查看':(addCheckBool?'新增':'编辑')"
    >
      <approve-edit-manage :ApproveEditData="ApproveEditData" :ischeck="check" ref="editApprove"></approve-edit-manage>
      <template slot="footer">
        <s-button @click="saveApprove">保存</s-button>
        <s-button type="cancel" @click="editApproveDialog = false;addCheckBool = false">取消</s-button>
      </template>
    </s-dialog>
    <!-- 自定义邮件短信平台类型 -->
    <EmailAndMessagePlatformDialog
      v-if="emailAndMessagePlatformDialog"
      v-model="emailAndMessagePlatformDialog"
      :platform="activeTab"
      @emailAndMessageParent="emailAndMessageParent()"
    ></EmailAndMessagePlatformDialog>
  </div>
</template>

<script type="text/babel">
import $axios from 'sunflower-ajax';
import { cloneDeep } from 'lodash';
import authCheck from '@/common/mixins/auth.js';
import EmailAndMessagePlatformDialog from './EmailAndMessagePlatformDialog.vue'; // 自定义邮件短信平台类型
import { decryptPwd, encryptPwd, Validaters } from 'sunflower-common-utils';

export default {
  mixins: [authCheck],
  components: {
    EmailAndMessagePlatformDialog // 自定义邮件短信平台类型
  },
  data() {
    return {
      check: true, // 查看业务系统
      addCheckBool: false, // 新增业务系统
      dialogFlag: false,
      manageEditData: {},
      manageSaveData: {},
      ApproveEditData: {},
      activeTab: 1,
      advanceProxySetDialog: false,
      backupServerDialog: false,
      editServerDialog: false,
      eyeManageDialog: false,
      editApproveDialog: false, // 业务认证
      editManageDialog: false,
      advanceManageDialog: false,
      deleteManageDialog: false,
      emailAndMessagePlatformDialog: false,
      eyeData: [],
      interfaceInfo: [],
      advanceSetRowData: {},
      editData: '',
      serviceStatus: '',
      mailRule: {
        mailbox: [
          { required: false, message: '不能为空', trigger: 'blur' },
          {
            pattern: /^([A-Za-z0-9_\-\.])+@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/,
            message: '请填写正确格式的email',
            trigger: 'blur'
          }
        ]
      },
      mailForm: {
        type: null,
        mailbox: ''
      },
      messageType: true,
      messageRule: {
        testPhone: [
          { required: true, message: '不能为空', trigger: 'blur' },
          Validaters.Max(20),
          Validaters.MobilePhone
        ]
      },
      messageForm: {
        type: null,
        testPhone: ''
      },
      wechatNum: '',
      wechatForm: {
        weChatCorpID: {
          configValue: ''
        },
        weChatSecret: {
          configValue: ''
        },
        weChatapplyID: {
          configValue: ''
        }
      },
      wechatFormRules: {
        'weChatCorpID.configValue': [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        'weChatSecret.configValue': [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        'weChatapplyID.configValue': [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      ftpList: [],
      proxyList: [],
      approveProxyList: [],
      approveList: [],
      appDepositForm: {
        device_ip: '',
        device_port: '',
        device_account: '',
        device_passwd: '',
        device_domain: ''
      },
      netWorkLoading: false,
      isCheckWechat: false,
      isCheckMessage: false,
      isCheckMail: false,
      appDepositRule: {
        device_ip: [
          { required: true, message: '请输入IP', trigger: 'blur' },
          {
            pattern: /^((([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))\.){3}(([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))$/,
            message: '请输入正确的IP信息',
            trigger: 'blur'
          }
        ],
        device_port: [
          { required: true, message: '请输入端口号', trigger: 'blur' },
          {
            pattern: /(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)/,
            message: '请输入正确的端口号',
            trigger: 'blur'
          }
        ],
        device_account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { max: 30, message: '长度不能超过30位', trigger: 'blur' }
        ],
        device_passwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        device_domain: [Validaters.Name, Validaters.Max(100)]
      },
      nodeList: [],
      addStrategyDialog: false,
      currentIPRuleData: {},
      userUuid: this.$store.state.userData.uuid,
      workflowModule: {
        incident: 1,
        problem: 1,
        change: 1,
        publish: 1,
        request: 1,
        knowledge: 1
      },
      emailParamsList: [
        {
          // 邮件参数列表
          configName: '',
          configValue: '',
          inputtype: 2 // 1是输入框 2是密码框
        }
      ],
      messageParamsList: [
        {
          // 短信参数列表
          configName: '',
          configValue: '',
          inputtype: 2 // 1是输入框 2是密码框
        }
      ],
      emailPlatformList: [], // 邮件类型平台
      messagePlatformList: [] // 短信平台类型
    };
  },
  created() {
    this.getMailInfo();
    this.getMessageInfo();
    this.getWechatInfo();
    this.getFtpList();
    this.getProxyList();
    this.getApproveList();
    this.getApproveProxyList();
    // 托管中心配置
    this.getAppDeposit();
    this.getCustomIPRuleList();
    this.getWorlFlowModule();
    // 获取邮件短信服务器平台类型配置
    if (this.activeTab < 2) {
      this.getServiePlatform();
      this.getServieConfig();
    }
  },
  methods: {
    changeHandler(val, item) {
      val.configValue = '';
    },
    // 接收邮件dialog方法
    emailAndMessageParent() {
      this.getServiePlatform();
    },
    // 获取邮件短信服务器平台类型
    getServiePlatform() {
      $axios
        .get('/systemmanager/sysNotice/getSysNoticeByType/' + this.activeTab)
        .then(res => {
          if (res.data) {
            if (this.activeTab === 0) {
              this.emailPlatformList = res.data;
            } else if (this.activeTab === 1) {
              this.messagePlatformList = res.data;
            }
          }
        });
    },
    // 根据获取邮件短信配置
    getServieConfig() {
      $axios
        .get('/systemmanager/sysConfig/getSysNoticedata/2' + this.activeTab)
        .then(res => {
          if (res.data) {
            if (this.activeTab === 0) {
              let arr1 = [];
              res.data.forEach(item => {
                if (item.configName === 'email_platform') {
                  this.mailForm.type = item.configValue;
                } else {
                  let lastindex = item.configValue.lastIndexOf('_');
                  let firststr = item.configValue.substring(0, lastindex);
                  let laststr = item.configValue.substring(
                    lastindex + 1,
                    item.configValue.length
                  );
                  arr1.push({
                    ...item,
                    configValue: firststr,
                    inputtype: parseInt(laststr)
                  });
                }
              });
              if (arr1.length !== 0) {
                this.emailParamsList = arr1;
              }
            } else if (this.activeTab === 1) {
              let arr2 = [];
              res.data.forEach(item => {
                if (item.configName === 'sms_platform') {
                  this.messageForm.type = item.configValue;
                } else {
                  let lastindex = item.configValue.lastIndexOf('_');
                  let firststr = item.configValue.substring(0, lastindex);
                  let laststr = item.configValue.substring(
                    lastindex + 1,
                    item.configValue.length
                  );
                  arr2.push({
                    ...item,
                    configValue: firststr,
                    inputtype: parseInt(laststr)
                  });
                }
              });
              if (arr2.length !== 0) {
                this.messageParamsList = arr2;
              }
            }
          }
        });
    },
    // 查看详情
    eyeHandle(row) {
      $axios.get(`/proxyManager/getProxyInfo/${row.id}`).then(({ data }) => {
        this.eyeData = data;
        this.eyeManageDialog = true;
      });
    },
    // 获取代理列表
    getProxyList() {
      $axios.get('/proxyManager/getProxyList').then(({ data }) => {
        if (data.length) {
          for (let i = 0; i < data.length; i++) {
            data[i].online = data[i].online === 0 ? '不在线' : '在线';
            data[i].serviceStatus = Boolean(data[i].serviceStatus);
            data[i].serviceStatus = !data[i].serviceStatus;
          }
          this.proxyList = data;
        } else {
          this.proxyList = [];
        }
      });
    },
    // 获取业务系统列表
    getApproveList() {
      $axios
        .post('/agentBusinessSystem/getAllBusinessSystemInfo')
        .then(({ data }) => {
          if (data.length) {
            this.approveList = data;
          } else {
            this.approveList = [];
          }
        });
    },
    // 获取业务系统代理列表
    getApproveProxyList() {
      $axios
        .post('/agentBusinessSystem/getAllBusinessAgentInfo')
        .then(({ data }) => {
          if (data.length) {
            this.approveProxyList = data;
          } else {
            this.approveProxyList = [];
          }
        });
    },
    // 编辑
    editHandle(row) {
      this.manageSaveData = row;
      $axios.get(`/proxyManager/getProxyDetail/${row.id}`).then(({ data }) => {
        this.manageEditData = data;
        this.editManageDialog = true;
      });
    },
    closeSetDialog() {
      this.advanceProxySetDialog = false;
    },
    saveHandle() {
      const form = this.$refs['editProxy'].$refs['manageEdit'];
      const addform = this.$refs['editProxy'].manageEdit;
      form.validate(valid => {
        if (!valid) return;
        $axios
          .post('/proxyManager/uptProxy', {
            id: this.manageSaveData.id,
            uuid: this.manageSaveData.uuid,
            name: addform.name,
            ip: addform.ip,
            remarks: addform.remarks
          })
          .then(({ data }) => {
            if (data.state === true) {
              this.editManageDialog = false;
              this.$message.success('修改成功');
              this.getProxyList();
            } else {
              this.$message.error('修改失败');
            }
          });
      });
    },
    // 业务认证编辑保存
    saveApprove() {
      // const baseData = this.$refs['editApprove'].dataList;
      const editData = this.$refs['editApprove'].manageEdit;
      delete editData.updateTime;
      delete editData.createTime;
      if (
        editData.businessDatabaseInfoList === null ||
        editData.businessDatabaseInfoList.length === 0
      ) {
        this.$message.error('关联数据库不能为空');
        return;
      }
      if (editData.businessName.length > 255) {
        this.$message.error('名称长度不能超过255');
        return;
      }
      const form = this.$refs['editApprove'].$refs['manageEdit'];
      form.validate(valid => {
        if (!valid) return;
        if (editData.uuid) {
          // 编辑
          $axios
            .post('/agentBusinessSystem/editBusinessSystemInfo', editData)
            .then(({ data }) => {
              if (data === 'success') {
                this.editApproveDialog = false;
                this.$message.success('修改成功');
                this.getApproveList();
                this.getApproveProxyList();
              } else {
                this.$message.error('修改失败');
              }
            });
        } else {
          // 新增
          this.addCheckBool = false;
          $axios
            .post('/agentBusinessSystem/addBusinessSystemInfo', editData)
            .then(({ data }) => {
              if (data === 'success') {
                this.editApproveDialog = false;
                this.$message.success('保存成功');
                this.getApproveList();
                this.getApproveProxyList();
              } else {
                this.$message.error('保存失败');
              }
            });
        }
      });
    },
    // 改变业务系统一列的状态
    changeSwitch(uuid, val) {
      $axios
        .post('/agentBusinessSystem/updateSecretStatus', [uuid, val])
        .then(({ data }) => {
          if (data === 'success') {
            this.$message.success('状态改变成功');
          } else {
            this.$message.error('状态改变失败');
            this.getApproveList();
          }
        });
    },
    setHandle(row) {
      this.advanceSetRowData = row;
      $axios.get(`/proxyManager/getDataList/${row.id}`).then(({ data }) => {
        this.advanceProxySetDialog = true;
        for (let i = 0; i < data.length; i++) {
          data[i].monit = Boolean(data[i].monit);
        }
        this.interfaceInfo = data;
      });
    },
    // 删除代理
    deleteProxy(row) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          $axios.post(`/proxyManager//delNode/${row.id}`).then(({ data }) => {
            if (data.state === true) {
              this.$message.success('删除成功');
              this.getProxyList();
            } else {
              this.$message.error(data.errormsg);
            }
          });
        })
        .catch(() => {});
    },
    // 服务状态改变
    changeServiceStatus(row) {
      this.serviceStatus = row.serviceStatus ? 'start' : 'stop';
      $axios
        .get(`/proxyManager/chgStatus/${row.id}/${this.serviceStatus}`)
        .then(({ data }) => {
          if (data.state) {
            if (row.serviceStatus === true) {
              this.$message.success('开启服务成功!');
            } else {
              this.$message.success('关闭服务成功');
            }
          } else {
            row.serviceStatus = !row.serviceStatus;
            this.$message.error('失败，请重试');
          }
        });
    },
    getWorlFlowModule() {
      $axios
        .get('itilWorkflowConfig/getItilActivateConfList')
        .then(({ data }) => {
          this.workflowModule = data;
        });
    },
    saveWorkFlowModule() {
      $axios
        .post(
          'itilWorkflowConfig/batchUpdateItilActivateStatus',
          this.workflowModule
        )
        .then(({ data }) => {
          if (data.state === true) {
            this.$message.success(data.errormsg);
          } else {
            this.$message.error(data.errormsg);
          }
        });
    },
    getCustomIPRuleList() {
      $axios.get('/configcenter/nodeserver/getNodeServers').then(({ data }) => {
        if (data.length) {
          this.nodeList = data;
        } else {
          this.nodeList = [];
        }
      });
    },
    addRuleHandler(row) {
      this.currentIPRuleData = row;
      this.addStrategyDialog = true;
    },
    deleteRuleHandler(uuid, nodeId) {
      this.$confirm('确定删除该策略？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          $axios
            .post(`/configcenter/ipstrategy/deleteIpStrateg/${nodeId}/${uuid}`)
            .then(({ data }) => {
              if (data.result) {
                this.$message.success(data.errormsg);
              } else {
                this.$message.error(data.errormsg);
              }
              this.getCustomIPRuleList();
            });
        })
        .catch(() => {});
    },
    // 添加备份服务器
    backupServerSave() {
      const form = this.$refs['addServer'].$refs['serverForm'];
      const addForm = this.$refs['addServer'].serverForm;
      let afterForm = cloneDeep(addForm);
      afterForm.archiveDevicePasswd = encryptPwd(afterForm.archiveDevicePasswd);
      form.validate(valid => {
        if (!valid) return;
        // 服务器名称的长度判断
        if (afterForm.archiveDeviceName.length > 50) {
          this.$message({
            type: 'error',
            message: '服务器名称长度不超过50个字'
          });
          return;
        }
        $axios
          .post('/archiveDevice/save', afterForm, {
            logTemplate: '设置|FTP服务器配置'
          })
          .then(res => {
            if (res.data === true) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.backupServerDialog = false;
              this.getFtpList();
            } else {
              this.$message({
                message: '服务器名称或者IP地址/端口不可重复!',
                type: 'error'
              });
            }
          });
      });
    },
    editServerSave() {
      const form = this.$refs['editServer'].$refs['serverForm'];
      const addForm = this.$refs['editServer'].serverForm;
      let afterForm = cloneDeep(addForm);
      afterForm.archiveDevicePasswd = encryptPwd(afterForm.archiveDevicePasswd);
      form.validate(valid => {
        if (!valid) return;
        // 服务器名称的长度判断
        if (afterForm.archiveDeviceName.length > 50) {
          this.$message({
            type: 'error',
            message: '服务器名称长度不超过50个字'
          });
          return;
        }
        $axios.post('/archiveDevice/update', afterForm).then(res => {
          if (res.data === true) {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.editServerDialog = false;
            this.getFtpList();
          } else {
            this.$message({
              message: '服务器名称或者IP地址/端口不可重复!',
              type: 'error'
            });
          }
        });
      });
    },
    showBackupServer() {
      this.backupServerDialog = true;
    },
    showEditServer(row) {
      this.editServerDialog = true;
      this.editData = row;
      this.editData.archiveDevicePasswd = decryptPwd(
        this.editData.archiveDevicePasswd
      );
    },
    getPaginationDef() {
      return {
        layout: 'prev, pager, next',
        pageSize: 5
      };
    },
    formatterStatus(item) {
      return item.archiveDeviceType === 1 ? 'FTP服务器' : 'SFTP服务器';
    },
    getFtpList() {
      $axios.get('/archiveDevice/getList').then(res => {
        if (res.data) {
          this.ftpList = res.data;
        } else {
          this.ftpList = [];
        }
      });
    },
    checkWechat() {
      if (this.wechatNum === '') {
        this.$message({ message: '请输入测试微信号', type: 'error' });
        return false;
      }
      let testObj = {
        configName: 'testWechat',
        configValue: this.wechatNum
      };
      let form = [];
      for (const item in this.wechatForm) {
        form.push(this.wechatForm[item]);
      }
      form.push(testObj);
      this.isCheckWechat = true;
      $axios
        .post('/systemmanager/sysConfig/updateWeChatdataAndTest', form)
        .then(res => {
          if (res.data.result === true) {
            this.$message({ message: res.data.msg, type: 'success' });
          } else {
            this.$message({ message: res.data.msg, type: 'error' });
          }
          this.isCheckWechat = false;
        })
        .catch(() => {
          this.isCheckWechat = false;
          this.$message({
            message: '测试超时！',
            type: 'error'
          });
        });
    },
    saveWechat() {
      if (this.wechatForm.weChatCorpID.configValue === '') {
        this.$message({ message: '请输入CorpID', type: 'error' });
        return false;
      }
      if (this.wechatForm.weChatSecret.configValue === '') {
        this.$message({ message: '请输入Secret', type: 'error' });
        return false;
      }
      if (this.wechatForm.weChatapplyID.configValue === '') {
        this.$message({ message: '请输入应用ID', type: 'error' });
        return false;
      }
      let form = [];
      for (const item in this.wechatForm) {
        form.push(this.wechatForm[item]);
      }
      $axios
        .post('/systemmanager/sysConfig/updateWeChatdata', form, {
          logTemplate: '设置|微信服务器配置'
        })
        .then(res => {
          if (res.data === 'success') {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          }
        });
    },
    getWechatInfo() {
      $axios.get('/systemmanager/sysConfig/getWeChat').then(res => {
        if (res.data) {
          this.wechatForm = res.data;
        }
      });
    },
    saveMessage() {
      let arr = this.messageParamsList.map((item, index) => {
        let obj = {
          ...item,
          configValue: !item.configValue
            ? item.configValue
            : `${item.configValue}_${item.inputtype}`,
          configType: 21
        };
        delete obj.inputtype;
        return obj;
      });
      arr.push({
        configType: 21,
        configName: 'sms_platform',
        configValue: this.messageForm.type,
        enabled: 1
      });
      let params = {
        type: 21,
        sysconfigs: arr
      };
      $axios
        .post('/systemmanager/sysConfig/updateSystemNoticeData', params, {
          logTemplate: '设置|短信服务器配置'
        })
        .then(res => {
          if (res.data) {
            this.getServieConfig();
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          }
        });
    },
    checkMessage() {
      this.isCheckMessage = true;
      let arr = this.messageParamsList.map((item, index) => {
        let obj = {
          ...item,
          configValue: !item.configValue
            ? item.configValue
            : `${item.configValue}_${item.inputtype}`,
          configType: 21
        };
        delete obj.inputtype;
        return obj;
      });
      arr.push({
        configType: 21,
        configName: 'sms_platform',
        configValue: this.messageForm.type,
        enabled: 1
      });
      let params = {
        to: this.messageForm.testPhone,
        type: 21,
        sysconfigs: arr
      };
      $axios
        .post('/systemmanager/sysConfig/testSmsInfo', params, {
          logTemplate: '测试|短信服务器配置'
        })
        .then(({ data }) => {
          this.isCheckMessage = false;
          if (data.state) {
            this.getServieConfig();
            this.$message({ type: 'success', message: '测试保存成功' });
          } else {
            this.$message({ type: 'error', message: data.errormsg });
          }
        });
    },
    getMessageInfo() {
      $axios.get('/sysSmsInfo/getSysSmsInfo').then(res => {
        if (res.data.sysSmsInfo) {
          this.messageForm = res.data.sysSmsInfo;
          this.messageForm.smsServAccpwd = decryptPwd(
            this.messageForm.smsServAccpwd
          );
        }
      });
    },
    getMailInfo() {
      $axios.get(`/emailInfo/getInfo`).then(res => {
        if (res.data) {
          this.mailForm = res.data;
          this.mailForm.port = this.mailForm.port.toString();
          this.mailForm.emailPasswd = decryptPwd(this.mailForm.emailPasswd);
        }
      });
    },
    // 保存邮件配置
    saveMail() {
      this.mailRule.mailbox = [];
      let arr = this.emailParamsList.map((item, index) => {
        let obj = {
          ...item,
          configValue: !item.configValue
            ? item.configValue
            : `${item.configValue}_${item.inputtype}`,
          configType: 20
        };
        delete obj.inputtype;
        return obj;
      });
      arr.push({
        configType: 20,
        configName: 'email_platform',
        configValue: this.mailForm.type,
        enabled: 1
      });
      let params = {
        type: 20,
        sysconfigs: arr
      };
      $axios
        .post('/systemmanager/sysConfig/updateSystemNoticeData', params, {
          logTemplate: '设置|邮件服务器配置'
        })
        .then(res => {
          if (res.data) {
            this.getServieConfig();
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          }
        });
    },
    checkMail() {
      this.mailRule.mailbox = [
        {
          pattern: /^([A-Za-z0-9_\-\.])+@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/,
          message: '请填写正确格式的email',
          trigger: 'blur'
        }
      ];
      this.$refs['mailForm'].validate(valid => {
        if (valid) {
          this.isCheckMail = true;
          let arr = this.emailParamsList.map((item, index) => {
            let obj = {
              ...item,
              configValue: !item.configValue
                ? item.configValue
                : `${item.configValue}_${item.inputtype}`,
              configType: 20
            };
            delete obj.inputtype;
            return obj;
          });
          arr.push({
            configType: 20,
            configName: 'email_platform',
            configValue: this.mailForm.type,
            enabled: 1
          });
          let params = {
            to: this.mailForm.mailbox,
            type: 20,
            sysconfigs: arr
          };
          $axios
            .post('/systemmanager/sysConfig/testEmailInfo', params, {
              logTemplate: '测试|邮件服务器配置'
            })
            .then(({ data }) => {
              this.isCheckMail = false;
              if (data.state) {
                this.getServieConfig();
                this.$message({ type: 'success', message: '测试保存成功' });
              } else {
                this.$message({ type: 'error', message: data.errormsg });
              }
            });
        } else {
        }
      });
    },
    // 业务系统认证按钮新增
    getApproveListActionsDef() {
      let self = this;
      return {
        width: 6,
        actions: [
          {
            name: '新增',
            click() {
              self.addCheckBool = true;
              self.check = false;
              self.ApproveEditData = {};
              self.editApproveDialog = true;
            },
            icon: 'plus'
          }
        ]
      };
    },
    // 业务系统认证查询
    getSearchApproveDef() {
      return {
        width: 4,
        offset: 14,
        placeholder: '请输入查询内容',
        searchProps: [
          'businessIp',
          'businessName',
          'secret',
          'secretStatus',
          'createTime',
          'updateTime'
        ]
      };
    },
    // 业务系统认证操作
    getApproveRowActionsDef() {
      let vm = this;
      return [
        {
          icon: 'eye',
          name: '查看',
          click(row) {
            $axios
              .post(`/agentBusinessSystem/viewBusinessSystemInfo`, [row.uuid])
              .then(({ data }) => {
                if (data.businessDatabaseInfoList === null) {
                  data.businessDatabaseInfoList = [];
                }
                vm.ApproveEditData = data;
                vm.check = true;
                vm.editApproveDialog = true;
              });
          }
        },
        {
          icon: 'edit',
          name: '修改',
          click(row) {
            $axios
              .post(`/agentBusinessSystem/viewBusinessSystemInfo`, [row.uuid])
              .then(({ data }) => {
                if (data.businessDatabaseInfoList === null) {
                  data.businessDatabaseInfoList = [];
                }
                vm.ApproveEditData = data;
                vm.check = false;
                vm.editApproveDialog = true;
              });
          }
        },
        {
          icon: 'delete',
          name: '删除',
          click(row) {
            vm.$confirm('确定删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                $axios
                  .post(`/agentBusinessSystem/delBusinessSystemInfo`, [
                    row.uuid
                  ])
                  .then(res => {
                    if (res.data === 'success') {
                      vm.$message({ type: 'success', message: '删除成功' });
                      vm.getApproveList();
                      vm.getApproveProxyList();
                    } else {
                      vm.$message({ type: 'error', message: '删除失败' });
                    }
                  });
              })
              .catch(() => {});
          }
        }
      ];
    },
    // 业务系统认证代理操作
    ApproveProxyEyeHandle() {},
    ApproveProxyEditHandle() {},
    deleteApproveProxy() {},
    getRowActionsDef() {
      let vm = this;
      return [
        {
          icon: 'edit',
          name: '修改',
          click(row) {
            vm.showEditServer(row);
          }
        },
        {
          icon: 'delete',
          name: '删除',
          click(row) {
            vm.$confirm('确定删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                $axios.post(`/archiveDevice/delete/${row.uuid}`).then(res => {
                  if (res.data.result === true) {
                    vm.$message({ type: 'success', message: '删除成功' });
                    vm.getFtpList();
                  } else if (res.data.result === false) {
                    vm.$message({ type: 'error', message: res.data.msg });
                  }
                });
              })
              .catch(() => {});
          }
        }
      ];
    },
    getListActionsDef() {
      let self = this;
      return {
        width: 6,
        actions: [
          {
            name: '添加备份服务器',
            click() {
              self.showBackupServer();
            },
            icon: 'plus'
          }
        ]
      };
    },
    getSearchDef() {
      return {
        width: 4,
        offset: 14,
        placeholder: '查询条件',
        searchProps: [
          'archiveDeviceType',
          'archiveDeviceAccount',
          'archiveDeviceDir',
          'archiveDeviceIp',
          'archiveDeviceName',
          'archiveDevicePort'
        ] // can be string or Array
      };
    },
    getSearchProxyDef() {
      return {
        width: 4,
        offset: 20,
        placeholder: '请输入查询内容',
        searchProps: [
          'name',
          'ip',
          'port',
          'ssid',
          'serviceStatus',
          'online',
          'remarks'
        ]
      };
    },
    // 应用托管
    getAppDeposit() {
      $axios.get('/configcenter/sysconfig/getAppBox').then(({ data }) => {
        this.appDepositForm = data;
        this.appDepositForm.device_port = String(data.device_port);
        this.appDepositForm.device_passwd = decryptPwd(
          this.appDepositForm.device_passwd
        );
      });
    },
    netWorkTest() {
      let afterForm = cloneDeep(this.appDepositForm);
      afterForm.device_passwd = encryptPwd(afterForm.device_passwd);
      this.$refs.appDepositForm.validate(valid => {
        if (!valid) return;
        this.netWorkLoading = true;
        $axios
          .post('/configcenter/sysconfig/checkAndSetAppBox', afterForm)
          .then(({ data }) => {
            this.netWorkLoading = false;
            if (data.result) {
              this.$message.success(data.errormsg);
            } else {
              this.$message.error(data.errormsg);
            }
          });
      });
    },
    // 保存添加策略表单
    saveStrategyForm() {
      let _self = this;
      _self.$refs['addStrategy'].$refs['Form'].validate(valid => {
        if (valid) {
          $axios
            .post(
              `/configcenter/ipstrategy/addIpStrateg/${this.currentIPRuleData.nodeId}`,
              _self.$refs['addStrategy'].Form
            )
            .then(({ data }) => {
              console.log(data);
              if (data.result) {
                this.$message.success(data.errormsg);
              } else {
                this.$message.error(data.errormsg);
              }
              _self.addStrategyDialog = false;
              _self.getCustomIPRuleList();
            });
        } else {
          return false;
        }
      });
    },
    saveAppDeposit() {
      let _self = this;
      let afterForm = cloneDeep(_self.appDepositForm);
      afterForm.device_passwd = encryptPwd(afterForm.device_passwd);
      _self.$refs.appDepositForm.validate(function(valid) {
        if (valid) {
          $axios
            .post('/configcenter/sysconfig/setAppBox', afterForm, {
              logTemplate: '设置|托管中心配置'
            })
            .then(function({ data }) {
              if (data.result) {
                _self.$message.success(data.errormsg);
              } else {
                _self.$message.error(data.errormsg);
              }
            });
        }
      });
    },
    paramsListAdd() {
      if (this.activeTab === 0) {
        this.emailParamsList.push({
          // 参数列表
          configName: '',
          configValue: '',
          inputtype: 2, // 1是输入框 2是密码框
          enabled: 1
        });
      } else if (this.activeTab === 1) {
        this.messageParamsList.push({
          // 参数列表
          configName: '',
          configValue: '',
          inputtype: 2, // 1是输入框 2是密码框
          enabled: 1
        });
      }
    },
    paramsListDel(index) {
      if (this.activeTab === 0) {
        this.emailParamsList.splice(index, 1);
      } else if (this.activeTab === 1) {
        this.messageParamsList.splice(index, 1);
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    messageForm: {
      deep: true,
      handler(val) {
        if (val.smsServType === 4) {
          this.$refs['messageForm'].clearValidate();
          this.messageType = false;
        } else {
          this.messageType = true;
        }
      }
    },

    activeTab(val) {
      if (val < 2) {
        this.getServiePlatform();
        this.getServieConfig();
      }
    },
    value: {
      immediate: true,
      handler(val) {
        this.dialogFlag = val;
      }
    },
    dialogFlag(val) {
      this.$emit('input', val);
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
.high-level-set {
  margin: 0 20px;

  .params-list {
    .iconfont {
      cursor: pointer;
      margin-left: 5px;
    }
  }

  .bussiness-title {
    padding: 10px 0;
  }

  .s-form-wrapper {
    width: 800px;
  }
}

.setScore-box-card {
  border: none;
}

.card-title {
  .grade-title {
    font-weight: 700;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    margin-bottom: 5px;
  }
}

@keyframes loading-diandiandian {
  from {
    width: 0;
  }

  to {
    width: 20px;
  }
}

@keyframes animation1 {
  0% {
    transform: translate(-10px, 0) scale(1, 1);
  }

  25% {
    transform: translate(0, 0) scale(1.5, 1.5);
  }

  50% {
    transform: translate(10px, 0) scale(1, 1);
  }

  75% {
    transform: translate(0, 0) scale(0.2, 0.2);
  }

  100% {
    transform: translate(-10px, 0) scale(1, 1);
  }
}

@keyframes animation2 {
  0% {
    transform: translate(10px, 0) scale(1, 1);
  }

  25% {
    transform: translate(0, 0) scale(0.2, 0.2);
  }

  50% {
    transform: translate(-10px, 0) scale(1, 1);
  }

  75% {
    transform: translate(0, 0) scale(1.5, 1.5);
  }

  100% {
    transform: translate(10px, 0) scale(1, 1);
  }
}

.network-test-loading2 {
  display: inline-block;
  position: relative;
  width: 20px;
  height: 10px;
  margin-left: 10px;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.network-test-loading2:before, .network-test-loading2:after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 14px;
  height: 14px;
  margin-left: -7px;
  margin-top: -7px;
  border-radius: 7px;
  border-bottom: 1px solid #fff;
}

.network-test-loading2:before {
  animation: rotate 0.8s ease-out infinite;
}

.network-test-loading2:after {
  animation: rotate 0.8s linear infinite;
}

#index-body {
  .s-card.app-center {
    .s-card-header {
      padding-left: 10px !important;
      padding-right: 10px;
    }

    .s-card-body {
      padding-left: 10px;
      padding-right: 10px;
    }
  }
}
</style>
