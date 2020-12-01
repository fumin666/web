/**
* Created by zhengx
*/
<template>
  <div class="diy-single-sys-status">
    <s-card-diy
      title="系统运行状态"
      :more-click="moreClick">
      <s-row type="flex" justify="center" align="middle" style="text-align: center" id="systemSetIndex">
        <s-col :span="8">
          <s-chart :chart="chart1" style="margin-left: -7px;"></s-chart>
          <div class="rate-title">CPU使用率</div>
          <div class="rate-con">核数{{cpuInfo.cpuNu || '0'}}</div>
          <div class="rate-con">使用率{{cpuInfo.cpuUse + '%'|| '0' + '%'}}</div>
        </s-col>
        <s-col :span="8">
          <s-chart :chart="chart2" style="margin-left: -7px;"></s-chart>
          <div class="rate-title">内存使用率</div>
          <div class="rate-con">总量{{memInfo.memTotal || '0'}}</div>
          <div class="rate-con">已用{{memInfo.memUsed || '0'}}</div>
        </s-col>
        <s-col :span="8">
          <s-chart :chart="chart3" style="margin-left: -7px;"></s-chart>
          <div class="rate-title">磁盘使用率</div>
          <div class="rate-con">总量{{diskInfo.diskTotal || '0'}}</div>
          <div class="rate-con">已用{{diskInfo.diskUsed || '0'}}</div>
        </s-col>
      </s-row>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {isEmpty} from 'lodash'

  export default {
    data() {
      return {
        chart1: {
          name: 'diySingleSysStatusCpu',
          type: 'ringChart',
          width: '100%',
          height: '100%',
          data: 0
        },
        chart2: {
          name: 'diySingleSysStatusMem',
          type: 'ringChart',
          width: '100%',
          height: '100%',
          data: 0
        },
        chart3: {
          name: 'diySingleSysStatusDisk',
          type: 'ringChart',
          width: '100%',
          height: '100%',
          data: 0
        },
        cpuInfo: {},
        memInfo: {},
        diskInfo: {}
      }
    },

    created() {
      this.getData();
    },

    methods: {
      getData() {
        $axios.get('/system/getManagerInfo').then((res) => {
          if (res.data) {
            if (!isEmpty(res.data.cpuInfo)) {
              this.cpuInfo = res.data.cpuInfo
              this.cpuInfo.cpuUse = parseInt(res.data.cpuInfo.cpuUse * 100)
            }
            if (!isEmpty(res.data.memInfo)) {
              this.memInfo.memTotal = this.unitFilter(res.data.memInfo.memTotal)
              this.memInfo.memUsed = this.unitFilter(res.data.memInfo.memUsed)
            }
            if (!isEmpty(res.data.diskInfo)) {
              this.diskInfo.diskTotal = this.unitFilter(res.data.diskInfo.diskTotal)
              this.diskInfo.diskUsed = this.unitFilter(res.data.diskInfo.diskUsed)
            }
            this.chart1.data = res.data.cpuInfo.cpuUse
            this.chart2.data = parseInt(res.data.memInfo.memUsed / res.data.memInfo.memTotal * 100)
            this.chart3.data = parseInt(res.data.diskInfo.diskUsed / res.data.diskInfo.diskTotal * 100)
          }
        })
      },

      unitFilter(n) {
        let num = parseInt(n)
        if (parseInt(num / 1024 / 1024) > 1) {
          return parseInt(num / 1024 / 1024) + 'GB'
        } else {
          return parseInt(num / 1024) + 'MB'
        }
      },

      moreClick() {
        this.$router.push('/SystemSet');
      }
    }
  }
</script>

<style>
  .diy-single-sys-status {
    width: 100%;
    height: 100%;
  }
  .diy-single-sys-status .rate-title {
    text-align: center;
  }
  .diy-single-sys-status .rate-con {
    text-align: center;
    font-size: 12px;
    color: #999;
  }
  .diy-single-sys-status .s-card-diy-body {
    display: flex;
  }
  .diy-single-sys-status .s-card-diy-body .s-row-flex {
    width: 100%;
  }
</style>
