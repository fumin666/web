<template>
  <s-dialog v-model="dialogFlag" :title="isEdit ? '编辑' : '添加'" id="configAddDialog" width="460px" ref="dialog-protocolDialog" append-to-body>
    <s-scrollbar wrap-class="dialogScrollHeight">
      <s-form :model="configForm" :rules="configRules" label-width="120px" ref="configForm">
        <s-form-item label="协议名称">
          <s-select value-key="uuid" v-model="curProtocol" @change="protoSelectChange" filterable :disabled="isEdit">
            <s-option v-for="(option,index) in options.protocolList" :label="option.protocolName" :value="option" :key="index"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item v-if="protocolName=='web'" label="协议别名" prop="protocolAlias">
          <s-input v-model="configForm.protocolAlias"></s-input>
        </s-form-item>
        <s-form-item label="端口" prop="port">
          <s-input v-model="configForm.port" :maxlength="120"></s-input>
        </s-form-item>
        <div v-if="protocolName=='web'">
          <s-form-item label="相对路径" prop="subpath">
            <s-input v-model="configForm.subpath"></s-input>
          </s-form-item>
          <s-form-item label="浏览器">
            <s-select v-model="configForm.browser">
              <s-option v-for="(option,index) in browserOptions" :label="option.label" :value="option.value" :key="'browser' + index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="提交方式">
            <s-select v-model="configForm.submitType">
              <s-option v-for="(option,index) in submitTypeOptions" :label="option.label" :value="option.value" :key="'submitType' + index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="代填用户控件名">
            <s-input v-model="configForm.userLableName"></s-input>
          </s-form-item>
          <s-form-item label="代填密码控件名">
            <s-input v-model="configForm.pwdLableName"></s-input>
          </s-form-item>
        </div>
        <s-form-item label="字符集">
          <s-select v-model="configForm.charactercoll">
            <s-option v-for="(option,index) in characterOptions" :label="option.label" :value="option.value" :key="index"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="连接超时" prop="timeOut">
          <s-input v-model="configForm.timeOut" :maxlength="120"></s-input>
        </s-form-item>
        <s-form-item label="附加属性" v-if="protocolName=='SSH' || protocolName=='PASSWORD' || protocolName=='IPMI' || isDatabase()">
          <s-input v-model="configForm.objectName" :maxlength="50"></s-input>
        </s-form-item>
        <div v-if="protocolName=='TELNET'">
          <s-form-item label="超级密码" prop="superPassword">
            <s-input v-model="configForm.superPassword" type="password"></s-input>
          </s-form-item>
          <s-form-item label="命令行提示符" prop="prompt">
            <s-input v-model="configForm.prompt"></s-input>
          </s-form-item>
        </div>
        <s-form-item label="共同体（读）" prop="snmpCWordOr" v-if="protocolName=='SNMPV1' || protocolName=='SNMPV2'" key="snmpCWordOr">
          <s-input v-model="configForm.snmpCWordOr"></s-input>
        </s-form-item>
        <s-form-item label="共同体（写）" v-if="protocolName=='SNMPV1' || protocolName=='SNMPV2'">
          <s-input v-model="configForm.snmpCWordRw"></s-input>
        </s-form-item>
        <s-form-item label="备注">
          <s-input type="textarea" v-model="configForm.remark" :maxlength="120" placeholder="最多输入120个字符"></s-input>
        </s-form-item>
      </s-form>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <!--<s-button class="left-float" @click="checkProto">测试</s-button>-->
      <!--<s-button v-if="canCheck" @click="checkCredence">检测凭证</s-button>-->
      <s-button @click="addAgain" v-show="!isEdit">继续添加</s-button>
      <s-button @click="configSave">保存</s-button>
      <s-button type="cancel" @click="configClose">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
import {Validaters} from 'sunflower-common-utils';
import {cloneDeep} from 'lodash';

