
<!--
 * @Author: mybells
 * @Version://清远自定义报表
 * @Description:报表中心-数据库审计-自定义报表->报表配置->添加编辑操作->手动添加人员
 * @Date: 2020-02-12 09:41:00
 * @LastEditors: mybells
 -->
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
          userMail: ''
        },
        emailFormRule: {
          userRealName: [
            {required: true, message: '请输入真实姓名', trigger: 'blur'}
          ],
          userMail: [
            {type: 'email', required: true, message: '请输入正确的邮箱', trigger: 'blur'}
          ]
        }
      }
    }
  }
</script>
