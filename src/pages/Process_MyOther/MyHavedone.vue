<template>
  <div style="margin:15px 20px;" class="myHavedone">
    <s-row>
      <s-col :span="24" style="text-align: right;margin-bottom:6px">
        <s-button @click="hideHandler" icon="magnifier"></s-button>
      </s-col>
    </s-row>
    <div class="commonBox" v-show="flag">
      <s-form ref="searchBox" :inline="true" :model="searchForm" class="demo-form-inline" label-width="100px">
        <s-form-item label="工单类型:">
          <s-select v-model="searchForm.orderType" style="width: 145px">
            <s-option v-for="(value, key, index) in orderTypeMap" :key="index" :value="parseInt(key)"
                      :label="value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="工单编号:" prop="sercode">
          <s-input v-model="searchForm.sercode" style="width: 135px"></s-input>
        </s-form-item>
        <s-form-item label="提交时间:">
          <s-date-picker
            style="width: 145px"
            type="datetime"
            placeholder="选择起始时间"
            v-model="searchForm.startime"
            :editable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            @change="getDateRangeStart">
          </s-date-picker>
          ~
          <s-date-picker
            style="width: 145px"
            type="datetime"
            placeholder="选择结束时间"
            v-model="searchForm.endtime"
            :editable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            @change="getDateRangeEnd">
          </s-date-picker>
        </s-form-item>
        <s-form-item label="工单简要描述:" prop="brieftitle">
          <s-input v-model="searchForm.brieftitle" style="width: 145px"></s-input>
        </s-form-item>
        <s-row style="text-align: right; margin-right: 8%;">
          <s-button @click="search()">查询</s-button>
          <s-button @click="reset()">重置</s-button>
        </s-row>
      </s-form>
    </div>
    <s-table-page :data="list"
                 :default-sort="{prop: 'createTime', order: 'descending'}">
      <s-table-column prop="serialCode" label="工单编号" show-overflow-tooltip>
        <template slot-scope="scope">
          <a @click="goDetail(scope.row.orderType,scope.row.uuid)" class="ip" href="javascript:;">{{ scope.row.serialCode }}</a>
        </template>
      </s-table-column>
      <s-table-column prop="briefDesc" label="工单简要描述" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.briefDesc || scope.row.title}}
      </template>
      </s-table-column>
      <s-table-column prop="orderType" label="工单类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-text="haveorderType[scope.row.orderType]"></span>
        </template>
      </s-table-column>
      <s-table-column prop="status" label="工单状态" show-overflow-tooltip>
        <template slot-scope="scope">
          {{getStatus(scope.row.orderType, scope.row.status)}}
        </template>
      </s-table-column>
      <s-table-column prop="createUserName" label="提交人" :show-overflow-tooltip="false" :showTooltipWhenOverflow="false">
        <template slot-scope="scope">
          <NameCardClick :useruuid="scope.row.createUser" :placement="'top-start'">
           <div>{{scope.row.userLoginName}}</div>
          </NameCardClick>
        </template>
      </s-table-column>
      <s-table-column prop="createTime" sortable label="提交时间" show-overflow-tooltip>
      </s-table-column>
    </s-table-page>
  </div>
</template>

