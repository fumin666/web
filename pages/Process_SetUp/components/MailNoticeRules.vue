<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-08 14:21:43
 * @LastEditTime: 2019-04-08 14:21:43
 * @LastEditors: your name
 -->
<!--邮件通知规则配置-->
<template>
  <div>
    <s-row>
      <s-col :span="22">
        <s-button @click="showChangeMailRules" icon="plus">添加</s-button>
      </s-col>
    </s-row>
    <s-form ref="searchBox" :inline="true" :model="searchForm" label-width="80px" class="search_form" style="margin: 10px 0;">
      <div>
        <s-form-item prop="orderTypeName" label="所属流程:">
          <s-select v-model="orderType" @change="changeOrderType" filterable clearable>
            <s-option v-for="(value, key, index) in options.orderTypeMap" :label="value"
                      :value="index"  :key="index"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item prop="orderStatusName" label="流程状态:">
          <s-select v-model="searchForm.orderStatusName" filterable clearable>
            <s-option v-for="item in options.orderStatus" :label="item.name"
                      :value="item.name"  :key="item.valueInt"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item prop="sendObjectName" label="发送对象:">
          <s-select v-model="searchForm.sendObjectName" filterable clearable>
            <s-option v-for="item in options.sendObject" :label="item.roleName"
                      :value="item.roleName"  :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" title="查询" @click="search()">查询</s-button>
      </div>
    </s-form>

    <s-table-page
      ref="multipleTable"
      :data="tableData"
      :max-height=550
      style="width:100%;margin-top:10px;"
    >
      <s-table-column prop="orderTypeName" label="所属流程" width="90"></s-table-column>
      <s-table-column prop="orderStatusName" label="流程状态" width="90"></s-table-column>
      <s-table-column prop="sendObjectName" label="发送对象" width="100"></s-table-column>
      <s-table-column prop="subject" label="邮件标题" ></s-table-column>
      <s-table-column prop="operateTime" label="操作时间" width="170"></s-table-column>
      <s-table-column prop="createUserName" label="操作人" width="110"></s-table-column>
      <s-table-column prop="status" label="规则状态" width="90">
        <template slot-scope="scope">
          <s-switch v-model="scope.row.status" size="small" :active-value="1" :inactive-value="0" @change="changeState(scope.row)"></s-switch>
        </template>
      </s-table-column>
      <s-table-column label="操作" width="120">
        <template slot-scope="scope">
          <i class="iconfont icon-edit" title="修改" @click="changeHandler(scope.row)"></i>
          <i class="iconfont icon-delete" title="删除" @click="delHandler(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table-page>


    <!--添加邮件通知规则配置弹窗-->
    <s-dialog
      v-model="addMailRules"
      v-if="addMailRules"
      width="800px"
      title="添加"
      append-to-body>
      <s-scrollbar wrap-style="height: 400px;">
        <mail-notice-rules-dialog ref="addMailRules"></mail-notice-rules-dialog>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveAddMailRules">保存</s-button>
        <s-button type="cancel" @click="addMailRules = false;">取消</s-button>
      </template>
    </s-dialog>


    <!--修改邮件通知规则配置弹窗-->
    <s-dialog
      v-model="changeMailRules"
      v-if="changeMailRules"
      width="800px"
      title="修改"
      append-to-body>
      <s-scrollbar wrap-style="height: 400px;">
        <mail-notice-rules-dialog :editData="editData" ref="changeMailRules"></mail-notice-rules-dialog>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveEdit">保存</s-button>
        <s-button type="cancel" @click="changeMailRules = false;">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import mailNoticeRulesDialog from '../dialog/MailNoticeRulesDialog.vue';
  // import SearchBox from '@/components/tableCom/src/SearchBox';
  import {multiSearch} from 'sunflower-common-utils';
  import {cloneDeep} from 'lodash';
  export default {
    data() {
      return {
        dataList: [],
        tableData: [],
        addMailRules: false,
        changeMailRules: false,
        editData: {},
        searchForm: {
          orderTypeName: '',
          orderStatusName: '',
          sendObjectName: ''
        },
        options: {
          orderTypeMap: {},
          orderStatus: {},
          sendObject: []
        },
        orderType: '',
        flag: false
      }
    },
    methods: {
      getData() {
        $axios.post('itilSendRule/getAll').then((res) => {
          this.dataList = res.data;
          this.tableData = cloneDeep(res.data);
        })
      },
      changeState(row) {
        let msg = {
          status: row.status,
          uuid: row.uuid
        }
        $axios.post('/itilSendRule/upt', msg).then((res) => {
          if (res.status === 200) {
            this.$message({
              message: '更新成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: '更新失败',
              type: 'error'
            });
          }
        });
      },
      delHandler(row) {
        let uuid = row.uuid;
        this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.get('/itilSendRule/del/' + uuid, {
            data: [],
            logTemplate: '删除|邮件通知规则'
          }).then(res => {
            if (res.status === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getData();
            } else {
              this.$message({
                message: '删除失败',
                type: 'error'
              })
            }
          })
        }).catch(() => {});
      },
      showChangeMailRules() {
        this.addMailRules = true;
      },
      saveAddMailRules() {
        this.$refs['addMailRules'].$refs['Form'].validate(valid => {
          if (!valid) return;
          let form = this.$refs['addMailRules'].form;
          form.selectedUuidList = [];
          this.$refs['addMailRules'].addDataName.map(item => {
            form.selectedUuidList.push(item.uuid);
          })
          $axios.post('/itilSendRule/save', form, {
            data: [],
            logTemplate: '添加|邮件通知规则'
          }).then((res) => {
            if (res.data === true) {
              this.addMailRules = false;
              this.$message({message: '添加成功', type: 'success'});
              this.getData();
            } else {
              this.$message({message: '添加失败', type: 'error'});
            }
          })
        })
      },
      changeHandler(row) {
        this.editData = row;
        this.changeMailRules = true;
      },
      saveEdit() {
        this.$refs['changeMailRules'].$refs['Form'].validate(valid => {
          if (!valid) return;
          let form = this.$refs['changeMailRules'].form;
          form.selectedUuidList = [];
          this.$refs['changeMailRules'].addDataName.map(item => {
            form.selectedUuidList.push(item.uuid);
          })
          $axios.post('/itilSendRule/upt', form, {
            data: [],
            logTemplate: '编辑|邮件通知规则'
          }).then((res) => {
            if (res.data === true) {
              this.changeMailRules = false;
              this.$message({message: '编辑成功', type: 'success'});
              this.getData();
            } else {
              this.$message({message: '编辑失败', type: 'error'});
            }
          })
        })
      },
      getOrderType() {
        $axios.get('ItilCommonWorkflow/getOrderType').then((res) => {
          this.options.orderTypeMap = res.data;
        })
      },
      search() {
        let form = Object.assign({}, {}, this.searchForm);
        this.tableData = multiSearch(form, this.dataList);
        this.flag = false
      },
      hideHandler() {
        this.flag = !this.flag
      },
      changeOrderType(val) {
        for (let i in this.options.orderTypeMap) {
          if (parseInt(i) === val) {
            this.searchForm.orderTypeName = this.options.orderTypeMap[i];
          }
        }
        this.searchForm.orderStatusName = '';
        this.searchForm.sendObjectName = '';
        if (val !== '') {
          this.getOrderStatusAndSendObject(val);
        } else {
          this.searchForm.orderTypeName = '';
          this.searchForm.orderStatusName = '';
          this.searchForm.sendObjectName = '';
        }
      },
      getOrderStatusAndSendObject(val) {
        $axios.get('/itilSendRule/getOrderStatusAndSendObject/' + val).then((res) => {
          this.options.orderStatus = res.data.orderStatus;
          this.options.sendObject = res.data.sendObject;
        })
      }
    },
    created() {
      this.getData();
      this.getOrderType();
    },
    components: {
      mailNoticeRulesDialog
      // SearchBox
    }
  }
</script>
