<template>
  <section class="tvwall-index">
    <s-row class="setting">
      <s-col :span="12">
        <s-form label-width="120px">
          <s-form-item label="页面刷新周期" required>
            <s-input v-model="tVWallRefreshTime.configValue"></s-input>
            <label class="s-form-item-unit">小时</label>
            <s-button @click="saveTimeA">保存</s-button>
          </s-form-item>
        </s-form>
      </s-col>
      <s-col :span="12">
        <s-form label-width="140px">
          <s-form-item label="实时信息请求周期" required>
            <s-input v-model="tVWallRequestTime.configValue"></s-input>
            <label class="s-form-item-unit">秒</label>
            <s-button @click="saveTimeB">保存</s-button>
          </s-form-item>
        </s-form>
      </s-col>
    </s-row>
    <s-row style="margin-bottom:10px">
      <s-button icon="plus" @click="addPage">添加</s-button>
      <s-button icon="batch-del" @click="delPage">批量删除</s-button>
    </s-row>
    <s-table-page :data="list"
                  @selection-change="handlePageSelection"
    >
      <s-table-column type="selection" width="45"></s-table-column>
      <s-table-column label="页面名称" prop="pageName" show-overflow-tooltip></s-table-column>
      <s-table-column label="区块数量" prop="cellNum"></s-table-column>
      <s-table-column label="是否显示logo">
        <template slot-scope="scope">
          <s-switch v-model="scope.row.isShowLogo"
                    size="small"
                    :active-value="1"
                    :inactive-value="0"
                    :disabled="switchBoolean"
                    @change="rowSwitchChange(scope.row)">
          </s-switch>
        </template>
      </s-table-column>
      <s-table-column label="备注" prop="remark" show-overflow-tooltip></s-table-column>
      <s-table-column label="操作">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看" @click="showPage(scope.row.uuid)"></i>
          <i class="iconfont icon-edit" title="修改" @click="editPage(scope.row)"></i>
          <i class="iconfont icon-delete" title="删除" @click="delPage(scope.row.uuid)"></i>
        </template>
      </s-table-column>
    </s-table-page>

    <!--添加页面-->
    <s-dialog
      v-model="bloomAdd"
      v-if="bloomAdd"
      title="添加">
      <add-page ref="add" @addPost="addPost"></add-page>
      <template slot="footer">
        <s-button @click="addPageOk">确定</s-button>
        <s-button type="cancel" @click="bloomAdd = false">取消</s-button>
      </template>
    </s-dialog>

    <!--编辑页面-->
    <s-dialog
      v-model="bloomEdit"
      v-if="bloomEdit"
      title="编辑页面">
      <edit-page ref="edit" :info="editRow" @editPost="editPost"></edit-page>
      <template slot="footer">
        <s-button @click="editPageOk">确定</s-button>
        <s-button type="cancel" @click="bloomEdit = false">取消</s-button>
      </template>
    </s-dialog>

  </section>
</template>

<script>
  import { batchUuid, Validaters } from 'sunflower-common-utils'
  import $axios from 'sunflower-ajax'
  import AddPage from './AddPage'
  import EditPage from './EditPage'
  let {isPosInt} = Validaters

  export default {
    components: {
      AddPage,
      EditPage
    },
    data() {
      return {
        tVWallRefreshTime: {
          configValue: '24'
        },
        tVWallRequestTime: {
          configValue: '180'
        },
        list: [],
        selectedPages: [],
        editRow: {},

        bloomAdd: false,
        bloomEdit: false,
        switchBoolean: false
      }
    },
    methods: {
      getList() {
        $axios.get('/systemmanager/sysConfig/getStaticTVWallData').then((res) => {
          if (res.data && typeof res.data === 'object') {
            this.list = res.data.sysTvWallList;
            this.tVWallRefreshTime = res.data.tVWallRefreshTime;
            this.tVWallRequestTime = res.data.tVWallRequestTime;
          }
        });
      },
      saveTimeA() {
        if (isPosInt(this.tVWallRefreshTime.configValue) && this.tVWallRefreshTime.configValue > 0 && this.tVWallRefreshTime.configValue < 25) {
          $axios.post('/systemmanager/sysConfig/updateSysConfig', this.tVWallRefreshTime).then((res) => {
            if (res.data && res.data === 'success') {
              this.$message({type: 'success', message: '修改页面刷新周期成功'});
              this.getList();
            }
          });
        } else {
          this.$message({type: 'error', message: '请输入1~24的正整数'});
        }
      },
      isPosInt(num) {
        let reg = new RegExp(/^[1-9][0-9]*$/);
        return reg.test(num);
      },
      saveTimeB() {
        if (this.isPosInt(this.tVWallRequestTime.configValue) && this.tVWallRequestTime.configValue >= 180 && this.tVWallRequestTime.configValue <= 100000) {
          $axios.post('/systemmanager/sysConfig/updateSysConfig', this.tVWallRequestTime).then((res) => {
            if (res.data && res.data === 'success') {
              this.$message({type: 'success', message: '修改实时信息请求周期成功'});
              this.getList();
            }
          });
        } else {
          this.$message({type: 'error', message: '请输入介于180到100000的正整数'});
        }
      },

      addPage() {
        this.bloomAdd = true;
      },
      addPageOk() {
        this.$refs.add.beforeAdd();
      },
      addPost(data) {
        $axios.post('/systemmanager/sysConfig/saveSysTvWall', data).then((res) => {
          if (res.data && res.data === 'success') {
            this.$message({type: 'success', message: '添加成功'});
            this.getList();
            this.bloomAdd = false;
          }
        });
      },

      delPage(uuid) {
        if (typeof uuid === 'object' && this.selectedPages.length === 0) {
          this.$message({type: 'warning', message: '请选择要删除的数据'});
          return false;
        }
        this.$confirm('是否确定删除数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = [];
          if (typeof uuid === 'string') {
            data.push(uuid);
          } else {
            data = batchUuid('uuid', this.selectedPages);
          }
          $axios.post('/systemmanager/sysConfig/deleteSysTvWall', data).then((res) => {
            if (res.data && res.data === 'success') {
              this.$message({type: 'success', message: '删除成功'});
              this.getList();
            }
          });
        }).catch(() => {});
      },

      editPage(row) {
        this.editRow = row;
        this.bloomEdit = true;
      },
      editPageOk() {
        this.$refs.edit.beforeAdd();
      },
      editPost(data) {
        $axios.post('/systemmanager/sysConfig/updateTvWall', data).then((res) => {
          if (res.data && res.data === 'success') {
            this.$message({type: 'success', message: '编辑成功'});
            this.getList();
            this.bloomEdit = false;
          }
        });
      },

      handlePageSelection(val) {
        this.selectedPages = val;
      },
      showPage(uuid) {
        const {href} = this.$router.resolve({
          path: '/staticTvWall',
          query: {
            tvUrl: uuid
          }
        })
        window.open(href, '_blank')
      },

      rowSwitchChange (row) {
        this.switchBoolean = true;
        $axios.post('/systemmanager/sysConfig/updateTvWall', row).then(res => {
          if (res.data && res.data === 'success') {
            this.$message({type: 'success', message: '编辑成功'});
          } else {
            this.$message({type: 'error', message: '编辑失败'});
            this.getList();
          }
          this.switchBoolean = false;
        });
      }
    },
    created() {
      this.getList();
    }
  }
</script>