export default {
  data() {
    return {
      dialogFlag: false,
      selectUserDialogFlag: false,
      configForm: {
        protocolUuid: '', // 协议uuid 1
        timeOut: '',
        port: '',
        subpath: '', // 相对路径
        browser: '',
        userLableName: '',
        pwdLableName: '',
        submitType: '',
        charactercoll: '',
        remark: '',
        objectName: '',
        superPassword: '',
        prompt: '',
        protocolAlias: '',
        snmpCWordOr: '',
        snmpCWordRw: '',
        accountUuid: ''
      },
      configRules: {},
      configRules1: {
        'port': [
          Validaters.NotNull,
          Validaters.Number,
          {validator: this.validPortRepeat, trigger: 'blur'}
        ],
        'timeOut': [Validaters.NotNull],
        'subpath': [Validaters.NotNull],
        'snmpCWordOr': [Validaters.NotNull]
      },
      configRules2: {
        'port': [
          Validaters.NotNull,
          Validaters.Number,
          {validator: this.validPortRepeat, trigger: 'blur'}
        ],
        'timeOut': [Validaters.NotNull],
        'protocolAlias': [Validaters.Max(10)],
        'subpath': [Validaters.NotNull],
        'snmpCWordOr': [Validaters.NotNull]
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
      this.curProtocol = this.options.protocolList.find(item => {
        return item.protocolName === this.configForm.protocolName.split('(')[0];
      });
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
    isDatabase() {
      if (this.protocolName === 'ORACLE' || this.protocolName === 'MySQL' || this.protocolName === 'SQL SERVER' || this.protocolName === 'DB2') {
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
      this.configForm.charactercoll = this.characterOptions[0].value;
      this.configForm.timeOut = '10000';
      this.selDefaultAccount();
    },
    protoSelectChange(protocol) {
      for (let i in this.configForm) {
        if (i !== 'protocolUuid' && i !== 'protocolName' && i !== 'port' && i !== 'charactercoll' && i !== 'timeOut') {
          this.configForm[i] = '';
        }
      }
      if (protocol.protocolName === 'web') {
        this.configForm.browser = 0;
        this.configForm.submitType = 0;
      }
      this.selDefaultAccount();
    },
    selDefaultAccount() {
      let defaultAccountTypeName = this.hasSuperUser ? '普通用户' : '超级用户';
      this.curAccountType = this.options.accountType.find(item => {
        return item.accountTypeName === defaultAccountTypeName;
      }) || this.options.accountType[0];
    },
    addAgain() { // 编辑的时候没有这个按钮
      this.emitData(() => {
        for (let i in this.configForm) {
          this.configForm[i] = '';
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
        let itemObj = cloneDeep(this.configForm);
        // 连接超时的判断条件：取数字，int11位
          if (Number(itemObj.timeOut) || Number(itemObj.timeOut) === 0) {
          } else {
              this.$message({type: 'warning', message: '连接超时只能填写数字!'});
              return;
            }
          if (Number.parseInt(itemObj.timeOut) > 2147483647) {
            this.$message({type: 'warning', message: '连接超时取值在[0，2147483647]'});
            return;
          }
        if (this.alreadyProtoList.length > 0) {
          for (let i in this.alreadyProtoList) {
            if (this.alreadyProtoList[i].port === itemObj.port && this.alreadyProtoList[i].protocolName === itemObj.protocolName) {
              itemObj.uuid = this.alreadyProtoList[i].uuid;
            }
          }
        }
        this.$emit('config-save', itemObj, this.isEdit, this.curProtocol.protocolName);
        callback();
      });
    },
    validPortRepeat(rule, value, callback) {
      let judgePort = arr => {
        if (arr.length > 0) {
          let sameNamePro = arr.find(item => item.protocolName === this.configForm.protocolName);
          if (sameNamePro && sameNamePro.port !== this.configForm.port) {
            callback(new Error('当前资产已存在相同协议，相同协议只能有一个端口!'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      if (this.configForm.protocolName === 'web') {
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
  // beforeDestroy () {
  //   if (this.$refs['dialog-protocolDialog'].$el) {
  //     document.body.removeChild(this.$refs['dialog-protocolDialog'].$el)
  //   }
  // },
  watch: {
    curProtocol: {
      deep: true,
      handler(val) {
        if (val.protocolName === 'INFORMIX' || val.protocolName === 'VNC' || val.protocolName === 'MySQL' || val.protocolName === 'web' || val.protocolName === 'mysqlfront' || val.protocolName === 'sqlyog') {
          this.configRules['port'] = [
            Validaters.NotNull,
            Validaters.Number
          ]
        } else {
          this.configRules['port'] = [
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
          this.configForm.protocolUuid = val.uuid;
          this.configForm.protocolName = val.protocolName;
          this.configForm.port = val.protocolPort + '';
        }
      }
    },
    curAccountType: {
      deep: true,
      handler(val) {
        if (this.initFlag && this.isEdit) return;
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
