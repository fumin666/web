<!--
 * @Author: songyf
 * @Date: 2020-1-19
 * @LastEditors: songyf
 * @Description: 安全通报-安全通报任务-主页面
 -->
<template>
  <section class="safety-bulletin-type-set">
    <div class="btn-box">
      <s-button icon="plus" @click="addReleaseBtn" style="margin-right: 5px">下发通报</s-button>
      <s-button icon="batch-del" @click="bathDel">批量删除</s-button>
      <div class="fr">
        <!-- 动态列设置 -->
        <dynamic-column-set :dynamicData="setData" :option="option" @save="saveSetForm"
                            style="display:inline-block">
          <s-button icon="nav-system-set" title="列设置" type="cancel" slot="click"></s-button>
        </dynamic-column-set>
      </div>
      <s-input placeholder="请输入主题/周期查询" v-model="searchKey" class="real-search-input" icon="magnifier" @input="getList"
               style="margin-right: 20px"></s-input>
    </div>

    <RealPageTable
      ref="tableRef"
      id="bulletinTask"
      :ajax-obj="ajaxObj"
      :callback='handcallback'
      :showHeaderCheckbox="false"
      @filter-change="filterType"
      @successFun='successFun'
      @selection-change="selectionChange">
      <s-table-column type="selection" width="45" :selectable="isSelectable" :reserve-selection="true" >
      </s-table-column>
      <div :key='index' v-for='(item, index) in tableHeads'   v-if="isShow">
        <s-table-column
          v-if="item.value === 'issuedType'"
          :label="item.name" show-overflow-tooltip
          prop="issuedType"
          label="下发方式"
          :filters="issuedType"
          :column-key="item.value"
          :filtered-value="issuedTypeFilters"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-text="scope.row[item.value]"></span>
          </template>
        </s-table-column>
        <s-table-column
          v-if="item.value === 'isCycleTask'"
          :label="item.name" show-overflow-tooltip
          prop="isCycleTask"
          label="是否周期任务"
          :filters="isCycleTask"
          :filtered-value="isCycleFilters"
          column-key="isCycleTask"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-text="scope.row[item.value]"></span>
          </template>
        </s-table-column>
        <s-table-column
          v-if="item.value === 'taskStatus'"
          :label="item.name" show-overflow-tooltip
          prop="taskStatus"
          label="状态"
          :filters="taskStatus"
          :filtered-value="statusFilters"
          :column-key="item.value"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-text="scope.row[item.value]"></span>
          </template>
        </s-table-column>
        <s-table-column :label="item.name" show-overflow-tooltip v-if="item.value !== 'issuedType' && item.value !== 'taskStatus' && item.value !== 'isCycleTask'">
          <template slot-scope="scope">
            <template>
              <span v-text="scope.row[item.value]"></span>
            </template>
          </template>
        </s-table-column>
      </div>
      <s-table-column label="操作" fixed="right" width="160">
        <template slot-scope="scope">
          <button-set :scope="scope" :btnData="btnData()" :option="tableOption"></button-set>
        </template>
      </s-table-column>
    </RealPageTable>

    <!--添加编辑通报下发-->
    <add-release-bulletin
      v-if="addReleaseBulletinFlag"
      v-model="addReleaseBulletinFlag"
      :bulletinTypeUuid="bulletinTypeUuid"
      :rowData="rowData"
      @updateTable="getList"
    >
    </add-release-bulletin>
    <!--查看通报下发-->
    <view-release-bulletin
      v-if="viewReleaseBulletinFlag"
      v-model="viewReleaseBulletinFlag"
      :rowData="rowData"
      :isView="isView"
      :bulletinTypeUuid="bulletinTypeUuid"
    >
    </view-release-bulletin>

    <!--查看任务执行历史记录-->
    <view-task-history
      v-if="viewTaskHistoryFlag"
      v-model="viewTaskHistoryFlag"
      :rowData="rowData"
    >
    </view-task-history>
    <!--查看任务执行执行结果-->
    <view-task-result
      v-if="viewTaskResultFlag"
      v-model="viewTaskResultFlag"
      :rowData="rowData"
      :resultType="resultType"
    >
    </view-task-result>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import buttonSet from '@/components/tableHandleHidden/buttonSet';
  import dynamicColumnSet from '@/components/dynamicColumnDialog/DynamicColumnSet.vue'
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  import addReleaseBulletin from '@/pages/Safety_BulletinTask/components/dialog/AddReleaseBulletin'
  import viewReleaseBulletin from '@/pages/Safety_BulletinTask/components/dialog/ViewReleaseBulletin'
  import viewTaskHistory from '@/pages/Safety_BulletinTask/components/dialog/ViewTaskHistory'
  import viewTaskResult from '@/pages/Safety_BulletinTask/components/dialog/ViewTaskResult'

  export default {
    components: {
      RealPageTable,
      addReleaseBulletin,
      viewReleaseBulletin,
      viewTaskHistory,
      viewTaskResult,
      dynamicColumnSet,
      buttonSet
    },
    data() {
      return {
        isShow: true,
        addReleaseBulletinFlag: false,
        viewReleaseBulletinFlag: false,
        viewTaskHistoryFlag: false,
        viewTaskResultFlag: false,
        tableHeads: [],
        ajaxObj: {
          type: 'post',
          url: '/safetyPlatform/bulletinIssuedTask/tbTaskList',
          checkedUuidArr: [], // 初始要回显选中的行
          params: {
            condition: {}
          }
        },
        excutorTypeList: [1, 2, 3], // 下发方式
        issuedType: [
          {text: '按部门', value: 1},
          {text: '按角色', value: 2},
          {text: '按人员', value: 3}
        ],
        statusList: [0, 1, 2, 3, 4, 5],
        taskStatus: [ // 状态
          {text: '未启动', value: 0},
          {text: '新建', value: 1},
          {text: '执行中', value: 2},
          {text: '已完成', value: 3},
          {text: '已删除', value: 4},
          {text: '已终止', value: 5}
        ],
        isCycleTaskList: [1, 0],
        isCycleTask: [ // 是否周期任务
          {text: '是', value: 1},
          {text: '否', value: 0}
        ],
        searchKey: '',
        selections: [],
        bulletinTypeUuid: '',
        option: {
          title: '列显示设置',
          key: 'uuid', // key
          nameKey: 'colnumName', // 名字key
          showKey: 'showStatus', // 是否显示key
          sortKey: 'colnumIndex', // 排序key
          width: '300',
          height: '500'
        },
        setData: [], // 动态列数据
        rowData: {},
        resultType: 1,
        isView: false,
        tableOption: {// 操作栏配置项
          isHidden: true, // 是否开启隐藏
          appendId: '#bulletinTask',
          showNum: 3// 超过3ge隐藏
        }
      }
    },
    props: {
      bulletinType: {
        type: Object,
        default: null
      }
    },
    computed: {
      issuedTypeFilters() {
        return this.excutorTypeList
      },
      statusFilters() {
        return this.statusList
      },
      isCycleFilters() {
        return this.isCycleTaskList
      }
    },
    watch: {
      'bulletinType': {
        immediate: true,
        handler(val) {
          if (val !== null) {
            this.searchKey = '';
            this.excutorTypeList = [1, 2, 3];
            this.statusList = [0, 1, 2, 3, 4, 5];
            this.isCycleTaskList = [1, 0];
            this.getColData();
            this.getList();
            let domElement = document.querySelectorAll('.s-table-filter')
            domElement.forEach(v => { // 菜单切换时清除下拉搜索
              v.style.display = 'none'
            })
          }
        }
      }
    },
    filters: {
      filterNeedItil(val) {
        switch (val) {
          case 0:
            return '否';
          case 1:
            return '是'
        }
      }
    },
    created() {
    },
    mounted() {
    },
    methods: {
      addReleaseBtn() { // 添加
        this.rowData = {}
        this.addReleaseBulletinFlag = true
        this.bulletinTypeUuid = this.bulletinType.uuid
      },
      editBulletin(row) { // 编辑
        $axios.get(`/safetyPlatform/bulletinIssuedTask/getBulletinIssuedTaskDetails/${row.uuid}`).then(({data}) => {
          this.addReleaseBulletinFlag = true
          this.rowData = data
          this.bulletinTypeUuid = data.typeUuid
        })
      },
      viewBulletin(row) { // 查看
        $axios.get(`/safetyPlatform/bulletinIssuedTask/getBulletinIssuedTaskDetails/${row.uuid}`).then(({data}) => {
          this.viewReleaseBulletinFlag = true
          this.rowData = data
          this.bulletinTypeUuid = data.typeUuid
          this.isView = true
        })
      },
      viewTaskHistory(row) { // 查看任务执行历史记录
        this.rowData = row
        this.viewTaskHistoryFlag = true
      },
      viewTaskResult(row) { // 查看任务执行结果
        this.rowData = row;
        this.resultType = 1;
        this.viewTaskResultFlag = true
      },
      viewTaskResultRecent(row) { // 查看任务最近一次执行结果
        this.rowData = row;
        this.resultType = 2;
        this.viewTaskResultFlag = true
      },
      getList() {
        let params = {
          safeTypeUuid: this.bulletinType.uuid,
          searchKey: this.searchKey,
          excutorTypeList: this.excutorTypeList,
          statusList: this.statusList,
          isCycleTaskList: this.isCycleTaskList
        }
        this.ajaxObj.params.condition = Object.assign({}, params);
      },
      handcallback(data) {
        this.isShow = false
        data.totalCount = data.criteria.totalCount;
        this.tableHeads = data.tableHeads;
        return data.criteria.pageList;
      },
      successFun() {
        this.$nextTick(() => {
          this.isShow = true
        })
      },
      // 获取动态列配置
      getColData() {
        $axios.get(`/safetyPlatform/bulletinIssuedTask/getDynConfig/${this.bulletinType.uuid}`).then((res) => {
          this.setData = res.data;
        })
      },
      saveSetForm(data) { // 动态列保存
        this.setData = data;
        $axios.post('/safetyPlatform/bulletinIssuedTask/setDynConfig', this.setData, {
          logTemplate: '设置|动态列设置'
        }).then((res) => {
          if (res.data) {
            this.getColData()
            this.getList()
            this.$message({message: '保存成功', type: 'success'});
          } else {
            this.$message({message: '保存失败', type: 'error'});
          }
        });
      },
      filterType(obj) { // 下拉搜索
        this.excutorTypeList = obj.issuedType ? obj.issuedType : this.excutorTypeList;
        this.statusList = obj.taskStatus ? obj.taskStatus : this.statusList
        this.isCycleTaskList = obj.isCycleTask ? obj.isCycleTask : this.isCycleTaskList
        this.getList();
      },
      selectionChange(val) {
        this.selections = val
      },
      /* 是否可以勾选 */
      isSelectable(row) {
        let flag;
        (row.taskStatus === '已删除') ? flag = false : flag = true
        return flag
      },
      bulletinPause(row) { // 终止通报
        if (row.taskStatus === '已完成') {
          this.$message({message: '任务已完成无需终止', type: 'warning'});
          return
        }
        this.$confirm('确定终止?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          $axios.post(`/safetyPlatform/bulletinIssuedTask/pauseSafeTask/${row.uuid}`).then(({data}) => {
            if (data.state === true) {
              this.$message({message: data.errormsg, type: 'success'});
              this.getList();
            } else {
              this.$message({message: data.errormsg, type: 'error'});
            }
          });
        }).catch(() => {
        });
      },
      bathDel() { // 批量批量删除
        if (this.selections.length) {
          this.delAxios(this.selections)
        } else {
          this.$message({
            message: '请选择要删除的数据！',
            type: 'warning'
          });
        }
      },
      bulletinDelete(row) { // 单个删除
        this.delAxios(row)
      },
      delAxios(arr) {
        let vm = this;
        let isFlag = true
        let paramArr = [arr.uuid];
        let msg = '确定删除?'
        let str = ''
        if (arr instanceof Array) { // 如果是批量删除
          let arrUuid = arr.map(item => item.uuid);
          paramArr = [...arrUuid]
          arr.forEach(v => {
            if (v.taskStatus !== '已完成' && v.taskStatus !== '已终止') {
              isFlag = false
            }
            str += v.主题
          })
        } else {
          if (arr.taskStatus !== '已完成' && arr.taskStatus !== '已终止') {
            isFlag = false
          }
          str += arr.主题
        }
        if (!isFlag) {
         msg = '存在尚未完成的通报，确认是否继续删除?'
        }
        vm.$confirm(msg, '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          $axios.post(`/safetyPlatform/bulletinIssuedTask/deleteSafeTask`, paramArr,
            {
              data: arr,
              logTemplate: `删除|通报(${str})`
            }).then(({data}) => {
            if (data.state === true) {
              vm.$message({message: data.errormsg, type: 'success'});
              this.selections = []
              vm.getList();
            } else {
              vm.$message({message: data.errormsg, type: 'error'});
            }
          });
        }).catch(() => {
        });
      },

      btnData() { // 按钮权限
        let vm = this;
        return [
          {
            icon: 'eye',
            name: '查看',
            handler: function (row, scope) {
              vm.viewBulletin(row)
            }
          },
          {
            icon: 'edit',
            name: '编辑',
            v_if: function (row, scope) {
              return row.taskStatus === '新建' || row.taskStatus === '未启动'
            },
            handler: function (row, scope) {
              vm.editBulletin(row)
            }
          },
          {
            icon: 'view-history',
            name: '查看任务执行历史记录',
            v_if: function (row, scope) {
              return row.isCycleTask === '是'
            },
            handler: function (row, scope) {
              vm.viewTaskHistory(row)
            }
          },
          {
            icon: 'tingzhi-shixin',
            name: '终止通报',
            v_if: function (row, scope) {
              if (row.isCycleTask === '是') {
                return row.taskStatus !== '已终止' && row.taskStatus !== '已完成' && row.taskStatus !== '已删除'
              } else {
                return row.taskStatus === '新建' || row.taskStatus === '未启动'
              }
            },
            handler: function (row, scope) {
              vm.bulletinPause(row)
            }
          },
          {
            icon: 'delete',
            name: '删除',
            v_if: function (row, scope) {
              return row.taskStatus !== '已删除'
            },
            handler: function (row, scope) {
              vm.bulletinDelete(row)
            }
          },
          {
            icon: 'source',
            name: '查看任务执行结果',
            v_if: function (row, scope) {
              return row.isCycleTask === '否'
            },
            handler: function (row, scope) {
              vm.viewTaskResult(row)
            }
          },
          {
            icon: 'compass',
            name: '查看最近一次任务执行结果',
            v_if: function (row, scope) {
              return row.isCycleTask === '是'
            },
            handler: function (row, scope) {
              vm.viewTaskResultRecent(row)
            }
          }
        ]
      }
    }
  }
</script>

<style lang="stylus">
  .safety-bulletin-type-set
    margin 20px 0
    .btn-box
      margin-bottom 10px
  .disappear
    display none
</style>
