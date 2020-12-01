<template>
  <s-form :model="myMessageForm" :rules="messageFormRule" label-width="100px" ref="myMessageForm">
    <s-form-item label="真实姓名" prop="userRealName">
      <s-input v-model="myMessageForm.userRealName"></s-input>
    </s-form-item>
    <s-form-item label="手机号码" prop="userPhone">
      <s-input v-model="myMessageForm.userPhone"></s-input>
    </s-form-item>
  </s-form>
</template>

<script>
  import {Validaters} from 'sunflower-common-utils';
  export default {
    data() {
      return {
        myMessageForm: {
          userRealName: '',
          userPhone: '',
          tmp: true
        },
        messageFormRule: {
          userRealName: [
            {required: true, message: '请输入真实姓名', trigger: 'blur'},
            {max: 30, message: '最多输入30个字符', trigger: 'blur'}
          ],
          userPhone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            Validaters.Max(20),
            Validaters.MobilePhone
          ]
        }
      }
    }
  }
</script>
