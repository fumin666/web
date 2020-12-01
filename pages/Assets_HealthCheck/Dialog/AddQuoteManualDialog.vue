<template>
  <s-dialog v-model="dialogFlag" title="邮件" width="600px" class="" append-to-body>
    <s-form :model="myEmailForm" :rules="emailFormRule" label-width="100px" ref="myEmailForm">
      <s-form-item label="真实姓名" prop="accountName">
        <s-input v-model="myEmailForm.accountName"></s-input>
      </s-form-item>
      <s-form-item label="Email" prop="email">
        <s-input v-model="myEmailForm.email"></s-input>
      </s-form-item>
    </s-form>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  export default {
    data() {
      return {
        dialogFlag: false,
        myEmailForm: {
          accountName: '',
          email: ''
        },
        emailFormRule: {
          accountName: [
            {required: true, message: '请输入真实姓名', trigger: 'blur'},
            {max: 40, message: '不能超过40个字符', trigger: 'blur'}
          ],
          email: [
            {type: 'email', required: true, message: '请输入正确的邮箱', trigger: 'blur'}
          ]
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      dialogOk() {
        this.$refs.myEmailForm.validate((valid) => {
          if (valid) {
            this.$emit('add-quote', this.myEmailForm);
            this.dialogFlag = false;
          } else {
            return false;
          }
        });
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    }
  }
</script>

<style lang="stylus">

</style>
