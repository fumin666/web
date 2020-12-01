<template>
  <div id="relationgraph">
    <div id="asset_desc_panel">
      <div class="description_panel">
        <div class="desc_title">
          <h2></h2>
          <h3></h3>
          <img src="static/images/system/spacer.gif" width="48px" height="48px">
        </div>
        <div class="desc_button_panel">
          <s-button icon="eye" id="viewCIInfo_map" 　title="查看配置项的明细">查看配置项的明细</s-button>
          <s-button icon="plus" id="addRel_map" v-if="isConfigAdminCheck(assetData)" title="添加关系">添加关系</s-button>
        </div>
      </div>
    </div>
    <div class="graphactions graphactionspop">
      <s-button-group>
        <s-button icon="enlarge" id="zoomin" title="点击放大"></s-button>
        <s-button icon="reduce" id="zoomout" title="点击缩小"></s-button>
        <s-button icon="magnifier" id="zoomreset" title="点击使放大复原"></s-button>
      </s-button-group>
    </div>
    <div class="canvas_container" id="cmdbViz" style="height:100%;">
      <div class="graphMenu">
        <s-button icon="plus" @click="addRelationship" v-if="isConfigAdminCheck(assetData)" title="添加关系">添加关系</s-button>
        <s-button icon="eye" @click="viewRelationList" title="查看关系列表">查看关系列表</s-button>
      </div>
    </div>

    <s-dialog v-model="rlist" v-if="rlist" width="750px" title="关系列表">
      <s-table-page :data="level2Data" height="380">
        <s-table-column
          prop="data.relation"
          label="关系"
          width="120">
        </s-table-column>
        <s-table-column
          prop="data.ciType"
          label="配置项类型"
          width="120">
        </s-table-column>
        <s-table-column
          prop="name"
          label="资产名称"
          >
        </s-table-column>
        <s-table-column
          label="操作" width="120">
          <template slot-scope="scope">
            <i class="iconfont icon-delete" @click="deleteRecord(scope.row)" title="删除"></i>
          </template>
        </s-table-column>
      </s-table-page>
    </s-dialog>
    <add-dialog
      v-model="addDialog"
      :isRoot="isRootAdd"
      :assetData="assetData"
      :compId="compId"
      :tipNode="tipNode"
      :coptions="coptions"
      :relationSelect="relationSelect"
      :configitemdata="configitemdata"
      @selectChange="handleRelationSelectChange"
      @close="reloadGrapg"
    ></add-dialog>

    <s-dialog v-model="userInfoModel"
              v-if="userInfoModel"
              top="55px"
              width="750px"
              ref="userInfoDialog"
              title="用户信息">
      <s-scrollbar wrap-class="scrollheight">
        <s-tab :animated="false" ref="infoTabs">
          <s-tab-pane label="个人信息">
            <user-info :data="userInfoArr"></user-info>
          </s-tab-pane>
        </s-tab>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button type="cancel" @click="cancel">确定</s-button>
      </template>
    </s-dialog>

    <s-dialog v-model="orgInfoModel"
              v-if="orgInfoModel"
              top="55px"
              width="750px"
              ref="orgInfoDialog"
              title="机构详情">
      <s-scrollbar wrap-class="scrollheight">
        <s-tab :animated="false" ref="orgInfoTabs">
          <s-row>
            <s-col :span="10">
              <div class="grid-content bg-purple">机构名称</div>
            </s-col>
            <s-col :span="14">
              <div class="grid-content bg-purple-light">{{orgInfo.departName}}</div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="10">
              <div class="grid-content bg-purple">机构编号</div>
            </s-col>
            <s-col :span="14">
              <div class="grid-content bg-purple-light">{{orgInfo.departCode}}</div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="10">
              <div class="grid-content bg-purple">上级机构</div>
            </s-col>
            <s-col :span="14">
              <div class="grid-content bg-purple-light">{{orgInfo.departParentName}}</div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="10">
              <div class="grid-content bg-purple">机构主负责人</div>
            </s-col>
            <s-col :span="14">
              <div class="grid-content bg-purple-light">{{orgInfo.departLeaderName}}</div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="10">
              <div class="grid-content bg-purple">机构副负责人</div>
            </s-col>
            <s-col :span="14">
              <div class="grid-content bg-purple-light">{{orgInfo.departViceLeaderName}}</div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="10">
              <div class="grid-content bg-purple">联系方式</div>
            </s-col>
            <s-col :span="14">
              <div class="grid-content bg-purple-light">{{orgInfo.departPhone}}</div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="10">
              <div class="grid-content bg-purple">机构地址</div>
            </s-col>
            <s-col :span="14">
              <div class="grid-content bg-purple-light">{{orgInfo.departPlace}}</div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="10">
              <div class="grid-content bg-purple">备注</div>
            </s-col>
            <s-col :span="14">
              <div class="grid-content bg-purple-light">{{orgInfo.remark}}</div>
            </s-col>
          </s-row>
        </s-tab>
      </s-scrollbar>
    </s-dialog>
  </div>
