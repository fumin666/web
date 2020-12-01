<template>
  <s-tooltip :effect="theme" :placement="placement">
    <slot>
    </slot>
    <div slot="content" class="name-card-hover">
      <div class="row row1">
        <div class="row1-left">
          <div class="up">
            <div class="row1-up-left">
              <img v-if="!data.userPhotopath" class="photo" src="../../../static/images/system/UserPhoto.png" alt="个人照片">
              <img v-else class="photo" :src="baseUrl + data.userPhotopath" alt="个人照片">
            </div>
            <div class="row1-up-right">
              <div class="item">
                <div class="key">姓名</div>
                <div class="value">{{data.userRealName || '无'}}</div>
              </div>
              <div class="item">
                <div class="key">账号名称</div>
                <div class="value">{{data.userLoginName || '无'}}</div>
              </div>
              <div class="item">
                <div class="key">邮箱</div>
                <div class="value">{{data.userMail || '无'}}</div>
              </div>
              <div class="item">
                <div class="key">状态</div>
                <div class="value">{{data.statusName || '无'}}</div>
              </div>
            </div>
          </div>
          <div class="down">
            <div class="item">
              <div class="key">组织名</div>
              <div class="value">{{data.companyOrgDepart ? (data.companyOrgDepart.organizationName || '无') : '无'}}</div>
            </div>
          </div>
        </div>
        <div class="row1-right">
          <div class="item">
            <div class="key">性别</div>
            <div class="value">{{data.userGenderName || '无'}}</div>
          </div>
          <div class="item">
            <div class="key">手机号</div>
            <div class="value">{{data.userCellphone | capitalize() || '无'}}</div>
          </div>
          <div class="item">
            <div class="key">岗位</div>
            <div class="value">{{data.position || '无'}}</div>
          </div>
          <div class="item">
            <div class="key">部门</div>
            <div class="value">{{data.companyOrgDepart ? (data.companyOrgDepart.departName || '无') : '无'}}</div>
          </div>
          <div class="item">
            <div class="key">指派可用性</div>
            <div class="value">{{!data.isAllocate? ((data.isAllocate === 0)? '不可指派': '无' ) :' 可指派' }}</div>
          </div>
        </div>
      </div>
      <div class="row row2">
        <div class="right">
          <div class="item">
            <div class="key">公司</div>
            <div class="value">{{data.companyOrgDepart ? (data.companyOrgDepart.companyName || '无') : '无'}}</div>
          </div>
        </div>
      </div>
    </div>
  </s-tooltip>
</template>

<script type="text/babel">
import $axios from 'sunflower-ajax';

export default {
  data() {
    return {
      baseUrl: $axios.basePath(),
      data: {},
      theme: 'light'
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
  props: {
    placement: {
      type: String,
      default: 'top'
    },
    useruuid: {
      type: String,
      default: ''
    }
  },
  methods: {
    getTheme(val) {
      if (val === 'dark') {
        this.theme = 'dark'
      } else {
        this.theme = 'light'
      }
    },
    nameCardInit(useruuid) {
      $axios.get(`/iamUserInfo/viewUserInfo/${useruuid}`).then(({ status, data }) => {
        if (status === 200 || status === 304) {
          this.data = data
        }
      });
    }
  },
  mounted() {
    let mainTheme = localStorage.getItem('theme');
    this.getTheme(mainTheme)
  },
  watch: {
    '$store.state.theme': function(val) {
      this.getTheme(val)
    },
    useruuid(val) {
      if (val) {
        this.nameCardInit(val);
      } else if (val === '') {
        this.data = {}
      }
    }
  }
}
</script>
<style lang="stylus">
.s-tooltip-popper{
  max-width: 600px!important;
}
.name-card-hover {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  width:600px;

  .row {
    display: flex;
  }

  .row.row1 {
    flex: 5;
    display: flex;
  }

  .row.row2 {
    flex: 1;
  }

  .row1-left {
    flex: 3;
    display: flex;
    flex-direction: column;

    .up {
      flex: 4;
      display: flex;

      .row1-up-left {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 120px;
          height: 163px;
        }
      }

      .row1-up-right {
        flex: 2;
      }
    }

    .down {
      flex: 1;
    }
  }

  .row1-right {
    flex: 2;
  }

  .row2 .right {
    display: flex;
    flex: 1;
  }

  .item {
    flex: 1;
    display: flex;
    padding: 5px;
    height: 30px;
    align-items: center;

    .key {
      flex: 1;
      text-align: left;
      font-size: 14px;
    }

    .value {
      flex: 1;
      text-align: right;
    }
  }
}
</style>

