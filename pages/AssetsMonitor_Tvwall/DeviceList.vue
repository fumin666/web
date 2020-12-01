<template>
  <div>
    <s-scrollbar wrap-style="height: 545px;">
    <s-input style="width:200px;float:right;margin-bottom:10px" placeholder="提示：请输入型号/资产名称/ip地址/分类查询" v-model='mywilldoneForm.searchKey' @change="changeData"></s-input>
    <RealPageTable :ajax-obj="ajaxObjAssets"
                @res-callback="resCallback"
                 ref="multipleTable"
                 >
      <s-table-column
        prop="状态"
        label="状态"
        width="70" align="center">
        <template slot-scope="scope">
          <img class="hostStatusIcon" :src="filterStateImg(scope.row['状态'])"/>
        </template>
      </s-table-column>
      <s-table-column
        prop="型号"
        label="型号"
        width="120"
        show-overflow-tooltip>
      </s-table-column>
      <s-table-column
        prop="资产名称"
        label="资产名称"
        width="160" align="center">
      </s-table-column>
      <s-table-column
        prop="IP地址"
        label="IP地址"
        width="150" align="center">
      </s-table-column>
      <s-table-column
        prop="资产分类"
        label="资产分类"
        width="130" align="center">
      </s-table-column>
          <s-table-column label="操作" width="150">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" @click="dispose(scope.row)"> </i>
            </template>
          </s-table-column>
    </RealPageTable>
    </s-scrollbar>
  </div>
</template>
<script>
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  // import $axios from 'sunflower-ajax'
  import Bus from '@/plugins/eventBus'
  export default {
    data() {
      return {
        tableData: [],
        ajaxObjAssets: {
          type: 'post',
          url: '/resourcemanager/assetmanager/itasset/monitorListForEventCenterOfTvWall',
          checkedUuidArr: [],
          params: {
            condition: {
            }
          }
        },
        mywilldoneForm: {
          citypeUuid: '',
          searchKey: ''
        }
      }
    },
    components: {
      RealPageTable
    },
    mounted () {
      this.mywilldoneForm.citypeUuid = this.data.uuid
      this.ajaxObjAssets.params.condition = Object.assign({}, this.mywilldoneForm)
    },
    props: {
      data: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      changeData(val) {
        this.mywilldoneForm.searchKey = val
        this.ajaxObjAssets.params.condition = Object.assign({}, this.mywilldoneForm)
      },
      resCallback(data) {
          // 宕机
          let deviceOffline = [];
          // 正常
          let deviceOnline = [];
          // 告警
          let deviceWarn = [];
          let dataAry = data
          for (let i = 0; i < dataAry.length; i++) {
            let status = dataAry[i]['状态'];
            if (status === 2) {
              deviceWarn.push(dataAry[i])
            }
            if (status === 0) {
              deviceOffline.push(dataAry[i]);
            }
            if (status === 1) {
              deviceOnline.push(dataAry[i]);
            }
          }
          this.tableData = deviceOffline.concat(deviceWarn).concat(deviceOnline);
          return this.tableData
      },
      // 主机状态图标匹配
      filterStateImg(val) {
        switch (val) {
          case 0: return '/static/images/resourcemanage/deviceOffline.png';
          case 1: return '/static/images/resourcemanage/deviceOnline.png';
          case 2: return '/static/images/resourcemanage/deviceWarn.png';
          default: return '/static/images/resourcemanage/deviceOnline.png';
        }
      },
      dispose(row) {
        Bus.$emit('event-list', row.uuid);
      },
      getSearchDef() {
        return {
          width: 4,
          offset: 8,
          placeholder: '请输入查询条件',
          searchProps: ['IP地址', '型号', '维护人', '资产名称', '分类一级', '分类二级', '分类三级'] // can be string or Array
        }
      }
    }
  }
</script>
<style>
  .s-col-offset-8{
    margin-left: 815px;
  }
</style>
