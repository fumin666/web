<!--
 * @Author: mybells
 * @Version://清远自定义报表
 * @Description:报表中心-数据库审计-自定义报表->报表配置
 * @Date: 2020-03-18 09:55:55
 * @LastEditors: mybells
 -->
<template>
  <section>
    <s-table-page :data="topLists" :header-search="searchDef()" :header-actions='getActionsDef()' @selection-change='selection' style="width: 100%;">
      <s-table-column type="selection" width="45"></s-table-column>
      <s-table-column label="报表名称" prop="name" width="170px"></s-table-column>
      <s-table-column label="报表类型" prop="typeStr" :filters="typeFilters" :filter-method="typeFilterM">
      </s-table-column>
      <s-table-column label="生成周期" prop="isPeriodicTaskStr"></s-table-column>
      <s-table-column label="输出格式" prop="fileTypeStr" :filters="fileTypeFilters" :filter-method="fileTypeFilterM"> </s-table-column>
      <s-table-column label="是否可用" prop="isActiveStr" :filters="fileActiveFilters" :filter-method="fileActiveFilterM"></s-table-column>
      <s-table-column label="创建时间" prop="createTimeStr">
        <template slot-scope="scope">
          {{scope.row.createTimeStr || '--'}}
        </template>
      </s-table-column>
      <s-table-column label="上次生成时间" prop="lastOptTimeStr">
        <template slot-scope="scope">
          {{scope.row.lastOptTimeStr || '--'}}
        </template>
      </s-table-column>
      <s-table-column label="操作" width="250">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" @click="eyeConfig(scope.row)" title="查看报表配置" ></i>
          <i class="iconfont icon-info" @click="eyeGenerate(scope.row)" title="查看生成报表" ></i>
          <i class="iconfont icon-edit" @click="edit(scope.row)" title="编辑" ></i>
          <i class="iconfont icon-pause" v-if="scope.row.isActive&&!(scope.row.isActive&&scope.row.isPeriodicTask===0)" @click="pauseStatus(scope.row)" title="暂停" ></i>
          <i class="iconfont icon-start" v-if="!scope.row.isActive&&!(scope.row.isActive&&scope.row.isPeriodicTask===0)" @click="startStatus(scope.row)" title="开启" ></i>
          <i class="iconfont icon-send" @click="sendStatus(scope.row)" title="发送状态" ></i>
          <i class="iconfont icon-delete" @click="del([scope.row.uuid], [scope.row])" title="删除" ></i>
        </template>
      </s-table-column>
    </s-table-page>
    <!-- 添加编辑自定义报表 -->
    <AddEditCustom v-if="addEditDialog" :addEditDialog.sync="addEditDialog" :isAdd="isAdd" :rowUuid="rowUuid" @reload="getList"></AddEditCustom>
    <!-- 查看完成报表 -->
    <GenerateReport v-if="generateReportDialog" :generateReportDialog.sync="generateReportDialog" :rowUuid="rowUuid"></GenerateReport>
    <!-- 查看发送状态 -->
    <SendStatus v-if="sendStatusDialog" :sendStatusDialog.sync="sendStatusDialog" :rowUuid="rowUuid"></SendStatus>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import AddEditCustom from './ConfigDialog/AddEditCustom'
  import GenerateReport from './ConfigDialog/GenerateReport'
  import SendStatus from './ConfigDialog/SendStatus'
  export default {
    components: {
      AddEditCustom,
      GenerateReport,
      SendStatus
    },
    data() {
      return {
        topLists: [],
        selectionList: [],
        typeFilters: [
          {text: '审计报表', value: '审计报表'},
          {text: '事件报表', value: '事件报表'}
        ],
        fileTypeFilters: [
          {text: 'PDF', value: 'pdf'},
          {text: 'EXCEL', value: 'excel'},
          {text: 'WORD', value: 'word'}
        ],
        fileActiveFilters: [
          {text: '是', value: '是'},
          {text: '否', value: '否'}
        ],
        isAdd: 'add',
        addEditDialog: false,
        generateReportDialog: false,
        sendStatusDialog: false,
        rowUuid: ''
      }
    },
    methods: {
      typeFilterM(value, row) {
        return row.typeStr === value
      },
      fileTypeFilterM(value, row) {
        return row.fileTypeStr === value
      },
      fileActiveFilterM(value, row) {
        return row.isActiveStr === value
      },
      getList() {
        $axios.post(`/dbaCustomReport/getTaskList`).then((res) => {
          this.topLists = res.data || [];
        });
      },
      searchDef() {
        return {
          width: 10,
          offset: 20,
          placeholder: '请输入关键字',
          searchProps: ['name', 'isPeriodicTaskStr', 'createTimeStr', 'lastOptTimeStr']
        }
      },
      getActionsDef() {
        let self = this
        return {
          width: 14,
          actions: [{
            name: '添加',
            icon: 'plus',
            click() {
              self.addEditDialog = true;
              self.isAdd = 'add';
            }
          }, {
            name: '批量删除',
            icon: 'delete',
            click() {
              let uuidArr = self.selectionList.map(item => item.uuid);
              self.del(uuidArr, self.selectionList);
            }
          }]
        }
      },
      selection(arr) {
        this.selectionList = arr;
      },
      eyeConfig(row) {
        this.isAdd = 'eye';
        this.rowUuid = row.uuid;
        this.addEditDialog = true;
      },
      eyeGenerate(row) {
        this.rowUuid = row.uuid;
        this.generateReportDialog = true;
      },
      edit(row) {
        this.addEditDialog = true;
        this.isAdd = 'edit';
        this.rowUuid = row.uuid;
      },
      pauseStatus(row) {
        this.$confirm('您确定要暂停吗?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.get(`/dbaCustomReport/pausedTask/${row.uuid}`).then(({data}) => {
            if (data.state) {
              this.$message({
                message: '已暂停',
                type: 'success'
              });
              this.getList();
            } else {
              this.$message({
                message: '暂停失败',
                type: data.errormsg
              })
            }
          })
        }).catch(() => {});
      },
      startStatus(row) {
        $axios.get(`/dbaCustomReport/resumeTask/${row.uuid}`).then(({data}) => {
          if (data.state) {
            this.$message({
              message: '开启成功',
              type: 'success'
            });
            this.getList();
          } else {
            this.$message({
              message: '开启失败',
              type: data.errormsg
            })
          }
        })
      },
      sendStatus(row) {
        this.rowUuid = row.uuid;
        this.sendStatusDialog = true;
      },
      del(uuidArr) {
        if (uuidArr.length) {
          this.$confirm('确定删除?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.post(`/dbaCustomReport/batchRemoveTask`, uuidArr).then(({data}) => {
              if (data.state === true) {
                this.$message({message: '删除成功!', type: 'success'});
                this.getList();
              } else {
                this.$message({message: data.errormsg, type: 'error'});
              }
            });
          }).catch(() => {});
        } else {
          this.$message({
            message: '请选择要删除的数据！',
            type: 'warning'
          });
        }
      }
    },
    created() {
      this.getList();
    }
  }
</script>
