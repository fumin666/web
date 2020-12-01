<template>
  <section class="content assetsMonitor">
    <s-row :gutter="10">
      <s-col span="19" id="leftPanelContainer">
        <s-card class="main-card-content box-card topology_panel_container" id="topology_panel_container" style="height: calc(100vh - 128px)">
          <div slot="header" class="clearfix">
              <span class="card-title">
                <!--<i class="iconfont icon-layout"></i>-->
                拓扑视图
              </span>
            <div class="card-enter" @click="goto('assetsMonitor_topo')">进入</div>
          </div>
          <data-dashboard :data="statData" url="assetsMonitor_list"></data-dashboard>
          <topology-graph key="assetsMontiorTopology" :graphHeight="graphHeight" ref="topo"></topology-graph>
        </s-card>
      </s-col>
      <s-col span="5">
        <s-card class="box-card moniotrCard contentOpacity" style="height: calc(100vh - 358px);margin-bottom: 10px;">
          <div slot="header" class="clearfix">
              <span class="card-title">
                <!--<i class="iconfont icon-tag2"></i>-->
                关注监控资产
              </span>
            <div class="card-enter more-info" @click="goto('assetsMonitor_concernList', 'concern')">更多</div>
          </div>
          <s-carousel class="foucs-assets" arrow="never" :autoplay="false" :style="{height: foucsAssetsAllRowHeight + 'px'}" v-if="filterConcertList.length > 0">
            <s-carousel-item v-for="(item,index) in filterConcertList" :key="'concern' + index" :style="{height: foucsAssetsAllRowHeight + 'px'}">
              <s-row type="flex" class="foucs-assets-row">
                <s-col class="foucs-assets-col" :style="{height: foucsAssetsRowHeight + 'px'}" :class="statusClass(innerItem)" v-for="(innerItem,index) in item"
                       :key="'innerItem' + index">
                  <s-row type="flex" justify="center" align="middle" style="height: 100%">
                    <s-col class="foucs-assets-icon" span="4">
                      <i class="iconfont icon-hardware feature" :style="{fontSize: iconSize + 'px'}"></i>
                    </s-col>
                    <s-col span="20">
                      <div class="titleWord" :style="{fontSize: titleWordSize + 'px'}">
                        <span class="feature">{{innerItem.pingStatus}}</span>
                        <s-tooltip :content="innerItem['资产名称']"><span class="compName">{{innerItem['资产名称']}}</span></s-tooltip>
                      </div>
                      <div class="contentWord" :style="{fontSize: contentWordSize + 'px'}">
                        {{innerItem['IP地址']}}
                        <span>|</span>
                        {{innerItem['资产类型']}}
                      </div>
                    </s-col>
                  </s-row>
                </s-col>
              </s-row>
            </s-carousel-item>
          </s-carousel>
          <div class="noData" v-else>暂无数据</div>
        </s-card>
        <s-card class="box-card contentOpacity" id="assetsMonitorTopNBox" style="height:220px">
          <div slot="header" class="clearfix">
              <span class="card-title">
                <!--<i class="iconfont icon-trophy"></i>-->
                资产监控排行TOP5
              </span>
            <div class="card-enter more-info" @click="goto('assetsMonitor_topN')">更多</div>
          </div>
          <div class="top-list">
            <table>
              <thead>
              <tr>
                <th>资产名称</th>
                <th>IP地址</th>
                <th>类型</th>
                <th>分数</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item,index) in topNList" :key="'topn' + index">
                <td :title="item.itcompName">
                  <span>{{index + 1}}.</span>
                  {{item.itcompName}}
                </td>
                <td>{{item.address}}</td>
                <td style="width: 20%;">{{item.ciTypeName}}</td>
                <td class="score-td" style="width: 15%;"><span class="score" @click="showScoreDetail(item)">{{item.score}}</span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </s-card>
      </s-col>
    </s-row>
    <!--打分详情弹框-->
    <score-detail-dialog v-model="scoreDetailDialogFlag" v-if="scoreDetailDialogFlag" :cur-score="curScoreObj">
    </score-detail-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import DataDashboard from '@/components/dataDashboard/DataDashboard'
  import scoreDetailDialog from '@/pages/AssetsMonitor_TopN/ScoreDetailDialog';
  import TopologyGraph from '@/components/graph/TopologyGraph'

  export default {
    data() {
      return {
        graphHeight: 440,
        scoreDetailDialogFlag: false,
        statData: [],
        foucsAssetsRowHeight: 60,
        foucsAssetsAllRowHeight: 245,
        iconSize: 30,
        titleWordSize: 14,
        contentWordSize: 12,
        concernList: [],
        topNList: [],
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
            if (i >= 15) break;
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
    },
    mounted() {
      this.initDivHeight();
      window.addEventListener('resize', this.initDivHeight);
    },
    destroyed() {
      window.removeEventListener('resize', this.initDivHeight);
    },
    methods: {
      initDivHeight() {
        var leftHeight = document.getElementById('leftPanelContainer').offsetHeight;
        var topNBoxHeight = document.getElementById('assetsMonitorTopNBox').offsetHeight;
        var boxHeaderHeight = document.getElementsByClassName('s-card-header')[0].offsetHeight;
        var panelHeight = document.getElementById('topology_panel_container').offsetHeight;
        this.graphHeight = panelHeight - boxHeaderHeight;
        this.foucsAssetsAllRowHeight = leftHeight - topNBoxHeight - boxHeaderHeight;
        this.foucsAssetsRowHeight = (leftHeight - topNBoxHeight - boxHeaderHeight - 60) / 5;
        this.iconSize = this.foucsAssetsRowHeight * 0.44;
        this.titleWordSize = this.foucsAssetsRowHeight * 0.2;
        this.contentWordSize = this.foucsAssetsRowHeight * 0.16;
        if (this.iconSize < 30) {
          this.iconSize = 30
        }
        if (this.iconSize > 60) {
          this.iconSize = 55;
        }
        if (this.titleWordSize < 14) {
          this.titleWordSize = 14;
        }
        if (this.titleWordSize > 25) {
          this.titleWordSize = 25;
        }
        if (this.contentWordSize < 12) {
          this.contentWordSize = 12;
        }
        if (this.contentWordSize > 20) {
          this.contentWordSize = 20;
        }
      },
      statusClass(innerItem) {
        switch (innerItem.pingStatus) {
          case '【异常】': // 异常
            return 'crashBg';
          case '【正常】': // 正常
            return 'normalBg';
          case '【告警】': // 告警
            return 'alarmBg';
          default:
            return '';
        }
      },
      showScoreDetail(item) {
        this.scoreDetailDialogFlag = true;
        this.curScoreObj = item;
      },
      axiosDataBoard() {
        $axios.post('/resourcemanager/assetmanager/itasset/statisticsAllMonitorItcomp').then(({data}) => {
          this.statData = data;
        })
      },
      axiosConcernList() {
        let param = {
          condition: {
            canMonitor: 1,
            citypelist: [],
            concern: true
          },
          categoryuuid: ''
        };
        $axios.post('/resourcemanager/assetmanager/itasset/getItassetlisAutoView', param).then((res) => {
          this.concernList = res.data.confitItemData.datalist;
          for (let i = 0; i < this.concernList.length; i++) {
            if (this.concernList[i]['状态'] === 0) {
              this.concernList[i].pingStatus = '【异常】'
            } else if (this.concernList[i]['状态'] === 1) {
              this.concernList[i].pingStatus = '【正常】'
            } else if (this.concernList[i]['状态'] === 2) {
              this.concernList[i].pingStatus = '【告警】'
            } else if (this.concernList[i]['状态'] === 3) {
              this.concernList[i].pingStatus = '【未知】'
            }
          }
        });
      },
      axiosTopNList() {
        let param = {
          itcompName: '',
          order: 'asc',
          topn: 5
        };
        $axios.post(`/kpi/getTopnByMap`, param).then(({data}) => {
          this.topNList = data;
        });
      },
      goto(path, query) {
        let queryStr = query ? `?${query}=true` : ''
        this.$router.push('/AssetsMonitor/' + path + queryStr)
      }
    },
    beforeRouteLeave(to, from, next) {
      this.$refs.topo.closeFloatBox();
      next();
    },
    components: {
      DataDashboard,
      scoreDetailDialog,
      TopologyGraph
    }
  }
</script>
