/**
 * @author fumin
 * @date 2019/10/26
 * @Description:
*/
<template>
  <div>
      <s-row type="flex" style="height: 70%;padding:0 20px;">
        <s-col :span="8" class="cardcol">
          <s-card-diy class="cardview">
            <div class="clearfix">
              <span class="card-title">主机系统的CPU使用率TOP5</span>
            </div>
            <div class="chart">
              <s-scrollbar v-if="UtilizationRate.length" :wrap-style="'max-height: ' + specialOperationHeight + 'px;'">
                <s-row>
                  <s-col :span="12" v-for="(obj, key) in UtilizationRate" :key="key">
                    <v-line :chart='obj'></v-line>
                  </s-col>
                </s-row>
              </s-scrollbar>
              <div v-nodata="UtilizationRate.length === 0" v-else :style="'height: ' + specialOperationHeight + 'px;'"></div>
            </div>
          </s-card-diy>
        </s-col>
        <s-col :span="8" class="cardcol">
          <s-card-diy class="cardview">
            <div class="clearfix">
              <span class="card-title">网络设备的内存使用率TOP5</span>
            </div>
            <div class="chart">
              <s-scrollbar v-if="MemoryRate.length" :wrap-style="'max-height: ' + specialOperationHeight + 'px;'">
                <s-row>
                  <s-col :span="12" v-for="(obj, key) in MemoryRate" :key="key">
                    <v-circlar :chart='obj'></v-circlar>
                  </s-col>
                </s-row>
              </s-scrollbar>
              <div v-nodata="MemoryRate.length === 0" v-else :style="'height: ' + specialOperationHeight + 'px;'"></div>
            </div>
          </s-card-diy>
        </s-col>
        <s-col :span="8" class="cardcol">
          <s-card-diy class="cardview">
            <div class="clearfix">
              <span class="card-title">主机系统的计数器-会话数TOP5</span>
            </div>
            <div class="chart">
              <s-scrollbar v-if="Counter.length" :wrap-style="'max-height: ' + specialOperationHeight + 'px;'">
                <v-process :chart="item" v-for="(item, index) in Counter" :key="index"></v-process>
              </s-scrollbar>
              <div v-nodata="Counter.length === 0" v-else :style="'height: ' + specialOperationHeight + 'px;'"></div>
            </div>
          </s-card-diy>
        </s-col>
      </s-row>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {ceil, max} from 'lodash'
  import vLine from '@/pages/AssetsMonitor_View/components/vLine.vue'
  import vCirclar from '@/pages/AssetsMonitor_View/components/vCirclar.vue'
  import vProcess from './vProcess.vue'
    export default {
      data() {
        return {
          UtilizationRate: [],
          MemoryRate: [],
          Counter: [],
          monitorDynamicViewName: '',
          monitorDynamicViewName1: '',
          monitorDynamicViewName2: '',
          specialOperationHeight: 200
        }
      },
      components: {
        vLine,
        vProcess,
        vCirclar
      },
      props: ['monitorChart'],
      methods: {
        initDivHeight () {
          var boxCardItemHeight = document.getElementsByClassName('chart')[0].offsetHeight;
          this.specialOperationHeight = boxCardItemHeight;
        },
        getConfig() {
          $axios.get(`/monitorview/getConfig/${this.monitorChart[0].uuid}`).then((res) => {
            this.monitorDynamicViewName = 'cpu_utilization'
            this.monitorDynamicViewName1 = 'counter_userNumber'
            let params = {
              monitorCiypeuuid: this.monitorChart[0].uuid,
              monitorDynamicViewName: this.monitorDynamicViewName
            }
            let params1 = {
              monitorCiypeuuid: this.monitorChart[0].uuid,
              monitorDynamicViewName: this.monitorDynamicViewName1
            }
            this.getCpu(params)
            this.getCounterUse(params1)
          })
        },
        getCongigNetwork() {
          $axios.get(`/monitorview/getConfig/${this.monitorChart[2].uuid}`).then((res) => {
            this.monitorDynamicViewName2 = 'memory_memoryUtilization'
            let params = {
              monitorCiypeuuid: this.monitorChart[2].uuid,
              monitorDynamicViewName: this.monitorDynamicViewName2
            }
            this.getNetWorkUse(params)
          })
        },
        getCpu(params) {
          $axios.post('/monitorSenceStatics/getSenceStaticsBrokenLine', params).then((res) => { // 主机系统的CPU使用率TOP5
            this.UtilizationRate = res.data
            let data = []
            for (let i in this.UtilizationRate) {
              data.push({
                name: this.UtilizationRate[i].itcompName + `${i}`,
                width: '100%',
                height: '100%',
                value: this.UtilizationRate[i].instantData,
                text: this.UtilizationRate[i].itcompName,
                ip: this.UtilizationRate[i].ipAddr,
                data: this.UtilizationRate[i].data
              })
            }
            this.UtilizationRate = data.slice(0, 5)
          });
        },
        getCounterUse(params) {
          $axios.post('/monitorSenceStatics/getSenceStaticsListObj', params).then((res) => {
            let data = []
            for (let i in res.data) {
              let maxVal = max(res.data.map((obj, index) => {
                return obj.dataVal
              }))
              let y = ceil(maxVal, -((maxVal + '').length - 2))
              data.push({
                process: res.data[i].dataVal ? ((res.data[i].dataVal / y) * 100) : 0,
                value: res.data[i].dataVal,
                text1: null,
                text2: res.data[i].monitorItcompName,
                ip: res.data[i].ipAddr,
                isBlue: true
              });
            }
            this.Counter = data.slice(0, 5)
          })
        },
        getNetWorkUse(params) {
          $axios.post('/monitorSenceStatics/getSenceStaticsListObj', params).then((res) => {
            let data = []
            for (let i in res.data) {
              data.push({
                name: res.data[i].tagName + `${i}`,
                width: '100%',
                height: '100%',
                value: res.data[i].dataVal,
                text: res.data[i].monitorItcompName,
                ip: res.data[i].ipAddr,
                isTagName: null
              })
            }
            this.MemoryRate = data.slice(0, 5)
          });
        }
      },
      mounted() {
        this.initDivHeight()
        this.getConfig()
        this.getCongigNetwork()
        window.addEventListener('resize', this.initDivHeight);
      },
      destroyed() {
        window.removeEventListener('resize', this.initDivHeight);
      }
    }
</script>

<style scoped>
.cardcol {
  height: 100%;
}
.cardcol:first-of-type {
  padding-right: 5px;
}
.cardcol:nth-of-type(2) {
  padding: 0 5px;
}
.cardcol:nth-of-type(3) {
  padding-left: 5px;
}
.clearfix {
  margin-left: 2px;
  padding-left: 8px;
  opacity: 0.65;
  color: #000;
  margin-top: -10px;
  height: 31px;
  line-height: 31px;
}
.logStatistics:last-child{
  margin-right: 0;
}
.chart{
  height: calc(100% - 13px);
}
</style>
