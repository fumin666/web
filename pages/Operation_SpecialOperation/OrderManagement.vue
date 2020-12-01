/**
* Created by songyf on 2019/4/17.
* 工单运维-工单管理.
*/
<template>
  <section>
    <s-row class="topRow" style="float:left;">
      <s-button @click="addOrderBtn">添加工单</s-button>
    </s-row>
    <!--工单运维列表表格-->
    <s-table-page :data="orderOperationsList"
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
    <!-- 添加工单弹框 -->
    <s-dialog v-model="addOrderDialogFlag" v-if="addOrderDialogFlag" title="添加工单" width="800px" append-to-body >
      <add-order @closeOrderDialog="closeOrderDialog"></add-order>
    </s-dialog>
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

  import addOrder from './dialog/AddOrder'
  import orderView from './dialog/OrderView'

export default {
  data() {
    return {
      addOrderDialogFlag: false,
      orderViewDialogFlag: false,
      orderOperationsList: [],
      orderViewData: {}
    }
  },
  components: {

    addOrder,
    orderView
  },
  created() {
    this.getOrderOperationsList();
  },
  methods: {
    addOrderBtn() {
      this.addOrderDialogFlag = true;
    },
    // 关闭手动(单次)改密弹框
    closeOrderDialog() {
      this.getOrderOperationsList();
      this.addOrderDialogFlag = false;
    },
    // 表格相关--------------------------------------------------------------
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
      }, {
        icon: 'delete',
        name: '删除',
        click(row) {
          vm.$confirm('此操作将永久删除该工单，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.get(`/orderOperation/deleteOrderOperation/${row.uuid}`, {
              data: [row],
              logTemplate: '删除|工单运维(#orderNumber#)'
            }).then((res) => {
              if (res.data.state === true) {
                vm.$message({type: 'success', message: '删除工单成功'});
                vm.getOrderOperationsList();
              }
            })
          }).catch(() => {});
        }
      }]
    },
    getSearchDef() {
      return {
        width: 4,
        offset: 20,
        placeholder: '请输入查询条件',
        searchProps: ['orderNumber', 'remark']
      }
    },
    getOrderOperationsList() {
      $axios.get('/orderOperation/getOrderManagentList').then(res => {
        this.orderOperationsList = res.data
      });
    }
  }
}
</script>
