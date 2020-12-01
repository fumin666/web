<template>
  <section class="addOrder">
    <s-form :model="KeyCommandInfo" :rules="rules1" ref="KeyCommand" label-width="100px">
      <s-form-item label="命令名称" prop="key_command_name" tip="最大长度为30，不能包含汉字">
        <s-input v-model.trim="KeyCommandInfo.key_command_name"></s-input>
      </s-form-item>
      <s-form-item label="命令内容" prop="key_command_cont" tip="最大长度为30，不能包含汉字">
        <s-input v-model="KeyCommandInfo.key_command_cont"></s-input>
      </s-form-item>
    </s-form>
  </section>
</template>
<script>
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      var validatorName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('名称不能为空！'))
        }
        // 如果是编辑页面，并且命令集为改变则不判断是否重复
        if (this.current) {
          if (value !== this.exist_command_name) {
            $axios.get('/keyCommand/exist/' + value).then((res) => {
              if (res.data) {
                callback(new Error('该命令已存在！'));
              }
            });
          }
        } else {
          $axios.get('/keyCommand/exist/' + value).then((res) => {
            if (res.data) {
              callback(new Error('该命令已存在！'));
            }
          });
        }
        setTimeout(() => {
//      最大长度为30，不能包含汉字
          var re = /^[^\u4e00-\u9fa5]{1,30}$/gi;
          if (!re.test(value.trim())) {
            callback(new Error('请输入正确命令名称'));
          } else {
            callback();
          }
        }, 500);
      };
      var validatorCont = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('内容不能为空！'))
        }
        setTimeout(() => {
//        最大长度为30，不能包含汉字
          var re = /^[^\u4e00-\u9fa5]{1,30}$/gi;
          if (!re.test(value.trim())) {
            callback(new Error('请输入正确命令内容'));
          } else {
            callback();
          }
        }, 500);
      };
      return {
        KeyCommandInfo: {
          key_command_name: '',
          key_command_cont: ''
        },
        rules1: {
          key_command_name: [
            {required: true, validator: validatorName, trigger: 'blur'}
          ],
          key_command_cont: [
            {required: true, validator: validatorCont, trigger: 'blur'}
          ]
        },
        // 保存编辑之前的命令名称，方便之后对比是否改变
        exist_command_name: ''
      };
    },
    props: {
      current: Object
    },
    mounted() {
      if (this.current) {
        this.KeyCommandInfo = this.current;
        this.exist_command_name = this.KeyCommandInfo.key_command_name;
      }
    }
  }
</script>

