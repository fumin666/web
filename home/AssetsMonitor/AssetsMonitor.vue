<template>
  <section class="content assetsMonitor asset home-page-box">
    <s-row >
      <s-col span="19"  style="padding-right: 2px;" class="main-left">
        <s-card class="main-card-content box-card topology_panel_container card-line" id="topology_panel_container"
                style="height: calc(100vh - 320px);">
          <div slot="header" class="clearfix" style="padding:0 20px">
              <span class="card-title" >
                <!--<i class="iconfont icon-layout"></i>-->
                拓扑视图
              </span>
            <div class="card-enter more-info" @click="goto('assetsMonitor_topo')">更多</div>
          </div>
          <data-dashboard :data="statData" url="assetsMonitor_view" style="margin-left:20px;"></data-dashboard>
          <div >
            <topology-graph key="assetsMontiorTopology" :graphHeight="graphHeight" ref="topo"></topology-graph>
          </div>
        <div class="strip"></div>
        </s-card>
        <s-card class="main-card-content box-card topology_panel_container card-line" style="margin-top:10px">
          <div slot="header" class="clearfix" style="padding:0 20px">
              <span class="card-title">
                <!--<i class="iconfont icon-briefcase"></i>-->
                业务服务管理
              </span>
            <div class="card-enter more-info" @click="goto('assetsMonitor_businessService')">更多</div>
          </div>
          <div v-nodata="businessServiceList.length === 0" style="height:120px">
            <s-carousel indicator-position="outside" class="foucs-assets" arrow="never" :autoplay="false" :height="`100px`" style="margin-top:10px;" v-if="businessServiceList.length > 0">
              <!-- 轮播图item -->
              <s-carousel-item v-for="(businessService,index) in businessServiceList" :key="`businessService${index}`">
                <s-row type="flex" justify="around" align="middle" style="height: 100%;padding:0 20px;">
                    <s-col class="box" span='6' v-for="(val,index) in businessService" :key="index">
                      <bus-card :busData="val"></bus-card>
                    </s-col>
                </s-row>
              </s-carousel-item>
            </s-carousel>
          </div>
        </s-card>
      </s-col>
      <s-col span="5" class="main-right" style="">
        <navs :modelName="'assetsMonitor'" @goto="goto" @gotoLine="gotoLine"  style="margin-top:20px;padding:0 15px"></navs>
        <s-scrollbar wrap-style="height:calc(100vh - 218px);" style="">
          <s-card class="box-card card-line right-card" style="margin-bottom: 10px;padding:0 15px">
            <div slot="header" class="clearfix ">
                <span class="card-title">
                  关注监控资产
                </span>
              <div class="card-enter more-info" @click="goto('assetsMonitor_concernList', 'concern')">更多</div>
            </div>
            <div v-nodata="filterConcertList.length === 0" style="height:220px;margin-top:10px;font-size:14px;" class="foucs-card-body">
              <s-carousel class="foucs-assets" arrow="never" :autoplay="false" >
                <s-carousel-item v-for="(item,index) in filterConcertList" :key="'concern' + index">
                  <s-row type="flex" class="foucs-assets-row">
                    <s-col class="foucs-assets-col"
                           :class="statusClass(innerItem)" v-for="(innerItem,index) in item"
                           :key="'innerItem' + index">
                      <s-row type="flex" justify="center" align="middle" style="height: 100%">
                        <s-col class="foucs-assets-icon" span="4">
                          <div class="feature" style="width:34px;height:22px;border-radius:2px;text-align:center;">{{innerItem.assetState}}</div>
                        </s-col>
                        <s-col span="10">
                          <div class="titleWord" style="opacity: 0.65;">
                            <!-- <span class="feature"></span> -->
                            <s-tooltip :content="innerItem.assetName"><span class="compName">{{innerItem.assetName}}</span>
                            </s-tooltip>
                          </div>
                        </s-col>
                        <s-col span="10">
                          <div class="contentWord" style="opacity: 0.45;">
                            {{innerItem.ip}}
                          </div>
                        </s-col>
                      </s-row>
                    </s-col>
                  </s-row>
                </s-carousel-item>
              </s-carousel>
            </div>
          </s-card>
          <s-card class="box-card card-line right-card" style="height:275px;padding:0 15px">
            <div slot="header" class="clearfix ">
                <span class="card-title">
                  <!--<i class="iconfont icon-trophy"></i>-->
                  资产监控排行TOP5
                </span>
              <div class="card-enter more-info" @click="goto('assetsMonitor_topN')">更多</div>
            </div>
            <div v-nodata="topNList.length === 0" class="top-list" style="height:250px">
              <s-row style="margin:20px 0px;height:20px" v-for="(item,index) in topNList" :key="'topn' + index">
                <s-col span='20'>
                  <s-row>
                    <s-col span='6' class="ellipsis" style="width:33%;opacity: 0.65;">{{item.itcompName}}</s-col>
                    <s-tooltip :content="item.address">
                      <s-col span='6' class="ellipsis" style="width:33%;opacity: 0.65;">| {{item.address}}</s-col>
                    </s-tooltip>
                    <s-col span='6' class="ellipsis" style="width:33%;opacity: 0.65;">| {{item.ciTypeName}}</s-col>
                  </s-row>
                </s-col>
                <s-col span='4'>
                  <span style="color:#199FED;cursor: pointer;width:100%" class="ellipsis" @click="showScoreDetail(item)">{{item.score}}</span></s-col>
              </s-row>
            </div>
          </s-card>
        </s-scrollbar>
      </s-col>
    </s-row>
    <!--监控频率弹窗-->
    <set-dialog v-model="freSetDialog" v-if="freSetDialog"></set-dialog>
    <!--打分详情弹框-->
    <score-detail-dialog v-model="scoreDetailDialogFlag" v-if="scoreDetailDialogFlag" :cur-score="curScoreObj">
    </score-detail-dialog>
  </section>
