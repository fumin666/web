<!--
 * @Author: 高建鹏
 * @Date: 2019-05-16 10:18:46
 * @LastEditors: 高建鹏
 * @Description: 查看定时任务的稽核结果
 * @Position:
 -->

<template>
  <section class="fileList">
    <search-box :search-action="search" :show="true">
      <template slot="leftBtn">
        <s-button icon="batch-del" @click="handleDeletes">批量删除</s-button>
      </template>
      <template slot="rightBtn">
        <s-button icon="arrow-left" @click="goback"></s-button>
      </template>
      <template slot="form">
        <s-form :inline="true" :model="SearchForm" class="demo-form-inline">
          <s-form-item label="执行时间">
            <s-date-picker v-model="SearchForm.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择起始时间" :editable="false" @change="getDateRangeStart">
            </s-date-picker>
            ~
            <s-date-picker v-model="SearchForm.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" :editable="false" @change="getDateRangeEnd">
            </s-date-picker>
          </s-form-item>
          <s-form-item label="任务名称">
            <s-input v-model="SearchForm.taskName"></s-input>
          </s-form-item>
          <s-form-item label="稽核结果">
            <s-select v-model="SearchForm.result" filterable clearable>
              <s-option label="成功" value="成功"></s-option>
              <s-option label="失败" value="失败"></s-option>
            </s-select>
          </s-form-item>
        </s-form>
      </template>
    </search-box>
    <s-table-page  :data="resultData" @selection-change="handleSelection">
      <s-table-column type="selection"></s-table-column>
      <s-table-column label="执行时间" prop="ZXSJ"></s-table-column>
      <s-table-column label="任务名称" prop="taskName">
      </s-table-column>
      <s-table-column label="稽核结果" prop="result"></s-table-column>
      <s-table-column label="操作">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看详情" @click="scan(scope.row)"> </i>
          <i class="iconfont icon-delete" title="删除" @click="del(scope.row)"> </i>
        </template>
      </s-table-column>
    </s-table-page>

    <!--查看稽核结果-->
    <s-dialog v-model="syncResultDialog" v-if="syncResultDialog" width="950px" title="查看稽核结果详情">
      <AccountResultDetailDialog ref="resultDetail" :syncResultList="syncResultList"></AccountResultDetailDialog>
    </s-dialog>

  </section>
</template>

<script>
  import SearchBox from '@/components/tableCom/src/SearchBox';
  import AccountResultDetailDialog from './AccountResultDetail.vue';
  import {multiSearch} from 'sunflower-common-utils';
  // import {cloneDeep} from 'lodash';
  // import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        resultData: [{ZXSJ: '2019-05-20 15:06:15', taskName: 'test', result: '成功1个，失败0个'}],
        tableData: [],
        selectionList: [],
        syncResultDialog: false,
        SearchForm: {
          startTime: '',
          endTime: '',
          taskName: '',
          result: ''
        },
        syncResultList: []
      }
    },
    components: {
      SearchBox,
      AccountResultDetailDialog
    },
    methods: {
      getDateRangeStart(value) {
        let start = this.SearchForm.startTime ? new Date(this.SearchForm.startTime).getTime() : 0
        let end = this.SearchForm.endTime ? new Date(this.SearchForm.endTime).getTime() : 0
        if (end) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.SearchForm.startTime = '';
          }
        }
      },
      getDateRangeEnd(value) {
        let start = this.SearchForm.startTime ? new Date(this.SearchForm.startTime).getTime() : 0
        let end = this.SearchForm.endTime ? new Date(this.SearchForm.endTime).getTime() : 0
        if (start) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.SearchForm.endTime = '';
          }
        }
      },
      /* 本地搜索 */
      search() {
        let vm = this
        let form = {
          ZXSJ: {
            type: 'datetimerange',
            value: [vm.SearchForm.startTime, vm.SearchForm.endTime]
          },
          taskName: vm.SearchForm.taskName,
          result: vm.SearchForm.result
        }
        this.tableData = multiSearch(form, this.resultData);
      },
      /* 获取列表数据 */
      getList() {
        // $axios.post('/collectTask/getTaskList', {}).then((res) => {
        //   this.resultData = res.data;
        //   this.tableData = cloneDeep(this.resultData);
        // });
      },
      handleSelection(selection) {
        this.selectionList = selection
      },
      /* 批量删除 */
      handleDeletes() {
        if (this.selectionList.length) {
          // let uuidArr = this.selectionList.map(row => {
          //   return row.uuid;
          // })
          this.$confirm('确定删除选中数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.resultData = [];
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            // $axios.post(`/ipamNetsegment/batchDeleteNet`, uuidArr).then(({data}) => {
            //   if (data.state) {
            //     this.$message({
            //       type: 'success',
            //       message: '删除成功！'
            //     })
            //     this.getList();
            //   } else {
            //     this.$message({
            //       type: 'error',
            //       message: data.errormsg
            //     })
            //   }
            // })
          }).catch(() => {
          });
        } else {
          this.$message({
            type: 'warning',
            message: '选择要删除的数据！'
          })
        }
      },
      scan() {
        this.syncResultDialog = true
      },
      /* 删除任务 */
      del(row) {
        this.resultData = [];
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
      },
      goback() {
        this.$emit('back');
      }
    },
    created() {
      this.getList()
    }
  }
</script>
