/**
* Created by alex on 2018/8/22.
*/
<template>
  <section>
    <s-scrollbar wrap-style="max-height: 420px;">
      <div style="position: absolute;font-size: 16px;top: 10px;">IP:{{currentIp}}</div>
      <s-table-page :data='checkList'


              :header-search='getSearchDef()'>
      <s-table-column
        prop="createTime"
        label="执行时间">
      </s-table-column>
      <s-table-column
        prop="fastenItemName"
        label="加固检查项">
      </s-table-column>
      <s-table-column
        prop="fastenItemDescription"
        label="描述">
      </s-table-column>
      <s-table-column
      prop="isSuccess"
      label="结果" width="80">
        <template slot-scope="scope">
            <img :src="filterStateImg(scope.row.isSuccess)" alt="" style="vertical-align: middle">
        </template>
      </s-table-column>
      <s-table-column label="操作" width="80">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" v-if="scope.row.isSuccess !== 'True'" @click="viewHandler(scope.row.repairSuggest)" title="加固建议"></i>
        </template>
      </s-table-column>
    </s-table-page>
    </s-scrollbar>
    <s-dialog
      v-model="viewDialog"
      v-if="viewDialog"
      width="900px"
      title="查看加固建议"
      append-to-body>
      <div v-text="suggest"></div>
    </s-dialog>
  </section>
</template>

<script type="text/babel">

  import $axios from 'sunflower-ajax'
  export default {
    data () {
      return {
        viewDialog: false,
        checkList: [],
        suggest: '',
        currentIp: ''
      }
    },
    props: {
      checkUuid: {
        type: String,
        default: ''
      }
    },
    created() {
      this.getCheckList()
    },
    methods: {
      filterStateImg(val) {
        let img = ''
        switch (val) {
          case 'True': img = '/static/images/resourcemanage/deviceOnline.png'; break;
          case 'False': img = '/static/images/resourcemanage/deviceWarn.png'; break;
          case 'Error': img = '/static/images/resourcemanage/deviceOffline.png'; break;
        }
        return img
      },
      getCheckList() {
        $axios.get(`/automateSystemFasten/getSystemFastenTaskExecuteResultDetailByUuid/${this.checkUuid}`).then((res) => {
          this.checkList = res.data
          this.currentIp = this.checkList[0].ipAddress
        })
      },
      getSearchDef() {
        return {
          width: 6,
          offset: 18,
          placeholder: '请输入查询条件',
          searchProps: ['createTime', 'fastenItemName', 'fastenItemDescription']
        }
      },
      viewHandler(row) {
        this.viewDialog = true
        this.suggest = row
      }
    }
  }
</script>
