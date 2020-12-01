<!--
 * @Author: 高建鹏
 * @Date: 2019-05-16 10:18:46
 * @LastEditors  : mybells
 * @Description: 查看定时任务的同步结果
 * @Position:
 -->

<template>
  <section class="fileList">
    <s-form :inline="true" :model="SearchForm" class="search_form" label-width='75px'>
      <div>
        <s-form-item label="执行时间：">
          <s-date-picker v-model="SearchForm.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                         format="yyyy-MM-dd HH:mm:ss" placeholder="选择起始时间" :editable="false"
                         @change="getDateRangeStart">
          </s-date-picker>
          ~
          <s-date-picker v-model="SearchForm.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                         format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" :editable="false" @change="getDateRangeEnd">
          </s-date-picker>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon='magnifier' @click="search">查询</s-button>
      </div>
    </s-form>
    <div style="margin: 20px 0">
      <div class="fl">
        <s-button icon="batch-del" @click="handleDeletes">批量删除</s-button>
      </div>
      <div class="fr">
        <s-button icon="arrow-left" @click="goback"></s-button>
      </div>
      <div class="cb"></div>
    </div>
    <s-table-page  :data="resultData" @selection-change="handleSelection">
      <s-table-column type="selection"></s-table-column>
      <s-table-column label="执行时间" prop="ZXSJ"></s-table-column>
      <s-table-column label="任务名称" prop="RWMC">
      </s-table-column>
      <s-table-column label="同步结果" prop="TBJG"></s-table-column>
      <s-table-column label="操作">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看详情" @click="scan(scope.row)"> </i>
          <i class="iconfont icon-delete" title="删除" @click="del(scope.row)"> </i>
        </template>
      </s-table-column>
    </s-table-page>

    <!--查看同步结果-->
    <s-dialog v-model="syncResultDialog" v-if="syncResultDialog" width="900px" title="查看同步结果详情">
      <AssetsResultDetailDialog ref="resultDetail" :syncResultList="syncResultList"></AssetsResultDetailDialog>
    </s-dialog>

  </section>
</template>
<script>
  // import SearchBox from '@/components/tableCom/src/SearchBox';
  import AssetsResultDetailDialog from './AssetsResultDetail.vue';
  import {multiSearch} from 'sunflower-common-utils';
  // import {cloneDeep} from 'lodash';
  // import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        resultData: [{ZXSJ: '2019-05-20 15:06:15', RWMC: 'test', TBJG: '成功1个，失败0个'}],
        selectionList: [],
        syncResultDialog: false,
        SearchForm: {
          startTime: '',
          endTime: ''
        },
        syncResultList: []
      }
    },
    components: {
      // SearchBox,
      AssetsResultDetailDialog
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
          }
        }
        this.tableData = multiSearch(form, this.resultData);
      },
      /* 获取列表数据 */
      getList() {
        // $axios.post('/collectTask/getTaskList', {}).then((res) => {
        //   this.resultData = res.data;this.tableData = cloneDeep(res.data);
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
