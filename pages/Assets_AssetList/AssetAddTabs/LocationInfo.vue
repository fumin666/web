<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 18:20:20
 * @LastEditTime : 2020-01-02 17:43:15
 * @LastEditors  : mybells
 -->
<!-- 位置信息 -->
<template>
  <div>
    <s-row style="margin-bottom: 10px;" v-if="permission && !assetName">
      <s-button @click="addLocation" icon="plus">添加</s-button>
    </s-row>
    <s-table-page
      max-height="300"
      :data="dataList">
      <s-table-column label="位置名称" prop="name" show-overflow-tooltip></s-table-column>
      <s-table-column label="城市" prop="cityName" show-overflow-tooltip></s-table-column>
      <s-table-column label="区域" prop="countyName" show-overflow-tooltip></s-table-column>
      <s-table-column label="建筑物" prop="building" show-overflow-tooltip></s-table-column>
      <s-table-column label="楼层" prop="floor" show-overflow-tooltip></s-table-column>
      <s-table-column label="分区" prop="partition" show-overflow-tooltip></s-table-column>
      <s-table-column label="位置" prop="locationSite" show-overflow-tooltip></s-table-column>
      <s-table-column label="操作" width="110" v-if="permission && !assetName">
        <template slot-scope="scope">
          <i class="iconfont icon-edit" @click="rowEdit(scope.row)" title="修改" ></i>
          <i class="iconfont icon-delete" @click="rowDel(scope.row)" title="删除" ></i>
        </template>
      </s-table-column>
    </s-table-page>

    <!--添加位置-->
    <s-dialog
      width="900px"
      v-if="addLocationFlag"
      v-model="addLocationFlag"
      title="添加"
      append-to-body
    >
      <account-location-dialog ref="addAccountLocation"></account-location-dialog>
      <template slot="footer">
        <s-button @click="saveAddLocation">保存</s-button>
        <s-button type="cancel" @click="addLocationFlag = false">取消</s-button>
      </template>
    </s-dialog>

    <!--修改位置-->
    <s-dialog
      width="900px"
      v-if="changeLocationFlag"
      v-model="changeLocationFlag"
      title="修改"
      append-to-body
    >
      <account-location-dialog ref="changeAccountLocation" :editData="editData"></account-location-dialog>
      <template slot="footer">
        <s-button @click="saveChangeLocation">保存</s-button>
        <s-button type="cancel" @click="changeLocationFlag = false">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import AccountLocationDialog from '../AssetOtherDialog/AccountLocationDialog.vue';
  export default {
    data() {
      return {
        dataList: [],
        addLocationFlag: false,
        changeLocationFlag: false,
        editData: {},
        uuid: ''
      }
    },
    props: {
      assetName: {
        type: Boolean,
        default: false
      },
      addAssetUuid: {
        type: String,
        default: ''
      },
      permission: {   // 表示是否有操作按钮的权限
        type: Boolean,
        default: false
      }
    },
    components: {
      AccountLocationDialog
    },
    methods: {
      addLocation() {
        if (this.addAssetUuid === '') {
          this.$message({showClose: true, message: '请先正确填写资产信息', type: 'warning'});
          return
        }
        this.handlerAdd();
      },
      handlerAdd() {
        this.addLocationFlag = true;
      },
      axiosData() {
        $axios.get('/resourcemanager/assetmanager/itasset/getCmdbLocationByItcompUuid/' + this.uuid).then((res) => {
          this.dataList = res.data;
        })
      },
      saveAddLocation() {
        let newRow = this.$refs['addAccountLocation'].uuid;
        if (newRow === '') {
          this.$message.warning('请选择一条记录');
          return false;
        }
        if (this.dataList.length > 0) {
          for (let i in this.dataList) {
            if (this.dataList[i].uuid === newRow) {
              this.$message({
                message: '该位置已经存在',
                type: 'error'
              });
              this.addLocationFlag = false;
              return;
            }
          }
          $axios.get('/resourcemanager/assetmanager/itasset/updateMonitorItcompByLocation/' + this.uuid + '/' + newRow).then((res) => {
            this.axiosData();
            this.addLocationFlag = false;
          })
        } else {
          $axios.get('/resourcemanager/assetmanager/itasset/updateMonitorItcompByLocation/' + this.uuid + '/' + newRow).then((res) => {
            this.axiosData();
            this.addLocationFlag = false;
          })
        }
      },
      saveChangeLocation() {
        let newRow = this.$refs['changeAccountLocation'].uuid;
        for (let i in this.dataList) {
          if (this.dataList[i].uuid === newRow) {
            this.$message({
              message: '该位置已经存在',
              type: 'error'
            });
            this.changeLocationFlag = false;
            return;
          }
        }
        $axios.get('/resourcemanager/assetmanager/itasset/updateMonitorItcompByLocation/' + this.uuid + '/' + newRow).then((res) => {
          this.axiosData();
        })
        this.changeLocationFlag = false;
      },
      rowEdit(row) {
        this.editData = row;
        this.changeLocationFlag = true;
      },
      rowDel(row) {
        this.$confirm('确定删除？', '提示', { confirmButtonText: ' 确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.get('/resourcemanager/assetmanager/itasset/updateMonitorItcompByLocation/' + this.uuid + '/' + null).then((res) => {
            this.dataList = [];
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        }).catch(() => {});
      }
    },
    created() {
      if (this.$route.name === 'AssetsAll_assetEdit') {
        this.uuid = this.$route.params.assetUuid;
      } else {
        this.uuid = this.addAssetUuid
      }
      this.axiosData();
    }
  }
</script>

<style lang="stylus">

</style>
