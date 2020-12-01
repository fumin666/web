<template>
  <section class="auth-list">
    <s-row>
      <s-form :inline="true" :model="searchForm" class="search_form" label-width='100px'>
        <div>
          <s-form-item label="清单名称：">
            <s-input v-model="searchForm.condition.authName" @keyup.enter.native="searchboxBtn"></s-input>
          </s-form-item>
          <s-form-item label="组织机构：">
            <s-select v-model="searchForm.condition.departUuid" filterable clearable>
              <s-option
                v-for="(item, index) in authOrganOptions"
                :label="item.name"
                :value="item.value"
                :key="index">
              </s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="真实姓名：">
            <s-input v-model="searchForm.condition.userRealName" @keyup.enter.native="searchboxBtn"></s-input>
          </s-form-item>
          <s-form-item label="账号名称：">
            <s-input v-model="searchForm.condition.userLoginName" @keyup.enter.native="searchboxBtn"></s-input>
          </s-form-item>
          <s-form-item label="运维责任组：">
            <s-select v-model="searchForm.condition.groupUuid" filterable clearable>
              <s-option
                v-for="(item, index) in authOperOptions"
                :label="item.name"
                :value="item.value"
                :key="index">
              </s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="资产名称：">
            <s-input v-model="searchForm.condition.itcompName" @keyup.enter.native="searchboxBtn"></s-input>
          </s-form-item>
          <s-form-item label="IP地址：">
            <s-input v-model="searchForm.condition.itcompIp" @keyup.enter.native="searchboxBtn"></s-input>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button icon="magnifier" @click="searchboxBtn">查询</s-button>
        </div>
      </s-form>
    </s-row>
    <s-row class="margin-top-15">
      <s-col :span="12">
        <s-button icon="plus" @click="addAuthPolicyBtn">添加</s-button>
        <s-dropdown @on-click="batchHandler">
          <s-button icon="backup">
            批量操作<i class="iconfont icon-bottom"></i>
          </s-button>
          <s-dropdown-menu slot="list">
            <s-dropdown-item name="assImport"><i class="iconfont icon-import"></i> 资产授权清单导入</s-dropdown-item>
            <s-dropdown-item name="assExport"><i class="iconfont icon-export"></i> 资产授权清单导出</s-dropdown-item>
            <s-dropdown-item name="orgImport"><i class="iconfont icon-import"></i> 责任组授权清单导入</s-dropdown-item>
            <s-dropdown-item name="orgExport"><i class="iconfont icon-export"></i> 责任组授权清单导出</s-dropdown-item>
          </s-dropdown-menu>
        </s-dropdown>
      </s-col>
    </s-row>
    <!--真分页表格-->
    <RealPageTable :ajax-obj="ajaxObj"
                   @res-callback="resCallback">
      <!--<s-table-column type="selection" width="45" align="center"></s-table-column>-->
      <s-table-column v-for="(item, index) in authListHead" :label="item.value" :key="index" :prop="item.name">
      </s-table-column>
      <s-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看" @click="authView(scope.row)"></i>
          <i class="iconfont icon-edit" title="编辑" @click="authEdit(scope.row)"></i>
          <i class="iconfont icon-delete" title="删除" @click="authDelete(scope.row)"></i>
          <i class="iconfont icon-export" title="导出" @click="authExportList(scope.row)"></i>
        </template>
      </s-table-column>
    </RealPageTable>
    <!--查看授权清单-->
    <auth-view-dialog
      v-model="authViewFlag"
      v-if="authViewFlag"
      ref="viewList"
      :authViewRow="authViewRow">
    </auth-view-dialog>
    <!--添加/编辑授权弹窗-->
    <add-auth-policy
      v-model="addAuthPolicyFlag"
      v-if="addAuthPolicyFlag"
      :isEdit="isEdit"
      :authEditRow="authEditRow"
      @authPolicyList="authPolicyList">
    </add-auth-policy>
    <!--资产授权清单导入-->
    <import-dialog v-model="bloomImport" v-if="bloomImport" :uploadObj="uploadObj" :saveLog="true" :modelName="'授权策略'"
                   :downObj="downObj" @reload="getList" :fileTypes="['xls', 'xlsx']"></import-dialog>
    <!--组织机构授权清单导入-->
    <import-dialog v-model="bloomOrgImport" v-if="bloomOrgImport" :uploadObj="uploadObjOrg" :saveLog="true"
                   :modelName="'授权策略'" :downObj="downObjOrg" @reload="getList"
                   :fileTypes="['xls', 'xlsx']"></import-dialog>
  </section>
</template>

