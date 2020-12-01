<template>
  <div class="Monfrequency">
    <s-form ref="periodForm" :model="periodForm" :rules="periodDataRules">
      <s-form-item label='监控频率' prop='data'><br>
        <div class="monfre">
          <div class="frebox" :class="{'is-active': radio === MonitorPeriod.common_monitor_top}">
            <s-row>
              <s-col span='12' :class="{'is-bg': radio === MonitorPeriod.common_monitor_top}" class="defaultBg">高</s-col>
              <s-col span='12' style="text-align:center">
                <div style="height:35px;opacity: 0.65">{{MonitorPeriod.common_monitor_top}}秒</div>
                <div style="height:35px;"><i class="icon iconfont icon-frequency" style="font-size:30px;line-height:35px;opacity:0.25"></i></div>
              </s-col>
            </s-row>
            <s-radio class="radio bot" v-model="radio" :label="MonitorPeriod.common_monitor_top" ></s-radio>
          </div>
          <div class="frebox" :class="{'is-active': radio === MonitorPeriod.common_monitor_mid}">
            <s-row>
              <s-col span='12' :class="{'is-bg': radio === MonitorPeriod.common_monitor_mid}" class="defaultBg" style="">中</s-col>
              <s-col span='12' style="text-align:center">
                <div style="height:35px;opacity: 0.65">{{MonitorPeriod.common_monitor_mid}}秒</div>
                <div style="height:35px;"><i class="icon iconfont icon-frequency" style="font-size:30px;line-height:35px;opacity:0.25"></i></div>
              </s-col>
            </s-row>
            <s-radio class="radio bot" v-model="radio" :label="MonitorPeriod.common_monitor_mid" ></s-radio>
          </div>
          <div class="frebox" :class="{'is-active': radio === MonitorPeriod.common_monitor_low}">
            <s-row>
              <s-col span='12' :class="{'is-bg': radio === MonitorPeriod.common_monitor_low}" class="defaultBg">低</s-col>
              <s-col span='12' style="text-align:center">
                <div style="height:35px;opacity: 0.65">{{MonitorPeriod.common_monitor_low}}秒</div>
                <div style="height:35px;"><i class="icon iconfont icon-frequency" style="font-size:30px;line-height:35px;opacity:0.25"></i></div>
              </s-col>
            </s-row>
            <s-radio class="radio bot" v-model="radio" :label="MonitorPeriod.common_monitor_low" ></s-radio>
          </div>
        </div>
        <s-input class="rate" v-model="periodForm.data" :width='200'></s-input><s-tooltip effect="dark" content="监控频率越大，代表安全性与实时性越低；监控频率越小，代表安全性与实时性越高" placement="right"><span class="icon iconfont icon-help" style="margin-left:10px;color: #8494a3;"></span></s-tooltip>
      </s-form-item>
      <s-form-item>
        <s-button @click="periodSave">保存</s-button>
      </s-form-item>
    </s-form>
    <span style="color:#168bf5;font-size:14px;cursor: pointer;" @click='advanced'>高级设置</span>
    <div v-if='visible'>
      <div class="hint">高级设置可针对不同资产类型、型号或资产设置不同的监控频率。</div>
      <s-form :inline='true' class="search_form" style="margin-bottom:10px" label-width='80px'>
        <div>
          <s-form-item label="资产类型：">
            <input-tree v-model="criteria1.condition.ciTypeUuid" name="uuid" :data="searchOptions"
                        :props="defaultProps" :hasDelIcon="true"></input-tree>
          </s-form-item>
          <s-form-item label='资产名称：'>
            <s-input v-model="criteria1.condition.itcompName"></s-input>
          </s-form-item>
          <s-form-item label='IP地址：'>
            <s-input v-model="criteria1.condition.controlAdderss"></s-input>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button icon="magnifier" @click="getData">查询</s-button>
        </div>
      </s-form>
      <s-button class='icon iconfont icon-edit' @click="batchEdit">批量修改</s-button>
      <s-table :data="assetData" style="margin-top:10px;" max-height=500 @selection-change='handleSelect'>
        <s-table-column type="selection" width="45" align="center"></s-table-column>
        <s-table-column prop="citypeName" show-overflow-tooltip label="资产类型">
        </s-table-column>
        <s-table-column prop="productKeyName" show-overflow-tooltip label="型号">
        </s-table-column>
        <s-table-column prop="itcompName" show-overflow-tooltip label="资产名称  ">
        </s-table-column>
        <s-table-column prop="controlAdderss" show-overflow-tooltip label="IP地址">
        </s-table-column>
        <s-table-column prop="monitorRate" show-overflow-tooltip label="监控频率(秒)">
        </s-table-column>
        <s-table-column show-overflow-tooltip label="操作">
          <template slot-scope="scope">
            <i class="iconfont icon-edit" title="修改" @click="EditArchiving(scope.row)"></i>
          </template>
        </s-table-column>
      </s-table>
      <s-row class="pageRow">
        <s-pagination
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="criteria1.currentPage"
          :page-size="criteria1.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="criteria1.totalCount">
        </s-pagination>
      </s-row>
    </div>
    <s-dialog :title="flag === 'edit' ? '修改' : '批量修改'" v-model="batchEditDialog" v-if="batchEditDialog">
      <s-form ref="batchForm" :inline='true' :model="batchData" :rules="batchDataRules">
        <s-form-item label='监控频率:' prop="period">
          <s-input width=200 v-model="batchData.period"></s-input>
        </s-form-item>
        <s-form-item>
          <s-tooltip effect="dark" content="监控频率越大，代表安全性与实时性越低；监控频率越小，代表安全性与实时性越高" placement="right"><i class="icon iconfont icon-help" style="margin-left:10px"></i></s-tooltip>
        </s-form-item>
      </s-form>
      <div slot="footer" class="dialog-footer">
        <s-button @click="MonitorSave">保存</s-button>
        <s-button type="cancel" @click="batchEditDialog = false">关闭</s-button>
      </div>
    </s-dialog>
  </div>
