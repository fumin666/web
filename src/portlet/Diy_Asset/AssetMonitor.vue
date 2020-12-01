<template>
  <div class="diy-asset-asset-monitor">
    <s-card-diy
      title="资产监控"
      :more-click="moreClick">
      <div style="width: 100%; height: 100%; display: flex; flex-direction: row">
        <div style="width: 185px">
          <div style="width: 100px; height: 100px; margin-left: 42px; margin-top: 40px; position: relative;">
            <s-progress type="circle" :percentage="score" :width="100" :status="status"></s-progress>
            <div class="my-score"><span>{{score}}</span>分</div>
            <div class="my-label">健康度评估</div>
          </div>
        </div>
        <div style="flex: 1">
          <s-carousel :interval="5000" arrow="never" :autoplay="false" style="height: 100%">
            <s-carousel-item v-for="(i, idx) in carouselLength" :key="idx">
              <s-grid direction="column">
                <s-grid-item :flex="1">
                  <s-grid direction="row">
                    <template v-for="m in 3">
                      <s-grid-item :flex="1">
                        <asset-monitor-item
                          v-if="list[6 * (i - 1) + m - 1]"
                          :data="list[6 * (i - 1) + m -1]"/>
                      </s-grid-item>
                    </template>
                  </s-grid>
                </s-grid-item>
                <s-grid-item :flex="1">
                  <s-grid direction="row">
                    <template v-for="(n, idx) in 3">
                      <s-grid-item :flex="1">
                        <asset-monitor-item
                          v-if="list[6 * (i - 1) + n + 3 - 1]"
                          :data="list[6 * (i - 1) + n + 3 - 1]"/>
                      </s-grid-item>
                    </template>
                  </s-grid>
                </s-grid-item>
              </s-grid>
            </s-carousel-item>
          </s-carousel>
        </div>
      </div>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import AssetMonitorItem from './AssetMonitorItem';
  export default {
    components: {
      AssetMonitorItem
    },

    data() {
      return {
        list: []
      }
    },

    computed: {
      carouselLength() {
        return Math.ceil(this.list.length / 6);
      },
      score() {
        let sum = 0;
        let normal = 0;
        for (let i = 0; i < this.list.length; i++) {
          sum += this.list[i].count;
          normal += this.list[i].data['正常'];
        }
        if (sum === 0) {
          return 0;
        } else {
          return Math.round(normal / sum * 100);
        }
      },
      status() {
        if (this.score > 60) {
          return 'success';
        } else {
          return 'warning';
        }
      }
    },

    created() {
      this.getData();
    },

    methods: {
      getData() {
        $axios.get('/resourcemanager/assetmanager/itasset/statisticsAllMonitorItcomp').then(({ data }) => {
          // TODO: 图片资源补全后删除以下代码
          let icons = ['服务器', '应用', '网络', '存储', '安全', '机房环境'];
          for (let i = 0; i < data.length; i++) {
            if (!data[i].icon) {
              data[i].icon = data[i].title;
            }
            if (!icons.includes(data[i].icon)) {
              data[i].icon = '服务器';
            }
          }
          this.list = data;
        });
      },

      moreClick() {
        this.$router.push('/AssetsMonitor');
      }
    }
  }
</script>

<style>
  .diy-asset-asset-monitor {
    width: 100%;
    height: 100%;
  }
  .diy-asset-asset-monitor .s-carousel-container {
    height: 100%;
  }
  .diy-asset-asset-monitor .s-progress-text {
    display: none;
  }
  .diy-asset-asset-monitor .my-score {
    position: absolute;
    left: 0;
    top: 29px;
    text-align: center;
    width: 100%;
    font-size: 12px;
  }
  .diy-asset-asset-monitor .my-score span {
    font-size: 32px;
  }
  .diy-asset-asset-monitor .my-label {
    font-size: 14px;
    text-align: center;
    margin-top: 12px;
  }
</style>
