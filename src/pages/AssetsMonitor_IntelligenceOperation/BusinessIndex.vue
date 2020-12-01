<template>
  <div id="infoDetail"  style="width: calc(100%)">
    <s-row>
      <s-form :inline="true" :model="searchForm" label-width="100px" class="search_form">
        <div>
          <s-form-item label="IP地址:" class="sameRow ip-label">
            <s-select v-model="searchForm.ipAddress" value-key="uuid" :clearable="searchForm.ipAddress ? true : false" filterable>
              <s-option :label="item.controlAdderss+'('+item.itcompName+')'" :value="item"
                        v-for="(item, index) in assetList" :key="index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="监控项类型:" class="sameRow moniton-input">
            <s-select v-model="searchForm.monitorType" :clearable="searchForm.monitorType ? true : false">
              <s-option :label="option" :value="index" v-for="(option,index) in searchOptions.monitorTypes"
                        :key="index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="监控项名称:" class="sameRow">
            <s-select v-model="searchForm.monitorId" :clearable="searchForm.monitorId ? true : false">
              <s-option :label="option.monitorName" :value="option.id + ''"
                        v-for="(option,index) in searchOptions.monitorItems[searchForm.monitorType]"
                        :key="index">
                <span v-html="option.monitorName"></span>
              </s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="选择时间:">
            <s-date-picker v-model="searchForm.bTime"
               type="datetime"
               value-format="yyyy-MM-dd HH:mm:ss"
               format="yyyy-MM-dd HH:mm:ss"
               placeholder="选择起始时间"
               :editable="false"
               @change="getStartTime">
            </s-date-picker>
            ~
            <s-date-picker v-model="searchForm.eTime"
               type="datetime"
               value-format="yyyy-MM-dd HH:mm:ss"
               format="yyyy-MM-dd HH:mm:ss"
               placeholder="选择结束时间"
               :editable="false"
               @change="getEndTime">
            </s-date-picker>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button icon="magnifier" title="查询" @click="trendSearch()">查询</s-button>
        </div>
      </s-form>
    </s-row>
    <s-row class="chartBox">
      <div v-for="(trend,name,index) in trendCharts" v-if="Object.keys(trendCharts).length" :key="name" class="trendBox">
        <span class="trendTitle">{{templateName + name}}</span>
        <s-chart :chart="getTrend(trend, index)" class="trendChart" style="width:100%"></s-chart>
      </div>
      <div v-nodata="true" v-if="!(Object.keys(trendCharts).length)" style="height: 200px;"></div>
    </s-row>
    <s-row>
      <s-form :rules="formRule" :inline="true" :model="searchForm" label-width="110px" class="search_form" style="margin: 10px 0;">
        <div>
          <s-form-item label="主机名/IP:" prop="assetParam">
            <s-input v-model="searchForm.assetParam" placeholder="请输入IP地址" style="width:170px;"></s-input>
          </s-form-item>
          <s-form-item label="发生时间:">
            <s-date-picker
              style="width: 170px"
              type="datetime"
              placeholder="选择起始时间"
              v-model="searchForm.startTime"
              :editable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="disableAfterToday1"
              @change="getDateRangeStart">
            </s-date-picker>
            ~
            <s-date-picker
              style="width: 170px"
              type="datetime"
              placeholder="选择结束时间"
              v-model="searchForm.endTime"
              :editable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="disableAfterToday2"
              @change="getDateRangeEnd">
            </s-date-picker>
          </s-form-item>
          <s-form-item label="异常信息及描述:" prop="eventDesc">
            <s-input v-model="searchForm.eventDesc" placeholder="请输入告警信息" style="width:170px;"></s-input>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button icon="magnifier" title="查询" @click="axiosSetHistoryParam()">查询</s-button>
        </div>
      </s-form>
      <s-dropdown @on-click="batchHandler">
        <s-button icon="backup">
          批量操作<i class="iconfont icon-bottom"></i>
        </s-button>
        <s-dropdown-menu slot="list">
          <s-dropdown-item @click.native="scriptBatch" name="blank"><i class="iconfont icon-lightning" style="margin-right: 10px;"></i>执行脚本</s-dropdown-item>
          <s-dropdown-item @click.native="pollingBatch" name="offline"><i class="iconfont icon-inspection" style="margin-right: 10px;"></i>执行巡检</s-dropdown-item>
          <s-dropdown-item @click.native="ignoreBatch" name="unbind"><i class="iconfont icon-reducing" style="margin-right: 10px;"></i>忽略</s-dropdown-item>
          <s-dropdown-item @click.native="desBatch" name="des"><i class="iconfont icon-edit" style="margin-right: 10px;"></i>备注</s-dropdown-item>
        </s-dropdown-menu>
      </s-dropdown>
      <RealPageTable
         @selection-change="selectionChange"
         :ajax-obj="axiosHistoryObj"
         @filter-change="filterType"
         @row-click="rowClick">
        <s-table-column type="selection" :selectable="isSelectable" width="45"></s-table-column>
        <s-table-column label="状态" :filters="filters" column-key="status" prop="status" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">新建</span>
            <span v-if="scope.row.status === 2">持续中</span>
            <span v-if="scope.row.status === 3">已恢复</span>
            <span v-if="scope.row.status === 4">已修复</span>
            <span v-if="scope.row.status === 5">已忽略</span>
          </template>
        </s-table-column>
        <s-table-column label="异常ID" prop="id"></s-table-column>
        <s-table-column label="主机名" prop="assetName"></s-table-column>
        <s-table-column label="IP地址" prop="assetIp"></s-table-column>
        <s-table-column label="发生时间" prop="createTimeStr"></s-table-column>
        <s-table-column label="持续时间" prop="durationStr"></s-table-column>
        <s-table-column label="异常信息及描述" prop="eventDesc"></s-table-column>
        <s-table-column label="异常等级" prop="eventLevelStr"></s-table-column>
        <s-table-column label="操作">
          <template slot-scope="scope">
            <button-set :scope="scope" :btnData="btnData()" :option="tableOption"></button-set>
          </template>
        </s-table-column>
      </RealPageTable>
    </s-row>
    <!--查看详情弹框-->
    <s-dialog
      v-model="viewDialogFlag"
      v-if="viewDialogFlag"
      title="查看详情"
      top="10vh"
      id="modelNumberDialog"
      width="800px" append-to-body>
      <view-dialog :viewObj="viewObj"></view-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button :disabled="disabledFlag(viewObj)" @click="script(viewObj)">执行脚本</s-button>
        <s-button :disabled="disabledFlag(viewObj)" @click="polling(viewObj)">执行巡检</s-button>
        <s-button :disabled="disabledFlag(viewObj)" @click="ignore(viewObj)">忽略</s-button>
        <s-button :disabled="disabledFlag(viewObj)" @click="des(viewObj)">备注</s-button>
        <s-button type="cancel" @click="viewDialogFlag=false">关闭</s-button>
      </template>
    </s-dialog>
    <!--添加备注弹框-->
    <s-dialog
      v-model="desDialogFlag"
      v-if="desDialogFlag"
      title="添加备注"
      top="10vh"
      width="800px" append-to-body>
      <des-dialog :viewObj="desObj" :current="current" ref="desDialog"></des-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="dialogOk(desObj)">保存</s-button>
        <s-button type="cancel" @click="desDialogFlag=false">取消</s-button>
      </template>
    </s-dialog>
    <!--批量添加备注弹框-->
    <s-dialog
      v-model="desDispatchDialogFlag"
      v-if="desDispatchDialogFlag"
      title="批量添加备注"
      top="10vh"
      width="800px" append-to-body>
      <des-dialog :viewObj="desObj" :current="current" ref="desDialog"></des-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="dialogOk(desObj)">保存</s-button>
        <s-button type="cancel" @click="desDispatchDialogFlag=false">取消</s-button>
      </template>
    </s-dialog>
    <!--执行脚本弹框-->
    <s-dialog
      v-model="scriptExeDialog"
      v-if="scriptExeDialog"
      top="12vh"
      title="执行脚本"
      width="800px" append-to-body>
      <script-execute
        type="single"
        :exeingHostsData="exeingHostsData"></script-execute>
    </s-dialog>
    <!--执行巡检弹框-->
    <s-dialog
      v-model="pollDialogFlag"
      v-if="pollDialogFlag"
      top="12vh"
      title="执行巡检"
      width="800px" append-to-body>
      <poll-dialog :viewObj="pollObj" :current="currentPollObj" ref="pollingDialog"></poll-dialog>
    </s-dialog>
  </div>
