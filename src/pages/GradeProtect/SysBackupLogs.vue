<template>
  <div>
    <s-row style="text-align:center;margin-top:100px;">
      <s-col span="8" >
        <div class="icon iconfont icon-file" style="font-size:40px;"></div>
        <div class="sys">最新备份文件</div>
        <div class="text">{{sysBackupLogs.backupFileName}}</div>
      </s-col>
      <s-col span="8">
        <div class="icon iconfont icon-clock" style="font-size:40px;"></div>
        <div class="sys">备份时间</div>
        <div class="text">{{sysBackupLogs.createTime}}</div>
      </s-col>
      <s-col span="8">
        <div class="icon iconfont icon-tag2" style="font-size:40px;"></div>
        <div class="sys">备份状态</div>
        <div class="text">{{sysBackupLogs.backStatus}}</div>
      </s-col>
    </s-row>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
    export default {
       data() {
         return {
           sysBackupLogs: {
             backupFileName: '暂无数据',
             createTime: '暂无数据',
             backStatus: '暂无数据'
           }
         }
       },
      created() {
        this.getIndexInfo()
        this.getInfo()
      },
      methods: {
        getInfo() {
          $axios.get('/omaIndex/getSystemManagerPage').then((res) => {
            this.sysBackupLogs = res.data.sysBackupInfo
            this.sysBackupLogs.createTime = this.formatDate(res.data.sysBackupInfo.createTime * 1000)
          })
        },
        /* 时间格式化(s->yy-mm-dd hh:mm:ss) */
        formatDate(seconds) {
          if (seconds) {
            let date = new Date()
            date.setTime(seconds)
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
        },
        getIndexInfo() {
          $axios.get('/system/getManagerInfo').then((res) => {
            if (res.data) {
              if (res.data.sysBackupLogs.length !== 0) {
                this.sysBackupLogs = res.data.sysBackupLogs[0]
                this.sysBackupLogs.nextBackTime = res.data.nextBackTime
              }
            }
          })
        }
      }
    }
</script>

<style scoped>

</style>
