* Created by alex on 2018/12/4.
*/
<template>
  <s-dialog v-model="dialogFlag" title="登录认证设置"  width="800px">
    <div class="diy-second-mod">
      <s-card-diy
        show-scrollbar
        :show-more="false">
        <s-tab v-model="activeTab">
          <s-tab-pane label="登录认证设置" name="1">
            <div class="tabbox">
              <s-row class="title" style="margin:20px 0">
                <i class="iconfont icon-approve"></i>
                <span>认证方式设置</span>
              </s-row>
              <s-row>
                <s-col span="6">认证方式设置:</s-col>
                <s-col span="18">
                  <s-select v-model="approveType">
                    <s-option v-for="list in loginTypeList"
                              :value="list.uuid"
                              :key="list.uuid"
                              :label="list.loginType">
                    </s-option>
                  </s-select>
                  <span class="tip" v-text="showTipTxt"></span>
                </s-col>
              </s-row>
              <s-row>
                <s-button class="rightBtn" @click="saveLoginType" style="float:right">保存</s-button>
              </s-row>
            </div>
            <div class="tabbox" >
              <s-row class="title" style="margin:20px 0">
                <i class="iconfont icon-approve"></i>
                <span >双因素认证属性</span>
              </s-row>
              <s-row>
                <s-col span="6">认证方式1:</s-col>
                <s-col span="18">
                  <s-select v-model="approveType1">
                    <s-option v-for="i in doubleLoginType1"
                              :value="i.uuid"
                              :key="i.uuid"
                              :label="i.loginType">
                    </s-option>
                  </s-select>
                  <span class="tip" v-text="showTipTxt1"></span>
                </s-col>
              </s-row>
              <s-row>
                <s-col span="6">认证方式2:</s-col>
                <s-col span="18">
                  <s-select v-model="approveType2">
                    <s-option v-for="list in doubleLoginType2"
                              :value="list.uuid"
                              :key="list.uuid"
                              :label="list.loginType">
                    </s-option>
                  </s-select>
                  <span class="tip" v-text="showTipTxt2"></span>
                </s-col>
              </s-row>
              <s-row>
                <s-button class="rightBtn" @click="saveDoubleLoginType" style="float:right">保存</s-button>
              </s-row>
            </div>
          </s-tab-pane>
          <s-tab-pane label="登录认证配置" name="2">
            <s-row>
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
            </s-row>
          </s-tab-pane>
        </s-tab>
      </s-card-diy>
      <!--导入令牌种子-->
      <s-dialog
        title="导入令牌种子"
        v-if="importDialogFlag"
        v-model="importDialogFlag">
        <import-dyn-token></import-dyn-token>
      </s-dialog>

      <!--令牌注册-->
      <s-dialog
        v-model="addTokenUserDialog"
        v-if="addTokenUserDialog"
        width="800px"
        title="添加用户">
        <add-token-user
          :tokenUuid="registerTokenUuid"></add-token-user>
      </s-dialog>

      <!--令牌同步-->
      <s-dialog
        v-model="synTokenDialog"
        v-if="synTokenDialog"
        title="同步令牌">
        <sys-token :tokenId="transforData"></sys-token>
      </s-dialog>

      <!--证书管理-证书上传-->
      <s-dialog
        title="证书上传"
        v-if="uploadCerDialogFlag"
        v-model="uploadCerDialogFlag">
        <upload-certificate></upload-certificate>
      </s-dialog>
    </div>
  </s-dialog>

</template>

