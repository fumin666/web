<!--
 * @Author: mybells
 * @Version://Q1IAM模块功能增强
 * @Description:业务权限管理-》应用系统授权管理添加弹窗
 * @Date: 2020-02-12 11:19:17
 * @LastEditors: mybells
 -->
<template>
  <s-dialog v-model="dialogFlag" :title='title' width="900px" class="protocolAddDialog" :before-close="close">
    <s-scrollbar wrap-style="max-height:500px;padding-right:10px;">
      <s-form :model="businnessForm" :rules="businnessRules" ref="businnessForm" label-width="120px">
        <s-form-item label='清单名称' prop='orderName'>
          <s-input v-model.trim="businnessForm.orderName" :disabled="isEye"></s-input>
        </s-form-item>
      </s-form>
      <p style="font-size:16px;font-weight:bold;margin-bottom:10px;">授权人员</p>
      <s-table-page :data="authUserData" @selection-change='selectionUser' :header-search="getHeaderSearch()" :header-actions='getUserActionsDef()' style="width: 100%;" max-height="300">
        <s-table-column v-if="!isEye" type="selection" width="55"></s-table-column>
        <s-table-column prop="userRealName" label="真实姓名" show-overflow-tooltip></s-table-column>
        <s-table-column prop="userLoginName" label="账号名称" show-overflow-tooltip></s-table-column>
        <s-table-column prop="departName" label="组织机构" show-overflow-tooltip></s-table-column>
        <s-table-column label="操作" v-if="!isEye">
          <template slot-scope="scope">
            <i class="iconfont icon-delete" @click="delUser([scope.row])" title="删除"></i>
          </template>
        </s-table-column>
      </s-table-page>
      <p style="font-size:16px;font-weight:bold;margin-top:20px;margin-bottom:10px;">授权应用系统</p>
      <s-table-page :data="authSysData" @selection-change='selectionSys' :header-actions='getSysActionsDef()' style="width: 100%;" max-height="300">
        <s-table-column v-if="!isEye" type="selection" width="55"></s-table-column>
        <s-table-column prop="appName" label="应用系统名称" show-overflow-tooltip></s-table-column>
        <s-table-column prop="clientId" label="Client_Id" show-overflow-tooltip></s-table-column>
        <s-table-column prop="redirectUris" label="回调地址" show-overflow-tooltip></s-table-column>
        <s-table-column label="操作" v-if="!isEye">
          <template slot-scope="scope">
            <i class="iconfont icon-delete" @click="delSys([scope.row])" title="删除"></i>
          </template>
        </s-table-column>
      </s-table-page>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer" v-if="!isEye">
      <s-button @click="save">确定</s-button>
      <s-button type="cancel" @click="close">取消</s-button>
    </template>
    <!-- 人员授权弹窗 -->
    <userAuthDialog v-if="userDialogFlag" :userDialogFlag.sync="userDialogFlag" :authUserData="authUserData" @userReload="userReload"></userAuthDialog>
    <!-- 组织机构授权弹窗 -->
    <orgAuthDialog v-if="orgDialogFlag" :isEye="isEye" :orgDialogFlag.sync="orgDialogFlag" :authOraData="authOraData" @oraReload="oraReload"></orgAuthDialog>
    <!-- 授权应用系统添加弹窗 -->
    <addSysDialog v-if="addDialogFlag" :addDialogFlag.sync="addDialogFlag" :authSysData="authSysData" @sysReload="sysReload"></addSysDialog>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {differenceBy, cloneDeep} from 'lodash';
  import {Validaters} from 'sunflower-common-utils';
  import addSysDialog from './addSysDialog'
  import userAuthDialog from './userAuthDialog'
  import orgAuthDialog from './orgAuthDialog'
  export default {
    components: {
      addSysDialog,
      userAuthDialog,
      orgAuthDialog
    },
    props: {
      type: String,
      dialogFlag: Boolean,
      rowUuid: String
    },
    data() {
      return {
        title: '添加应用系统授权清单',
        businnessForm: {
          orderName: ''
        },
        businnessRules: {
          orderName: [
            Validaters.NotNull,
            Validaters.Max(50)
          ]
        },
        authUserData: [],
        authSysData: [],
        authOraData: [], // 选中的组织机构
        oldAuthUserData: [],
        oldAuthSysData: [],
        oldAuthOraData: [], // 选中的组织机构
        userSelection: [],
        sysSelection: [],
        userDialogFlag: false,
        orgDialogFlag: false,
        addDialogFlag: false,
        isEye: false,
        addUserList: [],
        delUserList: [],
        addDepartList: [],
        delDepartList: [],
        addAppList: [],
        delAppList: []
      }
    },
    created() {
      if (this.type === 'add') { // 添加
        this.title = '添加应用系统授权清单'
      } else if (this.type === 'edit') { // 编辑
        this.title = '编辑应用系统授权清单'
        this.getUserList();
        this.getOraList();
        this.getSysList();
        this.getData();
      } else { // 查看
        this.isEye = true;
        this.title = '查看应用系统授权清单'
        this.getUserList();
        this.getOraList();
        this.getSysList();
        this.getData();
      }
    },
    methods: {
      getData() {
        $axios.get(`/oauthAuthorizeOrder/getAuthOrder/${this.rowUuid}`).then((res) => {
          this.businnessForm.orderName = res.data.orderName;
        });
      },
      getUserList() {
        $axios.get(`/oauthAuthorizeOrder/getOauthAuthorizeUserList/${this.rowUuid}`).then((res) => {
          this.authUserData = res.data || [];
          this.oldAuthUserData = cloneDeep(res.data || []);
        });
      },
      getOraList() {
        $axios.get(`/oauthAuthorizeOrder/getOauthAuthorizeDepartList/${this.rowUuid}`).then((res) => {
          this.authOraData = res.data || [];
          this.oldAuthOraData = cloneDeep(res.data || []);
        });
      },
      getSysList() {
        $axios.get(`/oauthAuthorizeOrder/getOauthAuthorizeAppList/${this.rowUuid}`).then((res) => {
          this.authSysData = res.data || []
          this.authSysData.forEach(item => { item.uuid = item.clientId });
          this.oldAuthSysData = cloneDeep(res.data || []);
        });
      },
      selectionUser(arr) {
        this.userSelection = arr;
      },
      selectionSys(arr) {
        this.sysSelection = arr;
      },
      getHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输入查询内容',
          searchProps: ['userRealName', 'userLoginName', 'departName']
        }
      },
      // 授权人员header btn
      getUserActionsDef() {
        let self = this
        if (this.isEye) {
          return {
            width: 14,
            actions: [
              {
                name: '查看授权组织机构',
                click() {
                  self.orgDialogFlag = true;
                }
              }
            ]
          }
        } else {
          return {
            width: 14,
            actions: [{
              name: '按人员授权',
              click() {
                self.userDialogFlag = true;
              }
            }, {
              name: '按组织机构授权',
              click() {
                self.orgDialogFlag = true;
              }
            }, {
              name: '批量删除',
              click() {
                self.delUser(self.userSelection);
              }
            }]
          }
        }
      },
      // 授权应用系统header btn
      getSysActionsDef() {
        let self = this
        if (this.isEye) {
          return {}
        } else {
          return {
            width: 14,
            actions: [{
              name: '添加',
              click() {
                self.addDialogFlag = true
              }
            }, {
              name: '批量删除',
              click() {
                self.delSys(self.sysSelection);
              }
            }]
          }
        }
      },
      delUser(arr) {
        if (arr.length) {
          this.$confirm('确定删除选中的数据？', '提示', {
            confirmButonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.authUserData = differenceBy(this.authUserData, arr, 'uuid');
            this.delUserList = this.delList(this.authUserData, this.oldAuthUserData);
            this.addUserList = this.addList(this.authUserData, this.oldAuthUserData);
          }).catch(() => {});
        } else {
          this.$message({
            message: '请选择要删除的数据！',
            type: 'warning'
          });
        }
      },
      delSys(arr) {
        if (arr.length) {
          this.$confirm('确定删除选中的数据？', '提示', {
            confirmButonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.authSysData = differenceBy(this.authSysData, arr, 'clientId');
            this.addAppList = this.addList(this.authSysData, this.oldAuthSysData);
            this.delAppList = this.delList(this.authSysData, this.oldAuthSysData);
          }).catch(() => {});
        } else {
          this.$message({
            message: '请选择要删除的数据！',
            type: 'warning'
          });
        }
      },
      save() {
        if (this.type === 'add') {
          let params = {
            orderName: this.businnessForm.orderName,
            addUserList: this.authUserData.map(item => item.uuid),
            addDepartList: this.authOraData.map(item => item.uuid),
            addAppList: this.authSysData.map(item => item.clientId)
          }
          this.$refs['businnessForm'].validate((valid) => {
            if (!valid) return;
            $axios.post('/oauthAuthorizeOrder/addAuthOrder', params, {
              data: [params],
              logTemplate: '添加|应用系统授权管理>清单(#orderName#)'
            }).then(res => {
              if (res.data.state) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                });
                this.$emit('reload');
              } else {
                this.$message({
                  message: res.data.errormsg,
                  type: 'error'
                });
              }
            })
          })
        } else if (this.type === 'edit') {
          let params = {
            uuid: this.rowUuid,
            orderName: this.businnessForm.orderName,
            addUserList: this.addUserList,
            delUserList: this.delUserList,
            addDepartList: this.addDepartList,
            delDepartList: this.delDepartList,
            addAppList: this.addAppList,
            delAppList: this.delAppList
          }
          this.$refs['businnessForm'].validate((valid) => {
            if (!valid) return;
            $axios.post('/oauthAuthorizeOrder/updateAuthOrder', params, {
              data: [params],
              logTemplate: '编辑|应用系统授权管理>清单(#orderName#)'
            }).then(res => {
              if (res.data.state) {
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                });
                this.$emit('reload');
              } else {
                this.$message({
                  message: res.data.errormsg,
                  type: 'error'
                });
              }
            })
          })
        } else {
          this.$emit('update:dialogFlag', false)
        }
      },
      close() {
        this.$emit('update:dialogFlag', false)
      },
      userReload(arr) {
        this.userDialogFlag = false;
        this.addUserList = this.addList(arr, this.oldAuthUserData);
        this.delUserList = this.delList(arr, this.oldAuthUserData);
        this.authUserData = arr;
      },
      oraReload(arr) {
        this.orgDialogFlag = false;
        this.addDepartList = this.addList(arr, this.oldAuthOraData);
        this.delDepartList = this.delList(arr, this.oldAuthOraData);
        this.authOraData = arr;
      },
      sysReload(arr) {
        this.addDialogFlag = false;
        this.addAppList = this.addList(arr, this.oldAuthSysData);
        this.delAppList = this.delList(arr, this.oldAuthSysData);
        this.authSysData = arr
      },
      addList(newData, oldData) {
        let arr = [];
        for (let item of newData) {
          let flag = true;
          for (let old of oldData) {
            if (item.uuid === old.uuid) {
              flag = false;
              break;
            }
          }
          if (flag) {
            arr.push(item.uuid);
          }
        }
        return arr;
      },
      delList(newData, oldData) {
        let arr = [];
        for (let old of oldData) {
          let flag = true;
          for (let item of newData) {
            if (item.uuid === old.uuid) {
              flag = false;
              break;
            }
          }
          if (flag) {
            arr.push(old.uuid);
          }
        }
        return arr;
      }
    }
  }
</script>

<style scoped>

</style>
