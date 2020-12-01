<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-08 14:21:43
 * @LastEditTime: 2019-04-08 14:21:43
 * @LastEditors: your name
 -->
<!--审批映射-->
<template>
  <div>
    <s-row>
      <s-col :span="22">
        <s-button @click="addApprovalMapping" icon="plus">添加</s-button>
        <s-button @click="importBatch" icon="import">导入</s-button>
        <s-button @click="exportBatch" icon="export">导出</s-button>
        <s-button @click="delBatch" icon="batch-del">批量删除</s-button>
      </s-col>
    </s-row>
    <s-form ref="searchBox" :inline="true" :model="searchForm" label-width="80px" class="search_form" style="margin: 10px 0;">
      <div>
        <s-form-item label="归属流程:" prop="ownerType">
          <s-select v-model="searchForm.ownerType" style="width: 100%" @change="changeOwnType" filterable clearable>
            <s-option v-for="(value, key, index) in ascription" :key="index" :value="key"
                      :label="value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item prop="approveType" label="审批类型:">
          <s-select v-model="searchForm.approveType" style="width: 100%" @change="changeApproveType" filterable clearable>
            <s-option v-for="item in approveTypeArr" :label="item.name" :value="item.value" :key="item.value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item prop="approveLink" label="审批阶段:">
          <s-select v-model="searchForm.approveLink" style="width: 100%" filterable clearable>
            <s-option v-for="item in approveLinkArr" :label="item.name" :value="item.value" :key="item.value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="分类一级:" prop="categoryFirstName">
          <s-select v-model="searchForm.categoryFirstName" style="width: 100%" @change="changeCF" filterable clearable>
            <s-option v-for="(item, index) in categoryFirstArr" :key="index" :value="item.name"
                      :label="item.name"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="分类二级:" prop="categorySecondName">
          <s-select v-model="searchForm.categorySecondName" style="width: 100%" @change="changeCS" filterable clearable>
            <s-option v-for="(item, index) in categorySecondArr" :key="index" :value="item.categoryName"
                      :label="item.categoryName"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="分类三级:" prop="categoryThirdName">
          <s-select v-model="searchForm.categoryThirdName" style="width: 100%" filterable clearable>
            <s-option v-for="(item, index) in categoryThirdArr" :key="index" :value="item.categoryName"
                      :label="item.categoryName"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item prop="userRealName" label="姓名:">
          <s-select v-model="searchForm.userRealName" style="width: 100%" filterable clearable>
            <s-option v-for="item in userLoginNameArr" :label="item.userRealName" :value="item.userRealName" :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item prop="userRoleName" label="角色:">
          <s-select v-model="searchForm.userRoleName" style="width: 100%" clearable filterable>
            <s-option v-for="item in userRoleNameArr" :label="item.roleName" :value="item.roleName" :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" title="查询" @click="search()">查询</s-button>
      </div>
    </s-form>


    <s-table-page
      ref="multipleTable"
      :data="tableData"
      style="width:100%"
      :max-height=550
      @selection-change="handleSelectionChange"
    >
      <s-table-column type="selection" :selectable="selectQuestion" ></s-table-column>
      <s-table-column prop="approveLink" label="审批阶段" >
        <template slot-scope="scope">
          {{scope.row.approveLink | filterApproveLink}}
        </template>
      </s-table-column>
      <s-table-column prop="approveType" label="审批类型" >
        <template slot-scope="scope">
          {{scope.row.approveType | filterApproveType}}
        </template>
      </s-table-column>
      <s-table-column prop="approveSort" label="审批顺序" ></s-table-column>
      <s-table-column prop="ownerType" label="归属流程">
        <template slot-scope="scope">
          {{scope.row.ownerType | filterOwnerType}}
        </template>
      </s-table-column>
      <s-table-column prop="userRealName" label="姓名" ></s-table-column>
      <s-table-column prop="userRoleName" label="角色" ></s-table-column>
      <s-table-column prop="categoryFirstName" label="分类一级" ></s-table-column>
      <s-table-column prop="categorySecondName" label="分类二级" ></s-table-column>
      <s-table-column prop="categoryThirdName" label="分类三级" ></s-table-column>
      <s-table-column prop="groupName" label="支持组名称" ></s-table-column>
      <s-table-column prop="companyName" label="公司名称" ></s-table-column>
      <s-table-column prop="activeStatus" label="状态" >
        <template slot-scope="scope">
          <s-switch v-model="scope.row.activeStatus" size="small" :active-value="1" :inactive-value="0" @change="changeState(scope.row)"></s-switch>
        </template>
      </s-table-column>
      <s-table-column label="操作" width="110">
        <template slot-scope="scope">
          <i class="iconfont icon-edit" title="修改" @click="changeHandler(scope.row)" v-if="scope.row.ownerType !== 6"></i>
          <i class="iconfont icon-delete" title="删除" @click="delHandler(scope.row)" v-if="scope.row.ownerType !== 6"></i>
        </template>
      </s-table-column>
    </s-table-page>

    <!--新增审批映射弹窗-->
    <s-dialog
      v-model="addApprovalMappingDialog"
      v-if="addApprovalMappingDialog"
      width="1000px"
      title="添加"
      append-to-body>
      <s-scrollbar wrap-style="height: 400px;">
        <approval-mapping-dialog ref="addApprovalMappings"></approval-mapping-dialog>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveChange">保存</s-button>
        <s-button type="cancel" @click="addApprovalMappingDialog = false">取消</s-button>
      </template>
    </s-dialog>

    <!--修改审批映射弹窗-->
    <s-dialog
      v-model="changeApprovalMapping"
      v-if="changeApprovalMapping"
      width="900px"
      title="修改"
      append-to-body>
      <s-scrollbar wrap-style="height: 500px;">
        <approval-mapping-dialog :editData="rowData" ref="editApprovalMapping"></approval-mapping-dialog>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveEdit">保存</s-button>
        <s-button type="cancel" @click="changeApprovalMapping = false">取消</s-button>
      </template>
    </s-dialog>

    <!--导入-->
    <import-dialog v-if="importDialogFlag" v-model="importDialogFlag"
                   :upload-obj="uploadObj" :down-obj="downObj" @reload="getData" :fileTypes="['xls', 'xlsx']"></import-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import approvalMappingDialog from '../dialog/ApprovalMappingDialog.vue';
  import importDialog from '@/components/importDialog/ImportDialog';
  import { Download, multiSearch } from 'sunflower-common-utils';
  // import SearchBox from '@/components/tableCom/src/SearchBox';
  import {cloneDeep} from 'lodash';
  export default {
    data() {
      return {
        dataList: [],
        tableData: [],
        changeApprovalMapping: false,
        addApprovalMappingDialog: false,
        rowData: {},
        selections: [],
        importDialogFlag: false,
        searchForm: {
          ownerType: '',
          approveType: '',
          approveLink: '',
          categoryFirstName: '',
          categorySecondName: '',
          categoryThirdName: '',
          userRealName: '',
          userRoleName: ''
        },
        ascription: {},
        categoryFirstArr: [],
        categorySecondArr: [],
        categoryThirdArr: [],
        approveTypeArr: [],
        approveLinkArr: [],
        userLoginNameArr: [],
        userRoleNameArr: [],
        owerType: '',
        categoryFirst: '',
        categorySecond: '',
        categoryThird: '',
        flag: false
      }
    },
    components: {
      approvalMappingDialog,
      importDialog
      // SearchBox
    },
    methods: {
      handleSelectionChange(selections) {
        this.selections = selections;
      },
      selectQuestion(row, index) {
        if (row.ownerType === 6) {
          return false
        } else {
          return true
        }
      },
      importBatch() {
        this.uploadObj = {
          type: 'post',
          url: '/itilWorkflowConfig/importApproveMapping'
        };
        this.downObj = {
          text: '批量导入审批映射模板',
          url: '/itilWorkflowConfig/approveMappingImprotTemplate'
        };
        this.importDialogFlag = true;
      },
      exportBatch() {
        if (this.selections.length === 0) {
          this.$message({showClose: true, message: '请先选择审批映射', type: 'info'});
          return;
        }
        let uuidStr = this.selections.map(item => {
          return item.uuid;
        }).join(',');
        Download(`/itilWorkflowConfig/exportApproveMapping/${uuidStr}`, {
          data: this.selections,
          logTemplate: '导出|审批映射>审批映射(ApproveMapping.xls)'
        });
      },
      changeState(row) {
        let msg = {
          activeStatus: row.activeStatus,
          uuid: row.uuid
        }
        $axios.post('/itilWorkflowConfig/saveOrUpdateItilApproveMapping', msg).then((res) => {
          if (res.status === 200) {
            this.$message({
              message: '更新成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: '更新失败',
              type: 'error'
            });
          }
        });
      },
      getData() {
        $axios.post('/itilWorkflowConfig/getItilApproveMappingList').then((res) => {
          if (res.status === 200) {
            this.dataList = res.data;
            this.tableData = cloneDeep(res.data);
          }
        });
      },
      saveEdit() {
        this.$refs['editApprovalMapping'].$refs['Form'].validate(valid => {
          if (!valid) return;
          let form = this.$refs['editApprovalMapping'].form;
          if (form.categoryFirst !== '') {
            if (form.categorySecond === '') {
              this.$message({
                type: 'error',
                message: '分类二级不能为空'
              })
              return;
            }
          }
          $axios.post('/itilWorkflowConfig/saveOrUpdateItilApproveMapping', form, {
            data: [form],
            logTemplate: '编辑|审批映射>审批映射(#ownerType#/#approveLink#/#approveType#/#approveLink#)'
          }).then((res) => {
            if (res.data.state === true) {
              this.$message({message: res.data.data, type: 'success'});
              this.getData();
              this.changeApprovalMapping = false;
            } else {
              this.$message({message: res.data.data, type: 'error'});
            }
          })
        })
      },
      addApprovalMapping() {
        this.addApprovalMappingDialog = true;
      },
      changeHandler(row) {
        this.rowData = row;
        this.changeApprovalMapping = true;
      },
      delHandler(row) {
        let uuid = row.uuid;
        this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.get('/itilWorkflowConfig/deleteItilApproveMappingByUuid/' + uuid, {
            data: [row],
            logTemplate: '删除|审批映射>审批映射(#ownerType#/#approveLink#/#approveType#/#approveLink#)'
          }).then(res => {
            if (res.data.state === true) {
              this.$message({
                message: res.data.errormsg,
                type: 'success'
              });
              this.getData();
            } else {
              this.$message({
                message: res.data.errormsg,
                type: 'error'
              })
            }
          })
        }).catch(() => {});
      },
      delBatch() {
        if (this.selections.length === 0) {
          this.$message({showClose: true, message: '至少选中一个审批映射', type: 'error'});
        } else {
          let arr = [];
          for (let i in this.selections) {
            arr.push(this.selections[i].uuid);
          }
          this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.post('itilWorkflowConfig/bathDelItilApproveMapping', arr, {
              data: this.selections,
              logTemplate: '删除|审批映射>审批映射(#ownerType#/#approveLink#/#approveType#/#approveLink#)'
            }).then(res => {
              if (res.data.state === true) {
                this.$message({
                  message: res.data.errormsg,
                  type: 'success'
                });
                this.getData();
              } else {
                this.$message({
                  message: res.data.errormsg,
                  type: 'error'
                })
              }
            })
          }).catch(() => {});
        }
      },
      saveChange() {
        this.$refs['addApprovalMappings'].$refs['Form'].validate(valid => {
          if (!valid) return;
          let form = this.$refs['addApprovalMappings'].form;
          if (form.categoryFirst !== '') {
            if (form.categorySecond === '') {
              this.$message({
                type: 'error',
                message: '分类二级不能为空'
              })
              return;
            }
          }
          $axios.post('/itilWorkflowConfig/saveOrUpdateItilApproveMapping', form, {
            data: [form],
            logTemplate: '添加|审批映射>审批映射(#ownerType#/#approveLink#/#approveType#/#approveLink#)'
          }).then((res) => {
            if (res.data.state === true) {
              this.$message({message: res.data.data, type: 'success'});
              this.getData();
              this.addApprovalMappingDialog = false;
            } else {
              this.$message({message: res.data.data, type: 'error'});
            }
          })
        })
      },
      search() {
        let form = Object.assign({}, {}, this.searchForm);
        this.tableData = multiSearch(form, this.dataList);
        this.flag = false
      },
      hideHandler() {
        this.flag = !this.flag
      },
      getAscription() {
        $axios.get('/ItilCommonWorkflow/getApproveMappingOrderType').then(res => {
          this.ascription = res.data;
        })
      },
      changeOwnType(val) {
        if (val !== '') {
          this.owerType = val;
          this.searchForm.categoryFirstName = '';
          this.searchForm.categorySecondName = '';
          this.searchForm.categoryThirdName = '';
          this.searchForm.approveLink = '';
          this.searchForm.approveType = '';
          this.categoryFirst = '';
          this.categorySecond = '';
          this.categoryThird = '';
          this.categoryFirstArr = [];
          this.categorySecondArr = [];
          this.categoryThirdArr = [];
          this.approveLinkArr = [];
          this.approveTypeArr = [];
          this.getCategoryByType(this.owerType);
          this.axiosApproveType(this.owerType);
        }
      },
      getCategoryByType(type) {
        $axios.get(`/ItilCommonWorkflow/getCompanyAndCategory/${type}`).then(res => {
          if (res.data.length > 0) {
            for (let i in res.data) {
              if (res.data[i].childrenList.length > 0) {
                let arr = res.data[i].childrenList;
                for (let j in arr) {
                  let param = {};
                  param.name = arr[j].name;
                  param.uuid = arr[j].uuid;
                  this.categoryFirstArr.push(param);
                }
              }
            }
          }
        })
      },
      changeCF(val) {
        if (this.owerType === '') {
          this.$message({type: 'error', message: '请选择归属流程'})
          return;
        }
        if (val !== '' && this.owerType !== '') {
          this.searchForm.categorySecondName = '';
          this.searchForm.categoryThirdName = '';
          this.categorySecond = '';
          this.categoryThird = '';
          this.categorySecondArr = [];
          this.categoryThirdArr = [];
          for (let i in this.categoryFirstArr) {
            if (val === this.categoryFirstArr[i].name) {
              this.categoryFirst = this.categoryFirstArr[i].uuid;
              this.categorySecond = '';
              this.categoryThird = '';
              this.getCategory(2, this.categoryFirst)
            }
          }
        }
      },
      changeCS(val) {
        if (this.owerType === '') {
          this.$message({type: 'error', message: '请选择归属流程'})
          return;
        }
        if (this.categoryFirst === '') {
          this.$message({type: 'error', message: '请选择一级分类'})
          return;
        }
        if (val !== '' && this.owerType !== '' && this.categoryFirst !== '') {
          for (let i in this.categorySecondArr) {
            if (val === this.categorySecondArr[i].categoryName) {
              this.categorySecond = this.categorySecondArr[i].uuid;
              this.searchForm.categoryThirdName = '';
              this.categoryThird = '';
              this.categoryThirdArr = [];
              this.getCategory(3, this.categorySecond);
            }
          }
        }
      },
      getCategory(level, uuid) {
        let param = {
          ownerType: this.owerType
        }
        if (level === 2) {
          let option = {
            categoryFirst: uuid,
            companyUuid: null
          };
          param = Object.assign({}, param, option);
        }
        if (level === 3) {
          let option = {
            categoryFirst: this.categoryFirst,
            companyUuid: null,
            categorySecond: uuid
          };
          param = Object.assign({}, param, option);
        }
        $axios.post('/ItilCommonWorkflow/getItilCategorySelect', param).then(res => {
          if (level === 2) {
            this.categorySecondArr = res.data;
          } else if (level === 3) {
            this.categoryThirdArr = res.data;
          }
        })
      },
      axiosApproveType(ownerType) {
        return $axios.get(`/itilWorkflowConfig/getApproveTypeByOwnerType/${ownerType}`).then(res => {
          this.approveTypeArr = res.data;
          return this.approveTypeArr;
        })
      },
      changeApproveType(val) {
        if (val !== '' && this.searchForm.ownerType !== '') {
          this.searchForm.approveLink = '';
          $axios.get('/itilWorkflowConfig/getApproveLinkStatusByApproveType/' + val).then((res) => {
            if (res.status === 200) {
              this.approveLinkArr = res.data;
            }
          })
        }
      },
      axiosUserInfo() {
        $axios.post('/iamUserInfo/getIamUserInfoListForItil').then((res) => {
          this.userLoginNameArr = res.data;
        })
      },
      axiosRoleList() {
        $axios.post('/itilWorkflowConfig/getItilRoleList').then((res) => {
          this.userRoleNameArr = res.data;
        })
      }
    },
    filters: {
      filterOwnerType(val) {
        switch (val) {
          case 2:
            return '变更';
          case 4:
            return '知识';
          case 5:
            return '发布';
          case 6:
            return '服务请求';
        }
      },
      filterApproveType(val) {
        switch (val) {
          case 1:
            return '重大变更';
          case 2:
            return '一般变更';
          case 3:
            return '知识库审批';
          case 4:
            return '重大发布';
          case 5:
            return '常规发布';
          case 6:
            return '紧急发布';
          case 7:
            return '服务请求';
        }
      },
      filterApproveLink(val) {
        switch (val) {
          case 1:
            return '已计划审批';
          case 2:
            return '技术审批';
          case 3:
            return '发布审批';
          case 4:
            return '注销审批';
          case 11:
            return '启动审批';
          case 12:
            return '计划审批';
          case 13:
            return '开发审批';
          case 14:
            return '测试审批';
          case 15:
            return '部署审批';
          case 16:
            return '关闭审批';
          case 17:
            return '启动请求';
        }
      }
    },
    created() {
      this.getData();
      this.getAscription();
      this.axiosUserInfo();
      this.axiosRoleList();
    }
  }
</script>
