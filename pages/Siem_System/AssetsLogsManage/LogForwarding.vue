/**
* Created by alex on 2019/2/18.
*/
<template>
  <div id="logforward" style="margin: 0 auto">
    <s-form label-width="110px" ref="forwardForm" :model="forwardForm" :rules="forwardrules">
      <s-form-item label="源IP地址" prop="siem_forwardSourceIPs">
        <s-input v-model="forwardForm.siem_forwardSourceIPs" style="width: 30%;" placeholder="可输入多个IP，每个IP用“，”分隔，最多50个"></s-input>
      </s-form-item>
      <s-form-item label="转发规则" prop="logForwardRuleList">
        <drag-field ref="logForwardRuleList" :data = "ruleData" v-if="asyncModel" v-model="forwardForm.logForwardRuleList"></drag-field>
      </s-form-item>
      <s-form-item label="目标地址" prop="siem_forwardTargetIPs">
        <s-input v-model="forwardForm.siem_forwardTargetIPs" style="width: 30%;" placeholder="可输入多个IP，每个IP用“，”分隔，最多50个"></s-input>
      </s-form-item>
      <s-form-item label="目标端口" prop="siem_forwardPort">
        <s-input v-model="forwardForm.siem_forwardPort" style="width: 30%;"></s-input>
      </s-form-item>
      <s-form-item label="启用" prop="siem_isLogForward">
        <s-switch v-model="forwardForm.siem_isLogForward" :active-value="1" :inactive-value="0"></s-switch>
      </s-form-item>
    </s-form>
    <s-row :gutter="20">
      <s-col :span="12" style="text-align:right">
        <s-button @click="saveForward">保存</s-button>
      </s-col>
      <s-col :span="12">
        <s-button @click="Reset">重置</s-button>
      </s-col>
    </s-row>
  </div>
</template>

<script type="text/babel">
  import {Validaters} from 'sunflower-common-utils';
  import dragField from './components/dragforwardField';
  import $axios from 'sunflower-ajax';
  export default {
    components: {
      dragField
    },
    data() {
      let checkUserIp = (rule, value, callback) => {
        if (!value) {
          callback(new Error('不能为空'))
        } else {
          if (value === '*') {
            callback()
          } else {
            let regIpv4 = /^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/;
            var regIpv6 = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
            if (value.indexOf(',') !== -1) {
              let arr = value.split(',');
              if (arr.length > 50) {
                callback(new Error('ip不能超过50个'))
              }
              for (let i = 0; i < arr.length; i++) {
                if (!regIpv4.test(arr[i]) && !regIpv6.test(arr[i])) {
                  callback(new Error(`第${i + 1}个ip格式不正确`));
                }
              }
              for (let i = arr.length - 1; i >= 0; i--) {
                let newArr = arr[i]
                for (let j = 0; j < i; j++) {
                  if (newArr === arr[j]) {
                    callback(new Error('每个ip地址不能相同'))
                  }
                }
              }
            } else if (value.indexOf('-') !== -1) {
              let arr = value.split('-');
              if (arr.length !== 2) {
                callback(new Error('输入正确的IP范围'))
              } else {
                for (let i = 0; i < arr.length; i++) {
                  if (!regIpv4.test(arr[i]) && !regIpv6.test(arr[i])) {
                    callback(new Error(`第${i + 1}个ip格式不正确`))
                  }
                }
              }
            } else {
              if (!regIpv4.test(value) && !regIpv6.test(value)) {
                callback(new Error('ip格式不正确'));
              }
            }
            callback();
          }
        }
      }
      return {
        forwardForm: {
          siem_forwardSourceIPs: '',
          siem_forwardTargetIPs: '',
          logForwardRuleList: [],
          siem_isLogForward: 1,
          siem_forwardPort: ''
        },
        asyncModel: false,
        ruleData: [],
        forwardrules: {
          siem_forwardTargetIPs: [
            {validator: checkUserIp, trigger: 'blur', required: true},
            {message: '最多可输入800个字符', trigger: 'blur', max: 800}
          ],
          siem_forwardPort: [
            Validaters.NotNull,
            Validaters.Number
          ],
          siem_forwardSourceIPs: [
            {validator: checkUserIp, trigger: 'blur', required: true},
            {message: '最多可输入800个字符', trigger: 'blur', max: 800}
          ]
        }
      }
    },
    created() {
      this.getData()
    },
    methods: {
      getData() {
        var _this = this;
        $axios.get('/syslogAuditSetting/getlogForwardSetting').then((res) => {
          _this.asyncModel = true
          _this.forwardForm = res.data
          _this.ruleData = res.data.logForwardRuleList
          _this.forwardForm.siem_isLogForward = parseInt(_this.forwardForm.siem_isLogForward)
        })
      },
      saveForward() {
        let form = this.$refs['forwardForm']
        this.forwardForm.logForwardRuleList = this.$refs['logForwardRuleList'].data
        form.validate((valid) => {
          if (!valid) {
            return false;
          }
          let obj = {
            data: [],
            logTemplate: '编辑|日志审计配置>日志转发配置'
          }
          $axios.post('/syslogAuditSetting/savelogForwardSetting', this.forwardForm, obj).then((res) => {
            if (res.data.state) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.getData()
              this.ruleData = this.forwardForm.logForwardRuleList
            } else {
              this.$message({
                message: '保存失败',
                type: 'error'
              })
            }
          })
        })
      },
      Reset() {
        for (let i in this.forwardForm) {
          if (i === 'logForwardRuleList') {
            this.$set(this.forwardForm, i, [])
            this.$refs.logForwardRuleList.clear()
            // this.forwardForm[i] = []
          } else if (i === 'siem_isLogForward') {
            this.forwardForm[i] = 1
          } else {
            this.forwardForm[i] = ''
          }
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #logforward
    .propper {
      max-width: 900px
    }
</style>
