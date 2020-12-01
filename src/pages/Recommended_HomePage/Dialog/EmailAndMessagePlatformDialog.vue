<!--
 * @Author: shifeng
 * @Email: shifeng199307@gmail.com
 * @LastEditors: 高建鹏
 * @LastEditEmail: shifeng199307@gmail.com
 * @Description: 邮件/ 短信平台自定义类型
 * @Date: 2019-02-25 16:08:27
 * @LastEditTime: 2019-03-22 11:27:49
 -->

<template>
  <s-dialog v-model="dialogFlag" :title="platform === 0 ?'邮件平台自定义类型' : '短信平台自定义类型'" width="660px" class="emailAndMessagePlatformDialog">
    <s-row class="topRow" style="float:left;">
      <s-button @click="addDialogFlag=true" icon="plus">添加</s-button>
    </s-row>
    <s-table-page :data='list'  :header-search="searchDef()" >
      <s-table-column prop="name" label="类型名称" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="category" label="平台类别" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.category === 0">邮件</span>
          <span v-else-if="scope.row.category === 1">短信</span>
        </template>
      </s-table-column>
      <s-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <i class="iconfont icon-edit" @click="rowEdit(scope.row)" v-if="isUndo(scope.row)" title="编辑"></i>
          <i class="iconfont icon-delete" @click="rowDel(scope.row)" v-if="isUndo(scope.row)"  title="删除"></i>
        </template>
      </s-table-column>
    </s-table-page>
    <s-dialog v-if="addDialogFlag" v-model="addDialogFlag" :title="isEdit?'编辑自定义类型':'添加自定义类型'" width="660px" append-to-body>
      <s-form :model="form" :rules="rules" ref="form" label-width="130px">
        <s-form-item label="类型名称" prop="name">
          <s-input v-model="form.name" placeholder="类型名称"></s-input>
        </s-form-item>
      </s-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addDialogOk">确定</s-button>
        <s-button type="cancel" @click="addDialogCancel">取消</s-button>
      </template>
    </s-dialog>
    <template slot="footer" class="dialog-footer">
      <s-button type="cancel" @click="dialogFlag=false">确定</s-button>
    </template>
  </s-dialog>
</template>

<script>
import $axios from 'sunflower-ajax';
import {Validaters} from 'sunflower-common-utils';

export default {
  data() {
    return {
      dialogFlag: false,
      isEdit: false,
      list: [], // 远程服务器列表
      addDialogFlag: false,
      form: {
        name: '',
        category: 0,
        uuid: ''
      },
      rules: {
        name: [Validaters.NotNull]
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    platform: { // 邮件/短信平台类型，0：邮件，1：短信
      type: Number
    }
  },
  computed: {
  },
  created() {
    this.getList();
  },
  methods: {
    // 系统默认值不能做操作
    isUndo(row) {
      return row.name !== '金迪短信猫' && row.name !== 'SMTP';
    },
    // 获取备份服务器列表
    getList() {
      $axios.get('/systemmanager/sysNotice/getSysNoticeByType/' + this.platform).then((res) => {
        if (res.data) {
          this.list = res.data
        }
      })
    },
    searchDef() {
      return {
        width: 10,
        offset: 20,
        placeholder: '请输入关键字',
        searchProps: ['name', 'category'],
        nowId: ''
      }
    },
    rowEdit(row) {
      this.addDialogFlag = true;
      this.form = {...row};
      this.isEdit = true;
    },
    rowDel(row) {
      this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
        // let logParam = {
        //   data: [Object.assign({}, row)],
        //   logTemplate: '删除' + '|协议(#protocolName#)'
        // };
        let params = [];
        params.push(row.uuid);
        $axios.post(`/systemmanager/sysNotice/batchDelSysNotice`, params).then(({data}) => {
          if (data === true) {
            this.$message({showClose: true, message: '删除成功!', type: 'success'});
            this.getList();
          } else {
            this.$message({showClose: true, message: '删除失败!', type: 'error'});
          }
        });
      }).catch(() => {});
    },
    addDialogOk() {
      let form = this.$refs['form'];
      form.validate((valid) => {
        if (!valid) {
          return false;
        }
        let params = {...this.form};
        params['category'] = this.platform;
        if (this.isEdit) {
          $axios.post('/systemmanager/sysNotice/editSysNotice', params).then((res) => {
            if (res.data === true) {
              this.$message({showClose: true, message: '编辑成功!', type: 'success'});
              this.getList();
              this.addDialogCancel();
            } else {
              this.$message({showClose: true, message: '编辑失败', type: 'error'});
            }
          })
        } else {
          delete params.uuid;
          $axios.post('/systemmanager/sysNotice/addSysNotice', params).then((res) => {
            if (res.data === true) {
              this.$message({showClose: true, message: '添加成功!', type: 'success'});
              this.getList();
              this.addDialogCancel();
            } else {
              this.$message({showClose: true, message: '添加失败', type: 'error'});
            }
          })
        }
      })
    },
    addDialogCancel() {
      this.form = {
        name: '',
        category: 0,
        uuid: ''
      };
      this.addDialogFlag = false;
      this.isEdit = false;
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
      this.$emit('emailAndMessageParent'); // 更新emailAndMessage父组件的数据
    }
  },
  components: {
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
