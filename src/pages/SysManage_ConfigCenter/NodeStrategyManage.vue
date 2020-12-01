/**
* Created by dgunzi on 2019/03/07.
* 策略管理
*/
<template>
  <div>
    <s-table-page
      :data="nodeStrategyList"
      :header-search="getHeaderSearch()"
      :header-actions="getHeaderActions()"
      :row-actions="getRowActions()"
      actions-col-width="150">
      <s-table-column
        label="子网地址"
        prop="subNetIP"/>
      <s-table-column
        label="子网掩码"
        width="250"
        prop="subNetMask"/>
      <s-table-column
        label="网段"
        width="250"
        prop="segmentIp"/>
    </s-table-page>
    <!--添加策略-->
    <s-dialog
      v-model="addStrategyDialog"
      v-if="addStrategyDialog"
      width="400px"
      title="添加策略" append-to-body>
      <add-strategy-form ref="addStrategy"></add-strategy-form>
      <template slot="footer">
        <s-button @click="saveForm">保存</s-button>
        <s-button type="cancel" @click="addStrategyDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
    import AddStrategyForm from './AddStrategyForm';
    import $axios from 'sunflower-ajax'

    export default {
        name: 'NodeStrategyManage',
        data() {
            return {
              addStrategyDialog: false
            }
        },
        props: {
          nodeStrategyList: {
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
          AddStrategyForm
        },
        created() {
        },
        methods: {
          getHeaderSearch() {
            return {
              width: 10,
              placeholder: '请输入子网地址、子网掩码、网段进行查询',
              searchProps: ['subNetIP', 'subNetMask', 'segmentIp']
            }
          },
          getHeaderActions() {
            let vm = this;
            return {
              width: 12,
              offset: 0,
              actions: [
                {
                  name: '添加策略',
                  icon: 'add',
                  click: function() {
                    vm.addStrategyDialog = true;
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
                  this.$confirm('确定删除该策略？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    $axios.post(`/configcenter/ipstrategy/deleteIpStrateg/${vm.nodeId}/${row.uuid}`).then(({data}) => {
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
          // 保存添加策略表单
          saveForm() {
            let _self = this;
            _self.$refs['addStrategy'].$refs['Form'].validate((valid) => {
              if (valid) {
                $axios.post(`/configcenter/ipstrategy/addIpStrateg/${_self.nodeId}`, _self.$refs['addStrategy'].Form).then(({data}) => {
                  console.log(data);
                  if (data.result) {
                    this.$message.success(data.errormsg);
                  } else {
                    this.$message.error(data.errormsg);
                  }
                  _self.addStrategyDialog = false;
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
