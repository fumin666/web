<template>
  <div class="sysPrivilege login-set">
    <s-tab type="card">
      <s-tab-pane label="用户角色" v-if="judgeRoleBtn('accountManage_systemRole') || judgeRoleBtn('gradeProtect_rsUserRole')">
        <s-table-page
          :data="roleTableData"
          :header-actions="getHeaderActions()"
          :header-search="getHeaderSearch()">
          <s-table-column label="角色名称" prop="roleName"></s-table-column>
          <s-table-column label="备注" prop="remark"></s-table-column>
          <s-table-column label="操作">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看" @click="show(scope.row)"> </i>
              <i class="iconfont icon-user" title="查看人员" @click="userShow(scope.row)"> </i>
            </template>
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
      <s-tab-pane label="层级可见性设置" class="levelVisibleTab" v-if="judgeRoleBtn('accountManage_layerVisibility') || judgeRoleBtn('gradeProtect_rsUserLevel')">
        <s-row class="title">
          <i class="iconfont icon-tag"></i>
          层级可见性设置
        </s-row>
        <s-form ref="stepForm0" :inline="true" :model="levelVisibleForm" label-width="120px">
          <s-form-item>
              <s-select v-model="levelVisibleForm.setting">
                <s-option label="无限制" :value="0"></s-option>
                <s-option label="本组织机构及下级" :value="1"></s-option>
                <s-option label="仅本组织机构" :value="2"></s-option>
              </s-select>
          </s-form-item>
        </s-form>
        <s-row style="margin-top: 10px;"><s-button @click="submitVisibleSet">保存</s-button></s-row>
        <s-row class="title" style="margin: 16px 0 6px">
          <i class="iconfont icon-staff"></i>
          特权管理员
        </s-row>
        <s-row style="margin-bottom: 5px;">
          <s-button icon="plus" @click="addAdmin">添加</s-button>
        </s-row>
        <s-table-page
          :data="visibleData"
          :row-actions='visibleRowActionDef()'
          actions-col-width="80">
          <s-table-column label="账号名称" prop="userLoginName"></s-table-column>
          <s-table-column label="真实姓名" prop="userRealName"></s-table-column>
          <s-table-column label="组织机构" prop="departName"></s-table-column>
          <s-table-column label="角色" prop="roleName"></s-table-column>
        </s-table-page>
      </s-tab-pane>
    </s-tab>
    <!--添加弹框-->
    <s-dialog
      v-model="addUserDialog"
      v-if="addUserDialog"
      width="900px"
      title="添加特权用户">
      <visible-add ref="addUser"></visible-add>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addOk">确定</s-button>
        <s-button type="cancel" @click="addCancel">取消</s-button>
      </template>
    </s-dialog>
    <!--添加弹框查看-->
    <s-dialog
      v-model="roleDetail"
      v-if="roleDetail"
      width="800px"
      title="查看角色详情/权限">
      <role-detail ref="role" :roleMsg="roleMessage"></role-detail>
    </s-dialog>
    <!--查看人员-->
    <s-dialog
      v-model="peopleDetail"
      v-if="peopleDetail"
      width="900px"
      title="查看角色人员">
        <s-table-page
          :header-search='getSearchDef()'
          :data="rolePeopleList"
          height="520">
          <s-table-column
            label="真实姓名"
            prop="userRealName">
          </s-table-column>
          <s-table-column
            label="账号名称"
            prop="userLoginName">
          </s-table-column>
        </s-table-page>
    </s-dialog>
  </div>
</template>

