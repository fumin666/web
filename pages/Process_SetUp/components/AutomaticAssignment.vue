<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-08 14:21:43
 * @LastEditTime: 2019-04-08 14:21:43
 * @LastEditors: your name
 -->
<!--自动分派规则-->
<template>
  <div>
    <s-row>
      <s-col :span="22">
        <s-button @click="addAutomatic" icon="plus">添加</s-button>
        <s-button @click="importBatch" icon="import">导入</s-button>
        <s-button @click="exportBatch" icon="export">导出</s-button>
        <s-button @click="delBatch" icon="batch-del">批量删除</s-button>
      </s-col>
    </s-row>
    <s-form ref="searchBox" :inline="true" :model="searchForm" label-width="80px" class="search_form" style="margin: 10px 0;">
      <div>
        <s-form-item label="分派规则：" prop="ruletype">
          <s-select v-model="searchForm.ruletype" style="width: 100%" filterable clearable>
            <s-option v-for="(item, index) in ruletype" :key="index" :value="item.uuid"
                      :label="item.value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="归属流程：" prop="ownerType">
          <s-select v-model="searchForm.ownerType" style="width: 100%" @change="changeOwnType" filterable clearable>
            <s-option v-for="(value, key, index) in ascription" :key="index" :value="key"
                      :label="value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="分类一级：" prop="categoryFirstName">
          <s-select v-model="searchForm.categoryFirstName" style="width: 100%" @change="changeCF" filterable clearable>
            <s-option v-for="(item, index) in categoryFirstArr" :key="index" :value="item.name"
                      :label="item.name"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="分类二级：" prop="categorySecondName">
          <s-select v-model="searchForm.categorySecondName" style="width: 100%" @change="changeCS" filterable clearable>
            <s-option v-for="(item, index) in categorySecondArr" :key="index" :value="item.categoryName"
                      :label="item.categoryName"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="分类三级：" prop="categoryThirdName">
          <s-select v-model="searchForm.categoryThirdName" style="width: 100%" filterable clearable>
            <s-option v-for="(item, index) in categoryThirdArr" :key="index" :value="item.categoryName"
                      :label="item.categoryName"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="组织名称：" prop="organizaitonName">
          <s-select v-model="searchForm.organizaitonName" @change="changeOrg" filterable clearable>
            <s-option v-for="(item, index) in organizaitonArr" :key="index" :value="item.departName" :label="item.departName"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="支持组名称：" prop="groupName">
          <s-select v-model="searchForm.groupName" filterable clearable>
            <s-option v-for="(item, index) in supportGroupArr" :key="index" :value="item.groupName" :label="item.groupName"></s-option>
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
      :max-height=550
      :header-search='getSearchDef()'
      style="width:100%"
      @selection-change="handleSelectionChange"
    >
      <s-table-column type="selection" width="50" ></s-table-column>
      <s-table-column prop="ruletype" label="分派规则" >
        <template slot-scope="scope">
          {{scope.row.ruletype | filterRuleType}}
        </template>
      </s-table-column>
      <s-table-column prop="ownerType" label="归属流程">
        <template slot-scope="scope">
          {{scope.row.ownerType | filterOwnerType}}
        </template>
      </s-table-column>
      <s-table-column prop="categoryFirstName" label="分类一级" ></s-table-column>
      <s-table-column prop="categorySecondName" label="分类二级" ></s-table-column>
      <s-table-column prop="categoryThirdName" label="分类三级" ></s-table-column>
      <s-table-column prop="companyName" label="公司名称" ></s-table-column>
      <s-table-column prop="organizaitonName" label="组织名称" ></s-table-column>
      <s-table-column prop="groupName" label="支持组名称" ></s-table-column>
      <s-table-column prop="activeStatus" label="状态" >
        <template slot-scope="scope">
          <s-switch v-model="scope.row.activeStatus" size="small" :active-value="1" :inactive-value="0" @change="changeState(scope.row)"></s-switch>
        </template>
      </s-table-column>
      <s-table-column label="操作" width="200">
        <template slot-scope="scope">
          <i class="iconfont icon-edit" title="修改" @click="changeHandler(scope.row)"></i>
          <i class="iconfont icon-delete" title="删除" @click="delHandler(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table-page>

    <!--添加自动分派规则弹窗-->
    <s-dialog
      v-model="addAutoAssignment"
      v-if="addAutoAssignment"
      width="700px"
      title="添加"
      append-to-body>
      <s-scrollbar wrap-style="height: 400px;">
        <add-auto-assignment-dialog ref="addAutoAssignment"></add-auto-assignment-dialog>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveAdd">保存</s-button>
        <s-button type="cancel" @click="cancelAdd">取消</s-button>
      </template>
    </s-dialog>

    <!--修改自动分派规则弹窗-->
    <s-dialog
      v-model="changeAutoAssignment"
      v-if="changeAutoAssignment"
      width="700px"
      title="修改"
      append-to-body>
      <s-scrollbar wrap-style="height: 400px;">
        <change-auto-assignment-dialog :changeData="changeData"  ref="changeAutoAssignment"></change-auto-assignment-dialog>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveChange">保存</s-button>
        <s-button type="cancel" @click="cancelChange">取消</s-button>
      </template>
    </s-dialog>

    <!--导入-->
    <import-dialog v-if="importDialogFlag" v-model="importDialogFlag"
                   :upload-obj="uploadObj" :down-obj="downObj" @reload="getData" :fileTypes="['xls', 'xlsx']"></import-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import changeAutoAssignmentDialog from '../dialog/ChangeAutoAssignmentDialog.vue';
  import addAutoAssignmentDialog from '../dialog/AddAutoAssignmentDialog.vue';
  import importDialog from '@/components/importDialog/ImportDialog';
  import { Download, multiSearch } from 'sunflower-common-utils';
  // import SearchBox from '@/components/tableCom/src/SearchBox';

  import {cloneDeep} from 'lodash';
  export default {
    data() {
      return {
        dataList: [],
        tableData: [],
        changeData: {},
        changeAutoAssignment: false,
        addAutoAssignment: false,
        uuid: '',
        selections: [],
        importDialogFlag: false,
        searchForm: {
          ruletype: '',
          ownerType: '',
          categoryFirstName: '',
          categorySecondName: '',
          categoryThirdName: '',
          organizaitonName: '',
          groupName: ''
        },
        ascription: {},
        categoryFirstArr: [],
        categorySecondArr: [],
        categoryThirdArr: [],
        owerType: '',
        categoryFirst: '',
        categorySecond: '',
        categoryThird: '',
        ruletype: [
          {
            value: '随机分派',
            uuid: 1
          },
          {
            value: '未完成工单最少',
            uuid: 2
          }
        ],
        organizaitonArr: [],
        supportGroupArr: [],
        flag: false
      }
    },
    components: {
      changeAutoAssignmentDialog,
      addAutoAssignmentDialog,
      importDialog
      // SearchBox
    },
    methods: {
      handleSelectionChange(selections) {
        this.selections = selections;
      },
      addAutomatic() {
        this.addAutoAssignment = true;
      },
      importBatch() {
        this.uploadObj = {
          type: 'post',
          url: '/itilWorkflowConfig/importAutoAllocate'
        };
        this.downObj = {
          text: '批量导入自动分派规则模板',
          url: '/itilWorkflowConfig/autoAllocateImportTemplate'
        };
        this.importDialogFlag = true;
      },
      exportBatch() {
        if (this.selections.length === 0) {
          this.$message({showClose: true, message: '请先选择自动分派规则', type: 'info'});
          return;
        }
        let uuidStr = this.selections.map(item => {
          return item.uuid;
        }).join(',');
        Download(`itilWorkflowConfig/autoAllocateImportTemplate/${uuidStr}`, {
          data: [],
          logTemplate: '导出|自动分派规则>自动分派规则(autoAllocateRule.xls)'
        });
      },
      getSearchDef() {
        return {
          show: false
        }
      },
      changeHandler(row) {
        this.changeData = row;
        this.changeAutoAssignment = true;
      },
      delHandler(row) {
        let uuid = row.uuid;
        this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.get('/itilWorkflowConfig/deleteItilAutoAllocateByUuid/' + uuid, {
            data: [row],
            logTemplate: '删除|自动分派规则>自动分派规则(#ownerType#/#categoryFirstName#/#categorySecondName#/#categoryThirdName#)'
          }).then(res => {
            if (res.status === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getData();
            } else {
              this.$message({
                message: '删除失败',
                type: 'error'
              })
            }
          })
        }).catch(() => {});
      },
      delBatch() {
        if (this.selections.length === 0) {
          this.$message({showClose: true, message: '至少选中一个规则', type: 'error'});
        } else {
          let arr = [];
          for (let i in this.selections) {
            arr.push(this.selections[i].uuid);
          }
          this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.post('/itilWorkflowConfig/batchDelItilAutoAllocate', arr, {
              data: this.selections,
              logTemplate: '删除|自动分派规则>自动分派规则(#ownerType#/#categoryFirstName#/#categorySecondName#/#categoryThirdName#)'
            }).then(res => {
              if (res.status === 200) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
                this.getData();
              } else {
                this.$message({
                  message: '删除失败',
                  type: 'error'
                })
              }
            })
          }).catch(() => {});
        }
      },
      saveChange() {
        this.$refs['changeAutoAssignment'].$refs['Form'].validate(valid => {
          if (!valid) return;
          let form = this.$refs['changeAutoAssignment'].form;
          $axios.post('/itilWorkflowConfig/saveOrUpdateItilAutoAllocate', form, {
            data: [form],
            logTemplate: '编辑|自动分派规则>自动分派规则(#ownerType#/#categoryFirstName#/#categorySecondName#/#categoryThirdName#)'
          }).then((res) => {
            if (res.data.state === true) {
              this.$message({message: res.data.data, type: 'success'});
              this.getData();
              this.changeAutoAssignment = false;
            } else {
              this.$message({message: res.data.data, type: 'error'});
            }
          })
        })
      },
      cancelChange() {
        this.changeAutoAssignment = false;
      },
      saveAdd() {
        this.$refs['addAutoAssignment'].$refs['Form'].validate(valid => {
          if (!valid) return;
          let form = this.$refs['addAutoAssignment'].form;
          $axios.post('/itilWorkflowConfig/saveOrUpdateItilAutoAllocate', form, {
            data: [form],
            logTemplate: '添加|自动分派规则>自动分派规则(#ownerType#/#categoryFirstName#/#categorySecondName#/#categoryThirdName#)'
          }).then((res) => {
            if (res.data.state === true) {
              this.$message({message: res.data.data, type: 'success'});
              this.getData();
              this.addAutoAssignment = false;
            } else {
              this.$message({message: res.data.data, type: 'error'});
            }
          })
        })
      },
      cancelAdd() {
        this.addAutoAssignment = false;
      },
      getData() {
        $axios.post('/itilWorkflowConfig/getItilAutoAllocateList').then((res) => {
          if (res.status === 200) {
            this.dataList = res.data;
            this.tableData = cloneDeep(res.data);
          }
        })
      },
      changeState(row) {
        let msg = {
          activeStatus: row.activeStatus,
          uuid: row.uuid
        }
        $axios.post('/itilWorkflowConfig/saveOrUpdateItilAutoAllocate', msg).then((res) => {
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
      search() {
        let form = Object.assign({}, {}, this.searchForm);
        this.tableData = multiSearch(form, this.dataList);
        this.flag = false
      },
      hideHandler() {
        this.flag = !this.flag
      },
      getAscription() {
        $axios.get('ItilCommonWorkflow/getOrderType').then(res => {
          this.ascription = res.data;
        })
      },
      changeOwnType(val) {
        if (val !== '') {
          this.owerType = val;
          this.searchForm.categoryFirstName = '';
          this.searchForm.categorySecondName = '';
          this.searchForm.categoryThirdName = '';
          this.categoryFirst = '';
          this.categorySecond = '';
          this.categoryThird = '';
          this.categoryFirstArr = [];
          this.categorySecondArr = [];
          this.categoryThirdArr = [];
          this.getCategoryByType(this.owerType);
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
      getOrganizaitonArr() {
        $axios.get('departmentInfo/getAllOrganizationList').then(res => {
          this.organizaitonArr = res.data;
        })
      },
      changeOrg(val) {
        if (val !== '') {
          for (let i in this.organizaitonArr) {
            if (val === this.organizaitonArr[i].departName) {
              let uuid = this.organizaitonArr[i].uuid;
              this.searchForm.groupName = '';
              this.getSupGroupByOrg(uuid);
            }
          }
        }
      },
      getSupGroupByOrg(uuid) {
        $axios.get(`/itilWorkflowConfig/getAllItilSupportGroupByDepartUuid/${uuid}`).then(res => {
          this.supportGroupArr = res.data;
        })
      }
    },
    created() {
      this.getData();
      this.getAscription();
      this.getOrganizaitonArr();
    },
    filters: {
      filterRuleType(val) {
        switch (val) {
          case 1:
            return '随机分派';
          case 2:
            return '未完成工单最少';
        }
      },
      filterOwnerType(val) {
        switch (val) {
          case 0:
            return '事件';
          case 1:
            return '问题';
          case 2:
            return '变更';
          case 3:
            return '任务';
          case 4:
            return '知识';
          case 5:
            return '发布';
          case 6:
            return '服务请求';
        }
      }
    }
  }
</script>
