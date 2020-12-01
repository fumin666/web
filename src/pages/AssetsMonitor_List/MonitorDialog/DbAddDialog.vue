<template>
  <s-dialog v-model="dialogFlag" :title="dbType.title" width="600px" class="dbAddDialog">
    <s-form :model="dbForm" :rules="dbRules" ref="dbForm" label-width="120px">
      <s-form-item :label="dbType.firstRowName" prop="name">
        <s-input v-model="dbForm.name"></s-input>
      </s-form-item>
      <s-form-item label="备注:" prop="comment">
        <s-input v-model="dbForm.comment"></s-input>
      </s-form-item>
      <s-form-item label="敏感:" v-if="!dbEditObj.hasOwnProperty('valId')">
        <s-select v-model="dbForm.level">
          <s-option label="低" value="0"></s-option>
          <s-option label="中" value="1"></s-option>
          <s-option label="高" value="2"></s-option>
        </s-select>
      </s-form-item>
    </s-form>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';

  export default {
    data() {
      return {
        dialogFlag: false,
        dbType: {
          title: '',
          firstRowName: ''
        },
        dbForm: {
          name: '',
          comment: '',
          level: '0'
        },
        dbRules: {
          name: [
          Validaters.NotNull,
          {max: 64, message: '长度不能超过64', trigger: 'blur'}
          ],
          comment: [{max: 255, message: '长度不能超过255', trigger: 'blur'}]
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      dbAddObj: {
        type: Object,
        require: true
      },
      dbEditObj: {
        type: Object
      }
    },
    created() {
      if (Object.keys(this.dbEditObj).length > 0) {
        Object.assign(this.dbForm, this.dbEditObj);
        this.dbForm.level = String(this.dbEditObj.level)
        if (this.dbEditObj.hasOwnProperty('procedureId')) {
          this.dbType.title = '编辑存储过程';
          this.dbType.firstRowName = '存储过程:';
          this.dbForm.name = this.dbForm.procedureName;
        } else if (this.dbEditObj.hasOwnProperty('valId')) {
          this.dbType.title = '编辑值';
          this.dbType.firstRowName = '值:';
          this.dbForm.name = this.dbForm.valName;
          delete this.dbForm.level;
        } else if (this.dbEditObj.hasOwnProperty('colId')) {
          this.dbType.title = '编辑字段';
          this.dbType.firstRowName = '字段:';
          this.dbForm.name = this.dbForm.colName;
        } else {
          this.dbType.title = '编辑表和视图';
          this.dbType.firstRowName = '表名:';
          this.dbForm.name = this.dbForm.tableName;
        }
      } else {
        switch (this.dbAddObj.type) {
          case 'table':
            this.dbType.title = '添加表和视图';
            this.dbType.firstRowName = '表名:';
            break;
          case 'col':
            this.dbType.title = '添加字段';
            this.dbType.firstRowName = '字段:';
            break;
          case 'val':
            this.dbType.title = '添加值';
            this.dbType.firstRowName = '值:';
            break;
          case 'procedure':
            this.dbType.title = '添加存储过程';
            this.dbType.firstRowName = '存储过程:';
            break;
        }
      }
    },
    methods: {
      dialogOk() {
        this.$refs.dbForm.validate(valid => {
          if (!valid) return;
          let urlTail = '';
          let param = {};
          let reloadType = '';
          if (Object.keys(this.dbEditObj).length > 0) {
            if (this.dbEditObj.hasOwnProperty('procedureId')) {
              this.dbForm.procedureName = this.dbForm.name;
              reloadType = 'procedure';
              urlTail = 'saveDbaProcedure';
            } else if (this.dbEditObj.hasOwnProperty('valId')) {
              this.dbForm.valName = this.dbForm.name;
              reloadType = 'val';
              urlTail = 'saveDbaValue';
            } else if (this.dbEditObj.hasOwnProperty('colId')) {
              this.dbForm.colName = this.dbForm.name;
              reloadType = 'col';
              urlTail = 'saveDbaColume';
            } else {
              this.dbForm.tableName = this.dbForm.name;
              reloadType = 'table';
              urlTail = 'saveDbaTable';
            }
            param = Object.assign({}, this.dbForm);
          } else {
            reloadType = this.dbAddObj.type
            let additionParam = {};
            switch (this.dbAddObj.type) {
              case 'table':
                additionParam.dbiId = this.dbAddObj.dbUuid;
                additionParam.tableName = this.dbForm.name;
                urlTail = 'saveDbaTable';
                break;
              case 'col':
                additionParam.dbiId = this.dbAddObj.dbUuid;
                additionParam.colName = this.dbForm.name;
                additionParam.tableId = this.dbAddObj.tableId;
                urlTail = 'saveDbaColume';
                break;
              case 'val':
                additionParam.dbiUuid = this.dbAddObj.dbUuid;
                additionParam.valName = this.dbForm.name;
                additionParam.tableId = this.dbAddObj.tableId;
                additionParam.colId = this.dbAddObj.colId;
                urlTail = 'saveDbaValue';
                break;
              case 'procedure':
                additionParam.dbiUuid = this.dbAddObj.dbUuid;
                additionParam.procedureName = this.dbForm.name;
                urlTail = 'saveDbaProcedure';
                break;
            }
            param = Object.assign({}, this.dbForm, additionParam);
          }
          delete param.name;
          $axios.post(`/resourcemanager/assetmanage/databaseasset/${urlTail}`, param).then(({data}) => {
            if (data === 'success') {
              this.$emit('reload', reloadType);
              this.dialogFlag = false;
              this.$message({showClose: true, message: '保存成功', type: 'success'});
            } else {
              this.$nextTick(() => {
                this.$message({message: '已存在，保存失败', type: 'error'});
              })
            }
          });
        });
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    }
  }
</script>

