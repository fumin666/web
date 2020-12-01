<template>
  <span style="display: inline-block;margin: 5% 0 0 42%;">
    <li v-for="item in items" :class="item.classStr">
      <span :style="'width:' + item.spanWith+ 'px;'" v-if="item.spanWith !== 0 "></span>
      <span v-if="item.spanWith === 0 "></span>
    </li>
  </span>
</template>

<script>
  export default {
    data() {
      return {
        items: []
      }
    },
    props: ['item', 'currentData', 'currentStyle'],
    created() {
      this.battary(this.item);
    },
    methods: {
      battary(data) {
        let oLiWidth = 4;
        let sum = data.offlineCount + data.normalCount + data.alertCount;
        let percent = (this.currentData / sum * 100).toFixed(2);
        let lastIndex = parseInt(percent / 10);
        let res = percent % 10;
        let total = lastIndex;
        // 所有有值处
        for (let i = 0; i < lastIndex; i++) {
          this.items.push({
            classStr: this.currentStyle,
            spanWith: oLiWidth
          })
        }
        // 余数
        if (res > 0) {
          this.items.push({
            classStr: this.currentStyle,
            spanWith: res * 0.1 * oLiWidth
          });
          total++;
        }
        // 填写不满
        if (total < 9) {
          for (let i = 0; i < 9 - total; i++) {
            this.items.push({
              classStr: '',
              spanWith: oLiWidth
            })
          }
        }
        if (sum === 0) {
          lastIndex = 10
          for (let i = 0; i < lastIndex; i++) {
            this.items.push({
              classStr: '',
              spanWith: oLiWidth
            })
          }
        }
      }
    }
  }
</script>

<style scoped>
  .battery-item li.normal span {
    background: #36B892;
  }
  .battery-item li.warn span {
    background: #F89030;
  }
  .battery-item li.down span {
    background: #F83C30;
  }
</style>
