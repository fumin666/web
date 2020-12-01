<template>
  <section id="hostListCtn">
    <s-row>
      <s-col :span="4" style="border-right: 1px dashed rgba(0, 0, 0, 0.1);padding-right: 10px;">
        <div class="treeTab">
          <span class="title"><i class="iconfont icon-console"></i>分组</span>
          <span class="treeToolBar">
            <!--<i :class="`iconfont icon-${expandAll?'top':'bottom'}`"
               :title="`全部${expandAll?'折叠':'展开'}`"
               @click="expandAll=!expandAll"></i>-->
            <i class="iconfont icon-plus" title="添加一级分组"
               @click="addDivideGroup({}, {parent:'TOP'})"></i>
          </span>
        </div>
        <s-scrollbar
          ref="treeScrollbar"
          :wrap-style="[{'height':treeScrollHeight + 'px'}]">
          <div style="margin-top: 15px;">
            <s-tree
              ref="hostGroupTree"
              :data="hostTreeData"
              :props="hostTreeProps"
              @node-click="handleTreeNodeClick"
              :highlight-current="true"
              :expand-on-click-node="false"
              :default-expand-all="expandAll"
              :current-node-key="curNodeUuid"
              node-key="uuid">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>
                  <span style="vertical-align: middle;">
                    <img style="margin-right: 4px"
                         :src="data.parent?'./static/images/asseticon/Server.png':'./static/images/asseticon/files.png'"/>
                  </span>
                  <span class="treeNodeLabel" :title="`${node.label}(${data.node.cnt || 0})`">
                    {{`${node.label } (${data.node.cnt || 0})`}}
                  </span>
                </span>
                <span class="treeNodeToolBar" v-if="data.uuid!=='unknown'">
                  <span v-if="!data.parent">
                    <i class="iconfont icon-add" title="新增子级分组"
                      @click.stop.prevent="addDivideGroup(node, data)"></i>
                  </span>
                  <span>
                    <i class="iconfont icon-edit" title="编辑当前分组"
                      @click.stop.prevent="editDivideGroup(node, data)"></i>
                  </span>
                  <span>
                    <i class="iconfont icon-delete" title="删除当前分组"
                      @click.stop.prevent="deleteDivideGroup(node, data)"></i>
                  </span>
                </span>
              </span>
            </s-tree>
          </div>
        </s-scrollbar>
      </s-col>
      <s-col :span="20">
        <main id="hostListRightMain">
          <router-view></router-view>
        </main>
      </s-col>
    </s-row>

    <!--左侧树 - 新增分组弹框-->
    <s-dialog
      v-model="addDivideGroupDialog"
      v-if="addDivideGroupDialog"
      title="添加分组">
      <divide-group-form
        ref="addDivideGroupForm"
        type="add"
        :currentNodeData="clickedNodeData"
        @success="handleSuccessDivideGroupForm"
        @cancel="addDivideGroupDialog = false"></divide-group-form>
    </s-dialog>

    <!--左侧树 - 编辑分组弹框-->
    <s-dialog
      v-model="editDivideGroupDialog"
      v-if="editDivideGroupDialog"
      title="编辑分组">
      <divide-group-form
        ref="editDivideGroupForm"
        type="edit"
        :currentNodeData="clickedNodeData"
        @success="handleSuccessDivideGroupForm"
        @cancel="editDivideGroupDialog = false"></divide-group-form>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import Bus from '@/plugins/eventBus';
  import divideGroupForm from './DivideGroupForm';

  export default{
    data() {
      return {
        activeTab: 0,             // 资产树默认tab值
        treeScrollHeight: 500,    // tree的滚动条高度
        hostTreeData: [],         // 主机列表树数据
        hostTreeProps: {          // 主机列表树字段映射
          children: 'childrenList',
          label: 'name'
        },
        expandAll: true,          // 是否全部展开树节点
        clickedNodeData: {},          // 被点击的节点
        addDivideGroupDialog: false,    // 左侧树 - 添加分组
        curNodeUuid: '',
        editDivideGroupDialog: false    // 左侧树 - 编辑分组
      }
    },
    components: {
      divideGroupForm
    },
    methods: {
      // 左侧树s-scroll高度计算
      doLayout() {
        this.$nextTick(() => {
          let totalHeight = document.body.offsetHeight;
          let headHeight = document.querySelector('#headBar').offsetHeight;
          let footHeight = document.querySelector('.s-footer').offsetHeight;
          let bodyHeight = totalHeight - headHeight - footHeight;
          this.treeScrollHeight = bodyHeight - 90;
        });
      },
      // 获取左侧主机列表树数据
      getHostTreeData() {
        $axios.get('/autoMateItcomp/getAutoMateGroupList').then(({data}) => {
          if (data && data instanceof Array) {
            this.hostTreeData = data;
            this.$nextTick(() => {
              if (this.$route.query.uuid) {
                this.$refs.hostGroupTree.setCurrentKey(this.$route.query.uuid)
              } else {
                this.$refs.hostGroupTree.setCurrentKey(data[data.length - 1].uuid)
              }
            })
          }
        })
      },
      // 新增主机列表分组
      addDivideGroup(node, data) {
        this.clickedNodeData = data
        this.addDivideGroupDialog = true
      },
      // 编辑主机列表分组
      editDivideGroup(node, data) {
        this.clickedNodeData = data
        this.editDivideGroupDialog = true
      },
      // 删除主机列表分组
      deleteDivideGroup(node, data) {
        this.$confirm('确定删除该分组？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = data.parent
                    ? `/autoMateItcomp/delSecondGroupByUuid/${data.uuid}`
                    : `/autoMateItcomp/delFirstGroupByUuid/${data.uuid}`;
          console.log(data);
          let obj = {
            data: [data],
            logTemplate: '删除|分组(#name#)'
          }
          $axios.get(url, obj).then(({data}) => {
            if (data.state) {
              this.getHostTreeData();     // 刷新左侧主机列表树数据
              this.$message.success('删除成功！');
            } else {
              this.getHostTreeData();     // 刷新左侧主机列表树数据
              this.$message.error('删除失败，请刷新重新！');
            }
          })
        }).catch(() => {})
      },
      // 添加/编辑主机分组成功处理函数
      handleSuccessDivideGroupForm(type) {
        this.getHostTreeData();     // 刷新左侧主机列表树数据
        this[`${type}DivideGroupDialog`] = false;
      },
      // 左侧主机列表树节点点击事件
      handleTreeNodeClick(data, node, comp) {
        if (data.uuid === this.curNodeUuid) { // 如果是当前路由，就不会跳转
          return
        }
        this.$router.push({
          path: '/AutoOpsCenter/hostList',
          query: {
            uuid: data.uuid,
            level: data.parent ? '2' : '1'
          }
        })
        this.curNodeUuid = node.uuid;
      }
    },
    created() {
      // 获取左侧主机列表树数据
      this.getHostTreeData();
      // 批量分组保存成功，刷新左侧主机分组树
      Bus.$on('freshGroupsTree', () => {
        this.getHostTreeData();
      });
    },
    mounted() {
      this.doLayout();
      window.addEventListener('resize', this.doLayout);
    },
    destroyed() {
      window.removeEventListener('resize', this.doLayout);
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #hostListRightMain
    padding-top 10px
  #hostListCtn
    .treeTab
      .title,.treeToolBar
        display inline-block
        box-sizing border-box
        padding 0 5px
        height 35px
        font-size 14px
        line-height 40px
      .title
        cursor pointer
      .treeToolBar
        float right
        padding-right 10px
        line-height 40px
        i.iconfont
          padding-right 5px
          font-size 16px
          cursor pointer
    .custom-tree-node
      .treeNodeToolBar
        position absolute
        right 20px
        opacity 0
      .treeNodeLabel
        font-size 14px
        display table-cell
        max-width 150px
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
    .s-tree-node-content
      &:hover
       .treeNodeToolBar
        opacity 1

  @media screen and (max-width: 1400px) {
    #hostListCtn .custom-tree-node .treeNodeLabel {
      max-width: 90px;
    }
  }
</style>
