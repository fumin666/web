<!--
 * @Description: IP地址管理
 * @Version: //Q4IP台账
 * @Position: IPAM -> this
 * @Date: 2019-04-19 09:42:28
 * @LastEditTime: 2019-11-20 17:17:24
 -->
<template>
    <section style="padding-right:10px;">
        <s-row type="flex">
          <s-col :span="4" class="left-border" id="leftMenu">
            <section class="left-nav">
              <s-tree style="margin-left: 10px; padding-top: 10px; background-color: transparent "
                      :data="leftMenu"
                      :props="defaultProps"
                      node-key="uuid"
                      default-expand-all
                      @node-click="handleNodeClick"
                      :expand-on-click-node="false"
                      :current-node-key="curNodeUuid"
                      :highlight-current="true" ref="tree">
              </s-tree>
            </section>
          </s-col>
          <s-col class="right-table" :span="20">
            <s-row v-if="judgeRoleBtn('assetsManage_overviewFigure')&&judgeRoleBtn('assetsManage_ipAddressManagement')">
              <s-button-group style="float:right;" class="btnStyle">
                <s-button icon="histogram" @click="showModel('graph')" class="listStyle">概览图</s-button>
                <s-button icon="list" @click="showModel('list')">IP台账管理</s-button>
              </s-button-group>
            </s-row>
            <s-tab v-model="activeTab">
              <s-tab-pane label="子网视角" name="pane1">
                <Subnet-Perspective v-if="activeTab === 'pane1'" :keyuuid="keyuuid" :key="keyuuid"></Subnet-Perspective>
              </s-tab-pane>
              <s-tab-pane label="IP地址视角" name="pane2">
                <address-Perspective v-if="activeTab === 'pane2'" :keyuuid="keyuuid" :key="keyuuid"></address-Perspective>
              </s-tab-pane>
            </s-tab>
          </s-col>
        </s-row>
    </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import SubnetPerspective from './Perspective/SubnetPerspective.vue'
  import addressPerspective from './Perspective/addressPerspective.vue'
  export default {
    data () {
      return {
        keyuuid: '',
        activeTab: 'pane1',
        spanLeft: 4,
        spanRight: 19,
        leftMenu: [],
        defaultProps: {
          children: 'childrenList',
          label: 'name',
          uuid: 'uuid'
        },
        curNodeUuid: ''
      }
    },
    components: {
      SubnetPerspective,
      addressPerspective
    },
    created() {
      this.getList()
    },
    mounted() {
      // let nodes = [...this.leftMenu[0].childrenList]
      // let str = this.leftMenu[0].uuid
      // for (let i in nodes) {
      //   if (nodes[i].uuid === str) {
      //     this.$refs.tree.setCurrentNode(nodes[i])
      //     break;
      //   }
      // }
      // this.mounted()
    },
    methods: {
      getList() {
        $axios.get(`/departmentInfo/getAllDepartmentInfoForTree`).then((res) => {
          this.leftMenu = res.data.treeNodeList
          this.keyuuid = this.leftMenu[0].uuid
          this.$nextTick(function() {
            this.$refs.tree.setCurrentNode(this.leftMenu[0])
          })
        })
      },
      handleNodeClick (node) {
        if (node.uuid) {
          this.keyuuid = node.uuid
        }
      },
      showModel(val) {
        this.$emit('showModel', val)
      }
    }
  }
</script>
