/**
* Created by zhengx
*/
<template>
  <div class="diy-single-event-recover">
    <s-card-diy
      :title="title"
      :more-click="moreClick"
      show-scrollbar>
      <template v-for="item in list">
        <event-item :item="item"></event-item>
      </template>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import EventItem from '@/home/EventCenter/EventItem';

  export default {
    components: {
      EventItem
    },

    props: { // 0表示查询未恢复 1表示查询已恢复 2表示查询所有
      type: {
        type: Number,
        default: 2
      },
      system: {     // 0-所有 1-监控 2-数据库 3-业务审计 4-日志审计 5-运维审计
        type: Number,
        default: 0
      }
    },

    data() {
      return {
        list: []
      }
    },

    computed: {
      title: function () {
        return ['最新未恢复事件', '最新恢复事件', '最新事件'][this.type];
      }
    },

    created() {
      this.getList();
    },

    methods: {
      getList() {
        let param = ['6,5,4,3,8', '6,5,4,3,9', '6,5,4,3,8,9'];
        $axios.get('/eventCount/getIncidentInfoTop10/' + param[this.type] + '/' + this.system).then(({data}) => {
          this.list = data;
        });
      },

      moreClick() {
        this.$router.push({path: '/EventCenter/event_list/0/0/0'});
      }
    }
  }
</script>

<style>
  .diy-single-event-recover {
    width: 100%;
    height: 100%;
  }
  .diy-single-event-recover .s-col-18 {
    width: 100%;
  }
  .diy-single-event-recover .s-col-6 {
    display: none;
  }
  .diy-single-event-recover .eventItem {
    margin: 10px;
    box-shadow: 2px 4px 20px rgba(59, 138, 238, .1);
  }
</style>
