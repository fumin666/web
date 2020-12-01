/**
 * @author songyf
 * @date 2019/7/29
 * @Description: 【报表中心】→【账号使用情况统计】→【过期账号统计】
*/
<template>
  <div class="rules-operation" style="margin: 15px 10px;">
    <s-form :model="form" :inline="true" class="search_form" style="margin: 10px 0;" label-width='105px'>
      <div>
        <s-form-item
          label="组织机构：">
          <s-input
            readonly
            v-model="name"
            icon="plus"
            @click.native="showSelect()">
          </s-input>
        </s-form-item>
        <s-form-item label="账号过期时间：">
          <s-date-picker v-model="form.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择起始时间" :editable="false" @change="getDateRangeStart">
          </s-date-picker>
          ~
          <s-date-picker v-model="form.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" :editable="false" @change="getDateRangeEnd">
          </s-date-picker>
        </s-form-item>
        <s-form-item label="账号过期天数：">
          <s-input v-model="form.startDay" style="width: 60px" ></s-input>
          ~
          <s-input v-model="form.endDay" style="width: 60px"></s-input>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" title="查询" @click="getList()">查询</s-button>
      </div>
    </s-form>
    <div style="margin: 15px 0 10px;">
      <s-button icon="batch-del" title="批量删除" @click="bathDelete"  v-if="moduleType===0" v-noBtn="'accountManage_accEBatchDel'">批量删除</s-button>
      <s-button title="EXCEL报表" icon="excel" v-if="moduleType===1" @click="DownloadHandle('excel')">EXCEL报表</s-button>
      <s-button title="WORD报表" icon="word" v-if="moduleType===1" @click="DownloadHandle('word')">WORD报表</s-button>
      <s-button title="PDF报表" icon="pdf" v-if="moduleType===1" @click="DownloadHandle('pdf')">PDF报表</s-button>
    </div>
    <s-table-page
      @selection-change="onSelectionChange"
      :data="list"
      :header-search="{show: false}"

      >
      <s-table-column type="selection" width="45" align="center"
                      v-if="moduleType===0 && judgeRoleBtn('accountManage_accECheckBox')"></s-table-column>
      <s-table-column label="账号名称" prop="userLoginName" show-overflow-tooltip></s-table-column>
      <s-table-column label="真实姓名" prop="userRealName" show-overflow-tooltip></s-table-column>
      <s-table-column label="组织机构" prop="departName" show-overflow-tooltip></s-table-column>
      <s-table-column label="账号过期时间" prop="expirationTimeStr" show-overflow-tooltip></s-table-column>
      <s-table-column label="账号过期天数" prop="expirationDays" show-overflow-tooltip></s-table-column>
    </s-table-page>
    <s-dialog
      v-model="bloomSelect"
      v-if="bloomSelect"
      title="选择组织机构"
      width="700px"
      key="bloomSelect">
      <select-institution ref="institution" :List="selectList" @institutionsUuid="getUuid"></select-institution>
      <template slot="footer" class="dialog-footer">
        <s-button @click="bloomSelect = false">确定</s-button>
        <s-button type="cancel" @click="cancelSelect">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'

  import SelectInstitution from '../Log_InstitutionAccount/SelectInstitution'
  import {Download} from 'sunflower-common-utils'
  export default {
    components: {

      SelectInstitution
    },
    props: {
      moduleType: {
        type: Number,
        default: 1 // // 0-账号 1报表
      }
    },
    data() {
      return {
        form: {
          departUuidList: null,
          startTime: null,
          endTime: null,
          startDay: '',
          endDay: ''
        },
        list: [],
        bloomSelect: false,
        selectList: [],
        institutionUuid: [],
        name: '',
        selection: [],
        tableSelection: [],
        batchUuid: []
      }
    },
    methods: {
      validDay() {
        let reg = /^([1-9]\d*|[0]{1,1})$/;
        if (this.form.startDay !== '' && this.form.endDay !== '') {
          if (!reg.test(this.form.startDay) || !reg.test(this.form.endDay)) {
            this.$message({type: 'warning', message: '请输入正整数！'})
            return false
          }
          if (this.form.startDay > this.form.endDay) {
            this.$message({type: 'warning', message: '开始天数不能大于结束天数！'})
            return false
          }
          if (this.form.startDay > 36500 || this.form.endDay > 36500) {
            this.$message({type: 'warning', message: '天数最大值不能超过36500！'})
            return false
          }
        } else if ((this.form.startDay === '' && this.form.endDay !== '') || (this.form.startDay !== '' && this.form.endDay === '')) {
          this.$message({type: 'warning', message: '天数不能为空！'})
          return false
        }
        return true
      },
      getList() {
        if (this.validDay() === false) {
          return
        }
        this.form.departUuidList = this.institutionUuid
        let param = {
          departUuidList: this.form.departUuidList,
          startTime: this.form.startTime === null ? null : parseInt(new Date(this.form.startTime).getTime() / 1000),
          endTime: this.form.endTime === null ? null : parseInt(new Date(this.form.endTime).getTime() / 1000),
          startDay: this.form.startDay === '' ? null : parseInt(this.form.startDay),
          endDay: this.form.endDay === '' ? null : parseInt(this.form.endDay)
        };
        $axios.post('/iamUserInfo/accountExpirationStatistical', param).then((res) => {
          if (res.data && res.data instanceof Array) {
            this.list = res.data;
          }
        });
      },
      showSelect(el, row) {
        var vm = this;
        vm.bloomSelect = true;
        $axios.get('departmentInfo/queryAllDepartmentInfo').then((res) => {
          vm.selectList = res.data.departmentList;
          vm.lastSelection = vm.selection;   // 保存上一次的选项，在点击取消按钮时候恢复静this.selection恢复为这个值
          vm.lastInstitutionUuid = vm.institutionUuid;
          vm.lastInstitutionName = vm.name;
          vm.$nextTick(() => {
            vm.selection.forEach(row => {
              vm.$refs.institution.$refs.table.toggleRowSelection(vm.selectList[row], true);
            });
          })
        });
      },
      getUuid(uuid, name, selection) {
        this.institutionUuid = uuid;
        this.name = name;
        this.selection = selection;
      },
      cancelSelect() {
        let vm = this;
        vm.bloomSelect = false;
        vm.institutionUuid = vm.lastInstitutionUuid;
        vm.name = vm.lastInstitutionName;
        vm.selection = vm.lastSelection;
      },
      getDateRangeStart(value) {
        let start = this.form.startTime ? new Date(this.form.startTime).getTime() : 0
        let end = this.form.endTime ? new Date(this.form.endTime).getTime() : 0
        if (end) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.form.startTime = '';
          }
        }
      },
      getDateRangeEnd(value) {
        let start = this.form.startTime ? new Date(this.form.startTime).getTime() : 0
        let end = this.form.endTime ? new Date(this.form.endTime).getTime() : 0
        if (start) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.form.endTime = '';
          }
        }
      },
      DownloadHandle(type) {
        if (this.validDay() === false) {
          return
        }
        this.form.departUuidList = this.institutionUuid
        let param = {
          exportType: type,
          departUuidList: this.form.departUuidList,
          startTime: this.form.startTime === null ? null : parseInt(new Date(this.form.startTime).getTime() / 1000),
          endTime: this.form.endTime === null ? null : parseInt(new Date(this.form.endTime).getTime() / 1000),
          startDay: this.form.startDay === '' ? null : parseInt(this.form.startDay),
          endDay: this.form.endDay === '' ? null : parseInt(this.form.endDay)
        };
        this.$confirm(`确定要以${type}格式导出？`, '提示', {
          confirmButtonText: '确定',
          cancelButtListonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.post(`/iamUserInfo/accountExpirationExport`, param).then(res => {
            if (res.data === 'success') {
              Download(`/iamUserInfo/downAccountExpiration/${type}`)
            } else {
              this.$message({
                type: 'error',
                message: `${type}导出失败`
              })
            }
          })
        }).catch(() => {});
      },
      onSelectionChange(val) {
        this.tableSelection = val
      },
      bathDelete() {
        this.batchUuid = this.tableSelection.map(function (item) {
          return item.uuid;
        });
        if (this.batchUuid.length) {
          this.$confirm('确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let logData = this.tableSelection.map(list => {
              return {name: list.userLoginName, uuid: list.uuid};
            });
            $axios.post(`/iamUserInfo/deleteUserInfoIncludeAccount`, this.batchUuid, {
              data: logData,
              logTemplate: '批量删除|账号过期账号统计>账号(#name#)'
            }).then(({data}) => {
              data.result = 'success';
              data.data.map(item => {
                if (!item.state) {
                  data.result = 'fail';
                  data.err = item.errormsg;
                }
              })
              if (data.result === 'success') {
                this.$message({type: 'success', message: '删除成功!'});
                this.getList()
              } else {
                if (data.result === 'fail') {
                  this.$message({type: 'error', message: data.err});
                  this.getList();
                }
              }
            })
          }).catch(() => {
          });
        } else {
          this.$message({
            type: 'warning',
            message: '选至少选择一条数据！'
          })
        }
      }
    },
    created() {
      this.getList();
    }
  }
</script>
