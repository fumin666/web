<template>
  <section class="app-set-black">
    <s-row>
      <s-col :span="12">
        <s-button icon="batch-del">批量移出</s-button>
      </s-col>
    </s-row>
    <s-table-page
      :data="listData"

      :row-actions="getRowActionsDef()"
      :header-search="getSearchDef()"
      :row-class-name="getRowClassName"
      @selection-change="changeHandler">
      <s-table-column type="selection" width="45"></s-table-column>
      <s-table-column label="终端名称"></s-table-column>
      <s-table-column label="ID号"></s-table-column>
    </s-table-page>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax';

  export default {
    components: {
    },
    data() {
      return {
        listData: []
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      batchHandler(name) {
        switch (name) {
          case 'black':
            break;
          case 'offline':
            break;
          case 'unbind':
            break;
        }
      },
      getList() {
        $axios.get('/mobileLogin/getBlockIds').then((res) => {
          if (res.data instanceof Array) {
            this.listData = res.data;
          }
        });
      },
      getRowActionsDef() {
        // let vm = this;
        return [
          {
            type: 'assist-cancel',
            name: '移出',
            click(row) {
              console.log('移出');
            }
          }
        ]
      },
      getSearchDef() {
        return {
          width: 12,
          placeholder: '请输入查询内容',
          searchProps: []
        }
      },
      getRowClassName(row) {},
      changeHandler(val) {}
    }
  }
</script>

<style>
  .app-set-black>.sc-table {
    margin-top: -32px;
    min-height: 300px;
  }
  .app-set-black>.sc-table>div.tool-bar {
    justify-content: flex-end;
  }
</style>
