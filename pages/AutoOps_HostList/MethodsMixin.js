/**
 * Created by caoLiXin on 2018/8/21.
 */
export default {
  methods: {
    // 转换主机状态
    calHostStatus(status) {
      switch (parseInt(status)) {
        case 0: return {color: '#eb5952', text: '异常'};
        case 1: return {color: '#4ec283', text: '正常'};
        case 2: return {color: '#f4cc2b', text: '告警'};
        default: return {color: '#eb5952', text: '宕机'};
      }
    },
    // 转换脚本状态
    calScriptStatus(item) {
      switch (parseInt(item)) {
        case 0: return {color: '#eb5952', text: '失败'};
        case 1: return {color: '#4ec283', text: '成功'};
        case 2: return {color: '#6098ee', text: '执行中'};
        default: return {color: 'transparent', text: ''};
      }
    }
  }
}
