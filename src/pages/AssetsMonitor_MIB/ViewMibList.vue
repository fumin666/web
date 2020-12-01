<template>
  <section class="view-mibList">
    <s-scrollbar wrap-style="max-height: 600px;">
      <s-row>
        <s-row class="title">
          <i class="iconfont icon-tag"></i>
          <span>基本信息</span>
        </s-row>
        <s-row>
          <s-col span="6" class="grid-content bg-purple">模版名称：</s-col>
          <s-col span="18" class="grid-content bg-purple-light">{{detailData.template}}</s-col>
        </s-row>
        <s-row>
          <s-col span="6" class="grid-content bg-purple">资产类型：</s-col>
          <s-col span="18" class="grid-content bg-purple-light">{{detailData.threeTypeName}}</s-col>
        </s-row>
        <s-row>
          <s-col span="6" class="grid-content bg-purple">资产厂商：</s-col>
          <s-col span="18" class="grid-content bg-purple-light">{{detailData.manufactName}}</s-col>
        </s-row>
        <s-row>
          <s-col span="6" class="grid-content bg-purple">资产型号：</s-col>
          <s-col span="18" class="grid-content bg-purple-light">{{detailData.productName}}</s-col>
        </s-row>
        <s-row>
          <s-col span="6" class="grid-content bg-purple">标识符：</s-col>
          <s-col span="18" class="grid-content bg-purple-light">{{detailData.keyWord}}</s-col>
        </s-row>
        <s-row>
          <s-col span="6" class="grid-content bg-purple">企业OID：</s-col>
          <s-col span="18" class="grid-content bg-purple-light">{{detailData.sysObjectOid}}</s-col>
        </s-row>
      </s-row>

      <s-row>
        <s-row class="title">
          <i class="iconfont icon-approve"></i>
          <span>识别监控信息</span>
        </s-row>
        <s-row>
          <s-col span="6" class="grid-content bg-purple">监控模板：</s-col>
          <s-col span="18" class="grid-content bg-purple-light">{{`${detailData.keyWord}[${detailData.template}]`}}</s-col>
        </s-row>
        <s-row>
          <s-table
            :data="detailData.monitorTypes">
            <s-table-column
              label="监控项类型名称"
              prop="chName">
            </s-table-column>
            <s-table-column
              label="操作"
              width="100px">
               <template slot-scope="scope">
                 <i class="iconfont icon-eye" @click="viewMonitorTypeDetail(scope.$index, scope.row)"></i>
               </template>
            </s-table-column>
          </s-table>
        </s-row>
      </s-row>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">
  import Bus from '@/plugins/eventBus'

  export default{
    data() {
      return {
        detailData: {}
      }
    },
    props: {
      rowData: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      viewMonitorTypeDetail(index, row) {
        Bus.$emit('viewMonitorTypeDialog', row)
      }
    },
    mounted() {
      this.detailData = this.rowData
    }
  }
</script>
