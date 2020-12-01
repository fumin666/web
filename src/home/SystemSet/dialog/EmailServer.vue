<template>
  <div class="high-level-set">
    <s-form class="s-form-wrapper" key="mailForm" ref="mailForm" :model="mailForm" :rules="mailRule">
      <div class="spanText" style="margin-bottom:20px;opacity: 0.85;font-size: 14px;">邮件平台类型：</div>
      <s-form-item label="" prop="type">
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
      <div class="spanText" style="margin-bottom:20px;opacity: 0.85;font-size: 14px;">参数列表：</div>
      <s-form-item label="" prop="sysconfigs">
        <s-col span="24">
          <div class="s-search-group" style="width:650px;padding:10px">
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
                    <i v-if="index === 0" class="iconfont icon-add bg" @click="paramsListAdd()" title="添加"></i>
                    <i v-else class="iconfont icon-delete bg" @click="paramsListDel(index)" title="删除"></i>
                  </div>
                </li>
              </ul>
            </s-scrollbar>
          </div>
        </s-col>
      </s-form-item>
      <div class="spanText" style="margin-bottom:20px;opacity: 0.85;font-size: 14px;">收件账号：</div>
      <s-form-item label="" prop="mailbox">
        <s-col span="24">
          <s-input v-model="mailForm.mailbox" placeholder="测试必须填写" style="width:650px"></s-input>
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
    </s-form>
    <!-- 自定义邮件短信平台类型 -->
    <EmailAndMessagePlatformDialog v-if="emailAndMessagePlatformDialog" v-model="emailAndMessagePlatformDialog"
                                   :platform="activeType"
                                   @emailAndMessageParent="emailAndMessageParent()"></EmailAndMessagePlatformDialog>
  </div>

