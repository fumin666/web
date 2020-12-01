<template>
  <div class="opeRecord" v-if="data.length > 0">
    <s-row class="recordItem" v-for="(item, index) in data" :key="index">
      <s-col span="6">
        <p>{{item.oprateUser}}</p>
        <p class="infoName">{{item.deviceIp}}</p>
      </s-col>
      <s-col span="4">
        <span class="protocol">{{item.protocolName}}</span>
      </s-col>
      <s-col span="4">{{item.accountName}}</s-col>
      <s-col span="10">{{item.startTime}}</s-col>
    </s-row>
  </div>
  <div class="noData" v-else>暂无数据</div>
</template>

<script>
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        data: []
      }
    },
    props: {
      compId: {
        type: String,
        required: true
      }
    },
    created() {
      this.axiosData();
    },
    methods: {
      axiosData() {
        $axios.get(`/operationLogStat/listCheckPage/undefined/${this.compId}`).then(({data}) => {
          this.data = data.slice(0, 5);
        });
      }
    }
  }
</script>

<style lang="stylus">

</style>
