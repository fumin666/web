/**
 * @Author: songyf
 * @Description: 工单运维-工单管理-查看工单
 * @Date: 2019-04-22
*/
<template>
  <section class="order-view">
    <s-scrollbar wrap-class="order-view-height">
      <div class="order-msg">
        <s-row>
          <s-col span="24">
            <div class="grid-content bg-purple title"> <i class="iconfont icon-prompt-info"></i>工单信息</div>
          </s-col>
        </s-row>
        <s-row class="grid-content">
          <s-col span="5" class="msg">
            <div><span>工单号： {{this.orderViewData.orderNumber}}</span></div>
          </s-col>
          <s-col span="11" class="msg">
            <div><span>日期： {{this.orderViewData.startTime}} 至 {{this.orderViewData.endTime}}</span></div>
          </s-col>
          <s-col span="8" class="msg"  style="border: 0">
            <div><span>备注： {{this.orderViewData.remark}}</span></div>
          </s-col>
        </s-row>
      </div>
      <s-row>
        <s-col span="24">
          <div class="grid-content bg-purple title"> <i class="iconfont icon-prompt-info"></i>人员和设备信息</div>
        </s-col>
      </s-row>
      <!--工单运维列表表格-->
      <s-table-page :data="peopleElement" :header-search="searchDef()" >
        <s-table-column prop="operationUser" :label="'运维人员 '+'('+orderViewData.userCount+')'" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="itcompInfo" :label="'可访问资产 '+'('+orderViewData.itcompCount+')'" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="accountName" :label="'可登录账号 '+'('+orderViewData.accountCount+')'" show-overflow-tooltip>
        </s-table-column>
      </s-table-page>
    </s-scrollbar>
  </section>
</template>

<script>

export default {
  data() {
    return {
      peopleElement: []
    }
  },
  props: {
    orderViewData: {
      type: Object
    }
  },
  watch: {
    orderViewData: {
      // immediate: true,
      handler(val) {
        this.peopleElement = val.showModelList
      }
    }
  },
  created() {
  },
  methods: {
    searchDef() {
      return {
        width: 8,
        offset: 16,
        placeholder: '请输入关键字',
        searchProps: ['operationUser', 'itcompInfo', 'accountName']
      }
    }
  },
  components: {

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
