<template>
  <div class="diy-user-process-order">
    <s-card-diy
      title="流程工单"
      :more-click="moreClick"
      show-scrollbar>
      <div style="width: 100%; height: 100%; padding: 10px;">
        <s-table
          :data="list">
          <s-table-column
            label="工单编号"
            prop="serialCode"/>
          <s-table-column
            label="工单简要描述"
            prop="briefDesc"/>
          <s-table-column
            label="工单类型"
            prop="orderTypeStr"/>
          <s-table-column
            label="工单状态"
            prop="statuStr"/>
          <s-table-column
            label="提交人"
            prop="createUserName"/>
          <s-table-column
            label="提交时间"
            prop="createTime"/>
        </s-table>
      </div>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  export default {
    data() {
      return {
        list: []
      }
    },
    computed: {
      status() {
        return this.$store.state.processCenter.status;
      }
    },

    created() {
      this.getList();
    },

    methods: {
      getList() {
        // copy from ProcessCenter.vue
        $axios.post('/itilWorkflowCenter/getUndealOrders', {}).then(({ data }) => {
          let { changeOrderList, changeTaskList, incidentOrderList, problemOrderList, knowledgeOrderList, publishOrderList, requestOrderList } = data;
          changeOrderList = (changeOrderList || []).map(item => Object.assign({}, item, {
            statuStr: this.status[2][item.changeStatus],
            orderTypeStr: '变更'
          }))
          changeTaskList = (changeTaskList || []).map(item => Object.assign({}, item, {
            statuStr: this.status[3][item.taskStatus],
            orderTypeStr: '任务'
          }))
          incidentOrderList = (incidentOrderList || []).map(item => Object.assign({}, item, {
            statuStr: this.status[0][item.incidentStatus],
            orderTypeStr: '事件'
          }))
          problemOrderList = (problemOrderList || []).map(item => Object.assign({}, item, {
            statuStr: this.status[1][item.problemStatus],
            orderTypeStr: '问题'
          }))
          knowledgeOrderList = (knowledgeOrderList || []).map(item => Object.assign({}, item, {
            statuStr: this.status[4][item.knowledgeStatus],
            orderTypeStr: '知识'
          }))
          publishOrderList = (publishOrderList || []).map(item => Object.assign({}, item, {
            statuStr: this.status[5][item.publishStatus],
            orderTypeStr: '发布'
          }))
          requestOrderList = (requestOrderList || []).map(item => Object.assign({}, item, {
            statuStr: this.status[6][item.status],
            orderTypeStr: '服务请求'
          }))
          let pendingLists = [...changeOrderList, ...changeTaskList, ...incidentOrderList, ...problemOrderList, ...knowledgeOrderList, ...publishOrderList, ...requestOrderList]
          pendingLists = pendingLists.sort(function(a, b) {
            return a.createTime > b.createTime ? -1 : a.createTime < b.createTime ? 1 : 0
          })
          this.list = pendingLists.slice(0, 10);
        })
      },

      moreClick() {
        this.$router.push('/ProcessCenter');
      }
    }
  }
</script>

<style>
  .diy-user-process-order {
    width: 100%;
    height: 100%;
  }
</style>
