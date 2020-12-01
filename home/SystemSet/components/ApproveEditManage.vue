<template>
  <div>
    <s-collapse v-model="activeNames" accordion>
      <s-collapse-item title="业务信息" name='1'>
        <s-form label-width="100px" ref="manageEdit" :model="manageEdit" :rules="manageRule" :inline-message="true">
          <s-form-item label="IP" prop="businessIp">
            <s-col span="20">
              <s-input v-model="manageEdit.businessIp" :disabled="ischeck"></s-input>
            </s-col>
          </s-form-item>
          <s-form-item label="名称" prop="businessName">
            <s-col span="20">
              <s-input v-model="manageEdit.businessName" :disabled="ischeck"></s-input>
            </s-col>
          </s-form-item>
          <s-form-item label="签名" prop="secret">
            <s-col span="20">
              <s-input v-model="manageEdit.secret" type="textarea" :disabled="true">
              </s-input>
              <s-button title="生成签名" size="mini" :disabled="ischeck" @click="signature">生成签名</s-button>
            </s-col>
          </s-form-item>
          <s-form-item label="签名状态" prop="secretStatus">
            <s-col span="20">
              <s-switch v-model="manageEdit.secretStatus" :disabled="ischeck" :active-value="1" :inactive-value="0"></s-switch>
            </s-col>
          </s-form-item>
        </s-form>
      </s-collapse-item>
      <s-collapse-item name='2'>
        <template slot="title">
          关联数据库<span class="ipamTitle">（至少选择一条）</span>
        </template>
        <s-table-page ref="manageBaseEdit" style="width: 100%" :data='manageEdit.businessDatabaseInfoList' max-height="200" :header-actions='newPlus()'>
          <s-table-column prop="ip" label="IP" show-overflow-tooltip width="150">
          </s-table-column>
          <s-table-column prop="protocolName" label="协议" show-overflow-tooltip>
          </s-table-column>
          <s-table-column prop="accountName" label="账号" show-overflow-tooltip>
          </s-table-column>
          <s-table-column prop="protocolPort" label="端口" show-overflow-tooltip width="80">
          </s-table-column>
          <s-table-column prop="dbName" label="实例名" show-overflow-tooltip>
          </s-table-column>
          <s-table-column label="操作" show-overflow-tooltip width="80">
            <template slot-scope="scope">
              <i class="iconfont icon-delete" @click="deleteHandle(scope)"></i>
            </template>
          </s-table-column>
        </s-table-page>
      </s-collapse-item>
      <!--编辑业务认证-->

    </s-collapse>
    <s-dialog append-to-body v-model="Dialog" v-if="Dialog" width="600px" title="新增" :modal='false'>
      <s-table-page :data='baseDataList' border @selection-change="select"  max-height="300" ref="base">
        <s-table-column type="selection" width="45">
        </s-table-column>
        <s-table-column prop="ip" label="IP" show-overflow-tooltip width="150">
        </s-table-column>
        <s-table-column prop="protocolName" label="协议" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="accountName" label="账号" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="protocolPort" label="端口" show-overflow-tooltip width="80">
        </s-table-column>
        <s-table-column prop="dbName" label="实例名" show-overflow-tooltip>
        </s-table-column>
      </s-table-page>
      <template slot="footer">
        <s-button @click="saveBase">确定</s-button>
        <s-button type="cancel" @click="Dialog = false">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'

  export default {
    components: {
    },
    data() {
      return {
        Dialog: false,
        activeNames: ['1'],
        selection: [],
        baseDataList: [],
        manageEdit: {
          businessIp: '',
          businessName: '',
          secret: '',
          secretStatus: 0,
          businessDatabaseInfoList: []
        },
        manageRule: {
          secret: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          businessName: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          businessIp: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
            {
              pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/,
              message: 'IP格式不正确',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    props: {
      ApproveEditData: {
        type: Object
      },
      ischeck: {
        type: Boolean,
        default: false
      },
      activeItem: {
        type: Array,
        default: ['1']
      }
    },
    watch: {
      activeItem: function() {
        this.activeNames = this.activeItem
      }
    },
    computed: {

    },
    created() {
      $axios.post('/agentBusinessSystem/getAllBusinessDatabaseInfo').then(({
                                                                             data
                                                                           }) => {
        if (data.length) {
          this.baseDataList = data;
        } else {
          this.baseDataList = [];
        }
      })
      if (this.ApproveEditData !== undefined) { // 编辑
        this.manageEdit = Object.assign({}, this.manageEdit, this.ApproveEditData)
      }
    },
    methods: {
      // 业务系统认证按钮新增
      newPlus() {
        let self = this
        return {
          width: 6,
          actions: [{
            name: '新增',
            click() {
              if (self.ischeck) {
                return
              }
              self.Dialog = true;
              let allarr = self.baseDataList;
              let arr = self.manageEdit.businessDatabaseInfoList;
              arr.forEach(obj1 => {
                allarr.forEach(obj2 => {
                  if (obj1.uuid === obj2.uuid) {
                    self.$nextTick(function () {
                      self.$refs.base.toggleRowSelection(obj2, true)
                    })
                  }
                });
              });
            },
            icon: 'plus'
          }]
        }
      },
      // 确定
      saveBase() {
        this.manageEdit.businessDatabaseInfoList = this.selection;
        this.Dialog = false;
      },
      // 选中的选项
      select(selection) {
        this.selection = selection;
      },
      deleteHandle(scope) {
        if (this.ischeck) {
          return
        }
        this.manageEdit.businessDatabaseInfoList.splice(scope.$index, 1)
      },
      signature() {
        $axios.post('/agentBusinessSystem/createSecret').then(({
                                                                 data
                                                               }) => {
          this.manageEdit.secret = data;
        })
      }
    }
  }
</script>

<style>
  .editFormItem {
    padding-left: 20px;
    margin-bottom: 5px;
  }
</style>
