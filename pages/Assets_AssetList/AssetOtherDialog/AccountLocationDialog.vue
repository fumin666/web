<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-08 14:21:44
 * @LastEditTime: 2019-08-23 16:21:29
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <s-table-page  max-height="480" :data="dataList"
                 highlight-current-row
                 ref="tableGroup"
                 :header-search="getSearchDef()"
    >
      <s-table-column width="70" v-if="dataList.length !== 0">
        <template slot-scope="scope">
          <s-radio class="radio" v-model="uuid" :label="scope.row.uuid">&nbsp;</s-radio>
        </template>
      </s-table-column>
      <s-table-column label="位置名称" width="90" prop="name" show-overflow-tooltip></s-table-column>
      <s-table-column label="城市" prop="cityName" show-overflow-tooltip></s-table-column>
      <s-table-column label="区域" prop="countyName" show-overflow-tooltip></s-table-column>
      <s-table-column label="建筑物" prop="building" show-overflow-tooltip></s-table-column>
      <s-table-column label="楼层" prop="floor" show-overflow-tooltip></s-table-column>
      <s-table-column label="分区" prop="partition" show-overflow-tooltip></s-table-column>
      <s-table-column label="位置" prop="locationSite" show-overflow-tooltip></s-table-column>
    </s-table-page>
  </div>
</template>

<script>

  import $axios from 'sunflower-ajax';
  export default {
    data() {
      return {
        dataList: [],
        editDataList: [],
        currentRow: null,
        uuid: ''
      }
    },

    props: {
      editData: {
        type: Object
      }
    },
    methods: {
      getSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询内容',
          searchProps: ['name', 'cityName', 'countyName', 'building', 'floor', 'partition', 'locationSite']
        }
      },
      getData() {
        $axios.get('/resourcemanager/configurationmanage/location/list').then((res) => {
          if (res.status === 200) {
            this.dataList = res.data;
          }
        })
      }
    },
    created() {
      if (this.editData !== undefined) {
        this.currentRow = this.editData;
        this.uuid = this.editData.uuid;
        $axios.get('/resourcemanager/configurationmanage/location/list').then((res) => {
          if (res.status === 200) {
            this.editDataList = res.data;
            for (let i in this.editDataList) {
              if (this.editDataList[i].uuid === this.uuid) {
                let temp = this.editDataList[i];
                this.editDataList.splice(i, 1);
                this.editDataList.unshift(temp);
                this.dataList = this.editDataList;
              }
            }
          }
        })
      } else {
        this.getData();
      }
    }
  }
</script>

<style lang="stylus">

</style>
