/*
create by YOU
*/
<template>
  <div>
    <div slot="leftBtn">
      <s-button icon="plus" @click="createOrder">创建{{type}}单</s-button>
      <s-button icon="bangding" @click="connect()">关联</s-button>
      <s-button icon="bind-remove" @click="disconnect()">取消</s-button>
    </div>
    <s-form :inline="true" :model="searchForm" class="search_form" style="margin:10px 0" label-width='75px'>
      <div>
        <s-form-item label="工单工号:">
          <s-input @keyup.enter.native="search" v-model="searchForm.serialCode"></s-input>
        </s-form-item>
        <s-form-item label="状态">
          <s-select v-model="searchForm.changeStatus" clearable>
            <s-option v-for="(item, index) in stateMap" :label="item" :value="index + 1" :key="index + ''"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="提交人:">
          <s-input @keyup.enter.native="search" v-model="searchForm.createUserName"></s-input>
        </s-form-item>
        <s-form-item label="简要描述:">
          <s-input @keyup.enter.native="search" v-model="searchForm.briefDesc"></s-input>
        </s-form-item>
        <s-form-item label="提交时间:">
          <date-range v-model="searchForm.createTime.value"></date-range>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon='magnifier' @click="search">查询</s-button>
      </div>
    </s-form>
    <s-table-page
      :data="data"
      @selection-change="onSelectionChange"
      :header-search="{show: false}"
      :hasActionCol=false>
      <s-table-column
        type="selection"
        width="60">
      </s-table-column>
      <s-table-column
        label="类型"
        width="80"
        show-overflow-tooltip>
        <template slot-scope="scope">变更</template>
      </s-table-column>
      <s-table-column
        label="单号"
        sortable
        width="160"
        prop="serialCode">
        <template slot-scope="scope">
          <a :href="`/#/ProcessCenter/modifyDetail/${scope.row.uuid}`" target="_blank">
            {{scope.row.serialCode}}
          </a>
        </template>
      </s-table-column>
      <s-table-column
        label="简要描述"
        prop="briefDesc">
      </s-table-column>
      <s-table-column
        label="状态"
        prop="changeStatus">
        <template slot-scope="scope">{{getState(scope.row.changeStatus)}}</template>
      </s-table-column>
      <s-table-column
        label="提交人"
        prop="createUserName">
      </s-table-column>
      <s-table-column
        label="提交时间"
        sortable
        width="170"
        prop="createTime">
      </s-table-column>
      <s-table-column
        label="操作"
        prop="propName">
        <template slot-scope="scope">
          <i class="iconfont icon-bangding" v-if="scope.row.isRelationOrder === 0" title="关联"
             @click="connect(scope.row)"></i>
          <i class="iconfont icon-bind-remove" v-else title="取消关联" @click="disconnect(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table-page>
    <!--变更单-->
    <s-dialog
      v-model="changeDialog"
      v-if="changeDialog"
      width="600px"
      class="createProcess"
      append-to-body
      title="创建工单">
      <create-change ref="changeForm" @show-template="showOrderTemDialog"
                     :changePath="changePath" :riskLevel="riskLevel"
                     @show-riskTemplate="showRiskTemplate"></create-change>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveChangeOrder">保存</s-button>
        <s-button type="cancel" @click="changeDialog = false">关闭</s-button>
      </template>
    </s-dialog>
    <!--变更模板-->
    <order-template-dialog v-if="orderTemDialog" v-model="orderTemDialog"
                           :cur-template="orderCurTemplate">
    </order-template-dialog>
    <!--变更风险问卷弹窗-->
    <change-risk-question
      v-model="changeRiskQuestion"
      v-if="changeRiskQuestion"
      :cur-template="riskTemplate"
      ref="changeRiskQuestion">
    </change-risk-question>
  </div>
</template>

