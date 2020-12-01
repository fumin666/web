<template>
  <div class="content">
    <s-card  class="box-card" style="width:100%;">
      <div slot="header" class="clearfix">
        <span class="card-title">
          <i class="iconfont icon-line"></i>
          线路详情信息
        </span>
        <s-button icon="arrow-left" size="mini" @click="backAction" title="返回" style="float: right;"></s-button>
      </div>
      <table class="itemTable">
        <tr>
          <td class="title bg-purple">线路名称</td>
          <td class="item bg-purple-light">
            {{ filterLinkName(linkDetail) }}
          </td>
          <td class="title bg-purple">线路状态</td>
          <td class="item bg-purple-light">{{ getState(linkDetail.isOnline) }}</td>
        </tr>
        <tr>
          <td class="title bg-purple">源资产</td>
          <td class="item bg-purple-light">
            {{ linkDetail.sourceHostName }}
          </td>
          <td class="title bg-purple">目的资产</td>
          <td class="item bg-purple-light">
            {{ linkDetail.targetHostName }}
          </td>
        </tr>
        <tr>
          <td class="title bg-purple">源端口</td>
          <td class="item bg-purple-light">
            {{ linkDetail.sourceInterfaceName }}
          </td>
          <td class="title bg-purple">目的端口</td>
          <td class="item bg-purple-light">
            {{ linkDetail.targetInterfaceName }}
          </td>
        </tr>
        <tr>
          <td class="title bg-purple">源端口发送速率</td>
          <td class="item bg-purple-light">
            {{ getData(linkDetail.sourceData, 'outSpeed', 'kbps') }}
          </td>
          <td class="title bg-purple">目的端口发送速率</td>
          <td class="item bg-purple-light">
            {{ getData(linkDetail.targetData, 'outSpeed', 'kbps') }}
          </td>
        </tr>
        <tr>
          <td class="title bg-purple">源端口接收速率</td>
          <td class="item bg-purple-light">
            {{ getData(linkDetail.sourceData, 'inSpeed', 'kbps') }}
          </td>
          <td class="title bg-purple">目的端口接收速率</td>
          <td class="item bg-purple-light">
            {{ getData(linkDetail.targetData, 'inSpeed', 'kbps') }}
          </td>
        </tr>
        <tr>
          <td class="title bg-purple">源端口发送丢包率</td>
          <td class="item bg-purple-light">
            {{ getData(linkDetail.sourceData, 'outPacket', '%') }}
          </td>
          <td class="title bg-purple">目的端口发送丢包率</td>
          <td class="item bg-purple-light">
            {{ getData(linkDetail.targetData, 'outPacket', '%') }}
          </td>
        </tr>
        <tr>
          <td class="title bg-purple">源端口接收丢包率</td>
          <td class="item bg-purple-light">
            {{ getData(linkDetail.sourceData, 'inPacket', '%') }}
          </td>
          <td class="title bg-purple">目的端口接收丢包率</td>
          <td class="item bg-purple-light">
            {{ getData(linkDetail.targetData, 'inPacket', '%') }}
          </td>
        </tr>
        <tr>
          <td class="title bg-purple">源端口带宽利用率</td>
          <td class="item bg-purple-light">
            {{ getData(linkDetail.sourceData, 'utilization', '%') }}
          </td>
          <td class="title bg-purple">目的端口带宽利用率</td>
          <td class="item bg-purple-light">
            {{ getData(linkDetail.targetData, 'utilization', '%') }}
          </td>
        </tr>
      </table>
    </s-card>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        titles: ['宕机', '正常', '告警']
      }
    },
    props: {
      linkDetail: {
        type: Object,
        required: true
      }
    },
    methods: {
      filterLinkName (row) {
        if (row.linkName) {
          return row.linkName;
        } else {
          return row.sourceIp + '—' + row.targetIp;
        }
      },
      getState (isOnline) {
        return this.titles[isOnline];
      },
      getData (data, item, unit) {
        if (typeof data !== 'undefined') {
          return (data[item] || '0') + unit;
        } else {
          return '0' + unit;
        }
      },
      backAction () {
        window.TopologyGraph.getGraphVm().thirdTabContent = 'list';
      }
    }
  }
</script>
