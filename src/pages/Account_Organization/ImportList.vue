<template>
  <section id="importLists">
        <s-button icon="plus" @click="showImportDialog">添加</s-button>
        <s-button icon="batch-del" @click="batchDelete">批量删除</s-button>
        <s-button style="float:right" icon="back-square" @click="backPrePage"></s-button>
        <s-form
          :inline="true"
          class="search_form"
          label-width='105px'
          style="margin:10px 0"
          :model="searchForm">
          <div>
            <s-form-item label="策略名称：">
              <s-input v-model="searchForm.taskName"></s-input>
            </s-form-item>
            <s-form-item label="远程DN：">
              <s-input v-model="searchForm.remoteDn"></s-input>
            </s-form-item>
            <s-form-item label="同步模式：">
              <s-select v-model="searchForm.taskModel" clearable>
                <s-option label="AD域组织结构同步" :value="0" v-if="$route.params.modelName === 'AD'"></s-option>
                <s-option label="AD域安全组同步" :value="1" v-if="$route.params.modelName === 'AD'"></s-option>
                <s-option label="LDAP组织结构同步" :value="2"  v-if="$route.params.modelName === 'LDAP'"></s-option>
                <s-option label="LDAP安全组同步" :value="3"  v-if="$route.params.modelName === 'LDAP'"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="同步方式：">
              <s-select v-model="searchForm.taskType" clearable>
                <s-option label="手动" :value="0"></s-option>
                <s-option label="自动" :value="1"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="最后执行时间：">
              <s-date-picker
                type="datetime"
                :value-format-flag="true"
                placeholder="请选择日期时间"
                v-model="searchForm.lastSyncDate" value-format="yyyy-MM-dd HH:mm:ss">
              </s-date-picker>
            </s-form-item>
          </div>
          <div class="search_btn">
            <s-button icon="magnifier" @click="searchFilter">查询</s-button>
          </div>
        </s-form>
    <s-table-page
      :data="importLists"
      :row-actions="getRowActionsDef()"
      actions-col-width="150"
      @selection-change="listSelectionChange"
      >
      <s-table-column type="selection"></s-table-column>
      <s-table-column label="策略名称" prop="taskName"></s-table-column>
      <s-table-column label="远程DN" prop="remoteDn"></s-table-column>
      <s-table-column label="同步模式">
        <template slot-scope="scope">
          <span v-text="taskModelArr[scope.row.taskModel]"></span>
        </template>
      </s-table-column>
      <s-table-column label="同步方式">
        <template slot-scope="scope">
          <span v-text="taskTypeArr[scope.row.taskType]"></span>
        </template>
      </s-table-column>
      <s-table-column label="最后执行时间" prop="lastSyncDate"></s-table-column>
      <s-table-column label="备注" prop="remark"></s-table-column>
    </s-table-page>

    <!--AD域导入-->
    <ad-import-dialog
      v-model="adImportDialog"
      v-if="adImportDialog"
      :transData="transData"
      @adImportSuccess="_adImportSuccess"></ad-import-dialog>

    <!--LDAP域导入-->
    <ldap-import-dialog
      v-model="ldapImportDialog"
      v-if="ldapImportDialog"
      :transData="transData"
      @ldapImportSuccess="_ldapImportSuccess"></ldap-import-dialog>

  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {batchUuid} from 'sunflower-common-utils'
  // import searchBox from '@/components/tableCom/src/SearchBox'
  import adImportDialog from '@/pages/Account_Organization/ADImportDialog'
  import ldapImportDialog from '@/pages/Account_Organization/LDAPImportDialog'

  export default{
    data() {
      return {
        importLists: [],                 // 列表
        importListsOrigin: [],                 // 列表原始数据(用于筛选)
        listsSelection: [],              // 列表多选
        taskModelArr: ['AD域组织结构同步', 'AD域安全组同步', 'LDAP组织结构同步', 'LDAP安全组同步'],       // 同步模式列表
        taskTypeArr: ['手动', '自动'],      // 同步方式,
        transData: {},
        searchForm: {
          taskName: '',
          remoteDn: '',
          taskModel: '',
          taskType: '',
          lastSyncDate: null
        },
        showSearch: false,
        adImportDialog: false,
        ldapImportDialog: false
      }
    },
    components: {
      // searchBox,
      adImportDialog,
      ldapImportDialog
    },
    methods: {
      // 表内操作列功能初始化
      getRowActionsDef() {
        let vm = this;
        return [{
          name: '编辑',
          icon: 'edit',
          click: (row) => {
            if (vm.$route.params.modelName === 'AD') {
              let data = {
                initStep: 1,
                rowData: row
              }
              vm.transData = data
              vm.adImportDialog = true
            } else {
              let data = {
                initStep: 1,
                rowData: row
              }
              vm.transData = data
              vm.ldapImportDialog = true
            }
          }
        }, {
          name: '立即执行',
          icon: 'start',
          click: (row) => {
            vm.rightRun(row.uuid, row.taskName)
          }
        }, {
          name: '删除',
          icon: 'delete',
          click: (row) => {
            vm.singleDeleteList([row.uuid], [{taskName: row.taskName}])
          }
        }]
      },
      // 返回前页
      backPrePage() {
        this.$router.push({path: '/AccountManage/orgTopo', query: {tab: 'pane2'}})
      },
      // 搜索过滤
      searchFilter() {
        let filterArr = []
        let allKeyEmpty = 0
        let keys = [];
        for (let key in this.searchForm) {
          if (this.searchForm[key] === '' || this.searchForm[key] === null) {
            allKeyEmpty++
          } else {
            // 存入所有需要过滤的key
            keys.push(key);
          }
        }
        // 全部都为空值，不筛选
        if (allKeyEmpty === 5) {
          filterArr = this.importListsOrigin;
        } else {
          for (let i = 0, length = this.importListsOrigin.length; i < length; i++) {
            if (this.checkDataByKeys(keys, this.importListsOrigin[i])) {
              filterArr.push(this.importListsOrigin[i]);
            }
          }
        }
        this.importLists = filterArr
      },
      checkDataByKeys(keys, data) {
        for (let i = 0, length = keys.length; i < length; i++) {
            if (!RegExp(this.searchForm[keys[i]]).test(data[keys[i]])) {
              return false;
            }
        }
        return true;
      },
      // 列表数据初始化(刷新)
      initImportList() {
        if (this.$route.params.modelName === 'AD') {
          $axios.post('/sysLdapSync/listAd').then(res => {
            let resData = res.data;
            if (resData && resData instanceof Array) {
              this.importLists = resData
              this.importListsOrigin = resData
            }
          })
        } else {
          $axios.post('/sysLdapSync/listLdap').then(res => {
            let resData = res.data
            if (resData && resData instanceof Array) {
              this.importLists = resData
              this.importListsOrigin = resData
            }
          })
        }
      },
      // 列表多选
      listSelectionChange(val) {
        this.listsSelection = val
      },
      // 添加策略
      showImportDialog() {
        if (this.$route.params.modelName === 'AD') {
          this.transData = {
            initStep: 0,
            rowData: {}
          }
          this.adImportDialog = true
        } else {
          this.transData = {
            initStep: 0,
            rowData: {}
          }
          this.ldapImportDialog = true
        }
      },
      // AD 导入成功
      _adImportSuccess() {
        this.initImportList()
      },
      // ldap 导入成功
      _ldapImportSuccess() {
        this.initImportList()
      },
      // 立即执行
      rightRun(syncUuid, taskName) {
        this.$confirm('确定发起该策略？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let logTemplateText = ''
          if (this.$route.params.modelName === 'AD') {
            logTemplateText = '立即执行|人员管理>AD域导入(#taskName#)'
          } else {
            logTemplateText = '立即执行|人员管理>LDAP域导入(#taskName#)'
          }
          $axios.get(`/sysLdapSync/executeStrategy/${syncUuid}`, {
            data: [{taskName: taskName}],
            logTemplate: logTemplateText
          }).then(res => {
            let resData = res.data
            if (resData) {
              this.$message({
                type: 'info',
                message: resData
              })
            }
          })
        }).catch(() => {})
      },
      // 删除请求
      deleteList(deleteArr, logData) {
        let logTemplateText = ''
        if (this.$route.params.modelName === 'AD') {
          logTemplateText = '删除|人员管理>AD域导入(#taskName#)'
        } else {
          logTemplateText = '删除|人员管理>LDAP域导入(#taskName#)'
        }
        $axios.post('/sysLdapSync/deleteStrategy', deleteArr, {
          data: logData,
          logTemplate: logTemplateText
        }).then(res => {
          let resData = res.data
          if (resData === 'true') {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.initImportList()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败，请重试！'
            })
          }
        })
      },
      // 单个删除
      singleDeleteList(deleteArr, logData) {
        this.$confirm('确定删除该策略？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteList(deleteArr, logData)
        }).catch(() => {})
      },
      // 批量删除
      batchDelete() {
        if (this.listsSelection.length === 0) {
          this.$message({
            type: 'warning',
            message: '请至少选择一项要删除的策略！'
          })
        } else {
          let deleteArr = batchUuid('uuid', this.listsSelection)
          let logData = this.listsSelection.map(item => {
            return {taskName: item.taskName}
          })
          this.$confirm('确定删除所选策略？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteList(deleteArr, logData)
          }).catch(() => {})
        }
      }
    },
    created() {
      this.initImportList()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #importLists
    margin-top 15px
</style>
