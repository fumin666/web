/*
create by YOU
*/
<template>
  <div>
    <div class="current-baseline">
      <a @click="lookCurrent"
         :href="currentInfo.uuid ? `/#/AssetsAll/assets_list/configuration_baseline/${uuid}/current` : 'javascript:;'">
        <div class="current-baseline-left">
          <img src="../../../assets/images/currentBaseLine.png" alt="当前配置基准" title="当前配置基准">
          <span>当前配置基准</span>
        </div>
      </a>
      <div class="current-baseline-right">
        <span>变更人: {{currentInfo.userName || '无'}} | 变更时间: {{currentInfo.updateTime || '无'}}</span>
      </div>
    </div>
    <s-table-page
      :data="data"
      :header-actions="getActionsDef()"
      @selection-change="handleSelectionChange">
      <s-table-column type="selection" width="45" reserve-selection></s-table-column>
      <s-table-column label="变更时间" prop="updateTime"></s-table-column>
      <s-table-column label="变更人" prop="userName"></s-table-column>
      <s-table-column label="操作" width="180">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看" @click="view(scope.row)"></i>
          <i class="iconfont icon-folder" title="置为当前基准" @click="setCurrent(scope.row)"></i>
          <i class="iconfont icon-delete" title="删除" @click="deleteSingle(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table-page>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        uuid: null,
        data: [],
        selectionList: [],
        currentInfo: {},
        originData: []
      }
    },
    created() {
      this.uuid = this.$route.params.id
      this.getCurrentInfo()
      this.getData()
      $axios.get(`/baseline/getCurBaselineVals/${this.uuid}`).then(({data}) => {
        if (data && data instanceof Array) {
          this.originData = data
        }
      })
    },
    methods: {
      getData() {
        $axios.get(`/baseline/getBaselinConfByItcompUuid/${this.uuid}`).then(({data}) => {
          this.data = data
        })
      },
      getCurrentInfo() {
        $axios.get(`/baseline/getCurBaselinConfByItcompUuid/${this.uuid}`).then(({data}) => {
          this.currentInfo = data
        })
      },
      lookCurrent(e) {
        if (!this.currentInfo.uuid) {
          this.$message.warning('未设置当前配置基准！')
          e.preventDefault()
        }
      },
      getActionsDef() {
        let vm = this;
        return {
          width: 12,
          actions: [{
            name: '批量删除',
            icon: 'batch-del',
            click() {
              vm.deleteMutiply();
            }
          }]
        }
      },
      handleSelectionChange(selection) {
        this.selectionList = selection
      },
      view(row) {
        this.$router.push(`/AssetsAll/assets_list/configuration_baseline/${this.uuid}/view/${row.uuid}`)
      },
      setCurrent(row) {
        this.$confirm(`确定将 ${row.updateTime} 的状态置为当前基准？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/baseline/setCurBaseline/${row.uuid}`).then(({data}) => {
            if (data.state === true) {
              this.$message.success('设置成功')
              this.getData()
            } else {
              this.$message.error(data.errormsg || '设置失败')
            }
          })
        }).catch((e) => {
        })
      },
      doDelete(data) {
        this.$confirm(`确定删除？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let uuids = data.map(item => item.uuid)
          let arr = data.map(item => {
            return Object.assign({}, item, {controlAdderss: this.originData[1].attrValStr, itcompName: this.originData[0].attrValStr})
          })
          let obj = {
            data: arr,
            logTemplate: '删除|资产(#controlAdderss#/#itcompName#)>配置>变更时间(#updateTime#)'
          }
          $axios.post(`/baseline/delBaselineConf`, uuids, obj).then(({data}) => {
            if (data.state === true) {
              this.$message.success('删除成功')
              this.getData()
            } else {
              this.$message.error(data.errormsg || '删除失败')
            }
          })
        }).catch((e) => {
        })
      },
      deleteSingle(row) {
        this.doDelete([row])
      },
      deleteMutiply() {
        if (this.selectionList.length > 0) {
          this.doDelete(this.selectionList)
        } else {
          this.$message.warning('请选择要删除的项')
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
