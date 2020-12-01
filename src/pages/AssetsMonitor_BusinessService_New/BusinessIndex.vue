/**
* Created by alex on 2018/5/16.
*/
<template>
  <s-row id="business-index" class="business-layout">
    <s-tab type="card" style="margin:20px">
      <s-tab-pane label="业务服务管理">
        <s-row style="margin-bottom:10px">
          <s-button-group style="float:right;">
            <s-button style="width:60px" title="视图模式" class="iconfont icon-structure" @click="showModel('graph')"></s-button>
            <s-button style="width:60px" title="列表模式" @click="showModel('list')" class="list icon iconfont icon-xuanxiang"></s-button>
          </s-button-group>
        </s-row>
        <s-col id="left-panel">
          <s-card class="kpi-box-card" :style="[{'height':650 + 'px'}]">
            <div id="wrapper" style="margin-top:40px">
              <div id="circle">
                <div id="radar" class="rot" v-if="dotShow" v-rotate="{getCurrentNode,getLen}"></div>
              </div>
              <div v-for="(item,index) in businessServiceList" :key='index'>
                <div class="dot" :style="setDotPosition(index,item.status)" @click="goto(item.uuid)" style="cursor: pointer;"><span class="ellipsis" style="max-width:80px" :title="item.name">{{item.name}}</span></div>
              </div>
            </div>
            <s-row class='name'>
              <s-row class='bus-name ellipsis' :title="businessInfo.name">{{businessInfo.name}}</s-row>
              <s-col span='12' class="bus-content-left">
                <s-row style="margin:10px 0">
                  <s-col :span="10">
                    <div class="bus-name-left">关键度 :</div>
                  </s-col>
                  <s-col :span="14">
                    <div>{{businessInfo.criticalityName}}</div>
                  </s-col>
                </s-row>
                <s-row style="margin:10px 0">
                  <s-col :span="10">
                    <div class="bus-name-left">可用率 :</div>
                  </s-col>
                  <s-col :span="14">
                    <div>
                      {{businessInfo.todayAvailable}}%
                    </div>
                  </s-col>
                </s-row>
                <s-row style="margin:10px 0">
                  <s-col :span="10">
                    <div class="bus-name-left">影响度 :</div>
                  </s-col>
                  <s-col :span="14">
                    <div>
                      {{businessInfo.effectName}}
                    </div>
                  </s-col>
                </s-row>
                <s-row style="margin:10px 0">
                  <s-col :span="10">
                    <div class="bus-name-left">责任人 :</div>
                  </s-col>
                  <s-col :span="14">
                    <div>
                      {{businessInfo.maintenanceView !== undefined && businessInfo.maintenanceView !== null ? businessInfo.maintenanceView.userRealName:''}}
                    </div>
                  </s-col>
                </s-row>
              </s-col>
              <s-col span='12' class="bus-content-right">
                <div class="bus-state" v-if="businessInfo">
                  <i class="icon iconfont icon-laptop"></i>
                </div>
                <div v-if="businessInfo" style="margin-top:10px;height:20px">
                  <div class="bus-state-msg" :style="businessServiceClass(businessInfo.status)"></div>
                  <div class="bus-state-condition">{{businessInfo.statusName}}</div>
                </div>
              </s-col>
            </s-row>
          </s-card>
        </s-col>
        <s-col id="right-panel">
          <s-card class="kpi-box-card">
            <business-effect :busRow='busRow' :busUuid='busUuid'></business-effect>
          </s-card>
        </s-col>
      </s-tab-pane>
      <s-tab-pane label="业务服务巡检">
        <Business-Service-Check ></Business-Service-Check>
      </s-tab-pane>
    </s-tab>
  </s-row>
</template>
<style lang="stylus">
#business-index
 .dot
    span
      height: 20px;