<script>
  // import SearchBox from '@/components/tableCom/src/SearchBox';
  import VisibleAdd from './AddVisible.vue';
  import RoleDetail from './RoleDetail.vue';
  import $axios from 'sunflower-ajax';
  import {Download} from 'sunflower-common-utils';
  export default {
    data() {
      return {
        addUserDialog: false,
        roleDetail: false,
        peopleDetail: false,
        roleTableData: [],
        rolePeopleList: [],
        roleMessage: [],
        levelVisibleForm: {
          setting: 0
        },
        visibleData: []
      }
    },
    created() {
      this.getVisibleSet();
      this.getRoleList();
    },
    mounted() {
      this.getData();
    },
    methods: {
      getHeaderActions() {
        let vm = this;
        return {
          width: 12,
          offset: 0,
          actions: [{
            name: '角色导出',
            icon: 'assist',
            click: function click() {
              vm.roleExport();
            }
          }, {
            name: '角色权限导出',
            icon: 'send',
            click: function click() {
              vm.rolePermissionExport();
            }
          }]
        };
      },
      getHeaderSearch() {
        return {
          width: 6,
          placeholder: '请输入搜索条件',
          searchProps: ['roleName', 'remark']
        }
      },
      roleExport() {
        Download('/iamRoleInfo/exportRoleInfo', {
          logTemplate: '导出|角色管理>角色(role.xls)'
        })
      },
      rolePermissionExport() {
        Download('/iamRoleInfo/exportRolePermission', {
          logTemplate: '导出|角色管理>角色权限(role.xls)'
        })
      },
      getRoleList() {
        $axios.get('/iamRoleInfo/list').then((res) => {
          this.roleTableData = res.data;
        });
      },
      userShow(row) {
        this.peopleDetail = true
        $axios.get('/iamRoleInfo/getUserByRoleUuid/' + row.uuid).then((res) => {
          this.rolePeopleList = res.data
        });
      },
      show(row) {
        this.roleDetail = true;
        $axios.get('/iamRoleInfo/viewlRoleInfos/' + row.uuid).then((res) => {
          this.roleMessage = res.data
        });
      },
      showDelete(row) {
        if (row.isDefault === 1) {
          return false;
        } else {
          return true;
        }
      },
      addAdmin() {
        this.addUserDialog = true
      },
      getSearchDef() {
        return {
          width: 6,
          offset: 18,
          placeholder: '请输入查询内容',
          searchProps: ['userRealName', 'userLoginName']
        }
      },
      getVisibleSet() {
        $axios.get('tSysDic/getLevelSetting').then((res) => {
          this.levelVisibleForm.setting = res.data.levelsVisible
        });
      },
      submitVisibleSet() {
        $axios.get(`tSysDic/saveLevelSetting/${this.levelVisibleForm.setting}`, {
          data: [],
          logTemplate: '设置|层级可见性>层级可见性设置'
        }).then((res) => {
          if (res.data === 'success') {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          }
        });
      },
      visibleRowActionDef() {
        let vm = this;
        return [{
          icon: 'delete',
          click(row) {
            vm.$confirm('确定删除?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              $axios.post('/sysDicPrivilege/deleteSysDicPrivilege', [row.uuid], {
                data: [{userLoginName: row.userLoginName}],
                logTemplate: '删除|层级可见性>特权管理员>管理员(#userLoginName#)'
              }).then((res) => {
                if (res.data === 'true') {
                  vm.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  vm.getData();
                }
              });
            }).catch(() => {});
          },
          name: '删除'
        }]
      },
      getData() {
        $axios.get('/sysDicPrivilege/getNoSysDicPrivilege').then((res) => {
          this.visibleData = res.data
        })
      },
      addOk() {
        let addForm = this.$refs['addUser'].uuids;
        let logData = this.$refs['addUser'].multipleSelection.map(item => {
          return {userLoginName: item.userLoginName}
        })
        $axios.post('/sysDicPrivilege/setSysDicPrivilege', addForm, {
          data: logData,
          logTemplate: '添加|层级可见性>特权管理员>管理员(#userLoginName#)'
        }).then((res) => {
          this.getData()
          this.addUserDialog = false
        })
      },
      addCancel() {
        this.addUserDialog = false
      }
    },
    components: {
      // SearchBox,
      VisibleAdd,
      RoleDetail
    }
  }
</script>
