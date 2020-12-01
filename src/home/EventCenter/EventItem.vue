<template>
  <s-row class="eventItem default" v-if="type=='default'">
    <div>
      <s-row class="summary">
        <s-col span="12">
            <span
              class="status"
              :class="{
                'urgency': item.levelStr==='严重',
                'serious': item.levelStr==='主要',
                'warn': item.levelStr==='警告',
                'secondary': item.levelStr==='次要',
                'prompt': item.levelStr==='提示',
                'normal': item.levelStr==='正常',
                'unknown': item.levelStr==='未知',
              }"
              :style="customerStyle">
              {{item.levelStr}}
            </span>
          <span style="font-size: 14px; " class="ip-title">{{item.controlAdderss}}</span>
        </s-col>
        <s-col class="feature text-right" span="12"><span class="detail-btn" @click="viewEvent">详情</span></s-col>
      </s-row>
      <s-row class="text" :title="item.incidentContent">摘要：{{item.incidentContent}}</s-row>
      <s-row class="details">
        <s-col span="8"><i class="iconfont icon-time"></i><span>{{item.modifyTimeStr}}</span></s-col>
        <s-col span="4" class="ellipsis"><i :class=switchType(item.type)></i><span :title="item.typeStr">{{item.typeStr}}</span></s-col>
        <s-col span="12" class="btns" v-if="item.type !== 6 && WorkFlowAuth">
          <div v-if="!item.itilIncidentOrderUuid" class="into-process theme-hover-btn" @click="handelClick">进入流程</div>
          <div v-else-if="item.itilIncidentOrderUuid && item.status === 2" class="into-process ongoing-btn" @click="handelClick" style="color: #fff">进行中</div>
          <div v-else @click="handelClick" class="into-process theme-hover-btn" :class="calEventStatus(item.status).style" v-text="calEventStatus(item.status).name"></div>
          <div class="into-process theme-hover-btn" v-if="authSafetyBulletin" @click="bulletinHandle(item)" style="margin-right: 10px">{{item.safeOrderUuid === null ? '通报下发' : '通报中'}}</div>
        </s-col>
      </s-row>

    </div>
    <!--通报下发-->
    <add-release-bulletin
      v-if="addReleaseBulletinFlag"
      v-model="addReleaseBulletinFlag"
      :bulletinTypeUuid="bulletinTypeUuid"
      :incidentUuid="incidentUuid"
      :rowData="rowData"
      @updateTable="updateTable"
    ></add-release-bulletin>
  </s-row>

</template>
<script>
  import authCheck from '@/common/mixins/auth.js'
  import addReleaseBulletin from '@/pages/Safety_BulletinTask/components/dialog/AddReleaseBulletin';
  import $axios from 'sunflower-ajax';
  export default {
    mixins: [authCheck],
    components: {
      addReleaseBulletin
    },
    props: {
      type: {
        type: String,
        default: 'default'
      },
      item: Object
    },
    data() {
      return {
        addReleaseBulletinFlag: false,
        bulletinTypeUuid: '', // 通报类型uuid
        incidentUuid: '', // 事件的uuid
        rowData: {},
        authSafetyBulletin: 1 // 通报下发权限控制
      }
    },
    created() {
      this.authSafetyBulletin = this.$store.state.authSafetyBulletin
    },
    methods: {
      customerStyle() {
        return {color: '#000'};
      },
      // 点击卡片左侧，查看事件详情
      viewEvent() {
        this.$emit('viewEvent');
      },
      // 事件“处理”点击事件
      handelClick() {
        if (!this.WorkFlowAuth) {
          this.$message.warning('您未注册流程中心模块，无法使用该功能！');
          return;
        }
        this.$emit('handelClick');
      },
      switchType(type) {
        switch (type) {
          case 1: return 'iconfont icon-business-monitor';
          case 2: return 'iconfont icon-asset-change';
          case 3: return 'iconfont icon-business-server';
          case 4: return 'iconfont icon-log-audit';
          case 5: return 'iconfont icon-oper';
          case 6: return 'iconfont icon-asset';
          default: return 'iconfont icon-event'
        }
      },
      calEventStatus(status) {
        switch (status) {
          case 2: return {name: '进行中', style: 'ongoing'};
          case 3: return {name: '已完成', style: 'completed'};
          case 4: return {name: '已忽略', style: ''};
          default: return {name: '未进入', style: ''};
        }
      },
      bulletinHandle(row) { // 通报下发
        if (row.safeOrderUuid !== null) {
          this.$message({type: 'warning', message: '通报中'});
          return
        }
        $axios.get(`/safetyPlatform/bulletinIssuedTask/getSafeAvailableUser`).then(({data}) => {
          if (data.state) {
            this.addReleaseBulletinFlag = true
            this.incidentUuid = row.uuid
          } else {
            this.$message({type: 'error', message: data.errormsg});
          }
        })
      },
      updateTable() {
        this.$emit('updateList');
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" >
.eventItem
  color #979797
  .summary, .details
    cursor pointer
    .detail-btn
      color #199FED!important
      font-size 14px
      &:hover
        opacity .8
  .status
    border-radius 2px
  .details
    margin-bottom: 0
    height 30px
    i
      margin-right 3px
      line-height 28px
    span
      line-height 28px
  .text
    line-height 18px
    margin 7px 0
    height 36px
    overflow hidden;
    text-overflow ellipsis;
    display -webkit-box;
    -webkit-line-clamp 2;
    -webkit-box-orient vertical;
  .btns
    .into-process
      float right
      width 86px
      height 30px
      border 1px solid #DCDEE2
      box-sizing border-box
      border-radius 3px
      line-height 30px
      font-size 12px
      text-align center
      cursor pointer
    .ongoing
      color #199FED!important
    .completed
      color #67C23A!important
    .disabled
      color #c0c4cc!important
      background-color  #F3F3F3!important
      cursor not-allowed
    .icon-ctn, .status-ctn
      text-align center
      cursor pointer
    .icon-ctn .iconfont
        font-size 28px
    .status-ctn
      font-size 14px

</style>
