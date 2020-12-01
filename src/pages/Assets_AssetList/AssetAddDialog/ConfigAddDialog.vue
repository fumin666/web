<template>
  <div>
    <s-dialog v-model="dialogFlag" :title="isEdit ? '编辑' : '添加'" id="configAddDialog" width="460px">
      <s-scrollbar wrap-class="dialogScrollHeight">
        <s-form :model="configForm" :rules="configRules" label-width="120px" ref="configForm">
          <s-form-item label="协议名称">
            <s-select value-key="uuid" v-model="curProtocol" @change="protoSelectChange" filterable :disabled="isEdit">
              <s-option v-for="(option,index) in options.protocolList" :label="option.protocolName" :value="option" :key="index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item v-if="protocolName=='web'" label="协议别名" prop="assetsPortInfo.protocolAlias">
            <s-input v-model="configForm.assetsPortInfo.protocolAlias"></s-input>
          </s-form-item>
          <s-form-item label="端口" prop="assetsPortInfo.port">
            <s-input v-model="configForm.assetsPortInfo.port" :maxlength="120"></s-input>
          </s-form-item>
          <div v-if="protocolName=='web'">
            <s-form-item label="相对路径" prop="assetsPortInfo.subpath">
              <s-input v-model="configForm.assetsPortInfo.subpath"></s-input>
            </s-form-item>
            <s-form-item label="浏览器">
              <s-select v-model="configForm.assetsPortInfo.browser">
                <s-option v-for="(option,index) in browserOptions" :label="option.label" :value="option.value" :key="'browser' + index"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="提交方式">
              <s-select v-model="configForm.assetsPortInfo.submitType">
                <s-option v-for="(option,index) in submitTypeOptions" :label="option.label" :value="option.value" :key="'submitType' + index"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="代填用户控件名">
              <s-input v-model="configForm.assetsPortInfo.userLableName"></s-input>
            </s-form-item>
            <s-form-item label="代填密码控件名">
              <s-input v-model="configForm.assetsPortInfo.pwdLableName"></s-input>
            </s-form-item>
          </div>
          <s-form-item label="字符集">
            <s-select v-model="configForm.assetsPortInfo.charactercoll">
              <s-option v-for="(option,index) in characterOptions" :label="option.label" :value="option.value" :key="index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="连接超时" prop="assetsPortInfo.timeOut">
            <s-input v-model="configForm.assetsPortInfo.timeOut" :maxlength="120"></s-input>
          </s-form-item>
          <!-- <s-form-item label="账号角色" v-if="protocolName!='SNMPV1' && protocolName!='SNMPV2' && !notNeedAccount">
            <s-select value-key="uuid" v-model="curAccountType" @change="accountTypeChange">
              <s-option v-for="(option,index) in options.accountType" :label="option.accountTypeName" :value="option"
                        :key="index"
                        :disabled="accountDisable(option)"></s-option>
            </s-select>
          </s-form-item> -->
          <s-form-item label="用户名" prop="assetsAccountInfo.accountName" v-if="showAccountName">
            <s-input v-model="configForm.assetsAccountInfo.accountName" ref="assetsAccountInfoAccountName" :readonly="true" icon="delete" :on-icon-click="clearAccountName"></s-input>
            <s-button icon="plus" @click="selectUserDialogFlag=true" v-show="parentIsEdit"></s-button>
          </s-form-item>
          <!--<s-form-item label="密码" prop="assetsAccountInfo.accountPasswd" v-if="!relateAccountFlag && protocolName!='SNMPV1' && protocolName!='SNMPV2' && !notNeedAccount">-->
          <!--<s-input v-model="configForm.assetsAccountInfo.accountPasswd" type="password"></s-input>-->
          <!--</s-form-item>-->
          <!--<s-form-item label="确认密码" prop="assetsAccountInfo.checkPass" v-if="!relateAccountFlag && protocolName!='SNMPV1' && protocolName!='SNMPV2' && !notNeedAccount">-->
          <!--<s-input v-model="configForm.assetsAccountInfo.checkPass" type="password"></s-input>-->
          <!--</s-form-item>-->
          <s-form-item label="数据库/实例名" v-if="isDatabase() || showDbExam()">
            <s-input v-model="configForm.assetsPortInfo.dbServerName"></s-input>
            <s-tooltip class="tip" content="可配置多个，以英文逗号','分隔." placement="top">
              <i class="iconfont icon-help"></i>
            </s-tooltip>
          </s-form-item>
          <s-form-item label="附加属性" v-if="protocolName=='SSH' || protocolName=='PASSWORD' || protocolName=='IPMI' || isDatabase()">
            <s-input v-model="configForm.assetsPortInfo.objectName" :maxlength="50"></s-input>
          </s-form-item>
          <div v-if="protocolName=='TELNET'">
            <s-form-item label="超级密码" prop="assetsPortInfo.superPassword">
              <s-input v-model="configForm.assetsPortInfo.superPassword" type="password"></s-input>
            </s-form-item>
            <s-form-item label="命令行提示符" prop="assetsPortInfo.prompt">
              <s-input v-model="configForm.assetsPortInfo.prompt"></s-input>
            </s-form-item>
          </div>
          <s-form-item label="共同体（读）" prop="assetsAccountInfo.snmpCWordOr" v-if="protocolName=='SNMPV1' || protocolName=='SNMPV2'" key="assetsAccountInfo.snmpCWordOr">
            <s-input v-model="configForm.assetsAccountInfo.snmpCWordOr"></s-input>
          </s-form-item>
          <s-form-item label="共同体（写）" v-if="protocolName=='SNMPV1' || protocolName=='SNMPV2'">
            <s-input v-model="configForm.assetsAccountInfo.snmpCWordRw"></s-input>
          </s-form-item>
          <s-form-item label="备注">
            <s-input type="textarea" v-model="configForm.assetsPortInfo.remark" :maxlength="120" placeholder="最多输入120个字符"></s-input>
          </s-form-item>
        </s-form>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <!--<s-button class="left-float" @click="checkProto">测试</s-button>-->
       <s-button v-if="canCheck" @click="checkCredence">检测凭证</s-button>
        <s-button @click="addAgain" v-show="!isEdit">继续添加</s-button>
        <s-button @click="configSave">保存</s-button>
        <s-button type="cancel" @click="configClose">取消</s-button>
      </template>
    </s-dialog>
    <!-- <select-user-dialog v-model="selectUserDialogFlag" v-if="selectUserDialogFlag" @select-user="selectUser"
                        :selected-user-uuids="relateAccountFlag ? relateAccountUuid : ''"
                        :asset-uuid="assetUuid"
                        :user-type="configForm.assetsAccountInfo.accountTypeName"> -->
    <select-user-dialog v-model="selectUserDialogFlag" v-if="selectUserDialogFlag" @select-user="selectUser" :selected-user-uuids="relateAccountFlag ? relateAccountUuid : ''" :asset-uuid="assetUuid">
    </select-user-dialog>
  </div>
