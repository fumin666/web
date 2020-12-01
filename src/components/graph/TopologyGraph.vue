<template>
  <div v-clickoutside="closeFloatBox">
    <div class="topology_canvas" id="topology_graph" :style="{height: graphHeight + 'px'}"></div>
    <s-fishbone style="top:20px;right:20px;" ref="fishbone" :graph="graph" :scale="currentScale"></s-fishbone>
    <s-dialog v-model="pingDialog" v-if="pingDialog" :title="pingDialogTitle">
      <ping-form :ip="pingIp"></ping-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="pingDialogCancel" type="cancel">关闭</s-button>
      </template>
    </s-dialog>
    <s-dialog v-model="traceDialog" v-if="traceDialog" :title="traceDialogTitle">
      <trace-form :ip="traceIp"></trace-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="traceDialogCancel" type="cancel">关闭</s-button>
      </template>
    </s-dialog>
    <remote-ping-dialog v-model="remotePingDialog" v-if="remotePingDialog" :itCompId="remoteItCompId"></remote-ping-dialog>
  </div>
</template>
<script>
  import Clickoutside from '@/components/inputTree/clickoutside';
  import mixin from '@/components/graph/TopologyGraphMixin';
  export default {
    mixins: [mixin],
    directives: { Clickoutside }
  };
</script>
