<!-- 关联关系 -->
<template>
  <div>
    <s-row style="margin-bottom: 10px;" v-if="permission && !assetName">
      <s-button @click="showAddRelation" icon="plus">添加</s-button>
      <s-button @click="relsDel" icon="batch-del">批量删除</s-button>
    </s-row>
    <s-table-page
      max-height="300"
      :data="dataList"
      @selection-change="selectionChange">
      <s-table-column type="selection" width="45" align="center" v-if="!assetName"></s-table-column>
      <s-table-column label="关系类型" prop="data.relation" show-overflow-tooltip></s-table-column>
      <s-table-column label="资产名称" prop="name" show-overflow-tooltip></s-table-column>
      <s-table-column label="类型" prop="data.ciType" ></s-table-column>
      <s-table-column label="IP地址" prop="data.assetIp" ></s-table-column>
      <s-table-column label="操作" width="110" v-if="!assetName">
        <template slot-scope="scope">
          <i class="iconfont icon-delete" @click="rowDel(scope.row)" title="删除"></i>
        </template>
      </s-table-column>
    </s-table-page>

    <!--添加关联关系-->
    <add-dialog
      v-model="addRelationFlag"
      :compId="addAssetUuid"
      :tipNode="{id:addAssetUuid}"
      :isRoot="false"
      :coptions="coptions"
      :relationSelect="relationSelect"
      :configitemdata="configitemdata"
      @selectChange="handleRelationSelectChange"
      @reload="handleCloseDialog"
      @close="handleCloseDialog"
    ></add-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import AddDialog from '@/components/relationgraph/AddRelationDialog'
  export default {
    data() {
      return {
        dataList: [],
        selections: [],
        addRelationFlag: false,
        uuid: '',
        addType: '',
        locked: 1,
        coptions: [],    // 新增对话框的options
        crelation: {}, // 新增对话框中选中的option
        relationSelect: {},
        currentRow: null,
        changePwdTaskLists: [],
        configitemdata: [], // 新增对话框中的列表原始数据
        multipleSelection: [],
        fuzzySearchKeyWord: ''
      }
    },
    props: {
      isOma: {
        type: Boolean,
        default: false
      },
      assetName: {
        type: Boolean,
        default: false
      },
      addAssetUuid: {
        type: String,
        default: ''
      },
      citypeUuid: {
        type: String,
        default: ''
      },
      permission: {   // 表示是否有操作按钮的权限
        type: Boolean,
        default: false
      }
    },
    components: {
      AddDialog
    },
    methods: {
      selectionChange(selections) {
        this.selections = selections;
      },
      handleRelationSelectChange(val) {
        this.crelation = val
      },
      rowDel(row) {
        this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          $axios.post('resourcemanager/configurationmanage/relationtype/removeCmdbCirelatoin/' + row.data.cirelationuuid).then((res) => {
            if (res.data === 'true') {
              this.$message({message: '删除成功', type: 'success'});
              this.getData();
            } else {
              this.$message({showClose: true, message: '删除失败!', type: 'error'});
            }
          })
        }).catch(() => {});
      },
      relsDel() {
        if (this.selections.length > 0) {
          this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
            let delArr = [];
            for (let i in this.selections) {
              let uuid = this.selections[i].data.cirelationuuid;
              delArr.push(uuid);
            }
            $axios.post('resourcemanager/configurationmanage/relationtype/removeCmdbCirelatoinList/', delArr).then((res) => {
              if (res.data === 'true') {
                this.$message({message: '删除成功', type: 'success'});
                this.getData();
              } else {
                this.$message({message: '删除失败!', type: 'error'});
              }
            })
          }).catch(() => {});
        } else {
          this.$message({message: '请至少选择一项关联关系!', type: 'warning'});
        }
      },
      showAddRelation() {
        if (this.addAssetUuid === '') {
          this.$message({showClose: true, message: '请先正确填写资产信息', type: 'warning'});
          return
        }
        this.handlerAdd();
      },
      getData() {
        $axios.post('resourcemanager/configurationmanage/relationtype/getCirelationMap/' + this.uuid + '/root').then((res) => {
          this.dataList = res.data[this.uuid];
        })
      },
      handlerAdd() {
        $axios.post('/resourcemanager/configurationmanage/relationtype/getcitypeRelationtype/' + this.addType).then(({data}) => {
//          if (data.length > 0) {
          this.addRelationFlag = true;
          this.coptions = data || [];
          this.crelation = this.coptions[0];
//          } else {
//            this.$message({
//              type: 'info',
//              message: '该配置项没有可以添加的关系'
//            });
//          }
        });
      },
      handleCloseDialog() {
        this.getData()
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      handleSelectionChange(selections) {
        this.multipleSelection = selections;
      },
      fuzzySearch() {
        let result = []
        let filterKeys = ['ciname'];
        if (!this.fuzzySearchKeyWord.trim()) {
          this.changePwdTaskLists = this.configitemdata
          return
        }
        for (let i = 0; i < this.configitemdata.length; i++) {
          for (let key in this.configitemdata[i]) {
            if (filterKeys.indexOf(key) !== -1 && this.configitemdata[i][key] !== null) {
              if (this.configitemdata[i][key].toString().indexOf(this.fuzzySearchKeyWord.toString()) !== -1) {
                result.push(this.configitemdata[i])
                break
              }
            }
          }
        }
        this.changePwdTaskLists = result
      }
    },
    created() {
      if (this.$route.name === 'assetsManage_omaAssetStatistics') {
        this.addType = this.citypeUuid;
        this.uuid = this.addAssetUuid;
        this.getData();
      }
      if (this.$route.name === 'AssetsAll_assetAdd') {
        let {query} = this.$route;
        this.addType = query.addType[query.addType.length - 1];
        this.uuid = this.addAssetUuid;
      }
      if (this.$route.name === 'AssetsAll_assetEdit' || this.$route.name === 'AssetsAll_assetDetail') {
        this.uuid = this.$route.params.assetUuid;
        this.addType = this.citypeUuid;
        this.getData();
      }
    },
    watch: {
      crelation: {
        deep: true,
        handler(val) {
          $axios.post(`/resourcemanager/configurationmanage/relationtype/getcmdbCilist/${val.relCitypeuuid}/${val.relationTypeUuid}/${this.addAssetUuid}`).then(({data}) => {
            this.configitemdata = data;
            this.changePwdTaskLists = data;
            this.relationSelect = val;
            if (this.relationSelect.relationDefine === null) {
              this.relationSelect.relationDefine = '0';
            }
          });
        }
      }
    }
  }
</script>

<style lang="stylus">

</style>
