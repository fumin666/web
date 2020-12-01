<template>
  <div class="service-level-agreement" @click="cleanDir">
    <s-row :gutter="15">
      <s-col :span="4" class="sidebar">
        <div class="sla-title" @click="switchMenu(0)" style="cursor:pointer;" title="点击返回控制台">
          <span class="sla-title-text">服务级别协议SLA</span>
        </div>
        <div class="leftMenu">
          <div class="title">-- 功能菜单 --</div>
          <div class="leftMenu-item">
            <s-button @click="globalSetDialog=true" icon="click">全局设置</s-button>
          </div>
          <div class="leftMenu-item">
            <s-button @click="switchMenu(1)" icon="asset-expired" title="点击切换服务时间配置">服务时间配置</s-button>
          </div>
          <div class="leftMenu-item">
            <s-button @click="switchMenu(2)" icon="aim" title="点击切换结果抽查">结果抽查</s-button>
          </div>
        </div>
        <s-tab>
          <i class="iconfont icon-plus slaplus" @click="dirAdd()" @click.stop title="新建文件夹"></i>
          <s-tab-pane label="文件夹">
            <s-scrollbar :wrap-style="[{'height':treeScrollHeight + 'px'}]" key="it" ref="treeScrollbar">
              <div ref="menuTree">
                <s-tree id="itilSlaTree" ref="itilSlaTree" :data="leftTree" :props="defaultProps" :highlight-current="true" node-key="uuid" default-expand-all :current-node-key="currentLeftTreeUuid" @node-click="handleNodeClick" @check-change="handleNodecheck" :expand-on-click-node="false">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span style="vertical-align: middle;">
                      <img style="margin-right: 4px" src="../../../../static/images/asseticon/files.png" />
                    </span>
                    <span style="font-size:14px"> {{node.label}}</span>
                    <span style="float:right;">
                      <s-button size="mini" @click="() => dirEdit(data)" icon="edit" title="编辑">
                      </s-button>
                      <s-button size="mini" @click="() => dirDel(data)" icon="delete" title="删除">
                      </s-button>
                    </span>
                  </span>
                </s-tree>
              </div>
            </s-scrollbar>
          </s-tab-pane>
        </s-tab>
      </s-col>
      <s-col :span="20" style="position:relative;">
        <s-button v-if="menuActive!==0" @click="menuActive=0" icon="arrow-left" style="position:absolute;right: 20px;z-index:100"></s-button>
        <!--<s-scrollbar :wrap-style="'height:' + serverTimeScrollbarHeight + 'px;'">-->
          <div class="listChunk" v-if="menuActive === 0">
            <s-row class="list-top-btn">
              <s-col :span="22">
                <s-button @click="add" icon="plus">添加</s-button>
                <s-button @click="batchDel" icon="batch-del">批量删除</s-button>
              </s-col>
            </s-row>
            <s-form ref="searchBox" :inline="true" :model="criteria.condition" label-width="80px" class="search_form searchFormChunk" style="margin: 10px 0;">
              <div>
                <s-form-item label="所属流程:">
                  <s-select v-model="criteria.condition.itilType" clearable placeholder="请选择">
                    <s-option :label="'事件'" :value="0"></s-option>
                    <s-option :label="'服务请求'" :value="6"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="目标类型:">
                  <s-select v-model="criteria.condition.slaTargetType" clearable placeholder="请选择">
                    <s-option :label="'事件响应'" :value="1" v-if="criteria.condition.itilType === 0"></s-option>
                    <s-option :label="'事件解决'" :value="2" v-if="criteria.condition.itilType === 0"></s-option>
                    <s-option :label="'服务请求响应'" :value="3" v-if="criteria.condition.itilType === 6"></s-option>
                    <s-option :label="'服务请求解决'" :value="4" v-if="criteria.condition.itilType === 6"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="标题:">
                  <s-input @keyup.enter.native="listSearch" v-model="criteria.condition.slaTitle"></s-input>
                </s-form-item>
              </div>
              <div class="search_btn">
                <s-button icon="magnifier" title="查询" @click="listSearch()">查询</s-button>
              </div>
            </s-form>
            <s-table-page :data="serviceTargetList"
                        :height="tableHeight"
                        border
                        style="width:100%;"
                        :init-page-size="20"
                        @selection-change="selectionChange"
                        ref="serviceTargetListTable"
                        v-loading="loading">
              <s-table-column type="selection" width="45" align="center"></s-table-column>
              <s-table-column label="标题" prop="slaTitle"></s-table-column>
              <s-table-column label="ID" prop="slaCode"></s-table-column>
              <s-table-column label="所属流程" prop="itilType">
                <template slot-scope="scope">
                  <span v-if="scope.row['itilType'] === 0">事件</span>
                  <span v-if="scope.row['itilType'] === 6">服务请求</span>
                </template>
              </s-table-column>
              <s-table-column label="目标类型" prop="slaTargetType">
                <template slot-scope="scope">
                  <span v-if="scope.row['slaTargetType'] === 1">事件响应</span>
                  <span v-if="scope.row['slaTargetType'] === 2">事件解决</span>
                  <span v-if="scope.row['slaTargetType'] === 3">服务请求响应</span>
                  <span v-if="scope.row['slaTargetType'] === 4">服务请求解决</span>
                </template>
              </s-table-column>
              <s-table-column label="文件夹" prop="categoryName">
                <template slot-scope="scope">
                  <span>{{scope.row['categoryName']||'无'}}</span>
                </template>
              </s-table-column>
              <s-table-column label="状态" prop="slaStatus" show-overflow-tooltip>
                <template slot-scope="scope">
                  <s-switch v-model="scope.row['slaStatus']" size="small" :active-value="1" :inactive-value="0" @change="slaStatusEnable(scope.row)"></s-switch>
                </template>
              </s-table-column>
              <s-table-column label="操作" width="250" align="center">
                <template slot-scope="scope">
                  <i class="iconfont icon-eye" @click="rowSee(scope.row)" title="查看"></i>
                  <i class="iconfont icon-edit" @click="rowEdit(scope.row)" title="编辑"></i>
                  <i class="iconfont icon-delete" @click="rowDel(scope.row)" title="删除"></i>
                </template>
              </s-table-column>
            </s-table-page>
          </div>
          <SlaServiceTimeSet v-if="menuActive === 1"></SlaServiceTimeSet>
          <SlaResultsSpotCheck v-if="menuActive === 2"></SlaResultsSpotCheck>
        <!--</s-scrollbar>-->
      </s-col>
    </s-row>
    <SlaAddServiceTargetDialog v-if="addServiceTargetDialogFlag" :leftTree="leftTree" v-model="addServiceTargetDialogFlag" :list="serviceTargetList" :isSee="serviceTargetIsSee" :row="serviceTargetCurRow" @reload="serviceTargetReload"></SlaAddServiceTargetDialog>
    <SlaAddDirDialog v-if="addDirDialogFlag" v-model="addDirDialogFlag" :row="dirCurRow" :isEdit="isEditDir" @reload="axiosLeftTree"></SlaAddDirDialog>
    <SlaGlobalSetDialog v-if="globalSetDialog" v-model="globalSetDialog"></SlaGlobalSetDialog>
  </div>
