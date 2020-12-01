<template>
  <s-row>
    <s-form ref="beforeChangePassForm" :model="beforeChangePassForm" :rules="beforeChangePassRules" label-width="140px">
      <s-form-item prop="pwdEmailFlag">
        <s-checkbox
          label="发送改密前邮件通知"
          :true-label="1"
          :false-label="0"
          v-model.number="beforeChangePassForm.pwdEmailFlag"></s-checkbox>
      </s-form-item>
      <s-form-item label="邮件:" prop="pwdEmail">
        <s-input
          v-model="beforeChangePassForm.pwdEmail"
          :disabled="beforeChangePassForm.pwdEmailFlag!==1"></s-input>
      </s-form-item>
      <s-form-item prop="pwdEmailPasswdFlag">
        <s-checkbox
          label="设置附件密码"
          :true-label="1"
          :false-label="0"
          v-model.number="beforeChangePassForm.pwdEmailPasswdFlag"
          :disabled="beforeChangePassForm.pwdEmailFlag!==1"></s-checkbox>
      </s-form-item>
      <s-form-item label="附件密码:" prop="pwdEmailPasswd">
        <s-input
          v-model="beforeChangePassForm.pwdEmailPasswd"
          type="password"
          :disabled="beforeChangePassForm.pwdEmailPasswdFlag!==1"></s-input>
      </s-form-item>
      <s-form-item label="提前通知天数:">
        <s-input-number
          v-model.number="beforeChangePassForm.pwdEmailDay"
          :min="1"
          :disabled="beforeChangePassForm.pwdEmailFlag!==1"></s-input-number>
      </s-form-item>
      <s-form-item label="运维审计系统网址:" prop="pwdEmailContent">
        <s-input
          v-model="beforeChangePassForm.pwdEmailContent"
          disabled></s-input>
      </s-form-item>
    </s-form>
  </s-row>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {intersectObj} from 'sunflower-common-utils'

  export default{
    data () {
      let checkPwdEmailFlag = (rule, value, callback) => {
        if (this.beforeChangePassForm.pwdEmailFlag === 1) {
          if (!value) {
            callback(new Error('不能为空'))
          } else {
            // 验证邮箱格式
            let reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
            if (!reg.test(value)) {
              callback(new Error('邮箱格式不正确'))
            } else {
              callback()
            }
          }
        } else {
          callback()
        }
      }
      let checkPwdEmailPasswd = (rule, value, callback) => {
        if (this.beforeChangePassForm.pwdEmailPasswdFlag === 1) {
          if (!value) {
            callback(new Error('不能为空'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      return {
        taskPeriodTypeTxt: '月',
        beforeChangePassForm: {
          pwdEmailFlag: 0,
          pwdEmail: null,
          pwdEmailPasswdFlag: 0,
          pwdEmailPasswd: null,
          pwdEmailDay: 0,
          uuid: null
        },
        beforeChangePassRules: {
          pwdEmail: [
            {validator: checkPwdEmailFlag, trigger: 'blur'}
          ],
          pwdEmailPasswd: [
            {validator: checkPwdEmailPasswd, trigger: 'blur'}
          ]
        }
      }
    },
    props: {
      originData: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    watch: {
      beforeChangePassForm: {
        deep: true,
        handler(newVal, oldVal) {
          if (newVal.pwdEmailFlag === 0) {
            this.beforeChangePassForm.pwdEmailPasswdFlag = 0
          }
        }
      }
    },
    methods: {
      // 改密前设置表单验证
      validateBefore() {
        let validRes = false;
        this.$refs['beforeChangePassForm'].validate(valid => {
          if (valid) validRes = true;
        });
        return validRes;
      },
      // 保存改密前设置
      saveBeforeForm (changeTaskUuid) {
        // 新增时promise.resolve(changeTaskUuid) || 编辑时this.originData.uuid
        this.beforeChangePassForm.uuid = changeTaskUuid || this.originData.uuid;
        return new Promise((resolve, reject) => {
          // 新增的时候"发送改密前邮件通知"未选择时，不调接口。编辑不做判断
          if (!this.originData.uuid && !this.beforeChangePassForm.pwdEmailFlag) {
            resolve('before');
            return;
          }
          $axios.post('/tPasswdChangeTask/agoTPasswdChangeTask', this.beforeChangePassForm).then((res) => {
            let resData = res.data
            if (resData === 'true') {
              resolve('before');
            } else {
              this.$message({
                type: 'error',
                message: '“改密前设置”保存失败，请重试！'
              });
              reject('before');
            }
          })
        });
      }
    },
    created() {
      if (Object.keys(this.originData).length > 0) {
        // 编辑时回显数据
        this.beforeChangePassForm = intersectObj(this.beforeChangePassForm, this.originData)
      }
      this.$set(this.beforeChangePassForm, 'pwdEmailContent', `${window.location.protocol}//${window.location.host}`)
    }
  }
</script>

