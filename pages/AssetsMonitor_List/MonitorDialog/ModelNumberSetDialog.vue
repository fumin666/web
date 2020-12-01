<template>
  <s-dialog v-model="dialogFlag" title="选择资产型号" id="modelNumberDialog" width="560px" ref="dialog" append-to-body>
    <div>
      <s-row>
        <s-col class="right-float">
          <s-input v-model="filterValue" placeholder="请输入关键字" icon="magnifier" class="search"></s-input>
        </s-col>
      </s-row>
      <s-scrollbar wrap-class="dialogScrollHeight">
        <s-row v-for="(category,index) in filterData" :key="index" class="category" v-if="category.length > 0">
          <span class="title">{{index}}</span>
          <span v-for="(product,index) in category" :key="index" class="product" @click="select(product)" :class="{'current': product.selected}">
            {{product.productName}}
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
  import $axios from 'sunflower-ajax'

  export default {
    data() {
      return {
        dialogFlag: false,
        data: {},
        selectModel: {},
        filterValue: ''
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      citypeUuid: {
        type: String,
        default: ''
      }
    },
    computed: {
      filterData() {
        let obj = {};
        for (let i in this.data) {
          obj[i] = [];
          if (i.indexOf(this.filterValue) !== -1) {
            obj[i] = this.data[i];
          } else {
            this.data[i].forEach(item => {
              if (!this.filterValue.trim()) {
                obj[i].push(item);
              } else {
                if (item.productName.toLowerCase().indexOf(this.filterValue.toLowerCase()) !== -1) {
                  obj[i].push(item);
                }
              }
            });
          }
        }
        return obj;
      }
    },
    created() {
      $axios.get('/resourcemanager/assetmanager/itasset/getMonitorProductMap/').then(({data}) => {
        this.data = data;
        for (let i in this.data) {
          this.data[i].forEach((item) => {
            this.$set(item, 'selected', false);
            this.$set(item, 'productUuid', item.uuid);
            this.$set(item, 'productName', item.caption);
          });
        }
      });
    },
    methods: {
      select(product) {
        for (let i in this.data) {
          this.data[i].forEach((item) => {
            item.selected = false;
          });
        }
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
          // this.inputTreeChange()
      },
      dialogCancel() {
        this.dialogFlag = false;
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
    }
  }
</script>