<script>
  // import SearchBox from '@/components/tableCom/src/SearchBox';
  // import DateRange from '@/components/tableCom/src/DateRange';
  import $axios from 'sunflower-ajax';
  import {NameCardClick} from '@/components/nameCard/NameCard';

  export default {
    components: {
      // SearchBox,
      // DateRange,
      NameCardClick
    },
    data() {
      return {
        searchForm: {
          sercode: '',
          orderType: null,
          startime: '',
          endtime: '',
          brieftitle: ''
        },
        orderTypeMap: {},
        searchFormRules: {
         // sercode: [Validaters.Number]
        },
        list: [],
        selections: [],
        isShowButton: false,
        refuseuuid: '',
        haveorderType: ['事件', '问题', '变更', '任务', '知识', '发布', '服务请求'],
        problemStatus: ['草稿', '评审中', '已指派', '调查中', '待决', '已完成', '已关闭', '已取消'],
        changeStatus: ['草稿', '变更请求', '已计划审批', '计划', '技术审批', '正在执行', '待决', '已完成', '已关闭', '已取消', '已拒绝'],
        incidentStatus: ['新建', '已分派', '待决', '处理中', '已解决', '已关闭', '已取消'],
        taskStatus: ['草稿', '已指派', '处理中', '已完成', '已关闭', '已取消'],
        knowledgeStatus: ['草稿', '已启动', '发布审批', '待发布', '已发布', '注销审批', '已废弃', '已拒绝', '已取消'],
        publishStatus: ['草稿', '启动审批', '计划审批', '开发审批', '测试审批', '部署审批', '关闭审批', '进行中', '待决', '已完成', '已拒绝', '已取消', '已关闭'], // 发布
        requestStatus: ['草稿', '已提交', '启动审批', '已指派', '进行中', '已完成', '已关闭', '已拒绝', '已取消', '待决'],
        flag: false
      }
    },
    props: ['activeTab'],
    watch: {
      activeTab: {
        immediate: true,
        handler(val) {
          this.search();
        }
      }
    },
    created() {
      this.getOrderType().then(() => { this.search() })
    },
    mounted() {
      this.getDateRangeStart(this.searchForm.startime)
      this.getDateRangeEnd(this.searchForm.endtime)
    },
    methods: {
      reset() {
        this.searchForm = {
          startime: '',
          endtime: ''
        }
        this.search()
      },
      getOrderType() {
        return $axios.get('ItilCommonWorkflow/getOrderType').then(res => {
          this.orderTypeMap = res.data;
          return this.orderTypeMap;
        })
      },
      getStatus(orderType, status) {
        let data = []
        switch (orderType) {
          case 0: // 事件
            data = this.$store.state.processCenter.status[0]
            return data[status]
          case 1: // 问题
            data = this.$store.state.processCenter.status[1]
            return data[status]
          case 2: // 变更
            data = this.$store.state.processCenter.status[2]
            return data[status - 1]
          case 3: // 任务
            data = this.$store.state.processCenter.status[3]
            return data[status - 1]
          case 4: // 知识
            data = this.$store.state.processCenter.status[4]
            return data[status - 1]
          case 5: // 发布
            data = this.$store.state.processCenter.status[5]
            return data[status]
          case 6: // 服务请求
            data = this.$store.state.processCenter.status[6]
            return data[status]
        }
      },
      getDateRangeStart(value) {
        let start = this.searchForm.startime ? new Date(this.searchForm.startime).getTime() : 0
        let end = this.searchForm.endtime ? new Date(this.searchForm.endtime).getTime() : 0
        if (end) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.searchForm.startime = '';
          }
        }
      },
      getDateRangeEnd(value) {
        let start = this.searchForm.startime ? new Date(this.searchForm.startime).getTime() : 0
        let end = this.searchForm.endtime ? new Date(this.searchForm.endtime).getTime() : 0
        if (start) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.searchForm.endtime = '';
          }
        }
      },
      search() {
        let params = {
          sercode: this.searchForm.sercode,
          ordertype: this.searchForm.orderType,
          startime: parseInt(new Date(this.searchForm.startime).getTime() / 1000),
          endtime: parseInt(new Date(this.searchForm.endtime).getTime() / 1000),
          brieftitle: this.searchForm.brieftitle
        }
        $axios.post('/itilWorkflowCenter/getDealedOrders', params).then(({data}) => {
          let {changeOrderList, changeTaskList, incidentOrderList, problemOrderList, knowledgeOrderList, publishOrderList, requestOrderList} = data
          changeOrderList = (changeOrderList || []).map(item => Object.assign({}, item, {
            status: item.changeStatus,
            orderType: 2,
            userLoginName: item.createUserDetail ? item.createUserDetail.userRealName : ''
          }))
          changeTaskList = (changeTaskList || []).map(item => Object.assign({}, item, {
            status: item.taskStatus,
            orderType: 3,
            userLoginName: item.createUserDetail ? item.createUserDetail.userRealName : ''
          }))
          incidentOrderList = (incidentOrderList || []).map(item => Object.assign({}, item, {
            status: item.incidentStatus,
            orderType: 0,
            userLoginName: item.createUserDetail ? item.createUserDetail.userRealName : ''
          }))
          problemOrderList = (problemOrderList || []).map(item => Object.assign({}, item, {
            status: item.problemStatus,
            orderType: 1,
            userLoginName: item.createUserDetail ? item.createUserDetail.userRealName : ''
          }))
          knowledgeOrderList = (knowledgeOrderList || []).map(item => Object.assign({}, item, {
            status: item.knowledgeStatus,
            orderType: 4,
            userLoginName: item.createUserDetail ? item.createUserDetail.userRealName : ''
          }))
          publishOrderList = (publishOrderList || []).map(item => Object.assign({}, item, {
            status: item.publishStatus,
            orderType: 5,
            userLoginName: item.createUserDetail ? item.createUserDetail.userRealName : ''
          }))
          requestOrderList = (requestOrderList || []).map(item => Object.assign({}, item, {
            status: item.status,
            orderType: 6,
            userLoginName: item.createUserDetail ? item.createUserDetail.userRealName : ''
          }))
          this.list = [...changeOrderList, ...changeTaskList, ...incidentOrderList, ...problemOrderList, ...knowledgeOrderList, ...publishOrderList, ...requestOrderList].reverse()
        })
        this.flag = false
      },
      hideHandler() {
        this.flag = !this.flag
      },
      selectionChange(selections) {
        this.selections = selections;
      },
      approve(name) {
        switch (name) {
          case 'isConcern':
            this.batchAttention()
            break;
        }
      },
      batchAttention() {
      },
      goto(path) {
        this.$router.push(path)
      },
      goDetail(orderType, uuid) {
        switch (orderType) {
          case 0:
            this.goto('/ProcessCenter/eventDetail/' + uuid);
            break;
          case 1:
            this.goto('/ProcessCenter/problemDetail/' + uuid);
            break;
          case 2:
            this.goto('/ProcessCenter/modifyDetail/' + uuid);
            break;
          case 3:
            this.goto('/ProcessCenter/taskOrderDetail/' + uuid);
            break;
          case 4:
            this.goto('/ProcessCenter/knowDetail/' + uuid);
            break;
          case 5:
            this.goto('/ProcessCenter/publishDetail/' + uuid);
            break;
          case 6:
            this.goto('/ProcessCenter/requestServiceDetail/' + uuid);
            break;
        }
      }
    }
  }
</script>

<style lang="stylus">
  .myHavedone
    .reButton
      float: right;
      margin-right: 16px;
      margin-top: -38px;
</style>
