<template>
  <div>
    <s-form :model="workflowModule" label-width="120px">
      <s-form-item label="事件管理:">
        <s-switch @change="saveWorkFlowModule" v-model="workflowModule.incident" :active-value="1"
                  :inactive-value="0"></s-switch>
      </s-form-item>
      <s-form-item label="问题管理:">
        <s-switch @change="saveWorkFlowModule" v-model="workflowModule.problem" :active-value="1"
                  :inactive-value="0"></s-switch>
      </s-form-item>
      <s-form-item label="变更管理:">
        <s-switch @change="saveWorkFlowModule" v-model="workflowModule.change" :active-value="1"
                  :inactive-value="0"></s-switch>
      </s-form-item>
      <s-form-item label="发布管理:">
        <s-switch @change="saveWorkFlowModule" v-model="workflowModule.publish" :active-value="1"
                  :inactive-value="0"></s-switch>
      </s-form-item>
      <s-form-item label="服务请求:">
        <s-switch @change="saveWorkFlowModule" v-model="workflowModule.request" :active-value="1"
                  :inactive-value="0"></s-switch>
      </s-form-item>
      <s-form-item label="知识库:">
        <s-switch @change="saveWorkFlowModule" v-model="workflowModule.knowledge" :active-value="1"
                  :inactive-value="0"></s-switch>
      </s-form-item>
    </s-form>
  </div>

</template>
<script type="text/babel">
  // import SelectAsset from '../components/SelectAsset.vue'

  // import BackupServer from '../BackupServer'
  // import addRule from '../components/addRule.vue'
  import $axios from 'sunflower-ajax'
  // import {cloneDeep} from 'lodash'
  // import {decryptPwd, encryptPwd} from 'sunflower-common-utils'
  // import AddIpRule from '../components/AddIpRule.vue'
  // import EyeManage from '../components/EyeManage.vue'
  // import AdvanceProxySet from '../components/AdvanceProxySet.vue'
  import authCheck from '@/common/mixins/auth.js'
  // import EditManage from '../components/EditManage.vue'
  // import ApproveEditManage from '../components/ApproveEditManage.vue'
  // import EmailAndMessagePlatformDialog from './EmailAndMessagePlatformDialog.vue' // 自定义邮件短信平台类型
  import {Validaters} from 'sunflower-common-utils';

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
      // EmailAndMessagePlatformDialog // 自定义邮件短信平台类型
    },
    data() {
      return {
        check: true, // 查看业务系统
        addCheckBool: false, // 新增业务系统
        manageEditData: {},
        manageSaveData: {},
        ApproveEditData: {},
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
        activeTab: 'pane1',
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
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
      this.getWorlFlowModule()
    },
    methods: {
      getWorlFlowModule() {
        $axios.get('itilWorkflowConfig/getItilActivateConfList').then(({data}) => {
          this.workflowModule = data
        })
      },
      saveWorkFlowModule() {
        $axios.post('itilWorkflowConfig/batchUpdateItilActivateStatus', this.workflowModule).then(({data}) => {
          if (data.state === true) {
            this.$message.success(data.errormsg)
          } else {
            this.$message.error(data.errormsg)
          }
        })
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
