<template>
  <section id="c-myAttention">
    <s-table-page
      :data="myAttentionList"
      :header-search="defSearch()"

      :row-actions="defRowAction()"
      actionColWidth="50px"
      key="myAttentionList">
      <s-table-column label="工单编号">
        <template slot-scope="scope">
          <span class="jump-link" v-text="scope.row.requestOrder.serialCode"></span>
        </template>
      </s-table-column>
      <s-table-column label="简要描述" prop="requestOrder.briefDesc"></s-table-column>
      <s-table-column label="工单类型">
        <template slot-scope="scope">
          <span v-text="orderTypes[scope.row.orderType]"></span>
        </template>
      </s-table-column>
      <s-table-column label="工单状态">
        <template slot-scope="scope">
          <span v-text="getStatus(scope.row.orderType, scope.row.requestOrder.status)"></span>
        </template>
      </s-table-column>
      <s-table-column label="提交人" prop="requestOrder.createUserName"></s-table-column>
      <s-table-column label="提交时间" prop="requestOrder.createTime" sortable></s-table-column>
    </s-table-page>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        orderTypes: ['事件', '问题', '变更', '任务', '知识', '发布', '服务请求'],   // 工单类型
        myAttentionList: [],     // 我关注的列表
        searchForm: {
          ordertype: 6,
          sercode: '',
          brieftitle: '',
          startime: null,
          endtime: null
        }
      }
    },

    methods: {
      // 表头查询
      defSearch() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询条件',
          searchProps: ['serialCode', 'briefDesc', 'type', 'statusName', 'createUserName', 'createTime']
        }
      },
      // 表格行内操作定义
      defRowAction() {
        let _this = this;
        return [{
          name: '取消关注',
          icon: 'star-full',
          click(row) {
            $axios.get(`ItilCommonWorkflow/cancelIncidentOrder/${row.uuid}`).then(({data}) => {
              if (data.state === true) {
                _this.$message.success('工单关注已经取消！');
              } else {
                _this.$message.error('取消关注失败！');
              }
            });
          }
        }]
      },
      // 获取我的关注列表
      getMyAttentionList() {
        $axios.post('/itilServiceRequest/getConcernRequestOrder', this.searchForm).then(({data}) => {
          if (data && data instanceof Array) {
            this.myAttentionList = data;
          }
        });
      },
      // 计算工单状态(文字)
      getStatus(orderType, status) {
        let data = []
        switch (orderType) {
          case 0: // 事件
            data = this.$store.state.processCenter.status[0];
            return data[status];
          case 1: // 问题
            data = this.$store.state.processCenter.status[1];
            return data[status];
          case 2: // 变更
            data = this.$store.state.processCenter.status[2];
            return data[status - 1];
          case 3: // 任务
            data = this.$store.state.processCenter.status[3];
            return data[status - 1];
          case 4: // 知识
            data = this.$store.state.processCenter.status[4];
            return data[status - 1];
          case 5: // 发布
            data = this.$store.state.processCenter.status[5];
            return data[status];
          case 6: // 服务请求
            data = this.$store.state.processCenter.status[6];
            return data[status];
        }
      }
    },
    created() {
      this.getMyAttentionList();      // 获取我的关注列表
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #c-myAttention
    .jump-link
      cursor pointer
      &:hover
        text-decoration underline
</style>
