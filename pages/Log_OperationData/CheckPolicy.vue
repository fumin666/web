<template>
  <section>
    <s-tab type="card" v-model="activeName">
      <s-tab-pane label="策略审计" name="0">
        <page-infinite-table
          v-if="activeName === '0'"
          loading-text="正在加载中"
          :ajax-obj="axiosHistoryObj"
          :startAjax="getHistoryFlag"
          ref="infiniteTable"
          key="infiniteTable">
          <s-table-column label="数据库名称" prop="dbi_name" show-overflow-tooltip></s-table-column>
          <s-table-column label="数据库IP" prop="dbi_ip"></s-table-column>
          <s-table-column label="客户端IP" prop="client_ip"></s-table-column>
          <s-table-column label="数据库登录名" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.account_name === ''">已连接用户</div>
              <div v-else> {{scope.row.account_name}} </div>
            </template>
          </s-table-column>
          <s-table-column label="操作指令" prop="dbo_name" show-overflow-tooltip></s-table-column>
          <s-table-column label="开始时间" prop="start_time"></s-table-column>
          <s-table-column label="执行状态">
            <template slot-scope="scope">
              <div v-if="scope.row.is_successful">成功</div>
              <div v-else>失败</div>
            </template>
          </s-table-column>
          <s-table-column
            label="操作">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看" @click="checkHandle(scope.$index, scope.row)"></i>
            </template>
          </s-table-column>
        </page-infinite-table>
      </s-tab-pane>
      <s-tab-pane label="智能免审计" name="1">
        <not-audit-detail
          v-if="activeName === '1'"
          ref="not-audit-detail"
          :condition="condition"></not-audit-detail>
      </s-tab-pane>
    </s-tab>
    <s-dialog
      v-model="bloomSql"
      v-if="bloomSql"
      title="详细信息"
      key="bloomSql"
      width="1000px"
      append-to-body>
      <sql-detail ref="sql-detail" :showResultSet='showResultSet' :sql="sqlMsg" @setSqlList="getSqlList"></sql-detail>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'

  import SqlDetail from './SqlDetail'
  import NotAuditDetail from './NotAuditDetail'

  export default {
    components: {

      pageInfiniteTable,
      SqlDetail,
      NotAuditDetail
    },
    props: ['condition', 'showResultSet'],
    data() {
      return {
        activeName: '0',
        axiosHistoryObj: {
          type: 'post',
          url: '/dbOperation/list',
          params: {
            condition: {}
          }
        },
        getHistoryFlag: false,
        sqlMsg: [],
        session_index: '',
        bloomSql: false,
        row: {
          dbs_id: '',
          sql_id: ''
        }
      }
    },
    methods: {
      search() {
        var vm = this;
        vm.axiosHistoryObj.params.condition = this.condition
        vm.getHistoryFlag = true;
      },
      checkHandle(index, row) {
        let vm = this;
        vm.row.dbs_id = row.dbs_id;
        vm.row.sql_id = row.sql_id;
        $axios.get('/dbOperation/view/' + row.dbs_id + '/' + row.sql_id).then((res) => {
          vm.sqlMsg = res.data;
          vm.session_index = res.data.session_index;
          vm.bloomSql = true;
        });
      },
      getSqlList(val) {
        if (val === 2) {
          $axios.get(`/dbSession/sqlResult/${this.row.sql_id}/${this.session_index}`).then((res) => {
            if (res.data.datas !== null) {
              this.$refs['sql-detail'].groups = res.data
            }
          });
        }
      }
    },
    created() {
      this.search()
    }
  }
</script>
