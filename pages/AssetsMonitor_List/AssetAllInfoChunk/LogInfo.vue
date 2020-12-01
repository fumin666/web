<template>
  <div class="logInfo">
    <s-table style="width: 100%;" :data="data">
      <s-table-column width="60" label="级别">
        <template slot-scope="scope">
          <img :src="stateImgs[scope.row.logLevel]" :alt="scope.row.logLabel" class="state">
        </template>
      </s-table-column>
      <s-table-column label="接收时间" prop="receivedTime" show-overflow-tooptip></s-table-column>
      <s-table-column label="内容" prop="logMessage" show-overflow-tooptip></s-table-column>
    </s-table>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        data: [],
        stateImgs: [
          '../../../../static/images/incident/weizhi.png',
          '../../../../static/images/incident/zhengchang.png',
          '../../../../static/images/incident/tishi.png',
          '../../../../static/images/incident/jinggao.png',
          '../../../../static/images/incident/ciyao.png',
          '../../../../static/images/incident/zhuyao.png',
          '../../../../static/images/incident/yanzhong.png'
        ]
      }
    },
    props: {
      comp: {
        type: Object,
        required: true
      }
    },
    created() {
      this.axiosData();
    },
    methods: {
      axiosData() {
        let param = {
          condition: {hostIp: this.comp.ip},
          currentPage: 1,
          totalCount: -1,
          pageSize: 5,
          pageList: [],
          distinct: false,
          orderByClause: ''
        };
        $axios.post('/searchManage/getLogInfolistForCondition', param).then(({data}) => {
          data && (this.data = data.slice(0, 5));
        });
      }
    }
  }
</script>

<style lang="stylus">

</style>
