<template>
  <section class="logLevelReport">
    <s-row class="main-content">
      <s-col class="level-left-nav noPrint" :span="spanLeft" id="leftMenu">
        <div class="reportName">选择报表名称</div>
        <s-col v-show="spanLeft === 4">
          <s-tree
            ref="tree"
            :data="leftMenu"
            :props="defaultProps"
            node-key="uuid"
            default-expand-all
            :expand-on-click-node="false"
            :current-node-key="curNodeUuid"
            :highlight-current="true"
            :default-checked-keys="['log_report_level']"
            style="background-color: transparent; padding-bottom: 10px"
            @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }" :title="node.label" style="font-size: 14px;vertical-align: middle;color: #3d454c">
                  <span class="treeContentLabel">{{ node.label }}</span>
                  <input class="treeNodeKey" type="hidden" :value="`${data.ownerUuid}_${data.uuid}`"/>
                </span>
          </s-tree>
        </s-col>
      </s-col>
      <s-col class="console-right-table" :span="spanRight">
        <s-scrollbar :wrap-style="'height:' + scrollbarHeight + 'px;'">
          <router-view></router-view>
        </s-scrollbar>
      </s-col>
    </s-row>
  </section>
</template>

<script type="text/babel">
  export default {
    data () {
      return {
        scrollbarHeight: 0,
        spanLeft: 4,
        spanRight: 19,
        leftMenu: [
          {
            label: '身份鉴别',
            children: [{
              label: '身份认证方式统计',
              uuid: 'level_1'
            }]
          },
          {
            label: '访问控制',
            children: [{
              label: '访问控制统计',
              uuid: 'level_2'
            },
              {
                label: '角色用户统计',
                uuid: 'level_3'
              },
              {
                label: '账号变更情况统计',
                uuid: 'level_4'
              }
            ]
          },
          {
            label: '事件故障',
            children: [
              {
                label: '事件故障统计',
                uuid: 'level_15'
              }
            ]
          }
        ],
        defaultProps: {
          children: 'children',
          label: 'label',
          uuid: 'uuid'
        },
        curNodeUuid: ''
      }
    },
    created() {
    },
    mounted() {
      let nodes = [...this.leftMenu[0].children, ...this.leftMenu[1].children, ...this.leftMenu[2].children]
      let str = this.$route.path.split('log_report_level/')[1]
      for (let i in nodes) {
        if (nodes[i].uuid === str) {
          this.$refs.tree.setCurrentNode(nodes[i])
          break;
        }
      }
      this.mounted()
    },
    destroyed() {
      window.removeEventListener('resize', this.initDivHeight);
    },
    methods: {
      handleNodeClick (node) {
        node.uuid ? this.$router.push('/LogCenter/log_report_level/' + node.uuid) : ''
      },
      initDivHeight () {
        let leftMenuHeight = document.getElementById('leftMenu').offsetHeight;
        this.scrollbarHeight = leftMenuHeight - 20;
      },
      mounted() {
        this.initDivHeight();
        window.addEventListener('resize', this.initDivHeight);
      }
    }
  }
</script>
