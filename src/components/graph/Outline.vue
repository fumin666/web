<template>
  <div class="gmnoprint graph_map_overview" :style="{bottom: bottomPanelHeight + 'px'}">
    <div class="outline grpah_outline"></div>
    <div class="overview_toggle" @click="showOrHide"><i class="icon iconfont icon-arrow-left-top" v-if="closed === 0"></i><i class="icon iconfont icon-arrow-right-bottom" v-if="closed === 1"></i></div>
  </div>
</template>
<script>
  export default {
    name: 'sOutline',
    data () {
      return {
        outline: null,
        dataAry: [{'overview': 16, 'outline': 11, 'toggle-image': -16}, {'overview': 160, 'outline': 156, 'toggle-image': 0}],
        closed: 1
      }
    },
    props: {
      graph: {
        type: Object,
        required: true
      },
      bottomPanelHeight: {
        type: Number
      }
    },
    methods: {
      init () {
        let vm = this
        var div = document.querySelector('.grpah_outline');
        this.outline = new window.mxOutline(vm.graph, div);
        this.outline.setZoomEnabled(false);
        if (window.mxClient.IS_QUIRKS) {
          /* eslint-disable no-new */
          new window.mxDivResizer(vm.outline);
        }
      },
      showOrHide() {
        let cHeight = document.querySelector('.graph_map_overview').offsetHeight;
        this.closed = (cHeight === 160) ? 0 : 1;
        let i = 1;
        let interval = setInterval(function () {
          let grpahOutline = document.querySelector('.grpah_outline');
          let graphMapOverview = document.querySelector('.graph_map_overview');
          let tempVal = 16 * i;
          if (cHeight === 160) {
            graphMapOverview.style.width = (160 - tempVal) + 'px';
            graphMapOverview.style.height = (160 - tempVal) + 'px';
            grpahOutline.style.width = (156 - tempVal) + 'px';
            grpahOutline.style.height = (156 - tempVal) + 'px';
          } else {
            graphMapOverview.style.width = (16 + tempVal) + 'px';
            graphMapOverview.style.height = (16 + tempVal) + 'px';
            grpahOutline.style.width = (11 + tempVal) + 'px';
            grpahOutline.style.height = (11 + tempVal) + 'px';
          }
          i++;
          if (i === 10) {
            window.clearInterval(interval);
          }
        }, 80);
      }
    },
    watch: {
      graph: function (val, oldVal) {
        this.init();
      }
    }
  }

</script>
