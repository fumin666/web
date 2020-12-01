<template>
  <div>
    <search-box :search-action="search">
      <template slot="leftBtn">
        <s-button icon="plus" @click="add">添加</s-button>
        <s-button icon="batch-del" @click="del">批量删除</s-button>
      </template>
      <template slot="form">
        <s-form :inline="true" ref="form" :model="searchForm" class="demo-form-inline" label-width="110px">
          <s-form-item label="巡检名称" prop="inspectName">
            <s-input @keyup.enter.native="search" v-model="searchForm.inspectName"></s-input>
          </s-form-item>
          <s-form-item label="巡检周期" prop="circleType">
            <s-select v-model="searchForm.circleType" clearable>
              <s-option label="日" value="1"></s-option>
              <s-option label="周" value="2"></s-option>
              <s-option label="月" value="3"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="上次执行时间" prop="excuteTime.value">
            <s-date-picker
              v-model="searchForm.excuteTime.value"
              value-format="yyyy-MM-dd HH:mm:dd"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </s-date-picker>
            <!--<date-range v-model="searchForm.excuteTime.value" :value-format-flag="true"></date-range>-->
          </s-form-item>
          <s-form-item label="下次执行时间" prop="nextExcutetime.value">
            <s-date-picker
              v-model="searchForm.nextExcutetime.value"
              value-format="yyyy-MM-dd HH:mm:dd"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </s-date-picker>
            <!--<date-range v-model="searchForm.nextExcutetime.value" :value-format-flag="true"></date-range>-->
          </s-form-item>
          <s-form-item label="创建者">
            <s-input @keyup.enter.native="search" v-model="searchForm.creater"></s-input>
          </s-form-item>
        </s-form>
      </template>
    </search-box>
    <s-table-page :data="tableData" @selection-change="selectionChange" >
      <s-table-column type="selection" width="45" align="center"></s-table-column>
      <s-table-column label="巡检名称" prop="inspectName" show-overflow-tooltip></s-table-column>
      <s-table-column label="巡检周期" prop="circleTypeStr"></s-table-column>
      <s-table-column label="上次执行时间" prop="excuteTime" show-overflow-tooltip></s-table-column>
      <s-table-column label="下次执行时间" prop="nextExcutetime" show-overflow-tooltip></s-table-column>
      <s-table-column label="创建者" prop="creater"></s-table-column>
      <s-table-column label="创建时间" prop="createTime" show-overflow-tooltip></s-table-column>
      <s-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <i class="iconfont icon-edit" @click="rowEdit(scope.row)"></i>
          <i class="iconfont icon-delete" @click="rowDel(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table-page>

    <polling-task-add-dialog v-if="addDialogFlag" v-model="addDialogFlag" :cur-table-data="curTableData"
                             :cur-polling-task="curPollingTask" @reload="axiosTaskList">
    </polling-task-add-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import SearchBox from '@/components/tableCom/src/SearchBox';
  // import DateRange from '@/components/tableCom/src/DateRange';
  import PollingTaskAddDialog from './AssetPollingDialog/PollingTaskAddDialog.vue';
  import {multiSearch} from 'sunflower-common-utils';
  import {cloneDeep} from 'lodash';

  export default {
    data() {
      return {
        addDialogFlag: false,
        searchForm: {
          inspectName: '',
          circleType: '',
          excuteTime: {
            type: 'datetimerange',
            value: []
          },
          nextExcutetime: {
            type: 'datetimerange',
            value: []
          },
          creater: ''
        },
        resultData: [],
        tableData: [],
        curTableData: [],
        selections: [],
        curPollingTask: {}
      }
    },
    created() {
      this.axiosTaskList();
    },
    methods: {
      selectionChange(selections) {
        this.selections = selections;
      },
      search() {
        let form = Object.assign({}, {}, this.searchForm);
        this.tableData = multiSearch(form, this.resultData);
      },
      add() {
        this.curPollingTask = {};
        this.addDialogFlag = true;
      },
      del() {
        if (this.selections.length === 0) {
          this.$message({showClose: true, message: '请先选择要删除的巡检任务!', type: 'warning'});
          return;
        }
        this.axiosDel(this.selections.map(item => item.uuid));
      },
      rowEdit(row) {
        this.curPollingTask = row;
        this.addDialogFlag = true;
      },
      rowDel(row) {
        this.axiosDel([row.uuid]);
      },
      axiosTaskList() {
        $axios.post('/assetInspectTask/list', {}).then(({data}) => {
          for (let i in data) {
            if (data[i].isFinish) {
              data[i].nextExcutetime = '已结束'
            }
          }
          this.$refs['form'].resetFields();
          this.resultData = data;
          this.curTableData = data;
          this.tableData = cloneDeep(data);
        });
      },
      axiosDel(param) {
        this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          $axios.post('/assetInspectTask/delete', param).then(({data}) => {
            if (data === true) {
              this.$message({showClose: true, message: '删除成功', type: 'success'});
              this.axiosTaskList();
            } else {
              this.$message({showClose: true, message: '删除失败', type: 'error'});
            }
          });
        }).catch(() => {
        });
      }
    },
    components: {
      SearchBox,
      // DateRange,
      PollingTaskAddDialog
    },
    watch: {
      'searchForm.excuteTime.value': {
        handler: function (val) {
          if (val === null) {
            this.searchForm.excuteTime.value = [];
          }
        },
        deep: true
      },
      'searchForm.nextExcutetime.value': {
        handler: function (val) {
          if (val === null) {
            this.searchForm.nextExcutetime.value = [];
          }
        },
        deep: true
      }
    }
  }
</script>

