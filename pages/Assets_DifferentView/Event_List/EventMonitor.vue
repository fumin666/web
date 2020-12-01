/**
* Created by dingyf on 2019/3/14.
* 资产事件信息视角-最新事件-监控事件//Q4高级搜索优化
*/
<template>
  <section id="monitorEvent">
    <s-row style="margin-bottom:4px;">
      <s-button class="fr" icon="nav-system-set" title="列设置" type="cancel" @click="showDynamicColSet"></s-button>
    </s-row>
    <s-row>
      <s-form :inline="true" class="search_form" label-width="65px" ref="searchGroupForm" :model="searchGroup" :rules="searchGroupRules">
        <div>
          <s-form-item label="事件级别:">
            <s-select v-model="searchGroup.level" placeholder="请选择"  clearable>
              <s-option
                v-for="(item, index) in levels"
                :label="item"
                :value="index"
                :key="'eventLevet' + index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="恢复状态:">
            <s-select v-model="searchGroup.isRecoveryIncident" placeholder="请选择" clearable>
              <s-option label="已恢复" :value="1" :key="'recover' + 1"></s-option>
              <s-option label="未恢复" :value="0" :key="'recover' + 0"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="流程状态:" v-if="WorkFlowAuth">
            <s-select v-model="searchGroup.eventOrderStatus" placeholder="请选择"  clearable>
              <s-option label="未进入" :value="0"></s-option>
              <s-option label="已进入" :value="1"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="更新时间:">
            <s-date-picker
              type="datetime"
              placeholder="选择起始时间"
              v-model="start_time"
              :editable="false"
              style="width:185px;"
              :picker-options="disableAfterToday1"
              @change="getDateRangeStart">
            </s-date-picker>
            ~
            <s-date-picker
              type="datetime"
              style="width:185px;"
              placeholder="选择结束时间"
              v-model="end_time"
              :editable="false"
              :picker-options="disableAfterToday2"
              @change="getDateRangeEnd">
            </s-date-picker>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button icon="magnifier" @click="searchHandler">查询</s-button>
        </div>
      </s-form>
    </s-row>
    <s-table-page
      border
      :key = "columnRefresh"
      :data="monitorList"
      :header-search='getListSearchDef()'>
      <s-table-column
        align="center"
        v-for="option in dynaColSetOptions"
        :label="option.colName"
        :prop="option.colKey"
        :key="option.colKey"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <img v-if="option.colKey === 'level'" :src="levelImgs[scope.row.level]" :alt="scope.row.levelStr" class="imgVertical">
          <span v-else-if="option.colKey==='createTimeStr'" v-text="formatDate(scope.row.createTime)"></span>
          <span v-else-if="option.colKey==='modifyTimeStr'" v-text="formatDate(scope.row.modifyTime)"></span>
          <span v-else v-text="scope.row[option.colKey]"></span>
        </template>
      </s-table-column>
      <s-table-column
        label="操作" width="180">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看" @click="showMonitorDetail(scope.row, scope.$index)"></i>
          <i v-if="WorkFlowAuth" :class="['iconfont', `icon-${scope.row.itilIncidentOrderUuid?'manage-process':'set-process'}`]"
             :title="scope.row.itilIncidentOrderUuid?'查看流程':'进入流程'"
             @click="handelProcess(scope.row, scope.$index)"></i>
        </template>
      </s-table-column>
    </s-table-page>

    <!--监控事件信息详情弹框-->
    <s-dialog
      width="800px"
      top="10%"
      v-if="monitorDetailFlag"
      v-model="monitorDetailFlag"
      title="监控事件信息"
      key="monitorDetail">
      <monitor-detail
        ref="monitorDetail"
        :detailData="monitorDetailData"
        @closeDialog="_closeDialog">
      </monitor-detail>
    </s-dialog>

    <!--表格动态列设置弹框-->
    <s-dialog
      width="200px"
      top="142px"
      class="dynaColSetDialog"
      v-if="dynaColSetDialog"
      v-model="dynaColSetDialog"
      title="表格列设置"
      key="dynaColSetDialog">
      <dynamic-col-set
        :eventType="1"
        @closeDynColSet="_closeDynColSet"></dynamic-col-set>
    </s-dialog>

    <!--最新事件手动创建事件单，进入itsm流程-->
    <s-dialog
      v-model="createEventOrderDialog"
      v-if="createEventOrderDialog"
      width="600px"
      top="10%"
      title="创建工单">
      <create-event-order ref="createEventOrder"></create-event-order>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveCreateEventOrder(6)">保存</s-button>
        <s-button type="cancel" @click="createEventOrderDialog = false">关闭</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  // import {batchUuid} from 'sunflower-common-utils'
  import {Validaters} from 'sunflower-common-utils'
  import mixin from '@/pages/Event_List/EventMixin'

  // import searchBox from '@/components/tableCom/src/SearchBox'
  import monitorDetail from '@/pages/Event_List/MonitorDetail.vue'
  import dynamicColSet from '@/pages/Event_List/DynamicColSet.vue'
  import auth from '@/common/mixins/auth.js'

  export default {
    data() {
      return {
        columnRefresh: 1, // 动态列变化重新加载表格
        monitorListOrigin: [],      // 监控事件列表初始值
        monitorList: [],            // 监控事件列表
        levels: ['未知', '正常', '提示', '警告', '次要', '主要', '严重'],
        levelImgs: ['../../../static/images/incident/weizhi.png',
          '../../../static/images/incident/zhengchang.png',
          '../../../static/images/incident/tishi.png',
          '../../../static/images/incident/jinggao.png',
          '../../../static/images/incident/ciyao.png',
          '../../../static/images/incident/zhuyao.png',
          '../../../static/images/incident/yanzhong.png'
        ],
        searchFlag: false,
        monitorDetailFlag: false,   // 监控事件详情弹框
        monitorDetailData: {},      // 监控事件详情数据
        searchKeyWord: '',          // 查询关键字
        disableAfterToday1: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        disableAfterToday2: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        start_time: this.getTodayZeroTime(),
        end_time: new Date(),
        searchGroup: {
          level: null,
          isRecoveryIncident: null,
          eventOrderStatus: null,
          start_time: parseInt(this.getTodayZeroTime().getTime() / 1000),
          end_time: parseInt(new Date().getTime() / 1000),
          itcompName: null,
          controlAdderss: null
        },
        searchGroupRules: {
          controlAdderss: [Validaters.IP]
        },
        criteria: {                 // 真分页分页数据
          itcompUuid: this.$route.params.assetUuid,
          condition: {},
          currentPage: 1,
          pageSize: 10,
          totalCount: 0
        }
      }
    },
    mixins: [mixin, auth],
    components: {
      monitorDetail,
      // searchBox,
      dynamicColSet
    },
    watch: {
      dynaColSetOptions () {
        ++this.columnRefresh;
        this.getList();
      }
    },
    methods: {
      /* 获取(刷新)监控事件列表 */
      getList() {
        let vm = this
        $axios.post('/incidentCount/incidentGroupList', vm.criteria).then((res) => {
          if (res.data && res.data instanceof Array) {
            res.data.forEach(item => {
              vm.$set(item, 'createTime_Str', vm.formatDate(item.createTime))
              vm.$set(item, 'modifyTime_Str', vm.formatDate(item.modifyTime))
              vm.$set(item, 'eventStatus_Str', vm.calEventStatus(item.status))
            })
            vm.monitorListOrigin = res.data;
            vm.monitorList = res.data;
            // [bug修改]更新列表时，结束时间未同步至当前最新时间，使部分数据被过滤不显示
            vm.end_time = new Date()
            vm.searchGroup.end_time = parseInt(new Date().getTime() / 1000 + 60)
            vm.searchPost()
            // vm.searchFlag = true
          }
        })
      },
      // 搜索功能初始化
      getListSearchDef() {
        return {
          show: false
        }
      },
      showMonitorDetail(row) {
        this.monitorDetailData = row
        this.$set(this.monitorDetailData, 'hideFooter', true)
        this.monitorDetailFlag = true
      },
      searchAction() {
        // let searchGroupObj = Object.assign({}, this.searchGroup)
      },
      showHideSearch() {
        this.searchFlag = !this.searchFlag
      },
      getDateRangeStart(val) {
        let self = this
        self.searchGroup.start_time = !val ? null : parseInt(new Date(self.start_time).getTime() / 1000)
        self.disableAfterToday2 = {
          disabledDate(time) {
            return time.getTime() > Date.now() || time.getTime() < new Date(self.start_time)
          }
        }
      },
      getDateRangeEnd(val) {
        let self = this
        self.searchGroup.end_time = !val ? null : parseInt(new Date(self.end_time).getTime() / 1000)
        self.disableAfterToday1 = {
          disabledDate(time) {
            return time.getTime() > Date.now() || time.getTime() > new Date(self.end_time)
          }
        }
      },
      disableStartDate(val) {
      },
      /* eslint-disable no-new */
      // 监控事件条件查询
      searchPost() {
        let monitorListTemp = []
        let keyLength = 0
        for (let item = 0, length = this.monitorListOrigin.length; item < length; item++) {
          keyLength = 0
          let flagCount = 0
          for (let key in this.searchGroup) {
            if (this.searchGroup[key] === '') {
              this.searchGroup[key] = null
            }
            if (Number.isNaN(this.searchGroup[key])) {
              this.searchGroup[key] = null
            }
            if (this.searchGroup[key] !== null && typeof this.searchGroup[key] === 'string') {
              this.searchGroup[key] = this.searchGroup[key].replace(/(^\s*)|(\s*$)/g, '')
            }
            if (this.searchGroup[key] !== null) {
              keyLength++
              if (key === 'end_time' || key === 'start_time') {
                if (this.searchGroup['start_time'] !== null && this.searchGroup['end_time'] !== null) {
                  if (this.monitorListOrigin[item]['modifyTime'] > this.searchGroup['start_time'] && this.monitorListOrigin[item]['modifyTime'] < this.searchGroup['end_time']) {
                    flagCount++
                  }
                } else {
                  if (this.searchGroup['start_time'] !== null) {
                    if (this.monitorListOrigin[item]['modifyTime'] > this.searchGroup['start_time']) {
                      flagCount++
                    }
                  } else {
                    if (this.monitorListOrigin[item]['modifyTime'] < this.searchGroup['end_time']) {
                      flagCount++
                    }
                  }
                }
              } else if (key === 'eventOrderStatus') {
                if ((this.monitorListOrigin[item]['itilIncidentOrderUuid'] && this.searchGroup['eventOrderStatus']) || (!this.monitorListOrigin[item]['itilIncidentOrderUuid'] && !this.searchGroup['eventOrderStatus'])) {
                  flagCount++
                }
              } else {
                let reg = new RegExp(this.searchGroup[key])
                if (reg.test(this.monitorListOrigin[item][key])) {
                  flagCount++
                }
              }
            }
          }
          if (flagCount && keyLength === flagCount) {
            monitorListTemp.push(this.monitorListOrigin[item])
          }
        }
        if (keyLength === 0) {
          monitorListTemp = this.monitorListOrigin
        }
        this.monitorList = monitorListTemp
      },
      // 点击手动查询按钮
      searchHandler() {
        this.$refs.searchGroupForm.validate((valid) => {
          if (valid) this.searchPost()
          else return false
        })
      },
      _closeDialog() {
        this.monitorDetailFlag = false
        this.getList()
      }
    },
    created() {
      console.log(1);
      if (this.$route.query && this.$route.query.ip) { // 从资产面板跳转过来
        this.searchGroup = Object.assign(this.searchGroup, {
          start_time: null,
          end_time: null,
          controlAdderss: this.$route.query.ip
        });
      }
      // 初始化监控事件列表
      this.getList();
      // 初始化动态列
      this.initItcompDynamicCol(1)
    }
  }
</script>
