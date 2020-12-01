<template>
  <div class="diy-asset-ops-script">
    <s-card-diy
      title="运维脚本"
      :more-click="moreClick"
      show-scrollbar>
      <div style="width: 100%; height: 100%; padding: 10px;">
        <s-table
          :data="list">
          <s-table-column
            prop="assetName"
            label="主机名称"/>
          <s-table-column
            prop="scriptName"
            label="脚本名称"/>
          <s-table-column
            label="执行状态">
            <template slot-scope="scope">
              <span :style="`color: ${scope.row.excuteStatus === 0 ? '#ff4a4a' : ''}`">{{getStatus(scope.row.excuteStatus)}}</span>
            </template>
          </s-table-column>
          <s-table-column
            label="执行结果">
            <template slot-scope="scope">
              <span v-text="scope.row.result !==null ? scope.row.result.replace(/<\/br>/g, ' ') : ''"></span>
            </template>
          </s-table-column>
          <s-table-column
            prop="endTime"
            label="时间"/>
        </s-table>
      </div>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        list: []
      }
    },
    computed: {
      ...mapGetters(['firstMenu'])
    },
    created() {
      this.getList();
    },

    methods: {
      getList() {
        let form = {
          condition: {},
          currentPage: 1,
          pageSize: 10
        };
        $axios.post('/automateLog/searchScriptTaskLogList', form).then((res) => {
          if (res.data && res.data.pageList && res.data.pageList instanceof Array) {
            this.list = res.data.pageList;
          }
        });
      },

      moreClick() {
        this.$router.push('/AutoOpsCenter/autoops_log/0');
      },

      getStatus(val) {
        return ['失败', '成功'][val];
      }
    }
  }
</script>

<style>
  .diy-asset-ops-script {
    width: 100%;
    height: 100%;
  }
</style>
