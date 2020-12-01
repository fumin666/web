<!--角色信息-->
<template>
  <div>
    <s-table-page
      ref="multipleTable"
      :data="dataList"
      
      style="width:100%"
      @selection-change="handleSelectionChange"
    >
      <s-table-column type="selection" width="180" ></s-table-column>
      <s-table-column prop="id" label="角色编号"></s-table-column>
      <s-table-column prop="name" label="角色名称"></s-table-column>
      <s-table-column  label="角色归属" ></s-table-column>
      <s-table-column  label="权限" ></s-table-column>
      <s-table-column  label="状态" ></s-table-column>
      <s-table-column label="操作">
        <template slot-scope="scope">
          <i class="iconfont icon-edit" title="修改" @click="changeHandler(scope.row)"></i>
          <i class="iconfont icon-delete" title="删除"></i>
        </template>
      </s-table-column>
    </s-table-page>

    <!--修改角色信息弹窗-->
    <s-dialog
      v-model="changeRoleInfo"
      v-if="changeRoleInfo"
      width="700px"
      title="修改">
      <change-role-info-dialog ref="changeRoleInfo"></change-role-info-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveChange">保存</s-button>
        <s-button type="cancel" @click="cancelChange">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
  
  import changeRoleInfoDialog from '../dialog/ChangeRoleInfoDialog.vue';
  export default {
    data() {
      return {
        dataList: [],
        changeRoleInfo: false
      }
    },
    components: {
  
      changeRoleInfoDialog
    },
    methods: {
      handleSelectionChange(selections) {
        this.selections = selections;
      },
      saveChange() {
        this.changeRoleInfo = false;
      },
      cancelChange() {
        this.changeRoleInfo = false;
      }
    }
  }
</script>
