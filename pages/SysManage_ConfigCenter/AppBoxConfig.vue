/**
* Created by dgunzi on 2019/02/27.
* 系统设置标签页
*/
<template>
  <div id="AppboxConfigTab">
    <s-row>
      <s-form :model="configInfo" :rules="rules" label-width="110px" ref="configInfo">
        <div class="config-form">
          <s-form-item label="ip地址" prop="device_ip">
            <s-input v-model="configInfo.device_ip"></s-input>
          </s-form-item>
          <s-form-item label="端口" prop="device_port">
            <s-input v-model="configInfo.device_port"></s-input>
          </s-form-item>
          <s-form-item label="账号" prop="device_account">
            <s-input v-model="configInfo.device_account"></s-input>
          </s-form-item>
          <s-form-item label="密码" prop="device_passwd">
            <s-input type="password" v-model="configInfo.device_passwd"></s-input>
          </s-form-item>
          <s-form-item label="域名" prop="device_domain">
            <s-input v-model="configInfo.device_domain"></s-input>
          </s-form-item>
        </div>
      </s-form>
      <s-button @click="submitForm" style="margin-left: 80px">保存</s-button>
    </s-row>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {decryptPwd, encryptPwd, Validaters} from 'sunflower-common-utils';
  import {cloneDeep} from 'lodash';

  export default {
    name: 'AppboxConfigTab',
    data() {
      return {
        configInfo: {
          device_ip: '',
          device_port: '',
          device_account: '',
          device_passwd: '',
          device_domain: ''
        },
        rules: {
          device_ip: [
            {required: true, message: '请输入IP', trigger: 'blur'},
            {
              pattern: /^((([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))\.){3}(([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))$/,
              message: '请输入正确的IP信息',
              trigger: 'blur'
            }
          ],
          device_port: [
            {required: true, message: '请输入端口号', trigger: 'blur'},
            {
              pattern: /(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)/,
              message: '请输入正确的端口号',
              trigger: 'blur'
            }
          ],
          device_account: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            {max: 30, message: '长度不能超过30位', trigger: 'blur'}
          ],
          device_passwd: [{required: true, message: '请输入密码', trigger: 'blur'}],
          device_domain: [
            Validaters.Name,
            Validaters.Max(100)
          ]
        },
        standAlone: true
      }
    },
    created() {
      this.getAppBoxconfig()
    },
    methods: {
      submitForm() {
        this.$refs['configInfo'].validate((valid) => {
          if (valid) {
            let newConfigInfo = cloneDeep(this.configInfo);
            newConfigInfo.device_passwd = encryptPwd(this.configInfo.device_passwd);
            $axios.post(`/configcenter/sysconfig/setAppBox`, newConfigInfo).then(({data}) => {
              if (data.result) {
                this.$message.success(data.errormsg);
              } else {
                this.$message.error(data.errormsg);
              }
            });
          } else {
            return false;
          }
        });
      },
      getAppBoxconfig() {
        $axios.get(`/configcenter/sysconfig/getAppBox`).then(({data}) => {
          if (data) {
            this.configInfo = data;
            this.configInfo.device_passwd = decryptPwd(this.configInfo.device_passwd);
          }
        });
      }
    }
  }
</script>
