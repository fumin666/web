/**
* Created by alex on 2018/5/17.
*/
<template>
  <s-scrollbar wrap-class="monitor-kpi-scroll">
    <s-row id="business-define" class="business-layout">
      <s-col  span='8'>
        <s-scrollbar :wrap-style="[{'max-height':treeScrollHeight + 'px'}]" key="it" ref="treeScrollbar">
        <s-tree
          ref="treeX"
          :showLine="true"
          :data="businessTree"
          :props="defaultProps"
          node-key="uuid"
          @node-click="handleNodeClick"
          :highlight-current="true"
          :current-node-key="currentNodeValue"
          default-expand-all
          :expand-on-click-node="false"
          :render-content="renderContent">
        </s-tree>
        </s-scrollbar>
      </s-col>
      <s-col  span='16'>
        <div :style="[{'max-height':graphHeight + 'px'}]">
          <div ref="graph" id="graphContainer"></div>
        </div>
      </s-col>
    </s-row>
  </s-scrollbar>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import mixin from '@/components/graph/BusinessGraphMixin'
  const businessIcon = 'static/images/topologyicon/default/businessService.svg'
  export default {
    mixins: [mixin],
    data () {
      return {
        businessTree: [],
        currentStep: 0,
        addDialog: false,
        editDialog: false,
        setDialog: false,
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        monitorSys: [],
        otherItcomp: [],
        businessServiceUuid: '',
        currentNodeValue: '',
        treeNodeList: [],
        currentParentId: '',
        treeScrollHeight: 100,
        graphHeight: 100,
        addBusinessSystem: '',
        parentForm: {},
        editForm: {},
        Select2: null,
        Select3: null,
        Select4: null
      }
    },
    props: {
      BuseyeUuid: {
        type: String
      }
    },
    mounted() {
      this.getTreeList()
      this.doLayout()
    },
    components: {
    },
    methods: {
      closeAddDialog() {
        this.addDialog = false
        this.currentStep = 0
      },
      closeEditDialog() {
        this.editDialog = false
        this.currentStep = 0
      },
      expandTree() {
        for (var i = 0; i < this.$refs.treeX.store._getAllNodes().length; i++) {
          this.$refs.treeX.store._getAllNodes()[i].expanded = !(this.$refs.treeX.store._getAllNodes()[i].expanded)
        }
      },
      doLayout() {
        this.$nextTick(() => {
          let totalHeihgt = document.body.offsetHeight;
          let headHeight = document.querySelector('#headBar').offsetHeight;
          let footHeight = document.querySelector('.s-footer').offsetHeight;
          let bodyHeight = totalHeihgt - headHeight - footHeight;
          // 17是因为scrollbar的marginbottom, 后一个20是距离footer的距离
          this.treeScrollHeight = bodyHeight - 20 - 35 - 15 - 90 + 17;
          this.graphHeight = bodyHeight - 20 - 35 - 15 - 50;
        })
      },
      getTreeList(uuid) {
        $axios.get(`/businessservice/getBusinessServiceInfoDefine/${this.BuseyeUuid}`).then((res) => {
          let tree = [res.data]
          for (let i in tree) {
            tree[i].businessServiceSystemList.map((item) => {
              item.name = item.itcompName
              item.parentId = tree[i].uuid
              // item.icon = item.cmdbCitype.icon
            })
            tree[i].businessSystemItcompList.map((item) => {
              item.name = item.itcompName
              item.parentId = tree[i].uuid
              // item.icon = item.cmdbCitype.icon
            })
            tree[i].children = [
              {
                name: '业务系统',
                children: tree[i].businessServiceSystemList,
                parentId: tree[i].uuid
                // icon: tree[i].businessServiceSystemList[i].icon
              },
              {
                name: '监控资源',
                children: tree[i].businessSystemItcompList,
                parentId: tree[i].uuid
                // icon: tree[i].businessSystemItcompList[i].icon
              }
            ]
          }
          this.businessTree = tree
          this.currentParentId = uuid || tree[0].uuid
          this.currentNodeValue = uuid || tree[0].uuid
          this.getGraph(this.currentNodeValue)
        })
      },
      getIconAddress(icon) {
        let start = icon.lastIndexOf('\/')
        let end = icon.lastIndexOf('.')
        let iconName = icon.slice(start, end)
        return `static/images/topologyicon/default${iconName}.svg`
      },
      getGraph(uuid) {
        $axios.get(`/businessservice/getBusinessServiceInfoDefine/${uuid}`).then((res) => {
          if (this.$refs['graph'] !== undefined) {
            this.$refs['graph'].innerHTML = ''
          }
          let graphList = res.data
          let map = graphList.businessSystemItcompMap
          for (let key in map) {
            map[key].map((item) => {
              item.childrenList = []
              item.name = item.itcompName
              item.parent = key
              item.icon = this.getIconAddress(item.cmdbCitype.iconThumb)
            })
          }
          graphList.businessServiceSystemList.map((item) => {
            item.childrenList = map[item.uuid]
            item.name = item.itcompName
            item.parent = graphList.uuid
            item.icon = this.getIconAddress(item.cmdbCitype.iconThumb)
          })
          this.treeNodeList = [{
            childrenList: graphList.businessServiceSystemList,
            name: graphList.name,
            uuid: graphList.uuid,
            icon: businessIcon
          }]
        })
      },
      handleNodeClick(data) {
        if (!data.hasOwnProperty('parentId') && data.uuid !== this.currentParentId) {
            this.currentParentId = data.uuid
            this.getGraph(data.uuid)
        }
        if (data.hasOwnProperty('parentId') && data.parentId !== this.currentParentId) {
          this.currentParentId = data.parentId
          this.getGraph(data.parentId)
        }
      },
      renderContent(h, { node, data, store }) {
        let arr = [];
        let img = '';
        if (node.level === 3) {
          arr = node.data.cmdbCitype.icon.split('/')
          img = '../../static/images/asseticon/' + arr[arr.length - 1]
        } else {
          img = '../../static/images/asseticon/files.png'
        }
        return (
          <span><span style = "vertical-align: middle;"><img style="margin-right: 4px;width:16px;height:16px;" src={img}></img></span>
          < span style = "font-size:14px" > {node.label}</span ></span >
        );
      }
    }
  }
</script>

