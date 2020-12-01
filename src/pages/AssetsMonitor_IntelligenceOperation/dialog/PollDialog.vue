<template>
  <div>
    <div v-if="viewObj !== ''" class="assetView" style="padding-bottom: 20px;">
      <s-col :span="5" class="assetCol" style="text-align: center;">
        <s-row><img src="/static/images/topologyicon/default/PCserver.svg" alt="" style="width: 54px;"></s-row>
        <s-row style="margin-top: 10px">主机名：{{assetInfo.itcompname}}</s-row>
      </s-col>
      <s-col :span="19" class="assetCol">
        <s-row style="margin-top: 15px">
          <s-col :span="8">操作系统：{{assetInfo.modelnumber}}</s-col>
          <s-col :span="8">IP地址：{{assetInfo.controladderss}}</s-col>
          <s-col :span="8">内存：{{assetInfo.memory}}M</s-col>
        </s-row>
        <s-row style="margin-top: 15px">
          <s-col :span="8">CPU：{{assetInfo.cpu}}核</s-col>
          <s-col :span="8">磁盘：{{assetInfo.disk}}GB</s-col>
        </s-row>
      </s-col>
    </div>
    <s-row style="padding-bottom: 10px;border-bottom: 1px solid rgba(0, 0, 0, 0.15);">
      <s-col :span="12" style="line-height: 32px;">巡检历史记录</s-col>
      <s-col :span="12" style="text-align: right"><s-button @click="polling">执行巡检</s-button></s-col>
    </s-row>
    <s-row>
      <s-table-page
        :searchDef="{show: false}"
        :paginationDef="{pageSize: 5, pageSizes: [5, 10, 15, 20]}"
        :data="hostList"
        style="width: 100%">
        <s-table-column label="资产名称" prop="assetName"></s-table-column>
        <s-table-column label="IP地址" prop="ipAddr"></s-table-column>
        <s-table-column label="资产类别" prop="assetType"></s-table-column>
        <s-table-column label="资产状态" prop="assetStatus"></s-table-column>
        <s-table-column label="执行时间" prop="excutetime"></s-table-column>
        <s-table-column label="配置变更数" prop="baseline"></s-table-column>
        <s-table-column label="操作">
          <template slot-scope="scope">
            <i class="iconfont icon-eye" title="查看" @click="scan(scope.row)"> </i>
          </template>
        </s-table-column>
      </s-table-page>
    </s-row>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  // import { cloneDeep } from 'lodash';

  export default {
    data() {
      return {
        assetInfo: {},
        hostList: []
      }
    },

    props: {
      viewObj: {
        type: String,
        default: ''
      },
      current: {
        type: Array,
        default: []
      }
    },
    methods: {
      scan(row) {
        console.log(row);
        this.$router.push('/AutoOpsCenter/autoOps_polling/pollingResultDetail/' + row.uuid)
      },
      polling() {
        this.$confirm('执行巡检需要一段时间，请在巡检结束后查看结果详情', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          var m = new Date();
          var n = parseInt(new Date(m).getTime() / 1000) + 60
          let assetUuidList = this.current.map(item => {
            return item.itcompUuid
          })
          let assetUuid = []
          for (let i in assetUuidList) {
            assetUuid.push({assetUuid: assetUuidList[i]})
          }
          let inspectName = 'intelligence' + parseInt(Math.random() * (999999 - 100000) + 100000)
          let params = {
            assets: assetUuid,
            notices: [],
            task: {
              inspectDesc: null,
              inspectName: inspectName,
              inspectType: 1,
              isPeriod: 0,
              tScheduleTime: {
                firstFireTime: n,
                timeType: 7
              }
            }
          }
          $axios.post('assetInspectTask/add', params, {
            data: [],
            logTemplate: `执行巡检|智能运维中心>巡检(${this.assetInfo.itcompname})`
          }).then(res => {
            if (res.data) {
              this.getPollingList()
            }
          })
        }).catch(() => {});
      },
      getPollingList() {
        let params = {
          assetUuids: []
        }
        this.current.map(item => {
          params.assetUuids.push(item.itcompUuid)
        })
        params.assetUuids = Array.from(new Set(params.assetUuids))
        $axios.post('/assetInspectHistory/batchGetHistoryByAssetUuids', params).then(res => {
          this.hostList = res.data
        })
      }
    },
    created() {
      if (this.viewObj !== '') {
        $axios.get(`/aiopsMonitorAlarm/viewItcompAlarm/${this.viewObj}`).then(res => {
          this.assetInfo = res.data.assetInfo;
        })
      }
      this.getPollingList()
    }
  }
</script>

<style lang="stylus">
  .assetView{
    overflow: hidden;
  }
</style>
