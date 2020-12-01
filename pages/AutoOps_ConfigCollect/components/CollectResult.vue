/**
* Created by alex on 2018/8/17.
*/
<template>
  <s-scrollbar wrap-style="max-height: 600px;">
    <div style="padding: 20px;opacity: 0.85;">
      <s-row style="margin: 10px 0;">
        <s-col span="12">任务名称：<span>{{topInfo.taskName || '未知'}}</span></s-col>
        <s-col span="12">任务周期：<span>{{topInfo.circleTypeStr || '未知'}}</span></s-col>
      </s-row>
      <s-row style="margin: 10px 0;">
        <s-col span="12">开始时间：<span>{{topInfo.tScheduleTime && topInfo.tScheduleTime.firstFireTime || '未知'}}</span></s-col>
        <s-col span="12">结束时间：<span>{{topInfo.tScheduleTime && topInfo.tScheduleTime.endFireTime || '未知'}}</span></s-col>
      </s-row>
      <s-row style="margin: 10px 0;">
        <s-col span="12">上次执行时间：<span>{{topInfo.task.previousFireTime ? topInfo.task.previousFireTime : '未知'}}</span></s-col>
        <s-col span="12">下次执行时间：<span>{{topInfo.task && topInfo.task.nextFireTime === '1970-01-01 08:00:00' ? '未知' : topInfo.task.nextFireTime}}</span></s-col>
      </s-row>
    </div>
    <ul class="top-info" style="padding-bottom: 20px;padding-left: 20px;border: none;border-bottom: 1px solid #e4e7ed;">
      <li>
        <s-row type="flex" justify="center" align="middle">
          <s-col span="4" class="col-box-color">
            <i class="iconfont icon-finish"></i>
          </s-col>
          <s-col span="8">
            <h5 style="color: #67C23A;">{{topInfo.successCount === undefined ? '未知' : topInfo.successCount}}</h5>
            <h6 class="col-box-color">成功数</h6>
          </s-col>
        </s-row>
      </li>
      <li>
        <s-row type="flex" justify="center" align="middle">
          <s-col span="4" class="col-box-color">
            <i class="iconfont icon-cancel"></i>
          </s-col>
          <s-col span="8">
            <h5 style="color: #ED544F;">{{topInfo.failCount === undefined ? '未知' : topInfo.failCount}}</h5>
            <h6 class="col-box-color">失败数</h6>
          </s-col>
        </s-row>
      </li>
      <li>
        <s-row type="flex" justify="center" align="middle">
          <s-col span="4" class="col-box-color">
            <i class="iconfont icon-config-ip"></i>
          </s-col>
          <s-col span="12">
            <h5 style="color: #409EFF;">{{topInfo.ipCount === undefined ? '未知' : topInfo.ipCount}}</h5>
            <h6 class="col-box-color">网段IP数</h6>
          </s-col>
        </s-row>
      </li>
      <li>
        <s-row type="flex" justify="center" align="middle">
          <s-col span="4" class="col-box-color">
            <i class="iconfont icon-clock"></i>
          </s-col>
          <s-col span="14">
            <h5 style="color: #9287E7;" v-if="collectNum.serverCount === undefined">未知</h5>
            <h5 style="color: #9287E7;" v-else>{{collectNum.serverCount}}</h5>
            <h6 class="col-box-color">识别服务器数</h6>
          </s-col>
        </s-row>
      </li>
      <li>
        <s-row type="flex" justify="center" align="middle">
          <s-col span="4" class="col-box-color">
            <i class="iconfont icon-not-pass"></i>
          </s-col>
          <s-col span="12">
            <h5 style="color: #FEB64D;">{{topInfo.unresponsive === undefined ? '未知' : topInfo.unresponsive}}</h5>
            <h6 class="col-box-color">未响应数</h6>
          </s-col>
        </s-row>
      </li>
    </ul>
    <s-table-page
      :data="tableData"
      :header-search='getSearchDef()'
      @selection-change="handleSelectionChange"
      style="margin-bottom: 20px;">
      <s-table-column type="selection"></s-table-column>
      <s-table-column label="主机名称" prop="itComp"></s-table-column>
      <s-table-column label="IP" prop="address"></s-table-column>
      <s-table-column label="操作系统" prop="modleNumber"></s-table-column>
      <s-table-column label="CPU" prop="cpuModle"></s-table-column>
      <s-table-column label="内存" prop="memory"></s-table-column>
      <s-table-column label="硬盘" prop="disk"></s-table-column>
    </s-table-page>
    <s-checkbox style="margin:8px 0 14px" v-model="isSave" label="同步到CMDB"></s-checkbox>
  </s-scrollbar>
</template>

<script type="text/babel">
  export default {
    data() {
      return {
        selectList: [],
        isSave: false,
        searchData: '',
        tableData: []
      }
    },
    props: {
      result: {
        required: true,
        type: Array
      },
      topInfo: {
        required: true,
        type: Object
      },
      collectNum: {
        required: true,
        type: Object
      }
    },
    created() {
      this.tableData = this.result
    },
    methods: {
      getSearchDef() {
        return {
          width: 10,
          offset: 8,
          placeholder: '请输入查询内容',
          searchProps: ['itComp', 'address', 'modleNumber']
        }
      },
      handleFilter() {
        if (this.searchData === '') {
          this.tableData = this.result
        } else {
          this.tableData = this.result.filter(item => item.address.indexOf(this.searchData) > -1)
        }
      },
      handleSelectionChange(val) {
        this.selectList = val.map(item => (item.uuid))
      }
    }
  }
</script>
<style>
  .col-box-color{
    opacity: 0.45;
  }
</style>
