<!--
 * @Author: 高建鹏
 * @Description: 监控模块统计图-资产范围-自定义设置
 * @Position:
 * @Date: 2019-07-23 15:57:17
 * @LastEditors: mybells
 -->
<template>
<s-dialog v-model="customSettingDialog" title="选择资产范围" width="900px" :before-close="dialogClose" :modal='false'>
  <s-scrollbar wrap-style="max-height: 550px;">
    <s-form :model="searchForm" :rules="rules" ref="searchref" inline>
      <s-form-item label="资产名称" prop="assetName">
        <s-input v-model="searchForm.assetName" @keyup.enter.native="search"></s-input>
      </s-form-item>
      <s-form-item label="IP地址" prop="ip">
        <s-input v-model="searchForm.ip" @keyup.enter.native="search"></s-input>
      </s-form-item>
      <s-form-item label="资产类型" prop="citypeUuid">
        <input-tree v-model="searchForm.citypeUuid" name="uuid" :data="assetsTypeList"
                            :props="defaultProps" :hasDelIcon="true"></input-tree>
      </s-form-item>
      <s-form-item>
        <s-button @click="search">查询</s-button>
      </s-form-item>
    </s-form>
    <RealPageTable ref="multipleTable" :ajax-obj="ajaxObj" :show-header-checkbox="true"
    @selection-change="handleSelectionChange" :callback="handleData">
    <!-- <s-table-page ref="multipleTable" :data="tableList" :show-header-checkbox="true" @selection-change="handleSelectionChange"> -->
      <s-table-column type="selection" width="45">
      </s-table-column>
      <s-table-column label="资产名称" prop="assetName"></s-table-column>
      <s-table-column label="IP地址" prop="ip"></s-table-column>
      <s-table-column label="资产类型" prop="assetType"></s-table-column>
    <!-- </s-table-page> -->
    </RealPageTable>
  </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="save">确 认</s-button>
      <s-button @click="dialogClose">取 消</s-button>
    </template>
</s-dialog>
</template>

<script>
import $axios from 'sunflower-ajax';
// import {Validaters} from 'sunflower-common-utils';
import inputTree from '@/components/inputTree/InputTree';
import {cloneDeep} from 'lodash';
import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
export default {
  components: {
    RealPageTable,
    inputTree
  },
  props: {
    customSettingDialog: {
      type: Boolean
    },
    customData: {
      type: Array,
      default: []
    },
    monitorCiypeuuid: {// 资产类型
      type: String
    }
  },
  data() {
    return {
      assetsTypeList: [],
      selections: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      searchForm: {
        assetName: '',
        ip: '',
        citypeUuid: ''
      },
      rules: {
        // ip: [
        //   Validaters.IP
        // ]
      },
      ajaxObj: {
        type: 'post',
        url: '/monitorlist/getAssetlist',
        params: {
          condition: {
          }
        },
        checkedUuidArr: []// 初始要回显选中的行
      }
    }
  },
  created() {
    $axios.get(`/monitorcitype/getMonitorCitypeTree`).then((res) => {
      let treedata = res.data.filter(item => item.uuid === this.monitorCiypeuuid)
      this.assetsTypeList = treedata;
    });
    this.selections = cloneDeep(this.customData);
  },
  mounted() {
    this.$nextTick(() => {
      this.getdata();
    })
  },
  methods: {
    handleData(data) {
      data.totalCount = data.criteria.totalCount;
      this.tableHeads = data.tableHeads;
      return data.monitorlist;
    },
    getdata() {
      let params = {
        assetName: this.searchForm.assetName,
        ip: this.searchForm.ip,
        citypeUuid: this.searchForm.citypeUuid ? this.searchForm.citypeUuid : this.monitorCiypeuuid
      }
      this.ajaxObj.checkedUuidArr = this.selections;
      this.ajaxObj.params.condition = cloneDeep(params);
    },
    search() {
      this.$refs.searchref.validate((valid) => {
        if (valid) {
         this.getdata();
        }
      })
    },
    handleSelectionChange(rows) {
      this.selections = rows;
    },
    dialogClose() {
      this.$emit('update:customSettingDialog', false)
    },
    save() {
      let arr = this.selections;
      this.$emit('selectAsset', arr)
    }
  }
}
</script>

<style scoped>

</style>
