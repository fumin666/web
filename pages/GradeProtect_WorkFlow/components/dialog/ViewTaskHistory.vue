<!--
 * @Author: songyf
 * @Date: 2020-1-19
 * @LastEditors: songyf
 * @Description: 安全通报-安全通报任务-查看任务执行历史记录
 -->
<template>
  <s-dialog v-model="dialogFlag" title="查看任务执行历史记录" width="800px" append-to-body class="senior-box">
    <s-scrollbar wrap-class="default-dialog-scroll">
      <s-form :inline="true" :model="searchForm" class="search_form" style="margin:10px 0" label-width='120px'>
        <div>
          <s-form-item label="开始执行时间：">
            <s-date-picker v-model="searchForm.executeStartTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择起始时间" :editable="false" @change="getDateRangeStart">
            </s-date-picker>
            ~
            <s-date-picker v-model="searchForm.executeEndTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" :editable="false" @change="getDateRangeEnd">
            </s-date-picker>
          </s-form-item>
          <s-form-item label="状态：">
            <s-select v-model="searchForm.singleStatus">
              <s-option label="已完成" :value="1"></s-option>
              <s-option label="进行中" :value="0"></s-option>
            </s-select>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button icon='magnifier' @click="search">查询</s-button>
        </div>
      </s-form>
      <s-button icon="batch-del" @click="bathDel" style="margin-bottom: 10px">批量删除</s-button>
      <RealPageTable
        :ajax-obj="ajaxObj"
        @selection-change="selectionChange">
        <s-table-column type="selection" width="45" :reserve-selection="true">
        </s-table-column>
        <s-table-column prop="bulletinName" label="工作主题" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="executeStartTime" label="开始执行时间" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.executeStartTime | filterTime}}
          </template>
        </s-table-column>
        <s-table-column prop="executeEndTime" label="结束执行时间" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.executeEndTime | filterTime}}
          </template>
        </s-table-column>
        <s-table-column prop="singleStatus" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.singleStatus | filterStatus}}
          </template>
        </s-table-column>
        <s-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <i class="iconfont icon-source" title="查看任务执行结果" @click="viewTaskResult(scope.row)"></i>
            <i class="iconfont icon-delete" title="删除"  @click="resultDelete(scope.row)"></i>
          </template>
        </s-table-column>
      </RealPageTable>
    </s-scrollbar>
    <!--查看任务执行执行结果-->
    <view-task-result
      v-if="viewTaskResultFlag"
      v-model="viewTaskResultFlag"
      :rowData="rowData"
      :resultData="resultData"
      :resultType="resultType"
      :historyType="true"
    >
    </view-task-result>

  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {timeStamp, parseNumAllTime} from 'sunflower-common-utils'
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  import viewTaskResult from '@/pages/GradeProtect_WorkFlow/components/dialog/ViewTaskResult'
  export default {
    components: {
      RealPageTable,
      viewTaskResult
    },
    data() {
      return {
        dialogFlag: false,
        viewTaskResultFlag: false,
        resultType: 1,
        searchForm: {
          executeStartTime: null,
          executeEndTime: null,
          singleStatus: 1
        },
        ajaxObj: {
          type: 'post',
          url: '/safetyPlatform/bulletinIssuedTask/getSafeTaskHistoryRecord',
          params: {
            condition: {
            }
          }
        },
        resultData: [],
        selections: []
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      rowData: {
        type: Object,
        default: null
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    },
    filters: {
      filterTime(val) {
        return parseNumAllTime(val)
      },
      filterStatus(val) {
        return val === 0 ? '未完成' : '进行中'
      }
    },
    created() {
      this.$nextTick(() => {
        this.getList()
      })
    },
    methods: {
      getList() { // 人员列表
        let params = {
          safeTaskUuid: this.rowData.uuid,
          executeStartTime: this.searchForm.executeStartTime,
          executeEndTime: this.searchForm.executeEndTime,
          singleStatus: this.searchForm.singleStatus
        }
        params.executeStartTime = timeStamp(params.executeStartTime)
        params.executeEndTime = timeStamp(params.executeEndTime)
        this.ajaxObj.params.condition = params;
      },
      search() {
        this.getList()
      },
      selectionChange(val) {
        this.selections = val
      },
      getDateRangeStart(value) {
        let start = this.searchForm.executeStartTime ? new Date(this.searchForm.executeStartTime).getTime() : 0
        let end = this.searchForm.executeEndTime ? new Date(this.searchForm.executeEndTime).getTime() : 0
        if (end) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.searchForm.executeStartTime = null;
          }
        }
      },
      getDateRangeEnd(value) {
        let start = this.searchForm.executeStartTime ? new Date(this.searchForm.executeStartTime).getTime() : 0
        let end = this.searchForm.executeEndTime ? new Date(this.searchForm.executeEndTime).getTime() : 0
        if (start) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.searchForm.executeEndTime = null;
          }
        }
      },
      viewTaskResult(row) { // 查看任务执行结果
        this.resultType = 1;
        this.resultData = row.executionResultVos
        this.viewTaskResultFlag = true
      },
      bathDel() { // 批量批量删除
        if (this.selections.length) {
          this.delAxios(this.selections)
        } else {
          this.$message({
            message: '请选择要删除的数据！',
            type: 'warning'
          });
        }
      },
      resultDelete(row) { // 单个删除
        this.delAxios(row)
      },
      delAxios(arr) {
        let paramArr = [arr.uuid];
        if (arr instanceof Array) { // 如果是批量删除
          let arrUuid = arr.map(item => item.uuid);
          paramArr = [...arrUuid]
        }
        this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          $axios.post(`/safetyPlatform/bulletinIssuedTask/batchDeleteHistoryRecord`, paramArr, {
            data: arr,
            logTemplate: `删除|任务执行历史记录(#bulletinName#)`
          }).then(({data}) => {
            if (data.state === true) {
              this.$message({message: '删除成功!', type: 'success'});
              this.getList();
            } else {
              this.$message({message: '删除失败!', type: 'error'});
            }
          });
        }).catch(() => {
        });
      }
    }
  }
</script>
<style>
</style>

