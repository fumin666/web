<!--
 * @Author: shifeng
 * @Email: shifeng199307@gmail.com
 * @LastEditors: shifeng
 * @LastEditEmail: shifeng199307@gmail.com
 * @Description: 查看代理审批人
 * @Date: 2019-02-28 13:42:23
 * @LastEditTime: 2019-03-07 15:23:09
 -->


<template>
  <s-dialog v-model="dialogFlag" :title="'查看代理审批人'" width="800px" class="viewApproverDialog">
    <s-table-page :data="list"  :header-search="searchDef()">
      <s-table-column label="开始时间" prop="startTime"></s-table-column>
      <s-table-column label="结束时间" prop="endTime"></s-table-column>
      <s-table-column label="代理审批人" prop="proxyUserName"></s-table-column>
      <s-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status===1">激活</span>
          <span v-else-if="scope.row.status===0">未激活</span>
        </template>
      </s-table-column>
      <s-table-column label="备注" prop="remark"></s-table-column>
      <s-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <i class="iconfont icon-edit" @click="rowEdit(scope.row)" title="编辑"></i>
          <i class="iconfont icon-delete" @click="rowDel(scope.row)" title="删除"></i>
        </template>
      </s-table-column>
    </s-table-page>
    <template slot="footer" class="dialog-footer">
      <s-button type="cancel" @click="dialogFlag=false">确定</s-button>
    </template>
    <!-- 添加代理审批人弹框 -->
    <AddApprover v-if="addApproverDialogFlag" v-model="addApproverDialogFlag" @reload="getList" :obj="currentRow"></AddApprover>
  </s-dialog>
</template>

<script>
import $axios from 'sunflower-ajax';
import {Validaters} from 'sunflower-common-utils';
import AddApprover from './AddApprover';

export default {
  data() {
    return {
      addApproverDialogFlag: false,
      dialogFlag: false,
      form: {
        type: '',
        remark: ''
      },
      rules: {
        type: [Validaters.NotNull],
        remark: [Validaters.NotNull, Validaters.Max(120)]
      },
      currentRow: {},
      list: [] // 代理审批人列表
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
  },
  created() {
    this.getList(); // 查询代理审批人列表
  },
  methods: {
    // 查询代理审批人列表
    getList() {
      $axios.get('/specialOperationApply/getProxyApproverListByUser').then((res) => {
        if (res.data) {
          this.list = res.data
        }
      })
    },
    searchDef() {
      return {
        width: 4,
        offset: 20,
        placeholder: '请输入关键字',
        searchProps: ['startTime', 'endTime', 'proxyUserName', 'remark'],
        nowId: ''
      }
    },
    rowEdit(row) {
      this.currentRow = row;
      this.addApproverDialogFlag = true;
    },
    rowDel(row) {
      this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
        $axios.get(`/specialOperationApply/deleteProxyApprover/${row.uuid}`).then(({data}) => {
          if (data.state) {
            this.$message({showClose: true, message: data.errormsg, type: 'success'});
            this.getList();
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        })
      }).catch(() => {});
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.dialogFlag = val;
      }
    },
    dialogFlag(val) {
      this.$emit('input', val);
    }
  },
  components: {
    AddApprover
  }
}
</script>

<style lang="stylus">
.remoteRecDialog-checkbox {
  float: left;

  .remoteRecDialog-checkbox-wrap {
    padding-top: 5px;
  }
}
</style>
