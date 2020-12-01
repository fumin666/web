<template>
  <div>
    <s-form class="s-form-wrapper" ref="appDepositForm" :model="appDepositForm" :rules="appDepositRule"
            label-width="120px">
      <s-form-item label="IP地址" prop="device_ip">
        <s-input v-model="appDepositForm.device_ip" style="width:620px"></s-input>
      </s-form-item>
      <s-form-item label="端口" prop="device_port">
        <s-input v-model="appDepositForm.device_port" style="width:620px"></s-input>
      </s-form-item>
      <s-form-item label="账号" prop="device_account">
        <s-input v-model="appDepositForm.device_account" style="width:620px"></s-input>
      </s-form-item>
      <s-form-item label="密码" prop="device_passwd">
        <s-input type="password" v-model="appDepositForm.device_passwd" style="width:620px"></s-input>
      </s-form-item>
      <s-form-item label="域名" prop="device_domain">
        <s-input v-model="appDepositForm.device_domain" style="width:620px"></s-input>
      </s-form-item>
      <s-form-item>
        <s-button @click="saveAppDeposit">保存</s-button>
        <s-button v-if="netWorkLoading" disabled style="width:100px">
          <div style="float: left">正在测试</div>
          <s-spin color="#30a6fd" type="clip" size="8px"></s-spin>
        </s-button>
        <s-button v-if="!netWorkLoading" @click="netWorkTest">
          <span>保存并测试</span>
        </s-button>
      </s-form-item>
    </s-form>
  </div>

</template>
<script type="text/babel">
  // import SelectAsset from '../components/SelectAsset.vue'
  // import BackupServer from '../BackupServer'
  // import addRule from '../components/addRule.vue'
  import $axios from 'sunflower-ajax'
  import {cloneDeep} from 'lodash'
  // import AddIpRule from '../components/AddIpRule.vue'
  // import EyeManage from '../components/EyeManage.vue'
  // import AdvanceProxySet from '../components/AdvanceProxySet.vue'
  import authCheck from '@/common/mixins/auth.js'
  // import EditManage from '../components/EditManage.vue'
  // import ApproveEditManage from '../components/ApproveEditManage.vue'
  // import EmailAndMessagePlatformDialog from './EmailAndMessagePlatformDialog.vue' // 自定义邮件短信平台类型
  import { decryptPwd, encryptPwd, Validaters } from 'sunflower-common-utils';

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
        appDepositForm: {
          device_ip: '',
          device_port: '',
          device_account: '',
          device_passwd: '',
          device_domain: ''
        },
        netWorkLoading: false,
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
        }
      }
    },
    created() {
      $axios.get('/configcenter/sysconfig/getAppBox').then(({data}) => {
          this.appDepositForm = data
          this.appDepositForm.device_port = String(data.device_port)
          this.appDepositForm.device_passwd = decryptPwd(this.appDepositForm.device_passwd)
      })
    },
    methods: {
      saveAppDeposit() {
        let _self = this
        let afterForm = cloneDeep(_self.appDepositForm)
        afterForm.device_passwd = encryptPwd(afterForm.device_passwd)
        _self.$refs.appDepositForm.validate(function (valid) {
          if (valid) {
            $axios.post('/configcenter/sysconfig/setAppBox', afterForm, {
              logTemplate: '设置|托管中心配置'
            }).then(function ({data}) {
              if (data.result) {
                _self.$message.success(data.errormsg);
              } else {
                _self.$message.error(data.errormsg);
              }
            })
          }
        })
      },
      netWorkTest() {
        let afterForm = cloneDeep(this.appDepositForm)
        afterForm.device_passwd = encryptPwd(afterForm.device_passwd)
        this.$refs.appDepositForm.validate(valid => {
          if (!valid) return;
          this.netWorkLoading = true
          $axios.post('/configcenter/sysconfig/checkAndSetAppBox', afterForm).then(({data}) => {
            this.netWorkLoading = false
            if (data.result) {
              this.$message.success(data.errormsg);
            } else {
              this.$message.error(data.errormsg);
            }
          })
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
