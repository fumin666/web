<!--
 * @Author: songyf
 * @Date: 2019-10-30
 * @LastEditors: songyf
 * @Description: 账号管理-授权策略管理-高级设置
 -->
<template>
  <s-dialog v-model="dialogFlag" title="高级设置" width="600px" append-to-body class="senior-box">
    <s-scrollbar wrap-class="default-dialog-scroll">
      <s-form :model="ruleForm" ref="ruleForm" :rules="ruleRules" label-width="120px" class="ruleForm">
        <s-form-item label="密码会同" prop="pwdCon">
          <s-select v-model="ruleForm.pwdCon"  :disabled="isView">
            <s-option label="关闭" :value="0"></s-option>
            <s-option label="开启" :value="1"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="清单类型" prop="listType">
          <s-select v-model="ruleForm.listType" filterable :disabled="pwdConFlag || isView">
            <s-option label="授权清单" :value="0"></s-option>
            <s-option label="申请清单" :value="1"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="访问规则" prop="accessRules">
          <s-select v-model="ruleForm.accessRules" multiple collapse-tags filterable clearable :disabled="isView">
            <s-option v-for="item in accessRulesOption" :label="item.ruleName" :value="item.uuid" :key="item.value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="备注" prop="remarks">
          <s-input type="textarea" v-model="ruleForm.remarks" :disabled="isView"></s-input>
        </s-form-item>
      </s-form>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="saveData" v-if="!isView">保存</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';
  export default {
    components: {
    },
    data() {
      return {
        dialogFlag: false,
        pwdConFlag: false,
        oldPwdCon: 0, // 密码会同旧值
        accessRulesOption: [],
        ruleForm: {
          pwdCon: 0,
          listType: 0,
          accessRules: [],
          remarks: ''
        },
        ruleRules: {
          pwdCon: [
            {type: 'number', required: true, message: '请选择密码会同', trigger: 'change'}
          ],
          listType: [
            {type: 'number', required: true, message: '请选择清单类型', trigger: 'change'}
          ],
          remarks: [Validaters.Max(255)]
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      tempObj: {
        type: Object,
        require: true,
        default: {}
      },
      authSeniorObj: {
        type: Object,
        require: true,
        default: {}
      },
      isView: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      },
      'ruleForm.pwdCon': {
        immediate: true,
        handler(val) {
          if (val === 1) {
            this.ruleForm.listType = 0;
            this.pwdConFlag = true;
          } else {
            this.pwdConFlag = false;
          }
        }
      }
    },
    mounted() {
      this.getAccessRulesData()
      if (this.authSeniorObj) {
        this.ruleForm.pwdCon = this.authSeniorObj.pwdCon;
        this.ruleForm.listType = this.authSeniorObj.listType;
        this.ruleForm.accessRules = this.authSeniorObj.loginRuleList;
        this.ruleForm.remarks = this.authSeniorObj.authCont;
        this.oldPwdCon = this.authSeniorObj.pwdCon  // 保存密码会同旧值
      }
    },
    methods: {
      getAccessRulesData() { // 获取访问规则
        $axios.post('/loginRule/getLoginRuleInfoList').then((res) => {
          if (res.data) {
            this.accessRulesOption = res.data.ruleInfoList
          }
        });
      },

      saveData() {
        if (this.oldPwdCon !== this.ruleForm.pwdCon && this.ruleForm.pwdCon === 1) {
          this.$confirm('密码会同开启后，会解除所有账号的授权，确认保存？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.saveAxios()
          }).catch(() => {});
        } else {
          this.saveAxios()
        }
      },
      saveAxios() {
        let params = {
          uuid: this.tempObj.uuid,
          tempUuid: this.tempObj.tempUuid,
          listType: this.ruleForm.listType,
          pwdCon: this.ruleForm.pwdCon,
          authCont: this.ruleForm.remarks,
          loginRuleList: this.ruleForm.accessRules
        };
        this.$refs.ruleForm.validate(vaild => {
          if (!vaild) {
            this.$message({type: 'error', message: '请正确填写信息'});
            return
          }
          $axios.post('/operationAuth/updateAuthGlobalSetting', params).then(({data}) => {
            if (data.state) {
              this.$emit('reloadDetaile')
              this.$message({type: 'success', message: data.errormsg});
              this.dialogFlag = false;
            } else {
              this.$message({type: 'error', message: data.errormsg})
            }
          });
        })
      }
    }
  }
</script>
<style>
  .senior-box .s-select{
    width: 250px;
  }
</style>

