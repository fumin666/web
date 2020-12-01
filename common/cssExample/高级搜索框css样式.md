### **此文件是为了说明高级搜索框css样式的用法**
### **功能**
设置两个class就可以完成Q4要求的高级搜索框样式。

### **实现**
通过对应的html结构以及layout.styl(src\styles\chalk-theme\pages\layout.styl)文件中对应的样式就可以实现。
```html
<s-form :inline="true" class="search_form">
  <div class="form_item">
    <s-form-item>
      xxx
    </s-form-item>
  </div>
  <div class="search_btn">
    <s-button icon="magnifier">查询</s-button>
  </div>
</s-form>
```
```css
/*src\styles\chalk-theme\pages\layout.styl*/
/*Q4搜索框样式*/
.search_form{
  display:flex;
  justify-content: space-between;
  padding: 10px 15px;
  background: #F5F7FA !important;/*dark主题背景：rgba(255, 255, 255, 0.05) */
  border: 1px solid #DCDEE2 !important;/*dark主题背景：rgba(255, 255, 255, 0.1)*/
  box-sizing: border-box;
  border-radius: 3px;
  .s-form-item{
    margin-top: 5px;
    margin-right: 30px;
    margin-bottom: 5px !important;
    .s-form-item-label{
      padding:0 5px 0 0;
    }
  }
  .search_btn{
    min-width:100px;
    margin-top:8px;
    text-align:right;
    button{
      background: #414D5F;
      margin-bottom: 5px;
      border-radius: 2px;
      border:1px solid #414D5F;
    }
    button:hover{
      opacity:0.8
    }
  }
  .form_item{
    flex:1;
  }
}
```

### 用法
给`s-form`标签设置class="search_form",给查询按钮`s-button`标签的父标签设置class="search_btn"，最后按照例子里的html结构写就OK了。

### **实例**
此处实例代码位置为src\pages\Assets_Ipam\Perspective\SubnetPerspective.vue资产管理子网视角页面。可以在首页 /资产管理 /IP台账/子网视角处查看搜索框具体效果。
```html
<s-form :inline="true" :model="form" class="search_form">
  <div>
    <s-form-item label="子网地址">
      <s-select v-model="form.uuid" filterable clearable>
        <s-option v-for="(item,index) in subnetAddressList" :label="item.subNetAddress" :value="item.uuid" :key="index"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="子网名称">
      <s-input v-model="form.subNetName"></s-input>
    </s-form-item>
    <s-form-item label="扫描时间">
      <date-range v-model="form.scanTime"></date-range>
    </s-form-item>
  </div>
  <div class="search_btn">
    <s-button icon="magnifier" title="查询" @click="getList">查询</s-button>
  </div>
</s-form>
```

### Ctrl CV
```html
<s-row type="flex" justify="between" style="margin-bottom:4px;">
  <s-col>
    <!-- 搜索框上左侧按钮 -->
  </s-col>
  <s-col>
    <!-- 搜索框上右侧按钮 -->
  </s-col>
</s-row>
<s-row>
  <s-form :inline="true" :model="" class="search_form">
    <div>

    </div>
    <div class="search_btn">
      <s-button icon="magnifier" @click="">查询</s-button>
    </div>
  </s-form>
</s-row>
```