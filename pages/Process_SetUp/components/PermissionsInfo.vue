<!--权限信息-->
<template>
  <div>
    <s-table-page
      ref="permissionsTable"
      :data="dataList"
      
      :header-search='getSearchDef()'
      
      style="width:100%"
      @selection-change="handleSelectionChange"
    >
      <s-table-column type="selection" width="180" ></s-table-column>
      <s-table-column prop="id" label="编号"></s-table-column>
      <s-table-column prop="name" label="角色"></s-table-column>
      <s-table-column prop="permission" label="权限" ></s-table-column>
      <s-table-column  label="权限描述" ></s-table-column>
      <s-table-column  label="状态" ></s-table-column>
      <s-table-column label="操作">
        <template slot-scope="scope">
          <i class="iconfont icon-edit" title="启用" ></i>
          <i class="iconfont icon-edit" title="禁用" ></i>
          <i class="iconfont icon-edit" title="修改" @click="changeHandler"></i>
        </template>
      </s-table-column>
    </s-table-page>

    <!--修改权限信息弹窗-->
    <s-dialog
      v-model="permissionsInfo"
      v-if="permissionsInfo"
      width="700px"
      title="修改">
        <s-scrollbar wrap-style="height: 400px;">
          <change-permissions-dialog ref="changePermissions"></change-permissions-dialog>
        </s-scrollbar>
        <template slot="footer" class="dialog-footer">
          <s-button @click="saveChange">保存</s-button>
          <s-button type="cancel" @click="cancelChange">取消</s-button>
        </template>
    </s-dialog>
  </div>
</template>

<script>
  
  import changePermissionsDialog from '../dialog/ChangePermissionsDialog.vue';
  export default {
    data() {
      return {
        dataList: [
          {
            id: '1',
            name: '张胜男',
            permission: 'Incident User'
          }
        ],
        permissionsInfo: false
      }
    },
    components: {
      changePermissionsDialog
    },
    methods: {
      handleSelectionChange(selections) {
        this.selections = selections;
        console.log(this.selections)
      },
      getSearchDef() {
        return {
          show: false
        }
      },
      changeHandler(row) {
        console.log(row);
        this.permissionsInfo = true;
      },
      saveChange() {
        this.permissionsInfo = false;
      },
      cancelChange() {
        this.permissionsInfo = false;
      }
    }
  }
</script>
