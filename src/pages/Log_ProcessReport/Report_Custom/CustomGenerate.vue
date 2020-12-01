<!--
 * @Author: mybells
 * @Version://清远自定义报表
 * @Description:报表中心-数据库审计-自定义报表->报表生成
 * @Date: 2020-03-18 09:55:55
 * @LastEditors: mybells
 -->
<template>
  <section class="content eventAccount">
    <s-form :inline="true" class="search_form" label-width="90px" style="margin: 10px 0;">
      <div>
        <s-form-item label="报表名称：">
          <s-input v-model="form.reportTaskName"></s-input>
        </s-form-item>
        <s-form-item label="报表类型：">
          <s-select v-model="form.type" clearable @clear="typeClear">
            <s-option label="审计报表" :value="0"></s-option>
            <s-option label="事件报表" :value="1"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="生成时间：">
          <s-date-picker
            v-model="form.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :editable="false"
            :value-format-flag="true"
            @change="getStartTime">
          </s-date-picker>
          <span>~</span>
          <s-date-picker
            v-model="form.endTime"
            type="datetime"
            :editable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            :value-format-flag="true"
            @change="getEndTime">
          </s-date-picker>
        </s-form-item>
        <s-form-item label="输出格式：">
          <s-select v-model="form.fileType" clearable @clear="fileTypeClear">
            <s-option label="PDF" :value="0"></s-option>
            <s-option label="EXCEL" :value="1"></s-option>
            <s-option label="WORD" :value="2"></s-option>
          </s-select>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" title="查询" @click="search()">查询</s-button>
      </div>
    </s-form>
    <s-row style="margin: 15px 0 10px;">
      <s-button title="批量删除" icon="excel" @click="batchDel()">批量删除</s-button>
    </s-row>
    <s-table-page :data="dataList" @selection-change="selectionChange">
      <s-table-column type="selection" width="45"></s-table-column>
      <s-table-column label="报表名称" prop="reportTaskName"></s-table-column>
      <s-table-column label="报表类型" prop="typeStr"></s-table-column>
      <s-table-column label="报表文件" prop="reportName"></s-table-column>
      <s-table-column label="输出格式" prop="fileTypeStr"></s-table-column>
      <s-table-column label="生成时间" prop="createTime"></s-table-column>
      <s-table-column label="操作">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看" @click="eye(scope.row)"></i>
          <i class="iconfont icon-download" title="下载" @click="download(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table-page>
    <!-- 查看报表 -->
    <EyeGenerateDialog v-if="viewDialog" :viewDialog.sync="viewDialog" :rowData="rowData"></EyeGenerateDialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  import EyeGenerateDialog from './GenerateDialog/EyeGenerateDialog'

  export default {
    components: {
      EyeGenerateDialog
    },
    data() {
      return {
        selection: [],
        dataList: [],
        rowData: {},
        viewDialog: false,
        form: {
          reportTaskName: null,
          type: null,
          fileType: null,
          startTime: null,
          endTime: null
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      typeClear() {
        this.form.type = null
      },
      fileTypeClear() {
        this.form.fileType = null
      },
      getList() {
        var vm = this;
        this.period = {
          startTime: new Date(this.form.startTime).getTime() / 1000,
          endTime: new Date(this.form.endTime).getTime() / 1000
        }
        let params = Object.assign({}, vm.form, vm.period);
        $axios.post(`/dbaCustomReport/getRecordList`, params).then((res) => {
          vm.dataList = res.data || [];
        });
      },
      getStartTime(val) {
        let beginVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let endValue = new Date(Date.parse(this.form.endTime.replace(/-/g, '/'))).getTime();
        if (beginVal >= endValue) {
          this.form.startTime = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.form.startTime = val;
        }
      },
      getEndTime(val) {
        let endVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let beginValue = new Date(Date.parse(this.form.startTime.replace(/-/g, '/'))).getTime();
        if (endVal <= beginValue) {
          this.form.endTime = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.form.endTime = val;
        }
      },
      selectionChange(arr) {
        this.selection = arr;
      },
      search() {
        this.getList()
      },
      batchDel() {
        if (this.selection.length) {
          this.$confirm('确定删除?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.post(`/dbaCustomReport/batchDeleteRecord`, {uuids: this.selection.map(item => item.uuid)}, {
              data: this.selection,
              logTemplate: '删除|报表生成(#reportTaskName#)'
            }).then(({data}) => {
              if (data.state === true) {
                this.$message({message: '删除成功!', type: 'success'});
                this.getList();
              } else {
                this.$message({message: data.errormsg, type: 'error'});
              }
            });
          }).catch(() => {});
        } else {
          this.$message({
            message: '请选择要删除的数据！',
            type: 'warning'
          });
        }
      },
      eye(row) {
        this.rowData = row;
        this.viewDialog = true;
      },
      download(row) {
        Download(`/dbaCustomReport/downloadRecordFile/${row.uuid}`);
      }
    }
  }
</script>
