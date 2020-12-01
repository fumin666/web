<!--自动化巡检概况-->
<template>
  <div class="diy-auto-inspect autoOpsfix">
    <s-card-diy class="cardview autoOperation" title="自动化巡检概况" :show-more="true" :more-click="moreclick('autoOps_polling')">
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
  </div>
</template>

<script type="text/babel">
  import { merge } from 'lodash'
  import $axios from 'sunflower-ajax';
  import pieChartOption from '@/components/chart/pieChartOption.js'
  export default{
    data() {
      return {
        autoChartData: {
          name: 'autoChartData',
          type: 'pieChart',
          width: '100%',
          height: '100%',
          data: [],
          option: {}
        },
        taskNum: 0,
        objNum: 0
      }
    },
    methods: {
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
          this.autoChartData.option = merge({}, this.autoChartData.option, pieChartOption.dark, option)
        } else {
          option.series[0].itemStyle.normal.borderColor = '#fff';
          this.autoChartData.option = merge({}, this.autoChartData.option, pieChartOption.light, option)
        }
      }
    },
    watch: {
      '$store.state.theme': function(val) {
        this.getTheme(val)
      }
    },
    created() {
      let mainTheme = localStorage.getItem('theme');
      this.getTheme(mainTheme)
      // 获取"自动化巡检概况"数据
      $axios.get(`/autoMateCount/getInspectCount`).then(({data}) => {
        this.taskNum = data.ispect ? data.ispect[0].value : 0;
        this.objNum = data.ispect ? data.ispect[1].value : 0;
        this.autoChartData.data = data.status || []
      })
    }
  }
</script>
