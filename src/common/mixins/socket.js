import io from 'socket.io-client'
import {getComponentsPath} from 'SunflowerConfig'

module.exports = {
    data() {
      return {
        chatSocket: {},
        chatSocketList: []
      }
    },
    props: {
      nameSpace: String
    },
  created() {
      let host = process.env.BASE_API || getComponentsPath()
      let nameSpace = this.nameSpace
      this.chatSocketList = io(host + nameSpace);
      this.chatSocketList.on('connect', this.connectHandler);
      this.chatSocketList.on('message', this.messageHandler);
      this.chatSocketList.on('disconnect', this.disconnectHandler);
    },
    methods: {
      connectHandler() {
        console.log('Client has connected to the server!');
      },
      messageHandler(data) {
        this.$emit('message-callback', data);
      },
      disconnectHandler() {
        console.log('The client has disconnected!')
      },
      disconnectSocket() {
        this.chatSocketList.disconnect();
        // this.chatSocket.disconnect();
      }
    },
    beforeDestroy() {
      if (this.chatSocketList) {
        this.chatSocketList.disconnect();
        this.chatSocketList = [];
      }
    },
    render(h) {
      return h('div');
    }
}
