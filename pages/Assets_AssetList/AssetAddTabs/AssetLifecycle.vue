<!-- 资产生命周期 -->
<template>
  <div class="lifecycle-set">
    <s-row class="left-btn" v-if="permission && !assetName">
      <template v-for="(item, index) in selectOptionsObj.assetStatusList">
        <s-button v-if="item.keyname === 'use'" :key="index" icon="start" @click="validAssetAddForm(item)">{{item.assetstatusName}}</s-button>
        <s-button v-else-if="item.keyname === 'change'" :key="index" icon="alter" @click="validAssetAddForm(item)">{{item.assetstatusName}}</s-button>
        <s-button v-else-if="item.keyname === 'repaire'" :key="index" icon="nav-set-oper" @click="validAssetAddForm(item)">{{item.assetstatusName}}</s-button>
        <s-button v-else-if="item.keyname === 'bad'" :key="index" icon="delete" @click="validAssetAddForm(item)">{{item.assetstatusName}}</s-button>
        <s-button v-else-if="item.keyname === 'deprecated'" :key="index" icon="back-square" @click="validAssetAddForm(item)">{{item.assetstatusName}}</s-button>
        <s-button v-else-if="item.keyname === 'stock'" :key="index" icon="receive" @click="validAssetAddForm(item)">{{item.assetstatusName}}</s-button>
        <s-button v-else-if="item.keyname === 'returnback'" :key="index" icon="quit-s" @click="validAssetAddForm(item)">{{item.assetstatusName}}</s-button>
        <s-button v-else :key="index" icon="" @click="validAssetAddForm(item)">{{item.assetstatusName}}</s-button>
      </template>
    </s-row>
    <s-table-page :data="lifecycleList">
      <s-table-column prop="statusName" label="状态" width="140" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="createUserName" label="操作人" width="180" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="createTime" label="操作时间" width="220" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="remark" label="备注说明" show-overflow-tooltip>
      </s-table-column>
    </s-table-page>
    <s-dialog v-model="markDialogFlag" v-if="markDialogFlag" :title="curItem.assetstatusName || '备注'" id="markAddDialog" :before-close="dialogClose" append-to-body>
      <s-scrollbar wrap-class="assetDialogScrollbar">
        <s-form ref="markDialogForm" :model="markDialogForm" :rules="markDialogFormRules" label-width="120px">
          <s-form-item label="添加备注说明" prop="mark">
            <s-input type="textarea" v-model="markDialogForm.mark" :rows="5"></s-input>
          </s-form-item>
        </s-form>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="dialogSave">确定</s-button>
        <s-button type="cancel" @click="dialogClose">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
import $axios from 'sunflower-ajax';
import {Validaters} from 'sunflower-common-utils';

export default {
  data() {
    return {
      curItem: {},
      selectOptionsObj: {
        cmdbOrgList: [], // 所属机构
        sysUserList: [], // 维护人
        locationList: [], // 位置
        protocolList: [], // 配置弹框中的协议名称
        accountType: [] // 配置弹框中的角色名称
      },
      lifecycleList: [],
      markDialogFlag: false,
      uuid: '',
      assetUuid: '',
      markDialogForm: {
        mark: ''
      },
      markDialogFormRules: {
        mark: [Validaters.Max(500)]
      }
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
      }
    }
  },
  watch: {
    assetUuid(val) {
      if (!val) return null;
      this.getLifecycleList(this.assetUuid)
    }
  },
  created() {
    this.getOptions();
    if (this.$route.name === 'AssetsAll_assetEdit') {
      this.assetUuid = this.editAssetUuid
    } else {
      this.assetUuid = this.addAssetUuid
      if (!this.assetUuid) return null;
    }
  },
  methods: {
    getOptions() {
      // 所属机构，维护人，位置，协议名称，资产状态，自定义属性下拉框，附件属性
      $axios.post('/resourcemanager/assetmanager/itasset/findAddSelect').then(({ data }) => {
        this.selectOptionsObj = data;
      });
    },
    getLifecycleList(uuid) { // 获取管理配置列表
      $axios.get(`/resourcemanager/assetmanager/itasset/getAssetLifeByItUuid/${uuid}`).then(({ data }) => {
        this.lifecycleList = data
      });
    },
    // 顶部操作-------------------------------------------------------
    validAssetAddForm(item) {
      if (this.addAssetUuid === '') {
        this.$message({showClose: true, message: '请先正确填写资产信息', type: 'warning'});
        return
      }
      this.curItem = item;
      this.openMark();
    },
    openMark() {
      this.markDialogFlag = true
    },
    dialogSave() {
      this.$refs.markDialogForm.validate((valid) => {
        if (!valid) {
          return false;
        }
        const params = {
          status: this.curItem.uuid,
          itcompUuid: this.assetUuid,
          remark: this.markDialogForm.mark
        }
        $axios.post('/resourcemanager/assetmanager/itasset/saveAssetLife', params).then(({ data }) => {
          if (data === 'true') {
            this.$message({ showClose: true, message: '保存成功', type: 'success' });
            this.getLifecycleList(this.assetUuid)
            this.dialogClose();
          } else {
            this.$message({ showClose: true, message: '保存失败', type: 'error' });
          }
        });
      })
    },
    dialogClose() {
      this.markDialogFlag = false
      this.markDialogForm = {
        mark: ''
      }
    }
  }
}
</script>

<style lang="stylus">
.lifecycle-set {
  .s-button {
    margin-right: 5px;
  }

  .s-textarea {
    textarea {
      height: 200px;
    }
  }

  .tool-bar {
    margin-top: 10px;
  }

  .left-btn {
    margin-bottom: 10px;
  }

  .s-search-group {
    .s-select, .s-date-editor-datetimerange.s-input {
      width: 175px;
    }

    .s-form-item-label {
      text-align: center;
    }
  }
}
</style>
