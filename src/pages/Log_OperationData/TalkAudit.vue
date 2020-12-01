<template>
  <section class="content talkAudit">
    <s-form :inline="true" class="search_form" label-width="90px" style="margin: 10px 0;">
      <div>
        <s-form-item label="数据库名称：">
          <s-select v-model="dbName">
            <s-option v-for="item in selectDbName" :label="item.dbi_name" :value="item.dbi_uuid" :key="item.dbi_uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="数据库IP：">
          <s-input v-model="dbIp"></s-input>
        </s-form-item>
        <s-form-item label="客户端IP：">
          <s-input v-model="clientIp"></s-input>
        </s-form-item>
        <s-form-item label="客户端MAC：" label-width="100px">
          <s-input v-model="clientMac" style="width: 175px;"></s-input>
        </s-form-item>
        <s-form-item label="数据库登录名：" label-width="110px">
          <s-input v-model="accountName" style="width: 165px;"></s-input>
        </s-form-item>
        <s-form-item label="登录状态：">
          <s-select v-model="statusValue">
            <s-option label="所有" value="-1"></s-option>
            <s-option label="成功" value="1"></s-option>
            <s-option label="失败" value="0"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="登录时间：">
          <s-date-picker
            v-model="startTimeValue"
            type="datetime"
            :editable="editable"
            value-format="yyyy-MM-dd HH:mm:ss"
            :value-format-flag="true"
            @change="getStartTime">
          </s-date-picker>
          <span>到</span>
          <s-date-picker
            v-model="endTimeValue"
            type="datetime"
            :editable="editable"
            value-format="yyyy-MM-dd HH:mm:ss"
            :value-format-flag="true"
            @change="getEndTime">
          </s-date-picker>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" title="查询" @click="search()">查询</s-button>
      </div>
    </s-form>
    <page-infinite-table loading-text="正在加载中" :ajax-obj="axiosHistoryObj" :startAjax="getHistoryFlag" ref="infiniteTable" key="infiniteTable">
      <s-table-column label="数据库名称" prop="db_name" show-overflow-tooltip></s-table-column>
      <s-table-column label="数据库IP" prop="dbi_ip" show-overflow-tooltip></s-table-column>
      <s-table-column label="客户端IP" prop="client_ip" show-overflow-tooltip></s-table-column>
      <s-table-column label="客户端MAC" prop="client_mac" show-overflow-tooltip></s-table-column>
      <s-table-column label="数据库登录名">
        <template slot-scope="scope">
          <div v-if="scope.row.account_name === ''">已连接用户</div>
          <div v-else> {{scope.row.account_name}} </div>
        </template>
      </s-table-column>
      <s-table-column label="登入时间" prop="login_time"></s-table-column>
      <s-table-column label="登出时间">
        <template slot-scope="scope">
          <div v-if="scope.row.logout_time === null">在线</div>
          <div v-else> {{scope.row.logout_time}} </div>
        </template>
      </s-table-column>
      <s-table-column label="登录状态">
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
    <s-dialog
      v-model="bloomDataDetail"
      v-if="bloomDataDetail"
      title="详细信息"
      key="bloomDataDetail"
      width="1050PX">
      <talk-detail ref="talk-detail" :talkDetails='talkDetail' :dbs_id="talkId" @showSqlDetail="showsqlId"></talk-detail>
    </s-dialog>
    <s-dialog
      v-model="bloomSql"
      v-if="bloomSql"
      title="查看信息"
      key="bloomSql"
      width="1000PX">
      <sql-detail ref="sql-detail" :showResultSet=1 :sql="sqlMsg" @setSqlList="getSqlList" :key="key"></sql-detail>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'

  import TalkDetail from './TalkDetail'
  import SqlDetail from './SqlDetail'
  // import searchBox from '@/components/tableCom/src/SearchBox'
  import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'

  export default {
    components: {

      TalkDetail,
      SqlDetail,
      // searchBox,
      pageInfiniteTable
    },
    data() {
      return {
        dbName: '',
        selectDbName: [],
        dbIp: '',
        clientIp: '',
        clientMac: '',
        accountName: '',
        statusValue: '-1',
        startTimeValue: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 00:00:00`,
        endTimeValue: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 23:59:59`,
        bloomDataDetail: false,
        bloomSql: false,
        talkDetail: {},
        talkId: [],
        sql_id: '',
        session_index: '',
        sqlMsg: {},
        session: [],
        editable: false,
        sqlDetail: {},
        key: 1,
        getHistoryFlag: false,
        axiosHistoryObj: {
          type: 'post',
          url: '/dbSession/list',
          params: {
            condition: {}
          }
        }
      }
    },
    methods: {
        // 操作列的查看详情
      checkHandle(index, row) {
        let vm = this;
        vm.bloomDataDetail = true;
        vm.talkId = row.dbs_id;
        $axios.get('/dbSession/sessionView/' + row.dbs_id).then((res) => {
          vm.talkDetail = res.data;
          // console.log(res.data)
        });
      },
      search() {
        var vm = this;
        vm.axiosHistoryObj.params.condition = Object.assign({}, {account_name: this.accountName, client_ip: this.clientIp, client_mac: this.clientMac, dbi_uuid: this.dbName, dbi_ip: this.dbIp, end_time: this.endTimeValue, start_time: this.startTimeValue, is_successful: Number(this.statusValue)});
        vm.getHistoryFlag = true;
      },
      getSelect() {
        var vm = this;
        $axios.get('/dbOperation/getAlldbNames').then((res) => {
          if (res.data instanceof Array) {
            vm.selectDbName = res.data;
            // console.log(res.data)
          }
        })
      },
      showsqlId(val1, val2) {
        let vm = this;
        vm.sql_id = val2;
        $axios.get('/dbOperation/view/' + val1 + '/' + val2).then((res) => {
           vm.bloomSql = true;
           vm.sqlMsg = res.data;
           vm.session_index = res.data.session_index;
        });
      },
      getSqlList(val) {
        if (val === 2) {
          $axios.get(`/dbSession/sqlResult/${this.sql_id}/${this.session_index}`).then((res) => {
            if (res.data.datas !== null) {
              this.$refs['sql-detail'].groups = res.data
            }
            // console.log(res.data)
          });
        }
      },
      getStartTime(val) {
      let beginVal = new Date(Date.parse(val)).getTime();
        let endValue = new Date(Date.parse(this.endTimeValue)).getTime();
        if (beginVal >= endValue) {
          this.startTimeValue = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.startTimeValue = val;
        }
      },
      getEndTime(val) {
        let endVal = new Date(Date.parse(val)).getTime();
        let beginValue = new Date(Date.parse(this.startTimeValue)).getTime();
        if (endVal <= beginValue) {
          this.endTimeValue = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.endTimeValue = val;
        }
      }
    },
    props: {
      uuid: {
        type: String,
        default: ''
      }
    },
    created() {
      this.getSelect();
      if (this.uuid !== '') {
        this.dbName = this.uuid
      }
      this.search();
    }
  }
</script>
