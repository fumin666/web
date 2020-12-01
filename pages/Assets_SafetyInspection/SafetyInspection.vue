<template>
  <div class="login-set">
    <div class="safety-header">
      <s-row class="safety-requireTit">《GBT22239-2019信息安全技术网络安全等级保护基本要求》的安全通用要求规定：</s-row>
      <s-row class="safety-require" style="margin: 10px 0;">(1)应定期进行常规安全检查，检查内容包括系统日常运行、系统漏洞和数据备份等情况；</s-row>
      <s-row class="safety-require">(2)应制定安全检查表格实施安全检查，汇总安全检查数据，形成安全检查报告，并对安全检查结果进行通报。</s-row>
    </div>
    <div style="margin: 20px 0">
      <s-button icon="asset-inspection" :disabled="flag" @click="immediateExecution">立即执行</s-button>
      <s-button icon="set" @click="checkSet">检查设置</s-button>
      <s-button icon="download" @click="logDownload">报告下载</s-button>
      <s-button icon="nav-anquantongbao" @click="reportBulletin">报告通报</s-button>
    </div>
    <div class="safety-timeTit">
      <div class="safety-timeTit-sty" style="float: left;margin-right: 30px;">{{taskName}}</div>
      <div class="safety-timeTit-circle" style="float: left;">{{timerange}}</div>
    </div>
    <s-tab v-model="activeName">
      <s-tab-pane label="资产配置变更情况" :disabled="flag" name="assetConfig" v-if="judgeRoleBtn('assetsManage_assetConfChange') || judgeRoleBtn('gradeProtect_rsAssetConfChange')">
        <s-table-page :data="baselines" :header-search="defSearch()"
                      v-loading="loading"
                      v-if="activeName === 'assetConfig'"
                      :element-loading-text="elementText">
          <s-table-column label="资产名称" prop="assetName"></s-table-column>
          <s-table-column label="IP地址" prop="assetIp"></s-table-column>
          <s-table-column label="资产分类" prop="assetCitype"></s-table-column>
          <s-table-column label="配置变更数" prop="baselineAmount"></s-table-column>
          <s-table-column label="操作">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看" @click="scanConfig(scope.row)"> </i>
            </template>
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
      <s-tab-pane label="漏洞统计情况" :disabled="flag" name="bugCount" v-if="judgeRoleBtn('assetsManage_vulnerabilityStatistics') || judgeRoleBtn('gradeProtect_rsVulnerabilityStatistics')">
        <s-table-page :data="orderList" :header-search="defSearch()"
                      v-loading="loading"
                      v-if="activeName === 'bugCount'"
                      :element-loading-text="elementText">
          <s-table-column label="资产名称" prop="departName"></s-table-column>
          <s-table-column label="IP地址" prop="cmdName"></s-table-column>
          <s-table-column label="资产分类" prop="userCnt"></s-table-column>
          <s-table-column label="漏洞数量" prop="hostCnt"></s-table-column>
          <s-table-column label="操作">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看" @click="scanBug(scope.row)"> </i>
            </template>
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
      <s-tab-pane label="数据备份情况" :disabled="flag" name="dataCount" v-if="judgeRoleBtn('assetsManage_dataBackupStatus') || judgeRoleBtn('gradeProtect_rsDataBackupStatus')">
        <s-table-page :data="orderList" :header-search="defSearch()"
                      v-loading="loading"
                      v-if="activeName === 'dataCount'"
                      :element-loading-text="elementText">
          <s-table-column label="资产名称" prop="departName"></s-table-column>
          <s-table-column label="IP地址" prop="cmdName"></s-table-column>
          <s-table-column label="资产分类" prop="userCnt"></s-table-column>
          <s-table-column label="备份次数（次）" prop="hostCnt"></s-table-column>
          <s-table-column label="最新备份时间" prop="operationCnt"></s-table-column>
          <s-table-column label="最新备份文件" prop="operationCnt"></s-table-column>
        </s-table-page>
      </s-tab-pane>
      <s-tab-pane label="资产运行状况" :disabled="flag" name="assetOperation" v-if="judgeRoleBtn('assetsManage_operatingStatusAssets') || judgeRoleBtn('gradeProtect_rsOperatingStatusAssets')">
        <s-table-page :data="assetAvaInfos" :header-search="assetAvaInfosSearch()"
                      v-loading="loading"
                      v-if="activeName === 'assetOperation'"
                      :element-loading-text="elementText">
          <s-table-column label="资产名称" prop="assetName"></s-table-column>
          <s-table-column label="IP地址" prop="ipAddress"></s-table-column>
          <s-table-column label="资产分类" prop="assetType"></s-table-column>
          <s-table-column label="可用性" prop="avaStatus"></s-table-column>
          <s-table-column label="最近6h可用率" prop="ava_6"></s-table-column>
          <s-table-column label="最近12h可用率" prop="ava_12"></s-table-column>
          <s-table-column label="最近24h可用率" prop="ava_24"></s-table-column>
        </s-table-page>
      </s-tab-pane>
      <s-tab-pane label="资产监控信息统计情况" :disabled="flag" name="assetMonitor" v-if="judgeRoleBtn('assetsManage_monitorStatistical') || judgeRoleBtn('gradeProtect_rsMonitorStatistical')">
        <s-table-page :data="assetEvents"
                      v-loading="loading"
                      v-if="activeName === 'assetMonitor'"
                      :element-loading-text="elementText">
          <s-table-column label="监控类型" prop="citypeName"></s-table-column>
          <s-table-column label="异常" prop="offlineCount"></s-table-column>
          <s-table-column label="告警" prop="alertCount"></s-table-column>
          <s-table-column label="正常" prop="normalCount"></s-table-column>
        </s-table-page>
      </s-tab-pane>
      <s-tab-pane label="安全加固检查情况" :disabled="flag" name="safetyCheck" v-if="judgeRoleBtn('assetsManage_securityReinforce') || judgeRoleBtn('gradeProtect_rsSecurityReinforce')">
        <s-table-page :data="sysFastens" :header-search="defSearch()"
                      v-loading="loading"
                      v-if="activeName === 'safetyCheck'"
                      :element-loading-text="elementText">
          <s-table-column label="资产名称" prop="assetName"></s-table-column>
          <s-table-column label="IP地址" prop="assetIp"></s-table-column>
          <s-table-column label="资产分类" prop="assetCitype"></s-table-column>
          <s-table-column label="资产型号" prop="modelNumber"></s-table-column>
          <s-table-column label="合规数" prop="complianceNum"></s-table-column>
          <s-table-column label="不合规数" prop="noComplianceNum"></s-table-column>
          <s-table-column label="操作">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看" @click="scanSafety(scope.row)"> </i>
            </template>
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
    </s-tab>
    <s-dialog
      v-model="checkSetFlag"
      v-if="checkSetFlag"
      title="检查设置"
      append-to-body>
      <check-set-dialog ref="checkSet"></check-set-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveCheckSet">确定</s-button>
        <s-button type="cancel" @click="checkSetFlag = false">取消</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="configDialog"
      v-if="configDialog"
      title="配置变更详情"
      width="900px"
      append-to-body>
      <config-change :baselineData="baselineData"></config-change>
    </s-dialog>
    <s-dialog
      v-model="scanBugDialog"
      v-if="scanBugDialog"
      title="漏洞详情"
      width="800px"
      append-to-body>
      <scan-bug></scan-bug>
    </s-dialog>
    <s-dialog
      v-model="scanSafetyDialog"
      v-if="scanSafetyDialog"
      title="安全加固检查详情"
      width="800px"
      append-to-body>
      <scan-safety :scanSafetyData="scanSafetyData"></scan-safety>
    </s-dialog>
    <add-release-bulletin
      v-if="addReleaseBulletinFlag"
      v-model="addReleaseBulletinFlag"
      :bulletinTypeUuid="bulletinTypeUuid"
      :rowData="rowData"
      :safetyInspectionData="safetyInspectionData"
      @updateTable="getList"
    >
    </add-release-bulletin>
  </div>