<script type="text/babel">

  import SearchBox from '@/components/tableCom/src/SearchBox';
  import DateRange from '@/components/tableCom/src/DateRange';
  import createChange from '@/home/ProcessCenter/ProcessCreatOrder/ChangeOrderDialog'
  import orderTemplateDialog from '@/home/ProcessCenter/ProcessCreatOrder/OrderTemplateDialog.vue';
  import changeRiskQuestion from '@/home/ProcessCenter/ProcessCreatOrder/ChangeRiskQuestionDialog.vue';
  import $axios from 'sunflower-ajax';
  import {multiSearch} from 'sunflower-common-utils';
  export default {
    components: {
      SearchBox,
      DateRange,
      createChange,
      orderTemplateDialog,
      changeRiskQuestion
    },
    data() {
      return {
        changeDialog: false,
        orderTemDialog: false,
        changeRiskQuestion: false,
        searchForm: {
          serialCode: '',
          changeStatus: '',
          createUser: '',
          briefDesc: '',
          createTime: {
            type: 'datetimerange',
            value: []
          }
        },
        selectList: [],
        data: [],
        newData: [],
        type: '变更',
        stateMap: [],
        riskLevel: 0,
        changePath: 0
      }
    },
    props: {
      url: '',
      uuid: ''
    },
    created() {
      this.stateMap = this.$store.state.processCenter.status[2]
      this.init()
    },
    methods: {
      init() {
        // 请求变更单数据
        $axios.post('/ItilCommonWorkflow/serachItilChangeOrder', {
          orderUuid: this.uuid
        }).then(({data}) => {
          this.data = (data || []).filter(item => item.uuid !== this.uuid)
          this.newData = (data || []).filter(item => item.uuid !== this.uuid)
        })
      },
      createOrder() {
        this.changeDialog = true
      },
      saveChangeOrder() {
        this.$refs['changeForm'].$refs['Form'].validate(valid => {
          if (!valid) return;
          let form = this.$refs['changeForm'].form;
          $axios.post('/itilChangeOrder/saveChangeOrder', form).then(({data}) => {
            if (data.state === true) {
              $axios.post('/ItilCommonWorkflow/createRelationOrder', [{
                orderRelationUuid: this.uuid,
                orderBerelationdUuid: data.errormsg
              }]).then(({data}) => {
                if (data.state === true) {
                  this.$message.success('关联成功')
                  this.$emit('afterChange')
                  this.init()
                } else {
                  this.$message.error('关联失败')
                }
              })
              this.changeDialog = false;
              this.init();
            } else {
              this.$message.success('创建工单失败')
            }
          })
        })
      },
      showOrderTemDialog(template) {
        this.orderTemDialog = true;
        this.orderCurTemplate = template;
      },
      showRiskTemplate(template) {
        this.changeRiskQuestion = true;
        this.riskTemplate = template;
      },
      getState(key) {
        return this.stateMap[key - 1]
      },
      search() {
        let form = Object.assign({}, {}, this.searchForm)
        this.data = multiSearch(form, this.newData);
      },
      onSelectionChange(selction) {
        this.selectList = selction
      },
      connect(val) {
        let list = (val ? [val] : this.selectList).filter(item => item.isRelationOrder === 0).map(item => {
            return {
              orderRelationUuid: this.uuid,
              orderBerelationdUuid: item.uuid
            }
          }
        )
        if (list.length > 0) {
          this.$confirm(val ? '确定关联此工单' : '确定关联所选工单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.post('/ItilCommonWorkflow/createRelationOrder', list).then(({data}) => {
              if (data.state === true) {
                this.$message.success('关联成功')
                this.$emit('afterChange')
                this.init()
              } else {
                this.$message.error('关联失败')
              }
            })
          }).catch(() => {});
        } else {
          this.$message.error('请选择要关联的工单')
        }
      },
      disconnect(val) {
        let list = (val ? [val] : this.selectList).map(item => item.relationOrderUuid)
        if (list.length > 0) {
          this.$confirm(val ? '确定取消关联此工单' : '确定取消关联所选工单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.post('/ItilCommonWorkflow/cancelRelationOrder', list).then(({data}) => {
              if (data.state === true) {
                this.$message.success('取消关联成功')
                this.$emit('afterChange')
                this.init()
              } else {
                this.$message.error('取消关联失败')
              }
            })
          }).catch(() => {});
        } else {
          this.$message.error('请选择要取消关联的工单')
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
