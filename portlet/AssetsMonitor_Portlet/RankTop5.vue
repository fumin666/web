<template>
  <!--关注的监控资产-->
  <div class="diy-monitor-rank-top5">
    <s-card-diy :more-click="more"
                :show-more="true"
                show-scrollbar
                title="资产监控排行TOP5">
        <div v-nodata="topNList.length === 0" class="top-list" style="height:250px">
          <s-row style="margin:20px 0px;" v-for="(item,index) in topNList" :key="'topn' + index">
            <s-col span='20'>
              <s-row>
                <s-col span='6' class="ellipsis" style="width:33%">{{item.itcompName}}</s-col>
                <s-col span='6' class="ellipsis" style="width:33%">| {{item.address}}</s-col>
                <s-col span='6' class="ellipsis" style="width:33%">| {{item.ciTypeName}}</s-col>
              </s-row>
            </s-col>
            <s-col span='4'>
              <span style="color:#199FED;cursor: pointer;width:100%" class="ellipsis" @click="showScoreDetail(item)">{{item.score}}</span></s-col>
          </s-row>
        </div>
    </s-card-diy>
    <!--打分详情弹框-->
    <score-detail-dialog v-model="scoreDetailDialogFlag" v-if="scoreDetailDialogFlag" :cur-score="curScoreObj">
    </score-detail-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import scoreDetailDialog from '@/pages/AssetsMonitor_TopN/ScoreDetailDialog';

  export default {
    data() {
      return {
        scoreDetailDialogFlag: false,
        topNList: []
      }
    },
    components: {
      scoreDetailDialog
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
          order: 'desc',
          topn: 5
        };
        $axios.post(`/kpi/getTopnByMap`, param).then(({data}) => {
          this.topNList = data;
        });
      },
      showScoreDetail(item) {
        this.scoreDetailDialogFlag = true;
        this.curScoreObj = item;
      }
    },
    created() {
      this.axiosTopNList();
    }
  }
</script>
