<template>
  <s-form id="LDAPForm" ref="LDAPForm" :model="LDAPForm" :rules="LDAPFormRule" label-width="140px">
    <s-row class="title">
      <i class="iconfont icon-tag"></i>
      <span>LDAP认证服务器属性</span>
    </s-row>
    <s-form-item label="服务器域名:" prop="domain">
      <s-input v-model="LDAPForm.domain" :maxlength="30" placeholder="最大长度为30个字符"></s-input>
    </s-form-item>
    <s-form-item label="服务器地址:" prop="ip">
      <s-input v-model="LDAPForm.ip"></s-input>
    </s-form-item>
    <s-form-item label="端口:" prop="port">
      <s-input v-model.number="LDAPForm.port"></s-input>
    </s-form-item>
    <s-form-item label="管理员DN:" prop="adminDn" tip="最大长度256">
      <s-input v-model="LDAPForm.adminDn"></s-input>
    </s-form-item>
    <s-form-item label="管理员口令:" prop="adminPasswd" tip="最大长度32">
      <s-input type="password" v-model="LDAPForm.adminPasswd"></s-input>
    </s-form-item>
    <s-form-item label="重复口令:" prop="repeatAdminPasswd">
      <s-input type="password" v-model="LDAPForm.repeatAdminPasswd"></s-input>
    </s-form-item>
    <s-form-item label="状态:" prop="status">
      <s-select v-model.number="LDAPForm.status">
        <s-option :value="1" label="激活"></s-option>
        <s-option :value="0" label="未激活"></s-option>
      </s-select>
    </s-form-item>
    <s-row class="title">
      <i class="iconfont icon-tag"></i>
      <span>LDAP查询对象属性</span>
    </s-row>
    <s-form-item label="基准DN:" prop="standardDn" tip="最大长度256">
      <s-input v-model="LDAPForm.standardDn"></s-input>
    </s-form-item>
    <s-form-item label="用户对象类型:" prop="type" tip="最大长度64">
      <s-input v-model="LDAPForm.type"></s-input>
    </s-form-item>
    <s-form-item label="用户名字段名称:" prop="name" tip="最大长度64">
      <s-input v-model="LDAPForm.name"></s-input>
    </s-form-item>
    <s-form-item label="用户口令字段名称:" prop="password" tip="最大长度64">
      <s-input v-model="LDAPForm.password"></s-input>
    </s-form-item>
    <s-form-item>
      <s-button class="rightBtn" @click="saveLDAPForm">保存</s-button>
    </s-form-item>
  </s-form>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {Validaters} from 'sunflower-common-utils'

  export default{
    data() {
      let validDomainIp = (rule, value, callback) => {
        if (value === '' && this.LDAPForm.domain === '') {
          callback(new Error('服务器域名或地址至少填写一个'))
        } else {
          callback()
        }
      }
      let validAdminPasswd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空'));
        } else {
          if (this.LDAPForm.repeatAdminPasswd !== '') {
            this.$refs.LDAPForm.validateField('repeatAdminPasswd');
            callback();
          } else {
            callback();
          }
        }
      }
      let validRepeatAdminPasswd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空'));
        } else if (value !== this.LDAPForm.adminPasswd) {
          callback(new Error('两次口令不一致!'));
        } else {
          callback();
        }
      }
      return {
        postUrl: '',
        LDAPForm: {
          domain: '',
          ip: '',
          port: '',
          adminDn: '',
          adminPasswd: '',
          repeatAdminPasswd: '',
          status: 0,
          standardDn: '',
          type: '',
          name: '',
          password: '',
          uuid: ''
        },
        LDAPFormRule: {
          ip: [
            {validator: validDomainIp, trigger: 'blur'},
            Validaters.IP
          ],
          port: [{required: true, type: 'number', message: '请输入数字', trigger: 'blur'}],
          adminDn: [
            {required: true, message: '不能为空', trigger: 'blur'},
            { max: 256, message: '最大长度为256', trigger: 'blur' }
          ],
          adminPasswd: [
            {required: true, validator: validAdminPasswd, trigger: 'blur'},
            { max: 32, message: '最大长度为32', trigger: 'blur' }
          ],
          repeatAdminPasswd: [{required: true, validator: validRepeatAdminPasswd, trigger: 'blur'}],
          status: [{required: true, type: 'number', message: '不能为空', trigger: 'blur'}],
          standardDn: [
            {required: true, message: '不能为空', trigger: 'blur'},
            { max: 256, message: '最大长度为256', trigger: 'blur' }
          ],
          type: [
            {required: true, message: '不能为空', trigger: 'blur'},
            { max: 64, message: '最大长度为64', trigger: 'blur' }
          ],
          name: [
            {required: true, message: '不能为空', trigger: 'blur'},
            { max: 64, message: '最大长度为64', trigger: 'blur' }
          ],
          password: [
            {required: true, message: '不能为空', trigger: 'blur'},
            { max: 64, message: '最大长度为64', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      initLDAPForm() {
        $axios.post('/sysLdapInfo/getSysLdapInfo').then(res => {
          let resData = res.data.ldapInfo
          if (resData) {
            for (let key in this.LDAPForm) {
              if (resData[key] !== null) {
                this.LDAPForm[key] = resData[key]
              }
            }
            this.LDAPForm.repeatAdminPasswd = resData.adminPasswd
          }
          if (resData && resData.uuid) {
            this.postUrl = '/sysLdapInfo/updateSysLdapInfo'
          } else {
            this.postUrl = '/sysLdapInfo/saveSysLdapInfo'
          }
        })
      },
      saveLDAPForm() {
        this.$refs['LDAPForm'].validate(valid => {
          if (valid) {
            $axios.post(this.postUrl, this.LDAPForm, {
              data: [],
              logTemplate: '设置|登录认证配置>LDAP设置'
            }).then(res => {
              let resData = res.data
              if (resData === 'success') {
                this.$message({
                  type: 'success',
                  message: '保存成功！'
                })
                this.initLDAPForm()
              } else {
                this.$message({
                  type: 'error',
                  message: '保存失败，请重试！'
                })
              }
            })
          } else {
            return false
          }
        })
      }
    },
    created() {
      this.initLDAPForm()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #LDAPForm
    .s-input-small
      width 93%
    .s-tooltip
      font-size 18px
</style>
