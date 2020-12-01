<template>
    <div>
        <s-row style="margin: 15px 0 10px;">
          <s-col :span="22">
            <s-button @click='batchStar'>批量取消关注</s-button>
          </s-col>
          <s-col :span="2" style="text-align: right">
            <s-button @click="hideHandler" icon="magnifier"></s-button>
          </s-col>
        </s-row>
        <div class="commonBox" v-show="flag">
          <s-form ref="searchBox" :inline="true" class="demo-form-inline" label-width="100px" >
            <s-row>
              <s-col :span="6">
                <s-form-item label="通报编号：">
                    <s-input v-model="mywilldoneForm.safeId"></s-input>
                </s-form-item>
              </s-col>
              <s-col :span="6">
                <s-form-item label="标题：">
                    <s-input v-model="mywilldoneForm.title"></s-input>
                </s-form-item>
              </s-col>
              <s-col :span="6">
                <s-form-item label="通报类型：">
                    <s-select style="width: 200px;" v-model="mywilldoneForm.typeUuid">
                      <s-option label="全部" :value="null"></s-option>
                      <s-option v-for="(value, index) in orderTypeMap" :key="index" :value="value.uuid"
                                :label="value.bulletinName"></s-option>
                    </s-select>
                </s-form-item>
              </s-col>
              <s-col :span="6">
                <s-form-item label="提交人：">
                    <s-input v-model="mywilldoneForm.userName"></s-input>
                </s-form-item>
              </s-col>
            </s-row>
            <s-row>
              <s-col :span='6'>
                <s-form-item label="状态">
                    <s-select style="width: 200px;" v-model="mywilldoneForm.orderStatus">
                      <s-option label="全部" :value="null"></s-option>
                      <s-option v-for="(value, index) in stateData" :key="index" :value="value.value"
                                :label="value.name"></s-option>
                    </s-select>
                </s-form-item>
              </s-col>
              <s-col :span='12'>
                <s-form-item label="提交时间：">
                    <s-date-picker @change="getDateRangeStart" v-model="startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择起始时间" :editable="false">
                    </s-date-picker>
                    ~
                    <s-date-picker @change="getDateRangeEnd" v-model="endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" :editable="false" >
                    </s-date-picker>
                </s-form-item>
              </s-col>
            </s-row>
            <s-row style="text-align: right; margin-right: 8%;">
              <s-button @click="getData()">查询</s-button>
            </s-row>
          </s-form>
        </div>

        <RealPageTable   :ajax-obj="ajaxObjAssets"
                         :isChecked="true"
                         @load-callback="assetsListBack"
                         max-height='550'
                         @selection-change="assetsSelectHandle">
          <s-table-column type="selection" width="55">
          </s-table-column>
          <s-table-column prop="safeId" label="通报编号">
              <template slot-scope="scope">
                <template>
                  <span v-text="scope.row.safeId" v-if="scope.row.orderType ===1 && scope.row.needItil === 0" class="link-color" @click="detailsDia(scope.row)"></span>
                  <span v-text="scope.row.safeId" v-else class="link-color" @click="gotoItemInfo(scope.row)"></span>
                </template>
              </template>
          </s-table-column>
          <s-table-column prop="title" label="标题"></s-table-column>
          <s-table-column prop="safeType" label="通报类型"></s-table-column>
          <s-table-column prop="orderStatusName" label="状态"></s-table-column>
          <s-table-column prop="creator" label="提交人"></s-table-column>
          <s-table-column prop="createTime" label="提交时间"></s-table-column>
          <s-table-column label="操作">
            <template slot-scope="scope">
              <i class="iconfont icon iconfont icon-star-full"
                   @click="rowConcern(scope.row)"
                   ></i>
            </template>
          </s-table-column>
        </RealPageTable>
        <Information-Dialog v-model="informationDialog" v-if="informationDialog" :rowData='rowData' @receive='receive'></Information-Dialog>
    </div>
