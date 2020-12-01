<template>
  <section>
    <s-collapse v-model="activeNames">
      <s-collapse-item title="基础设置" name="baseSet">
        <s-form :model="KeyCommandGroupInfo" :rules="rules1" ref="KeyCommand" label-width="100px">
          <s-form-item label="命令集名称" prop="name" tip="最大长度为30，由中文、字母、数字、符号[_-.]组成">
            <s-input v-model="KeyCommandGroupInfo.name"></s-input>
          </s-form-item>
          <s-form-item label="备注  " prop="remark" tip="备注信息所允许的最大长度为120个字符">
            <s-input type="textarea" v-model="KeyCommandGroupInfo.remark"></s-input>
          </s-form-item>
        </s-form>
      </s-collapse-item>
      <s-collapse-item title="添加命令" name="addOrder">
        <s-scrollbar wrap-style="max-height:300px;">
          <s-table-page
            ref="orderListTable"
            :data="orderList"
            :header-search="getSearchDef()"
            @selection-change="changeSelectOrder">
            <s-table-column type="selection" width="45"></s-table-column>
            <s-table-column label="名称" prop="key_command_name"></s-table-column>
            <s-table-column label="内容" prop="key_command_cont"></s-table-column>
          </s-table-page>
        </s-scrollbar>
      </s-collapse-item>
    </s-collapse>
  </section>
</template>
<script>
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      var validatorName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('名称不能为空！'))
        }
        // 如果是编辑页面，并且命令集为改变则不判断是否重复
        if (this.orderUuid) {
          if (value !== this.exist_name) {
            $axios.get('/keyCommandGroup/exist/' + value).then((res) => {
              if (res.data) {
                callback(new Error('该命令集已存在！'));
              }
            });
          }
        } else {
          $axios.get('/keyCommandGroup/exist/' + value).then((res) => {
            if (res.data) {
              callback(new Error('该命令集已存在！'));
            }
          });
        }
        setTimeout(() => {
          // 最大长度为30，由中文、字母、数字、符号[_-.]组成
          let re = /^[0-9a-zA-Z_\-\.\u4e00-\u9fa5]{1,30}$/gi;
          if (!re.test(value)) {
            callback(new Error('请输入正确命令名称'));
          } else {
            callback();
          }
        }, 500);
      };
      return {
        activeNames: ['baseSet', 'addOrder'],
        KeyCommandGroupInfo: {
          name: '',
          remark: ''
        },
        rules1: {
          name: [
            {required: true, validator: validatorName, trigger: 'blur'}
          ],
          remark: [
            {min: 0, max: 120, message: '最大长度不超过120个字符', trigger: 'blur'}
          ]
        },
        // 保存编辑之前的命令集名称，方便之后对比是否改变
        exist_name: '',
        orderList: [],      // 命令集列表数据
        orderListSelections: []       // 命令集列表多选选中数据
      };
    },
    props: {
      orderUuid: {
        type: String,
        default: ''
      }
    },
    methods: {
      getSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询内容',
          searchProps: ['key_command_name', 'key_command_cont']
        }
      },
      changeSelectOrder(val) {
        this.orderListSelections = val;
      }
    },
    created() {
      // 获取命令集列表
      $axios.get('/keyCommand/list').then(({data}) => {
        if (data && data instanceof Array) {
          this.orderList = data;
          // 编辑状态
          if (this.orderUuid) {
            // 获取命令集相关信息
            $axios.get(`/keyCommandGroup/view/${this.orderUuid}`).then(({data}) => {
              this.KeyCommandGroupInfo = Object.assign({}, this.KeyCommandGroupInfo, data.info);    // 名称、备注
              this.KeyCommandGroupInfo.uuid = data.info.uuid;   // uuid
              this.exist_name = this.KeyCommandGroupInfo.name;  // 名称
              // 回显选中关联的命令
              let vm = this
              if (data.rels.length > 0) {
                this.$nextTick(() => {
                  this.orderList.forEach(item => {
                    data.rels.forEach(list => {
                      if (item.uuid === list.uuid) {
                        vm.$refs.orderListTable.toggleRowSelection(item, true);
                      }
                    });
                  });
                });
              }
            });
          }
        }
      });
    }
  }
</script>

