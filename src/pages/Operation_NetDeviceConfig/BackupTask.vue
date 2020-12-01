<!--
 * @Description: 备份任务管理
 * @Author: songyf
 * @Date: 2020-4-14
 * @LastEditTime : 2020-4-14
 * @LastEditors  : LaMando
 -->
<template>
  <div class="backup-task">
        <s-form :inline="true" :model="AuditSearchForm" class="search_form" label-width="105px" style="margin-top:10px">
            <div class="form_item">
                <s-form-item label="任务名称：">
                    <s-input v-model="AuditSearchForm.taskName"></s-input>
                </s-form-item>
                <s-form-item label="创建者：">
                    <s-input v-model="AuditSearchForm.userName"></s-input>
                </s-form-item>
                <s-form-item label="任务周期：">
                    <s-select v-model="AuditSearchForm.taskPeriodName" clearable>
                      <s-option label='日' value='日'></s-option>
                      <s-option label='周' value='周'></s-option>
                      <s-option label='月' value='月'></s-option>
                      <s-option label='年' value='年'></s-option>
                    </s-select>
                </s-form-item>
                <s-form-item label="上次执行时间：">
                    <date-range v-model="AuditSearchForm.lastTimeString.value"></date-range>
                </s-form-item>
                <s-form-item label="下次执行时间：">
                    <date-range v-model="AuditSearchForm.nextTimeString.value"></date-range>
                </s-form-item>
            </div>
            <div class="search_btn">
                <s-button icon="magnifier" @click="search">查询</s-button>
            </div>
        </s-form>
        <s-button icon='add' style="margin:10px 0" @click='addBackup'>添加</s-button>
        <s-button icon='delete' style="margin:10px 0" @click="deleteView()">批量删除</s-button>
        <s-table-page  :data='taskData'
                         @selection-change="assetsSelectHandle">
          <s-table-column type="selection" width="55">
          </s-table-column>
          <s-table-column prop="taskName" label="任务名称">
          </s-table-column>
          <s-table-column prop="task" label="任务类型">
            <template slot-scope="scope">
              <span v-if="scope.row.isPeriod===1">周期</span>
              <span v-if="scope.row.isPeriod===0">非周期</span>
            </template>
          </s-table-column>
          <s-table-column prop="taskPeriodName" label="周期"></s-table-column>
          <s-table-column prop="lastTimeString" label="上次执行时间"></s-table-column>
          <s-table-column prop="nextTimeString" label="下次执行时间"></s-table-column>
          <s-table-column prop="userName" label="创建者"></s-table-column>
          <s-table-column prop="creatTme" label="创建时间"></s-table-column>
          <s-table-column prop="remark" label="备注"></s-table-column>
          <s-table-column label="操作" width="200">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看" @click="eyeView(scope.row)"></i>
              <i class="iconfont icon-edit" title="编辑" @click="editView(scope.row)"></i>
              <i class="icon iconfont icon-asset-allocation" title="查看结果" @click="eyeResult(scope.row)"></i>
              <i class="iconfont icon-delete" title="删除" @click="deleteTask(scope.row)"></i>
            </template>
          </s-table-column>
        </s-table-page>
        <add-Backup-TaskDialog :title='title' @resore='resore'  v-model="addBackupDialog" v-if="addBackupDialog" :taskNameArr="taskNameArr"></add-Backup-TaskDialog>
        <edit-Backup-TaskDialog  @resore='resore' :editBackupData='editBackupData' v-model="editBackupDialog" v-if="editBackupDialog" :taskNameArr="taskNameArr"></edit-Backup-TaskDialog>
        <view-Backup-TaskDialog v-model="viewBackupDialog" :viewBackupData='viewBackupData' v-if="viewBackupDialog"></view-Backup-TaskDialog>
        <view-Result-Dialog v-model="ViewResultDialog" :viewResult='viewResult' v-if="ViewResultDialog"></view-Result-Dialog>
  </div>
