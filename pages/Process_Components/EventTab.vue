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
          <s-select v-model="searchForm.incidentStatus" clearable>
            <s-option v-for="(item, index) in stateMap" :label="item" :value="index" :key="index + ''"></s-option>
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
        <template slot-scope="scope">事件</template>
      </s-table-column>
      <s-table-column
        label="单号"
        sortable
        width="160"
        prop="serialCode">
        <template slot-scope="scope">
          <a :href="`/#/ProcessCenter/eventDetail/${scope.row.uuid}`" target="_blank">
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
        prop="incidentStatus">
        <template slot-scope="scope">{{getState(scope.row.incidentStatus)}}</template>
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
    <!--事件模板-->
    <template-dialog v-if="templateDialogFlag" v-model="templateDialogFlag"
                     :cur-template="curTemplate">
    </template-dialog>
    <s-dialog
      append-to-body
      v-model="eventDialog"
      v-if="eventDialog"
      width="600px"
      class="createProcess"
      title="创建工单">
      <create-event ref="eventForm" @show-template="showTemDialog"></create-event>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveEvent">保存</s-button>
        <s-button type="cancel" @click="eventDialog = false">关闭</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script type="text/babel">

  import SearchBox from '@/components/tableCom/src/SearchBox';
  import DateRange from '@/components/tableCom/src/DateRange';
  import createEvent from '@/home/ProcessCenter/ProcessCreatOrder/EventOrderDialog'
  import TemplateDialog from '@/home/ProcessCenter/ProcessCreatOrder/TemplateDialog';
  import {multiSearch} from 'sunflower-common-utils';
  import $axios from 'sunflower-ajax';

  export default {
    components: {
      SearchBox,
      DateRange,
      createEvent,
      TemplateDialog
    },
    data() {
      return {
        eventDialog: false,
        templateDialogFlag: false,
        searchForm: {
          serialCode: '',
          incidentStatus: '',
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
        type: '事件',
        stateMap: []
      }
    },
    props: {
      url: '',
      uuid: ''
    },
    created() {
      this.stateMap = this.$store.state.processCenter.status[0]
      this.init()
    },
    methods: {
      init() {
        // 请求事件单数据
        $axios.post('/ItilCommonWorkflow/serachItilIncidentOrder', {
          orderUuid: this.uuid
        }).then(({data}) => {
          this.data = (data || []).filter(item => item.uuid !== this.uuid)
          this.newData = (data || []).filter(item => item.uuid !== this.uuid)
        })
      },
      createOrder() {
        this.eventDialog = true
      },
      saveEvent() {
        this.$refs['eventForm'].$refs['Form'].validate(valid => {
          if (!valid) return;
          let form = this.$refs['eventForm'].form
          let param = {};
          for (let i in form) {
            if (form[i] && form[i] !== 0) {
              param[i] = form[i]
            }
          }
          param.attachuuid = this.$refs['eventForm'].fileList.map(item => {
            return item.response.attachuuid;
          }).join(',');
          $axios.post('/itilIncidentCenter/saveIncidentOrderUser', param).then(({data}) => {
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
              this.eventDialog = false;
              this.init();
            } else {
              this.$message.success('创建工单失败')
            }
          })
        })
      },
      showTemDialog(template) {
        this.templateDialogFlag = true;
        this.curTemplate = template;
      },
      getState(key) {
        return this.stateMap[key]
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
          }).catch(() => {
          });
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
          }).catch(() => {
          });
        } else {
          this.$message.error('请选择要取消关联的工单')
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
