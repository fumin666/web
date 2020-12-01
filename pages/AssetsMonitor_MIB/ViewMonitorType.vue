<template>
  <section>
    <s-scrollbar wrap-style="max-height: 600px;">
      <s-row>
        <s-row class="title">
          <i class="iconfont icon-tag"></i>
          <span>基本信息</span>
        </s-row>
        <s-row>
          <s-col span="6" class="grid-content bg-purple">监控项类型：</s-col>
          <s-col span="18" class="grid-content bg-purple-light">{{monitorTypeDetail.chName}}</s-col>
        </s-row>
        <s-row>
          <s-col span="6" class="grid-content bg-purple">基OID：</s-col>
          <s-col span="18" class="grid-content bg-purple-light">{{monitorTypeDetail.baseOid}}</s-col>
        </s-row>
        <s-row>
          <s-col span="6" class="grid-content bg-purple">监控项Title：</s-col>
          <s-col span="18" class="grid-content bg-purple-light">{{monitorTypeDetail.titleOid}}</s-col>
        </s-row>
        <s-row>
          <s-col span="6" class="grid-content bg-purple">监控项过滤OID：</s-col>
          <s-col span="18" class="grid-content bg-purple-light">{{monitorTypeDetail.filterOid}}</s-col>
        </s-row>
      </s-row>

      <s-row>
        <s-row class="title">
          <i class="iconfont icon-approve"></i>
          <span>中间监控指标</span>
        </s-row>
        <s-table
          :data="tempVariables">
          <s-table-column
            label="名称"
            prop="key">
          </s-table-column>
          <s-table-column
            label="OID"
            prop="value">
          </s-table-column>
          <s-table-column
            label="正则表达式"
            prop="subRegex">
          </s-table-column>
          <s-table-column
            label="状态定义"
            prop="express">
          </s-table-column>
        </s-table>
      </s-row>

      <s-row>
        <s-row class="title">
          <i class="iconfont icon-approve"></i>
          <span>监控指标</span>
        </s-row>
        <s-table
          :data="itemDescs">
          <s-table-column
            label="名称"
            prop="alias">
          </s-table-column>
          <s-table-column
            label="中文"
            prop="cn">
          </s-table-column>
          <s-table-column
            label="单位"
            prop="unit">
          </s-table-column>
          <s-table-column
            label="表达式"
            prop="express">
          </s-table-column>
          <s-table-column
            label="AVA数值定义">
          </s-table-column>
        </s-table>
      </s-row>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">
  export default{
    data() {
      return {
        monitorTypeDetail: {},     // 基本信息
        tempVariables: [],         // 中间监控指标
        itemDescs: []              // 监控指标
      }
    },
    props: {
      detailData: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    mounted() {
      this.monitorTypeDetail = this.detailData
      this.tempVariables = this.detailData.monitorValues.tempVariables
      this.itemDescs = this.detailData.monitorValues.itemDescs
      // AVA数值定义 字符串梳理
      this.itemDescs.forEach((item) => {
        if (item.statusList !== null) {
          let AVAStr = ''
          if (item.statusList.stateList.length !== 0) {
            item.statusList.stateList.forEach((list) => {
              AVAStr += `${list.name}=${list.value}，`
            })
          }
          AVAStr = AVAStr.substring(0, AVAStr.length - 1)
          this.$set(item, 'AVAStr', AVAStr)
        }
      })
    }
  }
</script>

