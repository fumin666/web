<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-08 14:21:43
 * @LastEditTime: 2019-04-08 14:21:43
 * @LastEditors: your name
 -->
<!--支持组信息-->
<template>
  <div>
    <s-row>
      <s-col :span="22">
        <s-button @click="addSupportGroup" icon="plus">添加</s-button>
        <s-button @click="importBatch" icon="import">导入</s-button>
        <s-button @click="exportBatch" icon="export">导出</s-button>
        <s-button @click="delBatch" icon="batch-del">批量删除</s-button>
      </s-col>
    </s-row>
    <s-form ref="searchBox" :inline="true" :model="searchForm" label-width="80px" class="search_form" style="margin: 10px 0;">
      <div>
        <s-form-item label="组织名称:" prop="organizaitonName">
          <s-select v-model="searchForm.organizaitonName" @change="changeOrg" filterable clearable>
            <s-option v-for="(item, index) in organizaitonArr" :key="index" :value="item.departName" :label="item.departName"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="支持组名称:" prop="groupName">
          <s-select v-model="searchForm.groupName" filterable clearable>
            <s-option v-for="(item, index) in supportGroupArr" :key="index" :value="item.groupName" :label="item.groupName"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="支持组层级:" prop="supportLevel">
          <s-select v-model="searchForm.supportLevel" clearable>
            <s-option v-for="i in supportLevel" :key="i.valueInt" :value="i.valueInt" :label="i.name"></s-option>
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
      <s-table-column type="selection" width="80" ></s-table-column>
      <s-table-column prop="companyName" label="公司名称"></s-table-column>
      <s-table-column prop="organizaitonName" label="组织名称" ></s-table-column>
      <s-table-column prop="groupName" label="支持组名称" ></s-table-column>
      <s-table-column prop="supportLevel" label="支持组层级" >
        <template slot-scope="scope">
          {{scope.row.supportLevel | filterSupportLevel}}
        </template>
      </s-table-column>
      <s-table-column prop="activeStatus" label="状态" >
        <template slot-scope="scope">
          <s-switch v-model="scope.row.activeStatus" size="small" :active-value="1" :inactive-value="0" @change="changeState(scope.row)"></s-switch>
        </template>
      </s-table-column>
      <s-table-column label="操作">
        <template slot-scope="scope">
          <i class="iconfont icon-edit" title="修改" @click="changeHandler(scope.row)"></i>
          <i class="iconfont icon-delete" title="删除" @click="delHandler(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table-page>

    <!--新增-->
    <s-dialog
      v-model="addForm"
      v-if="addForm"
      width="700px"
      title="添加"
      append-to-body>
      <s-scrollbar wrap-style="height: 500px;">
        <add-support-group @add-personInfo="addPersonInfo" ref="addSupportGroupForm"></add-support-group>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveAdd">保存</s-button>
        <s-button type="cancel" @click="addForm=false">取消</s-button>
      </template>
    </s-dialog>

    <!--修改支持组信息弹窗-->
    <s-dialog
      v-model="changeSupportGroup"
      v-if="changeSupportGroup"
      width="700px"
      title="修改"
      append-to-body>
      <s-scrollbar wrap-style="height: 500px;">
        <change-support-group :changeInfo="changeData"
                              @add-personInfo="addPersonInfo"
                              ref="changeSupportGroup"></change-support-group>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveChange">保存</s-button>
        <s-button type="cancel" @click="cancelChange">取消</s-button>
      </template>
    </s-dialog>


    <!--导入-->
    <import-dialog v-if="importDialogFlag" v-model="importDialogFlag"
                   :upload-obj="uploadObj" :down-obj="downObj" @reload="getData" :fileTypes="['xls', 'xlsx']"></import-dialog>

    <!--添加人员弹窗-->
    <add-person-dialog v-model="addPersonDialog"
                       v-if="addPersonDialog"
                       :cur-template="personelTemplate"
                       ref="addPersonDialog"></add-person-dialog>
    <!--未完成工单列表-->
    <s-dialog v-model="untreatedDialogFlag" v-if="untreatedDialogFlag"
              append-to-body
              width="800px" title="该支持组下还有未处理完的工单，请处理">
      <s-table-page :data="untreatedList"  :header-search='getSearchDef()'>
        <s-table-column prop="serialCode" label="工单编号"></s-table-column>
        <s-table-column prop="orderTypeStr" label="工单类型"></s-table-column>
        <s-table-column prop="briefDesc" label="简要描述"></s-table-column>
        <s-table-column prop="orderStatusStr" label="工单状态"></s-table-column>
      </s-table-page>
    </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import changeSupportGroup from '../dialog/ChangeSupportGroupDialog.vue';
  import addSupportGroup from '../dialog/AddSupportGroupDialog.vue';
  import importDialog from '@/components/importDialog/ImportDialog';
  import addPersonDialog from '../dialog/AddPersonDialog.vue';
  import { intersectObj, Download, multiSearch } from 'sunflower-common-utils';
  // import SearchBox from '@/components/tableCom/src/SearchBox';
  import {cloneDeep} from 'lodash';
  export default {
    data() {
      return {
        dataList: [],
        tableData: [],
        changeSupportGroup: false,
        addForm: false,
        changeData: {},
        selections: [],
        importDialogFlag: false,
        uploadObj: {},
        downObj: {},
        personelTemplate: {},
        addPersonDialog: false,
        untreatedDialogFlag: false,
        searchForm: {
          organizaitonName: '',
          groupName: ''
        },
        supportLevel: [],
        organizaitonArr: [],
        supportGroupArr: [],
        flag: false
      }
    },
    components: {
      changeSupportGroup,
      addSupportGroup,
      importDialog,
      addPersonDialog
      // SearchBox
    },
    methods: {
      getListActionsDef() {
        return {
          width: 6
        }
      },
      handleSelectionChange(selections) {
        this.selections = selections;
      },
      addPersonInfo(template) {
        this.addPersonDialog = true;
        this.personelTemplate = template;
      },
      getSearchDef() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入查询条件',
          searchProps: ['serialCode', 'orderStatusStr', 'briefDesc', 'orderStatusStr'] // can be string or Array
        }
      },
      delHandler(row) {
        let uuid = row.uuid;
        this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.post('itilWorkflowConfig/getUndealedOrderByGroup/' + uuid).then(res => {
            if (res.data.length === 0) {
              if (row.deleteJudge.state === true) {
                $axios.get('/itilWorkflowConfig/deleteItilSupportGroup/' + uuid, {
                  data: [row],
                  logTemplate: '删除|支持组信息>支持组(#groupName#)'
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
              } else {
                $axios.get('/itilWorkflowConfig/deleteItilSupportGroup/' + uuid, {
                  data: [row],
                  logTemplate: '删除|支持组信息>支持组(#groupName#)'
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
              }
            } else {
              this.untreatedDialogFlag = true;
              this.untreatedList = res.data;
            }
          })
        }).catch(() => {})
      },
      changeState(row) {
        let msg = {
          activeStatus: row.activeStatus,
          uuid: row.uuid
        }
        $axios.post('/itilWorkflowConfig/saveOrUpdateItilSupportGroup', msg).then((res) => {
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
      changeHandler(row) {
        this.changeData = row;
        this.changeData.userUuidList = [];
        this.changeSupportGroup = true;
      },
      addSupportGroup() {
        this.addForm = true;
      },
      saveAdd() {
        this.$refs['addSupportGroupForm'].$refs['Form'].validate(valid => {
          if (!valid) return;
          let form = this.$refs['addSupportGroupForm'].form;
          let param = {
            activeStatus: '',
            companyName: '',
            departmentUuid: '',
            groupName: '',
            id: '',
            organizaitonName: '',
            supportLevel: '',
            uuid: '',
            userUuidList: []
          }
          param = intersectObj(param, form);
          param.userUuidList = [];
          for (let i in form.iamUserInfoList) {
            param.userUuidList.push(form.iamUserInfoList[i].uuid);
          }
          $axios.post('/itilWorkflowConfig/saveOrUpdateItilSupportGroup', param, {
            data: [param],
            logTemplate: '添加|支持组信息>支持组(#groupName#)'
          }).then((res) => {
            if (res.data.state === true) {
              this.$message({message: res.data.data, type: 'success'});
              this.getData();
              this.addForm = false;
            } else {
              this.$message({message: res.data.data, type: 'error'});
            }
          })
        })
      },
      saveChange() {
        this.$refs['changeSupportGroup'].$refs['Form'].validate(valid => {
          if (!valid) return;
          let form = this.$refs['changeSupportGroup'].form;
          let param = {
            activeStatus: '',
            companyName: '',
            departmentUuid: '',
            groupName: '',
            id: '',
            organizaitonName: '',
            supportLevel: '',
            uuid: '',
            userUuidList: []
          }
          param = intersectObj(param, form);
          param.userUuidList = [];
          for (let i in form.iamUserInfoList) {
            param.userUuidList.push(form.iamUserInfoList[i].uuid);
          }
          $axios.post('/itilWorkflowConfig/saveOrUpdateItilSupportGroup', param, {
            data: [param],
            logTemplate: '编辑|支持组信息>支持组(#groupName#)'
          }).then((res) => {
            if (res.data.state === true) {
              this.$message({message: res.data.data, type: 'success'});
              this.getData();
              this.changeSupportGroup = false;
            } else {
              this.$message({message: res.data.data, type: 'error'});
            }
          })
        })
      },
      cancelChange() {
        this.changeSupportGroup = false;
      },
      getData() {
        $axios.post('/itilWorkflowConfig/getItilSupportGroupList').then((res) => {
          if (res.status === 200) {
            this.dataList = res.data;
            this.tableData = cloneDeep(res.data);
          }
        });
      },
      importBatch() {
        this.uploadObj = {
          type: 'post',
          url: '/itilWorkflowConfig/importSupportGroup'
        };
        this.downObj = {
          text: '批量导入支持组信息模板',
          url: '/itilWorkflowConfig/supportGroupImportTemplate'
        };
        this.importDialogFlag = true;
      },
      exportBatch() {
        if (this.selections.length === 0) {
          this.$message({showClose: true, message: '请先选择支持组信息', type: 'info'});
          return;
        }
        let uuidStr = this.selections.map(item => {
          return item.uuid;
        }).join(',');
        Download(`/itilWorkflowConfig/exportItilSupportGroup/${uuidStr}`, {
          data: [],
          logTemplate: '导出|支持组信息>支持组(SupportGroupInfo.xls)'
        });
      },
      delBatch() {
        if (this.selections.length === 0) {
          this.$message({showClose: true, message: '至少选中一个支持组', type: 'error'});
        } else {
          let errorArr = [];
          let arr = [];
          for (let i in this.selections) {
            if (this.selections[i].deleteJudge.state === false) {
              errorArr.push(this.selections[i].groupName)
            }
            arr.push(this.selections[i].uuid);
          }
          if (errorArr.length > 0) {
            let str = errorArr.join();
            this.$confirm(str + '的相关分派规则也将同步删除，对应的三级分类将启动系统默认分派规则', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
              $axios.post('/itilWorkflowConfig/batchDeleteItilSupportGroup', arr, {
                data: this.selections,
                logTemplate: '删除|支持组信息>支持组(#groupName#)'
              }).then(res => {
                if (res.data.state === true) {
                  this.$message({
                    message: '删除成功',
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
            }).catch(() => {})
          } else {
            this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
              $axios.post('/itilWorkflowConfig/batchDeleteItilSupportGroup', arr, {
                data: this.selections,
                logTemplate: '删除|支持组信息>支持组(#groupName#)'
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
            }).catch(() => {})
          }
        }
      },
      search() {
        let form = Object.assign({}, {}, this.searchForm);
        this.tableData = multiSearch(form, this.dataList);
        this.flag = false
      },
      hideHandler() {
        this.flag = !this.flag
      },
      getSupportLvl() {
        $axios.get('/itilWorkflowConfig/getItilConfigBasicData').then(res => {
          this.supportLevel = res.data.supportLevelList;
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
      this.getSupportLvl();
      this.getOrganizaitonArr();
    },
    filters: {
      filterSupportLevel(val) {
        switch (val) {
          case 1:
            return '服务台一线';
          case 2:
            return '二线支持';
          case 3:
            return '三线支持';
        }
      }
    }
  }
</script>
