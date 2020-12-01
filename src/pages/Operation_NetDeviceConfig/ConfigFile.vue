<!--
 * @Description: 配置文件管理
 * @Author: songyf
 * @Date: 2020-4-14
 * @LastEditTime : 2020-4-14
 * @LastEditors  : LaMando
 -->
<template>
  <div class="config-file">
    <s-row :gutter="10">
      <s-col span="4" class="left-menu-box">
        <s-scrollbar wrap-style="maxHeight:calc(100vh - 200px);">
          <s-tree
            ref="tree"
            prefixIcon="circle"
            :data="treeData"
            :showLine="true"
            id="itAssetsTree"
            :props="defaultProps"
            :highlight-current="true"
            :current-node-key="currentNodeValue"
            node-key="uuid"
            @node-click="handleNodeClick"
            :expand-on-click-node="false"
            :default-expand-all="true"
            :default-expanded-keys="[currentNodeValue]"
            :render-content="renderContent">
          </s-tree>
        </s-scrollbar>
      </s-col>
      <s-col span="20">
        <s-form :inline="true" :model="searchForm" class="search_form" style="margin:0px 0 10px 0" label-width='80px'>
          <div>
            <s-form-item label="资产名称：">
              <s-input v-model="searchForm.itcompName" placeholider="请输入" @keyup.enter.native="getList"></s-input>
            </s-form-item>

            <s-form-item label="厂商：">
              <s-select v-model="searchForm.manufactUuid" filterable clearable>
                <s-option v-for = "item in manufactList" :label="item.caption"
                          :value="item.uuid" :key="item.uuid"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="型号：">
              <s-select v-model="searchForm.productUuid" filterable clearable>
                <s-option v-for = "item in productList" :label="item.caption"
                          :value="item.uuid" :key="item.uuid"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="IP地址：">
              <s-input v-model="searchForm.controlAdderss" placeholider="请输入" @keyup.enter.native="getList"></s-input>
            </s-form-item>
          </div>
          <div class="search_btn">
            <s-button icon='magnifier' @click="getList">查询</s-button>
          </div>
        </s-form>
        <RealPageTable
          class="config-file-table"
          :ajax-obj="ajaxObj">
          <s-table-column prop="itcompName" label="资产名称" show-overflow-tooltip>
          </s-table-column>
          <s-table-column prop="controlAdderss" label="IP地址" show-overflow-tooltip>
          </s-table-column>
          <s-table-column prop="citypeName" label="资产类型" show-overflow-tooltip>
          </s-table-column>
          <s-table-column prop="itManufacturer" label="厂商" show-overflow-tooltip>
          </s-table-column>
          <s-table-column prop="productName" label="型号" show-overflow-tooltip>
          </s-table-column>
          <s-table-column prop="executeEndTime" label="关联协议与登录账号" show-overflow-tooltip>
            <template slot-scope="scope">
              <s-select v-model="scope.row.accountPortRelUuid" class="table-select" filterable clearable @change="changeAssociated(scope.row)">
                <s-option
                  v-for="item in scope.row.protocolAccountList"
                  :key="item.accountPortRelUuid"
                  :label="item.protocolName +'.' + item.port + '(' +item.accountName + ')'"
                  :value="item.accountPortRelUuid">
                </s-option>
              </s-select>
            </template>
          </s-table-column>
          <s-table-column prop="executeEndTime" label="授权账号" show-overflow-tooltip>
            <template slot-scope="scope">
              <s-select v-model="scope.row.authAccountUuid" class="table-select" filterable clearable @change="changeAuth(scope.row)">
                <s-option
                  v-for="item in scope.row.authorizeAccountList"
                  :key="item.accountUuid"
                  :label="item.accountName"
                  :value="item.accountUuid">
                </s-option>
              </s-select>
            </template>
          </s-table-column>
          <s-table-column prop="lastRsultStr" label="上一次备份结果" show-overflow-tooltip>
          </s-table-column>
          <s-table-column label="操作" fixed="right" width="180">
            <template slot-scope="scope">
              <i class="iconfont icon-backup" title="配置备份" @click="configBackup(scope.row)"></i>
              <i class="iconfont icon-back-square" title="配置回退" @click="configBack(scope.row)"></i>
              <i class="iconfont icon-config-audit" title="查看基线" @click="viewBaseline(scope.row)"></i>
              <i class="iconfont icon-file" title="备份详情" @click="backupDetails(scope.row)"></i>
            </template>
          </s-table-column>
        </RealPageTable>
      </s-col>
    </s-row>
    <!--配置回退-->
    <config-back v-if="configBackFlag" v-model="configBackFlag" :backUpList="backUpList"></config-back>
    <!--查看基线-->
    <view-baseline v-if="viewBaselineFlag" v-model="viewBaselineFlag" :baselineData="baselineData" :viewType="viewType"></view-baseline>
    <!--备份详情-->
    <backup-details v-if="backupDetailsFlag" v-model="backupDetailsFlag" :rowData="rowData"></backup-details>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { cloneDeep } from 'lodash';
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  import configBack from './ConfigFileDialog/ConfigBack'
  import viewBaseline from './ConfigFileDialog/ViewBaseline'
  import backupDetails from './ConfigFileDialog/BackupDetails'

  export default {
    components: {
      RealPageTable,
      configBack,
      viewBaseline,
      backupDetails
    },
    data() {
      return {
        configBackFlag: false,
        viewBaselineFlag: false,
        backupDetailsFlag: false,
        treeData: [],
        currentNodeValue: '',
        defaultProps: {
          children: 'childrenList',
          label: 'name'
        },
        citypeUuid: '',
        manufactList: [],
        productList: [],
        searchForm: {
          itcompName: '',
          manufactUuid: '',
          productUuid: '',
          controlAdderss: ''
        },
        ajaxObj: {
          type: 'post',
          url: '/netConfigManage/getNetItcompList',
          params: {
            condition: {
            }
          }
        },
        rowData: null,
        backUpList: [], // 配置回退下拉列表
        baselineData: null, // 基线内容
        viewType: 1 // 1 基线 2 历史
      }
    },
    watch: {
      'searchForm.manufactUuid': {
        deep: true,
        handler: function (val) {
          if (!val) {
            this.searchForm.productUuid = '';
            this.productList = []
          } else {
            this.getProductByManufact()
          }
        }
      }
    },
    created() {
      this.getTreeData();
      this.getAllManufact();
      this.$nextTick(() => {
        this.getList();
      })
    },
    methods: {
      // 左侧树
      getTreeData() {
        $axios.get('/netConfigManage/getNetCitypeTree').then((res) => {
          this.treeData = res.data;
          this.currentNodeValue = res.data[0].uuid;
          this.$nextTick(function () {
            this.$refs.tree.setCurrentNode(this.treeData[0])
          });
          // this.getTableList(res.data[0].uuid)
        });
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
        return (<span><span style="vertical-align: middle;"><img style="margin-right: 4px" src={img} ></img> </span><span style="font-size:14px" title={ node.label }> {node.label}</span ></span>);
      },
      // 树节点点击
      handleNodeClick(node) {
        this.citypeUuid = node.uuid
        this.getList()
      },
      getList() {
        let params = cloneDeep(this.searchForm)
        params.citypeUuid = this.citypeUuid
        this.ajaxObj.params.condition = params
      },
      getAllManufact() {
        $axios.get('/netConfigManage/getAllManufact').then(({data}) => {
          this.manufactList = data || [];
        })
      },
      getProductByManufact() {
        $axios.get(`/netConfigManage/getProductByManufact/${this.searchForm.manufactUuid}`).then(({data}) => {
          this.productList = data || [];
        })
      },
      changeAssociated(row) {
        if (row.authorizeAccountList) {
          let params = {
            accountPortRelUuid: row.accountPortRelUuid === '' ? null : row.accountPortRelUuid,
            itcompUuid: row.uuid
          };
          $axios.post(`/netConfigManage/uptProtocolAccountRel`, params).then(({data}) => {
            if (data.state) {
              this.$message({type: 'success', message: data.errormsg});
            } else {
              this.$message({type: 'error', message: data.errormsg});
            }
          })
        }
      },
      changeAuth(row) {
        if (row.protocolAccountList) {
          let params = {
            accountUuid: row.authAccountUuid === '' ? null : row.authAccountUuid,
            itcompUuid: row.uuid
          };
          $axios.post(`/netConfigManage/uptAuthorizeAccountRel`, params).then(({data}) => {
            if (data.state) {
              this.$message({type: 'success', message: data.errormsg});
            } else {
              this.$message({type: 'error', message: data.errormsg});
            }
          })
        }
      },
      configBackup(row) {
        if (row.accountPortRelUuid !== null) {
          $axios.get(`/netConfigManage/netWorkBackUp/${row.uuid}`).then(({data}) => {
            if (data.state) {
              this.$message({type: 'success', message: data.errormsg});
            } else {
              this.$message({type: 'error', message: data.errormsg});
            }
          })
        } else {
          this.$message({type: 'warning', message: '未关联协议与登录账号，会导致备份失败，请先关联协议与授权账号'});
        }
      },
      configBack(row) {
        $axios.get(`/netConfigManage/getBackUpListByItcomp/${row.uuid}`).then(({data}) => {
          if (data.length !== 0) {
            this.backUpList = data
            this.configBackFlag = true
          } else {
            this.$message({type: 'warning', message: '当前无备份文件，无法进行回退！'});
          }
        })
      },
      viewBaseline(row) {
        $axios.get(`/netConfigManage/getBaseBackUpInfo/${row.uuid}`).then(({data}) => {
          if (data.fileContent !== null) {
            this.baselineData = data
            this.viewBaselineFlag = true
          } else {
            this.$message({type: 'warning', message: '此设备当前无基线文件，请先进行配置备份或在备份详情中进行设置！'});
          }
        })
      },
      backupDetails(row) {
        this.rowData = row
        this.backupDetailsFlag = true
      }
    }
  }
</script>
<style lang="stylus">
.config-file
  .config-file-table
    .table-select
      & .iconfont
        font-size 14px
        margin-right 0
</style>
