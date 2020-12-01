<!--
 * @Author: 高建鹏
 * @Version: //Q4新扫描
 * @Description:添加共同体
 * @Position:新扫描-》添加共同体操作
 * @Date: 2019-11-05 13:30:41
 * @LastEditors: 高建鹏
 -->
<template>
  <s-dialog v-model="SNMPDialogFlag" width="500px" title="添加共同体" :before-close="dialogClose" append-to-body>
    <s-form :model="communityForm" :rules="communityRules" ref="communityForm" label-width="70px">
      <s-form-item label="版本号:">
        <s-radio-group v-model="communityForm.version">
          <s-radio class="radio" :label="1">v1</s-radio>
          <s-radio class="radio" :label="2">v2</s-radio>
          <s-radio class="radio" :label="3">v3</s-radio>
        </s-radio-group>
      </s-form-item>
      <s-form-item label="凭证:" prop="community" v-if="communityForm.version!==3">
        <s-input v-model="communityForm.community"></s-input>
      </s-form-item>
      <s-form-item label="用户名:" prop="userName" v-if="communityForm.version===3">
        <s-input v-model="communityForm.userName"></s-input>
      </s-form-item>
      <s-form-item label="密码:" prop="snmpPassword" v-if="communityForm.version===3">
        <s-col span="11">
          <s-input v-model="communityForm.snmpPassword" type="password"></s-input>
        </s-col>
        <s-col span="11" offset="2">
          <s-select v-model="communityForm.encryption">
            <s-option label="MD5"  value="0"></s-option>
            <s-option label="SHA"  value="1"></s-option>
          </s-select>
        </s-col>
      </s-form-item>
    </s-form>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button @click="dialogClose">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';
  export default {
    props: {
      SNMPDialogFlag: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        communityForm: {
          version: 2,
          userName: '',
          snmpPassword: '',
          encryption: '0'
        },
        communityRules: {
          userName: [
            Validaters.NotNull,
            Validaters.NotSpace,
            Validaters.Min(8),
            Validaters.Max(50)
          ],
          snmpPassword: [
            Validaters.NotNull,
            Validaters.NotSpace,
            Validaters.Min(8),
            Validaters.Max(30)
          ],
          community: [
            Validaters.NotNull,
            Validaters.Max(30),
            {pattern: /^[^!#$&！][\S]*$/, message: '第一个字符不能为! # $ &', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // save
      dialogOk() {
        this.$refs.communityForm.validate(valid => {
          if (!valid) {
            return false;
          }
          // 验证凭证是否重名
          let communityName = this.communityForm.version === 3 ? this.communityForm.userName : this.communityForm.community;
          $axios.post('/resourcemanager/discovery/checkSameCommunity', {
            'community': communityName,
            'version': this.communityForm.version
          }).then(({data}) => {
            if (data) {
              this.$message({type: 'warning', message: '该凭证已经存在，请重新输入！'});
              return;
            }
            let param = {};
            if (this.communityForm.version === 3) {
              for (let i in this.communityForm) {
                if (i !== 'community') {
                  param[i] = this.communityForm[i];
                }
              }
            } else {
              param.community = this.communityForm.community;
              param.version = this.communityForm.version;
            }
            $axios.post('/resourcemanager/discovery/addCommunity', param).then(response => {
                if (response.status === 200 && response.data !== 'error') {
                  this.$message({
                    showClose: true,
                    message: '添加成功!',
                    type: 'success'
                  });
                  // 提交成功后重置表单
                  this.communityForm = {
                    version: 2,
                    community: '',
                    userName: '',
                    snmpPassword: '',
                    encryption: '0'
                  };
                  this.$emit('update:SNMPDialogFlag', false);
                  this.$emit('reload');
                }
              });
          });
        });
      },
      // close dialog
      dialogClose() {
        this.$emit('update:SNMPDialogFlag', false);
      }
    }
  }
</script>

<style scoped>

</style>