<template>
  <s-dialog
    v-model="dialogFlag"
    v-if="dialogFlag"
    title="选择资产型号"
    top="10vh"
    id="modelNumberDialog"
    width="560px">
    <div>
      <s-row>
        <s-col class="right-float">
          <s-input v-model="filterValue" placeholder="请输入关键字" icon="magnifier" class="search"></s-input>
        </s-col>
      </s-row>
      <s-scrollbar wrap-class="dialogScrollHeight">
        <s-row
          class="category"
          v-for="(category,index) in filterList"
          :key="index"
          v-if="category.productList.length > 0">
          <span class="title">{{ category.caption }}</span>
          <span
            v-for="(product,index) in category.productList"
            :key="index" class="product" :class="{'current': product.selected}"
            @click="select(product)">
            {{product.caption}}
          </span>
        </s-row>
      </s-scrollbar>
    </div>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogCancel">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { cloneDeep } from 'lodash';

  export default {
    data() {
      return {
        dialogFlag: false,
        assetsList: [],
        selectModel: {},
        filterValue: ''
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
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
    computed: {
      filterList() {
        if (!this.filterValue) {
          return this.assetsList
        } else {
          let filterList = [];
          this.assetsList.forEach(i => {
            if (i.caption.toLowerCase().indexOf(this.filterValue.toLowerCase()) !== -1) {
              filterList.push(i);
            } else {
              let obj = cloneDeep(i);
              obj.productList = [];
              if (i.productList.length > 0) {
                i.productList.forEach(j => {
                  if (j.caption.toLowerCase().indexOf(this.filterValue.toLowerCase()) !== -1) {
                    obj.productList.push(j);
                  }
                })
                filterList.push(obj);
              }
            }
          });
          return filterList;
        }
      }
    },
    methods: {
      select(product) {
        this.assetsList.forEach((i) => {
          i.productList.forEach((j) => {
            this.$set(j, 'selected', false)
          })
        });
        product.selected = true;
        this.selectModel = product;
      },
      dialogOk() {
        if (Object.keys(this.selectModel).length === 0) {
          this.$message({showClose: true, message: '请选择资产型号', type: 'error'});
          return;
        }
        this.$emit('select-model', this.selectModel);
        this.dialogFlag = false;
      },
      dialogCancel() {
        this.dialogFlag = false;
      }
    },
    created() {
      $axios.get('/resourcemanager/assetmanager/itasset/getMonitorProduct').then(({data}) => {
        data.forEach((i) => {
          i.productList.forEach((j) => {
            j.selected = false
            this.$set(j, 'productUuid', j.uuid);
            this.$set(j, 'productName', j.caption);
            // 资产型号选择回显为: 厂商(型号)，此处获取每个型号的父级厂商
            this.$set(j, 'parentCaption', i.caption);
          })
        });
        this.assetsList = data;
      });
    }
  }
</script>

<style lang="stylus">
</style>
