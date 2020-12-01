/*
create by YOU
*/
<template>
  <div class="business-layout">
    <s-tab type="card" v-model="tab" style="margin:20px">
      <s-tab-pane label="业务服务管理" name="kpi" >
        <div style="height:32px;margin-bottom:10px">
          <s-button-group style="float:right;">
              <s-button class="list icon iconfont icon-structure" title="视图模式" @click="showModel('graph')" style="width:60px"></s-button>
              <s-button  @click="showModel('list')" title="列表模式" class="icon iconfont icon-xuanxiang" style="width:60px"></s-button>
          </s-button-group>
        </div>
        <business-analysis v-if="tab === 'kpi'"></business-analysis>
      </s-tab-pane>
      <s-tab-pane label="业务服务巡检" name="define">
        <Business-Service-Check v-if="tab === 'define'"></Business-Service-Check>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script type="text/babel">
  import BusinessAnalysis from './BusinessAnalysis'
  // import BusinessIndex from './BusinessIndex'
  import BusinessServiceCheck from '../AssetsMonitor_BusinessServiceCheck/BusinessServiceCheck'
  // import BusinessEffect from './BusinessEffect'
  export default {
    components: {
      BusinessAnalysis,
      // BusinessIndex,
      BusinessServiceCheck
      // BusinessEffect
    },
    data () {
      return {
        tab: 'kpi'
      }
    },
    mounted () {
      // window.businessServiceVm = this
    },
    computed: {},
    methods: {
      showModel(type) {
        if (type === 'graph') {
          this.$router.replace({
            path: '/AssetsMonitor/assetsMonitor_businessService'
            // query: {uuid: this.$route.query.uuid, name: this.$route.query.name}
          })
        }
      }

    }
  };
</script>
