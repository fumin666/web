/**
* Created by songyf on 2018/10/22.
*/

<template>
  <div class="overdue-tab">
    <div class="item" v-nodata="accountList.length === 0">
      <s-row :gutter="20">
        <div class="account-item" v-for="(item,index) in accountList" :key="index">
          <s-row class="item-row">
            <s-col span="5" class="account-item-icon">
              <img v-if="item.userPhotopath" :src="item.userPhotopath">
              <img v-else src="static/images/system/UserPhoto.png"/>
            </s-col>
            <s-col span="19" style="line-height: 20px">
              <div class="account-item-name ellipsis" style="width: 100%">
                <span :title="item.userRealName">{{item.userRealName}}</span>
                <span :title="item.userLoginName">  ({{item.userLoginName}})</span>
              </div>
              <div class="account-item-content">{{item.expirationTimeStr | filterTime}} (过期)</div>
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
        accountList: []
      }
    },
    components: {},
    methods: {
      getAccountOverdueData() { // 账号过期账号
        let param = {
          'departUuidList': null,
          'startTime': null,
          'endTime': null,
          'startDay': null,
          'endDay': null
        }
        $axios.post('/iamUserInfo/accountExpirationStatistical', param).then((res) => {
          if (res.data.length > 10) {
            this.accountList = res.data.slice(0, 10)
          } else {
            this.accountList = res.data
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
      this.getAccountOverdueData()
    }
  }
</script>

