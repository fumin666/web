<template>
    <div>
        <s-table-page :data='tableData'>
          <s-table-column prop="workInfo" label="工作信息"></s-table-column>
          <s-table-column prop="fileLength" label="文件"></s-table-column>
          <s-table-column prop="userName" label="提交人"></s-table-column>
          <s-table-column prop="nodeName" label="节点名称"></s-table-column>
          <s-table-column prop="createTime" label="提交日期"></s-table-column>
          <s-table-column label="操作" width="150">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看" @click="eyes(scope.row)"> </i>
            </template>
          </s-table-column>
        </s-table-page>
            <s-dialog
                v-model="workDialog"
                v-if="workDialog"
                width="700px"
                class="createProcess"
                title="工作信息详情">
                <WorkDetails :orderUuid='orderUuid' :viewData='viewData'></WorkDetails>
            </s-dialog>
    </div>
</template>
<script>
import $axios from 'sunflower-ajax'
import WorkDetails from '@/pages/Safety_BulletinTask/components/dialog/WorkDetails';
export default {
    data() {
        return {
            tableData: [
            ],
            workDialog: false,
            viewData: {}
        }
    },
    created() {
        this.getData()
    },
    props: {
        orderUuid: String,
        curNodeUuid: String
    },
    components: {
      WorkDetails
    },
    methods: {
        eyes(row) {
            this.workDialog = true
            this.viewData = row
        },
        getData() {
            $axios.get(`/safetyPlatform/safeOrder/getOrderWorkFlow/${this.orderUuid}`).then(res => {
                this.tableData = res.data
                this.tableData.map((val, index) => {
                  this.tableData[index].fileLength = val.fileList.length
                  if (val.workInfo === '') {
                    this.tableData[index].workInfo = '上传附件'
                  }
                })
            })
        }
    }
}
</script>