<script>
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  import $axios from 'sunflower-ajax'
  import Bus from '@/plugins/eventBus'
  import {Download} from 'sunflower-common-utils'
  import AuthViewDialog from './authDialog/AuthView'
  import ImportDialog from '@/components/importDialog/ImportDialog'
  import AddAuthPolicy from './authDialog/AddAuthPolicy';
  import {cloneDeep} from 'lodash';

  export default {
    data() {
      return {
        authListHead: [], // 动态列
        authOrganOptions: [], // 组织机构
        authOperOptions: [], // 运维责任组
        authListData: [],
        ajaxObj: {
          type: 'post',
          url: '/operationAuth/getOperationAuthList',
          params: {
            condition: {
              userRealName: '',
              userLoginName: '',
              departUuid: '',
              itcompName: '',
              itcompIp: '',
              groupUuid: '',
              authName: ''
            }
          }
        },
        searchForm: {
          currentPage: '',
          pageSize: '',
          condition: {
            userRealName: '',
            userLoginName: '',
            departUuid: '',
            itcompName: '',
            itcompIp: '',
            groupUuid: '',
            authName: ''
          }
        },
        addAuthPolicyFlag: false, // 添加授权策略弹窗
        isEdit: false,
        authViewFlag: false,
        bloomImport: false,
        bloomOrgImport: false,
        authViewRow: {},
        authEditRow: {},
        uploadObj: {
          url: 'operationAuth/importDeviceAuthList',
          type: 'post'
        },
        downObj: {
          url: '/authInfo/importTemplate',
          text: '资产授权导入模版'
        },
        uploadObjOrg: {
          url: 'operationAuth/importDeviceGroupAuthList ',
          type: 'post'
        },
        downObjOrg: {
          url: '/authInfo/departAuthImportTemplate',
          text: '责任组授权导入模版'
        },
        dbData: {},
        updownObj: {}
      }
    },

    computed: {
    },
    components: {
      RealPageTable,
      AuthViewDialog,
      ImportDialog,
      AddAuthPolicy
    },
    mounted() {
      this.getAuthHead();
      this.getSearchOption();
      this.getList();
      Bus.$on('getAuthList', () => {
        this.getList();
      });
    },
    methods: {
      getSearchOption() { // 获取搜索条件下拉
        $axios.get('/operationAuth/getSearchConditions').then(({data}) => {
          if (data) {
            this.authOrganOptions = data.departments; // 组织机构下拉数据
            this.authOperOptions = data.groups; // 运维责任组
            let authOrganOptions = this.authOrganOptions.map(v => {
              return v.value
            })
            let authOperOptions = this.authOperOptions.map(v => {
              return v.value
            })
            if (authOrganOptions.indexOf(this.searchForm.condition.departUuid) === -1) {
              this.searchForm.condition.departUuid = ''
            }
            if (authOperOptions.indexOf(this.searchForm.condition.groupUuid) === -1) {
              this.searchForm.condition.groupUuid = ''
            }
          }
        });
      },
      getAuthHead() { // 获取动态列
        let vm = this;
        $axios.post('/operationAuth/getDynamicAuthList', vm.searchForm).then((res) => {
          if (res.data.length > 0) {
            vm.authListHead = res.data;
          }
        });
      },
      authPolicyList() {
        this.getSearchOption()
        this.getList()
      },
      getList() {
        let params = {
          userRealName: this.searchForm.condition.userRealName,
          userLoginName: this.searchForm.condition.userLoginName,
          departUuid: this.searchForm.condition.departUuid,
          itcompName: this.searchForm.condition.itcompName,
          itcompIp: this.searchForm.condition.itcompIp,
          groupUuid: this.searchForm.condition.groupUuid,
          authName: this.searchForm.condition.authName
        };
        this.ajaxObj.params.condition = cloneDeep(params);
      },
      resCallback(data) {
        return data
      },
      authView(row) {
        this.authViewRow = row;
        this.authViewFlag = true;
      },
      authEdit(row) {
        this.isEdit = true;
        this.addAuthPolicyFlag = true;
        this.authEditRow = row;
      },
      authDelete(row) {
        this.$confirm('此操作将永久删除该清单，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/operationAuth/judgeBeforedeleteAuthInfo/${row.uuid}`, {
            data: [row],
            logTemplate: '删除|授权策略管理>授权策略(#authName#)'
          }).then(({data}) => {
            if (data.state) {
              $axios.get(`/operationAuth/deleteAuthInfo/${row.uuid}`).then(({data}) => {
                if (data.state === true) {
                  this.$message({showClose: true, message: data.errormsg, type: 'success'});
                  this.getList();
                  this.getSearchOption();
                } else {
                  this.$message({showClose: true, message: data.errormsg, type: 'error'});
                }
              })
            } else {
              this.$message({showClose: true, message: data.errormsg, type: 'error'});
            }
          })
        }).catch(() => {
        });
      },
      authExportList(row) {
        Download(`/operationAuth/exportSingleAuth/${row.uuid}`);
      },
      searchboxBtn() {
        this.ajaxObj.params.currentPage = 1
        this.authListHead = []
        this.getAuthHead();
        this.getList();
      },
      addAuthPolicyBtn() {
        this.isEdit = false
        this.addAuthPolicyFlag = true
      },
      batchHandler(name) {
        switch (name) {
          case 'assImport':
            this.authImport();
            break;
          case 'assExport':
            this.authExport();
            break;
          case 'orgImport':
            this.authOrgImport();
            break;
          case 'orgExport':
            this.authOrgExport();
            break;
        }
      },

      authExport() {
        Download(`/operationAuth/exportOperationAuthDevice`, {
          logTemplate: '导出|授权策略管理>授权策略(DeviceAuthList.xls)'
        });
      },

      authOrgExport() {
        Download('/operationAuth/exportOperationAuthDeviceGroup', {
          logTemplate: '导出|授权策略管理>授权策略(DepartAuthList.xls)'
        });
      },

      authImport() {
        this.bloomImport = true;
      },

      authOrgImport() {
        this.bloomOrgImport = true;
      }
    },

    watch: {}
  }
</script>

<style>
  .auth-list .search-box .s-input {
    width: 185px;
  }

  .auth-list .handler-btns {
    margin-bottom: 10px;
  }

  .auth-list .search-box {
    padding: 15px 15px 0 15px;
    box-sizing: border-box;
    border-radius: 3px;
  }

  .auth-list .s-steps {
    margin: 20px;
  }

  .auth-list .show-del-button .icon-delete {
    display: none;
  }

  .auth-list > .sc-table {
    margin-top: -32px;
    min-height: 300px
  }

  .auth-list > .sc-table > div.tool-bar {
    justify-content: flex-end;
  }
</style>
