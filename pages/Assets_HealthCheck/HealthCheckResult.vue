<template>
  <section id="healthCheckResult">
    <s-row>
      <s-col :span="20">
        <span class="checkTaskInfo">
          <span class="title">检查任务名称：</span>
          <span class="value" v-text="checkTaskDetail.taskName"></span>
        </span>
        <span class="checkTaskInfo">
          <span class="title">执行时间：</span>
          <span class="value" v-text="checkTaskDetail.execTime"></span>
        </span>
        <span class="checkTaskInfo">
          <span class="title">创建者：</span>
          <span class="value" v-text="checkTaskDetail.createUserName"></span>
        </span>
      </s-col>
      <s-col :span="4" style="text-align:right;">
      </s-col>
    </s-row>
    <s-table-page
      :data="checkResultLists"
      :header-search="getSearchDef()"
      :header-actions="getListActionsDef()"
      @selection-change="handleSelectionChange">
      <s-table-column type="selection" width="45"></s-table-column>
      <s-table-column label="资产名称" prop="itcompName"></s-table-column>
      <s-table-column label="IP地址" prop="ipAddress"></s-table-column>
      <s-table-column label="资产类型" prop="typeStr"></s-table-column>
      <s-table-column label="资产状态" prop="status"></s-table-column>
      <s-table-column label="资产可用性" prop="avaStatusStr"></s-table-column>
      <!-- <s-table-column label="最近使用率(6h, 12h, 24)" width="300"> -->
      <s-table-column label="健康性(6h, 12h, 24h)" width="300">
        <template slot-scope="scope">
          <span v-text="`${scope.row.sixAva}, ${scope.row.twelveAva}, ${scope.row.oneDayAva}`"></span>
        </template>
      </s-table-column>
    </s-table-page>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Download} from 'sunflower-common-utils';

  export default {
    data() {
      return {
        checkTaskDetail: {},          // 检查任务详情
        checkResultLists: [],         // 检查结果列表
        checkResultSelections: []     // 检查结果列表选中列表
      }
    },
    methods: {
      // 表头操作按钮
      getListActionsDef() {
        let _this = this
        return {
          width: 12,
          actions: [{
            icon: 'download',
            name: '下载',
            click() {
              _this.downloadResult();
            }
          }]
        }
      },
      getSearchDef() {
        return {
          width: 6,
          offset: 6,
          placeholder: '请输入资产名称、IP地址、资产类型进行查询',
          searchProps: ['itcompName', 'ipAddress', 'typeStr']
        }
      },
      // 获取检查任务详情
      getCheckTaskDetail() {
        $axios.get(`/assetHealthTask//getTaskDetailByUuid/${this.$route.params.uuid}`).then(({data}) => {
          if (data && data instanceof Object) {
            this.checkTaskDetail = data;
          }
        });
      },
      // 获取检查结果列表
      getCheckResultLists() {
        $axios.get(`/assetHealthTask/getTaskDatas/${this.$route.params.uuid}`).then(({data}) => {
          if (data && data instanceof Array) {
            this.checkResultLists = data;
          }
        });
      },
      // 检查结果列表多选值
      handleSelectionChange(selections) {
        this.checkResultSelections = selections;
      },
      // 下载检查结果列表
      downloadResult() {
        if (this.checkResultSelections.length === 0) {
          this.$message.warning('请至少选择一项要下载的内容！');
          return;
        }
        let uuids = this.checkResultSelections.map(item => item.uuid);
        $axios.post('/assetHealthTask/createDownloadData', uuids).then(({data}) => {
          if (data && data.state) {
            Download('/assetHealthTask/downloadData');
          } else {
            this.$message.error('下载失败，请重试！')
          }
        });
      }
    },
    created() {
      this.getCheckTaskDetail();    // 获取检查任务详情
      this.getCheckResultLists();   // 获取检查结果列表
    }
  }
</script>

<style lang="stylus">
  #healthCheckResult
    .checkTaskInfo
      margin-right 50px
      .title
        font-size 15px
        font-weight bold
</style>
