<template>
  <div id="addDeviceForm">
      <s-table-page
        ref="addDeviceTable"
        :data="tableData"
        :header-search="getHeaderSearch()"
        :show-header-checkbox="true">
        <s-table-column
          type="selection"
          width="60"/>
        <s-table-column
          label="资产类型"
          width="180" prop="citypeName"/>
        <s-table-column
          label="IP地址"
          width="140" prop="controlAdderss"/>
        <s-table-column
          label="厂商"
          width="140" prop="manufactCaption"/>
        <s-table-column
          label="资产名称"
          prop="itcompName"/>
      </s-table-page>
  </div>
</template>
<script>
  import { saveTopviewItcomp } from './api/topology_api'
  export default {
    data () {
      return {
      }
    },
    props: {
      tableData: {
        type: Array,
        required: true
      }
    },
    methods: {
      getHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输关键字',
          searchProps: ['citypeName', 'controlAdderss', 'manufactCaption', 'itcompName']
        }
      },
      submit (callback) {
        let selectList = this.$refs['addDeviceTable'].getAllSelectedData()
        if (selectList.length > 0) {
          let uuidArr = [];
          for (let i = 0, l = selectList.length; i < l; i++) {
            uuidArr.push(selectList[i].uuid);
          }
          saveTopviewItcomp(window.paramSubTopo, uuidArr).then((data) => {
            if (data) {
              if (typeof callback !== 'undefined') {
                callback();
              }
            } else {
              this.$message.error('新增资产失败');
            }
          });
        } else {
          this.$message({message: '请选择要添加的IT组件！', type: 'warning'});
        }
      }
    }
  }
</script>
