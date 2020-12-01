/**
 * @Author: songyf
 * @Description: 工单运维-工单运维列表-查看
 * @Date: 2019-04-26
*/
<template>
  <section class="order-view">
    <s-scrollbar wrap-class="order-view-height">
      <s-row>
        <s-col span="24">
          <div class="grid-content bg-purple title"> <i class="iconfont icon-prompt-info"></i>运维主机列表</div>
        </s-col>
      </s-row>
      <!--工单运维列表表格-->
      <s-table-page :data="operationsHostList"
                    :row-actions='rowActionsDef()'
                   :actions-col-width="`50px`"
                    :header-search="searchDef()">
        <s-table-column prop="itcompName" label="资产名称" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="oprationIp" label="IP地址" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="port" label="端口" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="protocolName" label="协议" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="accountName" label="账号" show-overflow-tooltip>
        </s-table-column>
      </s-table-page>
    </s-scrollbar>
  </section>
</template>

<script>
export default {
  data() {
    return {
      operationsHostList: []
    }
  },
  props: {
    orderOperationsViewData: {
      type: Array
    },
    isShowOper: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    orderOperationsViewData: {
      // immediate: true,
      handler(val) {
        this.operationsHostList = val
      }
    }
  },
  created() {
  },
  methods: {
    // 表格相关
    rowActionsDef() {
      let vm = this;
      return [{
        icon: 'special-oper',
        name: '运维',
        show: this.showOperBtn,
        click(row) {
          vm.$emit('showOperation', row);
          console.log(row);
        }
      }]
    },
    // 是否显示运维按钮
    showOperBtn() {
      return this.isShowOper;
    },
    searchDef() {
      return {
        width: 8,
        offset: 16,
        placeholder: '请输入关键字',
        searchProps: ['itcompName', 'oprationIp', 'port', 'protocolName', 'accountName']
      }
    }
  }
}
</script>

<style lang="stylus">
  .order-view-height{
    max-height: 400px
    padding-right: 17px
  }
  .order-view .iconfont{
    margin-right 8px
  }
  .order-view .title{
    font-weight 600
  }
  .order-view .order-msg{
    border-left 1px solid #e4e7ed
    border-right 1px solid #e4e7ed
    border-bottom 1px solid #e4e7ed
    margin-bottom 20px;
  }
  .order-view .order-msg .msg{
    padding 0 15px
    border-right 1px solid #e4e7ed
  }
  .order-view .s-row{
    margin-bottom 0
  }

</style>
