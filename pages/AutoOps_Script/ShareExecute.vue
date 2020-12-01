<template>
  <section id="scriptExecute" class="scriptExecute shareExecute autoOps_script">
    <s-scrollbar wrap-class="scroll-height-500px">
      <div class="exeDetail">
        <RealPageTable :ajax-obj="ajaxObj"
          style="width: 100%">
          <s-table-column label="主机名称" width="180">
            <template slot-scope="scope">
              <s-row>
                <s-col :span="5" style="padding-top: 5px">
                  <i class="iconfont icon-cabinet" style="cursor: initial;"></i>
                </s-col>
                <s-col :span="19">
                  <div>{{scope.row.assetName}}</div>
                  <div class="subContent">{{scope.row.assetIp}}</div>
                </s-col>
              </s-row>
            </template>
          </s-table-column>
          <s-table-column label="分发状态" width="130">
            <template slot-scope="scope">
              <div class="rowScriptStatus" :class="bgColorShow(scope.row.excuteStatus)">
                <span v-if="scope.row.excuteStatus === 1">成功</span>
                <span v-else-if="scope.row.excuteStatus === 0">失败</span>
                <span v-else> -- </span>
              </div>
            </template>
          </s-table-column>
          <s-table-column label="文件名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <li class="dialogFilename">{{scope.row.fileName}}</li>
            </template>
          </s-table-column>
        </RealPageTable>
      </div>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">
  // import $axios from 'sunflower-ajax'
  // import Bus from '@/plugins/eventBus';
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  import {cloneDeep} from 'lodash'

  export default{
    data() {
      return {
        hostList: [],
        ajaxObj: {
          type: 'post',
          url: '/immediateExcuteTask/showImmediateExcuteFileShareTaskResult',
          params: {
            condition: {
            }
          }
        },
        timer: []
      }
    },
    computed: {},
    props: ['executeResult', 'multipleSelectionHost', 'showDialog'],
    components: {
      // Bus,
      RealPageTable
    },
    mounted() {
      if (this.showDialog) {
        this.getShowList()
      }
    },
    methods: {
      // 更改背景颜色
      bgColorShow(state) {
        let colorClass = ''
        switch (state) {
          case 1: colorClass = 'greenbg'; break;
          case 0: colorClass = 'redbg'; break;
          default: colorClass = 'yellowbg'; break;
        }
        return colorClass
      },
      getShowList() {
        let params = {
          searchKey: '',
          excuteStatusList: [],
          immediateTaskInfoUuid: this.executeResult.scriptUuid
        }
        this.ajaxObj.params.condition = cloneDeep(params);
      }
    },
    beforeDestroy() {
      if (!this.showDialog) {
        if (this.timer) { // 如果定时器还在运行 或者直接关闭，不用判断
          this.timer.forEach((item) => {
            clearTimeout(item); // 关闭
          })
        }
        this.$emit('changeHistory')
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .shareExecute
    .scroll-height-500px
      max-height: 600px
    .exeDetail
      .s-table-header, .s-table-body
        width 100% !important
</style>
