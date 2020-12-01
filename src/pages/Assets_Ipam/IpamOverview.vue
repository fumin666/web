<!--
 * @Author: 高建鹏
* @Version: //Q4IP台账
 * @Description: 概览图
 * @Position: IPAM -> IpamOverview
 * @Date: 2019-04-18 09:26:15
 * @LastEditTime : 2019-12-30 17:45:14
 -->

<template>
<div style="padding-right:10px;" class="ipamoverview">
  <s-row style="margin-bottom:15px;" v-if="judgeRoleBtn('assetsManage_overviewFigure')&&judgeRoleBtn('assetsManage_ipAddressManagement')">
    <s-button-group style="float:right;" class="btnStyle">
      <s-button icon="histogram" @click="showModel('graph')">概览图</s-button>
      <s-button icon="list" @click="showModel('list')" class="listStyle">IP台账管理</s-button>
    </s-button-group>
  </s-row>
  <div class="allpanal">
    <div class="panal map">
      <span class="s-card-diy-title">IP可用性概览</span>
      <div>
        <div class="num">
          <div style="margin-right:20px">
            <p :style="sss" style="font-weight:bold">{{totalSubnet}}</p>
            <p :style="sss">子网总数</p>
          </div>
          <div>
            <p :style="sss" style="font-weight:bold">{{totalIP}}</p>
            <p :style="sss">IP总数</p>
          </div>
        </div>
        <div class="chartc">
          <pieChart :data="chartSubnetData" :showLabel="true" name="one" width="50%" height="260px" :borderWidth="0"></pieChart>
          <pieChart :data="ipData" :showLabel="true" name="two" width="50%" height="260px" :borderWidth="0"></pieChart>
        </div>
      </div>
    </div>
    <div class="panal map">
      <span class="s-card-diy-title">子网IP地址可用性热点图</span>
      <div class="chartc">
        <div style="width:50%;height:100%">
          <div style="margin-bottom: 15px;">
            <span class="s-card-diy-title">子网地址 </span>
            <s-select v-model="selectValue" placeholder="请选择" @change="changesubnet">
              <s-option v-for="(item,index) in subnetArr" :key="index" :label="item.subNetAddress" :value="item.uuid">
              </s-option>
            </s-select>
            <span style="margin-left:50px" class="s-card-diy-title">总IP数: {{IPnum}}</span>
          </div>
          <s-scrollbar wrap-style="height: 270px;" ref="scroll">
            <div style="width:100%;height: 270px;">
              <s-tooltip v-for="(item,index) in items" :key="index" effect="dark" :openDelay="openDelay" placement="top-start">
                <div slot="content">{{'IP地址: '+item.ipAddress}}<br/>{{'状态: '+status(item.status)}}</div>
                <li class="ss" :style="s1" v-if="item.status==0">{{item.ipAddress.match(/(?=.)\d+$/)[0]}}</li>
                <li class="ss" :style="s2" v-if="item.status==1">{{item.ipAddress.match(/(?=.)\d+$/)[0]}}</li>
                <li class="ss" :style="s3" v-if="item.status==2">{{item.ipAddress.match(/(?=.)\d+$/)[0]}}</li>
              </s-tooltip>
            </div>
          </s-scrollbar>
        </div>
        <div style="width:50%;height:100%">
          <pieChart :data="chartData" name="three" :titleSize="12" title="IP地址可用性统计图" width="100%" height="100%" :borderWidth="0"></pieChart>
        </div>
      </div>
    </div>
    <div class="panal one">
      <s-card-diy title="组织机构IP地址使用数TOP5" ref="card1" :show-more="false" :show-scrollbar="true">
        <div style="margin-bottom: 10px">
          <div class="top-list">
            <s-table :data="organizationData">
              <s-table-column prop="departName" label="组织机构名称"></s-table-column>
              <s-table-column prop="subnetCount" label="子网数量"></s-table-column>
              <s-table-column prop="mxHostCount" label="IP总数"></s-table-column>
              <s-table-column prop="usage" label="使用率">
                <template slot-scope="scope">
                  <span>{{(scope.row.usage*1000/10).toFixed(0) + "%"}}</span>
                </template>
              </s-table-column>
              <s-table-column prop="available" label="未使用"></s-table-column>
              <s-table-column prop="used" label="已使用"></s-table-column>
              <s-table-column prop="temporary" label="暂态"></s-table-column>
            </s-table>
          </div>
        </div>
      </s-card-diy>
    </div>
    <div class="panal one">
      <s-card-diy title="子网IP地址使用数TOP5" ref="card2" :show-more="false" :show-scrollbar="true">
        <div style="margin-bottom: 10px">
          <div class="top-list">
            <s-table :data="subnetData">
              <s-table-column prop="subNetName" label="子网名称" width="200"></s-table-column>
              <s-table-column prop="mxHostCount" label="IP地址数"></s-table-column>
              <s-table-column prop="usage" label="使用率">
                <template slot-scope="scope">
                  <span>{{(scope.row.usage*1000/10).toFixed(0) + "%"}}</span>
                </template>
              </s-table-column>
              <s-table-column prop="available" label="未使用"></s-table-column>
              <s-table-column prop="used" label="已使用"></s-table-column>
              <s-table-column prop="temporary" label="暂态"></s-table-column>
            </s-table>
          </div>
        </div>
      </s-card-diy>
    </div>
    <div class="panal">
      <s-card-diy title="IP地址状态变更TOP10" ref="card3" :show-more="true" :show-scrollbar="true" :more-click="moreClick">
        <div class="s-card-diy-more more-info" @click="moreClick" style="position: absolute;top: 5px;right: 0;width: 30px;">更多</div>
        <div style="margin-bottom: 10px">
          <div class="top-list">
            <s-table :data="statusData">
              <s-table-column prop="ipAddress" label="IP地址"></s-table-column>
              <s-table-column prop="subnetAddress" label="子网地址"></s-table-column>
              <s-table-column prop="prevStatus" label="变更前状态">
                <template slot-scope="scope">
                  <span>{{status(scope.row.prevStatus)}}</span>
                </template>
              </s-table-column>
              <s-table-column prop="status" label="变更后状态">
                <template slot-scope="scope">
                  <span>{{status(scope.row.status)}}</span>
                </template>
              </s-table-column>
              <s-table-column prop="createUserName" label="操作人"></s-table-column>
            </s-table>
          </div>
        </div>
      </s-card-diy>
    </div>
    <div class="panal">
      <s-card-diy title="IP地址关联资产变更TOP10" ref="card4" :show-more="true" :show-scrollbar="true" :more-click="moreClick2">
        <div style="margin-bottom: 10px">
          <div class="top-list">
            <s-table :data="assetData">
              <s-table-column prop="ipAddress" label="IP地址"></s-table-column>
              <s-table-column prop="subnetAddress" label="子网地址"></s-table-column>
              <s-table-column prop="prevAssetName" label="变更前资产名称"></s-table-column>
              <s-table-column prop="assetName" label="变更后资产名称"></s-table-column>
              <s-table-column prop="createUserName" label="操作人"></s-table-column>
            </s-table>
          </div>
        </div>
      </s-card-diy>
    </div>
  </div>
