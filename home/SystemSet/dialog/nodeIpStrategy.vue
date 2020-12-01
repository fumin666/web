<template>
  <div>
    <s-table-page :data='nodeList' :search-def="{show: false}" :hasActionCol='false' class="node-ip">
      <s-table-column prop="nodeName" label="节点名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="input-box">
            <div class="vir-input ellipsis" :title="scope.row.nodeName">{{scope.row.nodeName}}</div>
            <i class="iconfont icon-plus input-icon" @click="changeName(scope.row)"></i>
          </div>
        </template>
      </s-table-column>
      <s-table-column prop="ipAddress" label="节点IP" show-overflow-tooltip>
      </s-table-column>
      <s-table-column label="节点状态" prop="nodeStatus" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="innerVersion" label="内部版本号" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="activeStatus" label="激活状态" show-overflow-tooltip>
      </s-table-column>
      <s-table-column type="expand" show-overflow-tooltip>
        <template slot-scope="scope">
          <s-form label-width="70%">
            <s-form-item style="margin: 0" v-for="(item, index) in scope.row.ipStrategy" :key="index" label="">
              <span v-text="item.segmentIp"></span>
              <i class="iconfont icon-delete" title="删除" @click="deleteRuleHandler(item.uuid,scope.row.nodeId)"></i>
            </s-form-item>
          </s-form>
        </template>
      </s-table-column>
      <s-table-column prop="ipRule" label="IP策略" show-overflow-tooltip>
      </s-table-column>
      <s-table-column width="80" label="操作">
        <template slot-scope="scope">
          <i class="iconfont icon-add" title="添加" @click="addRuleHandler(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table-page>
    <s-dialog
      v-model="addStrategyDialog"
      v-if="addStrategyDialog"
      width="400px"
      title="添加策略" append-to-body>
      <add-ip-rule ref="addStrategy"></add-ip-rule>
      <template slot="footer">
        <s-button @click="saveStrategyForm">保存</s-button>
        <s-button type="cancel" @click="addStrategyDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--修改节点名称-->
    <change-name
      v-model="changeNameFlag"
      v-if="changeNameFlag"
      :nodeData="nodeData"
      @updataName="updataName"
    >
    </change-name>
  </div>
</template>
<script type="text/babel">
  // import SelectAsset from '../components/SelectAsset.vue'

  // import BackupServer from '../BackupServer'
  // import addRule from '../components/addRule.vue'
  import $axios from 'sunflower-ajax'
  // import {cloneDeep} from 'lodash'
  // import {decryptPwd, encryptPwd} from 'sunflower-common-utils'
  import AddIpRule from '../components/AddIpRule.vue'
  // import EyeManage from '../components/EyeManage.vue'
  // import AdvanceProxySet from '../components/AdvanceProxySet.vue'
  import authCheck from '@/common/mixins/auth.js'
  import changeName from './changeName';
  // import EditManage from '../components/EditManage.vue'
  // import ApproveEditManage from '../components/ApproveEditManage.vue'
  // import EmailAndMessagePlatformDialog from './EmailAndMessagePlatformDialog.vue' // 自定义邮件短信平台类型
  // import {Validaters} from 'sunflower-common-utils';

  export default {
    mixins: [authCheck],
    components: {
      changeName,
      // BackupServer,

      // addRule,
      // SelectAsset,
      AddIpRule
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
        ftpList: [],
        proxyList: [],
        approveProxyList: [],
        approveList: [],
        nodeList: [],
        addStrategyDialog: false,
        currentIPRuleData: {},
        changeNameFlag: false,
        nodeData: null
      }
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
      // this.getMailInfo()
      // this.getMessageInfo()
      // this.getWechatInfo()
      // this.getFtpList()
      // this.getProxyList()
      // this.getApproveList()
      // this.getApproveProxyList()
      // // 托管中心配置
      // this.getAppDeposit()
      this.getCustomIPRuleList()
      // this.getWorlFlowModule()
      // // 获取邮件短信服务器平台类型配置
      // this.getServiePlatform();
      // this.getServieConfig();
    },
    methods: {
      changeName(item) {
        this.nodeData = item
        this.changeNameFlag = true
      },
      updataName(desc, item) {
        item.nodeName = desc
      },
      getCustomIPRuleList() {
        $axios.get('/configcenter/nodeserver/getNodeServers').then(({data}) => {
          if (data.length) {
            this.nodeList = data;
          } else {
            this.nodeList = []
          }
        });
      },
      deleteRuleHandler(uuid, nodeId) {
        this.$confirm('确定删除该策略？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.post(`/configcenter/ipstrategy/deleteIpStrateg/${nodeId}/${uuid}`).then(({data}) => {
            if (data.result) {
              this.$message.success(data.errormsg);
            } else {
              this.$message.error(data.errormsg);
            }
            this.getCustomIPRuleList();
          });
        }).catch(() => {
        });
      },
      // 保存添加策略表单
      saveStrategyForm() {
        let _self = this;
        _self.$refs['addStrategy'].$refs['Form'].validate((valid) => {
          if (valid) {
            $axios.post(`/configcenter/ipstrategy/addIpStrateg/${this.currentIPRuleData.nodeId}`, _self.$refs['addStrategy'].Form, {
              logTemplate: '设置|节点IP策略'
            }).then(({data}) => {
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
      addRuleHandler(row) {
        this.currentIPRuleData = row
        this.addStrategyDialog = true
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

    .bussiness-title {
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
  .node-ip
    .input-box
      position relative

      .vir-input
        width: 100%
        height: 32px
        line-height: 32px;
        box-sizing: border-box;
        border: 1px solid #cccccc;
        padding: 0 10px

      .input-icon
        margin-right 0px!important
        font-size 12px!important
        position absolute
        right 4px
        top: 4px
</style>
