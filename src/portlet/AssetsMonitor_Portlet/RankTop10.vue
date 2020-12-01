/**
* 资产监控排行TOP 10
*/
<template>
  <div class="diy-monitor-rank-top10">
      <s-card-diy :more-click="more"
                  :show-more="true"
                  show-scrollbar
                  title="资产监控排行TOP10">
        <s-table
          :data="topNList"
          style="width: 100%"
          border>
          <s-table-column
            label="资产名称"
            prop="itcompName"/>
          <s-table-column
            label="IP地址"
            prop="address"/>topNList
          <s-table-column
            label="类型"
            prop="ciTypeName"/>
          <s-table-column
            label="分数"
            prop="score"/>
        </s-table>
      </s-card-diy>
  </div>
</template>

<script>
import $axios from 'sunflower-ajax'

export default {
  data() {
    return {
      topNList: []
    }
  },
  components: {
  },
  computed: {

  },
  methods: {
    goto(path, query) {
      let queryStr = query ? `?${query}=true` : ''
      this.$router.push('/AssetsMonitor/' + path + queryStr)
    },
    more() {
      this.goto('assetsMonitor_topN')
    },
    axiosTopNList() {
      let param = {
        itcompName: '',
        order: 'asc',
        topn: 10
      };
      $axios.post(`/kpi/getTopnByMap`, param).then(({data}) => {
        this.topNList = data;
      });
    }
  },
  created() {
    this.axiosTopNList();
  }
}
</script>

<style>
  .diy-monitor-rank-top10 {
    width: 100%;
    height: 100%;
  }
  .diy-monitor-rank-top10 .content{
    padding-left: 5px;
    padding-right: 5px;
  }
</style>
