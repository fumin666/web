
<template>
  <div>
      <s-form ref="addForm" :model="form" :rules="rules" label-width="120px">
        <div v-if="protoclFlag">
          <s-form-item label="协议名称" prop="protocluuid">
            <s-select v-model="form.protocluuid" filterable clearable>
              <s-option v-for="item in opsProtocolOptions" :label="item.protocolName" :value="item.uuid" :key="item.uuid"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="端口" prop="port">
            <s-input v-model="form.port"></s-input>
          </s-form-item>
        </div>

        <s-form-item label="复核人" prop="userUuid">
          <s-select v-model="form.userUuid" style="width: 100%" filterable clearable>
            <s-option v-for="item in person" :key="item.id" :label="item.userRealName" :value="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <template v-if="inputList">
          <s-form-item label="用户名" prop="strAccount">
            <s-input v-model="form.strAccount"></s-input>
          </s-form-item>
          <s-form-item label="密码" prop="strPw">
            <s-input type="password" v-model="form.strPw"></s-input>
          </s-form-item>
        </template>
        <s-form-item v-show="iColorDepthList" label="颜色深度" prop="iColorDepth">
          <s-select v-model="form.iColorDepth">
            <s-option v-for="(value, key) in iColorDepthList" :key="key" :label="value" :value="key"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item v-show="iWhichWHList" label="分辨率" prop="iWhichWH">
          <s-select v-model="form.iWhichWH">
            <s-option v-for="(value, key) in iWhichWHList" :key="key" :label="value" :value="key"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item v-show="strConsoleList" label="console命令" prop="strConsole">
          <s-select v-model="form.strConsole">
            <s-option v-for="(value, key) in strConsoleList" :key="key" :label="value" :value="key"></s-option>
          </s-select>
        </s-form-item>
      </s-form>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {isEmpty} from 'lodash'
  import {Validaters} from 'sunflower-common-utils';

  const defaultProtocolName = '00000000000000000000000000000072'  // ssh
  export default {
    data() {
      let checkPort = (rule, value, callback) => {  // 校验端口号
        if (value > 65535) {
          callback(new Error('端口号不能大于65535！'));
        } else {
          callback()
        }
      };
      return {
        opsProtocolOptions: [],
        protoclFlag: false,
        inputList: false,
        person: [],
        iWhichWHList: false,
        iColorDepthList: false,
        strConsoleList: false,
        userUuid: '',
        form: {
          protocluuid: '',
          port: '',
          iWhichWH: '',
          iColorDepth: '',
          strConsole: '',
          strAccount: '',
          strPw: '',
          userUuid: '',
          uuid: this.rowData.uuid
        },
        rules: {
          protocluuid: [Validaters.SelectValNotNull],
          port: [
            Validaters.NotNull,
            Validaters.Number,
            {validator: checkPort, trigger: 'blur'}
          ],
          userUuid: [
            Validaters.SelectValNotNull
          ],
          strAccount: [
            Validaters.NotNull
          ],
          strPw: [
            Validaters.NotNull
          ]
        }
      }
    },
    props: {
      rowData: {
        type: Object,
        default: {}
      }
    },
    watch: {
      'form.protocluuid': {
        immediate: true,
        handler(val) {
          this.opsProtocolOptions.map(v => {
            if (v.uuid === val) {
              this.form.port = v.protocolPort;
            }
          })
        }
      }
    },
    created() {
      $axios.get(`/checkCmd/getDoubleCheckPerson/${this.rowData.uuid}`).then((res) => {
        if (!isEmpty(res.data.input)) {
          this.inputList = true
        }
        this.iWhichWHList = res.data.select.iWhichWH
        this.iColorDepthList = res.data.select.iColorDepth
        this.strConsoleList = res.data.select.strConsole
        this.person = res.data.person
        this.opsProtocolOptions = res.data.select.protocols
        this.form.protocluuid = defaultProtocolName
      })
      if (!this.rowData.portUuid) {
        this.protoclFlag = true
      }
      this.getOpsProtocolOptions()
    },
    methods: {
      getOpsProtocolOptions() { // 获取协议下拉框
        $axios.post('/basicOperation/getOperationProtocolList').then((res) => {
          if (res.data) {
            this.opsProtocolOptions = res.data
            this.form.protocluuid = defaultProtocolName
          }
        });
      }
    }
  }
</script>
