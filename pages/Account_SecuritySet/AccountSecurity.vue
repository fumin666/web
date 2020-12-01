<template>
  <div>
    <s-tab type="card" v-model="activeTab" class="account-security-box" style="margin: 20px">
      <s-tab-pane label='资产账号改密' name="pane1">
        <s-scrollbar v-if="isTrue" :wrap-style="heightStyle">
          <ChangePass v-if="activeTab === 'pane1'" :tabtype='1'></ChangePass>
        </s-scrollbar>
        <div v-else>
          <ChangePass v-if="activeTab === 'pane1'" :tabtype='1'></ChangePass>
        </div>
      </s-tab-pane>
      <s-tab-pane label='安全配置' name="pane2">
        <security-conf v-if="activeTab === 'pane2'"></security-conf>
      </s-tab-pane>
    </s-tab>
  </div>
</template>
<script>
  import ChangePass from '../Account_TimedTask/ChangePass.vue'
  import SecurityConf from './AccountSecurityConf'
  export default {
    data() {
        return {
          activeTab: 'pane1'
        }
    },
    components: {
      SecurityConf,
      ChangePass
    },
    created() {
    },
    computed: {
      heightStyle() {
        if (this.isTrue) {
          return 'maxHeight:calc(100vh - 270px);'
        } else {
          return 'none'
        }
      }
    }
}

</script>

<style>
  .account-security-box #change-pass{
    margin: 0!important;
  }
</style>

