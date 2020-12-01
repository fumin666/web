<template>
<div class="categoryDialog">
       <s-form :model="configForm"
               :rules="configRules"
               ref="configForm"
               label-width="180px"
               class="config"
               label-position="right"
       >
         <s-form-item>
           <s-radio-group v-model="version" @change="selectChange">
             <s-radio class="radio" :label="1">IT资产</s-radio>
           </s-radio-group>
         </s-form-item>
         <s-form-item label="分类" prop="catogeryUuid" v-if="this.editData === undefined">
           <s-select v-model="configForm.catogeryUuid" style="width:150px" @change="select">
             <s-option v-for="item in selData" :key="item.value" :value="item.uuid" :label="item.name"></s-option>
           </s-select>
         </s-form-item>
         <s-form-item label="上级配置项类型" prop="parentUuid" v-if="this.editData === undefined">
        <s-select v-model="configForm.parentUuid" style="width:150px" @change="upSelect" >
             <s-option v-for="item in parUuid" :key="item.uuid" :value="item.uuid" :label="item.name"></s-option>
           </s-select>
         </s-form-item>
         <s-form-item label="配置项类型名称" prop="citypeName">
           <s-input v-model.trim="configForm.citypeName" class="coninput" :maxlength="30"></s-input>
         </s-form-item>
         <s-form-item label="描述" prop="citypeDescription">
           <s-input v-model="configForm.citypeDescription" class="coninput"  type="textarea"></s-input>
         </s-form-item>
       </s-form >
     </div>
</template>

<script type="text/ecmascript-6">
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils'
  import {cloneDeep} from 'lodash'
  export default {
   data() {
    return {
      Relateuuid: '',
      TagsData: [],
      inputVisible: false,
      boxData: [],
      selectModel: {},
      citypeOptions: [],
      typeName: '',
      citypeValue: '',
      Relatevalue: '',
      RelateDialog: false,
      relateData: [],
      selData: [],
      parselUuid: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      parUuid: [],
      upSelectUuid: [],
      currentName: '',
      configForm: {
        catogeryUuid: '',
        parentUuid: '',
        citypeName: '',
        citypeDescription: ''
      },
      configRules: {
        citypeName: [Validaters.NotNull],
        citypeDescription: [Validaters.Max(30)]

      },
      editcitypeName: '',
      selectCaUuid: [],
      selectCadatalist: [],
      citypeData: [],
      disabled: false,
      version: 1
     }
   },
    created() {
      this.getTreeData(() => {
        if (this.editData === undefined) {
          this.selList();
          this.disabled = false
          this.upSelect(this.configForm.parentUuid)
        } else {
          this.disabled = true
          this.selList()
          $axios.post(`/resourcemanager/configurationmanage/citype/getcitypeDetail/${this.editData.uuid}`).then((res) => {
            let edit = res.data
            $axios.post('/resourcemanager/configurationmanage/citype/allnocategeoryTree').then(({data}) => {
              data.forEach((item, index) => {
                if (item.name.indexOf('文档') !== -1) {
                  data.splice(index, 1)
                }
              })
              this.citypeOptions = data;
            })
            this.configForm.parentUuid = edit.parentUuid
            this.configForm.catogeryUuid = edit.catogeryUuid
            this.configForm.citypeName = edit.citypeName
            this.currentName = edit.citypeName
            this.editcitypeName = cloneDeep(edit.citypeName)
            this.configForm.citypeDescription = edit.citypeDescription
            this.select()
            this.upSelect(this.configForm.parentUuid)
          })
        }
      })
      this.axiosCitypeTree()
    },
    methods: {
      getTreeData(cb) {
        function cycle (arr) {
          arr.forEach(item => {
            item.name = item.name.replace(/\(.+\)/g, '');
            item.description = item.node.citypeDescription;
            if (item.childrenList.length !== 0) {
              item.children = item.childrenList;
              cycle(item.children);
            }
          });
        }
        $axios.post('/resourcemanager/configurationmanage/citype/getCountCitypeTree').then((res) => {
          cycle(res.data);
          $axios.post('/resourcemanager/configurationmanage/citype/nonitlist').then(({data}) => {
            let obj = {
              name: '非IT资产',
              node: {
                isDefault: null,
                isDeleted: null
              },
              uuid: '4183b013c2b648b2bb4c6a011324316b',
              children: []
            };
            let a = data.slice(1, data.length)
            a.slice(0, 2).forEach(item => {
              obj.children.push({
                name: item.citypeName,
                node: {
                  isDeleted: null
                },
                uuid: item.uuid,
                description: item.citypeDescription
              })
            });
            a.slice(2, a.length).forEach(item => {
              obj.children.push({
                name: item.citypeName,
                node: {
                  isDeleted: 1,
                  isDefault: 0
                },
                uuid: item.uuid,
                description: item.citypeDescription
              })
            });
            res.data.push(obj);
            this.selectCaUuid = res.data
            cb()
          })
        })
      },
      selList () {
        if (this.version === 1) {
          this.selData = this.selectCaUuid.slice(0, this.selectCaUuid.length - 1);
          this.configForm.catogeryUuid = this.selData[0].uuid
          this.select()
        } else {
          this.selData = this.selectCaUuid.slice(this.selectCaUuid.length - 1, this.selectCaUuid.length);
          this.configForm.catogeryUuid = this.selData[0].uuid
        }
      },
      selectChange () {
        this.selList()
      },
      select () {
        let uuid = this.configForm.catogeryUuid
        this.parselUuid = this.selData.filter(function (item) {
          return item.uuid === uuid
        })
        for (let i = 0; i < this.parselUuid.length; i++) {
          let arr = this.parselUuid[i]
          this.parUuid = arr.childrenList
        }
        for (let i = 0; i < this.parUuid.length; i++) {
          if (this.parUuid[i].childrenList.length !== 0) {
            let parArr = this.parUuid[i].childrenList
            // this.parUuid.push(parArr)
            for (let j = 0; j < parArr.length; j++) {
              let b = parArr[j]
              this.parUuid.push(b)
            }
          }
        }
        if (this.editData === undefined) {
         this.configForm.parentUuid = this.parUuid[0].uuid
         }
      },
      upSelect(uuid) {
        for (let i = 0; i < this.parUuid.length; i++) {
          if (uuid === this.parUuid[i].uuid) {
            this.upSelectUuid = this.parUuid[i].childrenList.map(item => item.name.trim())
            break
          }
        }
        if (this.currentName) {
          this.upSelectUuid = this.upSelectUuid.filter(name => name !== this.currentName.trim())
        }
      },
      axiosCitypeTree() {
        // 选项卡1：资产类型下拉树
        $axios.get('/resourcemanager/configurationmanage/citype/allnocategeoryTree').then(({data}) => {
          data.forEach((item, index) => {
            if (item.name.indexOf('文档') !== -1) {
              data.splice(index, 1)
            }
          })
          this.citypeOptions = data;
        });
      }
    },
    props: {
      Type: {
        type: String,
        default: 'add'
        },
      editData: {
      type: Object
      }
      }
 }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.categoryDialog
   max-height: 300px
</style>
