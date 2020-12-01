/**
* Created by fumin on 2019/5/8.
*/
<template>
  <s-form ref="formRef" :model="form" :rules="rules" label-width="120px" id="edit-source">
    <s-form-item label="账号名称" prop="name">
      <s-input v-model="form.name"></s-input>
    </s-form-item>
    <s-form-item label="密码" prop="password">
      <s-input type="password" v-model="form.passWord"></s-input>
    </s-form-item>
    <s-form-item label="确认密码" prop="repeatPassword">
      <s-input type="password" v-model="form.repeatPassword"></s-input>
    </s-form-item>
    <s-form-item label="账号角色">
      <s-select v-model="form.bRoleUuids" multiple>
        <s-option v-for="(item, index) in typeList" :label="item.name" :value="item.uuid" :key="index"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="状态">
      <s-select v-model="form.status">
        <s-option :value="0" label="未激活"></s-option>
        <s-option :value="1" label="激活"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="备注" prop="remark">
      <s-input type="textarea" :rows="3" v-model="form.remark"></s-input>
    </s-form-item>
  </s-form>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.form.repeatPassword !== '') {
            this.$refs.formRef.validateField('repeatPassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.passWord) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        isDisable: true,
        form: {
          uuid: '',
          name: '',
          passWord: '',
          repeatPassword: '',
          bRoleUuids: [],
          bSystemUuid: '',
          status: 1,
          remark: ''
        },
        rules: {
          name: [{ required: true, message: '不能为空', trigger: 'blur' }],
          password: [{ required: true, validator: validatePass, trigger: 'blur' }],
          repeatPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }],
          remark: [{max: 120, message: '不能超过120个字符', trigger: 'blur'}]
        },
        typeList: []
      }
    },
    props: {
      sysUuid: {
        type: String
      },
      editData: {
        type: Object
      }
    },
    methods: {
      getRoleType(uuid) {
        $axios.get(`/iamBusinessRole/list/${uuid}`).then((res) => {
          this.typeList = res.data
          this.form.bRoleUuids = this.typeList.map(item => (item.uuid))
        })
      }
    },
    mounted() {
      this.getRoleType(this.sysUuid)
      if (this.editData) {
        this.form.name = this.editData.name
        this.form.passWord = this.editData.passWord
        this.form.repeatPassword = this.editData.passWord
        this.form.bRoleUuids = this.editData.uuid
        this.form.bSystemUuid = this.editData.bSystemUuid
        if (this.editData.status === '激活') {
          this.form.status = 1
        } else {
          this.form.status = 0
        }
        this.form.remark = this.editData.remark
      }
    }
  }
</script>
<style lang="stylus">
  #edit-source
    .s-checkbox + .s-checkbox
      margin-right 0
</style>
