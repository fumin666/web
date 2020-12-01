<!--
 * @Description: ipam->ipamDetails
 * @Author: 仝希博
 * @LastEditors: 高建鹏
 * @Date: 2019-04-18 17:56:39
 * @LastEditTime: 2019-12-03 13:36:12
 -->
<template>
  <s-dialog v-model="ipamDetailsDialog" title="IP地址详情" width="750px" class="ipAddressInfo" :before-close="close">
    <s-scrollbar wrap-style="height: 700px;">
      <s-row class="title-text">
        <span>IP地址详情</span>
      </s-row>
      <s-row>
        <s-col span="8">
          <div class="grid-content">IP地址 : {{ipAddressInfo.ipAddress}}</div>
        </s-col>
        <s-col span="8">
          <div class="grid-content">IP状态 : {{ipAddressInfo.statusStr}}</div>
        </s-col>
        <s-col span="8">
          <div class="grid-content">保留类型 : {{ipAddressInfo.spareStr}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col span="8">
          <div class="grid-content">资产名称 : {{ipAddressInfo.assetName}}</div>
        </s-col>
        <s-col span="8">
          <div class="grid-content">资产类型 : {{ipAddressInfo.assetCitypeName}}</div>
        </s-col>
        <s-col span="8">
          <div class="grid-content">资产状态 : {{ipAddressInfo.assetStatus}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col span="8">
          <div class="grid-content">子网地址 : {{ipAddressInfo.subnetAddress}}</div>
        </s-col>
        <s-col span="8">
          <div class="grid-content">所属组织机构 : {{ipAddressInfo.departName}}</div>
        </s-col>
        <s-col span="8">
          <div class="grid-content">备注 : {{ipAddressInfo.remark?ipAddressInfo.remark:'--'}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col span="8">
          <div class="grid-content">更新人 : {{ipAddressInfo.createUserName}}</div>
        </s-col>
        <s-col span="16">
          <div class="grid-content">最后更新时间 : {{ipAddressInfo.updateTime}}</div>
        </s-col>
      </s-row>
      <s-row class="title-text">
        <span>IP地址状态变更历史</span>
      </s-row>
      <s-table-page
        :data="statusChangeHistoryByList">
        <s-table-column prop="timeDuration" label="时间周期">
        </s-table-column>
        <s-table-column prop="statusStr" label="状态">
        </s-table-column>
        <s-table-column prop="createUserName" label="操作人">
        </s-table-column>
      </s-table-page>
      <s-row class="title-text">
        <span>IP地址关联资产变更历史</span>
      </s-row>
      <s-table-page
        :data="assetChangeHistoryByList">
        <s-table-column prop="timeDuration" label="时间周期">
        </s-table-column>
        <s-table-column prop="assetName" label="资产名称">
        </s-table-column>
        <s-table-column prop="createUserName" label="操作人">
        </s-table-column>
      </s-table-page>
    </s-scrollbar>
  </s-dialog>
</template>
<script>
import $axios from 'sunflower-ajax'
export default {
  props: {
    ipamDetailsDialog: {
      type: Boolean,
      default: false
    },
    rowUuid: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      statusChangeHistoryByList: [],
      assetChangeHistoryByList: [],
      Details: {},
      ipAddressInfo: {}
    }
  },
  methods: {
    getList() {
      let detailsUuid = this.rowUuid;
      $axios.get(`/ipamIpAddressView/getIpAddressDetailInfoByUuid/${detailsUuid}`).then((res) => {
        if (res.data) {
          this.ipAddressInfo = res.data.ipAddressInfo
          this.statusChangeHistoryByList = res.data.statusChangeHistoryByList
          this.assetChangeHistoryByList = res.data.assetChangeHistoryByList
        }
      })
    },
    close() {
      this.$emit('update:ipamDetailsDialog', false);
    }
    // judge(value, row) {
    //   if (value.timeDuration.indexOf('now') === -1) {
    //     return value.prevStatusStr
    //   } else {
    //     return value.statusStr
    //   }
    // }
  },
  created() {
    this.getList()
  }
}
</script>
<style lang="stylus">
// .ipAddressInfo .s-collapse-item-header {
//   height: 40px;
//   line-height: 40px;
//   font-size: 14px;
//   padding: 0 20px;
// }

// .ipAddressInfo .s-collapse-item-content {
//   padding: 10px 20px;
// }
.ipAddressInfo{
  .title-text span:after {
    content: '';
    position: absolute;   /*定位背景横线的位置*/
    top: 50%;
    margin-left:10px;
    background: #DCDEE2;   /*背景横线颜色*/
    width: 100%;            /*单侧横线的长度*/
    height: 1px;
  }
  .title-text {
    font-size: 16px;
    font-weight: bold;
    margin: 20px 0;
    opacity: 0.85;
    overflow hidden
  }
}
</style>

