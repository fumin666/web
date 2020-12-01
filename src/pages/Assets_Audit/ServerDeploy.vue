<template>
  <div class="serverDeploy">
    <s-tab v-model="activeTab" type="card">
      <s-tab-pane label="用户关联配置">
        <s-row class="title">
          <span>用户识别方式</span>
        </s-row>
        <s-row class="body">
          <s-scrollbar wrap-class="deployScrollbar">
            <s-row>
              <s-row>
                <s-checkbox v-model="deploy[0].enabled" :true-label="1" :false-label="0" @change="checkChange(deploy[0].enabled, deploy[0].apputMode)">
                  从HTTP表单内容中提取
                </s-checkbox>
              </s-row>
              <s-row class="detail" v-show="deploy[0].enabled===1">
                <s-row class="header">
                  <span class="name">登录业务列表：</span>
                  <span class="float-right">
                <s-button @click="add('http')">添加</s-button>
                <s-button @click="study('http')">学习</s-button>
                <s-button @click="clearAll(deploy[0].apputMode)">全部清除</s-button>
              </span>
                </s-row>
                <s-table :data="deploy[0].data" max-height="300" style="width: 100%;">
                  <s-table-column label="登录页面" prop="bizPattern" show-overflow-tooltip></s-table-column>
                  <s-table-column label="用户名域" prop="usernameKey" show-overflow-tooltip></s-table-column>
                  <s-table-column label="操作" width="120px" align="center">
                    <template slot-scope="scope">
                      <i class="iconfont icon-edit" title="编辑" @click="rowEdit(scope.row, 'http')"></i>
                      <i class="iconfont icon-delete" title="删除" @click="rowDel(scope.row, 'http')"></i>
                    </template>
                  </s-table-column>
                </s-table>
              </s-row>
            </s-row>
            <s-row>
              <s-row>
                <s-checkbox v-model="deploy[1].enabled" :true-label="1" :false-label="0" @change="checkChange(deploy[1].enabled, deploy[1].apputMode)">
                  从业务系统交互数据中提取
                </s-checkbox>
              </s-row>
              <s-row class="detail" v-show="deploy[1].enabled===1">
                <s-row class="header">
                  <span class="name">登录业务列表：</span>
                  <span class="float-right">
                <s-button @click="add('busi')">添加</s-button>
                <s-button @click="clearAll(deploy[1].apputMode)">全部清除</s-button>
              </span>
                </s-row>
                <s-table :data="deploy[1].data" max-height="300" style="width: 100%;">
                  <s-table-column label="登录业务模式" prop="bizPattern"></s-table-column>
                  <s-table-column label="用户名模式" prop="usernamePattern"></s-table-column>
                  <s-table-column label="用户名位置" prop="usernameKey"></s-table-column>
                  <s-table-column label="操作" width="120px" align="center">
                    <template slot-scope="scope">
                      <i class="iconfont icon-edit" title="编辑" @click="rowEdit(scope.row, 'busi')"></i>
                      <i class="iconfont icon-delete" title="删除" @click="rowDel(scope.row, 'busi')"></i>
                    </template>
                  </s-table-column>
                </s-table>
              </s-row>
            </s-row>
            <s-row>
              <s-row>
                <s-checkbox v-model="deploy[2].enabled" :true-label="1" :false-label="0" @change="checkChange(deploy[2].enabled, deploy[2].apputMode)">
                  从认证服务器提取
                </s-checkbox>
              </s-row>
              <s-row class="detail" v-show="deploy[2].enabled===1">
                <span class="certificateServer">认证服务器：</span>
                <s-select v-model="deploy[2].data" @change="serverChange">
                  <s-option v-for="(option,index) in serverOptions" :key="'server' + index" :label="option.appName" :value="option.appId + ''"></s-option>
                </s-select>
              </s-row>
            </s-row>
            <s-row>
              <s-row>
                <s-checkbox v-model="deploy[3].enabled" :true-label="1" :false-label="0" @change="checkChange(deploy[3].enabled, deploy[3].apputMode)">
                  从关联数据库的连接信息中提取
                </s-checkbox>
              </s-row>
              <s-row class="detail" v-show="deploy[3].enabled===1">
                <div class="relateServerInfo">
                  <span class="declare">使用以下信息作为用户名称：</span>
                  <s-radio-group v-model="deploy[3].data" @change.native="relateDbChange">
                    <s-radio label="1">数据库连接账号</s-radio>
                    <s-radio label="2">客户端计算机名称（mysql数据库不适用）</s-radio>
                    <s-radio label="3">客户端计算机登录名（mysql数据库不适用）</s-radio>
                  </s-radio-group>
                </div>
              </s-row>
            </s-row>
            <s-row>
              <s-row>
                <s-checkbox v-model="deploy[4].enabled" :true-label="1" :false-label="0" @change="checkChange(deploy[4].enabled, deploy[4].apputMode)">
                  从关联数据库的SQL操作中提取
                </s-checkbox>
              </s-row>
              <s-row class="detail" v-show="deploy[4].enabled===1">
                <s-row class="header">
                  <span class="name">登录SQL列表：</span>
                  <span class="float-right">
                <s-button @click="add('sql')">添加</s-button>
                <s-button @click="study('sql')">学习</s-button>
                <s-button @click="clearAll(deploy[4].apputMode)">全部清除</s-button>
              </span>
                </s-row>
                <s-table :data="deploy[4].data" max-height="300" style="width: 100%;">
                  <s-table-column type="expand">
                    <template slot-scope="scope">
                      <s-row class="expandName">匹配方式:</s-row>
                      <s-row class="expandInfo">{{filterModel(scope.row.bizPatternType)}}</s-row>
                      <s-row class="expandName">匹配条件:</s-row>
                      <s-row class="expandInfo">{{scope.row.bizPattern}}</s-row>
                    </template>
                  </s-table-column>
                  <s-table-column label="SQL模式">
                    <template slot-scope="scope">
                      {{filterModel(scope.row.bizPatternType)}}{{scope.row.bizPattern}}
                    </template>
                  </s-table-column>
                  <s-table-column label="用户ID位置">
                    <template slot-scope="scope">
                      {{filterUser(scope.row.useridPattern)}}：{{scope.row.useridKey}}
                    </template>
                  </s-table-column>
                  <s-table-column label="	用户名位置" prop="usernamePattern">
                    <template slot-scope="scope">
                      {{filterUser(scope.row.usernamePattern)}}：{{scope.row.usernameKey}}
                    </template>
                  </s-table-column>
                  <s-table-column label="操作" width="120px" align="center">
                    <template slot-scope="scope">
                      <i class="iconfont icon-edit" title="编辑" @click="rowEdit(scope.row, 'sql')"></i>
                      <i class="iconfont icon-delete" title="删除" @click="rowDel(scope.row, 'sql')"></i>
                    </template>
                  </s-table-column>
                </s-table>
              </s-row>
            </s-row>
          </s-scrollbar>
        </s-row>
        <s-row class="foot">
          <s-button @click="tab1Save">保存</s-button>
        </s-row>
      </s-tab-pane>
      <s-tab-pane label="业务模式规则">
        <s-row class="title">
          <span>业务模式规则</span>
          <span class="right">
            <s-button @click="tab2Add">添加</s-button>
            <s-button @click="tab2DelBatch">删除</s-button>
            <s-button @click="tab2ClearAll">全部清除</s-button>
          </span>
        </s-row>
        <s-table :data="tab2List" max-height="600" style="width: 100%;" class="tab2Table" @selection-change="tab2SelectionChange">
          <s-table-column type="selection" width="80" align="center"></s-table-column>
          <s-table-column label="匹配模式" prop="pattern" show-overflow-tooltip></s-table-column>
          <s-table-column label="名称格式" prop="name" show-overflow-tooltip></s-table-column>
          <s-table-column label="备注" prop="remarks" show-overflow-tooltip></s-table-column>
          <s-table-column label="	操作" width="240px" align="center">
            <template slot-scope="scope">
              <i class="iconfont icon-edit" title="编辑" @click="tab2RowEdit(scope.row)"></i>
              <i class="iconfont icon-delete" title="删除" @click="tab2RowDel(scope.row)"></i>
              <i class="iconfont icon-most-top" title="移动到顶部" @click="tab2RowTop(scope.row)"></i>
              <i class="iconfont icon-most-bottom" title="移动到底部" @click="tab2RowBottom(scope.row)"></i>
            </template>
          </s-table-column>
        </s-table>
      </s-tab-pane>
      <s-tab-pane label="高级配置">
        <s-row class="title">
          <span>流量过滤</span>
        </s-row>
        <s-row class="flowFilter">
          <s-checkbox label="过滤非终端用户的数据库操作" v-model="tab3Data[0].value" true-label="1" false-label="0">
          </s-checkbox>
          <s-checkbox label="过滤非终端资产的数据库操作" v-model="tab3Data[1].value" true-label="1" false-label="0">
          </s-checkbox>
        </s-row>
        <s-row class="foot">
          <s-button @click="tab3Save">保存</s-button>
        </s-row>
      </s-tab-pane>
    </s-tab>

    <http-add-dialog v-if="deploy[0].addDialogFlag" v-model="deploy[0].addDialogFlag"
                     :current="deploy[0].current" @reload="axiosBusiList(deploy[0].apputMode)">
    </http-add-dialog>
    <busi-add-dialog v-if="deploy[1].addDialogFlag" v-model="deploy[1].addDialogFlag"
                     :current="deploy[1].current" @reload="axiosBusiList(deploy[1].apputMode)">
    </busi-add-dialog>
    <sql-add-dialog v-if="deploy[4].addDialogFlag" v-model="deploy[4].addDialogFlag"
                    :current="deploy[4].current" @reload="axiosBusiList(deploy[4].apputMode)">
    </sql-add-dialog>

    <!--学习弹框-->
    <http-study-dialog v-if="deploy[0].studyDialogFlag" v-model="deploy[0].studyDialogFlag"
                       @reload="axiosBusiList(deploy[0].apputMode)">
    </http-study-dialog>
    <sql-study-dialog v-if="deploy[4].studyDialogFlag" v-model="deploy[4].studyDialogFlag"
                      @reload="axiosBusiList(deploy[4].apputMode)">
    </sql-study-dialog>

    <!--选项卡2下的弹框-->
    <rule-add-dialog v-if="ruleAddDialogFlag" v-model="ruleAddDialogFlag"
                     :current="curRule" @reload="getTab2Data"></rule-add-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import httpAddDialog from './AuditDialog/HttpAddDialog';
  import busiAddDialog from './AuditDialog/BusiAddDialog';
  import sqlAddDialog from './AuditDialog/SqlAddDialog';
  import httpStudyDialog from './AuditDialog/HttpStudyDialog';
  import sqlStudyDialog from './AuditDialog/SqlStudyDialog';

  import ruleAddDialog from './AuditDialog/RuleAddDialog';

  export default {
    data() {
      return {
        activeTab: 0,
        appId: '',
        deploy: [
          {
            enabled: 0,
            apputMode: 1,
            data: [],
            current: {},
            addDialogFlag: false,
            studyDialogFlag: false
          },
          {
            enabled: 0,
            apputMode: 2,
            data: [],
            current: {},
            addDialogFlag: false,
            studyDialogFlag: false
          },
          {
            enabled: 0,
            apputMode: 4,
            data: '',
            defaultData: ''
          },
          {
            enabled: 0,
            apputMode: 8,
            data: ''
          },
          {
            enabled: 0,
            apputMode: 16,
            data: [],
            current: {},
            addDialogFlag: false,
            studyDialogFlag: false
          }
        ],
        modelOptions: [],
        userOptions: {},
        serverOptions: [],
        tab2List: [],
        tab2Selections: [],
        ruleAddDialogFlag: false,
        curRule: {},
        tab3Data: [
          {value: '0'},
          {value: '0'}
        ]
      }
    },
    computed: {
      apputModeArr() {
        return this.deploy.map(item => {
          return item.apputMode
        });
      }
    },
    created() {
      this.appId = this.$route.params.appId;
      // 获取从sql添加业务时页面上需要用到的下拉框列表,为了过滤sql列表的显示
      $axios.get(`/sysDbauditBusiness/getSqlSetting`).then(({data}) => {
        this.modelOptions = data.modeList;
        this.userOptions = data.positionList;
      });
      this.getTab1Data();
    },
    methods: {
      checkChange(val, apputMode) {
        if (val === 1) {
          this.getDetail(apputMode);
        }
      },
      filterModel(val) {
        if (this.modelOptions.length === 0) {
          return val;
        } else {
          return this.modelOptions.filter(item => {
            return item.value === val;
          })[0].name;
        }
      },
      filterUser(val) {
//        if (Object.keys(this.userOptions).length === 0) {
//          return val;
//        } else {
        if (val === '空或NULL') {
          return '无';
        } else if (val === '{param_by_index}') {
          return '参数';
        } else if (val === '{column_by_index}') {
          return '结果集';
        } else if (val === '{field_by_name}') {
          return '字段';
        }
//        }
      },
      getTab1Data() {
        $axios.get(`/sysDbauditBusiness/getAppSelect/${this.appId}`).then(({data}) => {
          data.forEach(item => {
            let index = this.apputModeArr.indexOf(item.apputMode);
            if (index !== -1) {
              if (item.enabled === 1) {
                this.getDetail(item.apputMode);
                this.deploy[index].enabled = item.enabled;
              }
            }
          });
        });
      },
      getTab2Data() {
        $axios.get(`/sysDbauditBusiness/getRuleListByAppid/${this.appId}`).then(({data}) => {
          this.tab2List = data;
        });
      },
      getTab3Data() {
        $axios.get(`sysDbauditBusiness/getConfByUuid/${this.appId}`).then(({data}) => {
          if (data && data.length > 0) {
            let arr = [];
            data.forEach(item => {
              if (item.name === 'sql_filter.discard_unk_user') {
                arr[0] = item;
              } else if (item.name === 'sql_filter.discard_unk_dev') {
                arr[1] = item;
              }
            });
            this.tab3Data = arr;
          }
        });
      },
      getDetail(apputMode) {
        if (apputMode === 1 || apputMode === 2 || apputMode === 16) {
          this.axiosBusiList(apputMode);
        } else if (apputMode === 4) {
          this.axiosCertificateServer();
        } else {
          this.axiosRelateDb();
        }
      },
      tab2SelectionChange(selections) {
        this.tab2Selections = selections;
      },
      // 表格顶部按钮---------------------------------------------
      add(flag) {
        if (flag === 'http') {
          this.deploy[0].current = {};
          this.deploy[0].addDialogFlag = true;
        } else if (flag === 'busi') {
          this.deploy[1].current = {};
          this.deploy[1].addDialogFlag = true;
        } else if (flag === 'sql') {
          this.deploy[4].current = {};
          this.deploy[4].addDialogFlag = true;
        }
      },
      study(flag) {
        if (flag === 'http') {
          this.deploy[0].studyDialogFlag = true;
        } else if (flag === 'busi') {
          this.deploy[1].studyDialogFlag = true;
        } else if (flag === 'sql') {
          this.deploy[4].studyDialogFlag = true;
        }
      },
      clearAll(apputMode) {
        let index = this.apputModeArr.indexOf(apputMode);
        let idArr = this.deploy[index].data.map(item => {
          return item.apputDetailId;
        });
        if (!idArr || idArr.length === 0) {
          this.$message({message: '没有要清除的数据!', type: 'warning'});
          return;
        }
        this.axiosDelBatch(idArr, apputMode);
      },
      tab2Add() {
        this.curRule = {};
        this.ruleAddDialogFlag = true;
      },
      tab2DelBatch() {
        if (this.tab2Selections.length === 0) {
          this.$message({showClose: true, message: '请先选择规则!', type: 'info'});
          return;
        }
        this.axiosRuleDel(this.tab2Selections.map(item => {
          return item.templateId;
        }));
      },
      tab2ClearAll() {
        $axios.get(`/sysDbauditBusiness/delAllRuleByAppid/${this.appId}`).then(({data}) => {
          if (data === true) {
            this.$message({showClose: true, message: '删除成功!', type: 'success'});
            this.getTab2Data();
          } else {
            this.$message({showClose: true, message: '删除失败!', type: 'error'});
          }
        });
      },
      // 行内操作------------------------------------------------
      rowEdit(row, flag) {
        if (flag === 'http') {
          this.deploy[0].current = row;
          this.deploy[0].addDialogFlag = true;
        } else if (flag === 'busi') {
          this.deploy[1].current = row;
          this.deploy[1].addDialogFlag = true;
        } else if (flag === 'sql') {
          this.deploy[4].current = row;
          this.deploy[4].addDialogFlag = true;
        }
      },
      rowDel(row) {
        this.axiosDel(row.apputDetailId, row.apputMode);
      },
      serverChange(val) {
        if (val === this.deploy[2].defaultData) {
          return false;
        }
        let param = {
          appId: this.appId,
          param1: val
        };
        $axios.post(`/sysDbauditBusiness/saveAppBusiness`, param).then(({data}) => {
          if (data === true) {
            this.$message({showClose: true, message: '保存成功!', type: 'success'});
          } else {
            this.$message({showClose: true, message: '保存失败!', type: 'error'});
          }
        });
      },
      relateDbChange(val) {
        let param = {
          appId: this.appId,
          param1: this.deploy[3].data
        };
        $axios.post(`/sysDbauditBusiness/saveDbBusiness`, param).then(({data}) => {
          if (data === true) {
            this.$message({showClose: true, message: '保存成功!', type: 'success'});
          } else {
            this.$message({showClose: true, message: '保存失败!', type: 'error'});
          }
        });
      },
      tab2RowEdit(row) {
        this.curRule = Object.assign({}, row);
        this.ruleAddDialogFlag = true;
      },
      tab2RowDel(row) {
        this.axiosRuleDel([row.templateId]);
      },
      tab2RowTop(row) {
        let templateIdArr = this.tab2List.map(item => {
          return item.templateId;
        });
        let index = templateIdArr.indexOf(row.templateId);
        if (index === 0) {
          this.$message({showClose: true, message: '已经在第一条!', type: 'info'});
          return;
        }
        this.axiosRuleMove('up', row.templateId);
      },
      tab2RowBottom(row) {
        let templateIdArr = this.tab2List.map(item => {
          return item.templateId;
        });
        let index = templateIdArr.indexOf(row.templateId);
        if (index === templateIdArr.length - 1) {
          this.$message({showClose: true, message: '已经在最后一条!', type: 'info'});
          return;
        }
        this.axiosRuleMove('down', row.templateId);
      },
      // 底部操作---------------------------------------
      tab1Save() {
        let param = [];
        this.deploy.forEach(item => {
          param.push({
            appId: this.appId,
            apputMode: item.apputMode,
            enabled: item.enabled
          });
        });
        $axios.post(`/sysDbauditBusiness/saveAppSelect`, param).then(({data}) => {
          if (data === true) {
            this.$message({showClose: true, message: '保存成功!', type: 'success'});
          } else {
            this.$message({showClose: true, message: '保存失败!', type: 'error'});
          }
        })
      },
      tab3Save() {
        let param = JSON.parse(JSON.stringify(this.tab3Data));
        param.map((item, index) => {
          item.appId = this.appId;
          item.name = index === 0 ? 'sql_filter.discard_unk_user' : 'sql_filter.discard_unk_dev';
          return item;
        });
        $axios.post(`/sysDbauditBusiness/saveConfig`, param).then(({data}) => {
          if (data === true) {
            this.$message({showClose: true, message: '保存成功!', type: 'success'});
            this.getTab3Data();
          } else {
            this.$message({showClose: true, message: '保存失败!', type: 'error'});
          }
        })
      },
      // 根据用户识别方式查询不同的业务列表
      axiosBusiList(apputMode) {
        let param = {
          condition: {
            appId: this.appId,
            apputMode: apputMode
          }
        };
        $axios.post(`/sysDbauditBusiness/getBusinessListByMode`, param).then(({data}) => {
          let index = this.apputModeArr.indexOf(apputMode);
          this.deploy[index].data = data;
        });
      },
      axiosCertificateServer() {
        $axios.get(`/sysDbauditBusiness/getAllVApp`).then(({data}) => {
          this.serverOptions = data;
        });
        $axios.get(`/sysDbauditBusiness/getVAppSel/${this.appId}`).then(({data}) => {
          this.deploy[2].defaultData = data;
          this.deploy[2].data = data;
        });
      },
      axiosRelateDb() {
        $axios.get(`/sysDbauditBusiness/getVAppDBSel/${this.appId}`).then(({data}) => {
          this.deploy[3].data = data;
        });
      },
      axiosDel(id, apputMode) {
        this.$confirm('确定删除?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.get(`/sysDbauditBusiness/delBusinessById/${id}`).then(({data}) => {
            if (data === true) {
              this.$message({showClose: true, message: '删除成功!', type: 'success'});
              this.axiosBusiList(apputMode);
            } else {
              this.$message({showClose: true, message: '删除失败!', type: 'error'});
            }
          });
        }).catch(() => {})
      },
      axiosDelBatch(idArr, apputMode) {
        this.$confirm('确定删除?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.post(`/sysDbauditBusiness/delBusinessBatch`, idArr).then(({data}) => {
            if (data === true) {
              this.$message({showClose: true, message: '删除成功!', type: 'success'});
              this.axiosBusiList(apputMode);
            } else {
              this.$message({showClose: true, message: '删除失败!', type: 'error'});
            }
          });
        }).catch(() => {})
      },
      axiosRuleDel(param) {
        this.$confirm('确定删除?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.post(`/sysDbauditBusiness/delRuleByIds`, param).then(({data}) => {
            if (data === true) {
              this.$message({showClose: true, message: '删除成功!', type: 'success'});
              this.getTab2Data();
            } else {
              this.$message({showClose: true, message: '删除失败!', type: 'error'});
            }
          });
        }).catch(() => {})
      },
      axiosRuleMove(mode, templateId) {
        $axios.get(`/sysDbauditBusiness/changeOrder/${mode}/${templateId}`).then(({data}) => {
          if (data === true) {
            this.getTab2Data();
          }
        });
      }
    },
    watch: {
      activeTab(val) {
        switch (val) {
          case 0:
            this.getTab1Data();
            break;
          case 1:
            this.getTab2Data();
            break;
          case 2:
            this.getTab3Data();
            break;
        }
      }
    },
    components: {
      httpAddDialog,
      busiAddDialog,
      sqlAddDialog,
      httpStudyDialog,
      sqlStudyDialog,
      ruleAddDialog
    }
  }
