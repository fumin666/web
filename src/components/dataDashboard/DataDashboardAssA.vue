<template>
  <div class="state-table">
    <div class="state-info">
      <div class="state-i-tops">
        <div class="state-icon statelag"><i class="icon iconfont " :class="[ currentData.icon ]"></i></div>
        <div class="state-i-details">
          <div class="state-i-title">{{ currentData.title }}</div>
          <div class="state-i-num">{{ currentData.count }}</div>
        </div>
      </div>
      <div class="state-i-bottom">
        <div class="state-data" v-for="(value, key) in currentData.data">
          <div class="state-d-icon" :class="{'state-d-normal': (key === '正常'), 'state-d-warning': (key === '告警'),'state-d-outage': (key === '异常')}" v-if="key==='正常' || key==='告警' ||　key === '异常'"></div>
          <div class="state-d-title">{{ key }}：</div>
          <div class="state-d-num">{{ value }}</div>
          <div class="clr"></div>
        </div>
      </div>
    </div>
    <div class="state-line" :class="{'state-6-item': (data.length === 6),'state-7-item': (data.length === 7),'state-8-item': (data.length === 8)}">
      <div class="state-item" v-for="(item, index) in data" :class="{ 'Dbcurrent': (index + 1) === Dbcurrent }"　@mouseover="overFun(index)" @mouseout="outFun()" @click ="clihandle(item.title)" style="cursor:pointer">
        <span class="state-title">{{ item.title }}</span>
        <a class="state-num">{{ item.count }}</a>
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
          this.Dbcurrent ++;
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
          path: '/AssetsAll/' + path,
          query: {name: item}
        })
      },
      clihandle(item) {
        this.goto(this.url, item)
      }
    },
    computed: {
      currentData: function () {
        return this.data[this.Dbcurrent - 1] || {
            icon: '',
            title: '',
            count: ''
          };
      }
    }
  }
</script>
