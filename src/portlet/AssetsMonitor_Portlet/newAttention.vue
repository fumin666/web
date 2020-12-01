<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-08 14:21:50
 * @LastEditTime : 2019-12-27 15:10:50
 * @LastEditors  : mybells
 -->
<template>
  <!--关注监控资产-->
  <div class="diy-monitor-attention assetsMonitor">
    <s-card-diy :more-click="more"
                title="关注监控资产" class="box-card">
            <div v-nodata="filterConcertList.length === 0" style="height:250px;margin-top:10px;font-size:14px;" class="foucs-card-body">
              <s-carousel class="foucs-assets" arrow="never" :autoplay="false" >
                <s-carousel-item v-for="(item,index) in filterConcertList" :key="'concern' + index">
                  <s-row type="flex" class="foucs-assets-row">
                    <s-col class="foucs-assets-col"
                           :class="statusClass(innerItem)" v-for="(innerItem,index) in item"
                           :key="'innerItem' + index">
                      <s-row type="flex" justify="center" align="middle" style="height: 100%">
                        <s-col class="foucs-assets-icon" span="4">
                          <div class="feature" style="width:34px;height:22px;border-radius:2px;text-align:center;">{{innerItem.pingStatus}}</div>
                        </s-col>
                        <s-col span="10">
                          <div class="titleWord">
                            <!-- <span class="feature"></span> -->
                            <s-tooltip :content="innerItem['资产名称']"><span class="compName">{{innerItem['资产名称']}}</span>
                            </s-tooltip>
                          </div>
                        </s-col>
                        <s-col span="10">
                          <div class="contentWord">
                            {{innerItem['IP地址']}}
                            <span v-if="innerItem['资产类型']">|</span>
                            {{innerItem['资产类型']}}
                          </div>
                        </s-col>
                      </s-row>
                    </s-col>
                  </s-row>
                </s-carousel-item>
              </s-carousel>
            </div>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  // import MonitorAttention from '@/pages/AssetsMonitor_List/MonitorList'

  export default {
    data() {
      return {
        concernList: []
      }
    },
    components: {
      // MonitorAttention
    },
    computed: {
      filterConcertList() {
        if (this.concernList.length === 0) {
          return [];
        } else {
          let arr = [];
          let numd = this.concernList.length % 4;
          if (numd) {
          } else {
            let addnum = 4 - numd;
            for (let j = 0; j < addnum; j++) {
              this.concernList.push(null)
            }
          }
          for (let i = 0; i < this.concernList.length; i = i + 4) {
            if (i >= 24) break;
            arr.push([]);
            let lastIndex = arr.length - 1;
            this.concernList[i] && arr[lastIndex].push(this.concernList[i]);
            this.concernList[i + 1] && arr[lastIndex].push(this.concernList[i + 1]);
            this.concernList[i + 2] && arr[lastIndex].push(this.concernList[i + 2]);
            this.concernList[i + 3] && arr[lastIndex].push(this.concernList[i + 3]);
          }
          return arr;
        }
      }
    },
    methods: {
      axiosDataBoard() {
        $axios.get('/resourcemanager/assetmanager/itasset/statisticsAllMonitorItcomp').then(res => {
          this.statData = res.data
        })
      },
      goto(path, query) {
        let queryStr = query ? `?${query}=true` : ''
        this.$router.push('/AssetsMonitor/' + path + queryStr)
      },
      more() {
        this.goto('assetsMonitor_concernList?concern=true')
      },
      statusClass(innerItem) {
        switch (innerItem.pingStatus) {
          case '严重': // 宕机
            return 'crashBg';
          case '正常': // 正常
            return 'normalBg';
          case '告警': // 告警
            return 'alarmBg';
          default:
            return '';
        }
      },
      borderSel(innerItem) {
        switch (innerItem.pingStatus) {
          case '严重': // 宕机
            return 'yanzhong';
          case '正常': // 正常
            return 'zhengchang';
          case '告警': // 告警
            return 'jinggao';
          default:
            return '';
        }
      },
      axiosConcernList() {
        let param = {
          condition: {
            canMonitor: 1,
            citypelist: [],
            concern: true
          },
          categoryuuid: ''
        }
        $axios.post('/resourcemanager/assetmanager/itasset/getItassetlisAutoView', param).then(res => {
          this.concernList = res.data.confitItemData.datalist
          for (let i = 0; i < this.concernList.length; i++) {
            if (this.concernList[i]['状态'] === 0) {
              this.concernList[i].pingStatus = '严重'
            } else if (this.concernList[i]['状态'] === 1) {
              this.concernList[i].pingStatus = '正常'
            } else {
              this.concernList[i].pingStatus = '告警'
            }
          }
        })
      }
    },
    created() {
      this.axiosConcernList()
    }
  }
</script>
<style>
  .diy-monitor-attention {
    width: 100%;
    height: 100%;
  }
  #stylebox{
    display:flex;
    flex-direction:row;
    justify-content: space-around;
    flex-wrap:wrap;
    height: 90%
  }
 #stylebox>.yshi{
    width:calc(100% / 2 );
    height:calc(94% / 2 );
    border:0
  }
  .jinggao{
      background-color:rgb(245, 245, 245);
      border-left:3px solid #eeb13c;
  }
  .yanzhong{
     background-color:rgb(245, 245, 245);
     border-left:3px solid red;
  }
  .zhengchang{
    background-color:rgb(245, 245, 245);
    border-left:3px solid #26cd7c;
  }
  .titleWord>.fontsy{
    color:balck;
    padding-left:10px
  }
  .contentWord>span{
    padding-left:10px;
    font-size: 14px;
    color:gray
  }
  .diemsy {
    padding-left: 10px;
    font-size: 16px;
    color: black;
    font-border:200
  }
  .textfsy{
    padding-left:10px;
    font-size:16px;
    font-border:400
  }
</style>
