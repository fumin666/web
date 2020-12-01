<template>
  <div class="diy-user-info">
    <s-grid direction="column" class="container">
      <s-grid-item :flex="1">
        <s-grid>
          <div class="head">
            <div style="width: 53px; height: 53px; border-radius: 50%; overflow: hidden; margin-top: 20px; margin-left: 16px">
              <img width="100%" height="100%" :src="photoUrl"></img>
            </div>
          </div>
          <s-grid-item :flex="1" class="names">
            <div>{{user.userRealName}}</div>
            <div>
              <i class="iconfont icon-phone"></i>
              <span>{{user.userCellphone | capitalize() || '暂无'}}</span>
            </div>
          </s-grid-item>
        </s-grid>
      </s-grid-item>
      <s-grid-item :flex="1">
        <s-grid direction="column" class="min">
          <s-grid-item :flex="1">
            <span>账号名称：</span>{{user.userLoginName}}
          </s-grid-item>
          <s-grid-item :flex="1">
            <span>所属机构：</span>{{user.departName}}
          </s-grid-item>
          <s-grid-item :flex="1">
            <span>E-mail：</span>{{user.userMail}}
          </s-grid-item>
          <s-grid-item :flex="1"></s-grid-item>
        </s-grid>
      </s-grid-item>
    </s-grid>
  </div>
</template>

<script>
  export default {
    computed: {
      user() {
        return this.$store.state.userData;
      }
    },
    filters: {
      capitalize: (value) => {
        if (!value) return ''
        if (value.length > 3) {
          return value.substring(0, 3) + '****' + value.substring((value.length - 4), value.length)
        } else {
          return value
        }
      }
    },
    data() {
      return {
        photoUrl: 'static/images/system/UserPhoto.png'
      }
    },
    created() {
      if (this.user.userPhotopath) {
        this.photoUrl = this.user.userPhotopath;
      }
    }
  }
</script>

<style>
  .diy-user-info {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: white;
  }
  .diy-user-info .head {
    width: 85px;
  }
  .diy-user-info .names {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .diy-user-info .names div {
    font-size: 14px;
    color: white;
    height: 24px;
    line-height: 24px;
  }
  .diy-user-info .iconfont {
    color: #fff;
    font-size: 14px;
  }
  .diy-user-info .container {}
  .diy-user-info .min * {
    font-size: 12px;
  }
  .diy-user-info .min span {
    padding-left: 16px;
    display: inline-block;
    width: 70px;
  }
</style>
