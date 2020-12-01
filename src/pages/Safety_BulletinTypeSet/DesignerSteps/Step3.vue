<!--
 * @Author: songyf
 * @Date: 2020-2-19
 * @LastEditors: songyf
 * @Description: 安全通报-通报类型设置-通报类型设计器-流程设计
 -->
<template>
  <section class="process-design">
    <s-row class="step-title" style="margin-bottom: 20px">
      流程设计
    </s-row>
    <div class="process-img-box bgGray" v-if="graphFlag" style="margin-bottom: 10px">
      <div id="graphContainer" :style="'padding-left:' + paddWidth + 'px'"></div>
    </div>
    <s-row>
      <s-table-page :data="nodeData"
                    style="margin-top: 10px"
                    :header-search="defSearch()"
                    :header-actions="defAction()"
                    @selection-change="selectionChange">
        <s-table-column type="selection" width="45"></s-table-column>
        <s-table-column label="结点顺序"
                        prop="nodePosition"
                        width="120px"
                        :filters="[{text: '开始结点', value: 1}, {text: '中间结点', value: 2}, {text: '结束结点', value: 3}]"
                        :filter-method="filterNodeOrder">
          <template slot-scope="scope">
            <span v-if="scope.row.nodePosition === 1">开始结点</span>
            <span v-if="scope.row.nodePosition === 2">中间结点</span>
            <span v-if="scope.row.nodePosition === 3">结束结点</span>
          </template>
        </s-table-column>
        <s-table-column label="结点名称" prop="nodeName"></s-table-column>
        <s-table-column label="结点类型"
                        prop="nodeType"
                        width="120px"
                        :filters="[{text: '普通结点', value: 1}, {text: '判断结点', value: 2}]"
                        :filter-method="filterNodeType">
          <template slot-scope="scope">
            <span v-if="scope.row.nodeType === 1">普通结点</span>
            <span v-if="scope.row.nodeType === 2">判断结点</span>
          </template>
        </s-table-column>
        <s-table-column label="上一结点" prop="parentNodeName">
          <template slot-scope="scope">
            {{scope.row.parentNodeName || '--'}}
          </template>
        </s-table-column>
        <s-table-column label="拒绝跳转结点" prop="refulseNodeName">
          <template slot-scope="scope">
            {{scope.row.refulseNodeName || '--'}}
          </template>
        </s-table-column>
        <s-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <i class="iconfont icon-eye" title="查看" @click="viewNode(scope.row)"> </i>
            <i class="iconfont icon-edit" title="编辑" @click="editNode(scope.row)"> </i>
            <i class="iconfont icon-delete" title="删除" @click="delNode(scope.row)"> </i>
          </template>
        </s-table-column>
      </s-table-page>
    </s-row>
    <!--添加结点-->
    <add-node v-if="addNodeFlag"
              v-model="addNodeFlag"
              :isEdit="isEdit"
              :bulletinUuid="bulletinUuid"
              :rowData="rowData"
              @updateProcess="getNodeData"
    ></add-node>
    <!--查看结点-->
    <view-node v-if="viewNodeFlag"
               v-model="viewNodeFlag"
               :rowData="rowData"></view-node>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import AddNode from '@/pages/Safety_BulletinTypeSet/DesignerDialog/AddNode'
  import ViewNode from '@/pages/Safety_BulletinTypeSet/DesignerDialog/ViewNode'
  import BulletinGraphMixin from '@/pages/Safety_BulletinTypeSet/BulletinGraphMixin';

  export default {
    mixins: [BulletinGraphMixin],
    components: {
      AddNode,
      ViewNode
    },
    props: {
      bulletinUuid: {
        type: String,
        default() {
          return '';
        }
      }
    },
    watch: {},
    data() {
      return {
        graphFlag: true, // 流程图开关
        addNodeFlag: false, // 添加结点
        viewNodeFlag: false, // 添加结点
        isEdit: false, // 是否编辑结点,
        nodeData: [],
        selectUuid: [],
        rowData: {},
        paddWidth: 0
      }
    },
    mounted() {
      this.bulletinState = this.$store.state.safetyBulletin.editDesigner;
      if (this.bulletinState !== null) { // 如果存在就是编辑
        this.nodeData = this.bulletinState.safeTypeItilList
        this.container = document.getElementById('graphContainer');
        this.intoProcess()
      } else {
        this.getNodeData()
      }
    },
    methods: {
      intoProcess() {
        let vm = this;
        if (vm.container !== null && vm.container.childNodes.length !== 0) {
          vm.container.removeChild(vm.container.childNodes[0])
        }
        // this.processData = [{nodeName: 'node111', passNodeName: 'node222', refulseNodeName: '--'}, {nodeName: 'node222', passNodeName: 'node333', refulseNodeName: '--'}, {nodeName: 'node333', passNodeName: 'node444', refulseNodeName: '--'}, {nodeName: 'node444', passNodeName: 'node555', refulseNodeName: '--'}, {nodeName: 'node555', passNodeName: 'node666', refulseNodeName: 'node222'}, {nodeName: 'node666', passNodeName: '--', refulseNodeName: '--'}]
        $axios.get(`/safetyPlatform/safetyBulletin/generateFlowChart/${vm.bulletinUuid}`).then(({data}) => {
          if (!data.state) {
            vm.$message({type: 'warning', message: data.errormsg})
            return
          } else {
            vm.$message({type: 'success', message: data.errormsg})
            vm.processData = data.data;
            vm.initGraph()
          }
        })
      },
      addNodeBtn() { // 添加结点
        this.addNodeFlag = true;
        this.isEdit = false
        this.rowData = {};
      },
      editNode(row) {
        this.addNodeFlag = true;
        this.rowData = row;
        this.isEdit = true
      },
      viewNode(row) {
        this.viewNodeFlag = true;
        this.rowData = row;
      },
      getNodeData() { // 获取节点数据
        $axios.get(`/safetyPlatform/safetyBulletin/getAllItilNode/${this.bulletinUuid}`).then(({data}) => {
          this.nodeData = data
        })
      },
      filterNodeOrder(value, row) {
        return row.nodePosition === value;
      },
      filterNodeType(value, row) {
        return row.nodeType === value;
      },
      defSearch() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询条件',
          searchProps: ['nodeName', 'parentNodeName', 'refulseNodeName']
        }
      },
      defAction() {
        let _this = this
        return {
          width: 8,
          actions: [{
            name: '添加结点',
            icon: 'plus',
            click() {
              _this.addNodeBtn()
            }
          }, {
            name: '批量删除',
            icon: 'batch-del',
            click() {
              _this.bathDelNode()
            }
          }]
        }
      },
      selectionChange(val) {
        this.selectUuid = val.map(item => item.uuid);
      },
      bathDelNode() {
        if (this.selectUuid.length) {
          this.delAxios(this.selectUuid)
        } else {
          this.$message({
            message: '请选择要删除的数据！',
            type: 'warning'
          });
        }
      },
      delNode(row) {
        this.delAxios(row.uuid)
      },
      delAxios(arr) {
        let paramArr = [arr];
        if (arr instanceof Array) { // 如果是批量删除
          paramArr = [...arr]
        }
        this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          $axios.post(`/safetyPlatform/safetyBulletin/batchDeleteItilNode`, paramArr).then(({data}) => {
            if (data.state === true) {
              this.$message({message: '删除成功!', type: 'success'});
              this.getNodeData();
            } else {
              this.$message({message: '删除失败!', type: 'error'});
            }
          });
        }).catch(() => {
        });
      }
    },
    filters: {}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .process-design
    .process-img-box
      width 100%
      min-height 150px
      padding 20px
      border 1px solid #DCDEE2;
      box-sizing border-box;
      border-radius 2px;

    .btn-box
      margin 13px 0 15px 0
</style>
