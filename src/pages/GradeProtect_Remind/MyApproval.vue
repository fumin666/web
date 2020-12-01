<template>
  <div>
    <s-form :inline="true" class="search_form" label-width="85px" style="margin-top:10px">
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
    <s-button style="margin:15px 0 10px" @click='batchStar'>批量关注</s-button>
    <RealPageTable   :ajax-obj="ajaxObjAssets"
                     :isChecked="true"
                     @load-callback="assetsListBack"
                     @selection-change="assetsSelectHandle">
      <s-table-column type="selection" width="55">
      </s-table-column>
      <s-table-column prop="safeId" label="工作编号">
        <template slot-scope="scope">
          <template>
            <a v-text="scope.row.safeId" class="ip" href="javascript:;" @click="gotoItemInfo(scope.row)"></a>
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
          <i class="iconfont icon-finish" @click="appove(scope.row,1)" title="通过"> </i>
          <i class="iconfont icon-cancel" @click="appove(scope.row,0)" title="拒绝"> </i>
          <i class="iconfont" :class="[scope.row.isConcern ? 'icon iconfont icon-star-full' : 'icon iconfont icon-star-empty']"
             @click="rowConcern(scope.row)"
             :title="scope.row.isConcern ? '取消关注' : '关注'"></i>
        </template>
      </s-table-column>
    </RealPageTable>
    <s-dialog
      v-model="appoveDialog"
      v-if="appoveDialog"
      width="600px"
      append-to-body
      :before-close="deadlineClose"
      class="createProcess"
      title="审批工单">
      <s-form :model="appoveForm" :rules="appoveRule" ref="appoveForm" label-width='125px'>
        <s-form-item label="审批意见：" prop='approvalResult'>
          <s-radio class="radio" v-model="appoveForm.approvalResult" :value='1' :label="1">通过</s-radio>
          <s-radio class="radio" v-model="appoveForm.approvalResult" :value='0' :label="0">拒绝</s-radio>
        </s-form-item>
        <s-form-item label="工作信息：" prop='workInfo'>
          <s-input type='textarea' v-model="appoveForm.workInfo"></s-input>
        </s-form-item>
        <s-form-item label="下一节点处理人" prop='assignUser'>
          <s-select v-model="appoveForm.assignUser">
            <s-option v-for='val in userData' :key='val.uuid' :label='val.userRealName' :value='val.uuid'>{{val.userRealName}}</s-option>
          </s-select>
        </s-form-item>
      </s-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="appoveSave">保存</s-button>
        <s-button type="cancel" @click="deadlineClose">关闭</s-button>
      </template>
    </s-dialog>
  </div>
</template>
<script>
  import $axios from 'sunflower-ajax'
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
          isGradeProtect: 1
        },
        orderTypeMap: [],
        ajaxObjAssets: {
          type: 'post',
          url: '/safetyPlatform/safeOrder/getNeedMineApproval',
          checkedUuidArr: [],
          params: {
            condition: {
              safeId: '',
              title: '',
              typeUuid: null,
              userName: '',
              startTime: '',
              endTime: ''
            }
          }
        },
        userData: [],
        appoveForm: {
          approvalResult: 1,
          workInfo: '',
          assignUser: ''
        },
        appoveRule: {
          workInfo: [{required: true, message: '不能为空', trigger: 'blur'}, {max: 120, message: '最大长度为120', trigger: 'blur'}],
          assignUser: [{required: true, message: '不能为空', trigger: 'blur'}]
        },
        appoveDialog: false,
        appoveUuid: '',
        starArr: [],
        selections: [],
        startTime: '',
        endTime: ''
      }
    },
    mounted() {
      this.ajaxObjAssets.params.condition = Object.assign({}, this.mywilldoneForm)
      $axios.get('/safetyPlatform/safeOrder/getAllSafeType').then(res => {
        this.orderTypeMap = res.data.filter(item => {
          return (item.bulletinName === '等保工作-最佳实践') || (item.bulletinName === '等保工作-简化版');
        })
      })
      $axios.get(`/safetyPlatform/safeOrder/getGradeProtectUserList`).then(res => {
        this.userData = res.data
      })
    },
    components: {
      RealPageTable
    },
    methods: {
      getData: debounce(function() {
        let startTime = new Date(this.startTime).getTime() / 1000
        let endTime = new Date(this.endTime).getTime() / 1000
        this.mywilldoneForm.startTime = startTime
        this.mywilldoneForm.endTime = endTime
        this.ajaxObjAssets.params.condition = Object.assign({}, this.mywilldoneForm)
      }, 500),
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
      appove(val, e) {
        this.appoveUuid = val.uuid
        this.appoveDialog = true
        this.appoveForm.approvalResult = e
      },
      deadlineClose() {
        this.appoveForm = {
          approvalResult: 1,
          workInfo: '',
          assignUser: ''
        }
        this.appoveDialog = false
      },
      batchStar() {
        if (this.starArr.length > 0) {
          $axios.post(`/safetyPlatform/safeOrder/batchConcernOrderOrTask`, this.starArr, {
            data: this.selections,
            logTemplate: '关注|我的审批>等保工作(#safeId#)'
          }).then(({data}) => {
            if (data.state) {
              this.$message({showClose: true, message: '批量关注成功', type: 'success'});
              this.ajaxObjAssets.params.condition = Object.assign({}, this.mywilldoneForm)
              this.starArr = []
              this.selections = []
            } else {
              this.$message({showClose: true, message: '关注失败', type: 'error'});
            }
          });
        } else {
          this.$message({showClose: true, message: '请勾选至少一个选项!', type: 'error'});
        }
      },
      appoveSave() {
        this.$refs['appoveForm'].validate((valid) => {
          if (valid) {
            let parms = Object.assign({}, this.appoveForm)
            parms.orderUuid = this.appoveUuid
            let orderUuid = this.mywilldoneForm.safeId
            let obj = {
              data: [parms],
              logTemplate: (parms.approvalResult === 1) ? `通过|我的审批>等保工作(${orderUuid})` : `拒绝|我的审批>等保工作(${orderUuid})`
            }
            $axios.post('/safetyPlatform/safeOrder/approvalOrder', parms, obj).then(res => {
              if (res.data.state) {
                this.$message({message: '保存成功!', type: 'success'});
                this.appoveDialog = false
                this.$emit('receive', true)
                this.getData()
              } else {
                this.$message({message: res.data.errormsg, type: 'error'});
              }
            })
          }
        })
      },
      gotoItemInfo(row) {
        if (row.orderType === 1) {
          this.$router.push(`/GradeProtect/safetyBulletin_details/${row.uuid}`)
        } else {
          this.$router.push(`/GradeProtect/safetyBulletin_dispose/${row.uuid}`);
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
        let str = rowData.isConcern === 0 ? '关注|我的审批>等保工作(#safeId#)' : '取消关注|我的审批>等保工作(#safeId#)'
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