</template>
<script>
  import rGraph from './relationGraph'
  import $axios from 'sunflower-ajax'
  import {loadScript} from 'sunflower-common-utils'
  import userInfo from '@/pages/UserManage/UserInfo'
  import AddDialog from './AddRelationDialog.vue'
  import roleCheckMixin from '@/common/mixins/roleCheckMixin';
  var $ = window.$;
  var empty = function () {
  };
  var currentVm = {};
  var config = {
    initFeed: null,
    saveList: [],
    loadAnimated: true,
    // 浮动显示内容
    onShowTip: function (node) {
      currentVm.tipNode = node;
      $('#viewCIInfo_map').unbind('click').click(function () {
        currentVm.viewCIInfo();
        $('#asset_desc_panel').css({
          opacity: 0,
          display: 'none'
        })
      });
      $('#addRel_map').unbind('click').click(function () {
        currentVm.addRelationship(true);
      });
      $('.desc-title-link').unbind('click').click(function () {
        currentVm.viewCIInfo();
      });
    },
    onCreateHtmlNode: function (label, container, data) {
      if (data.otherAppsInfo && data.otherAppsInfo.length > 0) {
        $(container).append('<img src="/static/images/system/spacer.gif" class="cinode-alert" />')
      }
    },
    preventMousewheel: true,
    'InfoContainer': {
      id: '#asset_desc_panel',
      hoverTime: 0,
      fadeTime: 200,
      onShow: empty,
      onHide: empty
    }
  };

  export default {
    mixins: [roleCheckMixin],
    data() {
      return {
        // 判断是否点击的全局添加按钮，点击全局添加按钮只在根节点添加
        isRootAdd: false,
        root: {},
        level2Data: [],
        tipNode: {},
        rlist: false,
        curentCiuuid: '',
        selectCurentCiuuid: '', // 当前选择需要添加关系的CIUUID
        curentCitypeuuid: '',
        vizard: null,
        addDialog: false,
        coptions: [],    // 新增对话框的options
        crelation: {}, // 新增对话框中选中的option
        configitemdata: [], // 新增对话框中的列表
        selectCi: '',
        selectCiAry: [],
        currentRow: null,
        relationSelect: {},
        multipleSelection: [],
        userInfoArr: [],
        userInfoModel: false,
        orgInfo: {},
        orgInfoModel: false,
        locked: 1,
        compId: '',
        assetData: {}
      }
    },
//    props: {
//      compId: {
//        type: String,
//        default: ''
//      }
//    },
    mounted() {
      // 资产管理>资产列表>点击资产名称查看详情路由参数为assetUuid，故做如下修改。
      // this.compId = this.$route.params.compId;
      this.compId = this.$route.params.compId || this.$route.params.assetUuid;
      $axios.post(`/resourcemanager/assetmanager/itasset/getitAsset/${this.compId}`).then(({data}) => {
        if (data && data instanceof Object) {
          this.assetData = data;
        }
      });
      this.initGraph();
    },
    components: {
      userInfo,
      AddDialog
    },
    methods: {
      initGraph() {
        $axios.post(`resourcemanager/configurationmanage/relationtype/getAllciRelationMapByciUuid/${this.compId}`).then(({data}) => {
          this.root = data;
          loadScript('../../../static/js/jit.js', () => {
            this.curentCitypeuuid = this.root.root[0].data.currentCitypeuuid;
            let imageUri = this.root.root[0].data.imageIcon;
            this.root.root[0].data.imageIcon = '../../../static/' + imageUri.slice(imageUri.indexOf('images'));
            this.createGraph(this.root);
          });
        });
      },
      reloadGrapg() {
        $('#cmdbViz-canvaswidget').remove();
        this.initGraph()
      },
      handleRelationSelectChange(val) {
        this.crelation = val
      },
      addCancel () {
        this.currentRow = null;
        this.multipleSelection = [];
        this.addDialog = false;
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      createGraph(root) {
        var contentHeight = $(window).height();
        var mainConHeight = contentHeight - $('#header').height() - 120;
        $('#cmdbViz').height(mainConHeight + 'px');
        currentVm = this;
        if (root[this.compId] !== undefined) {
          currentVm.level2Data = root[this.compId];
        }
        this.vizard = rGraph.createViz('cmdbViz', config, root); // NO I18N
      },
      viewCIInfo() { // 查看配置项的明细
        var nodedata = this.tipNode.data;
        if (undefined !== nodedata) {
          if (nodedata.itAsset) {
//            if (nodedata.relId === 'root') {
//              this.$emit('view-detail');
//            } else {
//              this.$router.push({
//                name: 'AssetsMonitor_compInfo',
//                params: {
//                  compId: nodedata.assetId
//                }
//              });
//              location.reload('/#/AssetsMonitor/assetsMonitor_list/compInfo/' + nodedata.assetId)
//            }
            window.open('/#/AssetsAll/assets_list/assetDetail/' + nodedata.assetId, '_blank')
          } else {
            if (nodedata.typekey === 'user') {
              $axios.post('/iamUserInfo/viewUserInfo/' + nodedata.assetId).then((res) => {
                if ((typeof res.data) === 'object') {
                  this.userInfoArr = res.data;
                  this.userInfoModel = true
                } else {
                  this.$message({
                    message: '暂无明细',
                    type: 'warning'
                  });
                }
              })
            } else if (nodedata.typekey === 'organization') {
              $axios.post('/departmentInfo/viewDepartInfo/' + nodedata.assetId).then((res) => {
                if ((typeof res.data) === 'object') {
                  this.orgInfo = res.data.departmentInfo;
                  this.orgInfoModel = true
                } else {
                  this.$message({
                    message: '暂无详情',
                    type: 'warning'
                  });
                }
              })
            }
          }
        }
      },
      cancel() {
        this.userInfoModel = false;
      },
      addRelationship(flag) { // 添加关系
        // 默认只在根节点添加，我先注释掉
        let selectcurrentCitypeuuid = '';
        if (flag === true) {
          this.isRootAdd = false
          this.selectCurentCiuuid = this.tipNode.id;
          selectcurrentCitypeuuid = this.tipNode.data.currentCitypeuuid;
        } else {
          this.isRootAdd = true
          selectcurrentCitypeuuid = this.curentCitypeuuid;
        }
        $axios.post('/resourcemanager/configurationmanage/relationtype/getcitypeRelationtype/' + selectcurrentCitypeuuid).then(({data}) => {
          // 注释掉关系判断
//          if (data.length > 0) {
//            this.coptions = data;
//            this.crelation = this.coptions[0];
//            this.addDialog = true;
//            this.locked = 1;
//          } else {
//            this.$message({
//              type: 'info',
//              message: '该配置项没有可以添加的关系'
//            });
//          }
          this.coptions = data || [];
          this.crelation = this.coptions[0] | [];
          this.addDialog = true;
          this.locked = 1;
        });
      },
      viewRelationList() { // 查看关系列表
        if (this.level2Data.length > 0) {
          this.rlist = true;
        } else {
          this.$message({
            type: 'info',
            message: '没有关系数据'
          });
        }
      },
      deleteRecord(rowData) {
        this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          $axios.post(`/resourcemanager/configurationmanage/relationtype/removeCmdbCirelatoin/${rowData.data.cirelationuuid}`).then(({data}) => {
            if (data === 'true') {
              this.rlist = false;
              $('#cmdbViz-canvaswidget').remove();
              this.initGraph();
            } else {
              this.$message({showClose: true, message: '删除失败!', type: 'error'});
            }
          });
        }).catch(() => {});
      }
    },
    watch: {
      crelation: {
        deep: true,
        handler(val) {
          if (val) {
            if (this.isRootAdd || this.tipNode.data === undefined) {
              $axios.post(`/resourcemanager/configurationmanage/relationtype/getcmdbCilist/${val.relCitypeuuid}/${val.relationTypeUuid}/${this.compId}`).then(({data}) => {
                this.configitemdata = data;
                this.relationSelect = val;
                if (this.relationSelect.relationDefine === null) {
                  this.relationSelect.relationDefine = '0';
                }
              });
            } else {
              $axios.post(`/resourcemanager/configurationmanage/relationtype/getcmdbCilist/${val.relCitypeuuid}/${val.relationTypeUuid}/${this.tipNode.data.assetId}`).then(({data}) => {
                this.configitemdata = data;
                this.relationSelect = val;
                if (this.relationSelect.relationDefine === null) {
                  this.relationSelect.relationDefine = '0';
                }
              });
            }
          }
        }
      }
    }
  }
</script>

