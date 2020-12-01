<template>
  <div class="slaServiceTimeSet">
    <s-row class="slaServiceTimeSet-row">
      <s-col>
        <div class="listChunk">
          <s-card>
            <div slot="header" class="tableTitle">
              <span class="card-title">
                1.服务时间设置
              </span>
            </div>
            <s-row class="list-top-btn">
              <s-button @click="addServiceTime" icon="plus">添加</s-button>
              <s-button @click="serviceTimeBatchDel" icon="batch-del">批量删除</s-button>
            </s-row>
            <s-table-page :data="serviceTimeList" :height="tableHeight" border style="width:100%;" @selection-change="selection1Change" ref="slaListTable1" v-loading="loading1"  >
              <s-table-column type="selection" width="45" align="center"></s-table-column>
              <s-table-column label="服务时间名称" prop="servicetimeTitle"></s-table-column>
              <s-table-column label="服务时间" prop="servicetimeName"></s-table-column>
              <s-table-column label="上班时间" prop="startTime">
                <template slot-scope="scope">
                  <span>{{scope.row.startTime||'无'}}</span>
                </template>
              </s-table-column>
              <s-table-column label="下班时间" prop="endTime">
                <template slot-scope="scope">
                  <span>{{scope.row.endTime||'无'}}</span>
                </template>
              </s-table-column>
              <s-table-column label="午休时间" show-overflow-tooltip style="min-width:150px">
                <template slot-scope="scope">
                  <span>{{!scope.row.restStartTime||!scope.row.restEndTime?'无':`${scope.row.restStartTime} - ${scope.row.restEndTime}`}}</span>
                </template>
              </s-table-column>
              <s-table-column label="禁用/启用" prop="isEnable" show-overflow-tooltip width="100">
                <template slot-scope="scope">
                  <s-switch v-model="scope.row['isEnable']" size="small" :active-value="1" :inactive-value="0" @change="serviceTimeEnable(scope.row)"></s-switch>
                </template>
              </s-table-column>
              <s-table-column label="操作" width="250" align="center">
                <template slot-scope="scope">
                  <i class="iconfont icon-eye" @click="serviceTimeRowSee(scope.row)" title="查看"></i>
                  <i class="iconfont icon-edit" @click="serviceTimeRowEdit(scope.row)" title="编辑"></i>
                  <i class="iconfont icon-delete" @click="serviceTimeRowDel(scope.row)" title="删除"></i>
                </template>
              </s-table-column>
            </s-table-page>
          </s-card>
        </div>
      </s-col>
    </s-row>
    <s-row class="slaServiceTimeSet-row">
      <s-col>
        <div class="listChunk">
          <s-card>
            <div slot="header" class="tableTitle">
              <span class="card-title">
                2.节假日设置
              </span>
            </div>
            <s-row class="list-top-btn">
              <s-button @click="addHolidays" icon="plus">添加</s-button>
              <s-button @click="holidaysBatchDel" icon="batch-del">批量删除</s-button>
            </s-row>
            <s-table-page :data="holidaysList" :height="tableHeight" border style="width:100%;" @selection-change="selection2Change" ref="slaListTable2" v-loading="loading2"  >
              <s-table-column type="selection" width="45" align="center"></s-table-column>
              <s-table-column label="节假日名称" prop="holidayName"></s-table-column>
              <s-table-column label="开始日期/时间" prop="startTime"></s-table-column>
              <s-table-column label="结束日期/时间" prop="endTime"></s-table-column>
              <s-table-column label="禁用/启用" prop="isEnable" show-overflow-tooltip width="100">
                <template slot-scope="scope">
                  <s-switch v-model="scope.row['isEnable']" size="small" :active-value="1" :inactive-value="0" @change="holidaysEnable(scope.row)"></s-switch>
                </template>
              </s-table-column>
              <s-table-column label="操作" width="250" align="center">
                <template slot-scope="scope">
                  <i class="iconfont icon-eye" @click="holidaysRowSee(scope.row)" title="查看"></i>
                  <i class="iconfont icon-edit" @click="holidaysRowEdit(scope.row)" title="编辑"></i>
                  <i class="iconfont icon-delete" @click="holidaysRowDel(scope.row)" title="删除"></i>
                </template>
              </s-table-column>
            </s-table-page>
          </s-card>
        </div>
      </s-col>
    </s-row>
    <s-row class="slaServiceTimeSet-row">
      <s-col>
        <div class="listChunk">
          <s-card>
            <div slot="header" class="tableTitle">
              <span class="card-title">
                3.加班设置
              </span>
            </div>
            <s-row class="list-top-btn">
              <s-button @click="addOvertime" icon="plus">添加</s-button>
              <s-button @click="overtimeBatchDel" icon="batch-del">批量删除</s-button>
            </s-row>
            <s-table-page :data="overtimeList" :height="tableHeight" border style="width:100%;" @selection-change="selection3Change" ref="slaListTable3" v-loading="loading3"  >
              <s-table-column type="selection" width="45" align="center"></s-table-column>
              <s-table-column label="加班描述" prop="overtimeDesc"></s-table-column>
              <s-table-column label="开始日期/时间" prop="startTime"></s-table-column>
              <s-table-column label="结束日期/时间" prop="endTime"></s-table-column>
              <s-table-column label="禁用/启用" prop="isEnable" show-overflow-tooltip width="100">
                <template slot-scope="scope">
                  <s-switch v-model="scope.row['isEnable']" size="small" :active-value="1" :inactive-value="0" @change="overtimeEnable(scope.row)"></s-switch>
                </template>
              </s-table-column>
              <s-table-column label="操作" width="250" align="center">
                <template slot-scope="scope">
                  <i class="iconfont icon-eye" @click="overtimeRowSee(scope.row)" title="查看"></i>
                  <i class="iconfont icon-edit" @click="overtimeRowEdit(scope.row)" title="编辑"></i>
                  <i class="iconfont icon-delete" @click="overtimeRowDel(scope.row)" title="删除"></i>
                </template>
              </s-table-column>
            </s-table-page>
          </s-card>
        </div>
      </s-col>
    </s-row>
    <SlaServiceTimeAddDialog v-if="addServiceTimeDialogFlag" v-model="addServiceTimeDialogFlag" :list="serviceTimeList" :isSee="serviceTimeSee" :row="serviceTimeCurRow" @reload="axiosServiceTimeList"></SlaServiceTimeAddDialog>
    <SlaHolidaysAddDialog v-if="addHolidaysDialogFlag" v-model="addHolidaysDialogFlag" :list="holidaysList" :isSee="holidaysSee" :row="holidaysCurRow" @reload="axiosHolidaysList"></SlaHolidaysAddDialog>
    <SlaOvertimeAddDialog v-if="addOvertimeDialogFlag" v-model="addOvertimeDialogFlag" :list="overtimeList" :isSee="overtimeSee" :row="overtimeCurRow" @reload="axiosOvertimeList"></SlaOvertimeAddDialog>
  </div>
