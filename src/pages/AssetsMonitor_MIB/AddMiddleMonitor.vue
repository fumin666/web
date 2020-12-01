<template>
  <section>
    <s-form
      ref="middleMonitorForm"
      :model="middleMonitorForm"
      :rules="middleMonitorFormRules"
      label-width="100px">
      <s-form-item label="名称:" prop="key" tip="最大长度为20个字符,不能包含特殊字符,如：'+ - * ( ) / \ ! $ % ^ '等">
        <s-input v-model="middleMonitorForm.key" :maxlength="20"></s-input>
      </s-form-item>
      <s-form-item label="OID:" prop="value" tip="最大长度为100个字符">
        <s-input v-model="middleMonitorForm.value" :maxlength="100"></s-input>
      </s-form-item>
      <s-form-item label="正则表达式:" prop="subRegex" tip="最大长度为20个字符">
        <s-input v-model="middleMonitorForm.subRegex" :maxlength="20"></s-input>
      </s-form-item>
      <s-form-item label="状态定义:" prop="express" tip="最大长度为20个字符">
        <s-input v-model="middleMonitorForm.express" :maxlength="20"></s-input>
      </s-form-item>
    </s-form>
    <s-row class="footerRow">
      <s-button type="cancel" @click="cancelAddMiddleMonitor">取消</s-button>
      <s-button @click="addMiddleMonitor">保存</s-button>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import Bus from '@/plugins/eventBus'

  export default{
    data() {
      let checkKey = (rule, value, callback) => {
        if (!value) {
          callback(new Error('不能为空'))
        } else {
          let regEn = /[`~!@#$%^&*()+\-<>?:"{},.\/;'[\]]/g;
          let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/g;
          if (regEn.test(value) || regCn.test(value)) {
            callback(new Error("不能包含特殊字符，如：'+ - * ( ) / \ ! $ % ^ '等"))
          } else {
            callback()
          }
        }
      }
      return {
        middleMonitorForm: {
          key: '',
          value: '',
          subRegex: '',
          express: ''
        },
        middleMonitorFormRules: {
          key: [{
            required: true, message: '不能为空', trigger: 'blur'
          }, {
            validator: checkKey, trigger: 'blur'
          }],
          value: [{
            required: true, message: '不能为空', trigger: 'blur'
          }, {
            max: 100, message: '最大长度为100个字符', trigger: 'blur'
          }, {
            pattern: /^(\d+\.)+\d+$/, message: '格式不正确', trigger: 'blur'
          }]
        }
      }
    },
    props: {
      callerName: {
        type: String,
        default: ''
      }
    },
    methods: {
      addMiddleMonitor() {
        this.$refs['middleMonitorForm'].validate((valid) => {
          if (valid) {
            if (this.callerName === 'addMonitorType') {
              Bus.$emit('addMonitorType-closeMiddleMonitorDialog', this.middleMonitorForm)
            }
            if (this.callerName === 'editMonitorType') {
              Bus.$emit('editMonitorType-closeMiddleMonitorDialog', this.middleMonitorForm)
            }
            Bus.$emit('closeMiddleMonitorDialog')
          }
        })
      },
      cancelAddMiddleMonitor() {
        Bus.$emit('closeMiddleMonitorDialog')
      }
    }
  }
</script>
