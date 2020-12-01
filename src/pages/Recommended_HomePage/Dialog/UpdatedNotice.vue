<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-31 15:58:16
 * @LastEditTime: 2019-07-31 15:58:16
 * @LastEditors: your name
 -->
<template>
  <s-dialog v-model="dialogFlag" title="最新通知"  width="800px">
    <div style="min-height: 200px" v-nodata="newEvents.length===0">
      <s-scrollbar wrap-style="max-height: 400px;">
        <s-timeline id="event-timeline">
          <s-timeline-item v-for="item in newEvents" :key="item.id">
            <event-item isDialog :data="item" @eventDialog="cons"></event-item>
          </s-timeline-item>
        </s-timeline>
      </s-scrollbar>
    </div>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import eventItem from '@/home/OperationCenter/EventItemMore'
  export default {
    components: {
      eventItem
    },
    data() {
      return {
        dialogFlag: false,
        tableData: [],
        form: {
          type: '',
          time: ''
        },
        newEvents: []
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.getNewEventList()
    },
    methods: {
      defSearch() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询条件',
          searchProps: []
        }
      },
      getNewEventList() {
        $axios.get('operationCenter/getOperationPushLog').then(res => {
          this.newEvents = res.data
        })
      },
      cons(detail) {
        this.$emit('chooseDialog', detail)
      }
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
