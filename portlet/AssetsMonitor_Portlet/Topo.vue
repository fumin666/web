<template>
  <!--拓扑视图-->
  <div class="diy-monitor-topo">
    <s-card-diy :more-click="more" :show-more="true" show-scrollbar title="拓扑视图">
      <data-dashboard :data="statData" url="assetsMonitor_list"></data-dashboard>
      <topology-graph :graphHeight="600" key="assetsMontiorTopology" ref="topo"></topology-graph>
    </s-card-diy>
  </div>
</template>

<script>
// import navs from '@/components/navButton/NavButton.vue'
// import setDialog from '@/pages/AssetsMonitor_List/MonitorDialog/FreSetDialog'
import $axios from 'sunflower-ajax'
import DataDashboard from '@/components/dataDashboard/DataDashboard'
// import scoreDetailDialog from '@/pages/AssetsMonitor_TopN/ScoreDetailDialog'
import TopologyGraph from '@/components/graph/TopologyGraph'

export default {
  components: {
    // navs,
    // setDialog,
    DataDashboard,
    // scoreDetailDialog,
    TopologyGraph
  },
  data() {
    return {
      statData: []
    }
  },
  methods: {
    axiosDataBoard() {
      $axios
        .get('/monitorcitype/getStatCountCitype')
        .then(res => {
          this.statData = res.data
        })
    },
    goto(path, query) {
      let queryStr = query ? `?${query}=true` : ''
      this.$router.push('/AssetsMonitor/' + path + queryStr)
    },
    more() {
      this.goto('assetsMonitor_topo')
    }
  },
  created() {
    this.axiosDataBoard()
  }
}
</script>
