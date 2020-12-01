<template>
  <div class="diy-user-ops-asset">
    <s-card-diy
      title="运维资产"
      :more-click="moreClick">
      <s-carousel :interval="5000" arrow="never" :autoplay="false" height="139px" v-if="list.length !== 0">
        <s-carousel-item v-for="(i, idx) in carouselLength" :key="idx">
          <div v-for="(m, index) in 4" :key="index" class="ops-asset-item">
            <OpsAssetItem :obj="list[4 * (i - 1) + m - 1]" v-if="list[4 * (i - 1) + m - 1]"/>
          </div>
        </s-carousel-item>
      </s-carousel>
      <div v-if="list.length === 0" height="139px" style="text-align: center;line-height: 139px"> 暂无数据 </div>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import OpsAssetItem from './OpsAssetItem';
  export default {
    components: {
      OpsAssetItem
    },

    data() {
      return {
        list: []
      }
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
      getList() {
        $axios.post('/operationCenter/getVMaintatinedDeviceList', {content: ''}).then(({ data }) => {
          // TODO: 以下为伪造数据
          // data = [
          //   { pingStatusStr: '正常', itcompName: 'zichanQWERR', protocolName: 'SSH', controlAdderss: '192.168.211.12', accountName: 'root' },
          //   { pingStatusStr: '正常', itcompName: 'zichanQWERR', protocolName: 'SSH', controlAdderss: '192.168.211.12', accountName: 'root' },
          //   { pingStatusStr: '正常', itcompName: 'zichanQWERR', protocolName: 'SSH', controlAdderss: '192.168.211.12', accountName: 'root' },
          //   { pingStatusStr: '正常', itcompName: 'zichanQWERR', protocolName: 'SSH', controlAdderss: '192.168.211.12', accountName: 'root' },
          //   { pingStatusStr: '正常', itcompName: 'zichanQWERR', protocolName: 'SSH', controlAdderss: '192.168.211.12', accountName: 'root' },
          //   { pingStatusStr: '正常', itcompName: 'zichanQWERR', protocolName: 'SSH', controlAdderss: '192.168.211.12', accountName: 'root' },
          //   { pingStatusStr: '正常', itcompName: 'zichanQWERR', protocolName: 'SSH', controlAdderss: '192.168.211.12', accountName: 'root' },
          //   { pingStatusStr: '正常', itcompName: 'zichanQWERR', protocolName: 'SSH', controlAdderss: '192.168.211.12', accountName: 'root' },
          //   { pingStatusStr: '正常', itcompName: 'zichanQWERR', protocolName: 'SSH', controlAdderss: '192.168.211.12', accountName: 'root' },
          //   { pingStatusStr: '正常', itcompName: 'zichanQWERR', protocolName: 'SSH', controlAdderss: '192.168.211.12', accountName: 'root' },
          //   { pingStatusStr: '正常', itcompName: 'zichanQWERR', protocolName: 'SSH', controlAdderss: '192.168.211.12', accountName: 'root' },
          //   { pingStatusStr: '正常', itcompName: 'zichanQWERR', protocolName: 'SSH', controlAdderss: '192.168.211.12', accountName: 'root' }
          // ];
          this.list = data.slice(0, 13);
        });
      },

      moreClick() {
        this.$router.push('/OperationCenter/oper_equipment');
      }
    }
  }
</script>

<style>
  .diy-user-ops-asset {
    width: 100%;
    height: 100%;
  }
  .diy-user-ops-asset .ops-asset-item {
    float: left;
    width: 50%;
    height: 50%;
  }
</style>