</script>

<style lang="stylus">
 /* .serverDeploy
    padding 15px
    position relative
    .s-row
      margin-bottom 0
    .back
      float: right
      transform translateX(-100%)
    .title
      font-weight 700
      height 36px
      line-height 36px
      color: #5781AD
      font-size 16px
      border-bottom: 1px solid rgba(84, 97, 131, 0.5)
      .right
        float: right
        .s-button
          vertical-align top
          &:not(:last-child)
            margin-right 5px
    .s-tabs .s-tabs-content
      padding 0 15px
    .foot
      margin-top: 10px

    .body
      padding 10px 0px 10px 20px
      .deployScrollbar
        padding 15px 17px 15px 0
        max-height 600px
        background #03050d
      .detail
        padding 12px 8px
        .header
          &:after
            body: ''
            display block
            overflow hidden
            clear both
          .name
            font-weight 700
            height 36px
            line-height 36px
            font-size 14px
          .float-right
            float: right;
        .certificateServer
          width: 120px
          display inline-block
          font-size 14px
        .relateServerInfo
          border: 1px solid rgba(84, 97, 131, 0.5)
          position relative
          padding 15px 30px
          margin-top: 10px
          .declare
            position absolute
            top: 0px
            left: 10px
            transform translateY(-50%)
            font-size 14px
            font-weight 600
            background #000009
            padding 0 3px
          .s-radio
            width: 100%
            margin-top 8px
            & + .s-radio
              margin-left 0
    .tab2Table
      margin-top 10px

    .s-table-expanded-cell
      .expandName
        font-weight 600
        height: 30px
        line-height 30px
      .expandInfo
        line-height 25px

    .flowFilter
      padding 10px 0 10px 20px
      .s-checkbox
        height: 36px
        line-height 36px
        width: 100%
        & + .s-checkbox
          margin-left 0

*/
</style>