</div>
</template>

<script>
import pieChart from '@/components/chart/pieChart.vue'
import $axios from 'sunflower-ajax';
export default {

  data() {
    return {
      openDelay: 500,
      items: [],
      IPnum: 0, // 总IP数
      totalSubnet: 0, // 子网总数
      totalIP: 0, // IP总数
      chartSubnetData: [
        {name: '未使用', value: 0},
        {name: '已使用', value: 0},
        {name: '暂态', value: 0}
      ],
      ipData: [
        {name: '非保留', value: 0},
        {name: '保留', value: 0}
      ],
      subnetArr: [], // 热力图下拉菜单
      selectValue: '',
      subnetData: [], // 子网IP地址使用数TOP5 table
      organizationData: [], // 组织机构IP地址使用数TOP5
      statusData: [], // IP地址状态变更TOP10
      assetData: [], // IP地址关联资产变更TOP10
      chartData: [
        {name: '未使用', value: 0},
        {name: '已使用', value: 0},
        {name: '暂态', value: 0}
      ]
    }
  },
  components: {
    pieChart
  },
  created() {
    if (this.$store.state.theme !== window.localStorage.theme) {
      this.$store.commit('setTheme', window.localStorage.theme || 'fanta');
    }
    $axios.get('/ipamIpAddressView/getIpAddressView').then((res) => {
      if (res) {
        let obj = this.chartSubnetData;
        obj[0].value = res.data.available;
        obj[1].value = res.data.used;
        obj[2].value = res.data.temporary;
        this.ipData[1].value = res.data.spare;
        this.ipData[0].value = res.data.nospare;
        this.totalIP = res.data.totalIP;
        this.totalSubnet = res.data.totalSubnet;
      }
    });
    $axios.get('/ipamNetsegment/getAllIpamNetSegmentList').then(({data}) => {
      if (data.length) {
        this.subnetArr = data;
        this.selectValue = data[0].uuid;
        this.changesubnet(this.selectValue)
      }
    })
    // 子网IP地址使用数TOP5 table
    $axios.get('/ipamIpAddressView/getSubnetIpAddressAssetNumTop5').then((res) => {
      if (res.data.length) {
        this.subnetData = res.data.sort(this.compare('used'));
      }
    })
    // 组织机构IP地址使用数TOP5
    $axios.get('/ipamIpAddressView/getOrgIpAddressAssetNumTop5').then((res) => {
      if (res.data.length) {
        this.organizationData = res.data.sort(this.compare('used'));
      }
    })
    // IP地址状态变更TOP10
    $axios.get('/ipamIpAddressView/getIpAddressStatusChangeTop10').then((res) => {
      if (res.data.length) {
        this.statusData = res.data;
      }
    })
    // IP地址关联资产变更TOP10
    $axios.get('/ipamIpAddressView/getIpAddressAssetChangeTop10').then((res) => {
      if (res.data.length) {
        this.assetData = res.data;
      }
    })
  },
  mounted() {
    this.$nextTick(function() {
      // eslint-disable-next-line no-undef
      $('.s-card-diy-more').empty();
      // eslint-disable-next-line no-undef
      $('.s-card-diy-more').css('width', '30px');
      // eslint-disable-next-line no-undef
      $('.s-card-diy-more').append('<span class="ipamColor">更多</span>')
    })
    window.addEventListener('resize', this.add);
    // eslint-disable-next-line no-undef
    // var myChart = echarts.init(document.getElementById('main'));
    // myChart.setOption(this.option);
    // window.addEventListener('resize', () => {
    //   myChart.resize();
    // });
  },
  destroyed() {
    window.removeEventListener('resize', this.add);
  },
  computed: {
    s1() {
      return {background: this.$store.state.theme === 'dark' ? '' : '#fff5e2', border: '1px solid orange', color: 'orange'}
    },
    s2() {
      return {background: this.$store.state.theme === 'dark' ? '' : '#e7ffe5', border: '1px solid yellowgreen', color: 'yellowgreen'}
    },
    s3() {
      return {background: this.$store.state.theme === 'dark' ? '' : '#ffe8e8', border: '1px solid red', color: 'red'}
    },
    sss() {
      return {color: this.$store.state.theme === 'dark' ? '#fff' : '#000'}
    }
  },
  methods: {
      add() {
        if (this.$refs.card1) {
          this.$refs.card1.getBodyStyle();
        }
        if (this.$refs.card2) {
          this.$refs.card2.getBodyStyle();
        }
        if (this.$refs.card4) {
          this.$refs.card4.getBodyStyle();
        }
        if (this.$refs.card3) {
          this.$refs.card3.getBodyStyle();
        }
      },
      moreClick() {
        this.$router.push({path: '/LogCenter/logCenter_reportClassify', query: { status: 'ZTBG' }})
      },
      moreClick2() {
        this.$router.push({path: '/LogCenter/logCenter_reportClassify', query: { status: 'GLZCBG' }})
      },
      compare(property) {
        return function(a, b) {
          var value1 = a[property];
          var value2 = b[property];
          return value2 - value1;
        }
      },
      status(s) {
        if (s === 0) {
          return '暂态';
        } else if (s === 1) {
          return '未使用';
        } else if (s === 2) {
          return '已使用';
        }
      },
      changesubnet(subnetUuid) {
        let _this = this;
        $axios.get(`/ipamIpAddressView/getSubnetIpAddressView/${subnetUuid}`).then(({data}) => {
          _this.chartData[0].value = data.available || 0;
          _this.chartData[1].value = data.used || 0;
          _this.chartData[2].value = data.temporary || 0;
          _this.IPnum = data.mxHostCount;
          // eslint-disable-next-line no-undef
          // let myChart = echarts.getInstanceByDom(document.getElementById('main'));
          // myChart.setOption(this.option);
          let liarrs = data.ipamIpAddressInfos;
          _this.items = [];
          for (var i in liarrs) {
            _this.items.push(liarrs[i]);
          }
          _this.items.sort((a, b) => {
            return a.ipAddress.match(/(?=.)\d+$/)[0] - b.ipAddress.match(/(?=.)\d+$/)[0];
          })
          _this.$nextTick(function() {
            _this.$refs.scroll.update()
          })
        })
      },
      showModel(val) {
        this.$emit('showModel', val)
      }
  }
}
</script>

<style scoped>
.allpanal {
  display:grid;
  grid-template-columns: repeat(2,calc(50% - 10px));
  gap:20px;
}

.panal {
  border-radius:5px;
  height: 350px;
}

.map {
  height: 360px !important;
  box-sizing: border-box;
  padding: 10px 16px;
  border-radius:5px;
  /* border:1px solid rgba(223,226,232,1); */
}

.chartc {
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
  height: calc(100% - 30px)
}

.num {
  padding-bottom: 5px;
  text-align: center;
  font-size: 14px;
  display: flex;
  margin-top:10px;
}


.ss {
  float: left;
  width: 38px;
  line-height: 22px;
  height: 22px;
  text-align: center;
  /* border: 1px solid black; */
  margin: 1px;
  list-style-type: none;
  font-size: 12px;
  border-radius: 3px;
  /* background: orange; */
}
/*定义滚动条轨道*/
/* #heat::-webkit-scrollbar{
  border-radius: 10px;
  width: 6px;
}
#heat::-webkit-scrollbar-thumb{
    border-radius: 10px;
    background-color: rgba(77, 77, 77, 0.5);
    width:6px;
}
#heat::-webkit-scrollbar-track
{
    border-radius: 10px;
    background-color: #ccc;
} */
</style>