</style>
<script type="text/babel">
  // import BusinessAnalysis from './BusinessAnalysis'
  import BusinessServiceCheck from '../AssetsMonitor_BusinessServiceCheck/BusinessServiceCheck'
  import $axios from 'sunflower-ajax'
  import rotate from '@/common/directive/rotate'
  import BusinessEffect from './BusinessEffect'
  import mixin from '@/components/graph/BusinessGraphMixin'
  // const businessIcon = 'static/images/topologyicon/default/businessService.svg'
  export default {
    mixins: [mixin],
    data () {
      return {
        businessServiceList: [],
        businessInfo: {},
        treeNodeList: [],
        dotShow: true,
        treeScrollHeight: '',
        graphHeight: '',
        busUuid: '',
        tab: 'kpi',
        busRow: {}
      }
    },
    components: {
      BusinessEffect,
      BusinessServiceCheck
      // BusinessAnalysis
    },
    directives: { rotate },
    created() {
      $axios.post('/businessservice/getAllBusinessInfo').then((res) => {
        if (res.data) {
          this.busUuid = res.data[0].uuid
          this.businessInfo = res.data[0]
          let openBunsin = []
          res.data.map((val) => {
            if (val.isMonitor === 1) {
              openBunsin.push(val)
              }
          })
          this.businessServiceList = openBunsin
          this.dotShow = true
          let total = this.businessServiceList.length
          let perSecond = 60 / this.businessServiceList.length
          let second = new Date().getSeconds()
          let idx
          for (let i = 0; i < total; i++) {
            if ((i) * perSecond < second && (i + 1) * perSecond > second) {
              idx = i
            }
          }
          this.getCurrentNode(idx)
        }
    })
      this.treeNodeList = []
    },
    mounted() {
      // this.doLayout()
    },
    methods: {
      businessServiceClass(val) {
        switch (val) {
          case 3:
            return 'background:linear-gradient(261.81deg, #36B892 -6.91%, #68D380 111.2%);'
          case 2:
            return 'background:linear-gradient(261.81deg, #F89030 -6.91%, #FDD546 111.2%);'
          case 1:
            return 'background:linear-gradient(261.81deg, #F83C30 -6.91%, #FD7D46 111.2%);'
          default:
            return ''
        }
      },
      showModel(type) {
        if (type === 'list') {
          this.$router.replace({
            path: '/AssetsMonitor/assetsMonitor_businessList'
            // query: {uuid: this.topuuid, name: this.topname}
          })
        }
      },
      goto(val) {
        this.busUuid = val
        $axios.get(`/businessservice/getBusinessServiceInfoDefine/${val}`).then(res => {
          this.businessInfo = res.data
          this.busRow = res.data
        })
      },
      doLayout() {
        this.$nextTick(() => {
          let totalHeihgt = document.body.offsetHeight;
          let headHeight = document.querySelector('#headBar').offsetHeight;
          let footHeight = document.querySelector('.s-footer').offsetHeight;
          let bodyHeight = totalHeihgt - headHeight - footHeight;
          // 17是因为scrollbar的marginbottom, 后一个20是距离footer的距离
          this.treeScrollHeight = bodyHeight - 20 - 35 - 25 - 60;
          this.graphHeight = bodyHeight - 20 - 35 - 15 - 210;
        })
      },
      setDotPosition(index, state) {
        let background = 'green'
        if (state === 2) {
           background = 'orange'
        } else if (state === 3) {
           background = 'green'
        } else if (state === 1) {
           background = 'red'
        }
        const r = 90
        let angle = 360 / this.businessServiceList.length * index
        var top = 145 - Math.round(Math.cos(angle * Math.PI / 180) * r) + 'px';
        var left = 145 + Math.round(Math.sin(angle * Math.PI / 180) * r) + 'px';
        return {
          top: top,
          left: left,
          background: background
        }
      },
      getCurrentNode(val) {
        this.businessInfo = this.businessServiceList[val]
        if (this.businessInfo !== undefined) {
          this.getGraph(this.businessInfo.uuid)
        }
      },
      getLen() {
       return this.businessServiceList.length
      },
      getIconAddress(icon) {
        let start = icon.lastIndexOf('\/')
        let end = icon.lastIndexOf('.')
        let iconName = icon.slice(start, end)
        return `static/images/topologyicon/default${iconName}.svg`
      },
      getGraph(uuid) {
        $axios.get(`/businessservice/getBusinessServiceInfoDefine/${uuid}`).then((res) => {
          if (this.$refs['graph'] !== undefined) {
            this.$refs['graph'].innerHTML = ''
          }
          let graphList = res.data
          graphList.businessServiceSystemList.map((item) => {
            item.childrenList = []
            item.name = item.itcompName
            item.parent = graphList.uuid
            item.icon = this.getIconAddress(item.cmdbCitype.iconThumb)
          })
          this.busUuid = graphList.uuid
          this.busRow = graphList
        })
      }
    }
  }
</script>
