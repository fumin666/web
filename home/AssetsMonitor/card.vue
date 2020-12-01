<template>
  <div class="bus-content" v-if='busData.status'>
    <div class="nav">
      <div class="head" :class="businessServiceClass(busData.status)"> {{busData.statusName}}</div>
      <div style="width:100%;height:20px;">
        <div class="userRealname" style="width:120px;font-size:12px">
          <s-row>
            <s-col span='12' >责任人:</s-col>
            <s-col span='12' class="ellipsis">{{busData.maintenanceView? busData.maintenanceView.userRealName : ''}}</s-col>
          </s-row>
        </div>
      </div>
      <div class="ellipsis con" :title='busData.name'>{{ busData.name }}</div>
      <div class="bottom" style="padding:0 16px">
        <!-- <s-row > -->
          <!-- <s-col span='14'  style="border-right:2px solid #9195A7;padding:0 16px"> -->
            <div class="ellipsis" style="float:left"><span style="font-size:12px;line-height:20px;opacity:0.45">可用率:</span> <span style="font-size:16px;line-height:20px;opacity:0.85"> {{ busData.todayAvailable ? busData.todayAvailable : '00.0'}}%</span></div>
          <!-- </s-col> -->
          <!-- <s-col span='10' style="padding:0 10px"> -->
            <div style="float:left;border-left:1px solid #9195A7;height:20px;margin-left:10px;padding:0 10px"> <span style="font-size:12px;line-height:20px;opacity:0.45">影响度:</span><span style="font-size:16px;line-height:20px;opacity:0.85"> {{ busData.effectName }}</span> </div>
          <!-- </s-col> -->
        <!-- </s-row> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  props: {
    busData: {
      type: Object,
      default: function() {
        return {

        }
      }
    }
  },
  created() {
    this.$nextTick(() => {
      if (this.busData.status === 4) {
        this.busData.statusName = '未知'
      }
    })
  },
  methods: {
    businessServiceClass(val) {
      switch (val) {
        case 4:
          return 'business-gray'
        case 3:
          return 'business-success'
        case 2:
          return 'business-warning'
        case 1:
          return 'business-error'
        default:
          return ''
      }
    }
  }
}
</script>
