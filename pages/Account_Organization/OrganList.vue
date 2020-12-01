/**
* Created by alex on 2018/10/23.
*/
<template>
  <div>
    <s-form :model="searchForm" :inline="true" ref="searchForm" class="search_form" label-width='90px' style="margin:10px 0">
      <div>
        <s-form-item label="机构名称：" prop="departName">
          <s-input v-model="searchForm.departName" @keyup.enter.native="searchByEnter"></s-input>
        </s-form-item>
        <s-form-item label="上级机构：" prop="departParentName">
          <s-select v-model="searchForm.departParentName" filterable placeholder="请选择" clearable>
            <s-option v-for="item in departParentsOption" :label="item.departName" :value="item.departName" :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="机构负责人：" prop="departLeaderName">
          <s-input v-model="searchForm.departLeaderName" @keyup.enter.native="searchByEnter"></s-input>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" @click="searchByEnter()">查询</s-button>
      </div>
    </s-form>
    <div class="organ-btn-group">
      <s-button icon="plus" @click="listAdd" v-noBtn="'accountManage_addOrganization'">添加</s-button>
      <s-button icon="import" @click="orgImport" v-noBtn="'accountManage_importOrganization'">导入</s-button>
      <s-button icon="export" @click="orgExport" v-noBtn="'accountManage_exportOrganization'">导出</s-button>
      <div class="radio-box fr">
        <s-button-group>
          <s-button icon="structure" class="group-button" :class="{hoverbutton:!isActive}" @click="showModel('graph')" title="图形模式"></s-button>
          <s-button icon="list" class="group-button" :class="{hoverbutton:isActive}" @click="showModel('list')" title="列表模式"></s-button>
        </s-button-group>
      </div>
    </div>
    <s-table-page :data="tableData"  id="organListTable">
      <s-table-column prop="departName" label="机构名称"></s-table-column>
      <s-table-column prop="departCode" label="机构编号"></s-table-column>
      <s-table-column prop="departParentName" label="上级机构"></s-table-column>
      <s-table-column prop="departLeaderName" label="机构负责人">
      </s-table-column>
      <s-table-column prop="departPhone" label="电话"></s-table-column>
      <s-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <button-set :scope="scope" :btnData="btnData()" :option="tableOption"></button-set>
        </template>
      </s-table-column>
    </s-table-page>
    <!--导入-->
    <import-dialog v-if="importOrgDialog" v-model="importOrgDialog" :upload-obj="uploadObj" :down-obj="downObj" @reload="getList" :fileTypes="['xls', 'xlsx']">
    </import-dialog>
    <!--新增-->
    <s-dialog v-model="orgAddDialog" v-if="orgAddDialog" width="650px" title="新增">
      <org-list-add ref="orgAddDialog"></org-list-add>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addOk">确定</s-button>
        <s-button type="cancel" @click="orgAddDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--编辑-->
    <s-dialog v-model="orgEditDialog" v-if="orgEditDialog" width="650px" title="编辑">
      <org-list-add :editListObj="editData" ref="orgEditDialog"></org-list-add>
      <template slot="footer" class="dialog-footer">
        <s-button @click="editOk">确定</s-button>
        <s-button type="cancel" @click="orgEditDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--查看机构-->
    <s-dialog v-model="viewOrgDialog" v-if="viewOrgDialog" width="850px" title="管理机构">
      <org-list-view :data="viewOrgList" :type="'org'"></org-list-view>
    </s-dialog>
    <!--查看人员-->
    <s-dialog v-model="viewPeopleDialog" v-if="viewPeopleDialog" width="850px" title="管理人员">
      <org-list-view :data="viewPeopleList" :type="'staff'"></org-list-view>
    </s-dialog>
    <!--查看-->
    <s-dialog v-model="viewDialog" v-if="viewDialog" width="700px" title="查看">
      <view-module :data="orgViewList"></view-module>
    </s-dialog>
  </div>
</template>

