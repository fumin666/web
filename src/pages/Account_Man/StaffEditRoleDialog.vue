<!--
 * @Author: 高建鹏
 * @Date: 2019-05-13 16:45:25
 * @LastEditors: mybells
 * @Description: 修改角色
 * @Position:
 -->
<template>
  <s-scrollbar wrap-style="max-height:450px;">
    <s-form :model="staffForm" ref="staffForm" label-width="110px" :rules="staffRule">
      <s-collapse v-model="activeName">
        <s-collapse-item title="系统角色" name="1">
          <s-form-item label="系统角色" prop="sysRole">
            <s-select style="width: 100%" @change="change" v-model="staffForm.sysRole" filterable multiple placeholder="请选择角色">
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
import {difference} from 'lodash';
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
        sysRole1: {},
        useruuid: ''
      },
      staffRule: {
        sysRole: [{ required: true, validator: validatorSelectNotNull, trigger: 'change' }]
        // 'sysRole1.c6ff433d6fd911e991f2c89cdcdee97c.role': [{ required: true, validator: validatorSelectNotNull, trigger: 'change' }]
      },
      staffForm_sysRole_temp: []
    }
  },
  props: {
    editObj: {
      type: Object
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
    this.staffForm.useruuid = this.editObj.uuid;
    /* 获取业务系统和默认选中的系统角色 */
    $axios.get(`/iamUserInfo/getUserAndBusinessRole/${this.editObj.uuid}`).then(({data}) => {
      let vm = this;
      if (data.userRoles) {
        this.staffForm_sysRole_temp = [...data.userRoles]
        vm.$nextTick(() => {
          vm.$set(vm.staffForm, 'sysRole', data.userRoles)
        })
      }
      if (vm.isIam && vm.isUserIn) {
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
            vm.$set(vm.staffForm.sysRole1, obj.bSystemUuid, {roles: obj.selectRoles, account: obj.selectAccount, bSystemUuid: obj.bSystemUuid})
          })
        })
        this.businessRole = arr
      }
    });
    /* 获取业务系统角色 */
    $axios.get('/iamUserInfo/getRoleList').then(({data}) => {
      this.roleOptions = data;
    });
  },
  methods: {
    change(arr) {
      if (this.editObj.isAuthedAdmin === 1) { // 如果是授权管理员，不能移除系统管理员角色
        let diff = difference(this.staffForm_sysRole_temp, this.staffForm.sysRole);
        if (diff && diff[0] === 'tsecondroleinfo00000000000000042') { // 系统管理员角色
          this.$message({
            message: '授权管理员，不能移除系统管理员角色!',
            type: 'warning'
          });
          this.staffForm.sysRole = [...this.staffForm_sysRole_temp];
          this.$refs.staffForm.validateField('sysRole')
        } else {
          this.staffForm_sysRole_temp = [...this.staffForm.sysRole]
        }
      }
    },
    boxChange(val, uuid) {
      if (val) {
        this.$set(this.staffRule, 'sysRole1.' + uuid + '.roles', [Validaters.SelectArrNotNull])
      } else {
        this.$delete(this.staffRule, 'sysRole1.' + uuid + '.roles')
      }
      this.$refs.staffForm.clearValidate('sysRole1.' + uuid + '.roles')
    },
    roleChange(val, uuid) {
      let vm = this;
      this.$refs.staffForm.validateField('sysRole1.' + uuid + '.roles')
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
    // getRoleList(uuid, roles) {
    //   let rolesUuid = roles.map(item => (item.uuid))
    //   $axios.post(`/iamBusinessAccount/getByRoleUuids/${uuid}`, rolesUuid).then(({data}) => {
    //     this.roleOptions2 = data;
    //     console.log(data);
    //   })
    // }
  }
}
</script>
<style>

</style>
