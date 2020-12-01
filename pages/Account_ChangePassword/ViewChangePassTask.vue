<template>
  <section>
    <s-row class="taskRow">
      <s-col span="8" class="grid-content bg-purple">任务名称：</s-col>
      <s-col span="16" class="grid-content bg-purple-light">{{viewData.taskName}}</s-col>
    </s-row>
    <s-row class="taskRow">
      <s-col span="8" class="grid-content bg-purple">任务创建者：</s-col>
      <s-col span="16" class="grid-content bg-purple-light">{{viewData.userName}}</s-col>
    </s-row>
    <s-row class="taskRow">
      <s-col span="8" class="grid-content bg-purple">改密任务周期：</s-col>
      <s-col span="16" class="grid-content bg-purple-light">{{viewData.periodStrTemp}}</s-col>
    </s-row>
    <s-row class="taskRow">
      <s-col span="8" class="grid-content bg-purple">开始时间：</s-col>
      <s-col span="16" class="grid-content bg-purple-light">{{viewData.tScheduleTime.firstFireTime}}</s-col>
    </s-row>
    <s-row class="taskRow">
      <s-col span="8" class="grid-content bg-purple">结束时间：</s-col>
      <s-col span="16" class="grid-content bg-purple-light">{{viewData.tScheduleTime.isForever !==1 ? (viewData.tScheduleTime.endFireTime ? viewData.tScheduleTime.endFireTime : '-') : '永不结束'}}</s-col>
    </s-row>
    <s-row class="taskRow">
      <s-col span="8" class="grid-content bg-purple">口令长度：</s-col>
      <s-col span="16" class="grid-content bg-purple-light">{{viewData.passwdLenth}}</s-col>
    </s-row>
    <s-row class="taskRow">
      <s-col span="8" class="grid-content bg-purple">口令组成：</s-col>
      <s-col span="16" class="grid-content bg-purple-light">{{passwdCtn}}</s-col>
    </s-row>
    <s-row class="taskRow">
      <s-col span="8" class="grid-content bg-purple">结果发送至：</s-col>
      <s-col span="16" class="grid-content bg-purple-light">{{viewData.emailTxt}}</s-col>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  export default{
    data () {
      return {
        viewData: {}
      }
    },
    props: {
      data: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    computed: {
      passwdCtn() {
        let resultStr = '大写字母、小写字母、'
        if (this.viewData.passwdD === 1) {
          resultStr += '数字、'
        }
        if (this.viewData.passwdS === 1) {
          resultStr += '特殊字符、'
        }
        resultStr = resultStr.substring(0, resultStr.length - 1)
        return resultStr
      }
    },
    created() {
      this.viewData = this.data
      $axios.get('/archiveDevice/getList').then((res) => {
        let resData = res.data
        if (resData.length !== 0) {
          resData.forEach((item) => {
            if (item.uuid === this.viewData.backupServerUuid) {
              this.$set(this.viewData, 'emailTxt', `${item.archiveDeviceName}(${item.archiveDeviceIp})`)
            }
          })
        }
      })
    }
  }
</script>
