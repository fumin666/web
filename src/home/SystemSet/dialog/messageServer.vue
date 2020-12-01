<template>
  <div class="high-level-set">
    <s-form class="s-form-wrapper" key="messageForm" ref="messageForm" :model="messageForm" :rules="messageRule">
      <div class="spanText" style="margin-bottom:20px;opacity: 0.85;font-size: 14px;">短信平台类型：</div>
      <s-form-item label="" prop="ssl">
        <s-col span="24">
          <s-select v-model="messageForm.type">
            <s-option v-for="(item,index) in messagePlatformList" :key="index" :label="item.name"
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
                <li v-for="(item,index) in messageParamsList" :key="index">
                  <div>
                    <s-input v-model="messageParamsList[index].configName" style="width:auto;"></s-input>
                    <span>=</span>
                    <s-input :type="messageParamsList[index].inputtype === 1? 'password' : 'text'"
                              v-model="messageParamsList[index].configValue" style="width:auto;"></s-input>
                    <s-select v-model="messageParamsList[index].inputtype" placeholder="选择参数类型">
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
      <div class="spanText" style="margin-bottom:20px;opacity: 0.85;font-size: 14px;">测试手机号：</div>
      <s-form-item label="" prop="testPhone">
        <s-col span="24">
          <s-input v-model="messageForm.testPhone" style="width:650px"></s-input>
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

  // import {cloneDeep} from 'lodash'
  // import AddIpRule from '../components/AddIpRule.vue'
  // import EyeManage from '../components/EyeManage.vue'
  // import AdvanceProxySet from '../components/AdvanceProxySet.vue'
  import authCheck from '@/common/mixins/auth.js'
  // import EditManage from '../components/EditManage.vue'
  // import ApproveEditManage from '../components/ApproveEditManage.vue'
  import EmailAndMessagePlatformDialog from './EmailAndMessagePlatformDialog.vue' // 自定义邮件短信平台类型
  import { decryptPwd, Validaters } from 'sunflower-common-utils';

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
        activeType: 1,
        check: true, // 查看业务系统
        addCheckBool: false, // 新增业务系统
        manageEditData: {},
        manageSaveData: {},
        ApproveEditData: {},
        tabNameArr: [
          'pane1',
          'pane2',
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
        isCheckMessage: false,
        isCheckMail: false,
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
        activeTab: 'pane2',
        emailPlatformList: [], // 邮件类型平台
        messagePlatformList: []  // 短信平台类型
      }
    },
    created() {
      this.activeType = 1
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
      this.getMailInfo()
      this.getMessageInfo()
      // 获取邮件短信服务器平台类型配置
      this.getServiePlatform();
      this.getServieConfig();
    },
    methods: {
      // 接收邮件dialog方法
      emailAndMessageParent() {
        this.getServiePlatform();
      },
      // 获取邮件短信服务器平台类型
      getServiePlatform() {
        $axios.get('/systemmanager/sysNotice/getSysNoticeByType/' + 1).then((res) => {
          if (res.data) {
              this.messagePlatformList = res.data;
          }
        })
      },
      // 根据获取邮件短信配置
      getServieConfig() {
        $axios.get('/systemmanager/sysConfig/getSysNoticedata/2' + 1).then((res) => {
          if (res.data) {
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
        })
      },

      saveMessage() {
        let arr = this.messageParamsList.map((item, index) => {
          let obj = {
            ...item,
            configValue: !item.configValue ? item.configValue : `${item.configValue}_${item.inputtype}`,
            configType: 21
          }
          delete obj.inputtype;
          return obj;
        });
        arr.push({
          configType: 21,
          configName: 'sms_platform',
          configValue: this.messageForm.type,
          enabled: 1
        })
        let params = {
          type: 21,
          sysconfigs: arr
        }
        $axios.post('/systemmanager/sysConfig/updateSystemNoticeData', params, {
          logTemplate: '设置|短信服务器配置'
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
      checkMessage() {
        this.isCheckMessage = true;
        let arr = this.messageParamsList.map((item, index) => {
          let obj = {
            ...item,
            configValue: !item.configValue ? item.configValue : `${item.configValue}_${item.inputtype}`,
            configType: 21
          }
          delete obj.inputtype;
          return obj;
        });
        arr.push({
          configType: 21,
          configName: 'sms_platform',
          configValue: this.messageForm.type,
          enabled: 1
        })
        let params = {
          to: this.messageForm.testPhone,
          type: 21,
          sysconfigs: arr
        }
        $axios.post('/systemmanager/sysConfig/testSmsInfo', params, {
          logTemplate: '测试|短信服务器配置'
        }).then(({data}) => {
          this.isCheckMessage = false;
          if (data.state) {
            this.getServieConfig();
            this.$message({type: 'success', message: '测试保存成功'});
          } else {
            this.$message({type: 'error', message: data.errormsg});
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
          this.messageParamsList.push({ // 参数列表
            configName: '',
            configValue: '',
            inputtype: 2,        // 1是输入框 2是密码框
            enabled: 1
          });
      },
      paramsListDel(index) {
          this.messageParamsList.splice(index, 1);
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
