<template>
  <s-form ref="batchPwdExport" :model="batchPwdExportForm" :rules="batchPwdExportFormRules" label-width="120px">
    <s-form-item label="附件密码:" prop="pwd1">
      <s-input v-model="batchPwdExportForm.pwd1" type="password"></s-input>
    </s-form-item>
    <s-form-item label="确认密码:" prop="pwd2">
      <s-input v-model="batchPwdExportForm.pwd2" type="password"></s-input>
    </s-form-item>
    <s-form-item style="text-align: right">
      <s-button id="saveBatchPwdExport" @click="saveBatchPwdExport">保存</s-button>
    </s-form-item>
  </s-form>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'

  export default{
    data() {
      let checkPassSame = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空'))
        } else {
          if (this.batchPwdExportForm.pwd2 !== '') {
            this.$refs.batchPwdExport.validateField('pwd2')
          }
          callback()
        }
      }
      let checkPassSame2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空'))
        } else {
          if (value !== this.batchPwdExportForm.pwd1) {
            callback(new Error('两次密码不一致!'))
          } else {
            callback()
          }
        }
      }
      return {
        batchPwdExportForm: {
          pwd1: '',
          pwd2: ''
        },
        batchPwdExportFormRules: {
          pwd1: [{
            required: true, message: '不能为空', trigger: 'blur'}, {
            validator: checkPassSame, trigger: 'blur'
          }],
          pwd2: [{
            required: true, message: '不能为空', trigger: 'blur'}, {
            validator: checkPassSame2, trigger: 'blur'
          }]
        }
      }
    },
    props: {
      uuids: {
        type: Array,
        required: true
      }
    },
    methods: {
      saveBatchPwdExport() {
        this.$refs['batchPwdExport'].validate(valid => {
          if (valid) {
            let sendData = {
              assetUuids: this.uuids,
              pwd: this.batchPwdExportForm.pwd1
            }
            $axios.post('/tPasswdChangeTask/exportPwd', sendData).then(res => {
              if (res.data.result === 'success') {
                Download(`/tPasswdChangeTask/downTask/${res.data.name}`)
                // Download(`/tPasswdChangeTask/downTask/${}/${}`, {type: 'post', data: {name: res.data.name, path: res.data.path}})
                this.$emit('batchPwdExportSuccess')
              } else {
                this.$message({
                  type: 'error',
                  message: '导出失败，请重试！'
                })
              }
            })
          } else {
            return false
          }
        })
      }
    },
    created() {
    }
  }
</script>
