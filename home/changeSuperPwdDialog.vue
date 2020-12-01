<!--
 * @Author: mybells
 * @Version://Q1UE问题优化
 * @Description://superadmin账号的管理
 * @Date: 2020-01-20 15:22:00
 * @LastEditors: mybells
 -->
<template>
<div>
  <s-dialog title="系统提示" width="750px" v-model="changeSuperPwdDialog" v-if="changeSuperPwdDialog" :show-close="false">
    <s-row style="padding:40px 0;">
      <s-col span="8" class="left">
        <img style="width:100%;" src="/static/images/business/Group.png" alt="">
      </s-col>
      <s-col span="16" style="padding-left:20px;font-size:18px;" class="right">
        {{admin}},<br/>
        你已经完成了首次使用向导，无法进行其他操作！<br/>
        若您需要重置系统管理员密码，请<span @click="reset" class="theme_color_default_font" style="font-size:18px;cursor:pointer;"><u>&lt;点击&gt;</u></span>此处。<br/>
        <p v-if="$store.state.configGuide.register">若您需要重新激活，请<span @click="registerClick" class="theme_color_default_font" style="font-size:18px;cursor:pointer;"><u>&lt;点击&gt;</u></span>此处。</p>
        若无，请退出！<br/><br/>
      </s-col>
    </s-row>
    <template slot="footer" class="dialog-footer">
      <s-button type="cancel" @click="cancel">退出</s-button>
    </template>
  </s-dialog>
  <s-dialog title="重置管理员密码" width="350px" v-if="pwdDialog" v-model="pwdDialog" append-to-body>
    <s-form :model="form" :rules="rules" ref="form" label-width="120px">
      <s-form-item label="管理员账号：" prop="uuid">
        <s-select v-model="form.uuid" placeholder="请选择">
          <s-option v-for="item in adminList"
            :key="item.uuid"
            :label="item.colname"
            :value="item.uuid">
          </s-option>
        </s-select>
      </s-form-item>
    </s-form>
    <template slot="footer" class="dialog-footer">
      <s-button @click="pwdsave">确 定</s-button>
      <s-button type="cancel" @click="pwdcancel">取 消</s-button>
    </template>
  </s-dialog>
  <!--产品注册-->
  <s-dialog
    v-model="registerDialog"
    v-if="registerDialog"
    width="700px"
    :before-close="registerCancel"
    title="产品注册">
    <s-scrollbar wrap-style="max-height:350px;padding-right:10px;">
    <s-form :model="register" :rules="registerRules" ref="productRegister" label-width="80px">
      <s-form-item label="序列号" prop="serialNumber">
        <s-input type="text" v-model="register.serialNumber" style="width:100%;"></s-input>
      </s-form-item>
      <s-form-item label="请求码" prop="requestCode">
        <div style="box-sizing: border-box;border: solid 1px #344458; border-radius:4px; height:36px; padding:0 10px;">
          {{ register.requestCode ? register.requestCode : '' }}
        </div>
      </s-form-item>
      <s-form-item label="激活码" prop="activationCode">
        <s-input type="textarea" v-model="register.activationCode" :rows="3"></s-input>
      </s-form-item>
    </s-form>
    </s-scrollbar>
    <template slot="footer">
      <s-button @click="handleRegister">注册</s-button>
      <s-button type="cancel" @click="registerCancel">取消</s-button>
    </template>
  </s-dialog>
</div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import { Validaters, superAdminName } from 'sunflower-common-utils';
  import {debounce} from 'lodash'
  export default {
    data() {
      return {
        admin: 'superadmin',
        title: '系统提示',
        pwdDialog: false,
        registerDialog: false,
        form: {
          uuid: ''
        },
        adminList: [],
        register: {
          serialNumber: '',
          requestCode: '',
          activationCode: ''
        },
        rules: {
          uuid: [Validaters.SelectValNotNull]
        },
        registerRules: {
          serialNumber: [
            {required: true, message: '请输入序列号', trigger: 'blur'},
            {
              pattern: /^([\dA-Z]{5}-){4}[\dA-Z]{5}$/,
              message: '请填写正确格式的序列号(5个字母数字组合一组,共5组，中间用\' - \'隔开)',
              trigger: 'blur'
            }
          ],
          requestCode: [
            {required: true, message: '服务端错误，未获取到请求码', trigger: 'blur'}
          ],
          activationCode: [
            {required: true, message: '请输入激活码', trigger: 'blur'},
            {
              pattern: /^([\dA-Z]{5}-){49}[\dA-Z]{5}$/,
              message: '请填写正确格式的序列号(5个字母数字组合一组,共50组，中间用\' - \'隔开)',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    props: {
      changeSuperPwdDialog: Boolean
    },
    created() {
      this.admin = superAdminName;
      $axios.get('/firstUsageWizard/getUsersOfSystemRoles').then(res => {
        this.adminList = res.data;
      })
    },
    methods: {
      cancel() {
        this.$emit('update:changeSuperPwdDialog', false);
      },
      reset() {
        this.pwdDialog = true;
      },
      registerClick() {
        this.registerDialog = true;
        $axios.get('/systemmanager/systemsetting/getRequestCode').then(({data}) => {
          this.register.requestCode = data
        })
      },
      pwdsave() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            $axios.get(`/iamUserInfo/passwordReset/${this.form.uuid}`).then((res) => {
              if (res.data === 'true') {
                this.pwdDialog = false;
                this.$emit('update:changeSuperPwdDialog', false)
                this.$message({
                  type: 'success',
                  message: '重置密码成功，当前密码:p@ssw0rd'
                })
                setTimeout(() => {
                  this.logout();
                }, 200);
              } else {
                this.$message({
                  type: 'error',
                  message: '重置失败！'
                })
              }
            })
          } else {
            this.$message({
              type: 'warning',
              message: '请按要求填写信息！'
            })
            return false;
          }
        });
      },
      handleRegister: debounce(function() {
        this.$refs['productRegister'].validate((valid) => {
          if (valid) {
            $axios.post('/firstUsageWizard/registerProduct', this.register).then((res) => {
              if (res.data.state) {
                this.registerDialog = false;
                this.$emit('update:changeSuperPwdDialog', false)
                this.$message({
                  type: 'success',
                  message: '产品注册激活成功!'
                })
                setTimeout(() => {
                  this.logout();
                }, 200);
              } else {
                this.$message({
                  type: 'warning',
                  message: res.data.errormsg
                })
              }
            })
          } else {
            this.$message({
              type: 'warning',
              message: '请按要求填写信息！'
            })
          }
        });
      }, 100),
      pwdcancel() {
        this.pwdDialog = false;
      },
      registerCancel() {
        this.registerDialog = false;
        this.register = {
          serialNumber: '',
          requestCode: '',
          activationCode: ''
        }
      },
      logout() {
        location.reload(location.origin + '/#/login')
      }
    }
  }
</script>

<style>
  #login-changepwd-form{
    margin-left: 70px;
  }
</style>
