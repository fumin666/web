<template>
  <section id="AssetsHealthCheck">
    <s-table-page
      :data="healthCheckTasks"
      :header-search="getSearchDef()"
      :header-actions="getListActionsDef()"
      :row-actions="getRowActionsDef()"
      @selection-change="handleSelectionChange"
      actions-col-width="220">
      <s-table-column type="selection" width="45" align="center"></s-table-column>
      <s-table-column label="检查名称" prop="taskName"></s-table-column>
      <s-table-column label="执行时间" prop="execTime"></s-table-column>
      <s-table-column label="创建者" prop="createUserName"></s-table-column>
    </s-table-page>

    <s-dialog ref="addHealthCheckDialog" v-model="addHealthCheckDialog" v-if="addHealthCheckDialog" title="新建健康性检查" top="6vh" width="800px">
      <add-health-check @closeAddDialog="closeAddDialog"></add-health-check>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Download} from 'sunflower-common-utils';
  import AddHealthCheck from './Dialog/AddHealthCheck';

export default {
  data() {
    return {
      healthCheckTasks: [],           // 健康检查任务列表
      checkTaskSelections: [],        // 健康检查任务多选数据
      addHealthCheckDialog: false     // 添加健康检查任务弹框
    }
  },
  components: {
    AddHealthCheck
  },
  watch: {
  },
  methods: {
    getSearchDef() {
      return {
        width: 8,
        offset: 0,
        placeholder: '请输入检查名称、创建者查询',
        searchProps: ['taskName', 'createUserName']
      }
    },
    // 表头操作初始化
    getListActionsDef() {
      let _this = this
      return {
        width: 16,
        actions: [{
          name: '添加',
          icon: 'plus',
          click() {
            _this.addHealthCheckDialog = true;
          }
        }, {
          name: '批量删除',
          icon: 'delete',
          click() {
            _this.delHealthCheck();
          }
        }]
      }
    },
    // 表格操作列初始化
    getRowActionsDef() {
      let _this = this;
      return [{
        icon: 'eye',
        name: '查看详情',
        click(row) {
          _this.$router.push(`/AssetsAll/assetsHealthCheck/healthCheckResult/${row.uuid}`)
        }
      }, {
        icon: 'download',
        name: '下载',
        click(row) {
          Download(`/assetHealthTask/downloadTaskData/${row.uuid}`, {
            data: [row],
            logTemplate: '下载|检查名称(#taskName#)'
          });
        }
      }, {
        icon: 'start',
        name: '再次执行',
        click(row) {
          _this.reExecute(row);
        }
      }, {
        icon: 'delete',
        name: '删除',
        click(row) {
          let uuids = [row.uuid];
          _this.$confirm('确定删除当前数据?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
            $axios.post('/assetHealthTask/delTask', uuids, {
              data: [row],
              logTemplate: '删除|检查名称(#taskName#)'
            }).then(({data}) => {
              if (data && data.state) {
                _this.getHealthCheckTasks();   // 刷新列表
                _this.$message.success('删除成功！');
              } else {
                _this.$message.error('删除失败！');
              }
            })
          }).catch(() => {
          });
        }
      }]
    },
    // 获取表格多选数据
    handleSelectionChange(selections) {
      this.checkTaskSelections = selections;
    },
    // 添加健康检查任务
    addHealthCheck() {
      this.addHealthCheckDialog = true;
    },
    // 添加健康检查任务成功
    closeAddDialog() {
      this.getHealthCheckTasks();   // 刷新所有健康性检查任务列表
      this.addHealthCheckDialog = false;
    },
    // 删除健康检查任务
    delHealthCheck() {
      if (this.checkTaskSelections.length === 0) {
        this.$message.warning('请至少选择一项要删除的任务！');
        return;
      }
      let uuids = this.checkTaskSelections.map(item => item.uuid);
        this.$confirm('确定删除当前数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          $axios.post('/assetHealthTask/delTask', uuids, {
            data: this.checkTaskSelections,
            logTemplate: '删除|检查名称(#taskName#)'
          }).then(({data}) => {
            if (data && data.state) {
              this.getHealthCheckTasks();   // 刷新列表
              this.$message.success('删除成功！');
            } else {
              this.$message.error('删除失败！');
            }
          })
        }).catch(() => {
        });
    },
    // 获取所有健康性检查任务列表
    getHealthCheckTasks() {
      $axios.get('/assetHealthTask/getTaskList').then(({data}) => {
        if (data && data instanceof Array) {
          this.healthCheckTasks = data;
        }
      })
    },
    // 再次执行
    reExecute(taskUuid) {
      $axios.get(`/assetHealthTask/copyTask/${taskUuid.uuid}`, {
        data: [taskUuid],
        logTemplate: '再次执行|检查名称(#taskName#)'
      }).then(({data}) => {
        if (data && data.state) {
          this.getHealthCheckTasks();     // 刷新列表
          this.$message.success('执行成功！');
        } else {
          this.$message.error('执行失败，请重试！');
        }
      })
    }
  },
  created() {
    this.getHealthCheckTasks();   // 获取所有健康性检查任务列表
  }
}
</script>

<style lang="stylus">
</style>
