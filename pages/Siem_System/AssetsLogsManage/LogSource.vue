/**
* Created by alex on 2019/2/18.
*/
<template>
  <div class="assetList" id="assetsList">
    <s-row :gutter="15" type="flex" justify="center">
      <s-col :span="4">
        <div class="leftChunk">
          <s-scrollbar :wrap-style="[{'height':'calc(100vh - 313px)px'}]" key="it" ref="treeScrollbar">
            <div ref="menuTree">
              <s-tree
                id="itAssetsTree"
                :data="itTreeData"
                :props="defaultProps"
                @node-click="handleNodeClick"
                :highlight-current="true"
                :default-expand-all="true"
                :default-expanded-keys="defaultExpandKeys"
                node-key="uuid"
                :current-node-key="currentLeftTreeUuid"
                :render-content="renderContent"
                :expand-on-click-node="false"
              ></s-tree>
            </div>
          </s-scrollbar>
        </div>
      </s-col>
      <s-col :span="20">
        <div class="listChunk">
          <s-row style="margin-bottom:10px;">
            <s-form :inline="true" :model="searchForm" class="search_form" label-width="65px">
              <div>
                <s-form-item label="资产类型:">
                  <input-tree v-model="searchForm.citypeuuid" name="uuid" :data="searchOptionsform"
                              :props="defaultProps" :hasDelIcon="true" @select-change="inputTreeChange"></input-tree>
                </s-form-item>
                <s-form-item label="IP地址:">
                  <s-input @keyup.enter.native="listSearch" v-model="searchForm.controlAdderss"></s-input>
                </s-form-item>
                <s-form-item label="资产名称:">
                  <s-input @keyup.enter.native="listSearch" v-model="searchForm.itcompName"></s-input>
                </s-form-item>
                <s-form-item label="采集方式:">
                  <s-select v-model="searchForm.collectType" style="width:165px;">
                    <s-option label="请选择" value=""></s-option>
                    <s-option label="syslog" :value="1"></s-option>
                    <s-option label="trap" :value="2"></s-option>
                    <s-option label="ftp" :value="3"></s-option>
                  </s-select>
                </s-form-item>
              </div>
              <div class="search_btn">
                <s-button icon="magnifier" @click="listSearch">查询</s-button>
              </div>
            </s-form>
          </s-row>
          <s-row class="searchBtChunk">
            <s-col class="left">
              <s-button icon="export" @click="batchEditHandler">批量编辑</s-button>
              <s-button icon="start" @click="batchCloseHandler">批量关闭日志审计</s-button>
            </s-col>
          </s-row>
          <s-table-page
            :data="assetList"
            @selection-change="selectionChange"
            ref="assetListTable"
          >
            <s-table-column type="selection" width="45" align="center"></s-table-column>
            <s-table-column prop="itcompName" label="资产名称">
              <template slot-scope="scope">
                <!-- <a @click="goDetail(scope.row)" class="checkDetail" href="javascript:;">{{ scope.row.itcompName }}</a> -->
                <span>{{ scope.row.itcompName }}</span>
              </template>
            </s-table-column>
            <s-table-column prop="controlAdderss" label="IP地址"></s-table-column>
            <s-table-column prop="citypeName" label="资产类型"></s-table-column>
            <s-table-column prop="appTypeName" label="应用类别">
              <template slot-scope="scope">
                {{ scope.row.appTypeName || '-'}}
              </template>
            </s-table-column>
            <s-table-column prop="collectType" label="采集方式" :formatter="collectStatus"></s-table-column>
            <s-table-column prop="logLevelStr" label="日志接收级别"></s-table-column>
            <s-table-column prop="isOpen" label="状态">
              <template slot-scope="scope">
                <s-switch v-model="scope.row['isOpen']" size="small" :active-value="1" :inactive-value="0" @change="closeMonitor([scope.row.uuid])"></s-switch>
              </template>
            </s-table-column>
            <s-table-column prop="remark" label="备注"></s-table-column>
            <s-table-column label="操作" width="250" align="center">
              <template slot-scope="scope">
                <i class="iconfont icon-eye" @click="viewConfigBase(scope.row)" title="查看"></i>
                <i class="iconfont icon-info" @click="goDetail(scope.row)" title="查看资产详情"></i>
                <i class="iconfont icon-edit" @click="rowEdit(scope.row)" title="编辑"></i>
              </template>
            </s-table-column>
          </s-table-page>
        </div>
      </s-col>
    </s-row>
    <!--查看-->
    <s-dialog
      v-model="viewDialog"
      v-if="viewDialog"
      title="查看">
      <view-dialog :data="viewRow"></view-dialog>
    </s-dialog>
    <!--编辑-->
    <s-dialog
      v-model="editDialog"
      v-if="editDialog"
      width="600px"
      title="编辑">
      <edit-dialog ref="editDialogComponent" :editData="editData"></edit-dialog>
      <template slot="footer">
        <s-button @click="editSave">保存</s-button>
        <s-button type="cancel" @click="editDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--批量编辑-->
    <s-dialog
      v-model="batchEditDialog"
      v-if="batchEditDialog"
      width="600px"
      title="批量编辑">
      <batch-edit ref="batchComponent"></batch-edit>
      <template slot="footer">
        <s-button @click="batchSave">保存</s-button>
        <s-button type="cancel" @click="batchEditDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import inputTree from '@/components/inputTree/InputTree';
  import {cloneDeep} from 'lodash';

  import viewDialog from './components/ViewSource'
  import editDialog from './components/EditSource'
  import batchEdit from './components/BatchEditSource'

  export default {
    data() {
      return {
        data: [],
        activeTab: 0,
        itTreeData: [],
        currentLeftTreeUuid: '',
        defaultExpandKeys: [],
        searchOptions: [],
        searchOptionsform: [],
        defaultProps: {
          children: 'childrenList',
          label: 'name'
        },
        addType: [],
        listHead: [],
        listAllHead: [],
        assetList: [],
        selections: [],
        searchForm: {
          citypelist: [],
          citypeuuid: '',
          controlAdderss: '',
          itcompName: ''
        },
        treeForm: {
//          categoryuuid: '',
          citypeuuid: '',
          citypelist: [],
          location: ''
        },
        criteria: { // 根据分页、查询条件查询列表的参数
          condition: {
            citypelist: [],
            citypeuuid: '',
            controlAdderss: '',
            itcompName: ''
          }
        },
        authoriseAssets: [],         // 批量快速授权资产uuids
        curUuid: '',
        auditAssets: [],
        checkResult: {},
        tableHeight: 500,
        treeScrollHeight: 500,
        viewRow: '',
        viewDialog: false,
        editDialog: false,
        batchEditDialog: false,
        editData: ''
      }
    },
    computed: {
      addOptions() {
        return this.circleGetOptions(this.searchOptions);
      }
    },
    created() {
      // 获取IT资产树
      this.axiosAssetItTree();
    },
    mounted() {
      this.axiosAssetList()
    },
    methods: {
      collectStatus(item) {
        const arr = ['syslog', 'trap', 'ftp']
        return arr[item.collectType - 1]
      },
      goDetail(row) {
        this.$router.push({name: 'AssetsAll_assets_logAudit_assetDetail', params: { assetUuid: row.itcompUuid }});
      },
      doLayout() {
        this.$nextTick(() => {
          let totalHeihgt = document.body.offsetHeight;
          let headHeight = document.querySelector('#headBar').offsetHeight;
          let footHeight = document.querySelector('.s-footer').offsetHeight;
          let bodyHeight = totalHeihgt - headHeight - footHeight;
          // 17是因为scrollbar的marginbottom, 后一个20是距离footer的距离
          this.treeScrollHeight = bodyHeight - 20 - 35 - 15 - 20 + 17;
          let searchBoxHeight = document.querySelector('.assetList .searchBtChunk').offsetHeight + 8;
          searchBoxHeight += document.querySelector('.assetList .searchFormChunk').offsetHeight + 8;
          let pageHeight = document.querySelector('.assetList .pageRow').offsetHeight + 8;
          // 1好像是table的border,clientTop为1
          this.tableHeight = bodyHeight - 20 - searchBoxHeight - pageHeight - 20 - 1;
        });
      },
      handleNodeClick(nodeData, node, nodeVM) {
        this.reset();
        this.currentLeftTreeUuid = nodeData.uuid; // 保证tree刷新后高亮
        let vm = this;
        function recursive(curNode) {
          if (curNode.childNodes.length > 0) {
            curNode.childNodes.forEach(item => {
              vm.treeForm.citypelist.push(item.data.uuid);
              if (item.childNodes.length > 0) {
                recursive(item);
              }
            });
          } else {
            vm.treeForm.citypelist.push(curNode.data.uuid);
          }
        }

        if (node.level !== 1) { // 如果不是最外层的节点
//          vm.treeForm.categoryuuid = '';
          vm.treeForm.citypeuuid = nodeData.uuid;
          vm.treeForm.citypelist.push(node.data.uuid);
        } else {
//          vm.treeForm.categoryuuid = nodeData.uuid;
          vm.treeForm.citypeuuid = '';
        }
        recursive(node);
        this.criteria.condition = Object.assign({}, this.treeForm);
        this.axiosAssetList();
      },
      renderContent(h, {node}) {
        let arr = [];
        let img = '';
        if (node.level !== 1) {
          if (node.data.node.icon) {
            arr = node.data.node.icon.split('/')
            img = '../../static/images/asseticon/' + arr[arr.length - 1]
          } else {
            img = '../../static/images/asseticon/files.png'
          }
        } else {
          img = '../../static/images/asseticon/files.png'
        }
        return (<span><span style="vertical-align: middle;"><img style = "margin-right: 4px" src = {img} ></img> </span><span style = "font-size:14px" > {node.label}</span ></span>);
      },
      reset() {
        for (let i in this.searchForm) {
          if (i === 'citypelist') {
            this.searchForm[i] = [];
          } else {
            this.searchForm[i] = '';
          }
        }
        for (let i in this.treeForm) {
          if (i === 'citypelist') {
            this.treeForm[i] = [];
          } else {
            this.treeForm[i] = '';
          }
        }
      },
      delNum(arr) {
        arr.forEach(item => {
          let nameArr = item['name'].split('(')
          item.name = nameArr[0]
          if (item.childrenList !== undefined && item.childrenList.length > 0) {
            this.delNum(item.childrenList)
          }
        })
        return arr
      },
      axiosAssetItTree(callback = function () {}) {
        $axios.get('/syslogAuditSetting/getSyslogCountTree').then(({data}) => {
          let currentData = cloneDeep(data)
          this.itTreeData = data;
          this.searchOptions = data
          this.searchOptionsform = this.delNum(currentData)
          this.defaultExpandKeys = this.itTreeData.map(item => {
            return item.uuid;
          });
          callback();
        });
      },
      selectItTree() {
        this.$nextTick(() => {
          let nodes = this.$refs.menuTree.querySelectorAll('.s-tree-node');
          nodes.forEach(item => {
            // 修改因为节点名称有相同字符串从编辑页跳转回来后定位错误的问题 - clx
            if (item.innerText.replace(/\s/g, '').split('(')[0] === name) {
              item.click();
              let scrollWrap = this.$refs.treeScrollbar.$refs.wrap;
              if (item.offsetTop > scrollWrap.clientHeight) {
                scrollWrap.scrollTop = item.offsetTop - scrollWrap.clientHeight + 36 + scrollWrap.clientHeight / 2;
              }
            }
          });
        });
      },
      axiosAssetList(callback = () => {}) {
        let param = cloneDeep(this.criteria);
        for (let i in param.condition) {
          if (param.condition[i] === null || param.condition[i] === '' || param.condition[i].length === 0) {
            delete param.condition[i];
          }
        }
        $axios.post('/syslogAuditSetting/getLogSourceList', param).then(({data}) => {
          this.assetList = data;
          callback();
        });
      },
      inputTreeChange(nodeData) {
        this.searchForm.citypelist = [nodeData.uuid];
        let _VM = this;
        function recursive(nodeData) {
          if (nodeData.childrenList.length > 0) {
            nodeData.childrenList.forEach(item => {
              _VM.searchForm.citypelist.push(item.uuid);
              if (item.childrenList.length > 0) {
                recursive(item);
              }
            });
          } else {
            this.treeForm.citypelist.push(nodeData.uuid);
          }
        }
        recursive(nodeData);
//        nodeData[this.defaultProps.children].forEach(item => {
//          this.searchForm.citypelist.push(item.uuid);
//        });
      },
      selectionChange(selections) {
        this.selections = selections;
      },
      listSearch () {
        if (this.searchForm.citypeuuid === '' || this.searchForm.citypeuuid === null) {
          this.searchForm.citypelist = [];
        }
        this.criteria.condition = Object.assign({}, this.criteria.condition, this.searchForm);
        this.axiosAssetList();
      },
      // 顶部按钮-----------------------------------------------------------------------------------
      batchEditHandler() {
        if (this.selections.length === 0) {
          this.$message.error('至少选中一个')
        } else {
          this.batchEditDialog = true
        }
      },
      batchCloseHandler() {
        if (this.selections.length === 0) {
          this.$message.error('至少选中一个')
        } else {
          let uuids = this.selections.map(item => (item.uuid))
          this.closeMonitor(uuids)
        }
      },
      closeMonitor(uuids) {
        let obj = {
          data: this.selections,
          logTemplate: '关闭日志审计|日志审计配置>日志源配置>日志源(#controlAdderss#/#itcompName#)'
        }
        $axios.post('/syslogAuditSetting/batchCloseAudit', uuids, obj).then((res) => {
          if (res.data.state) {
            this.$message.success(res.data.errormsg);
            this.axiosAssetList();
            this.axiosAssetItTree();
          } else {
            this.$message.error(res.data.errormsg);
          }
        })
      },
      batchSave() {
        let uuids = this.selections.map(item => (item.uuid))
        let form = cloneDeep(this.$refs['batchComponent'].form)
        if (form.logLevel.length > 0) {
          form.logLevel = form.logLevel.join('|')
        }
        form.uuidList = uuids
        this.$refs['batchComponent'].$refs['formRef'].validate(valid => {
          if (!valid) {
            return false;
          }
          let obj = {
            data: this.selections,
            logTemplate: '编辑|日志审计配置>日志源配置>日志源(#controlAdderss#/#itcompName#)'
          }
          $axios.post('/syslogAuditSetting/batchEditLogSource', form, obj).then((res) => {
            if (res.data.state) {
              this.$message.success(res.data.errormsg);
              this.axiosAssetList();
              this.batchEditDialog = false
            } else {
              this.$message.error(res.data.errormsg);
            }
          })
        })
      },
      // 行内图标按钮操作
      viewConfigBase(row) {
        this.viewRow = row
        this.viewDialog = true
      },
      rowEdit(rowData) {
        this.editData = rowData
        this.editDialog = true
      },
      editSave() {
        let form = cloneDeep(this.$refs['editDialogComponent'].form)
        if (form.logLevel.length > 0) {
          form.logLevel = form.logLevel.join('|')
        }
        this.$refs['editDialogComponent'].$refs['formRef'].validate(valid => {
          if (!valid) {
            return false;
          }
          let obj = {
            data: [this.editData],
            logTemplate: '编辑日志审计|日志审计配置>日志源配置>日志源(#controlAdderss#/#itcompName#)'
          }
          $axios.post('/syslogAuditSetting/editLogSource', form, obj).then((res) => {
            if (res.data.state) {
              this.$message.success(res.data.errormsg);
              this.axiosAssetList();
              this.editDialog = false
            } else {
              this.$message.error(res.data.errormsg);
            }
          })
        })
      },
      gotoAssetDetail(row) {
        this.$router.push(`assets_list/assetDetail/${row.uuid}`);
      },
      circleGetOptions(arr) {
        return arr.map(item => {
          let obj = {
            value: item.uuid,
            label: item.name
          };
          if (item.childrenList && item.childrenList.length > 0) {
            obj.children = this.circleGetOptions(item.childrenList)
          }
          return obj;
        })
      }
    },
    components: {
      inputTree,

      viewDialog,
      editDialog,
      batchEdit
    }
  }
</script>

<style lang="stylus">
  .assetList
    .listChunk .s-table span.ip
        cursor pointer
    #addTypeCascader
      visibility hidden
      position absolute
      left 80px
      top 2px
</style>

