<!-- 文件 -->
<template>
  <div class="assetFile">
    <s-row style="margin-bottom: 10px;" v-if="permission && !assetName">
      <s-button icon="plus" @click="docAdd">添加</s-button>
      <s-button icon="batch-del" @click="docDel">批量删除</s-button>
    </s-row>
    <s-table-page
      max-height="300"
      :data="docList"
      @selection-change="docSelectChange">
      <s-table-column type="selection" width="45" align="center" v-if="!assetName"></s-table-column>
      <s-table-column label="文档名称" prop="docName" show-overflow-tooltip>
        <template slot-scope="scope">
          <a href="javascript:void(0);" @click="showDocDetail(scope.row)" class="docName">{{scope.row.docName}}</a>
        </template>
      </s-table-column>
      <s-table-column label="创建者" prop="createrUser.userLoginName" show-overflow-tooltip></s-table-column>
      <s-table-column label="创建时间" prop="createTime" show-overflow-tooltip></s-table-column>
      <s-table-column label="文档类型" prop="docType" show-overflow-tooltip></s-table-column>
      <s-table-column label="操作" width="80" v-if="this.permission && !assetName">
        <template slot-scope="scope">
          <i class="iconfont icon-delete" @click="rowDel(scope.row)" title="删除"></i>
        </template>
      </s-table-column>
    </s-table-page>

    <doc-dialog @getSelection="getDocSelection" :selectedData="docList"></doc-dialog>
    <doc-detail-dialog v-model="docDetailDialogFlag" v-if="docDetailDialogFlag" :cur-doc="curDoc" />
  </div>
</template>

<script>
import docDialog from '@/components/docDialog';
import $axios from 'sunflower-ajax';
import docDetailDialog from '../../Assets_DocManage/DocDetailDialog';

export default {
  data() {
    return {
      docList: [], // 关联文档
      docSelections: [],
      assetUuid: '',
      docDetailDialogFlag: false,
      curDoc: {}
    }
  },
  props: {
    isOma: {
      type: Boolean,
      default: false
    },
    assetName: {
      type: Boolean,
      default: false
    },
    addAssetUuid: {
      type: String,
      default: ''
    },
    permission: {   // 表示是否有操作按钮的权限
      type: Boolean,
      default: false
    }
  },
  computed: {
    editAssetUuid() {
      if (this.$route.name === 'AssetsAll_assetEdit') {
        return this.$route.params.assetUuid;
      } else {
        return ''
      }
    }
  },
  methods: {
    getdocList(assetUuid) {
      if (!assetUuid) return null
      $axios.post(`/resourcemanager/assetmanager/itasset/getitAsset/${assetUuid}`).then(({ data }) => {
        if (data.documentInfo === null) {
          this.docList = [];
        } else {
          this.docList = data.documentInfo;
        }
      });
    },
    docAdd() {
      if (this.addAssetUuid === '') {
        this.$message({showClose: true, message: '请先正确填写资产信息', type: 'warning'});
        return
      }
      this.handlerAdd();
    },
    handlerAdd() {
      this.$store.commit('openDocDialog');
    },
    docDel() {
      if (this.docSelections.length < 1) {
        this.$message({ message: '请选择要删除的文档!', type: 'warning' });
        return;
      }
      this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
        let arr = [];
        this.docSelections.map(item => {
          arr.push({ docuuid: item.uuid, relevanceuuid: this.assetUuid });
        });
        $axios.post(`/resourcemanager/assetmanager/itasset/updateDoc`, arr).then((res) => {
          if (res.data === 'true') {
            this.getdocList(this.assetUuid);
            this.$message({ showClose: true, message: '删除成功', type: 'success' });
          }
        });
      }).catch(() => {});
    },
    rowDel(row) {
      this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
        let arr = [];
        arr.push({ docuuid: row.uuid, relevanceuuid: this.assetUuid });
        $axios.post(`/resourcemanager/assetmanager/itasset/updateDoc`, arr).then((res) => {
          if (res.data === 'true') {
            this.getdocList(this.assetUuid);
            this.$message({ showClose: true, message: '删除成功', type: 'success' });
          }
        });
      }).catch(() => {});
    },
    docSelectChange(selections) {
      this.docSelections = selections;
    },
    getDocSelection(selections) {
      // this.docList = selections;
      let arr = [];
      selections.map(item => {
        arr.push({ docuuid: item.uuid, relevanceuuid: this.assetUuid })
      });
      $axios.post(`/resourcemanager/assetmanager/itasset/saveDoc`, arr).then((res) => {
        if (res.data === 'true') {
          this.getdocList(this.assetUuid);
          this.$message({ showClose: true, message: '添加成功', type: 'success' });
        }
      });
    },
    getDocType(str) {
      switch (str) {
        case '声音文件': return 2;
        case '视频文件': return 3;
        case '动画文件': return 4;
        case '演示文件': return 5;
        case '网页文件': return 6;
        case '电子表格文件': return 7;
        default: return 1;
      }
    },
    showDocDetail(row) {
      this.curDoc = Object.assign({}, row);
      this.docDetailDialogFlag = true;
    },
    nullFunc() {
      return null
    }
  },
  created() {
    if (this.$route.name === 'AssetsAll_assetEdit') {
      this.assetUuid = this.editAssetUuid
      this.getdocList(this.assetUuid)
    } else {
      this.assetUuid = this.addAssetUuid
      this.getdocList(this.assetUuid)
    }
  },
  components: {
    docDialog,
    docDetailDialog
  }
}
</script>

<style lang="stylus">
</style>
