export default {
  methods: {
    formatTime(val) {
      if (Object.prototype.toString.apply(val).indexOf('Date') !== -1) {
        return val.getFullYear() + '-' + (val.getMonth() + 1) + '-' + val.getDate() + ' ' + val.getHours() + ':' + val.getMinutes() + ':' + val.getSeconds();
      }
      return '';
    },
    parseTime(val) {
      let time = Number.parseInt(val / 1000);
      let s = time % 60;
      let m = Math.floor(time / 60) % 60;
      let h = Math.floor(Math.floor(time / 60) / 60);
      return `${h}小时${m}分钟${s}秒`;
    }
  }
}
