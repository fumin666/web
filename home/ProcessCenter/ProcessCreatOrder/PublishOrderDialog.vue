<template>
  <section>
    <h3 class="orderTitle">创建发布单</h3>
    <s-scrollbar wrap-style="height: 400px;">
      <s-form
        class="publishOrderDialog"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px">
        <s-form-item label="发布单号">
          <span>{{form.serialCode}}</span>
        </s-form-item>
        <s-form-item label="受益人公司" prop="benefitCompany">
          <s-select v-model="form.benefitCompany" @change="changeCompany" filterable clearable>
            <s-option v-for="item in benefitCompanyArr" :key="item.uuid" :label="item.departName" :value="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="受益人姓名" prop="benefitPersonName">
          <s-select v-model="form.benefitPersonName" filterable clearable>
            <s-option v-for="item in benefitPersonNameArr" :key="item.uuid" :label="item.userRealName" :value="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="简要描述" prop="briefDesc">
          <s-input type="textarea" v-model="form.briefDesc"></s-input>
        </s-form-item>
        <s-form-item label="详细描述">
          <s-input type="textarea" v-model="form.detailDesc"></s-input>
        </s-form-item>
        <s-form-item label="发布分级" prop="publishLevel">
          <s-select v-model="form.publishLevel">
            <s-option v-for="item in publishLevelOptions" :key="item.value" :label="item.label" :value="item.value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="业务理由" prop="businessReason">
          <s-select v-model="form.businessReason">
            <s-option v-for="item in businessReasonOptions" :key="item.value" :label="item.label" :value="item.value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="发布类型" prop="publishType">
          <s-select v-model="form.publishType">
            <s-option v-for="item in publishTypeOptions" :key="item.value" :label="item.label" :value="item.value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="应用系统">
          <s-input v-model="form.appSystem"></s-input>
        </s-form-item>
        <s-form-item label="目标完成时间" prop="planFinishTime">
          <s-date-picker v-model="planFinishTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" @change="handleTimeChange" :picker-options="pickerOptions"></s-date-picker>
        </s-form-item>
        <s-form-item label="分类一级" prop="categoryFirst">
          <s-cascader
            style="width: calc(100% - 49px)"
            v-model="categoryFirstValue"
            @change="handleCFChange"
            :options="categoryFirstOptions"
            :props="categoryFirstProps"
            expand-trigger="hover"/>
        </s-form-item>
        <s-form-item label="分类二级" prop="categorySecond">
          <s-select v-model="form.categorySecond" @change="handleCSChange">
            <s-option v-for="item in categorySecondOptions" :key="item.uuid" :label="item.categoryName" :value="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="分类三级">
          <s-select v-model="form.categoryThird">
            <s-option v-for="item in categoryThirdOptions" :key="item.uuid" :label="item.categoryName" :value="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="影响度" prop="impactLevel">
          <s-select v-model="form.impactLevel">
            <s-option v-for="item in impactLevelOptions" :key="item.value" :label="item.label" :value="item.value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="紧急性" prop="emergencyLevel">
          <s-select v-model="form.emergencyLevel">
            <s-option v-for="item in emergencyLevelOptions" :key="item.value" :label="item.label" :value="item.value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="优先级" prop="priorityLevel">
          <s-select v-model="form.priorityLevel">
            <s-option v-for="item in priorityLevelOptions" :key="item.value" :label="item.label" :value="item.value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="风险级别" prop="riskLevel">
          <s-select v-model="form.riskLevel">
            <s-option v-for="item in riskLevelOptions" :key="item.value" :label="item.label" :value="item.value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="发布经理组" prop="managerGroup">
          <s-select v-model="form.managerGroup" @change="handleMGChange">
            <s-option v-for="item in managerGroupOptions" :key="item.uuid" :label="item.groupName" :value="item.uuid" />
          </s-select>
        </s-form-item>
        <s-form-item label="发布经理" prop="managerUser">
          <s-select v-model="form.managerUser">
            <s-option v-for="item in managerUserOptions" :key="item.uuid" :label="item.userRealName" :value="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="发布协调员组" prop="coordinateGroup">
          <s-select v-model="form.coordinateGroup" @change="handleCGChange">
            <s-option v-for="item in coordGroupOptions" :key="item.uuid" :label="item.groupName" :value="item.uuid" />
          </s-select>
        </s-form-item>
        <s-form-item label="发布协调员" prop="coordinateUser">
          <s-select v-model="form.coordinateUser">
            <s-option v-for="item in coordUserOptions" :key="item.uuid" :label="item.userRealName" :value="item.uuid" />
          </s-select>
        </s-form-item>
        <s-form-item label="附件信息">
          <s-upload
            class="upload"
            ref="upload"
            multiple
            :action="workInfoUrl"
            :on-success="uploadSuccess"
            :on-remove="uploadRemove"
            :file-list="fileListUpload"
            :with-credentials="true">
            <s-button slot="trigger" icon="export">上传</s-button>
          </s-upload>
        </s-form-item>
      </s-form>
    </s-scrollbar>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import { map2Arr } from 'sunflower-common-utils'

  export default {
    data() {
      return {
        form: {
          serialCode: '',           // 发布单号
          benefitCompany: '',       // 受益公司
          benefitPersonName: '',    // 受益人姓名
          briefDesc: '',            // 简要描述
          detailDesc: '',           // 详细描述
          publishLevel: '',         // 发布分级
          businessReason: '',       // 业务理由
          publishType: '',          // 发布类型
          appSystem: '',            // 应用系统
          planFinishTime: '',       // 目标完成时间
          companyUuid: '',          // 公司UUID
          categoryFirst: '',        // 分类一级UUID
          categorySecond: '',       // 分类二级UUID
          categoryThird: '',        // 分类三级UUID
          impactLevel: '',          // 影响度
          emergencyLevel: '',       // 紧急性
          priorityLevel: '',        // 优先级
          riskLevel: '',            // 风险级别
          managerGroup: '',         // 发布经理组UUID
          managerUser: '',          // 发布经理UUID
          coordinateGroup: '',      // 发布协调员组UUID
          coordinateUser: '',       // 发布协调员UUID,
          attachuuid: ''            // 附件
        },
        rules: {
          benefitCompany: [
            { required: true, message: '请输入受益人公司', trigger: 'blur' }
          ],
          benefitPersonName: [
            { required: true, message: '请输入受益人姓名', trigger: 'blur' }
          ],
          briefDesc: [
            { required: true, message: '请输入简要描述', trigger: 'blur' },
            { max: 100, message: '长度不能超过100个字符', trigger: 'change' }
          ],
          publishLevel: [
            { required: true, message: '请选择发布分级', trigger: 'change' }
          ],
          businessReason: [
            { required: true, message: '请选择业务理由', trigger: 'change' }
          ],
          publishType: [
            { required: true, message: '请选择发布类型', trigger: 'change' }
          ],
          planFinishTime: [
            { type: 'number', required: true, message: '请选择目标完成时间', trigger: 'blur' }
          ],
          categoryFirst: [
            { required: true, message: '请选择分类一级', trigger: 'change' }
          ],
          categorySecond: [
            { required: true, message: '请选择分类二级', trigger: 'change' }
          ],
          impactLevel: [
            { required: true, message: '请选择影响度', trigger: 'change' }
          ],
          emergencyLevel: [
            { required: true, message: '请选择紧急性', trigger: 'change' }
          ],
          priorityLevel: [
            { required: true, message: '请选择优先级', trigger: 'change' }
          ],
          riskLevel: [
            { required: true, message: '请选择风险级别', trigger: 'change' }
          ],
          coordinateGroup: [
            { required: true, message: '请选择发布协调员组', trigger: 'change' }
          ],
          coordinateUser: [
            { required: true, message: '请选择发布协调员', trigger: 'change' }
          ]
        },
        workInfoUrl: `${$axios.basePath()}/fileUpload/uploadItilattach`, // 附件列表上传地址
        fileList: [],
        fileListUpload: [],
        benefitCompanyArr: [],      // 受益人公司
        personNameArr: [],          // 受益人姓名（过滤前）
        benefitPersonNameArr: [],   // 受益人姓名 （过滤后）
        planFinishTime: '',         // 目标完成时间
        publishLevelOptions: [],    // 发布分级
        businessReasonOptions: [],  // 业务理由
        publishTypeOptions: [],     // 发布类型
        impactLevelOptions: [],     // 影响度
        emergencyLevelOptions: [],  // 紧急性
        priorityLevelOptions: [],   // 优先级
        riskLevelOptions: [],       // 风险级别
        categoryFirstOptions: [],   // 分类一级
        categoryFirstValue: [],
        categoryFirstProps: {
          label: 'name',
          value: 'uuid',
          children: 'childrenList'
        },
        categorySecondOptions: [],  // 分类二级
        categoryThirdOptions: [],   // 分类三级
        managerGroupOptions: [],    // 发布经理组
        managerUserOptions: [],     // 发布经理
        coordGroupOptions: [],      // 协调员组
        coordUserOptions: [],       // 协调员
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 86400000;
          }
      }        // 限制
      }
    },
    created() {
      this.getInitData();
    },
    methods: {
      async getInitData() {
        // 获取创建发布工单下拉框原始数据
        let response = await $axios.get('/itilPublishOrder/getAllDepartInfo');
        this.benefitCompanyArr = response.data;
        this.form.benefitCompany = this.benefitCompanyArr[0].uuid;
        let msg = await $axios.get('/itilPublishOrder/getAllUserInfo');
        this.personNameArr = msg.data;
        this.filterUser(msg.data);
        $axios.get('/itilPublishOrder/getPublishOrderInitData').then((res) => {
          this.form.serialCode = res.data.serialCode;
          // 发布分级
          this.publishLevelOptions = map2Arr(res.data.publishLevelMap);
          this.form.publishLevel = this.publishLevelOptions.length > 0 ? this.publishLevelOptions[0].value : '';
          // 业务理由
          this.businessReasonOptions = map2Arr(res.data.businessReasonMap);
          this.form.businessReason = this.businessReasonOptions.length > 0 ? this.businessReasonOptions[0].value : '';
          // 发布类型
          this.publishTypeOptions = map2Arr(res.data.publishTypeMap);
          this.form.publishType = this.publishTypeOptions.length > 0 ? this.publishTypeOptions[0].value : '';
          // 影响度
          this.impactLevelOptions = map2Arr(res.data.impactLevelMap);
          this.form.impactLevel = this.impactLevelOptions.length > 0 ? this.impactLevelOptions[this.impactLevelOptions.length - 1].value : '';
          // 紧急性
          this.emergencyLevelOptions = map2Arr(res.data.emergencyLevelMap);
          this.form.emergencyLevel = this.emergencyLevelOptions.length > 0 ? this.emergencyLevelOptions[this.emergencyLevelOptions.length - 1].value : '';
          // 优先级
          this.priorityLevelOptions = map2Arr(res.data.priorityLevelMap);
          this.form.priorityLevel = this.priorityLevelOptions.length > 0 ? this.priorityLevelOptions[0].value : '';
          // 风险级别
          this.riskLevelOptions = map2Arr(res.data.riskLevelMap);
          this.form.riskLevel = this.riskLevelOptions.length > 0 ? this.riskLevelOptions[0].value : '';
        });
        // 获取分类一级
        let resCF = await $axios.get('/ItilCommonWorkflow/getCompanyAndCategory/5');
        this.categoryFirstOptions = resCF.data;
      },
      // 获取分类二级
      async getCategorySecond() {
        let resCS = await $axios.post('/ItilCommonWorkflow/getItilCategorySelect', {
          categoryFirst: this.categoryFirstValue[1],    // 分类一级UUID
          companyUuid: this.categoryFirstValue[0],      // 公司UUID
          ownerType: '5'                                // 类型：5代表发布
        });
        this.categorySecondOptions = resCS.data;
        if (resCS.data.length > 0) {
          this.form.categorySecond = resCS.data[0].uuid;
          this.handleCSChange(resCS.data[0].uuid);
        }
      },
      // 获取分类三级
      async getCategoryThird() {
        let resCT = await $axios.post('/ItilCommonWorkflow/getItilCategorySelect', {
          categoryFirst: this.categoryFirstValue[1],    // 分类一级UUID
          companyUuid: this.categoryFirstValue[0],      // 公司uuid
          ownerType: '5',                               // 类型：5代表发布
          categorySecond: this.form.categorySecond      // 分类二级UUID
        });
        this.categoryThirdOptions = resCT.data;
      },
      // 获取发布经理组, params => 公司UUID
      async getManagerGroup() {
        let resMG = await $axios.get(`/itilPublishOrder/getAllPublishMangerGroup/${this.categoryFirstValue[0]}`);
        this.managerGroupOptions = resMG.data;
      },
      // 获取发布经理组 下 发布经理用户, params => 发布经理组UUID
      async getManagerUser() {
        let resMU = await $axios.get(`/itilPublishOrder/getAllPubMangerByGroup/${this.form.managerGroup}`);
        this.managerUserOptions = resMU.data;
      },
      // 获取发布协调员组, params => 公司UUID
      async getCoordGroup() {
        let resCG = await $axios.get(`/itilPublishOrder/getAllPublishCoordGroup/${this.categoryFirstValue[0]}`)
        this.coordGroupOptions = resCG.data;
        if (resCG.data.length > 0) {
          this.form.coordinateGroup = resCG.data[0].uuid;
          this.handleCGChange(resCG.data[0].uuid);
        }
      },
      // 获取发布协调员, params => 发布协调员组UUID
      async getCoordUser() {
        let resCU = await $axios.get(`/itilPublishOrder/getAllPubCoordByGroup/${this.form.coordinateGroup}`);
        this.coordUserOptions = resCU.data;
        if (resCU.data.length > 0) {
          this.form.coordinateUser = resCU.data[0].uuid;
        }
      },
      // 根据受益人公司过滤受益人姓名
      filterUser(val) {
        if (val.length > 0) {
          for (let i in val) {
            if (val[i].departUuid === this.form.benefitCompany) {
              this.benefitPersonNameArr.push(val[i])
            }
          }
        }
      },
      changeCompany(val) {
        if (val !== '') {
          this.form.benefitPersonName = '';
          this.benefitPersonNameArr = [];
          for (let i in this.personNameArr) {
            if (this.personNameArr[i].departUuid === val) {
              this.benefitPersonNameArr.push(this.personNameArr[i]);
            }
          }
        }
      },
      // 一级分类Change事件
      handleCFChange(val) {
        if (val.length > 0) {
          this.form.companyUuid = val[0];
          this.form.categoryFirst = val[1];
          this.getCategorySecond();
          this.getManagerGroup();
          this.getCoordGroup();
        }
        // 修改一级分类时，清空二级、三级、发布经理组、发布经理、协调员组、协调员
        this.form.categorySecond = '';
        this.form.categoryThird = '';
        this.form.managerGroup = '';
        this.form.managerUser = '';
        this.form.coordinateGroup = '';
        this.form.coordinateUser = '';
      },
      // 二级分类Change事件
      handleCSChange(val) {
        if (val) {
          this.getCategoryThird();
        }
        // 修改二级分类时，清空三级
        this.form.categoryThird = '';
      },
      // 发布经理组Change事件
      handleMGChange(val) {
        if (val) {
          this.getManagerUser();
        }
        // 修改发布经理组时，清空发布经理
        this.form.managerUser = '';
      },
      // 协调员组Change事件
      handleCGChange(val) {
        if (val) {
          this.getCoordUser();
        }
        this.form.coordinateUser = '';
      },
      // 完成时间Change事件
      handleTimeChange(val) {
        if (val) {
          let date = new Date(val);
          this.form.planFinishTime = parseInt(date.getTime() / 1000);
        } else {
          this.form.planFinishTime = '';
        }
      },
      // 附件上传成功
      uploadSuccess(res, file, fileList) {
        this.fileList.push(res);
        let arr = this.fileList.map((item) => item.attachuuid);
        this.form.attachuuid = arr.join(',');
      },
      // 移除上传
      uploadRemove(file, fileList) {
        this.fileList.forEach((itemFile, indexFile) => {
          if (itemFile.attachuuid === file.response.attachuuid) {
            this.fileList.splice(indexFile, 1);
          }
        });
        this.deleteFile([file.response.attachuuid]);
      },
      // 删除附件
      deleteFile(deleteUuid) {
        $axios.post('/ItilCommonWorkflow/itilOrderFileDelete/', deleteUuid).then(({data}) => {
          if (data.state === true) {
            this.$message({type: 'success', message: '删除成功！'});
          } else {
            this.$message({type: 'error', message: '删除失败，请重试！'});
          }
        });
      }
    }
  }
</script>

<style>

</style>
