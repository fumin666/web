/**
* Created by dgunzi on 2019/08/22.
* 关联机柜
*/
<template>
  <div id="linkAssetDialog">
    <s-table-page
      :data="assetList"
      :header-search="getHeaderSearch()"
      ref="stable"
      @selection-change="handleSelectionChange"
      :row-actions="getRowActions()">
      <s-table-column
        type="selection"
        :selectable="rowSelectable"/>
      <s-table-column
        prop="itcompName"
        label="资产名称"
        show-overflow-tooltip>
      </s-table-column>
      <s-table-column
        prop="uAmount"
        label="容量(U)"
        width="90"
        show-overflow-tooltip>
      </s-table-column>
      <s-table-column
        label="厂商"
        width="240"
        prop="manu_product_name"/>
    </s-table-page>
  </div>
</template>

<script>
  import {getThreeDCabinet} from './RoomRoomApi'

  export default {
        name: 'LinkAsset',
        data() {
            return {
              assetList: [],
              selectedOperations: [],
              radio: ''
            }
        },
        mounted() {
          getThreeDCabinet().then(({data}) => {
            this.assetList = data;
            this.$nextTick(() => {
              let selected = window.oasis3d.three.getController().getSelectedObject();
              let indexVal = this.assetList.findIndex((element) => {
                return element.uuid === selected.uuid;
              });
              if (indexVal !== -1) {
                this.$refs['stable'].toggleRowSelection(this.assetList[indexVal]);
              }
            });
          });
        },
        methods: {
          // 已经在图中选中不可选
          rowSelectable(row, index) {
            this.items = window.oasis3d.model.scene.items;
            let selected = window.oasis3d.three.getController().getSelectedObject();
            let indexVal = this.items.findIndex((element) => {
              return element.uuid === row.uuid && element.uuid !== selected.uuid;
            });
            return indexVal === -1;
          },
          handleSelectionChange(val) {
            this.selectedOperations = val;
          },
          getHeaderSearch() {
            return {
              width: 10,
              placeholder: '请输资产名称、厂商查询',
              searchProps: ['itcompName', 'manu_product_name']
            }
          },
          getCurrentRow(row) { // 获取单选框选中行的data
            this.radio = row.id
            this.selectedOperations = row
          },
          getRowActions() {
            let vm = this;
            return [
              {
                name: '编辑机柜内部资产',
                icon: 'edit',
                click: (row) => {
                  console.log(row);
                  if (row.uAmount) {
                    vm.$emit('cabinetAssetEdit', row);
                  } else {
                    this.$message.warning('请在该资产管理页面添加容量值')
                  }
                }
              }
            ]
          }
        }
    }
</script>

<style lang="stylus">
  #linkAssetDialog .s-radio__label {
    display: none;
  }
</style>
