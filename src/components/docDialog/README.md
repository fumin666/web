# docDialog 上传关联文档弹框组件使用说明

## 注意
    本组件本身是一个弹框组件，如果该组件是由另一个弹框组件中的操作（比如点击事件等）打开的，
    由于sunflower库中s-dialog组件的原有bug，该组件暂时不能在<s-dialog></s-dialog>中嵌套。
    ***需要将该组件写在与父级弹框组件同级的位置。***（和以前直接使用s-dialog组件一样一样的）

## 引入
  ```
    import docDialog from '@/components/docDialog';
  ```

## props
  ```
    /* 组件提供 selectedData 可选属性，接收默认选中的数据，无需默认选中时，可不传值 */
    /**
     * @param selectedData  默认选中的数据（可选）
     * @type  Array
     */
  ```

## 打开弹框
  ```
    /**
     *组件使用VueX提交mutations的方法来打开弹框
     *提交的mutations类型为'openDocDialog'
     */
      eg:
        JS: this.$store.commit('openDocDialog');
  ```

## 获取选中数据
  ```
    方法一：（推荐）
          您可以在computed计算属性中 return this.$store.state.docData.selectDocList 来获取选中数据（官网文档示例都是在computed中获取state的）
           eg:
              JS: computed: {
                docSelectedList() {
                  return this.$store.state.docData.selectDocList
                }
              }

    方法二：（当该组件是由另一弹框中的操作（点击事件等）打开时，牵扯到兄弟组件传值，用此方法获取数据在组件间传值较为麻烦）
          /* 组件提供 getSelection 事件，接受一个函数作为事件处理函数，该函数接收一个参数，该参数为弹框中表格中选中的数据 */
          eg：
              HTML：<doc-dialog @getSelection="getData"></doc-dialog>

          JS:
              methods: {
                getData(docList){
                  console.log(docList)  // docList为弹框中选择的数据 {Array}
                }
              }
  ```
