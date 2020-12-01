<!--
 * @Author: songyf
 * @Date: 2020-1-19
 * @LastEditors: songyf
 * @Description: 安全通报-通报类型设置
 -->
<template>
  <s-scrollbar wrap-style="max-height: calc(100vh - 155px);">
    <section class="safety-bulletin-type-set" :class="{'is-special': isSpecialPage}">
      <div class="btn-box">
        <s-button icon="plus" @click="addDesigner">添加通报类型</s-button>
        <s-button icon="batch-del" @click="bathDel">批量删除</s-button>
        <s-input placeholder="请输入通报类型名称、备注进行查询" v-model="searchKey" class="real-search-input" icon="magnifier"
                 @input="getList"></s-input>
      </div>

      <RealPageTable :ajax-obj="ajaxObj"
                     :showHeaderCheckbox="false"
                     @filter-change="filterType"
                     @selection-change="selectionChange">
        <s-table-column type="selection" width="45" :reserve-selection="true" :selectable="isSelectable">
        </s-table-column>
        <s-table-column prop="bulletinName" label="通报类型名称" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="needItil"
                        label="是否需要走流程"
                        width="200px"
                        :filters="needItil"
                        column-key="needItil"
                        show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.needItil | filterNeedItil}}</span>
          </template>
        </s-table-column>
        <s-table-column prop="remark" label="备注" show-overflow-tooltip>
        </s-table-column>
        <s-table-column label="操作" width="160" fixed="right">
          <template slot-scope="scope">
            <i class="iconfont icon-eye" title="查看" @click="viewBulletin(scope.row)"></i>
            <i class="iconfont icon-edit" title="编辑" @click="editBulletin(scope.row)"></i>
            <i class="iconfont icon-delete" title="删除" v-if="scope.row.isDefault !== 1 && scope.row.isDelete !== 1"
               @click="bulletinDelete(scope.row)"></i>
          </template>
        </s-table-column>
      </RealPageTable>
    </section>
  </s-scrollbar>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'

  export default {
    components: {
      RealPageTable
    },
    data() {
      return {
        isSpecialPage: false,
        ajaxObj: {
          type: 'post',
          url: '/safetyPlatform/safetyBulletin/tbList',
          checkedUuidArr: [], // 初始要回显选中的行
          params: {
            condition: {}
          }
        },
        needItilStatusList: [0, 1],
        needItil: [
          {text: '是', value: 1},
          {text: '否', value: 0}
        ],
        searchKey: '',
        selectUuid: []
      }
    },
    props: {},
    watch: {},
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
      let userData = this.$store.getters.userData;
      if (userData.roleName.indexOf('系统管理员') !== -1 && userData.roleName.indexOf('安全通报操作员') === -1 && this.$route.path === '/SafetyBulletin') { // 系统管理员是否进入特殊页面
        this.isSpecialPage = true
      } else {
        this.isSpecialPage = false
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.getList();
      })
    },
    methods: {
      addDesigner() { // 添加通报类型设计
        this.$store.commit('setEditBulletin', null);
        if (this.$route.path === '/SafetyBulletin') { // 针对特殊页面跳转的path不同
          this.$router.push(`SafetyBulletin/safetyBulletin_tbconfig/safetyBulletin_designer`);
        } else {
          this.$router.push(`safetyBulletin_tbconfig/safetyBulletin_designer`);
        }
      },
      editBulletin(row) { // 编辑
        this.$store.commit('setEditBulletin', null);
        if (this.$route.path === '/SafetyBulletin') { // 针对特殊页面跳转的path不同
          this.$router.push({
            path: 'SafetyBulletin/safetyBulletin_tbconfig/safetyBulletin_designer',
            query: {uuid: `${row.uuid}`}
          });
        } else {
          this.$router.push({path: 'safetyBulletin_tbconfig/safetyBulletin_designer', query: {uuid: `${row.uuid}`}});
        }
      },
      getList() {
        let params = {
          searchKey: this.searchKey,
          needItilStatusList: this.needItilStatusList
        }
        this.ajaxObj.params.condition = Object.assign({}, params);
      },
      filterType(obj) { // 是否需要走流程
        this.needItilStatusList = obj.needItil
        this.getList();
      },
      /* 是否可以勾选 */
      isSelectable(row) {
        let flag;
        (row.isDefault === 1) ? flag = false : flag = true
        return flag
      },
      viewBulletin(row) {
        if (this.$route.path === '/SafetyBulletin') { // 针对特殊页面跳转的path不同
          this.$router.push(`SafetyBulletin/safetyBulletin_tbconfig/safetyBulletin_view/${row.uuid}`);
        } else {
          this.$router.push(`safetyBulletin_tbconfig/safetyBulletin_view/${row.uuid}`);
        }
      },
      selectionChange(val) {
        this.selectUuid = val;
      },
      bathDel() { // 批量删除
        if (this.selectUuid.length) {
          this.delAxios(this.selectUuid)
        } else {
          this.$message({
            message: '请选择要删除的数据！',
            type: 'warning'
          });
        }
      },
      bulletinDelete(row) {
        this.delAxios(row)
      },
      delAxios(arr) {
        let paramArr = [arr];
        if (arr instanceof Array) { // 如果是批量删除
          paramArr = [...arr]
        }
        let ary = paramArr.map(item => item.uuid)
        this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          $axios.post(`/safetyPlatform/safetyBulletin/batchDelete`, ary, {
            data: paramArr,
            logTemplate: '删除|通报类型(#bulletinName#)'
          }).then(({data}) => {
            if (data.state === true) {
              this.$message({message: data.errormsg, type: 'success'});
              this.selectUuid = [];
              this.getList();
            } else {
              this.$message({message: data.errormsg, type: 'error'});
              this.getList();
            }
          });
        }).catch(() => {
        });
      }
    }
  }
</script>

<style lang="stylus">
  .is-special{
    padding 0 20px
  }
  .safety-bulletin-type-set
    margin 20px 0

    .btn-box
      margin-bottom 20px
</style>
