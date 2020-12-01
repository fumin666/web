<template>
  <section>
    <s-col span="4">
      <simple-menu :menu="menu"></simple-menu>
    </s-col>
    <s-col span="19" offset="1">
      <div class="tabbox" v-if="menuActiveIndex===0">
        <s-scrollbar wrap-class="scrollMaxH">
          <radius-form :radius-type="1"></radius-form>
          <radius-form :radius-type="2"></radius-form>
        </s-scrollbar>
      </div>
      <div class="tabbox" v-if="menuActiveIndex===1">
        <s-scrollbar wrap-class="scrollMaxH">
          <s-form ref="ADForm" :model="ADForm" :rules="ADRule" label-width="120px">
            <s-row class="title">
              <i class="iconfont icon-tag"></i>
              <span>AD域认证服务器属性</span>
            </s-row>
            <s-form-item label="域名:" prop="adName">
              <s-input v-model="ADForm.adName" :maxlength="30" placeholder="最大长度为30个字符"></s-input>
            </s-form-item>
            <s-form-item label="服务器地址:" prop="ip">
              <s-input v-model="ADForm.ip"></s-input>
            </s-form-item>
            <s-form-item label="端口:" prop="port">
              <s-input v-model.number="ADForm.port"></s-input>
            </s-form-item>
            <s-form-item label="适用范围:" prop="rangeType">
              <s-select v-model.number="ADForm.rangeType">
                <s-option :value="1" label="全局"></s-option>
                <s-option :value="2" label="局部"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="状态:">
              <s-select v-model.number="ADForm.status">
                <s-option :value="1" label="激活"></s-option>
                <s-option :value="0" label="未激活"></s-option>
              </s-select>
            </s-form-item>
            <s-row class="title">
              <i class="iconfont icon-set"></i>
              <span>AD域导入设置</span>
            </s-row>
            <s-form-item label="账号:">
              <s-input v-model="ADForm.adSelectAccount"></s-input>
            </s-form-item>
            <s-form-item label="密码:">
              <s-input v-model="ADForm.adSelectPwd" type="password"></s-input>
            </s-form-item>
            <s-form-item label="查询端口:" prop="selectPort">
              <s-input v-model.number="ADForm.selectPort"></s-input>
            </s-form-item>
            <s-form-item>
              <s-button class="rightBtn" @click="saveADForm">保存</s-button>
            </s-form-item>
          </s-form>
        </s-scrollbar>
      </div>
      <div class="tabbox" v-if="menuActiveIndex===2">
        <s-scrollbar wrap-class="scrollMaxH">
          <ldap-set></ldap-set>
        </s-scrollbar>
      </div>
      <div class="tabbox" v-if="menuActiveIndex===3">
        <s-scrollbar wrap-class="scrollMaxH">
          <dynamic-pwd
            @importDynToken="_importDynToken"
            @registerTokenAddUser="_registerTokenAddUser"
            @showSysToken="_showSysToken"></dynamic-pwd>
        </s-scrollbar>
      </div>
      <div class="tabbox" v-if="menuActiveIndex===4">
        <s-row class="title">
          <i class="iconfont icon-download"></i>
          <span>手机动态口令客户端下载</span>
        </s-row>
        <s-row>
          <s-col span="12" class="QRCodeCtn">
            <img src="../../../assets/images/account/googleAuthForAndroid.png" alt="Android下载">
          </s-col>
          <s-col span="12" class="QRCodeCtn">
            <img src="../../../assets/images/account/googleAuthForIos.png" alt="ios下载">
          </s-col>
        </s-row>
        <s-row>
          <s-col span="12" class="QRCodeCtn">Android下载</s-col>
          <s-col span="12" class="QRCodeCtn">ios下载</s-col>
        </s-row>
        <s-row>
          <p>安卓手机用户：您可以进入应用商店搜索'谷歌动态口令'进行安装，也可以扫描上面的二维码进行安装。</p>
          <p>苹果手机用户：您可以进入苹果应用市场(App Store)搜索‘Google Authenticator’进行安装，也可以扫描上面的二维码进行安装。</p>
        </s-row>
      </div>
      <div class="tabbox" v-if="menuActiveIndex===5">
        <certificate-management
          @openUploadCerDialog="uploadCerDialogFlag=true">
        </certificate-management>
      </div>
    </s-col>
    <!--导入令牌种子-->
    <import-dyn-token v-if="importDialogFlag" v-model="importDialogFlag"></import-dyn-token>
    <!--令牌注册-->
    <s-dialog
      v-model="addTokenUserDialog"
      v-if="addTokenUserDialog"
      width="700px"
      title="添加用户"
      append-to-body>
      <add-token-user
        :tokenUuid="registerTokenUuid"></add-token-user>
    </s-dialog>

    <!--令牌同步-->
    <s-dialog
      v-model="synTokenDialog"
      v-if="synTokenDialog"
      title="同步令牌" append-to-body>
      <sys-token :tokenId="transforData"></sys-token>
    </s-dialog>

    <!--证书管理-证书上传-->
    <s-dialog
      title="证书上传"
      v-if="uploadCerDialogFlag"
      v-model="uploadCerDialogFlag" append-to-body>
      <upload-certificate></upload-certificate>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import Bus from '@/plugins/eventBus'
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils'
  import addTokenUser from '../AddTokenUser.vue'
  import sysToken from '../SysToken.vue'
  import importDynToken from '../ImportDynToken.vue'
  import simpleMenu from '../SimpleMenu.vue'
  import radiusForm from '../RadiusForm.vue'
  import ldapSet from '../LdapSet.vue'
  import dynamicPwd from '../DynamicPwd.vue'
  import certificateManagement from '../CertificateManagement.vue'
  import uploadCertificate from '../UploadCertificate.vue'
  export default{
    components: {
      simpleMenu,
      radiusForm,
      ldapSet,
      dynamicPwd,
      certificateManagement,
      importDynToken,
      uploadCertificate,
      addTokenUser,
      sysToken
    },
    data () {
      let checkPort = (rule, value, callback) => {
        if (value === '' || value === null) {
          callback()
        } else {
          let r = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
          if (r.test(value)) {
            callback()
          } else {
            callback(new Error('请输入合法的端口号:0~65535！'))
          }
        }
      };
      return {
        menuActiveIndex: 0,
        ADForm: {
          adName: '',
          adSelectAccount: '',
          adSelectPwd: '',
          ip: '',
          port: '',
          rangeType: 1,
          selectPort: '',
          status: 0,
          uuid: ''
        },
        ADRule: {
          adName: [{required: true, message: '不能为空', trigger: 'blur'}],
          ip: [
            {required: true, message: '不能为空', trigger: 'blur'},
            Validaters.IP
          ],
          port: [{required: true, type: 'number', message: '请输入数字', trigger: 'blur'}],
          rangeType: [{required: true, type: 'number', message: '不能为空', trigger: 'blur'}],
          selectPort: [{validator: checkPort, trigger: 'blur'}]
        },
        menu: {
          click: this.selectMenu,
          list: [
            {name: 'Radius设置'},
            {name: 'AD域设置'},
            {name: 'LDAP设置'},
            {name: '动态令牌设置'},
            {name: '手机口令牌设置'},
            {name: '证书管理'}
          ]
        },
        adPostType: 0,    // AD域保存(0)/更新(1)
        adPostUrl: '',
        importDialogFlag: false,          // 导入令牌种子弹框
        addTokenUserDialog: false,        // 令牌注册-添加用户弹框
        synTokenDialog: false,            // 令牌同步弹框
        uploadCerDialogFlag: false,       // 证书管理-证书上传弹框
        transforData: '',                 // 同级组件件传递数据
        registerTokenUuid: ''             // 令牌注册-传递令牌uuid
      }
    },
    props: [],
    watch: {
    },
    computed: {
    },
    mounted() {
      // 导入动态口令牌种子成功
      Bus.$on('importDynTokenSuccess', () => {
        this.importDialogFlag = false
      })
      // 令牌注册-添加用户成功
      Bus.$on('addTokenUserSuccess', () => {
        this.addTokenUserDialog = false
      })
      // 令牌同步成功
      Bus.$on('sysTokenSuccess', () => {
        this.synTokenDialog = false
      })
      // 关闭证书上传弹框
      Bus.$on('closeUploadCerDialog', (val) => {
        this.uploadCerDialogFlag = false
      })
      // “AD域设置” 初始化
      this.initAdForm()
    },
    methods: {
      selectMenu(index) {
        this.menuActiveIndex = index;
      },
      // 导入令牌种子弹框
      _importDynToken() {
        this.importDialogFlag = true
      },
      // 令牌注册-添加用户弹框
      _registerTokenAddUser(val) {
        this.addTokenUserDialog = true
        this.registerTokenUuid = val
      },
      // 令牌注册-令牌同步
      _showSysToken(val) {
        this.synTokenDialog = true
        this.transforData = val
      },
      // “AD域设置” 初始化
      initAdForm() {
        // AD域初始化
        $axios.post('/adInfo/viewLoginAdInfo').then((res) => {
          let resRadius = res.data.adInfo
          if (resRadius !== null) {
            for (let i in this.ADForm) {
              this.ADForm[i] = resRadius[i]
            }
            if (resRadius.uuid) {
              this.adPostType = 1
              this.ADForm.uuid = resRadius.uuid
            }
          }
        })
      },
      // 保存‘AD域设置’
      saveADForm() {
        this.$refs['ADForm'].validate((valid) => {
          if (valid) {
            if (this.adPostType === 0) {
              this.adPostUrl = '/adInfo/saveLoginAdInfo'
            } else {
              this.adPostUrl = '/adInfo/updateAdInfo'
            }
            $axios.post(this.adPostUrl, this.ADForm, {
              data: [],
              logTemplate: '设置|登录认证配置>AD域设置'
            }).then((res) => {
              let resData = res.data
              if (resData === 'success') {
                this.$message({
                  type: 'success',
                  message: '保存成功！'
                })
                this.initAdForm()
              } else {
                this.$message({
                  type: 'error',
                  message: '保存失败，请重试！'
                })
              }
            })
          }
        });
      }
    }
  }
</script>

