<template>
  <section class="fileList">
    <s-form :inline="true" :model="resultSearchForm" class="search_form" style="margin-bottom: 15px;" label-width='105px'>
      <div>
        <s-form-item label="执行时间：">
          <date-range v-model="resultSearchForm.execTime.value"></date-range>
        </s-form-item>
        <s-form-item label="稽核任务名称：">
          <s-input v-model="resultSearchForm.taskName"></s-input>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon='magnifier' @click="search()">查询</s-button>
      </div>
    </s-form>
    <s-button icon="batch-del" @click="handleDeletes">批量删除</s-button>
    <s-table-page
      style="margin-top:10px;"
      bus="audit-result"
      :data="data"
      @selection-change="onSelectionChange"
      :row-actions="getRowActionsDef()">
      <s-table-column type="selection" width="45"></s-table-column>
      <s-table-column label="执行时间" prop="execTime"></s-table-column>
      <s-table-column label="稽核任务名称" prop="taskName"></s-table-column>
      <s-table-column label="稽核结果" prop="resultName"></s-table-column>
    </s-table-page>
    <!--删除稽核结果-->
    <s-dialog
      v-model="delDialog"
      width="400px"
      title="删除稽核结果">
      确定要删除吗？
      <template slot="footer" class="dialog-footer">
        <s-button @click="submitDelete">确定</s-button>
        <s-button type="cancel" @click="delDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--稽核结果详情-->
    <s-dialog
      v-model="detailDialog"
      v-if="detailDialog"
      width="70%"
      title="查看稽核结果详情">
      <result-detail :result="detailData" v-if="detailDialog"></result-detail>
    </s-dialog>
  </section>
</template>

<script>
  import ResultDetail from './AuditResultDetail.vue'
  import DateRange from '@/components/tableCom/src/DateRange';
  import $axios from 'sunflower-ajax'
  import {multiSearch} from 'sunflower-common-utils';

  export default {
    data() {
      return {
        newData: [],
        auditResTbData: [],
        selectionList: [],
        deleteList: [],
        delDialog: false,
        detailDialog: false,
        detailData: {
          noSysLogList: [],
          sysLogList: []
        },
        resultSearchForm: {
          taskName: '',
          execTime: {
            type: 'datetimerange',
            value: []
          }
        }
      }
    },
    components: {
      // SearchBox,
      ResultDetail,
      DateRange
    },
    computed: {
      data() {
        return this.auditResTbData
      }
    },
    methods: {
      getRowActionsDef() {
        let vm = this;
        return [{
          icon: 'eye',
          name: '查看',
          click(row) {
            $axios.post('/collectTask/getAutoCheckResultDetail', {
              excutetime: row.execTime,
              taskuuid: row.taskUuid,
              deviceuuid: row.deviceUuid
            }).then(function (res) {
              res.data.sysLogList = res.data.sysLogList.filter((item, index) => {
                return item.assetAccountName.indexOf('public') === -1
              })
              vm.detailData = res.data
              vm.detailDialog = true;
            })
          }
        }, {
          icon: 'delete',
          name: '删除',
          click(row) {
            vm.delDialog = true;
            vm.deleteList = [row]
          }
        }]
      },
      getResultList () {
        let _self = this
        $axios.post('/collectTask/getAutoCheckResultListByDic').then(function (res) {
          _self.auditResTbData = res.data
          _self.newData = res.data
        })
      },
      getRowMultiActions() {
        return [
          {name: '执行时间'},
          {name: '稽核任务名称'},
          {name: '稽核结果'}
        ]
      },
      search() {
        let vm = this
        let form = Object.assign({}, {}, vm.resultSearchForm)
        this.auditResTbData = multiSearch(form, this.newData);
      },
      onSelectionChange (val) {
        this.selectionList = val
      },
      handleDeletes () {
        let vm = this
        if (vm.selectionList.length > 0) {
          vm.delDialog = true;
          vm.deleteList = vm.selectionList
        } else {
          vm.$message.error('请选择任务')
        }
      },
      submitDelete () {
        this.delDialog = false;
        let _self = this
        let data = []
        _self.deleteList.map((item) => {
          for (let i in this.auditResTbData) {
            if (this.auditResTbData[i].execTime === item.execTime && this.auditResTbData[i].taskName === item.taskName) {
              data.push(this.auditResTbData[i].uuid)
            }
          }
        })
        $axios.post('/collectTask/deleteCollectLog', data, {
          data: _self.deleteList,
          logTemplate: '删除|定时稽核>稽核结果(#taskName#)'
        }).then(function (res) {
          if (Number.parseInt(res.data) > 0) {
            _self.$message('删除成功')
            _self.getResultList()
          } else {
            _self.$message.error('删除失败')
          }
        })
      }
    },
    created() {
     this.getResultList()
    }
  }
</script>
