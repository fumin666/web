/**
* Created by songyf on 2019/10/23.
* 运维审批-审批历史.
*/
<template>
  <div>
    <s-table-page :data='history'
                  :header-search="getSearchDef()">
      <s-table-column
        prop="specialoperCode"
        label="运维号">
      </s-table-column>
      <s-table-column
        prop="title"
        label="标题">
      </s-table-column>
      <s-table-column
        prop="specialoperTypeName"
        label="运维类型">
      </s-table-column>
      <s-table-column
        prop="applyUserName"
        label="申请人">
      </s-table-column>
      <s-table-column
        prop="approvalUserName"
        label="审批人">
      </s-table-column>
      <s-table-column
        prop="applyStatus"
        label="审批状态">
      </s-table-column>
      <s-table-column
        prop="startTime"
        label="开始时间">
      </s-table-column>
      <s-table-column
        prop="endTime"
        label="结束时间">
      </s-table-column>
      <s-table-column label="操作" width="80">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看详情" @click="viewDetails(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table-page>
    <!-- 查看详情 -->
    <view-details-dialog
      v-model="viewDetailsFlag"
      v-if="viewDetailsFlag"
      :viewdata="viewdata">
    </view-details-dialog>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import viewDetailsDialog from './dialog/ApprovalViewDetails'
  export default {
    data () {
      return {
        history: [],
        viewDetailsFlag: false,
        viewdata: {}
      }
    },
    components: {
      viewDetailsDialog
    },
    created() {
      this.getHistoryList()
    },
    methods: {
      getHistoryList() {
        $axios.get('/specialOperationApply/getSpecialoperAuditDetailList').then(res => {
          this.history = res.data
        });
      },
      getSearchDef() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入查询条件',
          searchProps: ['specialoperCode', 'title', 'specialoperTypeName', 'applyUserName', 'approvalUserName', 'applyStatus', 'startTime', 'endTime']
        }
      },
      viewDetails(row) { // 查看详情
        $axios.get(`/specialOperationApply/getSpecialoperApplyDetail/${row.applyUuid}`).then(res => {
          this.viewDetailsFlag = true;
          this.viewdata = res.data
        });
      }
    }
  }
</script>
