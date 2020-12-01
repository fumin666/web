/*
create by YOU
*/
<template>
  <s-scrollbar wrap-class="object-list-wrapper">
    <s-row class="object-list">
      <s-col :span="5" class="filter-list">
        <s-tree
          :data="leftTree"
          node-key="label"
          :current-node-key="currentTreeNode"
          :default-expand-all="true"
          :expand-on-click-node="false"
          :props="leftTreeProps"
          :highlight-current="true"
          style="width: 100%; margin-right: 10px"
          @node-click="handleNodeClick"></s-tree>
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
        <s-table
          ref="multipleTable"
          :data="objectList"
          @selection-change="onSelectionChange"
          style="width: 100%">
          <s-table-column
            type="selection"
            :selectable="selectable"
            width="45">
          </s-table-column>
          <s-table-column
            prop="monitorItcomp.itcompName"
            label="资产名称"
            width="180">
          </s-table-column>
          <s-table-column
            prop="monitorItcomp.controlAdderss"
            label="IP地址"
            width="180">
          </s-table-column>
          <s-table-column
            prop="monitorItcomp.citypeName"
            label="资产类别"
            show-overflow-tooltip>
          </s-table-column>
        </s-table>
        <s-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="sizes, prev, pager, next"
          :total="total">
        </s-pagination>
      </s-col>
    </s-row>
  </s-scrollbar>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  // import SearchBox from '@/components/tableCom/src/SearchBox'
//  let citypeListOptions = ['22e21df197c64bc6b7c6eacc1ee418eb', '848c1f7ebb63462f8fdfe37c296c6e5d', 'b5dd62221aef4cbcaf40b898464b4ad0', 'e8931f6dace24479948ba62120ff29e0']
  let citypeListOptions = ['a5612d471be34ae487e631f567f22a58', '7531c262ad29423698400513e9bdc92a', 'fd1edc72265e4e099479619af7dbcfd7']
  export default {
    components: {
      // SearchBox
    },
    props: {
      selectedObjectList: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data () {
      let modelName = ['路由器', '网络交换机', 'PC服务器']
      return {
        searchForm: {
          itcompName: '',
          controlAdderss: ''
        },
        model: citypeListOptions,
//        modelName: ['windows', 'linux', '交换机', '路由器'],
        leftTree: [
          {
            label: '全部',
            id: 1,
            data: citypeListOptions,
            children: [
              {
                label: modelName[0],
                data: [citypeListOptions[0]]
              },
              {
                label: modelName[1],
                data: [citypeListOptions[1]]
              },
              {
                label: modelName[2],
                data: [citypeListOptions[2]]
              }
            ]
          }
        ],
        currentTreeNode: '全部',
        leftTreeProps: {
          children: 'children',
          label: 'label'
        },
        citypeList: citypeListOptions,
        objectList: [
          {
            monitorItcomp: {}
          }
        ],
        selectList: [],
        currentPage: 1,
        total: 0,
        pageSize: 10
      }
    },
    mounted () {
      this.updateData()
    },
    watch: {
      citypeList () {
        this.updateData()
      },
      selectedObjectList () {
        this.updateData()
      }
    },
    methods: {
      search () {
        this.updateData(this.searchForm)
      },
      updateData (search = {}) {
        let _self = this
        let params = {
          condition: Object.assign({
            citypelist: _self.citypeList.length > 0 ? _self.citypeList : _self.citypeListOptions
          }, search),
          currentPage: _self.currentPage,
          pageSize: _self.pageSize
        }
        $axios.post('/collectTask/selectCollectTaskObject', params).then(function (response) {
          if (response.status === 200) {
            // 更新数据列表
            // _self.selectedObjectList[n].monitorItcomp.uuid === response.data.data[n].monitorItcomp.uuid 从列表删除
            if (_self.selectedObjectList.length > 0) {
              _self.objectList = response.data.data.filter(function (value, key) {
                for (let i = 0; i < _self.selectedObjectList.length; i++) {
                  if (_self.selectedObjectList[i].monitorItcomp.uuid === value.monitorItcomp.uuid) {
                    value.disabled = true
                    break
                  }
                }
                return value
              })
            } else {
              _self.objectList = response.data.data
            }
            _self.total = response.data.criteria.totalCount
            _self.currentPage = response.data.criteria.currentPage
          } else {
          }
        })
      },
      selectable (row, index) {
        if (row.disabled) {
          return false
        } else {
          return true
        }
      },
      onSelectionChange (selection) {
        this.selectList = selection
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.updateData()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.updateData()
      },
      handleNodeClick (nodeData) {
        this.citypeList = nodeData.data
        this.updateData()
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .object-list
    .filter-list
      display: flex
      justify-content: flex-start
      padding: 10px 0 20px 0

  .object-list-wrapper
    height: 500px
</style>
