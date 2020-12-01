<template>
  <section id="modifyConflict">
    <div class="rank-top" v-nodata="ConflictOrders.length === 0">
      <s-scrollbar wrap-style="max-height: 500px">
        <div class="changecontent">
          <div class="changetest" v-for="(item, index) in ConflictOrders">
            <div class="titletest" @click="goChange(item.uuid)">{{index + 1}}. {{item.orderCode}}</div>
            <s-row class="timetest"><s-col :span="10">计划开始时间</s-col><s-col :span="14"  style="text-align: right;">{{item.planStartTime}}</s-col></s-row>
            <s-row class="timetest"><s-col :span="10">计划结束时间</s-col><s-col :span="14" style="text-align: right">{{item.planEndTime}}</s-col></s-row>
          </div>
        </div>
      </s-scrollbar>
    </div>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  export default {
    data () {
      return {
        ConflictOrders: []
      }
    },
    props: {
      orderUuid: {
        type: String,
        default: ''
      }
    },
    components: {
    },
    methods: {
      getAllConflictOrders() {
        $axios.get(`/itilWorkflowCenter/getConflictOrders/${this.orderUuid}`).then((res) => {
          this.ConflictOrders = res.data
        })
      },
      goChange(uuid) {
        this.goto('ProcessCenter/modifyDetail/' + uuid);
      }
    },
    mounted() {
    },
    created() {
      this.getAllConflictOrders()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #modifyConflict
    .s-scrollbar-wrap
      margin-bottom: -17px
    .titletest
      font-size: 16px
      margin-left: 10px
      cursor:pointer
    .timetest
      margin-left: 10px
      margin-right: 5px
</style>
