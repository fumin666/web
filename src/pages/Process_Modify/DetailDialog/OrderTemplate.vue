<template>
  <section id="orderTemplate">
    <s-scrollbar wrap-style="max-height:500px;">
      <div>
        <div class="templateTable">
          <s-table-page
            :data="templateLists"
            :header-search="getSearchDef()">
            <s-table-column prop="templateDetail.serialCode" label="编号">
            </s-table-column>
            <s-table-column label="简要描述">
              <template slot-scope="scope">
                <span class="briefDesc" v-text="scope.row.briefDesc" @click="getTempDetail(scope.row.uuid)"></span>
              </template>
            </s-table-column>
            <s-table-column prop="detailDesc" label="详细描述">
            </s-table-column>
          </s-table-page>
        </div>

        <div class="templateDetail">
          <div style="margin-bottom: 15px;">详细信息：</div>
          <s-form ref="templateDetail" :model="templateDetail" label-width="110px">
            <s-row>
              <s-col >
                <s-form-item label="变更编号：">
                  <s-input v-model="templateDetail.serialCode" disabled></s-input>
                </s-form-item></s-col>
            </s-row>
            <s-row :gutter="15">
              <s-col span="12">
                <s-form-item label="简要描述：">
                  <s-input v-model="templateDetail.briefDesc" type="textarea" :rows="3" disabled></s-input>
                </s-form-item></s-col>
              <s-col span="12">
                <s-form-item label="详细描述：">
                  <s-input v-model="templateDetail.detailDesc" type="textarea" :rows="3" disabled></s-input>
                </s-form-item>
              </s-col>
            </s-row>
            <s-row :gutter="15">
              <s-col span="12">
                <s-form-item label="分类一级：">
                  <s-select v-model="templateDetail.categoryFirst" disabled>
                    <!--<s-option label=""></s-option>-->
                  </s-select>
                </s-form-item>
              </s-col>
              <s-col span="12">
                <s-form-item label="变更经理组：">
                  <s-select v-model="templateDetail.managerGroup" disabled>
                    <!--<s-option label=""></s-option>-->
                  </s-select>
                </s-form-item>
              </s-col>
            </s-row>
            <s-row :gutter="15">
              <s-col span="12">
                <s-form-item label="分类二级：">
                  <s-select v-model="templateDetail.categorySecond" disabled>
                    <!--<s-option label=""></s-option>-->
                  </s-select>
                </s-form-item>
              </s-col>
              <s-col span="12">
                <s-form-item label="变更经理：">
                  <s-select v-model="templateDetail.managerUser" disabled>
                    <!--<s-option label=""></s-option>-->
                  </s-select>
                </s-form-item>
              </s-col>
            </s-row>
            <s-row :gutter="15">
              <s-col span="12">
                <s-form-item label="分类三级：">
                  <s-select v-model="templateDetail.categoryThird" disabled>
                    <!--<s-option label=""></s-option>-->
                  </s-select>
                </s-form-item>
              </s-col>
              <s-col span="12">
                <s-form-item label="变更管理员组：">
                  <s-select v-model="templateDetail.adminGroup" disabled>
                    <!--<s-option label=""></s-option>-->
                  </s-select>
                </s-form-item>
              </s-col>
            </s-row>
            <s-row :gutter="15">
              <s-col span="12">
                <s-form-item label="风险等级：">
                  <s-select v-model="templateDetail.riskLevel" disabled>
                    <!--<s-option label=""></s-option>-->
                  </s-select>
                </s-form-item>
              </s-col>
              <s-col span="12">
                <s-form-item label="变更管理员：">
                  <s-select v-model="templateDetail.adminUser" disabled>
                    <!--<s-option label=""></s-option>-->
                  </s-select>
                </s-form-item>
              </s-col>
            </s-row>
            <s-row :gutter="15">
              <s-col span="12">
                <s-form-item label="变更路径：">
                  <s-select v-model="templateDetail.changePath" disabled>
                    <!--<s-option label=""></s-option>-->
                  </s-select>
                </s-form-item>
              </s-col>
              <s-col span="12">
                <s-form-item label="变更环境：">
                  <s-select v-model="templateDetail.changeEnvironment" disabled>
                    <!--<s-option label=""></s-option>-->
                  </s-select>
                </s-form-item>
              </s-col>
            </s-row>
          </s-form>
        </div>
      </div>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  export default{
    data() {
      return {
        templateLists: [],
        templateDetail: {}
      }
    },
    methods: {
      getSearchDef() {
        return {
          width: 16,
          offset: 8,
          placeholder: '请输入模板简要描述查询',
          searchProps: ['briefDesc']
        }
      },
      searchTemplate() {
        $axios.get('/itilChangeOrder/getChangeOrderTemplate').then(({data}) => {
          if (data && data instanceof Array) {
            this.templateLists = data
          }
        })
      },
      getTempDetail(uuid) {
        $axios.get(`/itilChangeOrder/getChangeOrderDetail/${uuid}`).then(({data}) => {
          if (data) {
            this.templateDetail = data
          } else {
            this.$message({
              type: 'warning',
              message: '获取数据失败，请重试！'
            })
          }
        })
      }
    },
    created() {
      this.searchTemplate()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #orderTemplate
    .leftInput
      display inline-block
      width 90%
    .briefDesc
      color #1675cb
      text-decoration under-line
    .templateTable
      float left
      padding-right 10px
      width 42%;
    .templateDetail
      float left
      padding-left 10px
      width 55%
      border-left 1px solid #667480
</style>
