<template>
  <s-dialog
    v-model="dialogFlag"
    v-if="dialogFlag"
    width="800px"
    append-to-body
    title="查看">
    <div style="font-size: 16px;line-height: 22px;margin-top:10px;font-weight:bold">{{busRow.name}}</div>
    <div style="height:32px" class="business-layout">
      <s-button-group style="float:right;">
          <s-button @click="showModel('busDetails')" :class="{'list': currentView !== 'busDetails'}">业务服务详情</s-button>
          <s-button @click="showModel('busAffect')" :class="{'list': currentView !== 'busAffect'}">业务服务影响</s-button>
      </s-button-group>
    </div>
    <component :is="currentView" :busRow='busRow' :BuseyeUuid='BuseyeUuid' style="padding-top:16px;"></component>
  </s-dialog>
</template>
<script>
  import busDetails from './busDetails'
  import busAffect from './busAffect'
  // import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        dialogFlag: false,
        currentView: 'busDetails'
      }
    },
    components: {
      busDetails,
      busAffect
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      BuseyeUuid: {
        type: String
      },
      busRow: {
        type: Object
      }
    },
    methods: {
      showModel(val) {
        this.currentView = val
      }
    },
    created() {

    },
    computed: {

    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    }
  }
</script>

<style lang="stylus">
.business_select
  .s-button
    background #fff
    color #000
    border 1px solid #DCDEE2
  .is-active
    border 1px solid #FF9023
    background  #fff
    color #000
</style>
