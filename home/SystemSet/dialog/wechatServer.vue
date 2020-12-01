<template>
  <div>
    <s-form class="s-form-wrapper" key="wechatForm" ref="wechatForm" :model="wechatForm" :rules="wechatFormRules" label-width="120px">
      <s-form-item label="CorpID" prop="weChatCorpID.configValue">
        <s-col span="24">
          <s-input v-model="wechatForm.weChatCorpID.configValue" style="width:620px"></s-input>
        </s-col>
      </s-form-item>
      <s-form-item label="Secret" prop="weChatSecret.configValue">
        <s-col span="24">
          <s-input v-model="wechatForm.weChatSecret.configValue" style="width:620px"></s-input>
        </s-col>
      </s-form-item>
      <s-form-item label="应用ID" prop="weChatapplyID.configValue">
        <s-col span="24">
          <s-input v-model="wechatForm.weChatapplyID.configValue" style="width:620px"></s-input>
        </s-col>
      </s-form-item>
      <s-form-item label="测试微信号">
        <s-col span="24">
          <s-input v-model="wechatNum" style="width:620px"></s-input>
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
  // import {Validaters} from 'sunflower-common-utils';

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
        wechatNum: '',
        isCheckWechat: false,
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
        }
      }
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
      this.getWechatInfo()
    },
    methods: {
      getWechatInfo() {
        $axios.get('/systemmanager/sysConfig/getWeChat').then((res) => {
          if (res.data) {
            this.wechatForm = res.data
          }
        })
      },
      saveWechat() {
        if (this.wechatForm.weChatCorpID.configValue === '') {
          this.$message({message: '请输入CorpID', type: 'error'});
          return false
        }
        if (this.wechatForm.weChatSecret.configValue === '') {
          this.$message({message: '请输入Secret', type: 'error'});
          return false
        }
        if (this.wechatForm.weChatapplyID.configValue === '') {
          this.$message({message: '请输入应用ID', type: 'error'});
          return false
        }
        let form = []
        for (const item in this.wechatForm) {
          form.push(this.wechatForm[item])
        }
        $axios.post('/systemmanager/sysConfig/updateWeChatdata', form, {
          logTemplate: '设置|微信服务器配置'
        }).then((res) => {
          if (res.data === 'success') {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          }
        })
      },
      checkWechat() {
        if (this.wechatNum === '') {
          this.$message({message: '请输入测试微信号', type: 'error'});
          return false
        }
        let testObj = {
          configName: 'testWechat',
          configValue: this.wechatNum
        }
        let form = []
        for (const item in this.wechatForm) {
          form.push(this.wechatForm[item])
        }
        form.push(testObj)
        this.isCheckWechat = true
        $axios.post('/systemmanager/sysConfig/updateWeChatdataAndTest', form).then((res) => {
          if (res.data.result === true) {
            this.$message({message: res.data.msg, type: 'success'});
          } else {
            this.$message({message: res.data.msg, type: 'error'});
          }
          this.isCheckWechat = false
        }).catch(() => {
          this.isCheckWechat = false
          this.$message({
            message: '测试超时！',
            type: 'error'
          });
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
