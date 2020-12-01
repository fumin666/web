<template>
  <div class="account-audit-email-my">
    <s-form :model="myEmailForm" :rules="emailFormRule" label-width="100px" ref="myEmailForm">
      <s-form-item label="真实姓名" prop="userName">
        <s-input v-model="myEmailForm.userName"></s-input>
      </s-form-item>
      <s-form-item label="Email" prop="userEmail">
        <s-input v-model="myEmailForm.userEmail"></s-input>
      </s-form-item>
    </s-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        myEmailForm: {
          userName: '',
          userEmail: '',
          tmp: true
        },
        emailFormRule: {
          userName: [
            {required: true, message: '请输入真实姓名', trigger: 'blur'},
            { max: 30, message: '最大长度为30', trigger: 'blur' }
          ],
          userEmail: [
            {required: true, message: '请输入Email', trigger: 'blur'},
            {type: 'email', message: '请输入正确的Email', trigger: 'blur'}
          ]
        }
      }
    }
  }
</script>
