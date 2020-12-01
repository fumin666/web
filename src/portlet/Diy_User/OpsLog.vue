<template>
  <div class="diy-user-ops-log">
    <s-card-diy
      title="运维日志"
      :more-click="moreClick">
      <s-carousel :interval="5000" arrow="never" :autoplay="false" height="139px" v-if="list.length !== 0">
        <s-carousel-item v-for="(i, idx) in carouselLength" :key="idx">
          <div v-for="(m, index) in 4" :key="index" class="log-item">
            <div class="my-icon"></div>
            <div class="my-ip">{{list[4 * (i - 1) + m - 1].deviceIp}}</div>
            <div class="my-type">{{list[4 * (i - 1) + m - 1].sessionType}} | {{list[4 * (i - 1) + m -1].oprateUser}}</div>
            <div class="my-time">{{list[4 * (i - 1) + m - 1].startTime}}</div>
          </div>
        </s-carousel-item>
      </s-carousel>
      <div v-if="list.length === 0" height="139px" style="text-align: center;line-height: 139px"> 暂无数据 </div>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  export default {
    data() {
      return {
        list: []
      }
    },

    computed: {
      carouselLength() {
        return Math.floor(this.list.length / 4);
      }
    },

    created() {
      this.getList();
    },

    methods: {
      getList() {
        let form = {
          condition: {},
          currentPage: 1
        };
        $axios.post('/basicOperation/getOperationLogList', form).then(({ data }) => {
          // TODO: 以下为伪造数据
          // data = [
          //   { deviceIp: '192.168.211.213', sessionType: '基本运维', oprateUser: '超级管理员', startTime: '2018-10-16 20:12:30' },
          //   { deviceIp: '192.168.211.213', sessionType: '紧急故障处理', oprateUser: '超级管理员', startTime: '2018-10-16 20:12:30' },
          //   { deviceIp: '192.168.211.213', sessionType: '基本运维', oprateUser: '超级管理员', startTime: '2018-10-16 20:12:30' },
          //   { deviceIp: '192.168.211.213', sessionType: '基本运维', oprateUser: '超级管理员', startTime: '2018-10-16 20:12:30' },
          //   { deviceIp: '192.168.211.213', sessionType: '基本运维', oprateUser: '超级管理员', startTime: '2018-10-16 20:12:30' },
          //   { deviceIp: '192.168.211.213', sessionType: '紧急故障处理', oprateUser: '超级管理员', startTime: '2018-10-16 20:12:30' },
          //   { deviceIp: '192.168.211.213', sessionType: '基本运维', oprateUser: '超级管理员', startTime: '2018-10-16 20:12:30' },
          //   { deviceIp: '192.168.211.213', sessionType: '基本运维', oprateUser: '超级管理员', startTime: '2018-10-16 20:12:30' },
          //   { deviceIp: '192.168.211.213', sessionType: '基本运维', oprateUser: '超级管理员', startTime: '2018-10-16 20:12:30' },
          //   { deviceIp: '192.168.211.213', sessionType: '紧急故障处理', oprateUser: '超级管理员', startTime: '2018-10-16 20:12:30' },
          //   { deviceIp: '192.168.211.213', sessionType: '基本运维', oprateUser: '超级管理员', startTime: '2018-10-16 20:12:30' },
          //   { deviceIp: '192.168.211.213', sessionType: '基本运维', oprateUser: '超级管理员', startTime: '2018-10-16 20:12:30' },
          //   { deviceIp: '192.168.211.213', sessionType: '基本运维', oprateUser: '超级管理员', startTime: '2018-10-16 20:12:30' },
          //   { deviceIp: '192.168.211.213', sessionType: '紧急故障处理', oprateUser: '超级管理员', startTime: '2018-10-16 20:12:30' },
          //   { deviceIp: '192.168.211.213', sessionType: '基本运维', oprateUser: '超级管理员', startTime: '2018-10-16 20:12:30' },
          //   { deviceIp: '192.168.211.213', sessionType: '基本运维', oprateUser: '超级管理员', startTime: '2018-10-16 20:12:30' }
          // ];
          this.list = data.slice(0, 13);
        });
      },
      moreClick() {
        this.$router.push('/OperationCenter/oper_log');
      }
    }
  }
</script>
<style>
  .diy-user-ops-log {
    width: 100%;
    height: 100%;
  }
  .diy-user-ops-log .log-item {
    height: 30px;
    line-height: 30px;
    display: flex;
    flex-direction: row;
    padding-left: 15px;
    padding-right: 15px;
  }
  .diy-user-ops-log .my-icon {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: #FFCE60;
    margin-top: 10px;
  }
  .diy-user-ops-log .my-ip {
    font-size: 14px;
    padding-left: 6px;
  }
  .diy-user-ops-log .my-type {
    font-size: 14px;
    color: #9C9796;
    flex: 1;
    padding-left: 12px;
  }
  .diy-user-ops-log .my-time {
    font-size: 12px;
    color: #9C9796;
  }
</style>