</template>

<script>
import {Validaters} from 'sunflower-common-utils';
import $axios from 'sunflower-ajax'
import selectUserDialog from './SelectUserDialog'
import {cloneDeep} from 'lodash';
function validHasMark(rule, value, callback) {
  if (!value) {
    callback();
    return;
  }
  ;
  let reg = /^[a-zA-Z0-9_\-\.][a-zA-Z0-9_\-\.@\\#]{0,29}$/;
  if (!reg.test(value)) {
    callback(new Error(`由字母、数字、符号[_-.@\\#]构成,不能以#或@开头`));
  }
  callback();
}
function validHasComma(rule, value, callback) {
  if (!value) {
    callback();
    return;
  }
  ;
  let reg = /^[a-zA-Z0-9_\-\.][a-zA-Z0-9_\-\.@\\#,]{0,29}$/;
  if (!reg.test(value)) {
    callback(new Error(`由字母、数字、符号[_-.@\\#]构成,不能以#或@开头`));
  }
  callback();
}
//  function validNotNull(rule, value, callback) {
//    if (value === '') {
//      callback(new Error('不能为空!'));
//    } else {
//    callback();
//    }
//  };

export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (this.configForm.assetsAccountInfo.checkPass !== '') {
        this.$refs.configForm.validateField('assetsAccountInfo.checkPass');
      }
      callback();
    };
    let validatePass2 = (rule, value, callback) => {
      if (value !== this.configForm.assetsAccountInfo.accountPasswd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      dialogFlag: false,
      selectUserDialogFlag: false,
      configForm: {
        assetsAccountInfo: {
          accountRoleUuid: '',
          accountTypeName: '',
          accountName: '',
          accountPasswd: '',
          checkPass: '',
          snmpCWordOr: '',
          snmpCWordRw: ''
        },
        assetsPortInfo: {
          protocolUuid: '',
          protocolName: '',
          port: '',
          charactercoll: '',
          timeOut: '',
          objectName: '',
          superPassword: '',
          prompt: '',
          remark: '',
          dbServerName: '',
          subpath: '', // 相对路径
          browser: '',
          submitType: '',
          userLableName: '',
          pwdLableName: ''
        }
      },
      configRules: {},
      configRules1: {
        'assetsPortInfo.port': [
          Validaters.NotNull,
          Validaters.Number,
          {validator: this.validPortRepeat, trigger: 'blur'}
        ],
        'assetsPortInfo.timeOut': [Validaters.NotNull],
        'assetsAccountInfo.accountName': [
          //            {validator: validNotNull, trigger: 'blur'},
          {validator: this.validIsRepeat, trigger: 'blur'},
          {validator: validHasMark, trigger: 'blur'}
        ],
        'assetsAccountInfo.accountPasswd': [
          //            {validator: validNotNull, trigger: 'blur'},
          {validator: validatePass, trigger: 'blur'}
        ],
        'assetsAccountInfo.checkPass': [
          //            {validator: validNotNull, trigger: 'blur'},
          {validator: validatePass2, trigger: 'blur'}
        ],
        'assetsPortInfo.superPassword': [Validaters.NotNull],
        'assetsPortInfo.prompt': [Validaters.NotNull],
        'assetsAccountInfo.snmpCWordOr': [Validaters.NotNull],
        'assetsPortInfo.subpath': [Validaters.NotNull]
      },
      configRules2: {
        'assetsPortInfo.port': [
          Validaters.NotNull,
          Validaters.Number,
          {validator: this.validPortRepeat, trigger: 'blur'}
        ],
        'assetsPortInfo.timeOut': [Validaters.NotNull],
        'assetsPortInfo.protocolAlias': [Validaters.Max(10)],
        'assetsAccountInfo.accountName': [
          //            {validator: validNotNull, trigger: 'blur'},
          {validator: this.validIsRepeat, trigger: 'blur'},
          {validator: validHasMark, trigger: 'blur'}
        ],
        'assetsAccountInfo.accountPasswd': [
          //            {validator: validNotNull, trigger: 'blur'},
          {validator: validatePass, trigger: 'blur'}
        ],
        'assetsAccountInfo.checkPass': [
          //            {validator: validNotNull, trigger: 'blur'},
          {validator: validatePass2, trigger: 'blur'}
        ],
        'assetsPortInfo.superPassword': [Validaters.NotNull],
        'assetsPortInfo.prompt': [Validaters.NotNull],
        'assetsAccountInfo.snmpCWordOr': [Validaters.NotNull],
        'assetsPortInfo.subpath': [Validaters.NotNull]
      },
      characterOptions: [
        {label: '自动识别', value: 'AUTO'},
        {label: 'GBK2312', value: 'GBK2312'},
        {label: 'GBK', value: 'GBK'},
        {label: 'BIG5', value: 'BIG5'},
        {label: 'UTF-8', value: 'UTF-8'},
        {label: 'UTF-16', value: 'UTF-16'}
      ],
      browserOptions: [
        {label: 'Internet Explorer', value: 0},
        {label: 'FireFox', value: 1}
      ],
      submitTypeOptions: [
        {label: '按钮', value: 0},
        {label: '链接', value: 1},
        {label: '不代填', value: 2},
        {label: '不提交', value: 3}
      ],
      relateAccountFlag: false,
      curProtocol: {},
      curAccountType: {},
      relateAccountUuid: '', // 为了再次关联时选中已关联的账号
      initFlag: true // 初始化数据的标志
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: {
        protocolList: [],
        accountType: []
      }
    },
    uuid: String,
    data: Object,
    assetUuid: String,
    alreadyProtoList: Array,
    tab2FilterData: Array,
    curAsset: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    showAccountName() {
      return this.configForm.assetsAccountInfo !== null && (this.protocolName !== 'SNMPV1' && this.protocolName !== 'SNMPV2' && !this.notNeedAccount) && !this.isEdit;
    },
    canCheck() {
      if (['MySQL', 'Sybase', 'ORACLE', 'SNMPV1', 'SNMPV2', 'SNMPV3', 'SSH', 'PASSWORD'].includes(this.curProtocol.protocolName)) {
        return true
      }
      return false
    },
    parentIsEdit() {
      return this.assetUuid.length > 0;
    },
    isEdit() {
      return Object.keys(this.data).length > 0;
    },
    protocolName() {
      return this.curProtocol.protocolName.split('(')[0];
    },
    hasSuperUser() {
      // return this.alreadyProtoList.filter(item => {
      //   return item.assetsPortInfo.protocolName === this.protocolName;
      // }).some(item => {
      //   return item.assetsAccountInfo.accountTypeName === '超级用户';
      // });
    },
    notNeedAccount() { // 不需要账号
      if (this.protocolName === 'VNC') {
        return true;
      }
      return false;
    }
  },
  created() {
    this.configRules = {...this.configRules1};
    if (this.isEdit) {
      this.configForm = JSON.parse(JSON.stringify(this.data));
      if (this.configForm.assetsAccountInfo !== null) {
        this.configForm.assetsAccountInfo.checkPass = this.configForm.assetsAccountInfo.accountPasswd;
      }
      this.curProtocol = this.options.protocolList.find(item => {
        return item.protocolName === this.configForm.assetsPortInfo.protocolName.split('(')[0];
      });
      // this.curAccountType = this.options.accountType.find(item => {
      //   return item.accountTypeName === this.configForm.assetsAccountInfo.accountTypeName;
      // });
      this.relateAccountFlag = this.configForm.relateAccountFlag;
    } else {
      this.initSelectOption();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initFlag = false;
    })
  },
  methods: {
    checkCredence() {
      // 检测凭证，必须有用户名才有意义
      if (this.showAccountName && this.configForm.assetsAccountInfo.accountName === '') {
        this.$message.warning('请选择用户后再进行检测!');
        this.$refs.assetsAccountInfoAccountName.focus();
        return;
      }
      this.$refs.configForm.validate(valid => {
        if (valid) {
          if (!this.curAsset['controlAdderss']) {
            this.$message.warning('该资产没有IP')
            return
          }
          if (this.curAsset.defCompId) {
            if (this.curProtocol.uuid === '00000000000000000000000000000137' || this.curProtocol.uuid === '00000000000000000000000000000125') {
              this.configForm.assetsAccountInfo.accountRoleUuid = 'bf45d38aecdf4b9eafb7288adc74da8d'
            }
            $axios.post('/resourcemanager/assetmanager/itasset/checkCredence', Object.assign(
              {
                ipAddress: this.curAsset['controlAdderss'],
                monitorTemplateUuid: this.curAsset.defCompId,
                assetsAccountInfoList: [this.configForm.assetsAccountInfo]
              }, this.configForm
            )).then(({data}) => {
              if (data.flag) {
                this.$message.success(data.message)
              } else {
                this.$message.error(data.message)
              }
            })
          } else {
            this.$message.warning('该资产没有模板')
          }
        }
      })
    },
    isDatabase() {
      if (this.protocolName === 'ORACLE' || this.protocolName === 'MySQL' || this.protocolName === 'SQL SERVER') {
        return true;
      }
      return false;
    },
    showDbExam() { // 显示数据库实例
      let arr = ['mssqlserver', 'plsql', 'toadoracle', 'DB2', 'INFORMIX', 'sybase', 'cache', 'dameng', 'kingbase', 'postgresql', 'oscar', 'greenplum'];
      return arr.filter(item => item === this.protocolName).length > 0;
    },
    initSelectOption() {
      if (this.options.protocolList.length !== 0) {
        this.curProtocol = this.options.protocolList.find(item => {
          return item.protocolName === 'SSH';
        }) || this.options.protocolList[0];
      }
      this.configForm.assetsPortInfo.charactercoll = this.characterOptions[0].value;
      this.configForm.assetsPortInfo.timeOut = '10000';
      this.selDefaultAccount();
    },
    protoSelectChange(protocol) {
      for (let i in this.configForm.assetsAccountInfo) {
        if (i !== 'accountRoleUuid' && i !== 'accountTypeName') {
          this.configForm.assetsAccountInfo[i] = '';
        }
      }
      for (let i in this.configForm.assetsPortInfo) {
        if (i !== 'protocolUuid' && i !== 'protocolName' && i !== 'port' && i !== 'charactercoll' && i !== 'timeOut') {
          this.configForm.assetsPortInfo[i] = '';
        }
      }
      if (protocol.protocolName === 'web') {
        this.configForm.assetsPortInfo.browser = 0;
        this.configForm.assetsPortInfo.submitType = 0;
      }
      this.selDefaultAccount();
    },
    selDefaultAccount() {
      let defaultAccountTypeName = this.hasSuperUser ? '普通用户' : '超级用户';
      this.curAccountType = this.options.accountType.find(item => {
        return item.accountTypeName === defaultAccountTypeName;
      }) || this.options.accountType[0];
    },
    accountTypeChange() {
      this.configForm.assetsAccountInfo.accountName = '';
      this.configForm.assetsAccountInfo.accountPasswd = '';
    },
    checkProto() { // 测试按钮
      let parentData = this.$parent.tab1Form;
      if (!parentData.citypeUuid) {
        this.$message({showClose: true, message: '测试需选择资产类型', type: 'error'});
        return;
      }
      if (!parentData.modelNumber) {
        this.$message({showClose: true, message: '测试需选择资产型号', type: 'error'});
        return;
      }
      if (!parentData.controlAdderss) {
        this.$message({showClose: true, message: '测试需填写IP地址', type: 'error'});
        return;
      }
      this.$refs.configForm.validate(valid => {
        if (!valid) {
          return;
        }
        if (this.protocolName === 'PASSWORD' && (!this.configForm.assetsAccountInfo.accountName || !this.configForm.assetsAccountInfo.accountPasswd)) {
          this.$message({showClose: true, message: '测试需填写用户名和密码', type: 'error'});
          return;
        }
        let assetsAccountInfoList = [this.deledNullField(this.configForm.assetsAccountInfo)];
        let param = {
          ipAddress: parentData.controlAdderss,
          monitorTemplateUuid: parentData.defCompId,
          assetsAccountInfoList: assetsAccountInfoList,
          assetsPortInfo: this.deledNullField(this.configForm.assetsPortInfo)
        };
        $axios.post('/resourcemanager/assetmanager/itasset/checkCredence', param).then(({data}) => {
          this.$message({
            showClose: true,
            message: data.message,
            type: data.flag ? 'success' : 'error'
          });
        });
      });
    },
    addAgain() { // 编辑的时候没有这个按钮
      this.emitData(() => {
        for (let i in this.configForm) {
          for (let j in this.configForm[i]) {
            this.configForm[i][j] = '';
          }
        }
        this.curProtocol = {};
        this.curAccountType = {};
        this.initSelectOption();
      });
    },
    configSave() {
      this.emitData(() => {
        this.dialogFlag = false;
      });
    },
    configClose() {
      this.dialogFlag = false;
    },
    emitData(callback) {
      this.$refs.configForm.validate(valid => {
        if (!valid) {
          this.$message({type: 'warning', message: '请检查填写的内容!'});
          return;
        }
        let accountNameArr = (this.configForm.assetsAccountInfo.accountName || '').split(',');
        let accountPasswdArr = (this.configForm.assetsAccountInfo.accountPasswd || '').split(',');
        if (accountNameArr.length > 1 && this.configForm.assetsAccountInfo.accountTypeName === '超级用户') {
          this.$message({showClose: true, message: '一个协议只能有一个超级用户!', type: 'warning'});
          return;
        }
        let accountUuidArr = this.judgeNotChange() ? [this.data.assetsAccountInfo.uuid] : this.relateAccountUuid.split(',');
        //          let dataArr = accountNameArr.map((item, index) => {
        //            let itemObj = cloneDeep(this.configForm);
        //            delete itemObj.assetsAccountInfo.checkPass;
        //  //            this.notNeedAccount && delete itemObj.assetsAccountInfo.accountTypeName;
        //            itemObj.assetsAccountInfo.accountName = item;
        //            itemObj.assetsAccountInfo.accountPasswd =
        //              accountPasswdArr[index] !== undefined ? accountPasswdArr[index] : accountPasswdArr[accountPasswdArr.length - 1];
        //            itemObj.assetsAccountInfo.uuid = accountUuidArr[index];
        //  //            itemObj.relateAccountFlag = this.relateAccountFlag;
        //            // 没有填写用户名时账号类型也不显示,SNMPV1、SNMPV2除外
        //            if (!item && item !== 0 && itemObj.assetsPortInfo.protocolName !== 'SNMPV1' && itemObj.assetsPortInfo.protocolName !== 'SNMPV2') {
        //              delete itemObj.assetsAccountInfo.accountTypeName;
        //            }
        //            return itemObj;
        //          });
        let itemObj = cloneDeep(this.configForm);
        delete itemObj.assetsAccountInfo.checkPass;
        itemObj.assetsAccountInfo.accountName = accountNameArr[0];
        itemObj.assetsAccountInfo.accountPasswd =
          accountPasswdArr[0] !== undefined ? accountPasswdArr[0] : accountPasswdArr[accountPasswdArr.length - 1];
        itemObj.assetsAccountInfo.uuid = accountUuidArr[0];
        if (!accountNameArr[0] && accountNameArr[0] !== 0 && itemObj.assetsPortInfo.protocolName !== 'SNMPV1' && itemObj.assetsPortInfo.protocolName !== 'SNMPV2') {
          delete itemObj.assetsAccountInfo.accountTypeName;
        }
        if (this.alreadyProtoList.length > 0) {
          for (let i in this.alreadyProtoList) {
            if (this.alreadyProtoList[i].assetsPortInfo.port === itemObj.assetsPortInfo.port &&
              this.alreadyProtoList[i].assetsPortInfo.protocolName === itemObj.assetsPortInfo.protocolName
            ) {
              itemObj.assetsPortInfo.uuid = this.alreadyProtoList[i].assetsPortInfo.uuid;
            }
          }
        }
        this.$emit('config-save', itemObj, this.isEdit);
        callback();
      });
    },
    selectUser(user) {
      this.relateAccountFlag = true;
      this.relateAccountUuid = user.uuid;
      this.configForm.assetsAccountInfo.accountName = user.accountName;
      this.configForm.assetsAccountInfo.accountPasswd = user.accountPasswd;
      this.configForm.assetsAccountInfo.accountRoleUuid = user.accountRoleUuid;
      this.configForm.assetsAccountInfo.accountTypeName = user.accountTypeStr;
      // this.$refs.configForm.validateField('assetsAccountInfo.accountName');
    },
    clearAccountName() {
      this.relateAccountUuid = '';
      this.configForm.assetsAccountInfo.accountName = '';
      this.configForm.assetsAccountInfo.accountPasswd = '';
      this.relateAccountFlag = false;
    },
    accountDisable(option) {
      if (this.isEdit) {
        if (this.hasSuperUser) {
          let superUserIndex = this.alreadyProtoList.find(item => {
            return item.assetsPortInfo.protocolName === this.protocolName && item.assetsAccountInfo.accountTypeName === '超级用户';
          }).index;
          if (this.configForm.index !== superUserIndex) {
            return option.accountTypeName === '超级用户';
          }
          return false;
        }
        return false;
      } else {
        return this.hasSuperUser && option.accountTypeName === '超级用户';
      }
    },
    deledNullField(obj) {
      let result = {};
      for (let i in obj) {
        if (obj[i] !== '') {
          result[i] = obj[i];
        }
      }
      return result;
    },
    judgeNotChange() { // 编辑时没改变资产账号则不验证
      if (this.isEdit &&
        this.data.assetsAccountInfo.accountName === this.configForm.assetsAccountInfo.accountName &&
        this.data.relateAccountFlag === this.relateAccountFlag &&
        this.data.assetsAccountInfo.accountTypeName === this.configForm.assetsAccountInfo.accountTypeName
      ) return true;
      return false;
    },
    validIsRepeat(rule, value, callback) { // 去除重复的资产账号
      if (!value) {
        callback();
        return;
      }
      let judgeRelation = item => {
        if (item.assetsPortInfo.port === this.configForm.assetsPortInfo.port &&
          item.assetsPortInfo.protocolName === this.configForm.assetsPortInfo.protocolName &&
          item.assetsAccountInfo.accountTypeName === this.configForm.assetsAccountInfo.accountTypeName &&
          item.assetsAccountInfo.accountName === this.configForm.assetsAccountInfo.accountName
        ) return true;
        return false;
      };
      let judgeAlreadyHave = (errorMsg) => {
        this.alreadyProtoList.forEach(item => {
          if (judgeRelation(item)) {
            callback(new Error(errorMsg));
            return;
          }
        });
        callback();
      };
      if (this.parentIsEdit) {
        if (!this.judgeNotChange()) {
          if (this.relateAccountFlag) {
            judgeAlreadyHave('此协议下该资产账号已存在，请重新选择！');
          } else {
            let param = {
              name: value,
              typeUuid: this.configForm.assetsAccountInfo.accountRoleUuid,
              itcompUuid: this.assetUuid,
              uuid: this.uuid
            };
            $axios.post('/assetsAccountInfo/nameValidate', param).then(({data}) => {
              if (data === 'false') {
                callback(new Error('该资产账号已存在，请重新输入！'))
              } else {
                judgeAlreadyHave('该资产账号已存在，请重新输入！');
              }
            });
          }
        } else {
          callback();
        }
      } else { // 新增资产时只有手动填写
        if (!this.judgeNotChange()) {
          judgeAlreadyHave('此协议下该资产账号已存在，请重新输入！');
        } else {
          callback();
        }
      }
    },
    validPortRepeat(rule, value, callback) {
      let judgePort = arr => {
        if (arr.length > 0) {
          let sameNamePro = arr.find(item => item.assetsPortInfo.protocolName === this.configForm.assetsPortInfo.protocolName);
          if (sameNamePro && sameNamePro.assetsPortInfo.port !== this.configForm.assetsPortInfo.port) {
            callback(new Error('当前资产已存在相同协议，相同协议只能有一个端口!'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      if (this.configForm.assetsPortInfo.protocolName === 'web') {
        callback();
      } else { // 非web协议只允许有一个端口
        if (this.isEdit) {
          let otherProtoList = cloneDeep(this.alreadyProtoList);
          let curProIndex = otherProtoList.findIndex(item => this.data.index === item.index);
          otherProtoList.splice(curProIndex, 1);
          judgePort(otherProtoList);
        } else {
          judgePort(this.alreadyProtoList);
        }
      }
    }
  },
  watch: {
    curProtocol: {
      deep: true,
      handler(val) {
        //          // 用户名、密码、重新输入密码全部协议都变为非必填
        //          let arr = ['accountName', 'accountPasswd', 'checkPass'];
        //          let validator = validNotNull;
        //          if (val.protocolName === 'PASSWORD') {
        //            validator = null;
        //            }
        //          arr.forEach(item => {
        //            this.configRules['assetsAccountInfo.' + item][0].validator = validator;
        //          });
        //  informix协议可以正常添加多个协议，只要端口不同即可
        if (val.protocolName === 'INFORMIX' || val.protocolName === 'VNC' || val.protocolName === 'MySQL' || val.protocolName === 'web' || val.protocolName === 'mysqlfront' || val.protocolName === 'sqlyog') {
          this.configRules['assetsPortInfo.port'] = [
            Validaters.NotNull,
            Validaters.Number
          ]
        } else {
          this.configRules['assetsPortInfo.port'] = [
            Validaters.NotNull,
            Validaters.Number,
            {validator: this.validPortRepeat, trigger: 'blur'}
          ]
        }

        if (val.protocolName === 'web') {
          this.configRules = {...this.configRules2};
        }
        if (this.initFlag && this.isEdit) return;
        if (Object.keys(val).length !== 0) {
          this.configForm.assetsPortInfo.protocolUuid = val.uuid;
          this.configForm.assetsPortInfo.protocolName = val.protocolName;
          this.configForm.assetsPortInfo.port = val.protocolPort + '';
        }
      }
    },
    curAccountType: {
      deep: true,
      handler(val) {
        if (this.initFlag && this.isEdit) return;
        // this.configForm.assetsAccountInfo.accountRoleUuid = val.uuid;
        // this.configForm.assetsAccountInfo.accountTypeName = val.accountTypeName;
      }
    },
    'configForm.assetsAccountInfo.accountName': {
      handler(val) {
        if (!val && val !== 0) {
          this.relateAccountFlag = false;
        }
        if (!this.relateAccountFlag && !this.initFlag) {
          this.configForm.assetsAccountInfo.accountPasswd = '';
          this.configForm.assetsAccountInfo.checkPass = '';
        }
      }
    },
    relateAccountFlag(val) {
      if (this.protocolName !== 'SNMPV1' && this.protocolName !== 'SNMPV2' && !this.notNeedAccount) {
        let lastIndex = this.configRules['assetsAccountInfo.accountName'].length - 1;
        if (val) {
          this.configRules['assetsAccountInfo.accountName'][lastIndex].validator = validHasComma;
        } else {
          this.configRules['assetsAccountInfo.accountName'][lastIndex].validator = validHasMark;
        }
        this.$nextTick(() => {
          this.$refs.configForm.validateField('assetsAccountInfo.accountName');
        });
      }
    },
    value: {
      immediate: true,
      handler(val) {
        this.dialogFlag = val;
      }
    },
    dialogFlag(val) {
      this.$emit('input', val);
    }
  },
  components: {
    selectUserDialog
  }
}
</script>

<style lang="stylus">
#configAddDialog {
  .dialogScrollHeight {
    padding-right: 17px;
    max-height: 400px;
  }

  .s-form-item-content {
    & > .s-input, & > .s-select {
      width: 80%;
    }
  }
}
</style>
