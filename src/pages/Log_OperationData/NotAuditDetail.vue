<template>
  <section class="talkAudit">
    <!--<s-button  v-if="!condition" icon="magnifier" title="搜索" @click="showSearch = !showSearch"-->
              <!--style="float:right; margin-bottom: 10px;"></s-button>-->
    <s-form :inline="true" v-if="showSearch || !condition">
      <s-form-item label="数据库名称">
        <s-select v-model="dbName">
          <s-option v-for="item in selectDbName" :label="item.dbi_name" :value="item.dbi_uuid"
                    :key="item.dbi_uuid"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="数据库IP">
        <s-input v-model="dbIp"></s-input>
      </s-form-item>
      <s-form-item label="客户端IP">
        <s-input v-model="clientIp"></s-input>
      </s-form-item>
      <s-form-item label="数据库登录名">
        <s-input v-model="accountName"></s-input>
      </s-form-item>
      <s-form-item label="操作指令">
        <s-select v-model="statusValue">
          <s-option v-for="item in selectOrder"
                    :label="item.dbo_expand ? item.dbo_key + ' ' + item.dbo_expand : item.dbo_key" :value="item.dbo_id"
                    :key="item.dbo_id"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="开始时间">
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
      <s-form-item>
        <s-button title="查询" @click="search">查询</s-button>
      </s-form-item>
    </s-form>
    <page-infinite-table loading-text="正在加载中" :ajax-obj="axiosHistoryObj" :startAjax="getHistoryFlag"
                         ref="infiniteTable" key="infiniteTable">
      <s-table-column label="数据库名称" prop="dbi_name" show-overflow-tooltip></s-table-column>
      <s-table-column label="数据库IP" prop="dbi_ip" show-overflow-tooltip></s-table-column>
      <s-table-column label="客户端IP" prop="client_ip" show-overflow-tooltip></s-table-column>
      <s-table-column label="数据库登录名" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.account_name === ''">已连接用户</div>
          <div v-else> {{scope.row.account_name}} </div>
        </template>
      </s-table-column>
      <s-table-column label="操作指令" prop="dbo_type" show-overflow-tooltip></s-table-column>
      <s-table-column label="开始时间" prop="start_time" show-overflow-tooltip></s-table-column>
      <s-table-column label="结束时间" prop="end_time" show-overflow-tooltip></s-table-column>
      <s-table-column label="执行状态">
        <template slot-scope="scope">
          <div v-if="scope.row.is_successful">成功</div>
          <div v-else>失败</div>
        </template>
      </s-table-column>
    </page-infinite-table>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'

  import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  export default {
    components: {

      pageInfiniteTable
    },
    data() {
      return {
        showSearch: false,
        dbName: '',
        selectDbName: [],
        dbIp: '',
        clientIp: '',
        accountName: '',
        statusValue: '',
        startTimeValue: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 00:00:00`,
        endTimeValue: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 23:59:59`,
        OperationLists: [],
        session_index: '',
        selectOrder: [],
        editable: false,
        getHistoryFlag: false,
        axiosHistoryObj: {
          type: 'post',
          url: '/sysIgnoreAudit/getIgnoreList',
          params: {
            condition: {}
          }
        }
      }
    },
    // 查询详情的参数
    props: ['auditMessage', 'condition'],
    methods: {
      search() {
        var vm = this;
        // 从智能免审计和策略审计进去的页面不同
        if (this.condition) {
          vm.axiosHistoryObj.params.condition = this.condition
        } else {
          vm.axiosHistoryObj.params.condition = Object.assign({}, {
            pattern_md5: vm.auditMessage.pattern_md5,
            dbi_uuid: vm.dbName,
            account_name: vm.accountName,
            client_ip: vm.clientIp,
            dbi_ip: vm.dbIp,
            dbo_id: this.statusValue === '' ? -1 : vm.statusValue,
            end_time: vm.endTimeValue,
            start_time: vm.startTimeValue
          });
        }
        vm.getHistoryFlag = true;
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
      }
    },
    created() {
      this.getSelect();
      this.search();
    }
  }
</script>
