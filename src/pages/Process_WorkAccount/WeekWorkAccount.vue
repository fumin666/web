<template>
  <div class="process-week-work-account">
    <s-row style="margin-top: 10px;">
      <span>工单类型:</span>
      <s-select v-model="orderType" @change="changeOrderType" style="width: 10%;margin-left: 10px;">
        <s-option v-for="(value, key, index) in orderTypeMap" :key="index" :value="key"
                  :label="value"></s-option>
      </s-select>
    </s-row>
    <s-row style="margin-top: 15px;">
      <s-table :data="topData">
        <s-table-column prop="orderType" label="工单类型"></s-table-column>
        <s-table-column prop="create_num" label="创建数"></s-table-column>
        <s-table-column prop="complete_num" label="完成数"></s-table-column>
        <s-table-column prop="undeal_num" label="待决单数"></s-table-column>
        <s-table-column prop="percent" label="占所有类型工单比例">
          <template slot-scope="scope">
            {{ scope.row.percent + '%' }}
          </template>
        </s-table-column>
      </s-table>
    </s-row>
    <s-row style="margin-top: 15px;">
      <s-row>
        <span>列表:</span>
      </s-row>
      <s-table-page
        ref="multipleTable"
        :data="dataDetail"
        style="width:100%;margin-top: 10px;"
      >
        <s-table-column prop="serialCode" label="工单编号" show-overflow-tooltip>
          <template slot-scope="scope">
            <a @click="goDetail(scope.row.orderType, scope.row.orderUuid)"  href="javascript:;">{{ scope.row.serialCode }}</a>
          </template>
        </s-table-column>
        <s-table-column prop="briefDesc" label="工单简要描述" show-overflow-tooltip>
          <template slot-scope="scope">
            <a @click="goDetail(scope.row.orderType, scope.row.orderUuid)"  href="javascript:;">{{ scope.row.briefDesc }}</a>
          </template>
        </s-table-column>
        <s-table-column prop="orderTypeName" label="工单类型" show-overflow-tooltip></s-table-column>
        <s-table-column prop="orderState" label="工单状态" show-overflow-tooltip></s-table-column>
        <s-table-column prop="submitUser" label="提交人" show-overflow-tooltip>
          <template slot-scope="scope">
            <NameCardClick :useruuid="scope.row.submitUserUuid" :placement="'top-start'">
              {{scope.row.submitUser}}
            </NameCardClick>
          </template>
        </s-table-column>
        <s-table-column prop="submitTime" label="提交时间" show-overflow-tooltip></s-table-column>
      </s-table-page>
    </s-row>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {NameCardClick} from '@/components/nameCard/NameCard';
  export default {
    data() {
      return {
        selectDada: [],
        orderType: '',
        dateType: '',
        dataDetail: [],
        countDataArr: [],
        topData: [],
        orderTypeMap: {}
      }
    },
    components: {
      NameCardClick
    },
    methods: {
      getOrderType() {
        return $axios.get('ItilCommonWorkflow/getOrderType').then(res => {
          this.orderTypeMap = res.data;
          return this.orderTypeMap;
        })
      },
      getCountData(orderType, dateType) {
        if (orderType === '0') {
          // 事件单
          $axios.post('/itilWorkflowCenter/getIncidentWorksStat/' + dateType).then((res) => {
            let param = res.data;
            this.topData = [];
            this.dataDetail = [];
            if (Object.keys(param).length > 0) {
              this.topData.push(param);
              this.dataDetail = res.data.orders;
            }
          })
        } else if (orderType === '1') {
          // 问题单
          $axios.post('/itilWorkflowCenter/getProblemWorksStat/' + dateType).then((res) => {
            let param = res.data;
            this.topData = [];
            this.dataDetail = [];
            if (Object.keys(param).length > 0) {
              this.topData.push(param);
              this.dataDetail = res.data.orders;
            }
          })
        } else if (orderType === '2') {
          // 变更单
          $axios.post('/itilWorkflowCenter/getChangeWorksStat/' + dateType).then((res) => {
            let param = res.data;
            this.topData = [];
            this.dataDetail = [];
            if (Object.keys(param).length > 0) {
              this.topData.push(param);
              this.dataDetail = res.data.orders;
            }
          })
        } else if (orderType === '3') {
          // 任务
          $axios.post('/itilWorkflowCenter/getTaskWorksStat/' + dateType).then((res) => {
            let param = res.data;
            this.topData = [];
            this.dataDetail = [];
            if (Object.keys(param).length > 0) {
              this.topData.push(param);
              this.dataDetail = res.data.orders;
            }
          })
        } else if (orderType === '4') {
          // 知识
          $axios.post('/itilWorkflowCenter/getKnowledgeWorksStat/' + dateType).then((res) => {
            let param = res.data;
            this.topData = [];
            this.dataDetail = [];
            if (Object.keys(param).length > 0) {
              this.topData.push(param);
              this.dataDetail = res.data.orders;
            }
          })
        } else if (orderType === '5') {
          // 发布单
          $axios.post('/itilWorkflowCenter/getPublishWorksStat/' + dateType).then((res) => {
            let param = res.data;
            this.topData = [];
            this.dataDetail = [];
            if (Object.keys(param).length > 0) {
              this.topData.push(param);
              this.dataDetail = res.data.orders;
            }
          })
        } else if (orderType === '6') {
          // 服务请求
          $axios.post('/itilWorkflowCenter/getRequestorksStat/' + dateType).then((res) => {
            let param = res.data;
            this.topData = [];
            this.dataDetail = [];
            if (Object.keys(param).length > 0) {
              this.topData.push(param);
              this.dataDetail = res.data.orders;
            }
          })
        }
      },
      goto(path) {
        this.$router.push('/ProcessCenter/' + path)
      },
      goDetail(orderType, uuid) {
        switch (orderType) {
          case 0:
            this.goto('eventDetail/' + uuid);
            break;
          case 1:
            this.goto('problemDetail/' + uuid);
            break;
          case 2:
            this.goto('modifyDetail/' + uuid);
            break;
          case 3:
            this.goto('taskOrderDetail/' + uuid);
            break;
          case 4:
            this.goto('knowDetail/' + uuid);
            break;
          case 5:
            this.goto('publishDetail/' + uuid);
            break;
          case 6:
            this.goto('requestServiceDetail/' + uuid);
            break;
        }
      },
      filterType(val) {
        for (let i in this.orderTypeMap) {
          if (this.orderTypeMap[i] === val) {
            return i
          }
        }
      },
      changeOrderType(val) {
        this.getCountData(val, this.dateType);
      }
    },
    created() {
      this.getOrderType().then(() => {
        let _this = this;
        _this.orderType = _this.filterType(_this.$route.params.orderType);
        _this.dateType = _this.$route.params.dateType;
        _this.getCountData(_this.orderType, _this.dateType);
      })
    }
  }
</script>

