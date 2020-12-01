<template>
  <s-form :model="myEmailForm" :rules="emailFormRule" label-width="100px" ref="myEmailForm">
    <s-form-item label="真实姓名" prop="userRealName">
      <s-input v-model="myEmailForm.userRealName"></s-input>
    </s-form-item>
    <s-form-item label="Email" prop="userMail">
      <s-input v-model="myEmailForm.userMail"></s-input>
    </s-form-item>
  </s-form>
</template>

<script>
  export default {
    data() {
      return {
        myEmailForm: {
          userRealName: '',
          userMail: '',
          tmp: true
        },
        emailFormRule: {
          userRealName: [
            {required: true, message: '请输入真实姓名', trigger: 'blur'},
            {max: 30, message: '最多输入30个字符', trigger: 'blur'}
          ],
          userMail: [
            {type: 'email', required: true, message: '请输入正确的邮箱', trigger: 'blur'},
            {max: 50, message: '最多输入50个字符', trigger: 'blur'}
          ]
        }
      }
    }
  }
</script>
