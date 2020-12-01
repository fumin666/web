/**
* Created by songyf on 2019/10/22.
 */

<template>
  <div class="overdue-tab">
    <div class="item" v-nodata="isolateList.length === 0">
      <s-row :gutter="20">
        <div class="account-item" v-for="(item,index) in isolateList" :key="index">
          <s-row class="item-row">
            <s-col span="5" class="account-item-icon">
              <img v-if="item.userPhotopath" :src="item.userPhotopath">
              <img v-else src="static/images/system/UserPhoto.png"/>
            </s-col>
            <s-col span="19" style="line-height: 20px">
              <div class="account-item-name ellipsis" style="width: 100%" >
                <span :title="item.userRealName">{{item.userRealName}}</span>
                <span :title="item.userLoginName"> ({{item.userLoginName}})</span>
              </div>
              <div class="account-item-content">{{item.passwordExpirationTimeStr | filterTime}} (过期)</div>
            </s-col>
          </s-row>
        </div>
      </s-row>
    </div>
  </div>
</template>
<script type="text/babel">
  import $axios from 'sunflower-ajax';
  export default {
    data () {
      return {
        isolateList: []
      }
    },
    components: {},
    methods: {
      getPassOverdueData() { // 密码过期账号
        let param = {
          'departUuidList': null,
          'startTime': null,
          'endTime': null,
          'startDay': null,
          'endDay': null
        }
        $axios.post('/iamUserInfo/passwordExpirationStatistical', param).then((res) => {
          if (res.data.length > 10) {
            this.isolateList = res.data.slice(0, 10)
          } else {
            this.isolateList = res.data
          }
        });
      }
    },
    filters: {
      filterTime(val) {
        return val.split(' ')[0];
      }
    },
    mounted() {
      this.getPassOverdueData()
    }
  }
</script>

<style lang="stylus">
  .overdue-tab
    padding 0 20px
    height 110px
    .account-item
      width 20%
      float left
      padding-right 20px
      box-sizing border-box
      margin-bottom 15px
      .item-row
        height 40px
        line-height 40px
        .account-item-icon
          text-align center
          img
            vertical-align middle
            width 35px
            height 35px
            border-radius 50%
        .account-item-name
          font-size 14px
        .account-item-content
          font-size 12px

</style>
