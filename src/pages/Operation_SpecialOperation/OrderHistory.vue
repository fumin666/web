/**
* Created by songyf on 2019/4/22.
* 工单运维-工单历史.
*/
<template>
  <section class="order-history">
    <!--工单历史列表-->
    <s-table-page :data="orderHistorysList"
                  :row-actions='rowActionsDef()'
                 :actions-col-width="`50px`"
                 :header-search="getSearchDef()" >
      <s-table-column prop="orderNumber" label="工单号" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="startTime" label="开始时间" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="endTime" label="结束时间" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="remark" label="备注" show-overflow-tooltip>
      </s-table-column>
    </s-table-page>
    <!--查看工单弹框-->
    <s-dialog
      v-model="orderViewDialogFlag"
      v-if="orderViewDialogFlag"
      width="960px"
      title="查看工单">
      <order-view
        :orderViewData="orderViewData"
        ref="orderView"
      >
      </order-view>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
import $axios from 'sunflower-ajax'
import orderView from './dialog/OrderView'

export default {
  data() {
    return {
      orderHistorysList: [],
      orderViewDialogFlag: false,
      orderViewData: {}
    }
  },
  components: {
    orderView
  },
  created() {
    this.getOrderHistoryList();
  },
  methods: {
    getOrderHistoryList() {
      $axios.get('/orderOperation/getOrderOperationHistoryList').then(res => {
        this.orderHistorysList = res.data
      });
    },
    // 表格相关
    rowActionsDef() {
      let vm = this;
      return [{
        icon: 'eye',
        name: '查看',
        click(row) {
          $axios.get(`/orderOperation/getOrderOperationByUuid/${row.uuid}`).then(res => {
            vm.orderViewData = res.data
          });
          vm.orderViewDialogFlag = true;
        }
      }]
    },
    getSearchDef() { // 列表搜索
      return {
        width: 4,
        offset: 20,
        placeholder: '请输入查询条件',
        searchProps: ['orderNumber', 'remark']
      }
    }
  }
}
</script>