</template>

<script>
import $axios from 'sunflower-ajax';

import SlaServiceTimeAddDialog from '../dialog/SlaServiceTimeAddDialog';
import SlaHolidaysAddDialog from '../dialog/SlaHolidaysAddDialog';
import SlaOvertimeAddDialog from '../dialog/SlaOvertimeAddDialog';
// import {Download} from 'sunflower-common-utils'

export default {
  data() {
    return {
      // 服务时间设置
      serviceTimeList: [],
      addServiceTimeDialogFlag: false,
      serviceTimeCurRow: {},
      serviceTimeSee: false,
      loading1: false,
      selections1: [],
      serviceTimeCurrentPage: 1,
      // 节假日设置
      holidaysList: [],
      addHolidaysDialogFlag: false,
      holidaysCurRow: {},
      holidaysSee: false,
      loading2: false,
      selections2: [],
      holidaysCurrentPage: 1,
      // 加班设置
      overtimeList: [],
      addOvertimeDialogFlag: false,
      overtimeCurRow: {},
      overtimeSee: false,
      loading3: false,
      selections3: [],
      overtimeCurrentPage: 1,

      tableHeight: 0,
      criteria: { // 根据分页、查询条件查询列表的参数
        condition: {
          citypelist: [],
          //            pingStatus: '',
          citypeuuid: '',
          controlAdderss: '',
          itcompName: ''
        },
        currentPage: 1,
        orderByClause: '',
        pageSize: 20,
        totalCount: 0
        //          categoryuuid: ''
      }
    }
  },
  methods: {
    // 服务时间列表 开始
    addServiceTime() {
      this.addServiceTimeDialogFlag = true;
      this.serviceTimeCurRow = {};
      this.serviceTimeSee = false;
    },
    axiosServiceTimeList() {
      $axios.get(`/itilSla/getItilSlaServicetimeList`).then(({data}) => {
        this.serviceTimeList = [...data]
      })
    },
    serviceTimeEnable(row) {
      if (row.isEnable === 1) {
        $axios.get(`/itilSla/enableServiceTime/${row.uuid}`).then(({data}) => {
          if (data.state === true) {
            this.$message({showClose: true, message: '开启成功!', type: 'success'});
            this.axiosServiceTimeList();
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        })
      } else {
        $axios.get(`/itilSla/disenableServiceTime/${row.uuid}`).then(({data}) => {
          if (data.state === true) {
            this.$message({showClose: true, message: '禁用成功!', type: 'success'});
            this.axiosServiceTimeList();
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        })
      }
    },

    serviceTimeRowSee(row) {
      this.serviceTimeCurRow = {...row}
      this.serviceTimeSee = true;
      this.addServiceTimeDialogFlag = true;
    },
    serviceTimeRowEdit(row) {
      this.serviceTimeCurRow = {...row}
      this.serviceTimeSee = false;
      this.addServiceTimeDialogFlag = true;
    },
    serviceTimeRowDel(row) {
      this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
        // let logParam = {
        //   data: [Object.assign({}, row)],
        //   logTemplate: '删除' + '|协议(#protocolName#)'
        // };
        $axios.get(`/itilSla/delelteServiceTime/${row.uuid}`, {
          data: [row],
          logTemplate: '删除|服务时间>服务时间(#servicetimeTitle#)'
        }).then(({data}) => {
          if (data.state === true) {
            this.$message({showClose: true, message: '删除成功!', type: 'success'});
            this.axiosServiceTimeList();
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        });
      }).catch(() => {});
    },
    selection1Change(selections) {
      this.selections1 = selections;
    },
    serviceTimeBatchDel() {
      if (this.selections1.length === 0) {
        this.$message({
          type: 'error',
          message: '请至少选择一条数据'
        })
      } else {
        this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          let uuidArr = this.selections1.map(item => item.uuid);
          $axios.post(`/itilSla/batchelelteServiceTime`, uuidArr, {
            data: this.selections1,
            logTemplate: '删除|服务时间>服务时间(#servicetimeTitle#)'
          }).then(({data}) => {
            if (data.state === true) {
              this.$message({showClose: true, message: '删除成功!', type: 'success'});
              this.axiosServiceTimeList();
            } else {
              this.$message({showClose: true, message: data.errormsg, type: 'error'});
            }
          });
        }).catch(() => {});
      }
    },
    serviceTimeCurrentChange(current) {
      if (current === this.serviceTimeCurrentPage) return;
      this.serviceTimeCurrentPage = current;
      this.axiosServiceTimeList();
    },
    // 节假日 开始
    addHolidays() {
      this.addHolidaysDialogFlag = true;
      this.holidaysCurRow = {};
      this.holidaysSee = false;
    },
    axiosHolidaysList() {
      $axios.get(`/itilSla/getItilSlaHolidayList`).then(({data}) => {
        this.holidaysList = [...data]
      })
    },
    holidaysEnable(row) {
      if (row.isEnable === 1) {
        $axios.get(`/itilSla/enableSlaHoliday/${row.uuid}`).then(({data}) => {
          if (data.state === true) {
            this.$message({showClose: true, message: '开启成功!', type: 'success'});
            this.axiosHolidaysList();
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        })
      } else {
        $axios.get(`/itilSla/disenableSlaHoliday/${row.uuid}`).then(({data}) => {
          if (data.state === true) {
            this.$message({showClose: true, message: '禁用成功!', type: 'success'});
            this.axiosHolidaysList();
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        })
      }
    },
    holidaysRowSee(row) {
      this.holidaysCurRow = {...row}
      this.holidaysSee = true;
      this.addHolidaysDialogFlag = true;
    },
    holidaysRowEdit(row) {
      this.holidaysCurRow = {...row}
      this.holidaysSee = false;
      this.addHolidaysDialogFlag = true;
    },
    holidaysRowDel(row) {
      this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
        // let logParam = {
        //   data: [Object.assign({}, row)],
        //   logTemplate: '删除' + '|协议(#protocolName#)'
        // };
        $axios.get(`/itilSla/delelteSlaHoliday/${row.uuid}`, {
          data: [row],
          logTemplate: '删除|服务时间>节假日(#holidayName#)'
        }).then(({data}) => {
          if (data.state === true) {
            this.$message({showClose: true, message: '删除成功!', type: 'success'});
            this.axiosHolidaysList();
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        });
      }).catch(() => {});
    },
    selection2Change(selections) {
      this.selections2 = selections;
    },
    holidaysBatchDel() {
      if (this.selections2.length === 0) {
        this.$message({
          type: 'error',
          message: '请至少选择一条数据'
        })
      } else {
        this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          let uuidArr = this.selections2.map(item => item.uuid);
          $axios.post(`/itilSla/batchdelelteSlaHoliday`, uuidArr, {
            data: this.selections2,
            logTemplate: '删除|服务时间>节假日(#holidayName#)'
          }).then(({data}) => {
            if (data.state === true) {
              this.$message({showClose: true, message: '删除成功!', type: 'success'});
              this.axiosHolidaysList();
            } else {
              this.$message({showClose: true, message: data.errormsg, type: 'error'});
            }
          });
        }).catch(() => {});
      }
    },
    holidaysCurrentChange(current) {
      if (current === this.holidaysCurrentPage) return;
      this.holidaysCurrentPage = current;
      this.axiosHolidaysList();
    },
    // 加班 开始
    addOvertime() {
      this.addOvertimeDialogFlag = true;
      this.overtimeCurRow = {};
      this.overtimeSee = false;
    },
    axiosOvertimeList() {
      $axios.get(`/itilSla/getItilSlaOvertimeList`).then(({data}) => {
        this.overtimeList = [...data]
      })
    },
    overtimeEnable(row) {
      if (row.isEnable === 1) {
        $axios.get(`/itilSla/enableSlaOvertime/${row.uuid}`).then(({data}) => {
          if (data.state === true) {
            this.$message({showClose: true, message: '开启成功!', type: 'success'});
            this.axiosOvertimeList();
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        })
      } else {
        $axios.get(`/itilSla/disenableSlaOvertime/${row.uuid}`).then(({data}) => {
          if (data.state === true) {
            this.$message({showClose: true, message: '禁用成功!', type: 'success'});
            this.axiosOvertimeList();
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        })
      }
    },
    overtimeRowSee(row) {
      this.overtimeCurRow = {...row}
      this.overtimeSee = true;
      this.addOvertimeDialogFlag = true;
    },
    overtimeRowEdit(row) {
      this.overtimeCurRow = {...row}
      this.overtimeSee = false;
      this.addOvertimeDialogFlag = true;
    },
    overtimeRowDel(row) {
      this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
        // let logParam = {
        //   data: [Object.assign({}, row)],
        //   logTemplate: '删除' + '|协议(#protocolName#)'
        // };
        $axios.get(`/itilSla/delelteSlaOvertime/${row.uuid}`, {
          data: [row],
          logTemplate: '删除|服务时间>加班(#overtimeDesc#)'
        }).then(({data}) => {
          if (data.state === true) {
            this.$message({showClose: true, message: '删除成功!', type: 'success'});
            this.axiosOvertimeList();
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        });
      }).catch(() => {});
    },
    selection3Change(selections) {
      this.selections3 = selections;
    },
    overtimeBatchDel() {
      if (this.selections3.length === 0) {
        this.$message({
          type: 'error',
          message: '请至少选择一条数据'
        })
      } else {
        this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          let uuidArr = this.selections3.map(item => item.uuid);
          $axios.post(`/itilSla/batchdelelteSlaOvertime`, uuidArr, {
            data: this.selections3,
            logTemplate: '删除|服务时间>加班(#overtimeDesc#)'
          }).then(({data}) => {
            if (data.state === true) {
              this.$message({showClose: true, message: '删除成功!', type: 'success'});
              this.axiosOvertimeList();
            } else {
              this.$message({showClose: true, message: data.errormsg, type: 'error'});
            }
          });
        }).catch(() => {});
      }
    },
    overtimeCurrentChange(current) {
      if (current === this.overtimeCurrentPage) return;
      this.overtimeCurrentPage = current;
      this.axiosOvertimeList();
    },
    doLayout() {
      this.$nextTick(() => {
        let totalHeihgt = document.body.offsetHeight;
        let headHeight = document.querySelector('#headBar').offsetHeight;
        let footHeight = document.querySelector('.s-footer').offsetHeight;
        let tabsHeaderHeight = document.querySelector('.s-tabs-header').offsetHeight + 15 + 5    // tabs头部加15的marginbottom
        let bodyHeight = totalHeihgt - headHeight - footHeight - tabsHeaderHeight - 20;
        let listTopBtnHeight = document.querySelector('.slaServiceTimeSet .list-top-btn').offsetHeight + 8;
        let tableTitleHeight = document.querySelector('.slaServiceTimeSet .tableTitle').offsetHeight + 8;
        let pageHeight = document.querySelector('.slaServiceTimeSet .s-pagination').offsetHeight + 8 + 8;
        // 表格的高度等于tabs内容高度减去从上到下元素高度 最后20是下边框
        let tableHeight = (bodyHeight - listTopBtnHeight * 2 - pageHeight * 2 - tableTitleHeight * 2) / 2 + 20;
        this.tableHeight = tableHeight < 190 ? 190 : tableHeight;
      });
    }
  },
  created() {
    this.doLayout();
    this.axiosServiceTimeList();
    this.axiosHolidaysList();
    this.axiosOvertimeList();
  },
  components: {
    SlaServiceTimeAddDialog,
    SlaHolidaysAddDialog,
    SlaOvertimeAddDialog
  }
}
</script>

<style lang="stylus">
.slaServiceTimeSet {
  display: flex;
  flex-direction: column;
  padding-right: 10px;

  .listChunk {
    padding: 5px 0;
  }

  .s-card {
    padding: 0;
  }

  .list-top-btn {
    padding: 5px 0;
  }

  .slaServiceTimeSet-row {
    flex: 1;
  }
}
</style>
