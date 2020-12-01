<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-08 14:21:43
 * @LastEditTime: 2019-09-25 17:53:34
 * @LastEditors: Please set LastEditors
 -->
<!-- ITSM角色 -->
<template>
  <div>
    <s-form ref="searchBox" :inline="true" :model="searchForm" label-width="70px" class="search_form" style="margin: 10px 0;">
      <div>
        <s-form-item label="角色名称:" prop="roleName">
          <s-input @keyup.enter.native="search" v-model="searchForm.roleName"></s-input>
        </s-form-item>
        <s-form-item label="权限:" prop="authorityName">
          <s-input @keyup.enter.native="search" v-model="searchForm.authorityName"></s-input>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" title="查询" @click="search()">查询</s-button>
      </div>
    </s-form>
    <s-table-page
      ref="multipleTable"
      :data="roleInfoTablData"
      :max-height=550
      style="width:100%"
      @selection-change="handleSelectionChange"
    >
      <s-table-column prop="roleName" label="角色名称"></s-table-column>
      <s-table-column prop="ownerTypeStr" label="角色归属" ></s-table-column>
      <s-table-column label="操作">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" @click="editRoleInfo(scope.row)" title="查看"></i>
          <i class="iconfont icon-user" title="查看角色" @click="userShow(scope.row)"> </i>
          <i class="iconfont icon-delete" title="删除" v-if="showDelete(scope.row)" @click="deleteRoleInfo(scope.row)" ></i>
        </template>
      </s-table-column>
    </s-table-page>

    <!--查看角色信息-->
    <s-dialog
      v-model="showRoleInfo"
      v-if="showRoleInfo"
      width="700px"
      title="查看角色信息"
      append-to-body>
      <role-info-dialog :editData="rowData" ref="showRoleInfo"></role-info-dialog>
    </s-dialog>

    <!--查看人员-->
    <s-dialog
      v-model="peopleDetail"
      v-if="peopleDetail"
      width="900px"
      title="查看角色人员"
      append-to-body>
      <s-table-page


        :header-search='getSearchDef()'
        :data="rolePeopleList">
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
  import RoleInfoDialog from '../dialog/RoleInfoDialog.vue';
  // import PermissionsDialog from '../dialog/PermissionsDialog.vue';
  import $axios from 'sunflower-ajax';
  // import SearchBox from '@/components/tableCom/src/SearchBox';
  import {multiSearch} from 'sunflower-common-utils';
  import {cloneDeep} from 'lodash';
  export default {
    data() {
      return {
        roleInfoData: [],
        roleInfoTablData: [],
        changeRoleInfo: false,
        roleInfoSelections: [],
        showRoleInfo: false,
        addRoleInfo: false,
        rowData: {},
        permissionsData: [],
        permissionSelections: [],
        showPermissionDialog: false,
        addPermissionDialog: false,
        permissionData: {},
        peopleDetail: false,
        rolePeopleList: [],
        searchForm: {
          roleName: '',
          authorityName: ''
        },
        flag: false
      }
    },
    components: {
      RoleInfoDialog
      // PermissionsDialog,
      // SearchBox
    },
    created() {
      this.getRoleInfo();
    },
    methods: {
      userShow(row) {
        this.peopleDetail = true
        $axios.get('/iamRoleInfo/getUserByRoleUuid/' + row.uuid).then((res) => {
          this.rolePeopleList = res.data
        });
      },
      getSearchDef() {
        return {
          width: 6,
          offset: 18,
          placeholder: '请输入查询内容',
          searchProps: ['userRealName', 'userLoginName']
        }
      },
      getRoleInfo() {
        $axios.post('/itilWorkflowConfig/getItilRoleList').then((res) => {
          if (res.status === 200) {
            this.roleInfoData = res.data;
            this.roleInfoTablData = cloneDeep(res.data);
          }
        })
      },
      handleSelectionChange(selections) {
        this.roleInfoSelections = selections;
      },
      editRoleInfo(row) {
        this.rowData = row;
        this.showRoleInfo = true;
      },
      showDelete(row) {
        if (row.isDefault === 1) {
          return false;
        } else {
          return true;
        }
      },
      deleteRoleInfo(row) {
        let uuid = row.uuid;
        this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.get('/itilWorkflowConfig/deleteItilRoleByUuid/' + uuid).then(res => {
            if (res.status === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getRoleInfo();
            } else {
              this.$message({
                message: '删除失败',
                type: 'error'
              })
            }
          })
        }).catch(() => {});
      },
      search() {
        let form = Object.assign({}, {}, this.searchForm);
        this.roleInfoTablData = multiSearch(form, this.roleInfoData);
        this.flag = false
      },
      hideHandler() {
        this.flag = !this.flag
      }
    }
  }
</script>
