<template>
  <section class="logDownTime">
    <s-row>
      <s-col :span="24"  class="title">资产信息</s-col>
    </s-row>
    <s-row>
      <s-col :span="5">
        <div class="grid-content bg-purple">资产名称</div>
      </s-col>
      <s-col :span="7">
        <div class="grid-content bg-purple-light" v-if="assetMsg.itcompName === null"></div>
        <s-tooltip :content="assetMsg.itcompName" v-else>
          <div class="grid-content bg-purple-light overFlowTip">{{assetMsg.itcompName}}</div>
        </s-tooltip>
      </s-col>
      <s-col :span="5">
        <div class="grid-content bg-purple">IP地址</div>
      </s-col>
      <s-col :span="7">
        <div class="grid-content bg-purple-light" v-if="assetMsg.address !== null">{{assetMsg.address}}</div>
        <div class="grid-content bg-purple-light" v-else></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="5">
        <div class="grid-content bg-purple">资产类别</div>
      </s-col>
      <s-col :span="7">
        <div class="grid-content bg-purple-light" v-if="assetMsg.ciTypeName !== null">{{assetMsg.ciTypeName}}</div>
        <div class="grid-content bg-purple-light" v-else></div>
      </s-col>
      <s-col :span="5">
        <div class="grid-content bg-purple">监控分数</div>
      </s-col>
      <s-col :span="7">
        <div class="grid-content bg-purple-light monitorScore" v-if="assetMsg.score !== null">{{assetMsg.score}}</div>
        <div class="grid-content bg-purple-light monitorScore" v-else></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="24" class="title">打分结果详情</s-col>
    </s-row>
    <div class="noScoreResult">
      <span class="result">该资产处于宕机状态，故监控分数为0！</span>
    </div>
  </section>
</template>

<script>

  export default {
    components: {
    },
    props: ['assetMsg'],
    data() {
      return {
        read: true
      }
    },
    methods: {

    }
  }
</script>
