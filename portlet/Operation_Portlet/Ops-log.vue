/**
* Created by alex on 2018/12/4.
*/
<template>
  <div class="oper-box">
    <s-card-diy :title="'运维日志'" :more-click="goto">
      <section v-nodata="opsLog.length === 0">
        <div class="operateLogItem" v-for="item in opsLog" :key="item.id">
          <s-row class="log-item">
            <s-col span="4" class="oper-img tc">
              <img :src="`static/images/topologyicon/default/${item.iconName}.svg`" style="width: 28px;height: 28px" alt="">
            </s-col>
            <s-col span="13" class="oper-details">
              <div style="height: 23px"><span class="ip">{{item.deviceIp}}</span></div>
              <div>
                <s-row>
                  <s-col span="12" class="ellipsis info" style="min-width: 56px;">
                    <i class="iconfont icon-user"></i>
                    <span class="client" :title="item.accountName">{{item.accountName}}</span>
                  </s-col>
                  <s-col span="12" class="ellipsis info" style="min-width: 56px;">
                    <i class="iconfont icon-server"></i>
                    <span :title="item.protocolName">{{item.protocolName}}</span>
                  </s-col></s-row>
              </div>
            </s-col>
            <s-col span="7" class="text-right">
              <s-tag type="tpwarning">{{item.sessionAuditResultName}}</s-tag>
            </s-col>
          </s-row>
        </div>
      </section>
    </s-card-diy>
  </div>
</template>

<script type="text/babel">
import $axios from 'sunflower-ajax'
export default {
  data() {
    return {
      opsLog: []
    }
  },
  created() {
    this.getOpsLogList()
  },
  methods: {
    getOpsLogList () {
      $axios.get('/operationCenter/getNewOperationLogList').then(res => {
        this.opsLog = res.data.splice(0, 9)
      })
    },
    goto() {
      this.$router.push('/OperationCenter/oper_log')
    }
  }
}
</script>
