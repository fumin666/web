<template>
  <div class="state-table">
    <s-button icon="list" class="iconbutton btn" @click="inList"></s-button>
    <div class="state-line"
         :class="{'state-6-item': (data.length === 6),'state-7-item': (data.length === 7),'state-8-item': (data.length === 8)}">
      <div class="state-item"
           v-for="(item, index) in data" :class="{ 'Dbcurrent': (index + 1) === Dbcurrent }" 　
           @mouseover="overFun(index)" @mouseout="outFun()"
           @click="clihandle(item)"
           :key="index"
           style="cursor:pointer; box-sizing: border-box; display: flex">
        <span class="state-title"
              style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; word-break: keep-all; margin: 0;"
              :title="item.citypeName">{{ item.citypeName }}</span>
        <a class="state-num" style="width: 25px;">{{ item.ciCount }}</a>
      </div>
    </div>
    <div class="state-info" style="border-radius: 0 100px 100px 0;" :title="currentData.citypeName">
      <div class="state-i-top">
        <!--<div class="state-icon"><i class="icon iconfont" :class="[ currentData.icon ]"></i></div>-->
        <div class="state-i-detail" style="display: inline-block; width: 100%; text-align: center">
          <div class="state-i-title"
               style="width:100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; word-break: keep-all;">
            {{ currentData.citypeName }}
          </div>
          <div class="state-i-num">{{ currentData.ciCount }}</div>
        </div>
      </div>
      <div class="state-i-bottom">
        <!-- <div class="state-data" v-for="(value, key) in currentData" :key="key">
          <div class="state-d-icon"
               :class="{'state-d-normal': (key === '正常'), 'state-d-warning': (key === '告警'),'state-d-outage': (key === '异常')}"
               v-if="key==='正常' || key==='告警' ||　key === '异常'"></div>
          <div class="state-d-title">{{ key }}：</div>
          <div class="state-d-num">{{ value }}</div>
          <div class="clr"></div>
        </div> -->
        <div class="state-data">
          <div class="state-d-icon state-d-warning"></div>
          <div class="state-d-title">告警：</div>
          <div class="state-d-num">{{ currentData.alertCount }}</div>
          <div class="clr"></div>
        </div>

        <div class="state-data">
          <div class="state-d-icon state-d-normal"></div>
          <div class="state-d-title">正常：</div>
          <div class="state-d-num">{{ currentData.normalCount }}</div>
          <div class="clr"></div>
        </div>

        <div class="state-data">
          <div class="state-d-icon state-d-outage"></div>
          <div class="state-d-title">异常：</div>
          <div class="state-d-num">{{ currentData.offlineCount }}</div>
          <div class="clr"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'sDataDashboard',
    props: {
      data: {
        type: Array,
        required: true
      },
      url: String
    },
    data: function () {
      return {
        intervalTime: 2500,
        Dbcurrent: 1,
        interval: null
      }
    },
    mounted: function () {
      this.initInterval();
    },
    methods: {
      changeCurrent() {
        if (this.Dbcurrent + 1 <= this.data.length) {
          this.Dbcurrent++;
        } else {
          this.Dbcurrent = 1;
        }
      },
      overFun(index) {
        if (this.interval != null) {
          clearInterval(this.interval);
          this.interval = null;
        }
        this.Dbcurrent = index + 1;
      },
      outFun() {
        this.initInterval();
      },
      initInterval() {
        this.interval = setInterval(() => {
          this.changeCurrent();
        }, this.intervalTime);
      },
      goto(path, item) {
        this.$router.push({
          path: '/AssetsMonitor/' + path,
          query: {uuid: item.uuid, name: item.citypeName}
        })
      },
      clihandle(item) {
        this.goto(this.url, item)
      },
      inList() {
        this.goto('assetsMonitor_list', {uuid: '6cae901ede4d488fad4c807fc8bca9a2', citypeName: '主机系统'})
        // this.goto('assetsMonitor_list', this.currentData)
      }
    },
    computed: {
      currentData: function () {
        return this.data[this.Dbcurrent - 1] || {
            icon: '',
            citypeName: '',
            ciCount: ''
          };
      }
    }
  }
</script>
<style scoped>
.iconbutton{
  border-radius: 20px;
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  z-index: 10;
  opacity: 0.7;
  margin-top: 5px;
}
</style>