</template>
<style lang="stylus">
.assetsMonitor
  .box
    height 100%
    padding 0 5px
  .s-carousel-item.is-active
    border: none
    box-shadow: 0 0 0
    background none
  .main-right
    .right-card
      .s-card-header
        border-bottom none!important
</style>
<script type="text/babel">
  import navs from '@/components/navButton/NavButton.vue';
  import busCard from './card.vue';
  import setDialog from '@/pages/AssetsMonitor_List/MonitorDialog/FreSetDialog';
  import $axios from 'sunflower-ajax';
  import DataDashboard from '@/components/dataDashboard/DataDashboard'
  import scoreDetailDialog from '@/pages/AssetsMonitor_TopN/ScoreDetailDialog';
  import TopologyGraph from '@/components/graph/TopologyGraph'

  export default {
    data() {
      return {
        graphHeight: 440,
        freSetDialog: false,
        scoreDetailDialogFlag: false,
        statData: [],
        navsList: [

        ],
        concernList: [],
        topNList: [],
        businessServiceList: [],
        curScoreObj: {}
      }
    },
    computed: {
      filterConcertList() {
        if (this.concernList.length === 0) {
          return [];
        } else {
          let arr = [];
          for (let i = 0; i < this.concernList.length; i = i + 5) {
            if (i >= 24) break;
            arr.push([]);
            let lastIndex = arr.length - 1;
            this.concernList[i] && arr[lastIndex].push(this.concernList[i]);
            this.concernList[i + 1] && arr[lastIndex].push(this.concernList[i + 1]);
            this.concernList[i + 2] && arr[lastIndex].push(this.concernList[i + 2]);
            this.concernList[i + 3] && arr[lastIndex].push(this.concernList[i + 3]);
            this.concernList[i + 4] && arr[lastIndex].push(this.concernList[i + 4]);
          }
          return arr;
        }
      }
    },
    created() {
      this.axiosDataBoard();
      this.axiosConcernList();
      this.axiosTopNList();
      this.businessServiceData();
  },
    mounted() {
      this.initDivHeight();
      window.addEventListener('resize', this.initDivHeight);
    },
    watch: {

    },
    destroyed() {
      window.removeEventListener('resize', this.initDivHeight);
    },
    methods: {
      initDivHeight() {
        var boxHeaderHeight = document.getElementsByClassName('s-card-header')[0].offsetHeight;
        var panelHeight = document.getElementById('topology_panel_container').offsetHeight;
        this.graphHeight = panelHeight - boxHeaderHeight;
      },
      gotoLine() {
        let showapp = window.TopologyGraph.getShowApp();
        this.goto(`assetsMonitor_link/${showapp}`);
      },
      dialogShow() {
        this.freSetDialog = true
      },
      businessServiceClass(val) {
        switch (val) {
          case 1:
            return 'business-error'
          case 2:
            return 'business-warning'
          case 3:
            return 'business-success'
          default:
            return ''
        }
      },
      statusClass(innerItem) {
        switch (innerItem.assetState) {
          case '异常': // 异常
            return 'crashBg';
          case '正常': // 正常
            return 'normalBg';
          case '告警': // 告警
            return 'alarmBg';
          case '未知': // 未知
            return 'grayBg';
          default:
            return '';
        }
      },
      showScoreDetail(item) {
        this.scoreDetailDialogFlag = true;
        this.curScoreObj = item;
      },
      businessServiceData () {
        let _self = this
        $axios.post('/businessservice/businessServiceinfoList').then(({data}) => {
//          data = data.filter(item => item.isMonitor)
          let businessServiceList = []
          for (let i = 0, k = 0; i < data.length; i += 4, k++) {
            businessServiceList.push([])
            businessServiceList[k].push(data[i])
            businessServiceList[k].push(data[i + 1])
            businessServiceList[k].push(data[i + 2])
            businessServiceList[k].push(data[i + 3])
          }
          _self.$nextTick(function () {
            _self.businessServiceList = Object.assign([], businessServiceList)
          })
        });
      },
      axiosDataBoard() {
        // $axios.get('/resourcemanager/assetmanager/itasset/statisticsAllMonitorItcomp').then((res) => {
        //   let statData = [];
        //   res.data.forEach(item => {
        //     if (item.default === 1) {
        //       statData.push(item)
        //     }
        //   });
        //   this.statData = statData
        // })
        $axios.get('/monitorcitype/getStatCountCitype').then((res) => {
          let arr = res.data
          arr.map((val, index) => {
            if (val.keyName === 'other') {
              arr.splice(index, 1)
            }
          })
          this.statData = arr || [];
        })
      },
      axiosConcernList() {
        $axios.get('/monitorlist/getConcernAsset/25').then((res) => {
          this.concernList = res.data
          for (let i = 0; i < this.concernList.length; i++) {
            if (this.concernList[i].assetState === 0) {
              this.concernList[i].assetState = '异常'
            } else if (this.concernList[i].assetState === 1) {
              this.concernList[i].assetState = '正常'
            } else if (this.concernList[i].assetState === 2) {
              this.concernList[i].assetState = '告警'
            } else if (this.concernList[i].assetState === 3) {
              this.concernList[i].assetState = '未知'
            }
          }
        });
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
      goto(path, query) {
        let queryStr = query ? `?${query}=true` : '';
        this.$router.push('/AssetsMonitor/' + path + queryStr);
      }
    },
    beforeRouteLeave(to, from, next) {
      this.$refs.topo.closeFloatBox();
      next();
    },
    components: {
      navs,
      setDialog,
      DataDashboard,
      scoreDetailDialog,
      TopologyGraph,
      busCard
    }
  }
</script>
