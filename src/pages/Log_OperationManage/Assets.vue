/**
* Created by alex on 2019/2/26.
*/
<template>
  <section class="content">
    <s-form :inline="true">
      <select-time ref="selecttime">
        <template slot="serachForm">
          <s-form-item label="资产类别：">
            <select-tree :muti="true" @selectMutiTreeChange="nextSelect"></select-tree>
          </s-form-item>
          <s-form-item label="资产名称：">
            <s-input v-model="assetName"></s-input>
          </s-form-item>
        </template>
        <template slot="searchBtn">
          <div class="search_btn">
            <s-button title="查询" icon='magnifier' @click="getList">查询</s-button>
          </div>
        </template>
      </select-time>
    </s-form>
    <s-row style="margin: 15px 0 10px;">
      <s-button title="EXCEL报表" icon="excel" @click="downloadHandle('excel')">EXCEL报表</s-button>
      <s-button title="WORD报表" icon="word" @click="downloadHandle('word')">WORD报表</s-button>
      <s-button title="PDF报表" icon="pdf" @click="downloadHandle('pdf')">PDF报表</s-button>
    </s-row>
    <s-table-page :data="topLists" >
      <s-table-column label="资产类别" prop="citypeName"></s-table-column>
      <s-table-column label="资产名称" prop="deviceName"></s-table-column>
      <s-table-column label="资产IP" prop="deviceIp"></s-table-column>
      <s-table-column label="登录名" prop="userRealName"></s-table-column>
      <s-table-column label="访问量" prop="sessionNum"></s-table-column>
    </s-table-page>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  // import inputTree from '@/components/inputTree/InputTree';
  import {Download} from 'sunflower-common-utils'

  import SelectTime from '@/components/selectTime/SelectTime.vue'
  import SelectTree from '@/components/selectTree/SelectTree'

  export default {
    components: {
      SelectTime,
      // inputTree,
      SelectTree
    },
    data() {
      return {
        defaultProps: {
          children: 'childrenList',
          label: 'name'
        },
        topLists: [],
        classUuid: [],
        selection: [],
        nameValue: '',
        assetName: ''
      }
    },
    methods: {
      nextSelect(val) {
        let vm = this;
        vm.classUuid = [];
        vm.selection = [];
        vm.nameValue = '';
        val.map((item) => {
          vm.classUuid.push(item.uuid)
        });
      },
      getList() {
        let period = {
          startTime: this.$refs.selecttime.beginTimes,
          endTime: this.$refs.selecttime.endTimes,
          citypeUuidList: this.classUuid,
          itcompName: this.assetName
        }
        $axios.post('/operationLogStat/itcompAccessCount', period).then((res) => {
          this.topLists = res.data
        });
      },
      downloadHandle(type) {
        let form = {
          startTime: this.$refs.selecttime.beginTimes,
          endTime: this.$refs.selecttime.endTimes,
          citypeUuidList: this.classUuid,
          itcompName: this.assetName,
          exportType: type
        }
        $axios.post('/operationLogStat/makeItcompAccessFile', form).then((res) => {
          if (res.data) {
            Download(`/operationLogStat/downItcompAccessFile/${type}`);
          }
        });
      }
    },
    mounted() {
      this.getList()
    }
  }
</script>
