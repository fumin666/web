<!--
 * @Author: 高建鹏
 * @Date: 2019-04-02 09:30:28
 * @LastEditors: 高建鹏
 * @Description: 生成账号
 * @Position:
 -->
<template>
  <s-scrollbar wrap-style="max-height:450px;">
    <s-form :model="staffForm" ref="roleForm" label-width="110px" :rules="staffRule">
      <s-collapse v-model="activeName">
        <s-collapse-item title="系统角色" name="1">
          <s-form-item label="系统角色" prop="sysRole">
            <s-select style="width: 100%" v-model="staffForm.sysRole" filterable multiple placeholder="请选择角色">
              <s-option v-for="role in roleOptions" :label="role.roleName" :value="role.uuid" :key="role.uuid"></s-option>
            </s-select>
          </s-form-item>
        </s-collapse-item>
        <s-collapse-item title="业务角色" name="2" v-if="isIam && isUserIn">
          <s-row type="flex" justify="start" align="middle" style="margin-bottom: 16px;" :key="business.bSystemUuid" v-for="(business,index) in businessRole">
            <s-col span="1">
              <s-checkbox v-model="businessRole[index].checked" @change="boxChange($event,business.bSystemUuid)"></s-checkbox>
            </s-col>
            <s-col span="23">
              <s-form-item :label="business.bSystemName" style="margin-bottom: 0;" :prop="'sysRole1.'+business.bSystemUuid+'.roles'">
                <s-select v-show="businessRole[index].checked" style="width: 49%" v-model="staffForm.sysRole1[business.bSystemUuid].roles" filterable multiple placeholder="请选择角色" @change="roleChange($event,business.bSystemUuid)">
                  <s-option v-for="role1 in business.roles" :label="role1.name" :value="role1.uuid" :key="role1.uuid"></s-option>
                </s-select>
                <s-select v-show="businessRole[index].checked" style="width: 50%" v-model="staffForm.sysRole1[business.bSystemUuid].account" filterable clearable placeholder="请选择账号">
                  <s-option v-for="role2 in business.accounts" :label="role2.name" :value="role2.uuid" :key="role2.uuid"></s-option>
                </s-select>
              </s-form-item>
            </s-col>
          </s-row>
        </s-collapse-item>
      </s-collapse>
    </s-form>
  </s-scrollbar>
</template>

<script>
import $axios from 'sunflower-ajax';
import {Validaters} from 'sunflower-common-utils';
// import {intersectObj} from 'sunflower-common-utils'
export default {
  data() {
    let validatorSelectNotNull = function(rule, value, callback) {
      if (value && value.length) {
        callback();
      } else {
        callback(new Error('不能为空'));
      }
    };
    return {
      isIam: false,
      activeName: '1',
      roleOptions: [],
      roleOptions2: [],
      businessRole: [],
      staffForm: {
        sysRole: [],
        sysRole1: {}
      },
      staffRule: {
        sysRole: [{ required: true, validator: validatorSelectNotNull, trigger: 'change' }]
        // 'sysRole1.c6ff433d6fd911e991f2c89cdcdee97c.role': [{ required: true, validator: validatorSelectNotNull, trigger: 'change' }]
      }
    }
  },
  props: {
    userUuidList: {
      type: Array
    },
    isUserIn: {
      type: Boolean // 是否是应用人员
    }
  },
  created() {
    let registerModelList = this.$store.state.userData.registerModelList
    if (registerModelList.indexOf('IAM_EXTEND') !== -1) {
      this.isIam = true
    }
    if (this.isIam && this.isUserIn) {
      /* 获取业务系统和默认选中的系统角色 */
      $axios.get(`/iamUserInfo/getUserAndBusinessRoleForAutoAccount`).then(({data}) => {
        let vm = this;
        let arr = data.businessRoles ? data.businessRoles : [];
        arr.forEach(function(obj, index) {
          if (!obj.selectAccount) {
            obj.selectAccount = '';
          }
          if (!obj.selectRoles) {
            obj.selectRoles = [];
          }
          if (!obj.accounts) {
            obj.accounts = [];
          }
          obj.checked = false;
          vm.$nextTick(() => {
            vm.$set(vm.staffForm.sysRole1, obj.bSystemUuid, {roles: [], account: '', bSystemUuid: obj.bSystemUuid})
          })
        })
        this.businessRole = arr
      });
    }
    /* 获取业务系统角色 */
    $axios.get('/iamUserInfo/getRoleList').then(({data}) => {
      this.roleOptions = data;
    });
  },
  methods: {
    boxChange(val, uuid) {
      if (val) {
        this.$set(this.staffRule, 'sysRole1.' + uuid + '.roles', [Validaters.SelectArrNotNull])
      } else {
        this.$delete(this.staffRule, 'sysRole1.' + uuid + '.roles')
      }
      this.$refs.roleForm.clearValidate('sysRole1.' + uuid + '.roles')
    },
    roleChange(val, uuid) {
      let vm = this;
      this.$refs.roleForm.validateField('sysRole1.' + uuid + '.roles')
      if (val.length) {
        /* 获取业务账号 */
        $axios.post(`/iamBusinessAccount/getByRoleUuids/${uuid}`, val).then(({data}) => {
        let arr = vm.businessRole ? vm.businessRole : [];
          arr.forEach(function(item, index) {
            if (item.bSystemUuid === uuid) {
              if (data instanceof Array) {
                vm.$set(arr[index], 'accounts', data)
              } else {
                vm.$set(arr[index], 'accounts', [])
              }
              vm.$set(vm.staffForm.sysRole1[uuid], 'account', '')
            }
          })
        });
      } else {
        let arr = vm.businessRole ? vm.businessRole : [];
        arr.forEach(function(item, index) {
          if (item.bSystemUuid === uuid) {
            vm.$set(arr[index], 'accounts', [])
            vm.$set(vm.staffForm.sysRole1[uuid], 'account', '')
          }
        })
      }
    }
  }
}
</script>
<style>

</style>

