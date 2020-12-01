<template>
  <div>
    <section class="reportTop noPrint">
      <s-row>
        <s-col :span="24">
          <s-form ref="searchBox" :inline="true" :model="searchForm" :rules="formRules" label-width="80px" class="search_form" style="margin: 10px 0;">
            <div>
              <s-form-item label="重要程度：">
                <s-select v-model="searchForm.importance" clearable>
                  <s-option label="很高" :value="2"></s-option>
                  <s-option label="高" :value="3"></s-option>
                  <s-option label="中等" :value="4"></s-option>
                  <s-option label="低" :value="5"></s-option>
                  <s-option label="很低" :value="6"></s-option>
                </s-select>
              </s-form-item>
              <s-form-item label="资产名称：" prop="itcompName">
                <s-input v-model="searchForm.itcompName"></s-input>
              </s-form-item>
              <s-form-item label="IP地址：" prop="controlAdderss">
                <s-input v-model="searchForm.controlAdderss"></s-input>
              </s-form-item>
              <s-form-item label="资产类型：">
                <select-tree :muti="true" @selectMutiTreeChange="nextSelect"></select-tree>
              </s-form-item>
            </div>
            <div class="search_btn">
              <s-button title="查询" icon='magnifier' @click="getList">查询</s-button>
            </div>
          </s-form>
          <s-row style="margin: 15px 0 10px;">
            <s-button title="EXCEL报表" icon="excel" @click="DownloadHandle('excel')">EXCEL报表</s-button>
            <s-button title="WORD报表" icon="word" @click="DownloadHandle('word')">WORD报表</s-button>
            <s-button title="PDF报表" icon="pdf" @click="DownloadHandle('pdf')">PDF报表</s-button>
          </s-row>
        </s-col>
      </s-row>
    </section>
    <RealPageTable :ajax-obj="axiosObj" :callback="handleData">
      <s-table-column
        prop="important"
        label="重要程度">
        <template slot-scope="scope">
          <span v-if="scope.row.important === 2">很高</span>
          <span v-if="scope.row.important === 3">高</span>
          <span v-if="scope.row.important === 4">中等</span>
          <span v-if="scope.row.important === 5">低</span>
          <span v-if="scope.row.important === 6">很低</span>
        </template>
      </s-table-column>
      <s-table-column
        prop="itcompName"
        label="资产名称">
      </s-table-column>
      <s-table-column
        prop="controlAdderss"
        label="IP地址">
      </s-table-column>
      <s-table-column
        prop="citypeName"
        label="资产类型">
      </s-table-column>
      <s-table-column
        prop="manufactCaption"
        label="厂商型号">
        <template slot-scope="scope">
          <span>{{scope.row.manufactCaption}}-{{scope.row.modelNumber}}</span>
        </template>
      </s-table-column>
    </RealPageTable>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  import InputTree from '@/components/inputTree/InputTree'
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  import SelectTree from '@/components/selectTree/SelectTree'
  export default {
    components: {
      InputTree,
      SelectTree,
      RealPageTable
    },
    data () {
      return {
        axiosObj: {
          type: 'post',
          url: '/hierarchyProtection/getAssetImportance',
          params: {
            condition: {}
          }
        },
        searchForm: {
          importance: null,
          controlAdderss: '',
          itcompName: '',
          citypeUuids: []
        },
        formRules: {
          itcompName: [{max: 30, message: '长度不能超过30个字符', trigger: 'blur'}]
          // controlAdderss: [
          //   {pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/, message: 'IP格式不正确', trigger: 'blur'}
          // ]
        },
        myProps: {
          children: 'childrenList',
          label: 'name',
          value: 'uuid'
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      nextSelect(val) {
        let vm = this;
        vm.searchForm.citypeUuids = []
        val.map((item) => {
          vm.searchForm.citypeUuids.push(item.uuid)
        });
      },
      getList() {
        let params = Object.assign({}, this.searchForm)
        if (params.importance === '') {
          params.importance = null
        }
        this.$nextTick(() => {
          this.axiosObj.params.condition = Object.assign({}, params);
        })
      },
      handleData(data) {
        data.totalCount = data.total;
        return data.list;
      },
      DownloadHandle(type) {
        $axios.post(`/hierarchyProtection/createAssetImportanceFile/${type}`, this.searchForm).then(res => {
          if (res.data === true) {
            Download(`/hierarchyProtection/exportAssetImportanceFile/${type}`)
          }
        })
      }
    }
  }
</script>
<style lang="stylus">
</style>
