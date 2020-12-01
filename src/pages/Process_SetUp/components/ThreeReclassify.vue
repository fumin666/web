<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-08 14:21:43
 * @LastEditTime: 2019-04-08 14:21:43
 * @LastEditors: your name
 -->
<!--三级分类-->
<template>
  <div>
    <s-row>
      <s-col :span="22">
        <s-button @click="addThreeReclassify" icon="plus">添加</s-button>
        <s-button @click="importBatch" icon="import">导入</s-button>
        <s-button @click="exportBatch" icon="export">导出</s-button>
        <s-button @click="delBatch" icon="batch-del">批量删除</s-button>
      </s-col>
    </s-row>
    <s-form ref="searchBox" :inline="true" :model="searchForm" label-width="80px" class="search_form" style="margin: 10px 0;">
      <div>
        <s-form-item label="归属流程:" prop="ownTypeStr">
          <s-select v-model="searchForm.ownTypeStr" style="width: 100%" @change="changeOwnType" filterable clearable>
            <s-option v-for="(value, key, index) in ascription" :key="index" :value="value"
                      :label="value"></s-option>
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
      <s-table-column type="selection" width="80" :selectable="selectQuestion" ></s-table-column>
      <s-table-column prop="companyName" label="公司名称"></s-table-column>
      <s-table-column prop="categoryFirstName" label="分类一级"></s-table-column>
      <s-table-column prop="categorySecondName" label="分类二级"></s-table-column>
      <s-table-column prop="categoryThirdName" label="分类三级"></s-table-column>
      <s-table-column prop="ownTypeStr" label="归属流程"></s-table-column>
      <s-table-column label="状态">
        <template slot-scope="scope">
          <s-switch v-model='scope.row.activeStatus' size="small" :key="scope.row.uuid" :inactive-value="0" :active-value="1" @change="changeState(scope.row)" ></s-switch>
        </template>
      </s-table-column>
      <s-table-column label="操作" width="120px">
        <template slot-scope="scope">
          <i class="iconfont icon-edit" title="修改" @click="changeHandler(scope.row)" v-if="scope.row.uuid !== 'category000000000000000000000000' && scope.row.defaultStatus !== 1"></i>
          <i class="iconfont icon-delete" title="删除" @click="delHandler(scope.row)" v-if="scope.row.uuid !== 'category000000000000000000000000' && scope.row.defaultStatus !== 1"></i>
        </template>
      </s-table-column>
    </s-table-page>
    <!--新增-->
    <s-dialog
      v-model="addForm"
      v-if="addForm"
      width="550px"
      title="添加"
      append-to-body>
      <add-three-reclassify-dialog ref="addCategoryForm"></add-three-reclassify-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveAdd">保存</s-button>
        <s-button type="cancel" @click="addForm=false">取消</s-button>
      </template>
    </s-dialog>
    <!--修改三级分类弹窗-->
    <s-dialog
      v-model="changeThreeReclassify"
      v-if="changeThreeReclassify"
      width="550px"
      title="修改"
      append-to-body>
      <three-reclassify-dialog :changeMsg="changeMsg" ref="changeThreeReclassify"></three-reclassify-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveChange">保存</s-button>
        <s-button type="cancel" @click="cancelChange">取消</s-button>
      </template>
    </s-dialog>


    <!--导入-->
    <import-dialog v-if="importDialogFlag" v-model="importDialogFlag"
                   :upload-obj="uploadObj" :down-obj="downObj" @reload="getList" :fileTypes="['xls', 'xlsx']"></import-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import threeReclassifyDialog from '../dialog/ThreeReclassifyDialog.vue';
  import addThreeReclassifyDialog from '../dialog/AddThreeReclassifyDialog.vue';
  import importDialog from '@/components/importDialog/ImportDialog';
  import { Download, multiSearch } from 'sunflower-common-utils';
  // import SearchBox from '@/components/tableCom/src/SearchBox';
  import {cloneDeep} from 'lodash';
  export default {
    data() {
      return {
        dataList: [],
        tableData: [],
        addForm: false,
        changeThreeReclassify: false,
        uuid: '',
        changeMsg: {},
        selections: [],
        importDialogFlag: false,
        searchForm: {
          ownTypeStr: '',
          categoryFirstName: '',
          categorySecondName: '',
          categoryThirdName: ''
        },
        ascription: {},
        categoryFirstArr: [],
        categorySecondArr: [],
        categoryThirdArr: [],
        owerType: '',
        categoryFirst: '',
        categorySecond: '',
        categoryThird: '',
        flag: false
      }
    },
    components: {
      threeReclassifyDialog,
      addThreeReclassifyDialog,
      importDialog
      // SearchBox
    },
    created() {
      this.getList();
      this.getAscription();
    },
    methods: {
      handleSelectionChange(selections) {
        this.selections = selections;
      },
      selectQuestion(row, index) {
        if (row.uuid === 'category000000000000000000000000' || row.isDesi === 1) {
          return false;
        } else {
          return true;
        }
      },
      importBatch() {
        this.uploadObj = {
          type: 'post',
          url: '/itilWorkflowConfig/importItilCategory'
        };
        this.downObj = {
          text: '批量导入三级分类模板',
          url: '/itilWorkflowConfig/itilCategoryTemplate'
        };
        this.importDialogFlag = true;
      },
      exportBatch() {
        if (this.selections.length === 0) {
          this.$message({showClose: true, message: '请先选择三级分类', type: 'info'});
          return;
        }
        let uuidStr = this.selections.map(item => {
          return item.uuid;
        }).join(',');
        Download(`/itilWorkflowConfig/exportItilCategory/${uuidStr}`, {
          data: this.selections,
          logTemplate: '导出|三级分类>三级分类(ItilCategory.xls)'
        });
      },
      addThreeReclassify() {
        this.addForm = true;
      },
      changeState(row) {
        let msg = {
          activeStatus: row.activeStatus,
          uuid: row.uuid
        }
        $axios.post('/itilWorkflowConfig/updateItilCategoryStatus', msg).then((res) => {
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
      getList() {
        $axios.post('/itilWorkflowConfig/getItilCategoryList').then((res) => {
          this.dataList = res.data;
          this.tableData = cloneDeep(res.data);
        })
      },
      changeHandler(row) {
        this.changeMsg = row;
        this.changeThreeReclassify = true;
      },
      delHandler(row) {
        if (row.deleteJudge.state === true) {
          this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.get(`/itilWorkflowConfig/deleteItilCategoryByUuid/${row.uuid}`, {
              data: [row],
              logTemplate: '删除|三级分类>三级分类(#categoryFirstName#/#categorySecondName#/#categoryThirdName#)'
            }).then(({data}) => {
              if (data === true) {
                this.$message.success('删除成功')
                this.getList()
              } else {
                this.$message.error('删除失败')
              }
            })
          }).catch(() => {})
        } else {
          this.$confirm(row.deleteJudge.errormsg, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.get(`/itilWorkflowConfig/deleteItilCategoryByUuid/${row.uuid}`, {
              data: [row],
              logTemplate: '删除|三级分类>三级分类(#categoryFirstName#/#categorySecondName#/#categoryThirdName#)'
            }).then(({data}) => {
              if (data === true) {
                this.$message.success('删除成功')
                this.getList()
              } else {
                this.$message.error('删除失败')
              }
            })
          }).catch(() => {})
        }
      },
      saveAdd() {
        this.$refs['addCategoryForm'].$refs['Form'].validate(valid => {
          if (!valid) return;
          let form = this.$refs['addCategoryForm'].form
          $axios.post('/itilWorkflowConfig/saveOrUpdateItilCategory', form, {
            data: [form],
            logTemplate: '添加|三级分类>三级分类(#categoryFirstName#/#categorySecondName#/#categoryThirdName#)'
          }).then((res) => {
            if (res.data.state === true) {
              this.$message({message: res.data.data, type: 'success'});
              this.getList()
              this.addForm = false;
            } else {
              this.$message({message: res.data.data, type: 'error'});
            }
          })
        })
      },
      saveChange() {
        this.$refs['changeThreeReclassify'].$refs['Form'].validate(valid => {
          if (!valid) return;
          let form = this.$refs['changeThreeReclassify'].form
          $axios.post('/itilWorkflowConfig/updateItilCategory', form, {
            data: [form],
            logTemplate: '编辑|三级分类>三级分类(#categoryFirstName#/#categorySecondName#/#categoryThirdName#)'
          }).then((res) => {
            if (res.data.state === true) {
              this.$message({message: res.data.errormsg, type: 'success'});
              this.getList()
              this.changeThreeReclassify = false;
            } else {
              this.$message({message: res.data.errormsg, type: 'error'});
            }
          })
        })
      },
      cancelChange() {
        this.changeThreeReclassify = false;
      },
      delBatch() {
        if (this.selections.length === 0) {
          this.$message({showClose: true, message: '至少选中一个三级分类', type: 'error'});
        } else {
          let arr = [];
          let errorArr = [];
          for (let i in this.selections) {
            if (this.selections[i].deleteJudge.state === false) {
              errorArr.push(this.selections[i]);
            }
            arr.push(this.selections[i].uuid);
          }
          if (errorArr.length > 0) {
            this.$confirm('相关分派规则也将同步删除', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
              $axios.post('/itilWorkflowConfig/batchDelItilCategory', arr, {
                data: this.selections,
                logTemplate: '删除|三级分类>三级分类(#categoryFirstName#/#categorySecondName#/#categoryThirdName#)'
              }).then(res => {
                if (res.status === 200) {
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  });
                  this.getList();
                } else {
                  this.$message({
                    message: '删除失败',
                    type: 'error'
                  })
                }
              })
            }).catch(() => {})
          } else {
            this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
              $axios.post('/itilWorkflowConfig/batchDelItilCategory', arr, {
                data: this.selections,
                logTemplate: '删除|三级分类>三级分类(#categoryFirstName#/#categorySecondName#/#categoryThirdName#)'
              }).then(res => {
                if (res.status === 200) {
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  });
                  this.getList();
                } else {
                  this.$message({
                    message: '删除失败',
                    type: 'error'
                  })
                }
              })
            }).catch(() => {})
          }
        }
      },
      getAscription() {
        $axios.get('ItilCommonWorkflow/getOrderType').then(res => {
          this.ascription = res.data;
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
      changeOwnType(val) {
        if (val !== '') {
          for (let i in this.ascription) {
            if (val === this.ascription[i]) {
              this.owerType = i;
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
          }
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
      }
    }
  }
</script>
