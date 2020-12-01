<!--
 * @Author: mybells
 * @Version://Q1IAM模块功能增强
 * @Description:业务权限管理-》应用系统授权管理
 * @Date: 2020-02-12 09:41:00
 * @LastEditors: mybells
 -->

<template>
  <div>
    <s-row style="margin-bottom: 15px;">
      <s-form :inline="true" :model="form" class="search_form">
        <div>
          <s-form-item label="清单名称：">
            <s-input v-model="form.orderName" placeholder="请输入" @keyup.enter.native="searchList"></s-input>
            <s-input style="display:none"></s-input>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button icon="magnifier" title="查询" @click="searchList">查询</s-button>
        </div>
      </s-form>
    </s-row>
    <s-row style="margin-bottom: 10px;">
      <s-button @click="add" >添加</s-button>
      <s-button @click="batchDel" >批量删除</s-button>
    </s-row>
    <s-row>
      <RealPageTable :ajax-obj="ajaxObj" @selection-change="selection">
        <s-table-column type="selection" width="45"></s-table-column>
        <s-table-column label="清单名称" prop='orderName'></s-table-column>
        <s-table-column label="创建者" prop='submitUser'></s-table-column>
        <s-table-column label="创建时间" prop='createTime'></s-table-column>
        <s-table-column label="操作" align="center">
          <template slot-scope="scope">
            <i class="iconfont icon-eye" @click="eyeEdit(scope.row)" title="查看" ></i>
            <i class="iconfont icon-edit" @click="rowEdit(scope.row)" title="编辑" ></i>
            <i class="iconfont icon-delete" @click="del([scope.row])" title="删除" ></i>
          </template>
        </s-table-column>
      </RealPageTable>
    </s-row>
    <!-- 添加 -->
    <formDialog :type="type" v-if="dialogFlag" :dialogFlag.sync='dialogFlag' @reload="reload" :rowUuid="rowUuid"></formDialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import formDialog from './SystemAuthDialog/FormDialog'
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'

  export default {
    components: {
      formDialog,
      RealPageTable
    },
    data() {
      return {
        dialogFlag: false,
        rowUuid: '',
        type: '',
        form: {
          orderName: null
        },
        ajaxObj: {
          type: 'post',
          url: '/oauthAuthorizeOrder/getAuthOrderList',
          params: {
            condition: {
            }
          }
        },
        selectionArr: []
      }
    },
    mounted() {
      this.axiosList();
    },
    methods: {
      selection(arr) {
        this.selectionArr = arr;
      },
      /* 查询 */
      searchList() {
        this.axiosList();
      },
      axiosList() {
        let params = {
          orderName: this.form.orderName
        }
        this.ajaxObj.params.condition = params;// 请求接口
      },
      batchDel() {
        this.del(this.selectionArr);
      },
      del(arr) {
        if (arr.length) {
          this.$confirm('确定删除?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.post(`/oauthAuthorizeOrder/deleteAuthOrder`, arr.map(item => item.uuid), {
              data: arr,
              logTemplate: '删除|应用系统授权管理>清单(#orderName#)'
            }).then(({data}) => {
              if (data.state === true) {
                this.$message({message: '删除成功!', type: 'success'});
                this.axiosList();
              } else {
                this.$message({message: data.errormsg, type: 'error'});
              }
            });
          }).catch(() => {});
        } else {
          this.$message({
            message: '请选择要删除的数据！',
            type: 'warning'
          });
        }
      },
      add() {
        this.rowUuid = null;
        this.type = 'add';
        this.dialogFlag = true;
      },
      eyeEdit(row) {
        this.rowUuid = row.uuid;
        this.type = 'eye';
        this.dialogFlag = true
      },
      rowEdit(row) {
        this.rowUuid = row.uuid;
        this.type = 'edit';
        this.dialogFlag = true;
      },
      reload() {
        this.dialogFlag = false;
        this.axiosList();
      }
    }
  }
</script>
