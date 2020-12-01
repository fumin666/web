<template>
  <s-dialog v-model="dialogFlag" title="选择资产" width="900px" class="selectAssetDialog">
    <s-row class="selectAssetContainer" :gutter="10">
      <s-col :span="5" class="leftTree">
        <s-scrollbar :wrap-style="[{'height':treeScrollHeight + 'px'}]" key="it">
        <div ref="leftTree">
          <s-tree
            :data="leftTree"
            node-key="name"
            :current-node-key="currentTreeNode"
            :default-expand-all="true"
            :expand-on-click-node="false"
            :props="leftTreeProps"
            :highlight-current="true"
            style="width: 100%; margin-right: 10px"
            @node-click="handleNodeClick">
          </s-tree>
        </div>
        </s-scrollbar>
      </s-col>
      <s-col :span="19">
          <s-search-group ref="searchBox" :searchHandler="search" style="margin-bottom: 10px">
            <s-form :inline="true" :model="searchForm" class="demo-form-inline">
              <s-form-item label="资产名称:">
                <s-input @keyup.enter.native="search" v-model="searchForm.itcompName"></s-input>
              </s-form-item>
              <s-form-item label="IP地址:">
                <s-input @keyup.enter.native="search" v-model="searchForm.controlAdderss"></s-input>
              </s-form-item>
            </s-form>
          </s-search-group>
          <s-table-page
            ref="multipleTable"
            :data="assetList"
            max-height="400"
            @selection-change="selectionChange"
            style="width: 100%">
            <s-table-column
              type="selection"
              :selectable="selectable"
              width="45">
            </s-table-column>
            <s-table-column prop="itcompName" label="资产名称">
            </s-table-column>
            <s-table-column prop="controlAdderss" label="IP地址">
            </s-table-column>
            <s-table-column prop="citypeName" label="资产类别" show-overflow-tooltip>
              <template slot-scope="scope">
                {{isAssets ? scope.row.citypeName : scope.row.modelNumber}}
                </template>
            </s-table-column>
          </s-table-page>
         <!-- <s-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="criteria.currentPage"
            :page-size="criteria.pageSize"
            :total="criteria.totalCount"
            layout="total, sizes, prev, pager, next, jumper"
          >
          </s-pagination>-->
      </s-col>
    </s-row>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  // import SearchBox from '@/components/tableCom/src/SearchBox';

  export default {
    data() {
      let citypelist = [
        'dba127755f0940da9ed5907a6423ce92',
        'da6e861c09ac4c3f856daf3b457f9eab',
        '7bac1df36a294c72ab34216168d2b6cf',
        'ec6ba0acb2e84d66beedf1040a05af0d'
      ];
      return {
        dialogFlag: false,
        citypelist: citypelist,
        leftTree: [
        ],
       AutoOpsleftTree: [{
          label: '全部',
          id: 1,
          data: citypelist,
          children: [
            {
              label: 'linux',
              data: [citypelist[0]]
            },
            {
              label: 'solaris',
              data: [citypelist[1]]
            },
            {
              label: 'aix',
              data: [citypelist[2]]
            },
            {
              label: '交换机',
              data: [citypelist[3]]
            }
          ]
        }],
        leftTreeProps: {
          children: 'childrenList',
          label: 'name'
        },
        currentTreeNode: '全部',
        searchForm: {
          itcompName: '',
          controlAdderss: ''
        },
        criteria: { // 根据分页、查询条件查询列表的参数
          condition: {},
          currentPage: 1,
          orderByClause: 'id',
          pageList: null,
          pageSize: 1000,
          totalCount: 0,
          totalPage: 0
        },
        assetList: [],
        selections: [],
        treeScrollHeight: 500,
        isAssets: false,
        citypelistUuid: []
      }
    },
    props: {
      selectedList: {
        type: Array
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      if (this.$route.name === 'autoOps_Polling') {
        this.isAssets = false
      } else {
        this.isAssets = true
      }
      this.$nextTick(() => {
        let nodes = this.$refs.leftTree.querySelectorAll('.s-tree-node');
        nodes.forEach(item => {
          if (item.innerText.indexOf(this.currentTreeNode) !== -1) {
            item.click();
          }
        });
      });
      if (this.$route.path === '/AssetsAll/assets_polling') {
        this.leftTree = this.AutoOpsleftTree
        this.leftTreeProps = {
          children: 'children',
          label: 'label'
        }
        this.treeScrollHeight = '250'
      } else {
        this.getleftTree()
      }
    },
    methods: {
      getleftTree() {
      $axios.get('/resourcemanager/configurationmanage/citype/getCountCitypeTree').then(({data}) => {
       this.leftTree = data
      })
      },
      axiosList(param) { /* 查询的接口 */
        $axios.post('/collectTask/selectCollectTaskObject', param).then(({data}) => {
          this.assetList = data.data.map(item => item.monitorItcomp);
          for (let i in this.criteria) {
              this.criteria[i] = data.criteria[i];
          }
          this.assetList.forEach(item => {
            if (this.selectedList.some(innerItem => innerItem.uuid === item.uuid)) {
              item.disabled = true;
            } else {
              item.disabled = false;
            }
          })
        })
      },
      handleNodeClick (nodeData, node) {
        this.citypelistUuid = []
        let vm = this;
        function recursive(curNode) {
          if (curNode.childNodes.length > 0) {
            curNode.childNodes.forEach(item => {
              vm.citypelistUuid.push(item.data.uuid);
              if (item.childNodes.length > 0) {
                recursive(item);
              }
            });
          } else {
            vm.citypelistUuid.push(curNode.data.uuid);
          }
        }
        this.criteria.currentPage = 1;
        if (this.$route.path === '/AssetsAll/assets_polling') {
          this.criteria.condition = {productList: nodeData.data};
        } else {
          recursive(node);
          this.criteria.condition = {citypelist: this.citypelistUuid};
        }
        this.axiosList(this.criteria);
        this.criteria.pageSize = parseInt(node.label.match(/\d+/g)[0])
      },
      search () {
        this.criteria.currentPage = 1;
        Object.assign(this.criteria.condition, this.searchForm);
        this.axiosList(this.criteria);
      },
      handleSizeChange (val) {
        this.criteria.currentPage = 1;
        let params = Object.assign({}, this.criteria,
        {pageSize: val}
        )
        this.axiosList(params);
      },
      handleCurrentChange (currentPage) {
        this.criteria.currentPage = currentPage;
        this.axiosList(this.criteria);
      },
      selectionChange(selections) {
        this.selections = selections;
      },
      selectable(row) {
        return !row.disabled;
      },
      dialogOk() {
        this.$emit('selected', this.selections);
        this.dialogFlag = false;
      }
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
    },
    components: {
      // SearchBox
    }
  }
</script>

<style lang="stylus">
  .selectAssetDialog
    .selectAssetScrollbar
      max-height: 500px
      padding-right 17px
    .selectAssetContainer
      .filter-list
        display: flex
        justify-content: flex-start
        padding: 10px 0 20px 0

</style>