<script>
  import $axios from 'sunflower-ajax'
  import Bus from '@/plugins/eventBus'
  import {Validaters} from 'sunflower-common-utils'
  import simpleMenu from '@/pages/Account_SecuritySet/SimpleMenu.vue'
  import radiusForm from '@/pages/Account_SecuritySet/RadiusForm.vue'
  import ldapSet from '@/pages/Account_SecuritySet/LdapSet.vue'
  import dynamicPwd from '@/pages/Account_SecuritySet/DynamicPwd.vue'
  import importDynToken from '@/pages/Account_SecuritySet/ImportDynToken.vue'
  import addTokenUser from '@/pages/Account_SecuritySet/AddTokenUser.vue'
  import sysToken from '@/pages/Account_SecuritySet/SysToken.vue'
  // import loginPropertySet from '@/pages/Account_SecuritySet/LoginPropertySet.vue'
  import certificateManagement from '@/pages/Account_SecuritySet/CertificateManagement.vue'
  import uploadCertificate from '@/pages/Account_SecuritySet/UploadCertificate.vue'
  // import LoginSecuritySet from '@/pages/Account_SecuritySet/LoginSecuritySet.vue'
  // import PwdPolicySet from '@/pages/Account_SecuritySet/PwdPolicySet.vue'
  // import CreateAccount from '@/pages/Account_SecuritySet/CreateAccountConfig'
  import authCheck from '@/common/mixins/auth.js'

  export default {
    mixins: [authCheck],
    components: {
      simpleMenu,
      radiusForm,
      ldapSet,
      dynamicPwd,
      importDynToken,
      addTokenUser,
      sysToken,
      // loginPropertySet,
      certificateManagement,
      uploadCertificate
      // LoginSecuritySet,
      // PwdPolicySet,
      // CreateAccount
    },
    data() {
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
        activeTab: '1',
        dialogFlag: false,
        loginTypeList: [],
        doubleLoginType: [],
        doubleLoginType1: [],
        doubleLoginType2: [],
        tab2Url: '',
        approveType: '',
        approveType1: '',
        approveType2: '',
        phoneTokenUuid: '',
        certificateUuid: '',
        mixApproveUuid: '',
        menuActiveIndex: 0,
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
        pwdPolicyMenuActive: 1,
        pwdPolicyMenu: {
          click: this.selectPwdPolicyMenu,
          list: [
            {name: '低安全等级'},
            {name: '中安全等级'},
            {name: '高安全等级'}
          ]
        },
        importDialogFlag: false,          // 导入令牌种子弹框
        addTokenUserDialog: false,        // 令牌注册-添加用户弹框
        synTokenDialog: false,            // 令牌同步弹框
        uploadCerDialogFlag: false,       // 证书管理-证书上传弹框
        transforData: '',                 // 同级组件件传递数据
        registerTokenUuid: ''             // 令牌注册-传递令牌uuid
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      selectMenu(index) {
        this.menuActiveIndex = index;
      },
      selectPwdPolicyMenu(index) {
        this.pwdPolicyMenuActive = index;
      },
      // 保存‘认证方式设置’
      saveLoginType() {
        if (this.postRequestFlag === true) {
          $axios.post('/sysLoginType/saveLoginType', {'uuid': this.approveType}, {
            data: [],
            logTemplate: '设置|登录认证设置>认证方式设置'
          }).then((res) => {
            let resData = res.data
            if (resData === 'success') {
              this.$message({
                type: 'success',
                message: '保存成功！'
              })
            } else {
              this.$message({
                type: 'error',
                message: '保存失败，请重试！'
              })
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请按要求设置认证方式！'
          })
        }
      },
      // 保存‘双因素认证’设置
      saveDoubleLoginType() {
        if (this.postRequestFlag === true) {
          $axios.get('/sysLoginType/saveDoubleLoginType/' + this.approveType1 + '/' + this.approveType2, {
            data: [],
            logTemplate: '设置|登录认证设置>双因素认证属性'
          }).then((res) => {
            let resData = res.data
            if (resData === 'success') {
              this.$message({
                type: 'success',
                message: '保存成功！'
              })
            } else {
              this.$message({
                type: 'error',
                message: '保存失败，请重试！'
              })
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请按要求设置认证方式！'
          })
        }
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
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      },
      approveType1(val) {
        this.doubleLoginType2 = [];
        this.doubleLoginType.forEach((item) => {
          if (item.uuid !== val) this.doubleLoginType2.push(item);
        });
      },
      approveType2(val) {
        this.doubleLoginType1 = [];
        this.doubleLoginType.forEach((item) => {
          if (item.uuid !== val) this.doubleLoginType1.push(item);
        })
      }
    },
    computed: {
      showTipTxt() {
        if (this.approveType === this.phoneTokenUuid) {
          return '请确保所有用户已绑定手机口令牌，否则将无法登录'
        } else if (this.approveType === this.certificateUuid) {
          return '请确保系统已配置CA证书，否则将无法登录'
        } else return ''
      },
      showTipTxt1() {
        if (this.approveType1 === this.phoneTokenUuid) {
          return '请确保所有用户已绑定手机口令牌，否则将无法登录'
        } else if (this.approveType1 === this.certificateUuid) {
          if (this.approveType === this.mixApproveUuid) {
            // this.postRequestFlag = false
            return '混合认证中，不允许使用数字证书'
          } else return '请确保系统已配置CA证书，否则将无法登录'
        } else return ''
      },
      showTipTxt2() {
        if (this.approveType2 === this.phoneTokenUuid) {
          return '请确保所有用户已绑定手机口令牌，否则将无法登录'
        } else if (this.approveType2 === this.certificateUuid) {
          if (this.approveType === this.mixApproveUuid) {
            // this.postRequestFlag = false
            return '混合认证中，不允许使用数字证书'
          } else return '请确保系统已配置CA证书，否则将无法登录'
        } else return ''
      },
      postRequestFlag() {
        return !(this.approveType === this.mixApproveUuid && (this.approveType1 === this.certificateUuid || this.approveType2 === this.certificateUuid));
      }
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
      // 获取双因素认证方式
      $axios.post('/sysLoginType/getDoubleLoginType').then((res) => {
        let resDoubleLoginType = res.data
        this.loginTypeList = resDoubleLoginType.SysLoginTypeList
        if (this.loginTypeList && this.loginTypeList instanceof Array) {
          this.loginTypeList.forEach(item => {
            if (item.status === 1) {
              this.approveType = item.uuid
            }
            if (item.loginType !== '双因素认证' && item.loginType !== '混合认证') {
              this.doubleLoginType.push(item)
              this.doubleLoginType1.push(item)
              this.doubleLoginType2.push(item)
            }
            // 获取'手机口令牌认证'uuid，显示tip时使用
            if (item.loginType === '手机口令牌认证') {
              this.phoneTokenUuid = item.uuid
            }
            if (item.loginType === '证书认证') {
              this.certificateUuid = item.uuid
            }
            if (item.loginType === '混合认证') {
              this.mixApproveUuid = item.uuid
            }
          })
        }
        if (resDoubleLoginType.SysDoubleType !== null) {
          this.approveType1 = resDoubleLoginType.SysDoubleType.firstUuid
          this.approveType2 = resDoubleLoginType.SysDoubleType.secondUuid
        }
      })
      // “AD域设置” 初始化
      this.initAdForm()
    }
  }
</script>
<style scoped>
.diy-second-mod{
  height: 400px;
}
</style>

