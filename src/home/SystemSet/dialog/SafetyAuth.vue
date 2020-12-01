<template>
  <div>
    <s-form :model="safetyModule" label-width="120px">
      <s-form-item label="安全通报:">
        <s-switch @change="saveSafetyModule" v-model="safetyModule.safetyBulletin" :active-value="1"
                  :inactive-value="0"></s-switch>
      </s-form-item>
    </s-form>
  </div>

</template>
<script type="text/babel">
  import $axios from 'sunflower-ajax';

  export default {
    components: {
    },
    data() {
      return {
        safetyModule: {
          safetyBulletin: 1
        }
      }
    },
    created() {
      this.getSaveSafetyModule()
    },
    methods: {
      getSaveSafetyModule() {
        $axios.get('systemmanager/sysConfig/getSafetyBulletinSetting').then(({data}) => {
          this.safetyModule.safetyBulletin = Number.parseInt(data.safetyBulletin);
        })
      },
      saveSafetyModule() {
        $axios.post('systemmanager/sysConfig/saveSategyBulletinSetting', this.safetyModule).then(({data}) => {
          if (data.state === true) {
            location.reload()
            this.$message.success(data.errormsg)
          } else {
            this.$message.error(data.errormsg)
          }
        })
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .high-level-set {
    margin: 0 20px;

    .params-list {
      .iconfont {
        cursor: pointer;
        margin-left: 5px;
      }
    }
    .bussiness-title{
      padding 10px 0
    }
  .s-form-wrapper {
    width: 800px;
  }

  }

  .setScore-box-card {
    border: none;
  }

  .card-title {

  .grade-title {
    font-weight: 700;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    margin-bottom: 5px;
  }

  }

  @keyframes loading-diandiandian {
    from {
      width: 0;
    }

    to {
      width: 20px;
    }
  }

  @keyframes animation1 {
    0% {
      transform: translate(-10px, 0) scale(1, 1);
    }

    25% {
      transform: translate(0, 0) scale(1.5, 1.5);
    }

    50% {
      transform: translate(10px, 0) scale(1, 1);
    }

    75% {
      transform: translate(0, 0) scale(0.2, 0.2);
    }

    100% {
      transform: translate(-10px, 0) scale(1, 1);
    }
  }

  @keyframes animation2 {
    0% {
      transform: translate(10px, 0) scale(1, 1);
    }

    25% {
      transform: translate(0, 0) scale(0.2, 0.2);
    }

    50% {
      transform: translate(-10px, 0) scale(1, 1);
    }

    75% {
      transform: translate(0, 0) scale(1.5, 1.5);
    }

    100% {
      transform: translate(10px, 0) scale(1, 1);
    }
  }

  .network-test-loading2 {
    display: inline-block;
    position: relative;
    width: 20px;
    height: 10px;
    margin-left: 10px;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .network-test-loading2:before, .network-test-loading2:after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 14px;
    height: 14px;
    margin-left: -7px;
    margin-top: -7px;
    border-radius: 7px;
    border-bottom: 1px solid #fff;
  }

  .network-test-loading2:before {
    animation: rotate 0.8s ease-out infinite;
  }

  .network-test-loading2:after {
    animation: rotate 0.8s linear infinite;
  }

  #index-body {

  .s-card.app-center {

  .s-card-header {
    padding-left: 10px !important;
    padding-right: 10px;
  }

  .s-card-body {
    padding-left: 10px;
    padding-right: 10px;
  }

  }
  }
</style>
