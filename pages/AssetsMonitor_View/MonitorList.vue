<!--
 * @Author: 高建鹏
 * @Description: 资产监控列表
 * @Position:
 * @Date: 2019-07-22 15:05:52
 * @LastEditors: 高建鹏
 -->
<template>
  <div class="assetList">
    <s-row :gutter="15">
      <s-col :span="4">
        <div class="listChunk">
          <s-tab v-model="activeTab">
            <s-tab-pane label="IT资产">
              <s-scrollbar :wrap-style="[{'height':treeScrollHeight + 'px'}]" ref="treeScrollbar">
                <div ref="menuTree">
                  <s-tree id="itAssetsTree" ref="itAssetsTree" :data="itTreeData" :props="defaultProps" @node-click="handleNodeClick"
                          :highlight-current="true"
                          prefixIcon="circle" :showLine="true"
                          :default-expanded-keys="defaultExpandKeys"
                          node-key="uuid"
                          :current-node-key="currentLeftTreeUuid"
                          :render-content="renderContent"
                          :expand-on-click-node="false"
                  ></s-tree>
                </div>
              </s-scrollbar>
            </s-tab-pane>
          </s-tab>
        </div>
      </s-col>
      <s-col :span="20">
        <div class="listChunk">
          <s-row style="margin-bottom:15px;">
            <s-button-group style="float:right;" class="btnStyle">
              <s-button icon="histogram" @click="showModel('graph')" class="listStyle">统计图模式</s-button>
              <s-button icon="list" @click="showModel('list')">列表模式</s-button>
            </s-button-group>
          </s-row>
          <s-row style="margin-bottom:10px">
            <s-form :inline="true" :model="searchForm" class="search_form" label-width='80px'>
              <div>
                <s-form-item label="资产类型：">
                  <input-tree v-model="searchForm.citypeUuid" name="uuid" :data="searchOptions"
                              :props="defaultProps" :hasDelIcon="true"></input-tree>
                </s-form-item>
                <s-form-item label="IP地址：">
                  <s-input @keyup.enter.native="listSearch" v-model="searchForm.ip"></s-input>
                </s-form-item>
                <s-form-item label="资产名称：">
                  <s-input @keyup.enter.native="listSearch" v-model="searchForm.assetName"></s-input>
                </s-form-item>
                <s-form-item label="监控状态：">
                  <s-select v-model="searchForm.isMonitor" clearable>
                    <!--<s-option label="所有" value=""></s-option>-->
                    <s-option label="已监控" :value="1"></s-option>
                    <s-option label="未监控" :value="0"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="资产状态：">
                  <s-select v-model="searchForm.assetState" :disabled="pingStatusDisabled" clearable>
                    <s-option label="所有" value=""></s-option>
                    <s-option label="正常" :value="1"></s-option>
                    <s-option label="异常" :value="0"></s-option>
                    <s-option label="告警" :value="2"></s-option>
                    <s-option label="未知" :value="3"></s-option>
                  </s-select>
                </s-form-item>
              </div>
              <div>
                <s-form-item class="search_btn">
                  <s-button icon="magnifier" @click="listSearch">查询</s-button>
                </s-form-item>
              </div>
            </s-form>
          </s-row>
          <s-row class="searchBtChunk">
            <s-col class="left">
              <s-button v-if="!isConcern" icon="start" @click="openMonitorBatch">批量开启监控</s-button>
              <s-button v-if="!isConcern" icon="pause" @click="stopMonitorBatch">批量关闭监控</s-button>
              <s-button v-if="!isConcern" icon="attend" @click="addConcernBatch">批量关注</s-button>
              <s-button icon="ban" @click="cacelConcernBatch">批量取消关注</s-button>
              <s-button v-if="!isConcern" icon="tool" @click="treatyTestDialogFlag=true">协议测试工具</s-button>
              <s-button v-if="!isConcern" icon="medal" @click="gotoScoreSet" :disabled="!ImpAuth">资产监控打分设置</s-button>
            </s-col>
            <s-col class="right">
              <span class="declareState">
                  <span>
                    <i :class="filterStateImg(3)" :style="filterStateColor(3)"></i>未知
                  </span>
                  <span>
                    <i :class="filterStateImg(1)" :style="filterStateColor(1)"></i>正常
                  </span>
                  <span>
                    <i :class="filterStateImg(0)" :style="filterStateColor(0)"></i>异常
                  </span>
                  <span>
                    <i :class="filterStateImg(2)" :style="filterStateColor(2)"></i>告警
                  </span>
                  <span>
                    <!-- 动态列设置 -->
                    <dynamic-column-set :dynamicData="dynamicData.configs" class="s-upload showColumnSet" :option="option" ref="showColumnSet" @show="showColumnSet" @save="saveform" style="display:inline-block">
                      <s-button icon="set" title="设置" slot="click"></s-button>
                      <s-form ref="drawerForm" label-width="280px" slot="otherSetting">
                        <s-form-item label="默认排序列" prop="orderName" label-width="100px">
                          <s-select v-model="dynamicData.orderName" placeholder="请选择">
                            <s-option label="资产名称" value="assetName"></s-option>
                            <s-option label="IP地址" value="ip"></s-option>
                          </s-select>
                        </s-form-item>
                        <s-form-item label="排序方式" prop="isAsc" label-width="100px">
                          <s-select v-model="dynamicData.isAsc" placeholder="请选择">
                            <s-option label="升序" :value="1"></s-option>
                            <s-option label="降序" :value="0"></s-option>
                          </s-select>
                        </s-form-item>
                      </s-form>
                    </dynamic-column-set>
                  </span>
                </span>
            </s-col>
          </s-row>
          <RealPageTable v-if="isShow" :ajax-obj="ajaxObj" @selection-change="selectionChange" style="width:100%;" :callback="handleData">
            <s-table-column type="selection" width="45" align="center" :reserve-selection="true"></s-table-column>
            <s-table-column label="状态" prop="assetState" width="60" align="center">
              <template slot-scope="scope">
                <i :class="filterStateImg(scope.row['assetState'])" :style="filterStateColor(scope.row['assetState'])" :title="filterStateTitle(scope.row['assetState'])"></i>
              </template>
            </s-table-column>
            <s-table-column label="监控" prop="isMonitor" min-width="60">
              <template slot-scope="scope">
                <s-switch v-model="scope.row['isMonitor']" size="small" :active-value="1" :inactive-value="0" on-text="" off-text=""
                          @change="monitor(scope.row)"></s-switch>
              </template>
            </s-table-column>
            <s-table-column :label="name" :prop="name" v-for="(name,index) in tableHeads" :key="index" show-overflow-tooltip>
              <template slot-scope="scope">
                <template v-if="name==='资产名称'">
                  <span v-text="scope.row[name]"></span>
                </template>
                <template v-else-if="name==='IP地址'">
                  <span  v-text="scope.row[name]" class="ip" style="width:140px;" @click="gotoItemInfo(scope.row)"></span>
                </template>
                <template v-else-if="name ==='Ping状态'">
                  <span :style="pingStyle(scope.row[name])" class="ping-status"></span> {{scope.row[name] | filterPing}}
                </template>
                <template v-else-if="name==='凭证状态'">
                  <i class="icon iconfont icon-proof" :style="filterCredenceStateImg(scope.row[name])"></i>
                  {{scope.row[name] | filterCredence}}
                </template>
                <template v-else-if="name==='CPU使用率'||name==='内存使用率'||name==='磁盘使用率'">
                  <s-progress :percentage="(scope.row[name] || 0) - 0"></s-progress>
                </template>
                <template  v-else>
                  <span>{{scope.row[name]}}</span>
                </template>
              </template>
            </s-table-column>
            <s-table-column label="操作" width="100">
              <template slot-scope="scope">
                <i class="iconfont" :class="[scope.row.isConcern ? 'icon-star-full' : 'icon-star-empty']"
                   @click="rowConcern(scope.row)"
                   :title="scope.row.isConcern ? '取消关注' : '关注'"></i>
                <i class='icon iconfont icon-eye' title="查看" @click="gotoAssetDetail(scope.row)"></i>
              </template>
            </s-table-column>
          </RealPageTable>
        </div>
      </s-col>
    </s-row>

    <!--协议测试工具-->
    <treaty-test-dialog v-if="treatyTestDialogFlag" v-model="treatyTestDialogFlag"></treaty-test-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import inputTree from '@/components/inputTree/InputTree';
  import treatyTestDialog from '@/pages/AssetsMonitor_List/MonitorDialog/TreatyTestDialog';
  import {Validaters} from 'sunflower-common-utils';
  import {cloneDeep} from 'lodash';
  import authCheck from '@/common/mixins/auth.js'
  // import monitorListSetting from './dialog/MonitorListSetting.vue'
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  import dynamicColumnSet from '@/components/dynamicColumnDialog/DynamicColumnSet.vue'

  export default {
    mixins: [authCheck],
    data() {
      return {
        isShow: true,
        dynamicData: {
          isAsc: 1,
          orderName: ''
        },
        option: {
          title: '列显示设置',
          key: 'uuid', // key
          nameKey: 'headName', // 名字key
          showKey: 'isShow', // 是否显示key
          sortKey: 'headIndex', // 排序key
          width: '300',
          height: '500'
        },
        isConcern: false,
        activeTab: 0,
        itTreeData: [],
        currentLeftTreeUuid: '',
        defaultExpandKeys: [],
        searchOptions: [],
        defaultProps: {
          children: 'childrenList',
          label: 'name'
        },
        certificationIcons: [{
          name: '不通',
          src: './static/images/resourcemanage/certificate-red.png'
        }, {
          name: '通',
          src: './static/images/resourcemanage/certificate-green.png'
        }],
        // tableData: {},
        tableHeads: [],
        selections: [],
        searchForm: {
          isMonitor: '',
          assetState: '',
          citypeUuid: '',
          ip: '',
          assetName: ''
        },
        criteria: {
          condition: {
            isMonitor: '',
            assetState: '',
            citypeUuid: '',
            ip: '',
            assetName: ''
          }
        },
        citypeOptions: [],
        treatyTestDialogFlag: false,
        curUuid: '',
        uploadObj: {},
        downObj: {},
        // tableHeight: 500,
        treeScrollHeight: 500,
        pingStatusDisabled: false,
        switchName: '',
        topuuid: '',
        topname: '',
        ajaxObj: {
          type: 'post',
          url: '/monitorlist/getAssetlist',
          params: {
            condition: {
            }
          }
        }
      }
    },
    watch: {
      'searchForm.isMonitor'(val) {
        if (val === 0) {
          this.searchForm.assetState = '';
          this.pingStatusDisabled = true;
        } else {
          this.pingStatusDisabled = false;
        }
      }
    },
    filters: {
      filterPing(status) {
        switch (status) {
          case '0':
            return '异常'
          case '1':
            return '正常'
          case '2':
            return '禁ping'
          case '3':
            return '未知'
        }
      },
      filterCredence(status) {
        switch (status) {
          case '0':
            return '异常'
          case '1':
            return '正常'
          case '3':
            return '未知'
        }
      }
    },
    created() {
      this.topuuid = this.$route.query.uuid;
      this.topname = this.$route.query.name;
      if (this.$route.query.concern) { // 关注监控列表
        this.isConcern = true;
      }
      // 获取IT资产树
      this.axiosMonitorTree(() => {
        if (this.isConcern) {
          this.axiosMonitorList();
        } else {
          this.selectItTree(this.$route.query.uuid);
        }
      });
      // 获取搜索栏资产类型选项
      $axios.get('/monitorcitype/getCitypeTree').then(({data}) => {
        this.searchOptions = data;
      });
    },
    mounted() {
      this.doLayout();
      window.addEventListener('resize', this.doLayout);
    },
    destroyed() {
      window.removeEventListener('resize', this.doLayout);
    },
    methods: {
      getdata() {
        $axios.get(`/monitorlist/getConfig/${this.currentLeftTreeUuid}`).then((res) => {
          this.dynamicData = res.data;
        });
      },
      showColumnSet() {
        if (!this.currentLeftTreeUuid) {
          this.$message.warning('请选定具体资产分类进行动态列设置！');
          this.$refs.showColumnSet.close();
        }
      },
      saveform(data) {
        let params = cloneDeep(this.dynamicData)
        params.configs = data
        $axios.post(`/monitorlist/setConfig`, params, {
          data: [],
          logTemplate: '编辑|动态列设置'
        }).then((res) => {
          if (res.data && res.data.state) {
            this.getdata();
            this.reloadSort()
            this.$message.success(res.data.errormsg)
          } else {
            this.$message.error(res.data.errormsg)
          }
        });
      },
      showModel(type) {
        if (type === 'graph') {
          this.$router.replace({
            path: '/AssetsMonitor/assetsMonitor_view',
            query: {uuid: this.topuuid, name: this.topname}
          })
        }
      },
      pingStyle(status) {
        switch (status) {
          case '0':
            return 'background-color: #ed4041';
          case '1':
            return 'background-color: #19be6b';
          case '2':
            return 'background-color: #303133';
          case '3':
            return 'background-color: #808695'
        }
      },
      doLayout() {
        this.$nextTick(() => {
          let totalHeihgt = document.body.offsetHeight;
          let headHeight = document.querySelector('#headBar').offsetHeight;
          let footHeight = document.querySelector('.s-footer').offsetHeight;
          let bodyHeight = totalHeihgt - headHeight - footHeight;
          // 17是因为scrollbar的marginbottom, 后一个20是距离footer的距离
          this.treeScrollHeight = bodyHeight - 20 - 35 - 15 - 20 + 17;
          // let searchBoxHeight = document.querySelector('.assetList .searchBtChunk').offsetHeight + 8;
          // searchBoxHeight += document.querySelector('.assetList .searchFormChunk').offsetHeight + 8;
          // let pageHeight = document.querySelector('.assetList .pageRow').offsetHeight + 8;
          // // 1好像是table的border,clientTop为1
          // this.tableHeight = bodyHeight - 20 - searchBoxHeight - pageHeight - 20 - 1;
        });
      },
      handleNodeClick(nodeData, node, nodeVM) {
        for (let i in this.searchForm) {
          this.searchForm[i] = ''
        }
        for (let i in this.criteria.condition) {
          this.criteria.condition[i] = ''
        }
        let name = nodeData.name.slice(0, nodeData.name.indexOf('('));
        let concern = this.$route.query.concern;
        let concernStr = concern === 'true' ? 'concern=true&' : '';
        this.getTopLvel(node);// 获取一级uuid和name
        if (name !== this.$route.query.name) {
          this.$router.replace(`${this.$route.path}?${concernStr}uuid=${nodeData.uuid}&name=${name}`)
        }
        this.currentLeftTreeUuid = nodeData.uuid; // 保证tree刷新后高亮
        this.getdata()
        this.criteria.condition.citypeUuid = nodeData.uuid;
        this.axiosMonitorList();
      },
      renderContent(h, {node}) {
        let arr = [];
        let img = '';
        if (node.level !== 1) {
          arr = node.data.node.icon.split('/')
          img = '../../static/images/asseticon/' + arr[arr.length - 1]
        } else {
          img = '../../static/images/asseticon/files.png'
        }
        return (
          <span><span style = "vertical-align: middle;"><img style="margin-right: 4px;width:16px;height:16px;" src={img}></img></span>
          < span style = "font-size:14px" > {node.label}</span ></span >
        );
      },
      axiosMonitorTree(callback = function () {
      }) {
        // let url = '/resourcemanager/configurationmanage/citype/' + (!this.isConcern ? 'getCountCitypeTree' : 'countConcernztreelist');
        let url = '/monitorcitype/' + (!this.isConcern ? 'getCountCitypeTree' : 'countConcernztreelist');
        $axios.post(url).then(({data}) => {
          this.itTreeData = data;
          this.defaultExpandKeys = this.itTreeData.map(item => {
            return item.uuid;
          });
          callback();
        });
      },
      gotoScoreSet() {
        // window.open('#/AssetsMonitor/monitorSet');
        this.$router.push('/AssetsMonitor/assetsMonitor_list/monitorSet');
      },
      selectItTree(uuid = '6cae901ede4d488fad4c807fc8bca9a2') {
        this.$nextTick(() => {
          let node = this.$refs.itAssetsTree.getNode(uuid);
          let nodeData = node.data;
          this.handleNodeClick(nodeData, node)
          this.$refs.itAssetsTree.setCurrentKey(uuid);
          this.defaultExpandKeys = [uuid]
          this.$nextTick(() => {
            let nodes = this.$refs.menuTree.querySelectorAll('.is-current');
            nodes.forEach(item => {
                // item.click()
                let scrollWrap = this.$refs.treeScrollbar.$refs.wrap;
                if (item.offsetTop > scrollWrap.clientHeight) {
                  scrollWrap.scrollTop = item.offsetTop - scrollWrap.clientHeight + 200;
                }
            });
          });
        })
      },
      handleData(data) {
        data.totalCount = data.criteria.totalCount;
        data.monitorlist.map(item => {
          item.heads.map(obj => {
            item[obj.cName] = obj.cValue;
          })
        })
        this.tableHeads = data.tableHeads;
        return data.monitorlist;
      },
      axiosMonitorList(callback = () => {}) {
        let param = cloneDeep(this.criteria);
        for (let i in param.condition) {
          if (param.condition[i] === null || param.condition[i] === '' || param.condition[i].length === 0) {
            param.condition[i] = null;
          }
        }
        if ((this.searchForm.assetState === 1 || this.searchForm.assetState === 2) && this.searchForm.isMonitor !== 0) {
          this.$set(param.condition, 'isMonitor', 1);
        } else if (this.searchForm.assetState === 0) {
          // this.$set(param.condition, 'isMonitor', 0)
          // delete param.condition.assetState
        }
        // param.condition.isMonitor = 1; // 不传是所有、1是已监控、0是未监控
        if (this.isConcern) this.$set(param.condition, 'concern', true);

        this.ajaxObj.params.condition = cloneDeep(param.condition);
      },
      selectionChange(selections) {
        this.selections = selections;
      },
      getTopLvel(nodeObj) {
        if (nodeObj.level > 1) {
          this.getTopLvel(nodeObj.parent)
        } else {
          this.topuuid = nodeObj.key;
          this.topname = nodeObj.label.slice(0, nodeObj.label.indexOf('('));
        }
      },
      listSearch () {
        this.criteria.condition = Object.assign({}, this.criteria.condition, this.searchForm);
        if (this.searchForm.citypeUuid) {
          this.currentLeftTreeUuid = this.searchForm.citypeUuid
          this.defaultExpandKeys = [this.currentLeftTreeUuid]
          this.getTopLvel(this.$refs.itAssetsTree.getNode(this.currentLeftTreeUuid))
          this.$refs.itAssetsTree.setCurrentKey(this.currentLeftTreeUuid);
        } else {
          this.currentLeftTreeUuid = '';
          this.$refs.itAssetsTree.setCurrentKey(null);
        }
        if (this.searchForm.assetState === 1 && this.searchForm.isMonitor !== 0) {
          this.criteria.condition.isMonitor = 1
        }
        this.axiosMonitorList();
        this.$nextTick(() => {
          let nodes = this.$refs.menuTree.querySelectorAll('.is-current');
          nodes.forEach(item => {
              // item.click()
              let scrollWrap = this.$refs.treeScrollbar.$refs.wrap;
              if (item.offsetTop > scrollWrap.clientHeight) {
                scrollWrap.scrollTop = item.offsetTop - scrollWrap.clientHeight + 200;
              }
          });
        });
      },
      // 顶部按钮
      openMonitorBatch() {
        if (this.selections.length === 0) {
          this.$message({showClose: true, message: '至少选中一个资产', type: 'error'});
          return;
        }
        let errorItcomp = this.selections.find(item => !Validaters.isIp(item['ip']));
        if (errorItcomp) {
          this.$message({showClose: true, message: `资产${errorItcomp['assetName']}未填写正确的IP地址，无法开启监控`, type: 'error'});
          return;
        }
        ;
        let uuidArr = this.selections.map(item => {
          return item.uuid;
        });
        let param = {
          params: 'start',
          monitorItcompUuids: uuidArr
        };
        let logParam = {
          data: JSON.parse(JSON.stringify(this.selections)),
          logTemplate: '开启监控|资产(#ip#/#assetName#)'
        };
        this.axiosBatchMonitor(param, logParam, data => {
          if (data.state === true) {
            this.$message({showClose: true, message: data.errormsg, type: 'success'});
            this.reload();
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
            this.reload();
          }
          this.selections = []  // 批量操作后清掉选中数目
        })
      },
      stopMonitorBatch() {
        let uuidArr = this.selections.map(item => {
          return item.uuid;
        });
        if (uuidArr.length === 0) {
          this.$message({showClose: true, message: '至少选中一个资产', type: 'error'});
          return;
        }
        let param = {
          params: 'end',
          monitorItcompUuids: uuidArr
        };
        let logParam = {
          data: JSON.parse(JSON.stringify(this.selections)),
          logTemplate: '关闭监控|资产(#ip#/#assetName#)'
        };
        this.axiosBatchMonitor(param, logParam, data => {
          if (data.state === true) {
            this.$message({showClose: true, message: data.errormsg, type: 'success'});
            this.reload(true);
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
            this.reload(true);
          }
          this.selections = []  // 批量操作后清掉选中数目
        })
      },
      addConcernBatch() {
        let uuidArr = this.selections.map(item => {
          return item.uuid;
        });
        if (uuidArr.length === 0) {
          this.$message({showClose: true, message: '至少选中一个资产', type: 'error'});
        } else {
          this.$confirm('确定关注？', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'info'}).then(() => {
            let logParam = {
              data: JSON.parse(JSON.stringify(this.selections)),
              logTemplate: '关注|资产(#ip#/#assetName#)'
            };
            $axios.post('/resourcemanager/assetmanager/itasset/batchAddConcern', uuidArr, logParam).then(({data}) => {
              if (data) {
                this.$message({showClose: true, message: data, type: 'success'});
                this.reload();
                this.selections = []  // 批量操作后清掉选中数目
              }
            });
          }).catch(() => {});
        }
      },
      cacelConcernBatch() {
        let uuidArr = this.selections.map(item => {
          return item.uuid;
        });
        if (uuidArr.length === 0) {
          this.$message({showClose: true, message: '至少选中一个资产', type: 'error'});
        } else {
          this.$confirm('确定取消关注？', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'info'}).then(() => {
            let logParam = {
              data: JSON.parse(JSON.stringify(this.selections)),
              logTemplate: '取消关注|资产(#ip#/#assetName#)'
            };
            $axios.post('/resourcemanager/assetmanager/itasset/batchCancelConcern', uuidArr, logParam).then(({data}) => {
              if (data) {
                this.$message({showClose: true, message: data, type: 'success'});
                this.reload();
                this.selections = []  // 批量操作后清掉选中数目
              }
            });
          }).catch(() => {});
        }
      },
      // 行内图标按钮操作
      monitor(row) {
        let param = {};
        this.$nextTick(() => {
          if (row['isMonitor'] === 0) {
            param.params = 'end';
            this.switchName = '关闭监控'
          } else {
            param.params = 'start';
            this.switchName = '开启监控'
          }
          param.monitorItcompUuids = [row.uuid];
          let logParam = {
            data: [JSON.parse(JSON.stringify(row))],
            logTemplate: `${this.switchName}|资产(#ip#/#assetName#)`
          };
          this.axiosBatchMonitor(param, logParam, data => {
            if (data.state === true) {
              this.$message({showClose: true, message: data.errormsg, type: 'success'});
              this.reload();
            } else {
              this.$message({showClose: true, message: data.errormsg, type: 'error'});
              row['isMonitor'] = row['isMonitor'] ? 0 : 1;
            }
          });
        })
      },
      gotoAssetDetail(row) {
        this.$router.push(`/AssetsAll/assets_list/assetDetail/${row.uuid}`);
      },
      gotoItemInfo(row) { // 跳转至面板业
        this.$router.push(`assetsMonitor_list/assetDetail/${row.uuid}`);
      },
      rowConcern(rowData) {
        let logParam = {
          data: [rowData],
          logTemplate: rowData.isConcern ? '取消关注|资产(#ip#/#assetName#)' : '关注|资产(#ip#/#assetName#)'
        };
        $axios.post(`/resourcemanager/assetmanager/itasset/concern/${rowData.uuid}`, logParam).then(({data}) => {
          if (data) {
            this.$message({showClose: true, message: data, type: 'success'});
            this.reload();
          } else {
            this.$message({showClose: true, message: '操作失败', type: 'error'});
          }
        });
      },
      // 弹框关闭后刷新所有
      reload(treeFlag) { // treeFlag:需不需要刷新左侧树
        if (treeFlag) {
          this.axiosMonitorTree()
        }
        this.axiosMonitorList();
      },
      filterStateImg(val) { // 状态图标
        switch (val) {
          case 0:
            return 'icon iconfont icon--Downtime';
          case 1:
            return 'iconfont icon-zhengchang';
          case 2:
            return 'iconfont icon-warning';
          case 3:
            return 'iconfont icon-weizhi';
          default:
            return 'iconfont icon-weizhi';
        }
      },
      filterStateColor(val) { // 状态颜色
        switch (val) {
          case 0:
            return 'color: #ed4041';
          case 1:
            return 'color: #19be6b';
          case 2:
            return 'color: #ff9900';
          case 3:
            return 'color: #808695';
          default:
            return 'color: #808695'
        }
      },
      filterStateTitle(val) { // 状态标题
        switch (val) {
          case 0:
            return '异常';
          case 1:
            return '正常';
          case 2:
            return '告警';
          case 3:
            return '未知';
          default:
            return '未知'
        }
      },
      filterCredenceStateImg(val) {
        switch (val) {
          case '0':
            return 'color: #ed4041';
          case '1':
            return 'color: #19be6b';
          case '3':
            return 'color: #808695'
        }
      },
      axiosBatchMonitor(param, logParam, callback = () => {
      }) {
        $axios.post('/resourcemanager/assetmanager/itasset/assetBatchMonitor', param, logParam).then(({data}) => {
          callback(data);
        });
      },
      reloadSort() {
        this.isShow = false
        this.$nextTick(() => {
          this.isShow = true
          this.$nextTick(() => {
            this.axiosMonitorList();
          })
        })
      }
    },
    components: {
      inputTree,
      RealPageTable,
      dynamicColumnSet,
      treatyTestDialog
    }
  }
</script>
<style lang="stylus">
.declareState
  font-size 14px
  margin-right 20px
  height 30px
  line-height 30px
  & > span
    margin-right 5px
  img
    vertical-align middle
    margin-right 3px
.ping-status
  display inline-block
  width 8px
  height 8px
  border-radius 50%
  vertical-align middle
.credence-status:before
  vertical-align middle;

</style>