</template>
<script type="text/babel">
  // import SelectAsset from '../components/SelectAsset.vue'

  // import BackupServer from '../BackupServer'
  // import addRule from '../components/addRule.vue'
  import $axios from 'sunflower-ajax'
  // import {} from 'lodash'
  import { decryptPwd, Validaters } from 'sunflower-common-utils'
  // import AddIpRule from '../components/AddIpRule.vue'
  // import EyeManage from '../components/EyeManage.vue'
  // import AdvanceProxySet from '../components/AdvanceProxySet.vue'
  import authCheck from '@/common/mixins/auth.js'
  // import EditManage from '../components/EditManage.vue'
  // import ApproveEditManage from '../components/ApproveEditManage.vue'
  import EmailAndMessagePlatformDialog from './EmailAndMessagePlatformDialog.vue' // 自定义邮件短信平台类型

  export default {
    mixins: [authCheck],
    components: {
      // BackupServer,
      // addRule,
      // SelectAsset,
      // AddIpRule,
      // EyeManage,
      // AdvanceProxySet,
      // EditManage,
      // ApproveEditManage,
      EmailAndMessagePlatformDialog // 自定义邮件短信平台类型
    },
    data() {
      return {
        check: true, // 查看业务系统
        addCheckBool: false, // 新增业务系统
        manageEditData: {},
        manageSaveData: {},
        ApproveEditData: {},
        activeType: 0,
        tabNameArr: [
          'systemSet_emailServer',
          'systemSet_messageServer',
          'systemSet_wechatServer',
          'systemSet_ftpServer',
          'systemSet_daycareCenters',
          'systemSet_nodeIpStrategy',
          'systemSet_itilActivationManage',
          'systemSet_agentManagement',
          'systemSet_businessSysCertification'
        ], // 页签名字的集合(顺序和页签一致)
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
            {required: false, message: '不能为空', trigger: 'blur'},
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
            {required: true, message: '不能为空', trigger: 'blur'},
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
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          'weChatSecret.configValue': [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          'weChatapplyID.configValue': [
            {required: true, message: '不能为空', trigger: 'blur'}
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
            {required: true, message: '请输入IP', trigger: 'blur'},
            {
              pattern: /^((([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))\.){3}(([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))$/,
              message: '请输入正确的IP信息',
              trigger: 'blur'
            }
          ],
          device_port: [
            {required: true, message: '请输入端口号', trigger: 'blur'},
            {
              pattern: /(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)/,
              message: '请输入正确的端口号',
              trigger: 'blur'
            }
          ],
          device_account: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            {max: 30, message: '长度不能超过30位', trigger: 'blur'}
          ],
          device_passwd: [{required: true, message: '请输入密码', trigger: 'blur'}],
          device_domain: [
            Validaters.Name,
            Validaters.Max(100)
          ]
        },
        nodeList: [],
        addStrategyDialog: false,
        currentIPRuleData: {},
        activeTab: 'pane1',
        userUuid: this.$store.state.userData.uuid,
        workflowModule: {
          incident: 1,
          problem: 1,
          change: 1,
          publish: 1,
          request: 1,
          knowledge: 1
        },
        emailParamsList: [{ // 邮件参数列表
          configName: '',
          configValue: '',
          inputtype: 2        // 1是输入框 2是密码框
        }],
        messageParamsList: [{ // 短信参数列表
          configName: '',
          configValue: '',
          inputtype: 2        // 1是输入框 2是密码框
        }],
        emailPlatformList: [], // 邮件类型平台
        messagePlatformList: []  // 短信平台类型
      }
    },
    created() {
      this.activeType = 0
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
      this.getMailInfo()
      this.getMessageInfo()

      // 托管中心配置
      // 获取邮件短信服务器平台类型配置
      this.getServiePlatform();
      this.getServieConfig();
    },
    methods: {
      changeHandler(val, item) {
        val.configValue = '';
      },
      selection(key) {
        this.pane = key
      },
      // 接收邮件dialog方法
      emailAndMessageParent() {
        this.getServiePlatform();
      },
      // 获取邮件短信服务器平台类型
      getServiePlatform() {
        let tabIndex = parseInt(this.activeTab.split('pane')[1]) - 1;
        $axios.get('/systemmanager/sysNotice/getSysNoticeByType/' + tabIndex).then((res) => {
          if (res.data) {
            if (this.activeTab === 'pane1') {
              this.emailPlatformList = res.data;
            } else if (this.activeTab === 'pane2') {
              this.messagePlatformList = res.data;
            }
          }
        })
      },
      // 根据获取邮件短信配置
      getServieConfig() {
        let tabIndex = parseInt(this.activeTab.split('pane')[1]) - 1;
        $axios.get('/systemmanager/sysConfig/getSysNoticedata/2' + tabIndex).then((res) => {
          if (res.data) {
            if (this.activeTab === 'pane1') {
              let arr1 = [];
              res.data.forEach(item => {
                if (item.configName === 'email_platform') {
                  this.mailForm.type = item.configValue;
                } else {
                  let lastindex = item.configValue.lastIndexOf('_');
                  let firststr = item.configValue.substring(0, lastindex);
                  let laststr = item.configValue.substring(lastindex + 1, item.configValue.length);
                  arr1.push({...item, configValue: firststr, inputtype: parseInt(laststr)});
                }
              });
              if (arr1.length !== 0) {
                this.emailParamsList = arr1;
              }
            } else if (this.activeTab === 'pane2') {
              let arr2 = [];
              res.data.forEach(item => {
                if (item.configName === 'sms_platform') {
                  this.messageForm.type = item.configValue;
                } else {
                  let lastindex = item.configValue.lastIndexOf('_');
                  let firststr = item.configValue.substring(0, lastindex);
                  let laststr = item.configValue.substring(lastindex + 1, item.configValue.length);
                  arr2.push({...item, configValue: firststr, inputtype: parseInt(laststr)});
                }
              });
              if (arr2.length !== 0) {
                this.messageParamsList = arr2;
              }
            }
          }
        })
      },

      getMessageInfo() {
        $axios.get('/sysSmsInfo/getSysSmsInfo').then((res) => {
          if (res.data.sysSmsInfo) {
            this.messageForm = res.data.sysSmsInfo
            this.messageForm.smsServAccpwd = decryptPwd(this.messageForm.smsServAccpwd)
          }
        })
      },
      getMailInfo() {
        $axios.get(`/emailInfo/getInfo`).then((res) => {
          if (res.data) {
            this.mailForm = res.data
            this.mailForm.port = this.mailForm.port.toString()
            this.mailForm.emailPasswd = decryptPwd(this.mailForm.emailPasswd)
          }
        })
      },
      // 保存邮件配置
      saveMail() {
        this.mailRule.mailbox = [];
        let arr = this.emailParamsList.map((item, index) => {
          let obj = {
            ...item,
            configValue: !item.configValue ? item.configValue : `${item.configValue}_${item.inputtype}`,
            configType: 20
          }
          delete obj.inputtype;
          return obj;
        });
        arr.push({
          configType: 20,
          configName: 'email_platform',
          configValue: this.mailForm.type,
          enabled: 1
        })
        let params = {
          type: 20,
          sysconfigs: arr
        }
        $axios.post('/systemmanager/sysConfig/updateSystemNoticeData', params, {
          logTemplate: '设置|邮件服务器配置'
        }).then((res) => {
          if (res.data) {
            this.getServieConfig();
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          }
        })
      },
      checkMail() {
        this.mailRule.mailbox = [
          {
            pattern: /^([A-Za-z0-9_\-\.])+@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/,
            message: '请填写正确格式的email',
            trigger: 'blur'
          }
        ];
        this.$refs['mailForm'].validate((valid) => {
          if (valid) {
            this.isCheckMail = true;
            let arr = this.emailParamsList.map((item, index) => {
              let obj = {
                ...item,
                configValue: !item.configValue ? item.configValue : `${item.configValue}_${item.inputtype}`,
                configType: 20
              }
              delete obj.inputtype;
              return obj;
            });
            arr.push({
              configType: 20,
              configName: 'email_platform',
              configValue: this.mailForm.type,
              enabled: 1
            })
            let params = {
              to: this.mailForm.mailbox,
              type: 20,
              sysconfigs: arr
            }
            $axios.post('/systemmanager/sysConfig/testEmailInfo', params, {
              logTemplate: '测试|邮件服务器配置'
            }).then(({data}) => {
              this.isCheckMail = false;
              if (data.state) {
                this.getServieConfig();
                this.$message({type: 'success', message: '测试保存成功'});
              } else {
                this.$message({type: 'error', message: data.errormsg});
              }
            })
          } else {

          }
        });
      },
      paramsListAdd() {
        if (this.activeTab === 'pane1') {
          this.emailParamsList.push({ // 参数列表
            configName: '',
            configValue: '',
            inputtype: 2,       // 1是输入框 2是密码框
            enabled: 1
          });
        } else if (this.activeTab === 'pane2') {
          this.messageParamsList.push({ // 参数列表
            configName: '',
            configValue: '',
            inputtype: 2,        // 1是输入框 2是密码框
            enabled: 1
          });
        }
      },
      paramsListDel(index) {
        if (this.activeTab === 'pane1') {
          this.emailParamsList.splice(index, 1);
        } else if (this.activeTab === 'pane2') {
          this.messageParamsList.splice(index, 1);
        }
      }
    },
    watch: {
      messageForm: {
        deep: true,
        handler(val) {
          if (val.smsServType === 4) {
            this.$refs['messageForm'].clearValidate()
            this.messageType = false
          } else {
            this.messageType = true
          }
        }
      },
      activeTab(val) {
        let tabIndex = parseInt(val.split('pane')[1]) - 1
        if (tabIndex < 2) {
          this.getServiePlatform();
          this.getServieConfig();
        }
      }
    }
  }
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
    .bussiness-title{
      padding 10px 0
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
