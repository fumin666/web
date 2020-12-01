<template>
  <s-dialog
    v-model="dialogFlag"
    v-if="dialogFlag"
    append-to-body
    width="800px"
    title="添加人员">
    <s-scrollbar wrap-style="height: 400px;">
      <s-table-page
        ref="multipleTable"
        :data="dataList"
        style="width:100%"
        :header-search='getSearchDef()'
        @selection-change="changeSelectionChange"
      >
        <s-table-column type="selection" width="80" ></s-table-column>
        <s-table-column prop="userRealName" label="姓名"></s-table-column>
        <s-table-column prop="userGender" label="性别">
          <template slot-scope="scope">
            {{scope.row.userGender | filterUserGender}}
          </template>
        </s-table-column>
        <s-table-column prop="userLoginName" label="账号名称"></s-table-column>
        <s-table-column prop="departName" label="部门"></s-table-column>
        <s-table-column prop="position" label="岗位"></s-table-column>
        <s-table-column prop="userStatus" label="状态">
          <template slot-scope="scope">
            {{scope.row.userStatus | filterUserStatus}}
          </template>
        </s-table-column>
        <s-table-column label="指派可用性" width="150" >
          <template slot-scope="scope">
            {{scope.row.isAllocate | filterAllocate}}
          </template>
        </s-table-column>
      </s-table-page>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag = false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import Bus from '@/plugins/eventBus';
  export default {
    data() {
      return {
        dataList: [],
        changeSelections: [],
        dialogFlag: false,
        personelTemplate: {}
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      curTemplate: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    methods: {
      getData() {
        $axios.get('/itilWorkflowConfig/filterUnrelatrionUserByGroup/' + this.curTemplate.uuid).then((res) => {
          this.dataList = res.data;
        })
      },
      changeSelectionChange(selections) {
        this.changeSelections = selections;
      },
      dialogOk() {
        this.personelTemplate.list = this.changeSelections;
        Bus.$emit('finish', this.personelTemplate);
        this.dialogFlag = false;
      },
      getSearchDef() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入姓名',
          searchProps: ['userRealName'] // can be string or Array
        }
      }
    },
    created() {
      this.getData();
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
    filters: {
      filterUserGender(val) {
        switch (val) {
          case 1:
            return '男';
          case 2:
            return '女';
        }
      },
      filterUserStatus(val) {
        switch (val) {
          case 0:
            return '未激活';
          case 1:
            return '激活';
          case 2:
            return '锁定';
          case 3:
            return '注销';
          case 4:
            return '删除';
          case 5:
            return '待开启';
          case 6:
            return '过期';
          case 7:
            return '离职';
        }
      },
      filterAllocate(val) {
        switch (val) {
          case 1:
            return '可指派';
          case 0:
            return '不可指派';
        }
      }
    }
  }
</script>
