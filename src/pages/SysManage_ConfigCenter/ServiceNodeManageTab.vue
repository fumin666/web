/**
* Created by dgunzi on 2019/02/28.
* 服务节点管理
*/
<template>
<div>
  <s-table-page
    :data="nodeList"
    class="node-ip"
    :header-search="getHeaderSearch()"
    :row-actions="getRowActions()"
    actions-col-width="150" v-if="!showDetail">
    <s-table-column
      label="节点名称"
      prop="nodeName">
      <template slot-scope="scope">
        <div class="input-box">
          <div class="vir-input ellipsis" :title="scope.row.nodeName">{{scope.row.nodeName}}</div>
          <i class="iconfont icon-plus input-icon" @click="changeName(scope.row)"></i>
        </div>
      </template>
    </s-table-column>
    <s-table-column
      label="内部版本号"
      prop="innerVersion"/>
    <s-table-column
      label="节点IP"
      width="250"
      prop="ipAddress"/>
    <s-table-column
      label="节点状态"
      width="200"
      prop="nodeStatus"/>
    <s-table-column
      label="激活状态"
      width="200"
      prop="activeStatus"/>
    <s-table-column
      label="上次更新时间"
      prop="lastUpdateTime"/>
  </s-table-page>
  <!--节点详情页-->
  <node-detail :nodeId="currentNode" v-if="showDetail" :action="action" @back="backAction"></node-detail>
  <!--修改节点名称-->
  <change-name
    v-model="changeNameFlag"
    v-if="changeNameFlag"
    :nodeData="nodeData"
    @updataName="updataName"
  >
  </change-name>
</div>
</template>

<script>
    import $axios from 'sunflower-ajax'
    import nodeDetail from './NodeDetail'
    import changeName from '@/home/SystemSet/dialog/changeName';
    export default {
        name: 'ServiceNodeManageTab',
        data() {
            return {
              nodeList: [],
              showDetail: false,
              currentNode: '',
              action: '1',
              changeNameFlag: false,
              nodeData: null
            }
        },
        created() {
           this.getNodeData()
        },
        components: {
          nodeDetail,
          changeName
        },
        methods: {
          getNodeData() {
            $axios.get('/configcenter/nodeserver/getNodeServers').then(({data}) => {
              this.nodeList = data;
            });
          },
          getHeaderSearch() {
            return {
              width: 10,
              placeholder: '请输入节点名称、节点IP进行查询',
              searchProps: ['ipAddress', 'nodeName']
            }
          },
          changeName(item) {
            this.nodeData = item
            this.changeNameFlag = true
          },
          updataName(desc, item) {
            item.nodeName = desc
          },
          backAction() {
            this.showDetail = false;
            this.currentNode = '';
          },
          getRowActions() {
            let vm = this;
            return [
              {
                name: '服务管理',
                icon: 'inspection',
                click: (row) => {
                  vm.currentNode = row.nodeId;
                  vm.action = '1'
                  vm.showDetail = true
                }
              },
              {
                name: '端口检测',
                icon: 'port',
                click: (row) => {
                  vm.currentNode = row.nodeId;
                  vm.action = '2'
                  vm.showDetail = true
                }
              },
              {
                name: '策略管理',
                icon: 'policy',
                click: (row) => {
                  vm.currentNode = row.nodeId;
                  vm.action = '3'
                  vm.showDetail = true
                }
              }
            ]
          }
        }
    }
</script>
<style lang="stylus">
  .node-ip
    .input-box
      position relative

      .vir-input
        width: 100%
        height: 32px
        line-height: 32px;
        box-sizing: border-box;
        border: 1px solid #cccccc;
        padding: 0 10px

      .input-icon
        margin-right 0px!important
        font-size 12px!important
        position absolute
        right 4px
        top: 4px
</style>
