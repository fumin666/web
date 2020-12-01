/**
* Created by dgunzi on 2019/01/23.
* 划归拓扑
*/
<template>
  <s-dialog
    v-if="dialogFlag"
    v-model="dialogFlag"
    title="划归拓扑" width="500">
    <s-form ref="ruleForm" label-width="100px">
      <s-form-item label="选择拓扑" required>
        <input-tree v-model="requestParm" :data="treeData" :props="myProps" muti name="uuid" style="width: 100%;"></input-tree>
        <div style="line-height: 20px;height: 20px; font-size: 12px;">将勾选线路添加至所选拓扑中</div>
      </s-form-item>
    </s-form>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
    import InputTree from '@/components/inputTree/InputTree'
    import { getTopologyTree, applyTopolink } from '../api/topology_api'
    export default {
        name: 'PutUnderTopoDialog',
        data() {
            return {
              dialogFlag: false,
              requestParm: '',
              treeData: [],
              myProps: {
                children: 'childrenList',
                label: 'name',
                disabled: function (data) {
                  return data.node.type === 1 && data.childrenList.length < 1;
                }
              }
            }
        },
        created() {
            this.getTreeData()
        },
        components: {
          InputTree
        },
        props: {
          value: {
            type: Boolean,
            default: false
          },
          underUuid: {
            type: Array,
            default: []
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
        methods: {
          getTreeData() {
            getTopologyTree().then(({data}) => {
              this.treeData = data;
            });
          },
          dialogOk() {
            console.log(this.underUuid);
            console.log(this.requestParm);

            let param = {
              topoviewLinkUuids: this.underUuid,
              topoviewInfoUuids: this.requestParm.split(',')
            };
            applyTopolink(param).then(({data}) => {
              if (data) {
                this.$message({
                  type: 'success',
                  message: '划归拓扑操作成功!'
                });
                this.dialogFlag = false;
                this.$emit('reload');
              } else {
                this.$message.error('划归拓扑操作失败!');
              }
            });
          }
        }
    }
</script>

<style scoped>

</style>
