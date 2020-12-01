<!--
 * @Author: 高建鹏
 * @Description:自动化运维模块
 * @Position:
 * @Date: 2019-10-18 13:40:24
 * @LastEditors: 高建鹏
 -->
<template>
<section class="autoOperation" style="height:60%;">
  <s-card class="main-card-content box-card card-line" style="height:100%;">
    <div slot="header" class="clearfix">
      <span class="card-title">{{ cardConfig.title }}</span>
    </div>
    <div style="height:100%;">
      <div class="autofivediv">
        <div v-for="(item,index) in listData" :key="index" style="" class="autoeverydiv">
          <div class="every1">
            <i class="iconfont imgposition" :class="icon(item.name)" style="margin-right:10px;font-size:20px;font-weight: normal;"></i>
            <span class="every1_title">{{item.name}}</span>
          </div>
          <div style="display:flex;align-items: center;">
            <div class="every1_num"><span @click="moreclick('dayInspection?tab=periodicTasks')()">{{item.total}}</span></div>
            <div style="flex:1;font-size:14px;text-align:center;">
              <p class="every1_num2"><span @click="moreclick('dayInspection?tab=periodicTasks')()">{{item.executing}}</span></p>
              <p><img class="imgposition2" src="/static/images/autoOps/start.svg" style="width:12px;height:12px;" alt=""><span class="every1_num3">执行中</span></p>
            </div>
            <div style="flex:1;font-size:14px;text-align:center;">
              <p class="every1_num2"><span @click="moreclick('dayInspection?tab=periodicTasks')()">{{item.finished}}</span></p>
              <p><img class="imgposition2" src="/static/images/autoOps/end.svg" style="width:12px;height:12px;" alt=""><span class="every1_num3">已完成</span></p>
            </div>
          </div>
        </div>
      </div>
      <div style="height:calc(100% - 160px)">
        <s-row type="flex" justify="around" style="padding:0 15px;height:100%;">
          <s-col :span="12" class="cardcol" style="padding:0 10px 0 5px;">
            <s-card-diy class="cardview" title="脚本库概况" :show-more="true" :more-click="moreclick('script')">
              <s-chart :chart="surveyChartData"></s-chart>
            </s-card-diy>
          </s-col>
          <s-col :span="12" class="cardcol" style="padding:0 5px 0 10px;">
            <s-card-diy class="cardview" title="自动化巡检概况" :show-more="true" :more-click="moreclick('autoOps_polling')">
              <div style="display:flex;height:100%;">
                <div class="autoall">
                  <div class="autotype">
                    <p class="autonum">{{taskNum}}</p>
                    <p class="autotask">巡检任务</p>
                  </div>
                  <div class="autotype">
                    <p class="autonum">{{objNum}}</p>
                    <p class="autotask">巡检对象</p>
                  </div>
                </div>
                <s-chart :chart="autoChartData"></s-chart>
              </div>
            </s-card-diy>
          </s-col>
        </s-row>
      </div>
    </div>
  </s-card>
</section>
</template>

<script>
import $axios from 'sunflower-ajax';
import mixin from '@/common/mixins/portletUtil'
import { merge } from 'lodash'
import pieChartOption from '@/components/chart/pieChartOption.js'
import barChartOption from '@/components/chart/barChartOption.js'
export default {
  mixins: [mixin],
  data() {
    return {
      taskNum: 0,
      objNum: 0,
      cardConfig: {
        title: '自动化运维'
      },
      listData: [],
      surveyChartData: {
        name: 'surveyChartData',
        type: 'rainbowBarChart',
        width: '100%',
        height: '100%',
        data: [],
        option: {}
      },
      autoChartData: {
        name: 'autoChartData',
        type: 'pieChart',
        width: '100%',
        height: '100%',
        data: [],
        option: {}
      }
    }
  },
  components: {},
  created() {
    let mainTheme = localStorage.getItem('theme');
    this.getTheme(mainTheme)
    $axios.get(`/autoMateCount/getScriptLibTaskCount`).then(({data}) => {
      this.listData = data || []
    })
    $axios.get(`/autoMateCount/getScriptLibCount`).then(({data}) => {
      this.surveyChartData.data = data || []
    })
    $axios.get(`/autoMateCount/getInspectCount`).then(({data}) => {
      this.taskNum = data.ispect ? data.ispect[0].value : 0;
      this.objNum = data.ispect ? data.ispect[1].value : 0;
      this.autoChartData.data = data.status || []
    })
  },
  methods: {
    icon(key) {
      switch (key) {
        case '服务器自动化':
          return 'icon-zdh-Server'
        case '网络自动化':
          return 'icon-zdh-Internet'
        case '数据库自动化':
          return 'icon-zdh-Database'
        case '中间件自动化':
          return 'icon-zdh-Middleware'
        case '存储自动化':
          return 'icon-zdh-Store'
      }
    },
    moreclick(url) {
      let vm = this;
      return function() {
        vm.$router.push('/AutoOpsCenter/' + url)
      }
    },
    getTheme(val) {
      var option = {
        series: [{
          radius: '70%',
          label: {
            normal: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              borderColor: '#1E2732'
            }
          }
        }]
      }
      if (val === 'dark') {
        option.series[0].itemStyle.normal.borderColor = '#1E2732';
        this.surveyChartData.option = merge({}, this.surveyChartData.option, barChartOption.dark)
        this.autoChartData.option = merge({}, this.autoChartData.option, pieChartOption.dark, option)
      } else {
        option.series[0].itemStyle.normal.borderColor = '#fff';
        this.surveyChartData.option = merge({}, this.surveyChartData.option, barChartOption.light)
        this.autoChartData.option = merge({}, this.autoChartData.option, pieChartOption.light, option)
      }
    }
  },
  watch: {
    '$store.state.theme': function(val) {
      this.getTheme(val)
    }
  },
  destroyed() {},
  mounted() {
  }
}
</script>