</template>

<script>
  import checkSetDialog from './dialog/CheckSetDialog'
  import configChange from './dialog/ConfigChangeDetail'
  import scanBug from './dialog/ScanBugDetail'
  import scanSafety from './dialog/ScanSafetyDetail'
  import addReleaseBulletin from '@/pages/Safety_BulletinTask/components/dialog/AddReleaseBulletin'
  import $axios from 'sunflower-ajax';
  import {Download} from 'sunflower-common-utils';
  import { cloneDeep } from 'lodash';
  export default {
    data() {
      return {
        orderList: [],
        baselines: [],
        assetAvaInfos: [],
        assetEvents: [],
        sysFastens: [],
        checkSetFlag: false,
        activeName: 'assetConfig',
        configDialog: false,
        baselineData: [],
        scanBugDialog: false,
        scanSafetyDialog: false,
        scanSafetyData: [],
        elementText: '',
        loading: false,
        flag: false,
        taskName: '',
        bulletinTypeUuid: '',
        addReleaseBulletinFlag: false,
        rowData: {},
        safetyInspectionData: {},
        timerange: '',
        timer: 0
      }
    },
    methods: {
      immediateExecution() {
        this.loading = true
        this.flag = true
        this.elementText = '报告生成中，请稍后查看！'
        $axios.get('/safetyInspect/immediateExecuteInspect', {
          logTemplate: '执行|立即执行'
        }).then(res => {
          if (res.data.status) {
            this.timer = setInterval(() => {
              this.getData()
            }, 10000)
          } else {
            this.$message.info(res.data.message)
          }
        })
      },
      getData() {
        $axios.get('/safetyInspect/viewSafetyInspectResult').then(res => {
          if (res.data.status === 2) { // 执行完成
            this.taskName = res.data.data.taskInfo.taskName ? res.data.data.taskInfo.taskName : '安全报告'
            let startStr = res.data.data.taskInfo.dataStartTime ? res.data.data.taskInfo.dataStartTime : '--'
            let endStr = res.data.data.taskInfo.dataEndTime ? res.data.data.taskInfo.dataEndTime : '--'
            this.timerange = '(' + startStr + ' ~ ' + endStr + ')'
            this.baselines = res.data.data.baselines
            this.assetAvaInfos = res.data.data.assetAvaInfos
            this.assetEvents = res.data.data.assetEvents
            this.sysFastens = res.data.data.sysFastens
            this.loading = false
            this.flag = false
            clearInterval(this.timer)
          } else if (res.data.status === 1) { // 正在执行中
            this.flag = true
          } else { // 没有执行
            this.loading = false
            this.flag = false
          }
        })
      },
      formattScheduleTime(obj) {
        const notPeriod = ['timeType', 'firstFireTime']
        const dayKeys = ['timeType', 'firstFireTime', 'endFireTime', 'day']
        const dayKeysForever = ['timeType', 'firstFireTime', 'isForever', 'day']
        const weekKeys = ['timeType', 'firstFireTime', 'endFireTime', 'week', 'dayOfWeek']
        const weekKeysForever = ['timeType', 'firstFireTime', 'isForever', 'week', 'dayOfWeek']
        const monthKeys = ['timeType', 'firstFireTime', 'endFireTime', 'month', 'dayOfMonth']
        const monthKeysForever = ['timeType', 'firstFireTime', 'isForever', 'month', 'dayOfMonth']
        const yearKeys = ['timeType', 'firstFireTime', 'endFireTime', 'year', 'dayOfMonth', 'monthOfYear']
        const yearKeysForever = ['timeType', 'firstFireTime', 'isForever', 'year', 'dayOfMonth', 'monthOfYear']
        let newForm = cloneDeep(obj)
        if (newForm.isPeriodicTask === 0) {
          newForm.tScheduleTime = this.delNotNeedKey(notPeriod, newForm.tScheduleTime)
          newForm.tScheduleTime.timeType = 7
        } else {
          let type = newForm.tScheduleTime.timeType
          let forever = newForm.tScheduleTime.isForever
          if (type === 1) {
            if (forever === 1) {
              newForm.tScheduleTime = this.delNotNeedKey(dayKeysForever, newForm.tScheduleTime)
            } else {
              newForm.tScheduleTime = this.delNotNeedKey(dayKeys, newForm.tScheduleTime)
            }
          }
          if (type === 2) {
            if (forever === 1) {
              newForm.tScheduleTime = this.delNotNeedKey(weekKeysForever, newForm.tScheduleTime)
            } else {
              newForm.tScheduleTime = this.delNotNeedKey(weekKeys, newForm.tScheduleTime)
            }
          }
          if (type === 3) {
            if (forever === 1) {
              newForm.tScheduleTime = this.delNotNeedKey(monthKeysForever, newForm.tScheduleTime)
            } else {
              newForm.tScheduleTime = this.delNotNeedKey(monthKeys, newForm.tScheduleTime)
            }
          }
          if (type === 4) {
            if (forever === 1) {
              newForm.tScheduleTime = this.delNotNeedKey(yearKeysForever, newForm.tScheduleTime)
            } else {
              newForm.tScheduleTime = this.delNotNeedKey(yearKeys, newForm.tScheduleTime)
            }
          }
        }
        for (let key in newForm.tScheduleTime) {
          // 转日期为int
          if ((key === 'firstFireTime' || key === 'endFireTime') && newForm.tScheduleTime[key] !== null) {
            newForm.tScheduleTime[key] = parseInt(new Date(newForm.tScheduleTime[key]).getTime() / 1000)
          }
          // 转数组为字符串
          if ((key === 'dayOfWeek' || key === 'dayOfMonth') && newForm.tScheduleTime[key].length > 0) {
            newForm.tScheduleTime[key] = newForm.tScheduleTime[key].join(',')
          }
          // 依据不同情况删除多余字段
        }
        return newForm
      },
      delNotNeedKey(arr, target) {
        for (let key in target) {
          if (arr.indexOf(key) < 0) {
            delete target[key]
          }
        }
        return target
      },
      saveCheckSet() {
        let form = this.$refs['checkSet'].form
        console.log(this.formattScheduleTime(form));
        this.$refs['checkSet'].$refs['form'].validate(valid => {
          if (valid) {
            $axios.post('/safetyInspect/saveSafetyInspectConf', this.formattScheduleTime(form), {
              logTemplate: '设置|设置执行周期'
            }).then(res => {
              if (res.data.state) {
                this.$message.success('设置成功！')
              } else {
                this.$message.warning('设置失败！')
              }
            })
            this.checkSetFlag = false
          } else {
            this.$message.warning('请按要求填写！')
          }
        })
      },
      checkSet() {
        if (!this.flag) {
          this.checkSetFlag = true
        } else {
          this.$message.info('报告正在生成中，请稍后进行操作!')
        }
      },
      logDownload() {
        if (!this.flag) {
          $axios.post(`/safetyInspect/createSafetyInspectReportFile`).then(res => {
            if (res.data.state) {
              Download(`/safetyInspect//exportSafetyInspectReportFile/${res.data.fileName}`)
            } else {
              this.$message.warning(res.data.message)
            }
          })
        } else {
          this.$message.info('报告正在生成中，请稍后进行操作!')
        }
      },
      reportBulletin() {
        if (!this.flag) {
          $axios.get('/safetyInspect/uploadInspectFileToSafety').then(res => {
            if (res.data.state) {
              this.rowData = {}
              this.safetyInspectionData = res.data
              this.addReleaseBulletinFlag = true
              this.bulletinTypeUuid = ''
            } else {
              this.$message.warning(res.data.errormsg)
            }
          })
        } else {
          this.$message.info('报告正在生成中，请稍后进行操作!')
        }
      },
      getList() {
      },
      scanConfig(row) {
        this.baselineData = row.baselineDetail
        this.configDialog = true
      },
      scanBug(row) {
        this.scanBugDialog = true
      },
      scanSafety(row) {
        this.scanSafetyData = row.sysFastenDeatils
        this.scanSafetyDialog = true
      },
      defSearch() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询条件',
          searchProps: ['assetName', 'assetIp', 'assetCitype']
        }
      },
      assetAvaInfosSearch() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询条件',
          searchProps: ['assetName', 'ipAddress', 'assetType']
        }
      }
    },
    mounted() {
      this.getData()
    },
    components: {
      checkSetDialog,
      configChange,
      scanBug,
      scanSafety,
      addReleaseBulletin
    }
  }
</script>

<style scoped>
.safety-title{
  font-weight: 600;font-size: 14px;opacity: 0.65;
}
</style>
