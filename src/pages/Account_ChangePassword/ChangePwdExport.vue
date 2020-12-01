<template>
  <s-form ref="changePwdExport" v-model="changePwdExportForm" :rules="changePwdExportFormRules" label-width="120px">
    <s-form-item label="附件密码:" prop="pwd1">
      <s-input v-model="changePwdExportForm.pwd1" type="password"></s-input>
    </s-form-item>
    <s-form-item label="确认密码:" prop="pwd2">
      <s-input v-model="changePwdExportForm.pwd2" type="password"></s-input>
    </s-form-item>
    <s-form-item style="text-align: right">
      <s-button id="saveChangePwd" @click="saveAccountSet">保存</s-button>
    </s-form-item>
  </s-form>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import {Download} from 'sunflower-common-utils';

  export default{
    data() {
      let checkPassSame = (rule, value, callback) => {
        if (value === '') {
          callback()
        } else {
          if (this.changePwdExportForm.pwd2 !== '') {
            this.$refs.changePwdExport.validateField('pwd2')
          } else {
            callback()
          }
        }
      }
      let checkPassSame2 = (rule, value, callback) => {
        if (value === '') {
          callback()
        } else {
          if (this.changePwdExportForm.pwd2 !== this.changePwdExportForm.pwd1) {
            callback(new Error('两次密码不一致!'))
          } else {
            callback()
          }
        }
      }
      return {
        dialogFlag: false,
        changePwdExportForm: {
          pwd1: '',
          pwd2: ''
        },
        changePwdExportFormRules: {
          pwd1: [{ validator: checkPassSame, trigger: 'blur' }],
          pwd2: [{ validator: checkPassSame2, trigger: 'blur' }]
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
      saveAccountSet() {
        let sendData = {
          assetUuids: this.uuids,
          pwd: this.changePwdExportForm.pwd1
        };
        $axios.post('/tPasswdChangeTask/exportPwd', sendData, {
          logTemplate: '导出|改密结果(PasswordTaskList.xls)'
        }).then(({data}) => {
          if (data.result === 'success') {
            Download(`/tPasswdChangeTask/downTask/${data.name}`);
            this.$emit('closeExport');
          } else {
            this.$message.error('导出失败，请刷新重试！');
          }
        });
      }
    }
  }
</script>
