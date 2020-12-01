<template>
  <s-dialog
    append-to-body
    v-model="dialogFlag"
    v-if="dialogFlag"
    :title="title"
    width="600px"
    ref="dialog-addAccountDialog"
    class="addAccountDialog"
  >
    <s-scrollbar wrap-class="addAccountScrollbar">
      <s-row class="title">资产信息</s-row>
      <s-row>
        <s-col span="10">
          <div class="grid-content bg-purple">资产名称</div>
        </s-col>
        <s-col span="14">
          <div class="grid-content bg-purple-light">{{assetInfo.itcompName}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col span="10">
          <div class="grid-content bg-purple">IP地址</div>
        </s-col>
        <s-col span="14">
          <div class="grid-content bg-purple-light">{{assetInfo.controlAdderss}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col span="10">
          <div class="grid-content bg-purple">资产类型</div>
        </s-col>
        <s-col span="14">
          <div class="grid-content bg-purple-light">{{assetInfo.citypeName}}</div>
        </s-col>
      </s-row>
      <s-row class="title">资产账号信息</s-row>
      <s-form :model="accountForm" :rules="accountRules" ref="accountForm" label-width="160px">
        <s-form-item label="资产账号名称" prop="accountName">
          <s-input v-model="accountForm.accountName" :maxlength="30"></s-input>
        </s-form-item>
        <s-form-item label="账号角色" class="accountRoleUuid selectclass">
          <s-select v-model="accountForm.accountRoleUuid" append-to-table=".accountRoleUuid">
            <s-option
              v-for="(item,index) in roleOptions"
              :label="item.accountTypeName"
              :value="item.uuid"
              :key="index"
            ></s-option>
          </s-select>
          <!--<select-dialog
            v-model="accountForm.accountRoleUuid"
            :options="roleOptions"
            :config="config"
            valueProp="uuid"
            title="选择角色"
          >
            <s-option v-for="(item,index) in roleOptions" :label="item.accountTypeName" :value="item.uuid" :key="index"></s-option>
          </select-dialog>-->
        </s-form-item>
        <s-form-item label="数据库类型" v-show="showDbType" class="databaseTypeUuid selectclass">
          <s-select v-model="accountForm.databaseTypeUuid" append-to-table=".databaseTypeUuid">
            <s-option
              v-for="(item) in dbTypeOptions"
              :label="item.protocolTypeName"
              :value="item.uuid"
              :key="item.uuid"
            ></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="密码方式" prop="passwordType"  v-if="!isRoleBaseLinker" class="passwordType selectclass">
          <s-select v-model="accountForm.passwordType" @change="selectChangePassType" append-to-table=".passwordType">
            <s-option v-for="item in passTypeOptions" :label="item.name" :value="item.valueInt" :key="item.valueInt"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="密码" prop="accountPasswd" v-if="!isRoleBaseLinker && isShowPassWord">
          <s-input v-model="accountForm.accountPasswd" type="password" :maxlength="30"></s-input>
        </s-form-item>
        <s-form-item label="确认密码" prop="checkPass" v-if="!isRoleBaseLinker && isShowPassWord">
          <s-input v-model="accountForm.checkPass" type="password" :maxlength="30"></s-input>
        </s-form-item>
        <!-- 单注册SIEM无此字段 -->
        <s-form-item label="账号用途" prop="typeList" v-if="OmaAuth || AutoAuth || ImpAuth || DbaAuth">
          <s-checkbox-group v-model="accountForm.typeList">
            <s-checkbox :label="1" v-if="OmaAuth" :disabled="!isShowPassWord">改密</s-checkbox>
            <s-checkbox :label="2" v-if="OmaAuth" :disabled="!isShowPassWord">稽核</s-checkbox>
            <s-checkbox :label="3" v-if="OmaAuth">普通运维</s-checkbox>
            <s-checkbox :label="4" v-if="AutoAuth" :disabled="!isShowPassWord">自动化运维</s-checkbox>
            <s-checkbox :label="5" v-if="ImpAuth" :disabled="!isShowPassWord">监控</s-checkbox>
            <s-checkbox :label="6" v-if="DbaAuth" :disabled="!isShowPassWord">数据库审计</s-checkbox>
          </s-checkbox-group>
        </s-form-item>
        <s-form-item label="账号类型" class="attribute selectclass">
          <s-select v-model="accountForm.attribute" :disabled="isAttributeDis" append-to-table=".attribute">
            <s-option label="托管账号" :value="1"></s-option>
            <s-option label="收集账号" :value="2"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="是否是AD域帐户类型" v-if="OmaAuth" class="issAd selectclass">
          <s-select v-model="accountForm.isAd" append-to-table=".issAd">
            <s-option label="否" :value="0"></s-option>
            <s-option label="是" :value="1"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="AD域服务器" prop="adUuid" v-if="OmaAuth && accountForm.isAd === 1" class="adUuid selectclass">
          <s-select v-model="accountForm.adUuid" append-to-table=".adUuid">
            <s-option
              v-for="(item) in adServerLists"
              :label="item.adName"
              :value="item.uuid"
              :key="item.uuid"
            ></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="状态" class="status selectclass">
          <s-select v-model="accountForm.status" append-to-table=".status">
            <s-option label="激活" :value="1"></s-option>
            <s-option label="未激活" :value="0"></s-option>
            <s-option label="锁定" :value="2"></s-option>
            <s-option label="注销" :value="3"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="备注" prop="remark">
          <s-input v-model="accountForm.remark" type="textarea"></s-input>
        </s-form-item>
      </s-form>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="next" v-show="!isShowPassWord && !isEdit" >下一步</s-button>
      <s-button :disabled="isLoading" @click="dialogContinue" v-show="!isEdit && isShowPassWord">继续添加</s-button>
      <s-button :disabled="isLoading" @click="dialogOk" v-show="isShowPassWord || isEdit">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Validaters} from 'sunflower-common-utils'
  // import SelectDialog from '@/components/selectDialog'
  import authCheck from '@/common/mixins/auth.js'

  export default {
    mixins: [authCheck],
    data() {
      let validatePass = (rule, value, callback) => {
        if (this.accountForm.checkPass !== '') {
          this.$refs.accountForm.validateField('checkPass')
        }
        callback()
      }
      let validatePass2 = (rule, value, callback) => {
        if (value !== this.accountForm.accountPasswd) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      let validIsRepeat = (rule, value, callback) => {
        let param = {
          name: value,
          typeUuid: this.accountForm.accountRoleUuid,
          itcompUuid: this.assetUuid,
          uuid: this.uuid
        }
        $axios.post('/assetsAccountInfo/nameValidate', param).then(({data}) => {
          if (data === 'false') {
            callback(new Error('该资产账号已存在，请重新输入！'))
          } else {
            callback()
          }
        })
      }
      return {
        /* config: [
           {name: '账号角色', value: 'accountTypeName'}
         ], */
        isLoading: false,
        dialogFlag: false,
        isRoleBaseLinker: false, // 账号是否是数据库Linker
        assetInfo: {},
        isAttributeDis: true,
        accountForm: {
          accountName: '',
          accountPasswd: '',
          passwordType: 0,
          checkPass: '',
          typeList: [],
          accountRoleUuid: '',
          status: 1,
          attribute: 1,
          isAd: 0,
          adUuid: '',
          remark: '',
          databaseTypeUuid: ''
        },
        showDbType: false,
        isShowPassWord: true,
        accountRules: {},
        rules1: {
          accountName: [
            Validaters.NotNull,
            {max: 30, message: '最大长度为30', trigger: 'blur'},
            {
              pattern: /[\u4e00-\u9fa5|\w|\-|\.]+/,
              message: '由中文、字母、数字、符号[_-.]组成',
              trigger: 'blur'
            },
            {validator: validIsRepeat, trigger: 'blur'}
          ],
          passwordType: [
            Validaters.SelectNumNotNull
          ],
          accountPasswd: [
            Validaters.NotNull,
            {max: 40, message: '最大长度为40', trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            Validaters.NotNull,
            {max: 40, message: '最大长度为40', trigger: 'blur'},
            {validator: validatePass2, trigger: 'blur'}
          ],
          typeList: [{type: 'array', required: true, message: '请至少选择一个账号用途', trigger: 'change'}],
          remark: [{max: 120, message: '最大长度为120个字符', trigger: 'blur'}],
          adUuid: [Validaters.SelectValNotNull]
        },
        rules2: {
          accountName: [
            Validaters.NotNull,
            {max: 30, message: '最大长度为30', trigger: 'blur'},
            {
              pattern: /[\u4e00-\u9fa5|\w|\-|\.]+/,
              message: '由中文、字母、数字、符号[_-.]组成',
              trigger: 'blur'
            },
            {validator: validIsRepeat, trigger: 'blur'}
          ],
          passwordType: [
            Validaters.SelectNumNotNull
          ],
          accountPasswd: [
            Validaters.NotNull,
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            Validaters.NotNull,
            {validator: validatePass2, trigger: 'blur'}
          ],
          typeList: [{type: 'array', required: true, message: '请至少选择一个账号用途', trigger: 'change'}],
          remark: [{max: 120, message: '最大长度为120个字符', trigger: 'blur'}],
          adUuid: [Validaters.SelectValNotNull]
        },
        roleOptions: [],
        dbTypeOptions: [],
        adServerLists: [], // AD域服务器列表
        passTypeOptions: [] // 密码方式下拉字段
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      assetUuid: {
        type: String,
        require: true
      },
      curAccount: {
        type: Object
      },
      uuid: String
    },
    computed: {
      isEdit() {
        return Object.keys(this.curAccount).length > 0
      },
      title() {
        return this.isEdit ? '编辑' : '添加'
      }
    },
    created() {
      this.getADServerLists();
      $axios.get(`/assetsAccountInfo/getAssetsInfo/${this.assetUuid}`).then(({data}) => {
          this.assetInfo = Object.assign({}, data.assetsInfo)
          this.roleOptions = data.assetsAccountTypeInit;
          this.dbTypeOptions = data.databaseTypeInit;
          // console.log(this.dbTypeOptions);
          this.passTypeOptions = data.passwordType;
          if (!this.isEdit) {
            this.accountForm.accountRoleUuid = this.roleOptions[0].uuid
          } else {
            this.selectChangeRole(this.accountForm.accountRoleUuid);
          }
          this.$nextTick(() => {
            this.$refs.accountForm.clearValidate();
          })
        });
      if (this.isEdit) {
        this.selectChangePassType(this.curAccount.passwordType); // 初始化密码方式
        for (let i in this.accountForm) {
          if (i === 'attribute') {
            this.accountForm[i] = parseInt(this.curAccount[i])
          } else {
            this.accountForm[i] = this.curAccount[i]
          }
        }
        this.accountForm.checkPass = this.accountForm.accountPasswd;
        // 编辑的时候，如果"账号类型"字段为"收集账号"，则该字段可编辑,可以变为托管账号，但是托管账号不能变为收集账号
        this.isAttributeDis = parseInt(this.accountForm.attribute) !== 2
        this.accountRules = {...this.rules2}
      } else {
        this.accountRules = {...this.rules1}
      }
    },
    methods: {
      selectChangePassType (val) {
        if (val === 1) {
          if (this.isEdit && this.curAccount.passwordType !== 1) {
            this.$confirm('更改密码方式会导致该账号不能用于稽核、改密、监控、自动化运维、数据库审计，是否确认修改？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              $axios.get(`/assetsAccountInfo/deleteRelationTask/${this.curAccount.uuid}`).then(({data}) => {
              })
            }).catch(() => {
            });
          }
          this.isShowPassWord = false;
          this.accountForm.typeList = [3]
        } else {
          if (this.isEdit) {
            this.accountForm.typeList = this.curAccount.typeList
          } else {
            this.accountForm.typeList = []
          }
          this.isShowPassWord = true
        }
      },
      selectChangeRole(val) {
        let roleOptionsObj = {};
        roleOptionsObj = this.roleOptions.find((item) => {
          return item.uuid === val;
        });
        if (roleOptionsObj && roleOptionsObj.accountTypeName === '数据库账户') {
          this.showDbType = true;
          if (!this.isEdit) {
            // this.accountForm.databaseTypeUuid = '';
          }
        } else {
          this.showDbType = false
        }
        /* 当选择账号角色选择为：数据库linker时，密码方式、密码、确认密码字段隐藏 */
        if (roleOptionsObj && roleOptionsObj.accountTypeName === '数据库Linker') {
          this.isRoleBaseLinker = true;
        } else {
          this.isRoleBaseLinker = false;
        }
        this.$refs.accountForm && this.$refs.accountForm.validate('accountName');
      },
      getAccountTypeName(uuid) {
        if (!uuid) return null
        let str = ''
        this.roleOptions.map(item => {
          if (item.uuid === uuid) {
            str = item.accountTypeName
          }
        })
        return str
      },
      axiosSave(callback = () => {
      }) {
        this.$refs.accountForm.validate(valid => {
          if (!valid) return
          this.isLoading = true;
          let param = Object.assign({}, this.accountForm)
          param.assetsUuid = this.assetInfo.uuid
          param.uuid = this.curAccount.uuid
          param.accountRoleName = this.getAccountTypeName(param.accountRoleUuid)
          if (this.isEdit) {
            if (param.accountPasswd === this.curAccount.accountPasswd) {
              delete param.accountPasswd
            } else {
              param.oldPassword = this.curAccount.accountPasswd
            }
          }
          delete param.checkPass
          this.$emit(
            'accountSave',
            param,
            this.isEdit,
            this.assetInfo,
            this.accountForm,
            this.isShowPassWord
          )
          callback()
        })
      },
      dialogContinue() {
        this.axiosSave(() => {
          this.accountForm = {
            accountName: '',
            passwordType: 0,
            accountPasswd: '',
            checkPass: '',
            typeList: [],
            accountRoleUuid: '',
            attribute: 1,
            isAd: 0,
            adUuid: '',
            status: 1,
            remark: ''
          }
          // this.accountForm.accountRoleUuid = this.roleOptions[0].uuid
          // 继续添加时，"账号类型"重置回不可编辑
          this.isAttributeDis = true
          this.$nextTick(() => {
            this.accountForm.accountRoleUuid = this.roleOptions[0].uuid
          })
        })
      },
      dialogOk() {
        this.axiosSave(() => {
          this.dialogFlag = false
        })
      },
      next() {
        this.axiosSave(() => {
          this.dialogFlag = false
        })
      },
      // 获取AD域服务器列表
      getADServerLists() {
        $axios.get('/tdeviceAdInfo/getTDeviceAdInfoList').then(({data}) => {
          if (data && data instanceof Array) {
            this.adServerLists = data
          }
        })
      }
    },
    // beforeDestroy () {
    //   if (this.$refs['dialog-addAccountDialog'].$el) {
    //     document.body.removeChild(this.$refs['dialog-addAccountDialog'].$el)
    //   }
    // },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val
        }
      },
      dialogFlag(val) {
        this.$emit('input', val)
      },
      'accountForm.accountPasswd'(val) {
        if (this.isEdit) {
          if (val.length <= 30) {
            this.accountRules = {...this.rules1}
          }
        }
      },
      'accountForm.accountRoleUuid'(val) {
        this.selectChangeRole(val);
      }
    },
    components: {
      // SelectDialog
    }
  }
</script>

<style lang="stylus">
  .addAccountDialog
    .s-form-item .s-form-item-content
      .s-checkbox + .s-checkbox
        margin-right 0
    .selectclass
      .s-select-dropdown.s-popper
        position: absolute !important;
        top: 35px !important;
        left: 160px !important;
</style>
