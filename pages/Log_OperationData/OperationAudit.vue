<!--
 * @Description: 报表中心->业务数据库统计报表    操作审计
 -->

<template>
  <section class="content operationAudit">
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
        <s-form-item label="操作指令：">
          <s-select v-model="statusValue">
            <s-option v-for="item in selectOrder" :label="item.dbo_expand ? item.dbo_key + ' ' + item.dbo_expand : item.dbo_key" :value="item.dbo_id" :key="item.dbo_id"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="开始时间：">
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
      <s-table-column label="数据库名称" prop="dbi_name" show-overflow-tooltip></s-table-column>
      <s-table-column label="数据库IP" prop="dbi_ip"></s-table-column>
      <s-table-column label="客户端IP" prop="client_ip"></s-table-column>
      <s-table-column label="客户端MAC" prop="client_mac"></s-table-column>
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
    <s-dialog
      v-model="bloomSql"
      v-if="bloomSql"
      title="详细信息"
      key="bloomSql"
      width="1000px">
      <sql-detail ref="sql-detail" :showResultSet=1 :sql="sqlMsg" @setSqlList="getSqlList"></sql-detail>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'

  import SqlDetail from './SqlDetail'
  // import searchBox from '@/components/tableCom/src/SearchBox'
  import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  export default {
    components: {

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
        statusValue: '',
        startTimeValue: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 00:00:00`,
        endTimeValue: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 23:59:59`,
        OperationLists: [],
        bloomSql: false,
        sqlMsg: [],
        session_index: '',
        selectOrder: [],
        editable: false,
        getHistoryFlag: false,
        axiosHistoryObj: {
          type: 'post',
          url: '/dbOperation/list',
          params: {
            condition: {}
          }
        },
        row: {
          dbs_id: '',
          sql_id: ''
        }
      }
    },
    // 显示那个tab页调用对应的ajax；是否是是通过sql模式审计进来的
    props: {
      isSearchOperation: {
        type: String,
        default: ''
      }
    },
    methods: {
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
      },
      search() {
        var vm = this;
        if (this.isSearchOperation) {
          vm.axiosHistoryObj.params.condition = Object.assign({}, {startTime: vm.startTimeValue, endTime: vm.endTimeValue, pattern_md5: vm.isSearchOperation, account_name: vm.accountName, client_ip: vm.clientIp, client_mac: vm.clientMac, dbi_name: vm.dbName, dbi_ip: vm.dbIp, dbo_id: this.statusValue === '' ? -1 : vm.statusValue});
          vm.getHistoryFlag = true;
        } else {
          vm.axiosHistoryObj.params.condition = Object.assign({}, {account_name: this.accountName, client_ip: this.clientIp, client_mac: this.clientMac, dbi_uuid: this.dbName, dbi_ip: this.dbIp, dbo_id: this.statusValue === '' ? -1 : this.statusValue, end_time: this.endTimeValue, start_time: this.startTimeValue});
          vm.getHistoryFlag = true;
        }
      },
      getSelect() {
        var vm = this;
        $axios.get('/dbOperation/getOperationTypes').then((res) => {
          if (res.data instanceof Array) {
            vm.selectOrder = res.data;
          }
        });
        $axios.get('/dbOperation/getAlldbNames').then((res) => {
          if (res.data instanceof Array) {
            vm.selectDbName = res.data;
          }
        })
      },
      getStartTime(val) {
        let beginVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let endValue = new Date(Date.parse(this.endTimeValue.replace(/-/g, '/'))).getTime();
        if (beginVal >= endValue) {
          this.startTimeValue = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.startTimeValue = val;
        }
      },
      getEndTime(val) {
        let endVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let beginValue = new Date(Date.parse(this.startTimeValue.replace(/-/g, '/'))).getTime();
        if (endVal <= beginValue) {
          this.endTimeValue = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.endTimeValue = val;
        }
      },
      formatDate(seconds) { // 时间戳转化
        if (seconds) {
          let date = new Date()
          date.setTime(seconds * 1000)
          let _month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
          let _date = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
          let _hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
          let _minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
          let _second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
          let dateStr = `${date.getFullYear()}-${_month}-${_date} ${_hour}:${_minute}:${_second}`
          return dateStr
        } else {
          return ''
        }
      }
    },
    // 如果isSearchOperation，则为通过sql模式审计进入的查看页面，再次调用查询，参数为时间和pattern_md5
    created() {
      this.search();
      this.getSelect();
      if (this.isSearchOperation) {
        var vm = this;
        vm.startTimeValue = null;
        vm.endTimeValue = null;
        vm.axiosHistoryObj.params.condition = Object.assign({}, {startTime: vm.startTimeValue, endTime: vm.endTimeValue, pattern_md5: vm.isSearchOperation, account_name: vm.accountName, client_ip: vm.clientIp, client_mac: vm.clientMac, dbi_name: vm.dbName, dbi_ip: vm.dbIp, dbo_id: this.statusValue === '' ? -1 : vm.statusValue});
        vm.getHistoryFlag = true;
        this.getSelect();
      }
    },
    destroyed() {
      this.$emit('closeSqlEntry');
    }
  }
</script>
