<template>
    <div>
        <s-form :inline="true" class="search_form" label-width="85px" style="margin-top:10px">
            <div class="form_item">
                <s-form-item label="通报编号：">
                    <s-input v-model="mywilldoneForm.safeId"></s-input>
                </s-form-item>
                <s-form-item label="标题：">
                    <s-input v-model="mywilldoneForm.title"></s-input>
                </s-form-item>
                <s-form-item label="通报类型：">
                    <s-select style="width: 200px;" v-model="mywilldoneForm.typeUuid">
                      <s-option label="全部" :value="null"></s-option>
                      <s-option v-for="(value, index) in orderTypeMap" :key="index" :value="value.uuid"
                                :label="value.bulletinName"></s-option>
                    </s-select>
                </s-form-item>
                <s-form-item label="提交人：">
                    <s-input v-model="mywilldoneForm.userName"></s-input>
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
        <s-button style="margin:10px 0" @click='batchStar'>批量关注</s-button>
        <RealPageTable   :ajax-obj="ajaxObjAssets"
                         :isChecked="true"
                         @load-callback="assetsListBack"
                         @selection-change="assetsSelectHandle">
          <s-table-column type="selection" width="55">
          </s-table-column>
          <s-table-column prop="safeId" label="通报编号">
              <template slot-scope="scope">
                <template>
                  <span v-text="scope.row.safeId" class="link-color" @click="gotoItemInfo(scope.row)"></span>
                </template>
              </template>
          </s-table-column>
          <s-table-column prop="title" label="标题"></s-table-column>
          <s-table-column prop="safeType" label="通报类型"></s-table-column>
          <s-table-column prop="orderStatusName" label="状态"></s-table-column>
          <s-table-column prop="creator" label="提交人"></s-table-column>
          <s-table-column prop="createTime" label="提交时间"></s-table-column>
          <s-table-column label="操作" width="150">
            <template slot-scope="scope">
              <i class="iconfont icon-order-track" :class="scope.row.orderType === 1 && scope.row.orderStatus === 1 ? 'noButton': ''" :title="scope.row.orderType === 1 && scope.row.orderStatus === 1 ? '工单未启动，请在启动时间后操作': '处理'" @click="dispose(scope.row)"> </i>
              <i class="iconfont icon-assigned" :class="scope.row.orderType === 1 && scope.row.orderStatus === 1 ? 'noButton': ''" :title="scope.row.orderType === 1 && scope.row.orderStatus === 1 ? '工单未启动，请在启动时间后操作': '委派'" @click="appoint(scope.row)"> </i>
              <i class="iconfont" :class="[scope.row.isConcern ? 'icon iconfont icon-star-full' : 'icon iconfont icon-star-empty']"
                   @click="rowConcern(scope.row)"
                   :title="scope.row.isConcern ? '取消关注' : '关注'"></i>
            </template>
          </s-table-column>
        </RealPageTable>
        <appoint-dialog v-model="appointDialog" v-if="appointDialog" :taskName='taskName' :orderUuid='orderUuid' :currentNodeUuid='currentNodeUuid' @receive="getData"></appoint-dialog>
    </div>
</template>
<script>
import $axios from 'sunflower-ajax'
import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
import AppointDialog from '@/pages/Safety_BulletinTask/components/dialog/AppointDialog';
import {debounce} from 'lodash'
export default {
 data() {
   return {
     mywilldoneForm: {
        safeId: '',
        title: '',
        typeUuid: null,
        userName: ''
     },
    ajaxObjAssets: {
      type: 'post',
      url: '/safetyPlatform/safeOrder/getNeedMineDoOrder',
      checkedUuidArr: [],
      params: {
        condition: {
        }
      }
    },
    appointDialog: false,
    orderUuid: '',
    taskName: '',
    currentNodeUuid: '',
    orderTypeMap: [],
    starArr: [],
    selections: [],
    startTime: '',
    endTime: ''
   }
 },
 mounted() {
   this.ajaxObjAssets.params.condition = Object.assign({}, this.mywilldoneForm)
   $axios.get('/safetyPlatform/safeOrder/getAllSafeType').then(res => {
      this.orderTypeMap = res.data;
    })
 },
 components: {
   RealPageTable,
   AppointDialog
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
       Arr.push({
         orderUuid: val.uuid,
         orderType: val.orderType
       })
     })
     console.log()
     this.starArr = Arr
     this.selections = selection
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
   dispose(row) {
      if (row.orderType === 1 && row.orderStatus === 1) {
         return
      } else {
        this.$router.push(`/SafetyBulletin/safetyBulletin_details/${row.uuid}`)
      }
   },
   appoint(row) {
     if (row.orderType === 1 && row.orderStatus === 1) {
       return
     } else {
        this.appointDialog = true
        this.orderUuid = row.uuid
        this.taskName = row.safeId
        this.currentNodeUuid = row.currentNodeUuid
     }
   },
   batchStar() {
     if (this.starArr.length > 0) {
        $axios.post(`/safetyPlatform/safeOrder/batchConcernOrderOrTask`, this.starArr, {
          data: this.selections,
          logTemplate: '关注|通报(#safeId#)'
        }).then(({data}) => {
          if (data.state) {
            this.$message({showClose: true, message: '批量关注成功', type: 'success'});
            this.ajaxObjAssets.params.condition = Object.assign({}, this.mywilldoneForm)
            this.starArr = []
          } else {
            this.$message({showClose: true, message: '关注失败', type: 'error'});
          }
        });
     } else {
      this.$message({showClose: true, message: '请勾选至少一个选项!', type: 'error'});
     }
   },
   gotoItemInfo(row) {
      if (row.orderType === 1) {
        this.$router.push(`/SafetyBulletin/safetyBulletin_details/${row.uuid}`)
      } else {
        this.$router.push(`/SafetyBulletin/safetyBulletin_dispose/${row.uuid}`);
      }
   },
   rowConcern(rowData) {
     let type
     if (rowData.isConcern === 1) {
       type = 0
     } else {
       type = 1
     }
     let parms = {
        orderUuid: rowData.uuid,
        orderType: rowData.orderType,
        type: type
     }
     let str = ''
     str = rowData.isConcern === 0 ? '关注|通报(#safeId#)' : '取消关注|通报(#safeId#)'
     $axios.post(`/safetyPlatform/safeOrder/concernOrderOrTask`, parms, {
        data: [rowData],
        logTemplate: str
      }).then(({data}) => {
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
    }
 }
}
</script>