<script type="text/babel">
  // import SearchBox from '@/components/tableCom/src/SearchBox'
  import mixin from '@/components/graph/OrgGraphMixin'
  import $axios from 'sunflower-ajax'
  import viewModule from '@/components/commonView/DialogView'
  import orgListAdd from './OrganAddForList'
  import orgListView from './OrganViewList'
  import {multiSearch} from 'sunflower-common-utils';
  import {cloneDeep} from 'lodash';
  import importDialog from '@/components/importDialog/ImportDialog';
  import buttonSet from '@/components/tableHandleHidden/buttonSet';

  export default {
    mixins: [mixin],
    data() {
      return {
        searchForm: {
          departName: '',
          departParentName: '',
          departLeaderName: ''
        },
        departParentsOption: [], // 上级机构的集合
        orgList: [],
        tableData: [],
        orgViewList: [],
        model: true,
        viewOrgList: [],
        viewPeopleList: [],
        orgAddDialog: false,
        orgEditDialog: false,
        orgViewDialog: false,
        viewOrgDialog: false,
        viewPeopleDialog: false,
        viewDialog: false,
        editData: [],
        uploadUrl: `${$axios.basePath()}departmentInfo/importDepartInfo`,
        dataTemplate: {
          departName: '机构名称',
          departParentName: '上级机构',
          departCode: '机构编号',
          departLeaderName: '机构负责人',
          departPlace: '机构地址',
          departPhone: '电话',
          remark: '备注'
        },
        tableOption: {// 操作栏配置项
          isHidden: true, // 是否开启隐藏
          appendId: '#organListTable',
          showNum: 3// 超过3ge隐藏
        }
      };
    },
    components: {
      // SearchBox,
      orgListAdd,
      orgListView,
      viewModule,
      importDialog,
      buttonSet
    },
    created() {
      this.getList()
      this.getDepartParentsData()
    },
    methods: {
      // 操作栏按钮
      btnData() {
        let vm = this;
        return [
          {
            icon: 'eye',
            name: '查看',
            v_noBtn: 'accountManage_viewOrganization',
            handler: function (row, scope) {
              vm.view(scope.row)
            }
          },
          {
            icon: 'edit',
            name: '编辑',
            v_noBtn: 'accountManage_editOrganization',
            handler: function (row, scope) {
              vm.edit(scope.row)
            }
          },
          {
            icon: 'delete',
            name: '删除',
            v_noBtn: 'accountManage_delOrganization',
            handler: function (row, scope) {
              vm.del(scope.row)
            },
            v_if: function (row, scope) {
              return scope.row.uuid !== 'c12704bbea9847d1b745e9e5d33d8731'
            }
          },
          {
            icon: 'organ',
            name: '管理机构',
            v_noBtn: 'accountManage_viewManageOrganization',
            handler: function (row, scope) {
              vm.viewOrganzation(scope.row.uuid)
            }
          },
          {
            icon: 'config-account',
            name: '管理人员',
            v_noBtn: 'accountManage_viewManageUser',
            handler: function (row, scope) {
              vm.viewPeople(scope.row.uuid)
            }
          }

        ]
      },
      getDepartParentsData() {
        $axios.get('/departmentInfo/getAllDepart').then((res) => {
          if (res.data) {
            this.departParentsOption = res.data
          }
        })
      },
      getList() {
        $axios.get('/departmentInfo/queryAllDepartmentInfo').then((res) => {
          if (res.data) {
            this.orgList = res.data.departmentList
            this.tableData = cloneDeep(res.data.departmentList);
          }
        })
      },
      searchByEnter() {
        let form = Object.assign({}, {}, this.searchForm);
        this.tableData = multiSearch(form, this.orgList);
      },
      listAdd() {
        this.orgAddDialog = true
      },
      addOk() {
        let form = this.$refs['orgAddDialog'].departmentinfo
        $axios.post(`/departmentInfo/codeValidate`, {
          code: form.departCode,
          uuid: form.departParentUuid
        }).then((res) => {
          if (res.data === 'true') {
            this.$message({
              type: 'error',
              message: '该机构编号已经存在'
            });
          } else {
            this.$refs['orgAddDialog'].$refs['departmentinfo'].validate((valid) => {
              if (valid === false) {
                return false;
              }
              $axios.post('/departmentInfo/saveDepartInfo', form, {
                data: [{departName: form.departName}],
                logTemplate: '添加|组织机构管理>组织机构(#departName#)'
              }).then((res) => {
                if (res.data.uuid) {
                  this.$message.success('保存成功')
                  this.getList()
                  this.orgAddDialog = false
                }
              });
            })
          }
        })
      },
      editOk() {
        let form = this.$refs['orgEditDialog'].departmentinfo
        if (form.departCode !== this.editData.departCode) {
          $axios.post(`/departmentInfo/codeValidate`, {
            code: form.departCode,
            uuid: form.departParentUuid
          }).then((res) => {
            if (res.data === 'true') {
              this.$message({
                type: 'error',
                message: '该机构编号已经存在'
              });
            } else {
              this.ajaxEdit(form)
            }
          })
        } else {
          this.ajaxEdit(form)
        }
      },
      ajaxEdit(form) {
        this.$refs['orgEditDialog'].$refs['departmentinfo'].validate((valid) => {
          if (valid === false) {
            return false;
          }
          $axios.post('/departmentInfo/updateDepartmentInfo', form, {
            data: [{departName: form.departName}],
            logTemplate: '编辑|组织机构管理>组织机构(#departName#)'
          }).then((res) => {
            if (res.data !== 'success') {
              this.$message.success('保存成功')
              this.getList()
              this.orgEditDialog = false
            }
          });
        })
      },
      viewOrganzation(uuid) {
        $axios.get(`departmentInfo/getAllSubDep/${uuid}`).then((res) => {
          this.viewOrgList = res.data
          this.viewOrgDialog = true
        })
      },
      viewPeople(uuid) {
        $axios.post('departmentInfo/getDepartIncludeUsers', {departUuid: uuid}).then((res) => {
          this.viewPeopleList = res.data.userList
          this.viewPeopleDialog = true
        })
      },
      view(row) {
        this.viewDialog = true
        this.orgViewList = []
        let keyArr = Object.keys(row)
        for (let key in this.dataTemplate) {
          if (keyArr.indexOf(key) > -1) {
            this.orgViewList.push({name: this.dataTemplate[key], content: row[key]})
          }
        }
      },
      edit(row) {
        this.editData = row;
        this.orgEditDialog = true
      },
      del(row) {
        if (row.childDepart > 0) {
          this.$message.error('该组织机构包含下级机构,无法删除！');
          return false;
        }
        if (row.childUser > 0) {
          this.$message.error('该组织机构内包含人员,无法删除！');
          return false;
        }
        this.$confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get('/departmentInfo/deleteDepartmentInfo/' + row.uuid, {
            data: [{departName: row.departName}],
            logTemplate: '删除|组织机构管理>组织机构(#departName#)'
          }).then((res) => {
            if (res.data.result === 'success') {
              this.$message({type: 'success', message: '删除成功'});
              this.getList()
            } else {
              this.$message({type: 'error', message: res.data.err});
            }
          });
        }).catch(() => {})
      }
    }
  }
</script>
