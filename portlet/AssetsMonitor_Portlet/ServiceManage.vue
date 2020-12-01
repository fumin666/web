<template>
  <!--业务服务管理-->
  <div id="diyMonitorServiceManage" class='asset-diy'>
    <s-card-diy
      title="业务服务管理"
      :more-click="moreClick">
        <div v-nodata="businessServiceList.length === 0">
          <s-carousel indicator-position="outside" class="foucs-assets" arrow="never" :autoplay="false" :height="`100px`" style="margin-top:10px;" v-if="businessServiceList.length > 0">
            <!-- 轮播图item -->
            <s-carousel-item v-for="(businessService,index) in businessServiceList" :key="`businessService${index}`">
              <s-row type="flex" justify="around" align="middle" style="height: 100%;padding:0 20px;">
                  <s-col class="box" span='6' v-for="(val,index) in businessService" :key="index">
                    <bus-card :busData="val" style="margin-right:5px"></bus-card>
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
import busCard from '@/home/AssetsMonitor/card'
export default {
  data() {
    return {
      businessServiceList: []
    }
  },
  components: {
    busCard
  },
  computed: {
    carouselLength() {
      return Math.ceil(this.list.length / 4);
    }
  },

  created() {
    this.getList();
  },

  methods: {
    moreClick() {
      this.$router.push('/AssetsMonitor/assetsMonitor_businessService');
    },

    getList() {
      $axios.post('/businessservice/businessServiceinfoList').then(({data}) => {
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
      });
    }
  }
}
</script>
<style lang="stylus">
.asset-diy
  .bus-content
    height 100px
    .nav
      .con
        height 45px
</style>