</template>

<script>
import $axios from 'sunflower-ajax';
import SlaAddDirDialog from '../dialog/SlaAddDirDialog';
import SlaAddServiceTargetDialog from '../dialog/SlaAddServiceTargetDialog';
import SlaGlobalSetDialog from '../dialog/SlaGlobalSetDialog';
import SlaResultsSpotCheck from '@/pages/Process_ServiceLevelAgreement/components/SlaResultsSpotCheck'
import SlaServiceTimeSet from '@/pages/Process_ServiceLevelAgreement/components/SlaServiceTimeSet'

export default {
  data() {
    return {
      menuActive: 0,
      curRow: {},
      tableHeight: 500,
      selections: [],
      criteria: { // 根据分页、查询条件查询列表的参数
        condition: {
          itilType: null,
          slaTargetType: null,
          slaTitle: null
        },
        currentPage: 1,
        pageSize: 20,
        totalCount: 0
      },
      // 左侧文件夹
      addDirDialogFlag: false,
      treeScrollHeight: 0,
      leftTree: [],
      dirCurRow: {},
      isEditDir: false,
      currentLeftTreeUuid: '',
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      // 服务目标
      addServiceTargetDialogFlag: false,
      serviceTargetList: [],
      serviceTargetCurRow: {},
      serviceTargetIsSee: false,
      loading: false,
      // 全局设置
      globalSetDialog: false,
      serverTimeScrollbarHeight: 0,
      flag: false
    }
  },
  created() {
    this.doLayout();
    this.axiosLeftTree();
    this.axiosServiceTargetList();
  },
  methods: {
    /* **************  服务目标事件  start *************** */
    // 打开添加dialog
    add() {
      this.serviceTargetIsSee = false;
      this.serviceTargetCurRow = {};
      this.addServiceTargetDialogFlag = true;
    },
    // 打开编辑dialog
    rowSee(row) {
      this.serviceTargetIsSee = true;
      this.serviceTargetCurRow = {...row}
      this.addServiceTargetDialogFlag = true;
    },
    // 打开编辑dialog
    rowEdit(row) {
      this.serviceTargetIsSee = false;
      this.serviceTargetCurRow = {...row}
      this.addServiceTargetDialogFlag = true;
    },
    // 单项删除
    rowDel(row) {
      this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
        // let logParam = {
        //   data: [Object.assign({}, row)],
        //   logTemplate: '删除' + '|协议(#protocolName#)'
        // };
        $axios.get(`/itilSla/itilSlaAgreementUnfinishedOrder/${row.uuid}`, {
          data: [row],
          logTemplate: '删除|文件夹(#categoryName#)'
        }).then((res1) => {
          if (res1.data.state === true) {
            this.deleteItilSlaAgreement(row.uuid)
          } else {
            if (res1.data.errormsg.split('，')[0] === '有未完成的单据') {
              this.$confirm(res1.data.errormsg, '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
                this.deleteItilSlaAgreement(row.uuid);
              }).catch(() => {});
            } else {
              this.$message({showClose: true, message: res1.data.errormsg, type: 'error'});
            }
          }
        });
      }).catch(() => {});
    },
    deleteItilSlaAgreement(uuid) {
      $axios.get(`/itilSla/deleteItilSlaAgreement/${uuid}`).then((res2) => {
        if (res2.data.state === true) {
          this.$message({showClose: true, message: '删除成功!', type: 'success'});
          this.serviceTargetReload();
        } else {
          this.$message({showClose: true, message: res2.data.errormsg, type: 'error'});
        }
      });
    },
    // 批量删除操作
    batchDel() {
      if (this.selections.length === 0) {
        this.$message({
          type: 'error',
          message: '请至少选择一条数据'
        })
      } else {
        this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          $axios.post(`/itilSla/batchdeleteItilSlaAgreement`, [...this.selections.map(item => item.uuid)], {
            data: this.selections,
            logTemplate: '删除|文件夹(#categoryName#)>标题(#slaTitle#)'
          }).then(({data}) => {
            if (data.state === true) {
              this.$message({showClose: true, message: '删除成功!', type: 'success'});
              this.serviceTargetReload();
            } else {
              this.$message({showClose: true, message: data.errormsg, type: 'error'});
            }
          });
        }).catch(() => {});
      }
    },
    // 条件查询按钮
    listSearch() {
      this.serviceTargetReload();
      this.flag = false
    },
    hideHandler() {
      this.flag = !this.flag
    },
    serviceTargetReload() {
      this.axiosServiceTargetList(this.currentLeftTreeUuid);
    },
    axiosServiceTargetList(uuid) {
      this.loading = true;
      // 查询参数和分页集合
      let params = {...this.criteria};
      for (let key in params.condition) {
        if (params.condition[key] === '') {
          params.condition[key] = null
        }
      }
      // 添加左侧文件夹查询uuid
      params.condition.slaCategory = !uuid ? 'all' : uuid;
      $axios.post(`/itilSla/getSlaAgreementList`, params).then(({status, data}) => {
        this.loading = false;
        if (status === 200 && Array.isArray(data.list)) {
          this.serviceTargetList = data.list
          this.criteria.totalCount = data.list.length;
        } else {
          this.$message({showClose: true, message: '获取列表失败', type: 'error'});
        }
      })
    },
    // 服务目标批量操作
    selectionChange(selections) {
      this.selections = selections;
    },
    // 服务目标状态开启关闭
    slaStatusEnable(row) {
      if (row.slaStatus === 1) {
        $axios.get(`/itilSla/enableSlaAgreement/${row.uuid}`).then(({data}) => {
          if (data.state === true) {
            this.$message({showClose: true, message: data.errormsg, type: 'success'});
            this.axiosServiceTargetList();
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        })
      } else {
        $axios.get(`/itilSla/disenableSlaAgreement/${row.uuid}`).then(({data}) => {
          if (data.state === true) {
            this.$message({showClose: true, message: data.errormsg, type: 'success'});
            this.axiosServiceTargetList();
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        })
      }
    },
    /* **************  服务目标事件  end *************** */
    /* **************  切换左侧菜单事件  start *************** */
    switchMenu(index) {
      this.menuActive = index;
    },
    /* **************  切换左侧菜单事件  end *************** */
    /* **************  左侧文件树事件  start *************** */
    // 获取文件夹树
    axiosLeftTree() {
      $axios.get('/itilSla/getCategoryTreeNodelist').then((res) => {
        this.leftTree = res.data
      })
    },
    // 增加文件夹
    dirAdd() {
      this.isEditDir = false
      this.addDirDialogFlag = true;
    },
    // 编辑文件夹
    dirEdit(node) {
      this.isEditDir = true
      this.dirCurRow = node
      this.addDirDialogFlag = true;
    },
    // 删除文件夹
    dirDel(node) {
      this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
        // let logParam = {
        //   data: [Object.assign({}, row)],
        //   logTemplate: '删除' + '|协议(#protocolName#)'
        // };
        $axios.get(`/itilSla/delCategory/${node.uuid}`, {
          data: [node],
          logTemplate: '删除|文件夹(#name#)'
        }).then(({data}) => {
          if (data.state === true) {
            this.$message({showClose: true, message: '删除成功!', type: 'success'});
            this.axiosLeftTree();
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        });
      }).catch(() => {});
    },
    // 左侧树清除选中状态
    cleanDir() {
      this.dirCurRow = {}
      if (this.currentLeftTreeUuid) {
        this.axiosServiceTargetList()
      }
      this.currentLeftTreeUuid = null;
      this.$nextTick(() => {
        let treenode = document.getElementsByClassName('service-level-agreement')[0].getElementsByClassName('s-tree-node');
        if (treenode.length === 0) return null;
        for (let i = 0; i < treenode.length; i++) {
          treenode[i].classList.remove('is-current');
        }
      });
    },
    // 左侧树点击
    handleNodeClick(obj, node, el) {
      el.$el.classList.add('is-current')
      this.dirCurRow = obj
      this.currentLeftTreeUuid = obj.uuid
      this.axiosServiceTargetList(obj.uuid);
    },
    handleNodecheck(a, b, c) {
    },
    /* **************  左侧文件树事件  end *************** */
    /* **************  计算表格高度和左侧树高度  start *************** */
    doLayout() {
      this.$nextTick(() => {
        let totalHeihgt = document.body.offsetHeight;
        let headHeight = document.querySelector('#headBar').offsetHeight;
        let footHeight = document.querySelector('.s-footer').offsetHeight;
        let tabsHeaderHeight = document.querySelector('.s-tabs-header').offsetHeight + 15    // tabs头部加15的marginbottom
        let bodyHeight = totalHeihgt - headHeight - footHeight - tabsHeaderHeight - 20;
        let slaTitleHeight = document.querySelector('.sla-title').offsetHeight;
        let slaLeftMenuHeight = document.querySelector('.service-level-agreement .leftMenu').offsetHeight;
        // 树的高度等于tabs内容高度减去左侧从上到下元素高度 最后20是下边框
        let treeScrollHeight = bodyHeight - slaTitleHeight - slaLeftMenuHeight - 35 - 15 - 20 - 20;
        this.treeScrollHeight = treeScrollHeight < 400 ? 400 : treeScrollHeight;
        let searchBoxHeight = document.querySelector('.service-level-agreement .searchFormChunk').offsetHeight + 8;
        let listTopBtnHeight = document.querySelector('.service-level-agreement .list-top-btn').offsetHeight + 8;
        let pageHeight = document.querySelector('.service-level-agreement .s-pagination').offsetHeight + 8 + 8;
        // 表格的高度等于tabs内容高度减去从上到下元素高度 最后20是下边框
        let tableHeight = bodyHeight - searchBoxHeight - listTopBtnHeight - pageHeight - 20;
        this.tableHeight = tableHeight < 500 ? 500 : tableHeight;
        this.serverTimeScrollbarHeight = bodyHeight - 10;
      });
    }
    /* **************  计算表格高度和左侧树高度  end *************** */
  },
  components: {
    SlaAddServiceTargetDialog,
    SlaAddDirDialog,
    SlaGlobalSetDialog,
    SlaServiceTimeSet,
    SlaResultsSpotCheck
  }
}
</script>

<style lang="stylus">
.service-level-agreement {
  .list-top-btn {
    margin-bottom: 8px;
  }
}
</style>