</template>
<script>
  import $axios from 'sunflower-ajax'
  import inputTree from '@/components/inputTree/InputTree';
  import {Validaters} from 'sunflower-common-utils';
  export default {
    data() {
      return {
        radio: '',
        visible: false,
        assetData: [],
        criteria1: {                 // 真分页分页数据
          condition: {
            ciTypeUuid: '',
            itcompName: '',
            controlAdderss: ''
          },
          currentPage: 1,
          pageSize: 10,
          totalCount: 0
        },
        searchOptions: [],
        defaultProps: {
          children: 'childrenList',
          label: 'name'
        },
        selection: [],
        batchEditDialog: false,
        flag: 'edit',
        batchDataRules: {
          period: [
            {required: true, message: '请输入监控频率', trigger: 'blur'}, Validaters.MinNum(30)
          ]
        },
        periodDataRules: {
          data: [
            {required: true, message: '请输入监控频率', trigger: 'blur'}, Validaters.MinNum(30), Validaters.Number, Validaters.MaxNum(10000)
          ]
        },
        batchData: {
          period: '',
          uuids: []
        },
        MonitorPeriod: {
          common_monitor_top: '',
          common_monitor_mid: '',
          common_monitor_low: '',
          monitor_period: ''
        },
        levelName: '',
        periodForm: {
          data: ''
        }
      }
    },
    components: {
      inputTree
    },
    methods: {
      advanced() {
        this.visible = !this.visible
      },
      // 批量修改
      batchEdit() {
        if (this.selection.length < 1) {
          this.$message.error({message: '请至少选择一条数据进行修改'})
        } else {
          this.batchEditDialog = true
          this.flag = 'batchEdit'
          this.batchData.uuids = this.selection
        }
      },
      EditArchiving(row) {
        this.batchEditDialog = true
        this.flag = 'edit'
        this.batchData.uuids = [row.uuid]
      },
      periodSave() {
        this.$refs['periodForm'].validate(valid => {
          if (valid) {
            let arr = []
            arr.push(this.MonitorPeriod.common_monitor_low)
            arr.push(this.MonitorPeriod.common_monitor_top)
            arr.push(this.MonitorPeriod.common_monitor_mid)
            let flag = true
            arr.map(val => {
              if (val === this.periodForm.data) {
                flag = false
                if (this.radio === this.periodForm.data) {
                  flag = true
                }
              }
            })
            if (flag) {
              $axios.get(`/systemmanager/sysConfig/setCommonMonitorPeriod/${this.periodForm.data}/${this.levelName}`, {
                data: [],
                logTemplate: '编辑|监控频率设置'
              }).then(({data}) => {
                if (data.state === true) {
                  this.$message({
                    type: 'success',
                    message: '保存成功!'
                  })
                  this.getData()
                  this.getPeriod()
                } else {
                  this.$message({
                    type: 'error',
                    message: '保存失败，请重试！'
                  })
                }
              })
            } else {
              this.$message({
                type: 'error',
                message: '等级频率不能一致！'
              })
            }
          } else {
            return false
          }
        })
      },
      MonitorSave() {
        this.$refs['batchForm'].validate(valid => {
          if (valid) {
            $axios.post('/systemmanager/sysConfig/setSpecialMonitorPeriod', this.batchData).then(res => {
              let resData = res.data.state
              if (resData === true) {
                this.$message({
                  type: 'success',
                  message: '保存成功！'
                })
                this.batchEditDialog = false
                this.getData()
                this.batchData = {}
              } else {
                this.$message({
                  type: 'error',
                  message: '保存失败，请重试！'
                })
                this.batchData = {}
              }
            })
          } else {
            return false
          }
        })
      },
      getData() {
        let params = Object.assign({}, this.criteria1)
        $axios.post('/systemmanager/sysConfig/getMonitorItcomp', params).then(({data}) => {
          this.assetData = data.pageList
          this.criteria1.totalCount = data.totalCount
        })
      },
      handleSizeChange1(curPageSize) {
        this.criteria1.currentPage = 1;
        this.criteria1.pageSize = curPageSize;
        this.getData()
      },
      handleCurrentChange1(current) {
        if (current === this.criteria1.currentPage) return;
        this.criteria1.currentPage = current;
        this.getData()
      },
      handleSelect(val) {
        this.selection = val.map(item => item.uuid)
      },
      getPeriod() {
        $axios.get('/systemmanager/sysConfig/getCommonMonitorPeriod').then(({data}) => {
          this.MonitorPeriod = data
          this.radio = data.monitor_period
        })
      }
    },
    created() {
      this.getData()
      // 获取资产类型
      $axios.get('/monitorcitype/getCitypeTree').then(({data}) => {
        this.searchOptions = data
      })
      $axios.get('/logCenterIndex/getAllReportTypeMap').then(({data}) => {
        // this.searchOptions = data
      })
      // 获取监控频率
      this.getPeriod()
    },
    watch: {
      radio: {
        immediate: true,
        handler(val) {
          if (val === this.MonitorPeriod.common_monitor_top) {
            this.periodForm.data = this.MonitorPeriod.common_monitor_top
            this.levelName = 'common_monitor_top'
            this.radio = this.MonitorPeriod.common_monitor_top
          } else if (val === this.MonitorPeriod.common_monitor_mid) {
            this.periodForm.data = this.MonitorPeriod.common_monitor_mid
            this.levelName = 'common_monitor_mid'
            this.radio = this.MonitorPeriod.common_monitor_mid
          } else if (val === this.MonitorPeriod.common_monitor_low) {
            this.periodForm.data = this.MonitorPeriod.common_monitor_low
            this.levelName = 'common_monitor_low'
            this.radio = this.MonitorPeriod.common_monitor_low
          }
        }
      }
    }
  }
</script>
