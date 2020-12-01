<template>
  <div class="summaryContainer">
    <div class="dashContainer">
      <img  :src="dashImg" alt="" style="width: 90%;max-width: 450px;">
      <p class="score"><span>{{assetSummary.securityScore}}</span>分</p>
      <p style="margin-top: -15px;">—&nbsp;资产评分
        <span :class="[dashState === '可用' ? 'normal' : 'wrong', 'dashState']">{{dashState}}</span>&nbsp;—
      </p>
    </div>
    <div class="summaryInfo">
      <s-row>
        <s-col span="8" class="box-item">
          <div class="s-box-item-icon">
            <i class="iconfont icon-hardware"></i>
          </div>
          <div class="s-box-item-content-wrapper">
            <div class="s-box-item-des">资产名称</div>
            <s-tooltip :content="assetSummary.name">
              <div class="s-box-item-title clickable" @click="gotoCompInfo">{{assetSummary.name}}</div>
            </s-tooltip>
          </div>
        </s-col>
        <s-col span="8" class="box-item">
          <div class="s-box-item-icon">
            <i class="iconfont icon-config-ip"></i>
          </div>
          <div class="s-box-item-content-wrapper">
            <div class="s-box-item-des">IP地址</div>
            <s-tooltip :content="assetSummary.ip">
              <div class="s-box-item-title clickable" @click="gotoInfo">{{assetSummary.ip}}</div>
            </s-tooltip>
          </div>
        </s-col>
        <s-col span="8" class="box-item">
          <div class="s-box-item-icon">
            <i class="iconfont icon-tag"></i>
          </div>
          <div class="s-box-item-content-wrapper">
            <div class="s-box-item-des">资产类别</div>
            <div class="s-box-item-title">{{assetSummary.ciType}}</div>
          </div>
        </s-col>
        <s-col span="8" class="box-item">
          <div class="s-box-item-icon">
            <i class="iconfont icon-organ"></i>
          </div>
          <div class="s-box-item-content-wrapper">
            <div class="s-box-item-des">所属机构</div>
            <div class="s-box-item-title">{{assetSummary.departmentName}}</div>
          </div>
        </s-col>
        <!--<s-col span="8" class="box-item">-->
          <!--<div class="s-box-item-icon">-->
            <!--<i class="iconfont icon-briefcase"></i>-->
          <!--</div>-->
          <!--<div class="s-box-item-content-wrapper">-->
            <!--<div class="s-box-item-des">业务系统</div>-->
            <!--<div class="s-box-item-title">{{assetSummary.businessSystem || '&#45;&#45;'}}</div>-->
          <!--</div>-->
        <!--</s-col>-->
        <s-col span="8" class="box-item" v-if="OmaAuth">
          <div class="s-box-item-icon">
            <i class="iconfont icon-special-oper"></i>
          </div>
          <div class="s-box-item-content-wrapper">
            <div class="s-box-item-des">本日运维次数</div>
            <div class="s-box-item-title clickable" @click="gotoOpe">{{assetSummary.operationCount}}</div>
          </div>
        </s-col>
        <s-col span="8" class="box-item" v-if="SiemAuth">
          <div class="s-box-item-icon">
            <i class="iconfont icon-event"></i>
          </div>
          <div class="s-box-item-content-wrapper">
            <div class="s-box-item-des">本日事件信息</div>
            <div class="s-box-item-title">
              事件<span class="clickable" style="margin-right: 5px;" @click="gotoEvent">{{assetSummary.incidentCount}}</span>
              <span class="s-box-item-des">|</span>
              告警<span class="clickable" @click="gotoAlarm">{{assetSummary.alarmCount}}</span>
            </div>
          </div>
        </s-col>
      </s-row>
    </div>
  </div>
</template>

<script>

  import authCheck from '@/common/mixins/auth.js'

  export default {
    mixins: [authCheck],
    data() {
      return {
        parentRouteName: 'AssetsAll'
      }
    },
    props: {
      assetSummary: {
        type: Object,
        required: true
      }
    },
    computed: {
      dashImg() {
        return '../../../../static/images/itResource/' +
          (this.dashState === '可用' ? 'dash_canUse' : 'dash_noUse') + '.png';
      },
      dashState() {
        if (this.assetSummary.isOffLine) {
          return '可用';
        } else {
          return '不可用';
        }
      }
    },
    created() {
//      this.authorizationModel.IMP = 1;
//      this.authorizationModel.OMA = 1;
//      this.authorizationModel.SIEM = 1;
      if (this.$route.name.indexOf('AssetsMonitor') !== -1) {
        this.parentRouteName = 'AssetsMonitor';
      }
    },
    methods: {
      gotoCompInfo() {
        this.$router.push(`/AssetsAll/assets_list/assetDetail/${this.assetSummary.uuid}`);
      },
      gotoInfo() {
        if (this.assetSummary.canMonitor) {
          this.$router.push({name: this.parentRouteName + '_info', params: {compId: this.assetSummary.uuid}});
        }
      },
      gotoOpe() {
        this.$router.push({path: '/LogCenter/log_operationstatistics', query: {ip: this.assetSummary.ip}});
      },
      gotoEvent() {
        this.$router.push({path: '/EventCenter/event_list/0/0/0', query: {ip: this.assetSummary.ip}});
      },
      gotoAlarm() {
        this.$router.push({path: '/EventCenter/event_alarmcenter', query: {ip: this.assetSummary.ip}});
      }
    }
  }
</script>

<style lang="stylus">

</style>
