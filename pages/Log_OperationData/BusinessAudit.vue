<template>
  <section class="content sqlModelAudit">
    <s-form :inline="true" class="search_form" label-width="90px" style="margin: 10px 0;">
      <div>
        <s-form-item label="中间件系统：">
          <s-select v-model="app_uuid">
            <s-option v-for="item in app_names" :label="item.app_name" :value="item.app_uuid" :key="item.app_uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="中间件系统IP：" label-width="120px">
          <s-input v-model="server_ip" style="width: 155px;"></s-input>
        </s-form-item>
        <s-form-item label="中间件系统登录名：" label-width="140px">
          <s-input v-model="account_name" style="width: 135px;"></s-input>
        </s-form-item>
        <s-form-item label="客户端IP：">
          <s-input v-model="client_ip"></s-input>
        </s-form-item>
        <s-form-item label="客户端MAC：" label-width="100px">
          <s-input v-model="client_mac" style="width: 175px;"></s-input>
        </s-form-item>
        <s-form-item label="业务名称：">
          <s-input v-model="biz_name"></s-input>
        </s-form-item>
        <s-form-item>
          <s-select v-model="dateSelect" @change="dateSelectChange">
            <!--<s-option label="快速选择日期" value="0"></s-option>-->
            <s-option label="日" value="日"></s-option>
            <s-option label="周" value="周"></s-option>
            <s-option label="月" value="月"></s-option>
            <s-option label="三个月" value="三个月"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item>
          <s-date-picker v-model="start_time" type="datetime" :editable="editable" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" :value-format-flag="true" @change="getStartTime"></s-date-picker>
          <span class="timeLink">到</span>
        </s-form-item>
        <s-form-item>
          <s-date-picker v-model="end_time" type="datetime" :editable="editable" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" :value-format-flag="true" @change="getEndTime"></s-date-picker>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" title="查询" @click="search()">查询</s-button>
      </div>
    </s-form>
    <page-infinite-table loading-text="正在加载中" :ajax-obj="axiosHistoryObj" :startAjax="getHistoryFlag" ref="infiniteTable">
      <s-table-column label="业务名称" prop="biz_name" show-overflow-tooltip></s-table-column>
      <s-table-column label="中间件系统" prop="app_name"></s-table-column>
      <s-table-column label="中间件系统IP" prop="server_ip"></s-table-column>
      <s-table-column label="中间件系统登录名" prop="account_name" show-overflow-tooltip></s-table-column>
      <s-table-column label="客户端IP" prop="client_ip"></s-table-column>
      <s-table-column label="客户端MAC" prop="client_mac"></s-table-column>
      <s-table-column label="开始时间" prop="start_time"></s-table-column>
      <s-table-column
        label="操作">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看" @click="checkHandle(scope.$index, scope.row)"></i>
        </template>
      </s-table-column>
    </page-infinite-table>
    <s-dialog
      v-model="bloomBusinessDetail"
      v-if="bloomBusinessDetail"
      title="查看信息"
      width="800px"
      key="bloomBusinessDetail">
      <business-detail ref="business-detail" :detailsObj="detailsObj" :biz_id="biz_id"></business-detail>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'

  import BusinessDetail from './BusinessDetail'
  // import searchBox from '@/components/tableCom/src/SearchBox'
  import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  export default {
    components: {

      BusinessDetail,
      // searchBox,
      pageInfiniteTable
    },
    data() {
      return {
        showSearch: false,
        app_uuid: '',
        app_names: [],
        account_name: '',
        server_ip: '',
        biz_name: '',
        client_ip: '',
        client_mac: '',
        start_time: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 00:00:00`,
        end_time: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 23:59:59`,
        BusinessLists: [],
        bloomBusinessDetail: false,
        detailsObj: {},
        dateSelect: '日',
        editable: false,
        getHistoryFlag: false,
        axiosHistoryObj: {
          type: 'post',
          url: '/dbsqlUrl/list',
          params: {
            condition: {}
          }
        },
        biz_id: ''
      }
    },
    methods: {
      checkHandle(index, row) {
        let vm = this;
        vm.bloomBusinessDetail = true;
        vm.biz_id = row.biz_id;
        $axios.get('/dbsqlUrl/view/' + row.biz_id).then((res) => {
          if (res.data.sqlUrl) {
            vm.detailsObj = res.data.sqlUrl;
          }
//          if (res.data.sqlList === null) {
//            vm.detailsArray = [];
//          } else {
//            vm.detailsArray = res.data.sqlList;
//          }
        })
      },
      search() {
        let vm = this;
        vm.axiosHistoryObj.params.condition = Object.assign({}, {account_name: vm.account_name, app_uuid: vm.app_uuid, biz_name: vm.biz_name, client_ip: vm.client_ip, client_mac: vm.client_mac, end_time: vm.end_time, server_ip: vm.server_ip, start_time: vm.start_time})
        vm.getHistoryFlag = true;
      },
      getSelect() {
        let vm = this;
        $axios.get('/dbauditApp/getAll').then((res) => {
          vm.app_names = res.data;
        })
      },
      dateSelectChange(val) {
        let _this = this;
        function getDateVal(dayBefore) {
          let now = new Date();
          let newdate = new Date();
          let newtimems = newdate.getTime() - (dayBefore * 24 * 60 * 60 * 1000);
          newdate.setTime(newtimems);
          let clockBefore = CurentTime(newdate);
          let clockNow = CurentTime(now);
          _this.start_time = clockBefore;
          _this.end_time = clockNow;
        }
        function CurentTime(obj) {
          let year = obj.getFullYear();
          let month = obj.getMonth() + 1;
          let day = obj.getDate();
          let clock = year + '-';
          if (month < 10) {
            clock += '0';
          }
          clock += month + '-';
          if (day < 10) {
            clock += '0';
          }
          clock += day + ' ' + '23:59:59';
          return (clock);
        }
        let dayBefore = 0;
        switch (val) {
          case '0': dayBefore = 0; break;
          case '日': dayBefore = 1; break;
          case '周': dayBefore = 7; break;
          case '月': dayBefore = 30; break;
          case '三个月': dayBefore = 91; break;
        }
        if (dayBefore) {
          getDateVal(dayBefore)
        } else {
          this.start_time = '';
          this.end_time = '';
        }
      },
      getStartTime(val) {
        let beginVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let endValue = new Date(Date.parse(this.end_time.replace(/-/g, '/'))).getTime();
        if (beginVal >= endValue) {
          this.start_time = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.start_time = val;
        }
      },
      getEndTime(val) {
        let endVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let beginValue = new Date(Date.parse(this.start_time.replace(/-/g, '/'))).getTime();
        if (endVal <= beginValue) {
          this.end_time = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.end_time = val;
        }
      }
    },
    created() {
      this.search();
      this.getSelect()
    }
  }
</script>

