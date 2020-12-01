<template>
  <div class="recentEvent" v-if="data.length > 0">
    <div class="eventItem" v-for="(item, index) in realData" :key="index">
      <img :src="stateImgs[item.level]" :alt="item.levelStr" class="state">
      <div class="eventInfo">
        <p>{{item.time}}</p>
        <s-tooltip :content="item.content"><p>{{item.content}}</p></s-tooltip>
      </div>
    </div>
  </div>
  <div v-else class="noData">暂无数据</div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import authCheck from '@/common/mixins/auth.js'

  export default {
    mixins: [authCheck],
    data() {
      return {
        data: [],
        stateImgs: [
          '../../../../static/images/incident/weizhi.png',
          '../../../../static/images/incident/zhengchang.png',
          '../../../../static/images/incident/tishi.png',
          '../../../../static/images/incident/jinggao.png',
          '../../../../static/images/incident/ciyao.png',
          '../../../../static/images/incident/zhuyao.png',
          '../../../../static/images/incident/yanzhong.png'
        ]
      }
    },
    computed: {
      realData() {
        return this.data.sort((a, b) => {
          return new Date(a.time).getTime() - new Date(b.time).getTime();
        }).slice(0, 5);
      }
    },
    props: {
      compId: {
        type: String,
        required: true
      }
    },
    created() {
      this.ImpAuth && this.axiosMonitorEvent();
      this.OmaAuth && this.axiosOpeEvent();
      this.DbaAuth && this.axiosDbEvent();
      this.DbaAuth && this.axiosBusinessEvent();
      this.SiemAuth && this.axiosLogEvent();
    },
    methods: {
      axiosMonitorEvent() { // 获取监控事件
        let param = {assetUuid: this.compId};
        $axios.post('incidentCount/incidentGroupList', param).then(({data}) => {
          if (data instanceof Array) {
            let arr = data.slice(0, 5).map(item => {
              item.time = item.modifyTimeStr;
              item.content = item.incidentContent;
              return item;
            });
            this.data = this.data.concat(arr);
          }
        });
      },
      axiosOpeEvent() { // 运维审计事件
        let param = {
          condition: {
            assetuuid: this.compId,
            accountName: null,
            sessionClientIp: null,
            deviceIp: null,
            protocolName: null,
            command_name: null,
            command_type: null,
            start_time: null,
            end_time: null
          },
          currentPage: 1,
          totalCount: -1,
          pageSize: 10,
          pageList: [],
          distinct: false,
          orderByClause: ''
        }
        $axios.post('/sessionCmd/list', param).then(({data}) => {
          if (data instanceof Array) {
            let arr = data.slice(0, 5).map(item => {
              item.time = item.createTime;
              item.content = item.commandName;
              return item;
            });
            this.data = this.data.concat(arr);
          }
        });
      },
      axiosDbEvent() { // 数据库审计事件
        let param = {
          condition: {
            dbi_uuid: this.compId,
            policy_name: null,
            dbi_name: null,
            dbi_ip: null,
            account_name: null,
            client_ip: null,
            alarm_level: null,
            start_time: null,
            end_time: null
          },
          currentPage: 1,
          totalCount: -1,
          pageSize: 10,
          pageList: [],
          distinct: false,
          orderByClause: ''
        };
        $axios.post('/dbaIncident/listDbaIncident/t_data_alarm_dbsql', param).then(({data}) => {
          if (data instanceof Array) {
            let arr = data.slice(0, 5).map(item => {
              item.time = this.formatDate(item.alarm_time);
              item.content = item.alarm_value;
              return item;
            });
            this.data = this.data.concat(arr);
          }
        });
      },
      axiosBusinessEvent() { // 业务审计事件
        let param = {
          condition: {
            app_uuid: this.compId,
            policy_name: null,
            dbi_name: null,
            dbi_ip: null,
            account_name: null,
            client_ip: null,
            alarm_level: null,
            start_time: null,
            end_time: null
          },
          currentPage: 1,
          totalCount: -1,
          pageSize: 10,
          pageList: [],
          distinct: false,
          orderByClause: ''
        };
        $axios.post('/dbaIncident/listDbaIncident/t_data_alarm_url', param).then(({data}) => {
          if (data instanceof Array) {
            let arr = data.slice(0, 5).map(item => {
              item.time = this.formatDate(item.alarm_time);
              item.content = item.alarm_value;
              return item;
            });
            this.data = this.data.concat(arr);
          }
        });
      },
      axiosLogEvent() { // 日志审计事件
        let param = {
          condition: {logSourceUuid: [this.compId]},
          currentPage: 1,
          totalCount: -1,
          pageSize: 10,
          pageList: [],
          distinct: false,
          orderByClause: ''
        }
        $axios.post('/searchManage/getEventInfolistForCondition', param).then(({data}) => {
          if (data instanceof Array) {
            let arr = data.slice(0, 5).map(item => {
              item.time = item.modifyTime;
              item.content = item.eventMessage;
              return item;
            });
            this.data = this.data.concat(arr);
          }
        });
      },
      formatDate(seconds) { // 时间格式化(时间戳s -> yyyy-MM-dd HH:mm:ss)
        if (seconds) {
          let date = new Date()
          date.setTime(seconds * 1000)
          let _month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
          let _date = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
          let _hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
          let _minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
          let _second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
          let dateStr = `${date.getFullYear()}-${_month}-${_date} ${_hour}:${_minute}:${_second}`
          return dateStr
        } else {
          return ''
        }
      }
    }
  }
</script>

<style lang="stylus">

</style>
