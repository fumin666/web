<template>
    <div>
        <s-form :inline="true" class="search_form" label-width="85px">
            <div class="form_item">
                <s-form-item label="工作编号：">
                    <s-input v-model="mywilldoneForm.safeId"></s-input>
                </s-form-item>
                <s-form-item label="标题：">
                    <s-input v-model="mywilldoneForm.title"></s-input>
                </s-form-item>
                <s-form-item label="工作类型：">
                   <s-select style="width: 200px;" v-model="mywilldoneForm.typeUuid">
                      <s-option label="全部" :value="null"></s-option>
                      <s-option v-for="(value, index) in orderTypeMap" :key="index" :value="value.uuid"
                                :label="value.bulletinName"></s-option>
                    </s-select>
                </s-form-item>
                <s-form-item label="提交人：">
                    <s-input v-model="mywilldoneForm.userName"></s-input>
                </s-form-item>
                <s-form-item label="状态：">
                  <s-select v-model="mywilldoneForm.orderStatus">
                    <s-option label="全部" :value="null"></s-option>
                    <s-option v-for="(value, index) in stateData" :key="index" :value="value.value"
                              :label="value.name"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="提交时间：">
                    <s-date-picker @change="getDateRangeStart" v-model="startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择起始时间" :editable="false">
                    </s-date-picker>
                    ~
                    <s-date-picker @change="getDateRangeEnd" v-model="endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" :editable="false" >
                    </s-date-picker>
                </s-form-item>
            </div>
            <div class="search_btn">
                <s-button icon="magnifier" @click="getData">查询</s-button>
            </div>
        </s-form>
        <s-button style="margin:15px 0 10px" @click='batchStar'>批量取消关注</s-button>
        <RealPageTable   :ajax-obj="ajaxObjAssets"
                         :isChecked="true"
                         max-height='550'
                         @load-callback="assetsListBack"
                         @selection-change="assetsSelectHandle">
          <s-table-column type="selection" width="45">
          </s-table-column>
          <s-table-column prop="safeId" label="工作编号">
              <template slot-scope="scope">
                <template>
                  <a v-text="scope.row.safeId" v-if="scope.row.orderType ===1 && scope.row.needItil === 0" class="ip" href="javascript:;" @click="detailsDia(scope.row)"></a>
                  <a v-text="scope.row.safeId" v-else class="ip" href="javascript:;" @click="gotoItemInfo(scope.row)"></a>
                </template>
              </template>
          </s-table-column>
          <s-table-column prop="title" label="标题"></s-table-column>
          <s-table-column prop="safeType" label="工作类型"></s-table-column>
          <s-table-column prop="orderStatusName" label="状态"></s-table-column>
          <s-table-column prop="creator" label="提交人"></s-table-column>
          <s-table-column prop="createTime" label="提交时间"></s-table-column>
          <s-table-column label="操作" width="150">
            <template slot-scope="scope">
              <i class="iconfont icon icon-star-full"
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
        isGradeProtect: 1,
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
     stateData: []
   }
 },
 mounted() {
   this.ajaxObjAssets.params.condition = Object.assign({}, this.mywilldoneForm)
   $axios.get('/safetyPlatform/safeOrder/getAllSafeType').then(res => {
     this.orderTypeMap = res.data.filter(item => {
       return (item.bulletinName === '等保工作-最佳实践') || (item.bulletinName === '等保工作-简化版');
     })
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
     if (this.starArr.length === 0) {
       this.$message({showClose: true, message: '至少选中一项取消关注', type: 'error'});
     } else {
       $axios.post(`/safetyPlatform/safeOrder/batchCancleConcern`, this.starArr).then(({data}) => {
         if (data.state) {
           this.$message({showClose: true, message: '批量取消关注成功', type: 'success'});
           this.ajaxObjAssets.params.condition = Object.assign({}, this.mywilldoneForm)
           this.starArr = []
         } else {
           this.$message({showClose: true, message: '取消关注失败', type: 'error'});
         }
       });
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
      this.$router.push(`/GradeProtect/safetyBulletin_details/${row.uuid}`)
    } else {
      this.$router.push(`/GradeProtect/safetyBulletin_dispose/${row.uuid}`);
    }
  }
 }
}
</script>
