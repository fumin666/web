<template>
  <section class="operationTalkDetail">
    <s-table-page
      :data="talkDetails.session"
      :header-search="{show: false}"
      :pagination-show = false>
      <s-table-column label="数据库" prop="db_name" show-overflow-tooltip></s-table-column>
      <s-table-column label="数据库类型" prop="db_type"></s-table-column>
      <s-table-column label="登录工具" prop="client_tools"></s-table-column>
      <s-table-column label="登录名" prop="account_name" show-overflow-tooltip></s-table-column>
      <s-table-column label="SQL条数">
        <template slot-scope="scope">
          <div v-if="scope.row.sql_total === null || scope.row.sql_total === ''">0</div>
          <div v-else>{{scope.row.sql_total}}</div>
        </template>
      </s-table-column>
      <s-table-column label="流入流量">
        <template slot-scope="scope">
          <div v-if="scope.row.in_flow_view === null || scope.row.in_flow_view === ''">0</div>
          <div v-else>{{scope.row.in_flow_view}}</div>
        </template>
      </s-table-column>
      <s-table-column label="流出流量">
        <template slot-scope="scope">
          <div v-if="scope.row.out_flow_view === null || scope.row.out_flow_view === ''">0</div>
          <div v-else>{{scope.row.out_flow_view}}</div>
        </template>
      </s-table-column>
    </s-table-page>
    <s-scrollbar wrap-class="logWrapHeight">
      <page-infinite-table loading-text="正在加载中" :ajax-obj="axiosHistoryObj" :startAjax="getHistoryFlag" ref="infiniteTable" key="infiniteTable">
        <s-table-column label="操作类型" prop="opt_name" width="90px"></s-table-column>
        <s-table-column label="操作指令" prop="dbo_name" width="90px"></s-table-column>
        <s-table-column label="开始时间" prop="start_time" width="130px" show-overflow-tooltip></s-table-column>
        <s-table-column label="结束时间" prop="end_time" width="130px" show-overflow-tooltip></s-table-column>
        <s-table-column label="登录状态" width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.is_successful">成功</div>
            <div v-else>失败</div>
          </template>
        </s-table-column>
        <s-table-column label="返回行数" prop="result_num" width="100px"></s-table-column>
        <s-table-column label="影响行数" prop="affect_rows" width="100px"></s-table-column>
        <s-table-column label="返回长度" prop="return_data_len" width="100px"></s-table-column>
        <s-table-column
          label="操作">
          <template slot-scope="scope">
            <i class="iconfont icon-eye" title="SQL详情" @click="checkHandle(scope.$index, scope.row)"></i>
          </template>
        </s-table-column>
      </page-infinite-table>
    </s-scrollbar>
  </section>
</template>

<script>
  // import $axios from 'sunflower-ajax'
  import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'

  export default {
    components: {
      pageInfiniteTable
    },
    data() {
      return {
        getHistoryFlag: false,
        axiosHistoryObj: {
          type: 'post',
          url: '/dbOperation/list',
          params: {
            condition: {}
          }
        }
      }
    },
    props: ['talkDetails', 'dbs_id'],
    methods: {
      checkHandle(index, row) {
        this.$emit('showSqlDetail', row.dbs_id, row.sql_id)
      },
      search() {
        var vm = this;
        vm.axiosHistoryObj.params.condition = Object.assign({}, {dbs_id: vm.dbs_id});
        vm.getHistoryFlag = true;
      }
    },
    created() {
      this.search()
    },
    // 每次传回的id不一样，则重新请求
    watch: {
      dbs_id: {
        immediate: true,
        handler() {
          this.search();
        }
      }
    }
  }
</script>
