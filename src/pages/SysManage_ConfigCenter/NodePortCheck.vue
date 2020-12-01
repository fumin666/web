/**
* Created by dgunzi on 2019/03/06.
* 端口检测
*/
<template>
  <div>
    <s-table-page
      :data="servicePort"
      :header-search="getHeaderSearch()"
      :header-actions="getHeaderActions()"
      :row-actions="getRowActions()"
      actions-col-width="150">
      <s-table-column
        label="别名"
        prop="bName"/>
      <s-table-column
        label="端口"
        width="250"
        prop="port"/>
      <s-table-column
        label="状态"
        width="250"
        prop="status"/>
    </s-table-page>
    <!--添加端口-->
    <s-dialog
      v-model="addNodePortDialog"
      v-if="addNodePortDialog"
      width="400px"
      title="添加端口" append-to-body>
      <node-port-form ref="addNodePort" :form="form"></node-port-form>
      <template slot="footer">
        <s-button @click="saveForm">保存</s-button>
        <s-button type="cancel" @click="addNodePortDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
    import NodePortForm from './NodePortForm'
    import $axios from 'sunflower-ajax'

    export default {
        name: 'NodePortCheck',
        data() {
            return {
              addNodePortDialog: false,
              form: {
                bName: '',
                port: ''
              }
            }
        },
        props: {
          servicePort: {
            type: Array,
            required: true,
            default: () => []
          },
          nodeId: {
            type: String,
            required: true
          }
        },
        components: {
          NodePortForm
        },
        created() {
        },
        methods: {
          getHeaderSearch() {
            return {
              width: 10,
              placeholder: '请输入别名进行查询',
              searchProps: ['bName']
            }
          },
          getHeaderActions() {
            let vm = this;
            return {
              width: 12,
              offset: 0,
              actions: [
                {
                  name: '添加端口',
                  icon: 'add',
                  click: function() {
                    vm.addNodePortDialog = true;
                    vm.form = {bName: '', port: ''};
                  }
                },
                {
                  name: '刷新',
                  icon: 'refresh-circle',
                  click: function() {
                    vm.$emit('reload')
                  }
                }
              ]
            }
          },
          getRowActions() {
            let vm = this;
            return [
              {
                name: '删除',
                icon: 'delete',
                click: (row) => {
                  this.$confirm('确定删除该接口？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    $axios.post(`/configcenter/portcheck/deletePort/${vm.nodeId}/${row.port}`).then(({data}) => {
                      if (data.result) {
                        this.$message.success(data.errormsg);
                      } else {
                        this.$message.error(data.errormsg);
                      }
                      vm.$emit('reload');
                    });
                  }).catch(() => {});
                }
              }
              ]
          },
          // 保存添加端口表单
          saveForm() {
            let _self = this;
            _self.$refs['addNodePort'].$refs['form'].validate((valid) => {
              if (valid) {
                $axios.post(`/configcenter/portcheck/addPort/${_self.nodeId}`, this.form).then(({data}) => {
                  if (data.result) {
                    this.$message.success(data.errormsg);
                  } else {
                    this.$message.error(data.errormsg);
                  }
                  _self.addNodePortDialog = false;
                  _self.$emit('reload')
                });
              } else {
                return false;
              }
            });
          }
        }
    }
</script>

<style scoped>

</style>