</template>
<script>
// import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
import {cloneDeep} from 'lodash'
import DateRange from '@/components/tableCom/src/DateRange';
import {multiSearch} from 'sunflower-common-utils';
import addBackupTaskDialog from './BackupTaskDialog/AddBackupTaskDialog'
import editBackupTaskDialog from './BackupTaskDialog/editBackupTaskDialog'
import viewBackupTaskDialog from './BackupTaskDialog/ViewBackupTaskDialog'
import viewResultDialog from './BackupTaskDialog/ViewResultDialog'
import $axios from 'sunflower-ajax';
  export default {
    data() {
      return {
        taskData: [],
        addBackupDialog: false,
        viewBackupDialog: false,
        ViewResultDialog: false,
        editBackupData: {},
        viewBackupData: {},
        editBackupDialog: false,
        viewResult: [],
        title: '添加',
        selectionData: [],
        AuditSearchForm: {
          taskName: '',
          taskPeriodName: '',
          lastTimeString: {
            type: 'datetimerange',
            value: []
          },
          nextTimeString: {
            type: 'datetimerange',
            value: []
          },
          userName: ''
        },
        saveData: [],
        taskNameArr: []
      }
    },
    components: {
      // RealPageTable,
      addBackupTaskDialog,
      viewBackupTaskDialog,
      viewResultDialog,
      editBackupTaskDialog,
      DateRange
    },
    created() {
      this.getData()
    },
    methods: {
      addBackup() {
        this.title = '添加'
        this.addBackupDialog = true
      },
      getData() {
        let form = cloneDeep(this.AuditSearchForm)
        $axios.post(`/netConfigTask/getTaskList`, form).then(({data}) => {
          data.map(val => {
            if (val.isPeriod === 0) {
              val.taskPeriodName = '-'
            }
          })
          this.saveData = data
          this.taskData = data
          this.taskNameArr = this.taskData.map(v => {
            return v.taskName
          });
        })
      },
      search() {
        let vm = this
        let form = cloneDeep(vm.AuditSearchForm)
        this.taskData = multiSearch(form, this.saveData);
      },
      assetsSelectHandle(val) {
        this.selectionData = val
      },
      resore(val) {
        if (val) {
          this.getData()
        }
      },
      // 查看
      eyeView(row) {
        this.viewBackupDialog = true
        this.viewBackupData = row
      },
      // 编辑
      editView(row) {
        $axios.get(`/netConfigTask/getTaskDetailByuuid/${row.uuid}`).then(res => {
          this.editBackupData = res.data
          this.editBackupDialog = true
          this.title = '编辑'
        })
      },
      // 删除
      deleteTask(row) {
        this.$confirm('确定删除所选内容？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.post(`/netConfigTask/deleteCollectTask`, [row.uuid]).then(({data}) => {
            if (data === 'true') {
              this.$message.success('删除备份任务成功');
              this.getData()
            } else {
              this.$message.error('删除备份任务失败');
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消！'
          })
        })
      },
      deleteView() {
        let selectionUuid = this.selectionData.map(e => e.uuid)
        if (selectionUuid.length === 0) {
          this.$message.error('请至少选择一个备份任务');
        } else {
          this.$confirm('确定删除所选内容？', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.post(`/netConfigTask/deleteCollectTask`, selectionUuid).then(({data}) => {
              if (data === 'true') {
                this.$message.success('删除备份任务成功');
                this.getData()
              } else {
                this.$message.error('删除备份任务失败');
              }
            })
          }).catch(() => {
          })
        }
      },
      // 查看结果
      eyeResult(row) {
        $axios.get(`/netConfigTask/getTaskDetailByuuid/${row.uuid}`).then(res => {
          this.viewResult = res.data
          this.viewResult.taskId = row.uuid
          this.ViewResultDialog = true
        })
      }
    }
  }
</script>
<style lang="stylus">
</style>