</template>
<script>
import $axios from 'sunflower-ajax'
import InformationDialog from '@/pages/Safety_BulletinTask/components/dialog/InformationDialog';
import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
import {debounce} from 'lodash'
export default {
 data() {
   return {
     mywilldoneForm: {
        safeId: '',
        title: '',
        typeUuid: null,
        userName: '',
        startTime: '',
        endTime: '',
        orderStatus: null
     },
     orderTypeMap: [],
    ajaxObjAssets: {
      type: 'post',
      url: '/safetyPlatform/safeOrder/getMyConcernOrderList',
      checkedUuidArr: [],
      params: {
        condition: {
          safeId: '',
          title: '',
          typeUuid: '',
          userName: '',
          startTime: '',
          endTime: ''
        }
      }
    },
    starArr: [],
    informationDialog: false,
    rowData: [],
    startTime: '',
    endTime: '',
    stateData: [],
    flag: false
   }
 },
 mounted() {
   this.ajaxObjAssets.params.condition = Object.assign({}, this.mywilldoneForm)
   $axios.get('/safetyPlatform/safeOrder/getAllSafeType').then(res => {
      this.orderTypeMap = res.data;
    })
   $axios.get('/safetyPlatform/safeOrder/getOrderStatusList').then(res => {
      this.stateData = res.data;
    })
 },
 components: {
   RealPageTable,
   InformationDialog
 },
 methods: {
   getData: debounce(function() {
        let startTime = new Date(this.startTime).getTime() / 1000
        let endTime = new Date(this.endTime).getTime() / 1000
        this.mywilldoneForm.startTime = startTime
        this.mywilldoneForm.endTime = endTime
        this.ajaxObjAssets.params.condition = Object.assign({}, this.mywilldoneForm)
        this.flag = false
   }, 500),
   assetsSelectHandle(selection) {
    let Arr = []
    selection.map((val) => {
       Arr.push(val.uuid)
     })
     this.starArr = Arr
   },
   receive() {

   },
   hideHandler() {
    this.flag = !this.flag
   },
   assetsListBack() {

   },
    getDateRangeStart() {
      let start = this.startTime ? new Date(this.startTime).getTime() / 1000 : 0
      let end = this.endTime ? new Date(this.endTime).getTime() / 1000 : 0
      if (end) {
        if (start > end) {
          this.$message({
            type: 'warning',
            message: '开始时间必须小于结束时间！'
          })
          this.startTime = '';
        }
      }
    },
    getDateRangeEnd() {
      let start = this.startTime ? new Date(this.startTime).getTime() / 1000 : 0
      let end = this.endTime ? new Date(this.endTime).getTime() / 1000 : 0
      if (start) {
        if (start > end) {
          this.$message({
            type: 'warning',
            message: '结束时间必须大于开始时间！'
          })
          this.endTime = '';
        }
      }
    },
   detailsDia(val) {
     this.rowData = val
     this.informationDialog = true
   },
   batchStar() {
     if (this.starArr.length > 0) {
        $axios.post(`/safetyPlatform/safeOrder/batchCancleConcern`, this.starArr).then(({data}) => {
          if (data.state) {
            this.$message({showClose: true, message: '批量取消关注成功', type: 'success'});
            this.ajaxObjAssets.params.condition = Object.assign({}, this.mywilldoneForm)
            this.starArr = []
          } else {
            this.$message({showClose: true, message: '取消关注失败', type: 'error'});
          }
        });
     } else {
        this.$message({showClose: true, message: '请勾选至少一个选项!', type: 'error'});
     }
   },
   rowConcern(rowData) {
     let parms = {
        orderUuid: rowData.uuid,
        orderType: rowData.orderType,
        type: 2
     }
      $axios.post(`/safetyPlatform/safeOrder/concernOrderOrTask`, parms).then(({data}) => {
        if (data.state) {
          if (rowData.isConcern === 0) {
            this.$message({showClose: true, message: '关注成功', type: 'success'});
          } else {
            this.$message({showClose: true, message: '取消关注成功', type: 'success'});
          }
          this.ajaxObjAssets.params.condition = Object.assign({}, this.mywilldoneForm)
        } else {
          this.$message({showClose: true, message: '关注失败', type: 'error'});
        }
      });
    },
   gotoItemInfo(row) {
    if (row.orderType === 1) {
      this.$router.push(`/SafetyBulletin/safetyBulletin_details/${row.uuid}`)
    } else {
      this.$router.push(`/SafetyBulletin/safetyBulletin_dispose/${row.uuid}`);
    }
  }
 }
}
</script>
