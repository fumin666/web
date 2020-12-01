<template>
  <s-dialog v-model="dialogFlag" title="协议信息" class="protocolDetailDialog">
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">协议名称</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{protocol.protocolName}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">默认端口</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{protocol.protocolPort}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">权限</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{protocolAuthName}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">启动程序</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light autoWrap">{{protocol.realReplayProgram}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">程序工作目录</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light autoWrap">{{protocol.realReplayPath}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">参数</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light autoWrap">{{protocol.realReplayPara}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">备注</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light auto-break">{{protocol.remark}}</div>
      </s-col>
    </s-row>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        dialogFlag: false,
        authOptions: []
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      protocol: {
        type: Object
      }
    },
    computed: {
      protocolAuthName() {
        let curAuthor = this.authOptions.find(item => {
          return item.uuid === this.protocol.protocolAuthUuid;
        });
        if (curAuthor) return curAuthor.protocolAuthName;
        return '';
      }
    },
    created() {
      $axios.get(`/protocolInfo/getSelectData`).then(({data}) => {
        this.authOptions = data;
      });
    },
    methods: {
      dialogOk() {}
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    }
  }
</script>
<style>
  .auto-break{
    word-break: break-word;
  }
</style>
