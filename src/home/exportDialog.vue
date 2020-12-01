<template>
  <s-dialog
    v-model="userExportDialog"
    v-if="userExportDialog"
    width="700px"
    append-to-body
    :before-close="cancelDialog"
    title="设置导出的附件密码">
    <s-form :model="form" :rules="rules" ref="passwordForm" label-width="130px">
      <s-form-item label="附件密码" prop="password">
        <s-input v-model="form.password" type="password" placeholder="请输入附件密码"></s-input>
      </s-form-item>
      <s-form-item label="确认密码" prop="repassword">
        <s-input v-model="form.repassword" type="password" placeholder="请再输入一次附件密码"></s-input>
      </s-form-item>
    </s-form>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="cancelDialog">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import { base64, Validaters } from 'sunflower-common-utils';
    export default {
      data() {
         return {
           userExportDialog: false,
           form: {
             password: '',
             repassword: ''
           },
           rules: {
             password: [Validaters.NotNull, Validaters.Max(999)],
             repassword: [Validaters.NotNull, Validaters.Max(999)]
           }
         }
       },
      props: {
        value: {
          type: Boolean,
          default: false
        }
      },
      watch: {
        value: {
          immediate: true,
          handler(val) {
            this.userExportDialog = val;
          }
        },
        dialogFlag(val) {
          this.$emit('input', val);
        }
      },
      methods: {
        dialogOk() {
          let encrypt = new base64()
          let form = this.$refs['passwordForm'];
          form.validate((valid) => {
            if (!valid) {
              return false;
            }
            let form = {...this.form};
            if (form.password !== form.repassword) {
              this.$message({showClose: true, message: '两次输入的密码必须一样', type: 'error'});
              return false;
            }
            form.password === '' ? form.password = '' : form.password = encrypt.encode(form.password)
            this.$emit('exportDialogOk', form)
          })
        },
        cancelDialog() {
          this.$emit('cancelDialog')
        }
      }
    }
</script>

<style scoped>

</style>
