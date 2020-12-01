<template>
  <section>
    <s-box :data="aduitResult" :bars="4" type="vertical"></s-box>
    <s-table-page :data="ghostList" style="margin-top: 10px">
      <s-table-column
        prop="assetAccountName"
        label="资产账号名称">
      </s-table-column>
      <s-table-column
        prop="deviceIp"
        label="IP地址">
      </s-table-column>
      <s-table-column
        prop="deviceName"
        label="资产名称">
      </s-table-column>
      <s-table-column
        prop="execTime"
        label="稽核时间">
      </s-table-column>
    </s-table-page>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  export default {
    data () {
      return {
        aduitResult: [
          {
            icon: 'clock',
            title: this.init.execTimeStr,
            des: '稽核时间'
          },
          {
            icon: 'sponsor',
            title: this.init.userName,
            des: '稽核申请者'
          },
          {
            icon: 'hardware',
            title: this.init.deviceCount !== undefined ? this.init.deviceCount + '个' : '',
            des: '稽核资产数'
          },
          {
            icon: 'snmp-response',
            title: this.init.accountCount !== undefined ? this.init.accountCount + '个' : '',
            des: '幽灵账号'
          }
        ],
        ghostList: []
      }
    },
    props: {
      init: {
        type: Object
      }
    },
    created() {
      let form = {
        taskuuid: this.init.taskUuid,
        excutetime: this.init.execTimeStr
      }
      $axios.post('/collectTask/getGhostAccountInfo', form).then((res) => {
        this.ghostList = res.data
      });
    }
  }
</script>
