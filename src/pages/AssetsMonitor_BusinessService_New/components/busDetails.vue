<template>
  <div class="business_nav">
    <s-scrollbar :wrap-style="[{'height':500 + 'px'}]" key="it">
      <s-row style="margin-top:10px;padding:10px 0 30px 0;border-bottom:1px solid #DCDEE2;">
        <s-col span='6'>
          <s-row>
            <s-col class="business_count" span='10'>
              <div class="bus_details_a">
                <i class="icon iconfont icon-rocket"></i>
              </div>
            </s-col>
            <s-col span='14'>
              <div class="font_a">{{busRow.criticalityName}}</div>
              <div class="font_b">关键度</div>
            </s-col>
          </s-row>
        </s-col>
        <s-col span='6'>
          <s-row>
            <s-col class="business_count" span='10'>
              <div class="bus_details_b">
                <i class="icon iconfont icon-aim"></i>
              </div>
            </s-col>
            <s-col span='14'>
              <div class="font_a">{{busRow.effectName}}</div>
              <div class="font_b">影响度</div>
            </s-col>
          </s-row>
        </s-col>
        <s-col span='6'>
          <s-row>
            <s-col class="business_count" span='10'>
              <div class="bus_details_c">
                <i class="icon iconfont icon-user"></i>
              </div>
            </s-col>
            <s-col span='14'>
              <div class="font_a">{{busRow.maintenanceView ? busRow.maintenanceView.userRealName:''}}</div>
              <div class="font_b">责任人</div>
            </s-col>
          </s-row>
        </s-col>
        <s-col span='6'>
          <s-row>
            <s-col class="business_count" span='10'>
              <div class="bus_details_d">
                <i class="icon iconfont icon-frequency"></i>
              </div>
            </s-col>
            <s-col span='14'>
              <div class="font_a">{{busRow.frequency}}</div>
              <div class="font_b">监控频率(分钟)</div>
            </s-col>
          </s-row>
        </s-col>
      </s-row>
      <Business-Defin style="margin-top:24px" :BuseyeUuid='BuseyeUuid'></Business-Defin>
    </s-scrollbar>
  </div>
</template>
<style lang="stylus">
.business_nav
  .business_count
    div
      height 50px
      width 50px
      border-radius 50%
      text-align center
      i
        font-size 25px
        color #fff
        line-height 50px
    .bus_details_b
      background: #F9A132
    .bus_details_c
      background: #32B2F9
    .bus_details_d
      background: #8AD77F
    .bus_details_a
      background: #60ACFC

  .font_a
    font-size 16px
    font-weight bold
    height 25px
    line-height 25px
  .font_b
    opacity: 0.45;
    height 25px
    line-height 25px
</style>
<script>
 import BusinessDefin from '../BusinessDefin'
export default {
  data() {
    return {
      data: ''
    }
  },
  props: {
    BuseyeUuid: {
      type: String
    },
    busRow: {
      type: Object,
      default: function() {
        return {
        }
     }
    }
  },
  components: {
    BusinessDefin
  },
  created() {
  }
}
</script>
