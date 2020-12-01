<template>
  <div>
        <s-table-page :data='proxyList' :singleLineActionShow='true' :header-search='getSearchProxyDef()'
                  :hasActionCol='false'>
          <s-table-column prop="name" label="代理名称"  show-overflow-tooltip>
          </s-table-column>
          <s-table-column prop="ip" label="代理IP" show-overflow-tooltip>
          </s-table-column>
          <s-table-column prop="ssid" label="代理SSID" show-overflow-tooltip>
          </s-table-column>
          <s-table-column prop="online" label="代理状态" show-overflow-tooltip>
          </s-table-column>
          <s-table-column label="服务状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <s-switch v-model="scope.row.serviceStatus" size="small" @change="changeServiceStatus(scope.row)"></s-switch>
            </template>
          </s-table-column>
          <s-table-column prop="remarks" label="备注" show-overflow-tooltip>
          </s-table-column>
          <s-table-column label="操作"  width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <i class="iconfont icon-eye" @click="eyeHandle(scope.row)"></i>
              <i class="iconfont icon-edit" @click="editHandle(scope.row)"></i>
              <i class="iconfont icon-config-rule" @click="setHandle(scope.row)"></i>
              <i class="iconfont icon-delete" @click="deleteProxy(scope.row)"></i>
            </template>
          </s-table-column>
        </s-table-page>
        <!--添加备份服务器-->
    <!-- 查看代理管理详情 -->
    <s-dialog v-model="eyeManageDialog" v-if="eyeManageDialog" title="查看代理信息" width="700px">
      <eye-manage :rowData="eyeData"></eye-manage>
    </s-dialog>
    <!--编辑代理详情-->
    <s-dialog v-model="editManageDialog" v-if="editManageDialog" width="700px" title="编辑代理信息">
      <edit-manage :manageEditData="manageEditData" ref="editProxy"></edit-manage>
      <template slot="footer">
        <s-button @click="saveHandle">保存</s-button>
        <s-button type="cancel" @click="editManageDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!-- 高级配置 -->
    <s-dialog v-model="advanceProxySetDialog" v-if="advanceProxySetDialog" width="650px" title="高级配置">
      <advance-proxy-set @colseSet="closeSetDialog" :rowData="advanceSetRowData"
                         :interfaceInfo="interfaceInfo"></advance-proxy-set>
    </s-dialog>
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
  import EyeManage from '../components/EyeManage.vue'
  import AdvanceProxySet from '../components/AdvanceProxySet.vue'
  import authCheck from '@/common/mixins/auth.js'
  import EditManage from '../components/EditManage.vue'
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
      EyeManage,
      AdvanceProxySet,
      EditManage
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
      this.getProxyList()
    },
    methods: {
      changeHandler(val, item) {
        val.configValue = '';
      },
      selection(key) {
        this.pane = key
        console.log(key)
      },
      // 接收邮件dialog方法
      emailAndMessageParent() {
        this.getServiePlatform();
      },
      // 获取代理列表
      getProxyList() {
        $axios.get('/proxyManager/getProxyList').then(({data}) => {
          if (data.length) {
            for (let i = 0; i < data.length; i++) {
              data[i].online = data[i].online === 0 ? '不在线' : '在线'
              data[i].serviceStatus = Boolean(data[i].serviceStatus)
              data[i].serviceStatus = !data[i].serviceStatus
            }
            this.proxyList = data
          } else {
            this.proxyList = []
          }
        })
      },
      saveHandle() {
        const form = this.$refs['editProxy'].$refs['manageEdit']
        const addform = this.$refs['editProxy'].manageEdit
        form.validate(valid => {
          if (!valid) return;
          $axios.post('/proxyManager/uptProxy', {
            id: this.manageSaveData.id,
            uuid: this.manageSaveData.uuid,
            name: addform.name,
            ip: addform.ip,
            remarks: addform.remarks
          }, {
            data: [addform],
            logTemplate: '编辑|代理管理(#name#)'
          }).then(({data}) => {
            if (data.state === true) {
              this.editManageDialog = false;
              this.$message.success('修改成功');
              this.getProxyList();
            } else {
              this.$message.error('修改失败')
            }
          })
        })
      },
      // 删除代理
      deleteProxy(row) {
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.post(`/proxyManager//delNode/${row.id}`, {
            data: [row],
            logTemplate: '删除|代理管理(#name#)'
          }).then(({data}) => {
            if (data.state === true) {
              this.$message.success('删除成功')
              this.getProxyList();
            } else {
              this.$message.error(data.errormsg)
            }
          })
        }).catch(() => {
        });
      },
      getSearchProxyDef() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入查询内容',
          searchProps: ['name', 'ip', 'port', 'ssid', 'serviceStatus', 'online', 'remarks']
        }
      },
      // 服务状态改变
      changeServiceStatus(row) {
        this.serviceStatus = row.serviceStatus ? 'start' : 'stop';
        $axios.get(`/proxyManager/chgStatus/${row.id}/${this.serviceStatus}`).then(({data}) => {
          if (data.state) {
            if (row.serviceStatus === true) {
              this.$message.success('开启服务成功!')
            } else {
              this.$message.success('关闭服务成功')
            }
          } else {
            row.serviceStatus = !row.serviceStatus
            this.$message.error('失败，请重试')
          }
        })
      },
      // 查看详情
      eyeHandle(row) {
        console.log(row)
        $axios.get(`/proxyManager/getProxyInfo/${row.id}`).then(({data}) => {
          this.eyeData = data
          this.eyeManageDialog = true
        })
      },
      // 编辑
      editHandle(row) {
        this.manageSaveData = row;
        $axios.get(`/proxyManager/getProxyDetail/${row.id}`).then(({data}) => {
          this.manageEditData = data;
          this.editManageDialog = true;
        })
      },
      closeSetDialog() {
        this.advanceProxySetDialog = false
      },
      setHandle(row) {
        this.advanceSetRowData = row
        $axios.get(`/proxyManager/getDataList/${row.id}`).then(({data}) => {
          this.advanceProxySetDialog = true
          for (let i = 0; i < data.length; i++) {
            data[i].monit = Boolean(data[i].monit)
          }
          this.interfaceInfo = data
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
