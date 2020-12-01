<template>
  <s-form :model="myWeChatForm" :rules="weChatFormRule" label-width="100px" ref="myWeChatForm">
    <s-form-item label="真实姓名" prop="userRealName">
      <s-input v-model="myWeChatForm.userRealName"></s-input>
    </s-form-item>
    <s-form-item label="微信号" prop="userWechat">
      <s-input v-model="myWeChatForm.userWechat"></s-input>
    </s-form-item>
  </s-form>
</template>

<script>
  export default {
    data() {
      return {
        myWeChatForm: {
          userRealName: '',
          userWechat: '',
          tmp: true
        },
        weChatFormRule: {
          userRealName: [
            {required: true, message: '请输入真实姓名', trigger: 'blur'},
            {max: 30, message: '最多输入30个字符', trigger: 'blur'}
          ],
          userWechat: [
            {required: true, message: '请输入微信号', trigger: 'blur'},
            {max: 30, message: '最多输入30个字符', trigger: 'blur'}
          ]
        }
      }
    }
  }
</script>
