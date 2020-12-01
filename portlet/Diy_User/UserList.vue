<template>
  <div class="diy-user-list">
    <s-card-diy
      title="组员列表"
      :more-click="moreClick"
      show-scrollbar>
      <div v-for="(item, idx) in list" style="height: 60px; padding: 12px 0 12px 0; position: relative">
        <s-grid direction="row">
          <div class="head">
            <img :src="item.userPhotopath" width="36px" height="36px"/>
          </div>
          <s-grid-item :flex="1">
            <s-grid direction="column">
              <s-grid-item :flex="3" style="font-size: 14px;" class="my-login-name">{{item.userLoginName}}</s-grid-item>
              <s-grid-item :flex="2" style="font-size: 12px; color: #9C9796;">{{item.userRealName}}</s-grid-item>
            </s-grid>
          </s-grid-item>
        </s-grid>
        <span class="status">{{item.statusName}}</span>
      </div>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        list: []
      }
    },
    computed: {
      ...mapGetters(['firstMenu'])
    },
    created() {
      let form = {
        departUuid: this.$store.state.userData.departUuid,
        isUser: 0
      };
      $axios.post('/departmentInfo/getDepartIncludeUsers', form).then(({ data }) => {
        if (data && data.userList && data.userList instanceof Array) {
          for (let i = 0; i < data.userList.length; i++) {
            if (!data.userList[i].userPhotopath) {
              data.userList[i].userPhotopath = 'static/images/system/UserPhoto.png';
            }
          }
          this.list = data.userList;
        }
      });
    },

    methods: {
      moreClick() {
        this.$router.push({path: '/AccountManage/orgTopo', query: {tab: 'pane2'}});
      }
    }
  }
</script>

<style>
  .diy-user-list {
    width: 100%;
    height: 100%;
  }
  .diy-user-list .head {
    width: 63px;
  }
  .diy-user-list .head img {
    border-radius: 50%;
    margin-left: 15px;
  }
  .diy-user-list .status {
    position: absolute;
    top: 12px;
    right: 13px;
    background-color: #4ADBA5;
    border-radius: 9px;
    font-size: 12px;
    color: #fff;
    display: inline-block;
    padding: 0 7px;
  }
  .diy-user-list img {
    overflow: hidden;
    border-radius: 18px;
  }
</style>
