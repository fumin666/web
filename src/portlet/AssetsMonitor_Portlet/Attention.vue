<template>
  <!--关注监控资产-->
  <div class="diy-monitor-attention">
    <s-card-diy :more-click="more"
                title="关注监控资产">
      <div class="foucs-card-body" style="height: 250px;">
      <s-carousel :autoplay="false" arrow="never" class="foucs-assets" v-if="filterConcertList.length > 0">
        <s-carousel-item :key="'concern' + index"
                         v-for="(item,index) in filterConcertList">
          <s-row class="foucs-assets-row">
            <s-col :class="statusClass(innerItem)" :key="'innerItem' + index" class="foucs-assets-col" v-for="(innerItem,index) in item">
              <s-row align="middle" justify="center" style="height: 100%" type="flex">
                <s-col class="foucs-assets-icon" span="4">
                  <i class="iconfont icon-hardware feature"></i>
                </s-col>
                <s-col span="20">
                  <div class="titleWord">
                    <span class="feature">{{innerItem.pingStatus}}</span>
                    <s-tooltip :content="innerItem['资产名称']">
                      <span class="compName">{{innerItem['资产名称']}}</span>
                    </s-tooltip>
                  </div>
                  <div class="contentWord">
                    {{innerItem['IP地址']}}
                    <span>|</span>
                    {{innerItem['资产类型']}}
                  </div >
                </s-col>
              </s-row>
            </s-col>
          </s-row>
        </s-carousel-item>
      </s-carousel>
      </div>
    </s-card-diy>
  </div>
</template>

<script>
import $axios from 'sunflower-ajax'
// import MonitorAttention from '@/pages/AssetsMonitor_List/MonitorList'

export default {
  data() {
    return {
      concernList: []
    }
  },
  components: {
    // MonitorAttention
  },
  computed: {
    filterConcertList() {
      if (this.concernList.length === 0) {
        return [];
      } else {
        let arr = [];
        for (let i = 0; i < this.concernList.length; i = i + 3) {
          if (i >= 9) break;
          arr.push([]);
          let lastIndex = arr.length - 1;
          this.concernList[i] && arr[lastIndex].push(this.concernList[i]);
          this.concernList[i + 1] && arr[lastIndex].push(this.concernList[i + 1]);
          this.concernList[i + 2] && arr[lastIndex].push(this.concernList[i + 2]);
        }
        return arr;
      }
    }
  },
  methods: {
    axiosDataBoard() {
      $axios.get('/resourcemanager/assetmanager/itasset/statisticsAllMonitorItcomp').then(res => {
        this.statData = res.data
      })
    },
    goto(path, query) {
      let queryStr = query ? `?${query}=true` : ''
      this.$router.push('/AssetsMonitor/' + path + queryStr)
    },
    more() {
      this.goto('assetsMonitor_concernList?concern=true')
    },
    statusClass(innerItem) {
      switch (innerItem.pingStatus) {
        case '【宕机】': // 宕机
          return 'crashBg';
        case '【正常】': // 正常
          return 'normalBg';
        case '【告警】': // 告警
          return 'alarmBg';
        default:
          return '';
      }
    },
    axiosConcernList() {
      let param = {
        condition: {
          canMonitor: 1,
          citypelist: [],
          concern: true
        },
        categoryuuid: ''
      }
      $axios.post('/resourcemanager/assetmanager/itasset/getItassetlisAutoView', param).then(res => {
        this.concernList = res.data.confitItemData.datalist
        for (let i = 0; i < this.concernList.length; i++) {
          if (this.concernList[i]['状态'] === 0) {
            this.concernList[i].pingStatus = '【宕机】'
          } else if (this.concernList[i]['状态'] === 1) {
            this.concernList[i].pingStatus = '【正常】'
          } else {
            this.concernList[i].pingStatus = '【告警】'
          }
        }
      })
    }
  },
  created() {
    this.axiosConcernList()
  }
}
</script>
<style>
  .diy-monitor-attention {
    width: 100%;
    height: 100%;
  }
</style>
