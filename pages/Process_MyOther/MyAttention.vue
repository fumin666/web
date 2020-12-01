<template>
  <div style="margin:15px 20px;" class="myAttention">
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
    <s-table-page
                :data="list"
                :default-sort="{prop: 'createTime', order: 'descending'}"
                actions-col-width="100">
      <!--<s-table-column type="selection" width="45"></s-table-column>-->
      <s-table-column prop="serialCode" label="工单编号" show-overflow-tooltip>
        <template slot-scope="scope">
          <a @click="scope.row.taskSource === 6 ? clickToPublishTaskOrder(scope.row) : goDetail(scope.row.orderType, scope.row.uuid)"  href="javascript:;">{{ scope.row.serialCode }}</a>
        </template>
      </s-table-column>
      <s-table-column prop="briefDesc" label="工单简要描述" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.briefDesc || scope.row.title}}
      </template>
      </s-table-column>
      <s-table-column prop="orderType" label="工单类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-text="attentionorderType[scope.row.orderType]"></span>
        </template>
      </s-table-column>
      <s-table-column prop="status" label="工单状态" show-overflow-tooltip>
        <template slot-scope="scope">
          {{getStatus(scope.row.orderType, scope.row.status)}}
        </template>
      </s-table-column>
      <s-table-column prop="executeUser" label="提交人" :show-overflow-tooltip="false" :showTooltipWhenOverflow="false">
        <template slot-scope="scope">
          <NameCardClick :useruuid="scope.row.createUser" :placement="'top-start'">
           <div>{{scope.row.createUserDetail.userRealName}}</div>
          </NameCardClick>
        </template>
      </s-table-column>
      <s-table-column prop="createTime" sortable label="提交时间" show-overflow-tooltip></s-table-column>
      <s-table-column label="操作">
        <template slot-scope="scope">
         <i class="iconfont icon-star-full"
            :style="{cursor: 'pointer', fontSize: '20px'}"
            title="取消关注"
          @click="handleConcern(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table-page>
  </div>
</template>

<script>
  // import SearchBox from '@/components/tableCom/src/SearchBox';
  // import DateRange from '@/components/tableCom/src/DateRange';
  import $axios from 'sunflower-ajax';
  import {NameCardClick} from '@/components/nameCard/NameCard';
  //  import Bus from '@/plugins/eventBus';

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
        searchFormRules: {
        },
        orderTypeMap: {},
        list: [],
        selections: [],
        isShowButton: false,
        refuseuuid: '',
        attentionorderType: ['事件', '问题', '变更', '任务', '知识', '发布', '服务请求'],
        incidentStatus: ['拒绝', '通过', '未审批'],
        flag: false
      }
    },
    computed: {
    },
    created() {
      this.getOrderType().then(() => { this.search() })
    },
    mounted() {
      this.getDateRangeStart(this.searchForm.startime)
      this.getDateRangeEnd(this.searchForm.endtime)
    },
    methods: {
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
      reset() {
        this.searchForm = {
          startime: '',
          endtime: ''
        }
        this.search()
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
          brieftitle: this.searchForm.brieftitle,
          sercode: this.searchForm.sercode,
          ordertype: this.searchForm.orderType,
          startime: parseInt(new Date(this.searchForm.startime).getTime() / 1000),
          endtime: parseInt(new Date(this.searchForm.endtime).getTime() / 1000)
        }
        $axios.post('/itilWorkflowCenter/getConcernOrders', params).then(({data}) => {
         this.list = []
          data.forEach(item => {
            let data = Object.assign(item.incidentOrder || item.changeOrder || item.problemOrder || item.changeTask || item.knowledgeOrder || item.itilPublishOrder || item.requestOrder, {orderType: item.orderType}, {concernUser: item.concernUser},
              {orderUuid: item.orderUuid}, {concernuuids: item.uuid}, {status: item.changeOrder ? item.changeOrder.changeStatus : item.incidentOrder ? item.incidentOrder.incidentStatus : item.knowledgeOrder ? item.knowledgeOrder.knowledgeStatus : item.problemOrder ? item.problemOrder.problemStatus : item.changeTask ? item.changeTask.taskStatus : item.requestOrder ? item.requestOrder.status : item.itilPublishOrder ? item.itilPublishOrder.publishStatus : ''})
            this.list.push(data)
          })
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
      handleConcern(row) {
        this.$confirm('确定取消对该工单的关注，并从关注列表中删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/ItilCommonWorkflow/cancelIncidentOrder/${row.concernuuids}`).then(({data}) => {
            if (data.state === true) {
              this.$message({
                type: 'success',
                message: data.errormsg
              })
              this.search()
            } else {
              this.$message({
                type: 'error',
                message: data.errormsg
              })
            }
          })
        }).catch(() => {});
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
      },
      clickToPublishTaskOrder(row) {
        this.$emit('goPublishTask', row)
      }
    }
  }
</script>

<style lang="stylus">
  .myAttention
    .reButton
      float: right;
      margin-right: 16px;
      margin-top: -38px;
</style>