</template>

<script>
  import buttonSet from '@/components/tableHandleHidden/buttonSet';
  // import searchBox from '@/components/tableCom/src/SearchBox';
  // import inputTree from '@/components/inputTree/InputTree';
  import $axios from 'sunflower-ajax';

  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  // import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  import ViewDialog from './dialog/ViewDialog';
  import DesDialog from './dialog/DesDialog';
  import PollDialog from './dialog/PollDialog';
  import ScriptExecute from './ScriptExecute';
  export default {
    data() {
      return {
        value: false,
        searchForm: {
          ipAddress: null,
          monitorType: null,
          monitorId: null,
          bTime: null,
          eTime: null,
          assetParam: null,
          orderType: null,
          startTime: null,
          endTime: null,
          eventDesc: null
        },
        templateName: '',
        nameData: '',
        formRule: {
          assetParam: [{max: 30, message: '不能超过30个字符', blur: 'trigger'}],
          eventDesc: [{max: 30, message: '不能超过30个字符', blur: 'trigger'}]
        },
        tableOption: {
          isHidden: true,
          showNum: 3,
          appendId: '.s-table',
          trigger: 'click',
          placement: 'left'
        },
        firstFlag: true,
        searchOptions: {
          monitorTypes: {},
          monitorItems: {}
        },
        axiosHistoryObj: {
          type: 'post',
          url: '/aiopsMonitorAlarm/getAiMonAlarmInfos',
          params: {
            condition: {}
          }
        },
        getHistoryFlag: false,
        list: [],
        selections: [],
        filters: [
          {text: '新建', value: 1},
          {text: '持续中', value: 2},
          {text: '已恢复', value: 3},
          {text: '已修复', value: 4},
          {text: '已忽略', value: 5}
        ],
        statusList: [1, 2, 3, 4, 5],
        trendCharts: {},
        criteria: {                 // 真分页分页数据
          condition: {},
          currentPage: 1,
          pageSize: 10,
          totalCount: 0
        },
        trendWidth: '',
        viewDialogFlag: false,
        viewObj: {},
        desObj: '',
        current: {},
        desDialogFlag: false,
        desDispatchDialogFlag: false,
        scriptExeDialog: false,
        pollObj: '',
        currentPollObj: {},
        pollDialogFlag: false,
        disableAfterToday1: {
          disabledDate(time) {
            return time.getTime() >= Date.now();
          }
        },
        disableAfterToday2: {
          disabledDate(time) {
            return time.getTime() >= Date.now()
          }
        },
        assetList: [],
        exeingHostsData: []
      }
    },
    computed: {
      comp() {
        // {monitorId: 10, monitorType: "cpu"}
        // 默认资产类型为windows
        // return {citypeUuid: '22e21df197c64bc6b7c6eacc1ee418eb', controlAdderss: '', uuid: ''};
        // 默认资产类型为pc服务器
        return {citypeUuid: 'fd1edc72265e4e099479619af7dbcfd7', controlAdderss: '', uuid: ''};
      }
    },
    methods: {
      btnData() {
        let vm = this;
        return [
          {
            icon: 'eye',
            name: '查看详情',
            handler: function (row, scope) {
              vm.scan(row)
            }
          },
          {
            icon: 'reducing',
            name: '忽略',
            handler: function (row, scope) {
              vm.ignore(row)
            },
            v_if: function (row, scope) {
              return row.status !== 5
            }
          },
          {
            icon: 'edit',
            name: '备注',
            handler: function (row, scope) {
              vm.des(row);
            },
            v_if: function (row, scope) {
              return row.status !== 5
            }
          },
          {
            icon: 'lightning',
            name: '执行脚本',
            handler: function (row, scope) {
              vm.script(row)
            },
            v_if: function (row, scope) {
              return row.status !== 5
            }
          },
          {
            icon: 'inspection',
            name: '执行巡检',
            handler: function (row, scope) {
              vm.polling(row)
            },
            v_if: function (row, scope) {
              return row.status !== 5
            }
          }
        ]
      },
      // 状态筛选
      filterType(val) {
        this.statusList = val.status
        this.axiosSetHistoryParam()
      },
      // 点击表格的某一行，过滤上面的图表
      rowClick(row) {
        this.searchForm.ipAddress = {controlAdderss: row.assetIp, itcompName: row.assetName, uuid: row.itcompUuid, itcompTemplate: ''}
        this.$nextTick(() => {
          this.searchForm.monitorType = row.monitorType
          this.searchForm.monitorId = row.monitorId
          $axios.get(`/aiopsMonitorAlarm/getAssetTemplate/${row.itcompUuid}`).then(res => {
            this.searchForm.ipAddress.itcompTemplate = res.data
            this.axiosAll();
          })
        })
      },
      disabledFlag(viewObj) {
        let flag = false
        if (viewObj.status === 5) {
          flag = true
        } else {
          flag = false
        }
        return flag
      },
      /* 是否可以勾选 */
      isSelectable(row) {
        let flag;
        (row.status === 5) ? flag = false : flag = true
        return flag
      },
      // 批量执行脚本
      scriptBatch() {
        if (this.selections.length <= 0) {
          this.$message({
            showClose: true,
            message: '至少选择一项执行脚本！',
            type: 'info'
          });
        } else {
          this.exeingHostsData = this.selections;
          this.scriptExeDialog = true;
        }
      },
      // 批量执行巡检
      pollingBatch() {
        if (this.selections.length <= 0) {
          this.$message({
            showClose: true,
            message: '至少选择一项执行巡检！',
            type: 'info'
          });
        } else {
          this.pollObj = ''
          this.currentPollObj = this.selections
          this.pollDialogFlag = true
        }
      },
      // 批量忽略
      ignoreBatch() {
        if (this.selections.length <= 0) {
          this.$message({
            showClose: true,
            message: '至少选择一项忽略！',
            type: 'info'
          });
        } else {
          this.$confirm('确认本次忽略?', '忽略', {
            confirmButtonText: '保存',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let uuidList = {
              uuidList: []
            }
            this.selections.map(item => {
              uuidList.uuidList.push(item.uuid)
            })
            $axios.post('/aiopsMonitorAlarm/ignoreAlarmInfos', uuidList, {
              data: this.selections,
              logTemplate: '忽略|智能运维中心>异常ID(#id#)'
            }).then(({data, status}) => {
              if (status === 200 && data.state === true) {
                this.$message({
                  showClose: true,
                  message: '忽略成功！',
                  type: 'success'
                });
              } else {
                this.$message({
                  showClose: true,
                  message: '忽略失败！',
                  type: 'error'
                });
              }
              this.axiosSetHistoryParam();
              this.selections = []
            });
          }).catch(() => {});
        }
      },
      // 批量备注
      desBatch() {
        if (this.selections.length <= 0) {
          this.$message({
            showClose: true,
            message: '至少选择一项添加备注！',
            type: 'info'
          });
        } else {
          this.desObj = ''
          this.current = {}
          this.desDispatchDialogFlag = true
        }
      },
      // 查看详情
      scan(row) {
        this.viewObj = row
        this.viewDialogFlag = true
      },
      // 忽略
      ignore(row) {
        this.$confirm('确认本次忽略?', '忽略', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let uuidList = {
            uuidList: [row.uuid]
          }
          $axios.post('/aiopsMonitorAlarm/ignoreAlarmInfos', uuidList, {
            data: [row],
            logTemplate: '忽略|智能运维中心>异常ID(#id#)'
          }).then(({data, status}) => {
            if (status === 200 && data.state === true) {
              this.$message({
                showClose: true,
                message: '忽略成功！',
                type: 'success'
              });
              this.axiosSetHistoryParam();
            } else {
              this.$message({
                showClose: true,
                message: '忽略失败！',
                type: 'error'
              });
            }
          });
        }).catch(() => {});
      },
      // 备注
      des(row) {
        this.desObj = row.uuid
        this.current = row
        this.desDialogFlag = true
      },
      dialogOk(uuid) {
        let params = {
          uuidList: [],
          comment: this.$refs.desDialog.form.comment
        }
        if (this.selections.length > 0) {
          this.selections.map(item => {
            params.uuidList.push(item.uuid)
          })
        } else {
          params.uuidList = [uuid]
        }
        this.$refs.desDialog.$refs.form.validate(valid => {
          if (valid) {
            let str = ''
            if (this.current && this.current.id) {
              str = this.current.id
            }
            $axios.post('/aiopsMonitorAlarm/saveCommentOnAlarms', params, {
              data: [],
              logTemplate: `备注|智能运维中心>异常ID(${str})`
            }).then(res => {
              if (res.data.state) {
                this.$message({
                  showClose: true,
                  message: res.data.errormsg,
                  type: 'success'
                });
                this.axiosSetHistoryParam()
                this.selections = []
                this.desDispatchDialogFlag = false
                this.desDialogFlag = false
              }
            })
          } else {
            this.$message.warning('请按要求填写！')
          }
        })
      },
      // 脚本执行
      script(row) {
        this.exeingHostsData = [row];
        this.scriptExeDialog = true;
      },
      // 执行巡检
      polling(row) {
        this.pollObj = row.uuid
        this.currentPollObj = [row]
        this.pollDialogFlag = true
      },
      batchHandler(name) {
        switch (name) {
          case 'black':
            break;
          case 'offline':
            break;
          case 'unbind':
            break;
          case 'des':
            break;
        }
      },
      getDateRangeStart(value) {
        this.disableAfterToday2 = {
          disabledDate(time) {
            return (time.getTime() > Date.now()) || value && (time.getTime() < new Date(value).getTime())
          }
        }
      },
      getDateRangeEnd(value) {
        this.disableAfterToday1 = {
          disabledDate(time) {
            return (time.getTime() > Date.now()) || value && (time.getTime() > new Date(value).getTime())
          }
        }
      },
      getStartTime(value) {
        let start = this.searchForm.bTime ? new Date(value).getTime() : 0
        let end = this.searchForm.eTime ? new Date(this.searchForm.eTime).getTime() : 0
        if (end) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.searchForm.bTime = null;
          } else {
            this.searchForm.bTime = value;
          }
        }
      },
      getEndTime(value) {
        let start = this.searchForm.bTime ? new Date(this.searchForm.bTime).getTime() : 0
        let end = this.searchForm.eTime ? new Date(value).getTime() : 0
        if (start) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.searchForm.eTime = null;
          } else {
            this.searchForm.eTime = value;
          }
        }
      },
      selectionChange(selections) {
        this.selections = selections
      },
      initDivWidth () {
        var boxCardItemWidth = document.getElementById('infoDetail').offsetWidth;
        this.trendWidth = boxCardItemWidth + 'px';
      },
      getIpItem(uuid, arr) {
        return arr.find(item => {
          return item.uuid === uuid;
        });
      },
      ipChange(val) {
        if (!val) return;
        let param = {
          cata: null,
          compId: this.searchForm.ipAddress.uuid,
          deviceType: null,
          deviceTypeId: 'fd1edc72265e4e099479619af7dbcfd7',
          monitorType: null,
          selectFlag: 'compFlag'
        };
        this.axiosOptions(param, data => {
          let monitorObj = ['cpu', 'disk', 'memory']
          for (let key in data.monitorTypes) {
            if (!monitorObj.includes(key)) {
              delete (data.monitorTypes[key])
            }
          }
          this.searchOptions.monitorTypes = data.monitorTypes || [];
          this.searchOptions.monitorItems = data.monitorItems || [];
          // this.searchForm.monitorType = Object.keys(data.monitorTypes || {})[0];
          // 连续切换ip时不会触发monitorTypeChange
          this.searchForm.monitorId = this.searchOptions.monitorItems[this.searchForm.monitorType] ? this.searchOptions.monitorItems[this.searchForm.monitorType][0].id + '' : '';
        });
      },
      trendSearch() {
        this.trendCharts = {};
        this.axiosAll();
        this.axiosSetHistoryParam()
        // 拼接图表名称
        this.templateName = ''
        if (this.nameData === 'disk') {
          this.templateName = '存储空间'
        } else if (this.nameData === 'cpu') {
          this.templateName = 'cpu'
        } else {
          this.templateName = ''
        }
      },
      getTrend(trend, index) {
        let chartData = trend.cap[0];
        return {
          name: 'trendChart' + index,
          type: 'areaChart',
          width: this.trendWidth,
          height: '300px',
          unit: chartData.unit,
          data: chartData.data,
          option: {
            dataZoom: {
              show: true
            }
          }
        }
      },
      getAssetList() {
        $axios.get(`/aiopsMonitorAlarm/getAssetByMonitorCitypeUuids`).then(({data}) => {
          this.assetList = data
          this.searchForm.ipAddress = null;
        });
      },
      axiosOptions(param, callback = function () {
      }) {
        $axios.post(`/resourcemanager/assetmanage/ciPanel/selectSeachParams`, param).then(({data}) => {
          callback(data);
        });
      },
      axiosAll() {
        if (this.searchForm.monitorId) {
          this.searchForm.bTime = this.searchForm.bTime ? this.searchForm.bTime : this.getLastMonthYestdy(new Date())
          this.searchForm.eTime = this.searchForm.eTime ? this.searchForm.eTime : this.formatDate()
          this.axiosChart();
        }
      },
      getLastMonthYestdy(date) { // 获取当前时间的上个月这一天
        var daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var strYear = date.getFullYear();
        var strDay = date.getDate();
        var strMonth = date.getMonth() + 1;
        var strHours = date.getHours();
        var strSeconds = date.getSeconds();
        var strMinutes = date.getMinutes();
        if (strYear % 4 === 0 && strYear % 100 !== 0) {
          daysInMonth[2] = 29;
        }
        if (strMonth - 1 === 0) {
          strYear -= 1;
          strMonth = 12;
        } else {
          strMonth -= 1;
        }
        strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
        if (strMonth < 10) {
          strMonth = '0' + strMonth;
        }
        if (strDay < 10) {
          strDay = '0' + strDay;
        }
        if (strHours < 10) {
          strHours = '0' + strHours;
        }
        if (strSeconds < 10) {
          strSeconds = '0' + strSeconds;
        }
        if (strMinutes < 10) {
          strMinutes = '0' + strMinutes;
        }
        let datastr = strYear + '-' + strMonth + '-' + strDay + ' ' + strHours + ':' + strMinutes + ':' + strSeconds;
        return datastr;
      },
      axiosChart() { // 获取趋势图
        $axios.get(`/resourcemanager/assetmanage/ciPanel/getTrend/${this.searchForm.ipAddress.itcompTemplate}/${this.searchForm.monitorType || undefined}/${this.searchForm.monitorId}/0/${this.searchForm.bTime || undefined}/${this.searchForm.eTime || undefined}/1`).then(({data}) => {
          this.trendCharts = data;
        });
      },
      axiosSetHistoryParam() {
        this.criteria.condition = {
          assetParam: this.searchForm.assetParam,
          startTime: parseInt(new Date(this.searchForm.startTime).getTime() / 1000),
          endTime: parseInt(new Date(this.searchForm.endTime).getTime() / 1000),
          eventDesc: this.searchForm.eventDesc,
          statusList: this.statusList
        }
        this.axiosHistoryObj.params.condition = Object.assign({}, this.criteria.condition);
      },
      formatDate() {
        let date = new Date()
        let _month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        let _date = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        let _hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        let _minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        let _second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
        let datastr = `${date.getFullYear()}-${_month}-${_date} ${_hour}:${_minute}:${_second}`
        return datastr
      },
      Format (strTime, fmt) {
        let newTime = strTime * 1000;
        let date = new Date(newTime);
        let o = {
          'M+': date.getMonth() + 1, // 月份
          'd+': date.getDate(), // 日
          'h+': date.getHours(), // 小时
          'm+': date.getMinutes(), // 分
          's+': date.getSeconds(), // 秒
          'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
          'S': date.getMilliseconds() // 毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        for (var k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
        return fmt;
      }
    },
    watch: {
      'searchForm.monitorType': {
        handler(val) {
          this.nameData = val
        }
      },
      'searchForm.ipAddress': {
        handler(val) {
          this.ipChange(val);
          this.searchForm.assetParam = val.controlAdderss
        }
      },
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
    mounted() {
      this.getDateRangeStart(this.searchForm.startTime)
      this.getDateRangeEnd(this.searchForm.endTime)
      this.initDivWidth();
      window.addEventListener('resize', this.initDivWidth);
      this.getAssetList()
    },
    destroyed() {
      window.removeEventListener('resize', this.initDivWidth);
    },
    components: {
      // searchBox,
      buttonSet,
      // inputTree,
      RealPageTable,
      // pageInfiniteTable,
      ViewDialog,
      DesDialog,
      ScriptExecute,
      PollDialog
    }
  }
</script>
<style>
  .searchFormChunk .ip-label .s-form-item-label{
    width: 60px!important;
  }
  .searchFormChunk .moniton-input .s-form-item-content{
    width: 150px!important;
  }
</style>
