<!--
 * @Author: mybells
 * @Version://Q1IAM模块功能增强
 * @Description:业务权限管理-》应用系统资源管理->添加编辑操作
 * @Date: 2020-02-12 09:41:00
 * @LastEditors: mybells
 -->
<template>
  <s-dialog v-model="dialogOpenFlag" :title='title' width="650px" class="protocolAddDialog" :before-close='closeDialog'>
    <s-form :model="businnessForm" :rules="businnessRules" ref="businnessForm" label-width="120px">
      <s-form-item label='应用系统名称' prop='appName'>
        <s-input v-model.trim="businnessForm.appName"></s-input>
      </s-form-item>
      <s-form-item label='回调地址' prop='redirectUris'>
        <s-input v-model="businnessForm.redirectUris"></s-input>
      </s-form-item>
      <s-form-item label='令牌类型' prop='grantTypes'>
        <s-select v-model="businnessForm.grantTypes" placeholder="请选择" multiple clearable style="width:100%">
          <s-option label="authorization_code" value="authorization_code"></s-option>
          <s-option label="refresh_token" value="refresh_token"></s-option>
          <s-option label="implicit" value="implicit"></s-option>
          <s-option label="client_credentials" value="client_credentials"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label='授权范围' prop='scope'>
        <s-select v-model="businnessForm.scope" placeholder="请选择" multiple clearable style="width:100%">
          <s-option label="read" value="read"></s-option>
          <s-option label="write" value="write"></s-option>
        </s-select>
      </s-form-item>
    </s-form>
    <template slot="footer" class="dialog-footer">
      <s-button @click="save">确定</s-button>
      <s-button type="cancel" @click="closeDialog">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {cloneDeep} from 'lodash';
  import {Validaters} from 'sunflower-common-utils';
  export default {
    props: {
      dialogOpenFlag: Boolean,
      currentRow: Object
    },
    data() {
      // let checkRepeatName = (rule, value, callback) => {  // 校验重复名称
      //   if (this.editDialogFlag && value !== this.currentRow.name || this.addDialogFlag) {
      //       $axios.get(`/iamBusinessSystem/checkBusinessSystemName/${value}`).then((res) => {
      //         if (res.data.state === false) {
      //           callback(new Error(res.data.errormsg));
      //         } else {
      //           callback()
      //         }
      //       })
      //   } else {
      //     callback()
      //   }
      // };
      return {
        title: '添加应用系统资源',
        businnessRules: {
          appName: [
            Validaters.NotNull,
            Validaters.Max(32)
            // {validator: checkRepeatName, trigger: 'blur'}
          ],
          redirectUris: [
            Validaters.NotNull,
            Validaters.Max(2000)
          ],
          grantTypes: [ Validaters.SelectArrNotNull ],
          scope: [ Validaters.SelectArrNotNull ]
        },
        businnessForm: {
          appName: null,
          redirectUris: null,
          grantTypes: [],
          scope: []
        }
      }
    },
    created() {
      if (this.currentRow) { // 编辑
        this.title = '编辑应用系统资源';
        this.getData(this.currentRow.clientId)
      }
    },
    methods: {
      getData(clientid) {
        $axios.get(`/oauthClient/getOauthClient/${clientid}`).then(res => {
          if (res.data) {
            this.businnessForm.appName = res.data.appName;
            this.businnessForm.redirectUris = res.data.redirectUris;
            this.businnessForm.grantTypes = res.data.grantTypes ? res.data.grantTypes.split(',') : [];
            this.businnessForm.scope = res.data.scope ? res.data.scope.split(',') : [];
            this.businnessForm.clientId = res.data.clientId;
          }
        })
      },
      save() {
        if (this.currentRow) {
          this.editdialogOk();
        } else {
          this.dialogOk();
        }
      },
      dialogOk() {
        this.$refs.businnessForm.validate((valid) => {
          if (valid) {
            let form = cloneDeep(this.businnessForm);
            form.grantTypes = form.grantTypes.join(',');
            form.scope = form.scope.join(',');
            $axios.post(`/oauthClient/addOauthClient`, form, {
              data: [{appName: form.appName}],
              logTemplate: '添加|应用系统资源管理>应用系统(#appName#)'
            }).then(res => {
              if (res.data.state === true) {
                this.closeDialog()
                this.$message({message: '添加成功', type: 'success'})
                this.$emit('reload');
              } else {
                this.$message({
                  message: res.data.errormsg,
                  type: 'error'
                });
              }
            })
          }
        })
      },
      editdialogOk() {
        this.$refs.businnessForm.validate((valid) => {
          if (valid) {
            let form = cloneDeep(this.businnessForm);
            form.grantTypes = form.grantTypes.join(',');
            form.scope = form.scope.join(',');
            $axios.post(`/oauthClient/updateOauthClient`, form, {
              data: [{appName: form.appName}],
              logTemplate: '编辑|应用系统资源管理>应用系统(#appName#)'
            }).then(res => {
              if (res.data.state === true) {
                this.closeDialog();
                this.$message({message: '编辑成功', type: 'success'})
                this.$emit('reload');
              } else {
                this.$message({
                  message: res.data.errormsg,
                  type: 'error'
                });
              }
            })
          }
        })
      },
      closeDialog() {
        this.$emit('update:dialogOpenFlag', false)
      }
    }
  }
</script>

<style scoped>

</style>
