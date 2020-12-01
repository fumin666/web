/**
* Created by alex on 2017/8/17.
 */

<template>
  <div style="min-height: 200px" v-nodata="newEvents.length===0">
    <s-scrollbar wrap-style="max-height: 400px;">
      <s-timeline id="event-timeline">
        <s-timeline-item v-for="item in newEvents" :key="item.id">
          <event-item-more isDialog :data="item" @eventDialog="cons"></event-item-more>
        </s-timeline-item>
      </s-timeline>
    </s-scrollbar>
  </div>
</template>

<script type="text/babel">
  import eventItemMore from './EventItemMore'
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        newEvents: []
      }
    },
    components: {
      eventItemMore
    },
    methods: {
      cons(detail) {
        this.$emit('chooseDialog', detail)
      },
      getNewEventList() {
        $axios.get('operationCenter/getOperationPushLog').then(res => {
          this.newEvents = res.data
        })
      }
    },
    created() {
      this.getNewEventList()
    }
  }
</script>
