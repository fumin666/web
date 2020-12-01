/**
* Created by dgunzi on 2019/03/06.
* 节点详情
*/
<template>
  <div id="ConfigCenter-nodeDetail">
    <s-row>
      <s-col span="24">
        <s-button icon="arrow-left" @click="backAction" title="返回" style="float: right;"></s-button>
      </s-col>
    </s-row>
    <s-collapse v-model="activeNames">
      <s-collapse-item title="基本信息" name="0">
        <div class="items">
          <s-row :gutter="5">
            <s-col span="6">
              <s-row class="item-info">
                <s-col class="item-name"  span="12">节点名称</s-col>
                <s-col class="item-value" span="12">{{ nodeDetail.nodeName }}</s-col>
              </s-row>
            </s-col>
            <s-col span="6">
              <s-row class="item-info">
                <s-col class="item-name"  span="12">节点IP</s-col>
                <s-col class="item-value" span="12">{{ nodeDetail.ipAddress }}</s-col>
              </s-row>
            </s-col>
            <s-col span="6">
              <s-row class="item-info">
                <s-col class="item-name"  span="12">节点状态</s-col>
                <s-col class="item-value" span="12">{{ nodeDetail.nodeStatus }}</s-col>
              </s-row>
            </s-col>
            <s-col span="6">
              <s-row class="item-info">
                <s-col class="item-name"  span="12">激活状态</s-col>
                <s-col class="item-value" span="12">{{ nodeDetail.activeStatus }}</s-col>
              </s-row>
            </s-col>
          </s-row>
        </div>
      </s-collapse-item>
      <s-collapse-item title="服务管理" name="1">
        <!--服务管理-->
        <remote-service :service-list="nodeDetail.serviceList" :node-ip="nodeDetail.ipAddress"></remote-service>
      </s-collapse-item>
      <s-collapse-item title="端口检测" name="2">
        <!--端口检测-->
        <node-port-check :service-port="nodeDetail.servicePort" :node-id="nodeId" @reload="getNodeDetail"></node-port-check>
      </s-collapse-item>
      <s-collapse-item title="策略管理" name="3">
        <!--策略管理-->
        <node-strategy-manage :node-strategy-list="nodeDetail.ipStrategy" :node-id="nodeId" @reload="getNodeDetail"></node-strategy-manage>
      </s-collapse-item>
    </s-collapse>
  </div>
</template>

<script>
    import RemoteService from './RemoteServiceManage';
    import NodePortCheck from './NodePortCheck'
    import NodeStrategyManage from './NodeStrategyManage'
    import $axios from 'sunflower-ajax'
    export default {
        name: 'NodeDetail',
        data() {
            return {
              activeNames: ['0'],
              nodeDetail: {}
            }
        },
        components: {
          RemoteService,
          NodePortCheck,
          NodeStrategyManage
        },
        props: {
          nodeId: {
            type: String,
            required: true
          },
          action: {
            type: String
          }
        },
        created() {
           this.activeNames = ['0', this.action];
           this.getNodeDetail();
        },
        methods: {
          getNodeDetail() {
            $axios.get(`/configcenter/nodeserver/getNodeServer/${this.nodeId}`).then(({data}) => {
              this.nodeDetail = data;
            });
          },
          backAction () {
            this.$emit('back')
          }
        }
    }
</script>

<style scoped>

</style>
