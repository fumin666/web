<template>
  <div class="protocol-details">
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">权限</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.protocolAuthName"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">协议名称</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.protocolName"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">默认端口</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.protocolPort"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">协议类型</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.protocolTypeSubName"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">参数</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.realReplayPara"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">工作目录</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.realReplayPath"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">启动程序</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.realReplayProgram"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">备注</div>
      </s-col>
      <s-col :span="14">
      <s-tooltip :content="info.remark" placement="right">
        <div class="grid-content bg-purple-light" v-text="info.remark"　style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"></div>
      </s-tooltip>
      </s-col>
    </s-row>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'

  export default {
    props: {
      data: {
        required: true,
        type: String
      }
    },
    data() {
      return {
        uuid: this.data,
        info: {}
      }
    },
    methods: {
      getInfo() {
        $axios.get(`/protocolInfo/getProtocolInfoByUuid/${this.uuid}`).then((res) => {
          if (res.data && typeof res.data === 'object') {
            this.info = res.data;
          }
        });
      }
    },
    created() {
      this.getInfo();
    }
  }
</script>
