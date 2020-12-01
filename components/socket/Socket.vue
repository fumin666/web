<template>
  <div style="display: none"></div>
</template>
<script>
  import io from 'socket.io-client'
  export default {
    data() {
      return {
        chatSocket: {},
        chatSocket2: {},
        chatSocketList: []
      }
    },
    mounted: function () {
      let host = process.env.BASE_API
      let nameSpace = this.$store.getters.userData.uuid
      this.chatSocketList = io(host + nameSpace);
      this.chatSocketList.on('connect', this.connectHandler);
      this.chatSocketList.on('message', this.messageHandler);
      this.chatSocketList.on('disconnect', this.disconnectHandler);
      /* $axios.post('/systemmanager/sysConfig/getNginxIpList', {
        ip: $axios.basePath().replace(/\/$/, '').replace(/^[^:]*:\/\//, '')
      }).then(({data}) => {
        if (data) {
          for (let i = 0; i < data.length; i++) {}
        }
      }) */
    },
    methods: {
      connectSocket() {
      },
      connectHandler() {
        return function () {
          console.log('Client has connected to the server!');
        }
      },
      messageHandler(data) {
        console.log(data.message)
        var _self = this;
        _self.$audio().play();
        _self.$notify({
          title: _self.$store.getters.userName,
          message: data.message,
          dangerouslyUseHTMLString: false,
          duration: 5000,
          fixed: true
        });
      },
      disconnectHandler() {
        return function () {
          console.log('The client has disconnected!');
        }
      }
    },
    beforeDestroy() {
      if (this.chatSocketList) {
        this.chatSocketList.disconnect();
        this.chatSocketList = [];
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .s-notification
    .s-notification-group
      .s-notification-content
        word-break: break-all
</style>
