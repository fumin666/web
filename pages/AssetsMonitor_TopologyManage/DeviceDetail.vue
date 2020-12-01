<template>
  <div class="content">
    <s-card class="box-card" style="width:100%;">
      <div slot="header" class="clearfix">
        <span class="card-title">
          <i class="iconfont icon-file"></i>
          资产详情信息
        </span>
        <s-button icon="arrow-left" size="mini" @click="backAction" title="返回" style="float: right;"></s-button>
      </div>
      <table class="itemTable">
        <tr>
          <td class="title bg-purple">IP地址</td>
          <td class="item bg-purple-light">{{ deviceDetail.controlAdderss }}</td>
          <td class="title bg-purple">责任人</td>
          <td class="item bg-purple-light">{{ checkData(deviceDetail.maintenanceUser, 'userLoginName') }}</td>
        </tr>
        <tr>
          <td class="title bg-purple">资产状态</td>
          <td class="item bg-purple-light">{{ statue(deviceDetail.pingStatus) }}</td>
          <td class="title bg-purple">Email</td>
          <td class="item bg-purple-light">{{ checkData(deviceDetail.maintenanceUser, 'userMail') }}</td>
        </tr>
        <tr>
          <td class="title bg-purple">资产类型</td>
          <td class="item bg-purple-light">{{ deviceDetail.citypeName }}</td>
          <td class="title bg-purple">CPU利用率</td>
          <td class="item bg-purple-light">{{ deviceDetail.cpuUse }}%</td>
        </tr>
        <tr>
          <td class="title bg-purple">厂商</td>
          <td class="item bg-purple-light">{{ deviceDetail.manufactKeyName }}</td>
          <td class="title bg-purple">内存利用率</td>
          <td class="item bg-purple-light">{{ deviceDetail.memoryUse }}%</td>
        </tr>
        <tr>
          <td class="title bg-purple">资产名称</td>
          <td class="item bg-purple-light">{{ deviceDetail.itcompName }}</td>
          <td class="title bg-purple">连续运行时间</td>
          <td class="item bg-purple-light">{{ deviceDetail.runTimeStr }}</td>
        </tr>
      </table>
    </s-card>
  </div>
</template>
<script>
  export default {
    props: {
      deviceDetail: {
        type: Object,
        required: true
      }
    },
    methods: {
      checkData(maintenanceUser, item) {
        if (maintenanceUser !== null && typeof maintenanceUser !== 'undefined' && maintenanceUser[item] !== null) {
          return maintenanceUser[item];
        } else {
          return '无';
        }
      },
      statue(pingStatus) {
        if (typeof pingStatus !== 'string') {
          if (pingStatus === 0) {
            return '宕机';
          } else if (pingStatus === 1) {
            return '正常';
          } else {
            return '告警';
          }
        } else {
          return pingStatus;
        }
      },
      backAction () {
        window.TopologyGraph.getGraphVm().secondTabContent = 'list';
      }
    }
  }
</script>
