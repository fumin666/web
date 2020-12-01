## 全新namecard使用

props属性
useruuid: string        default：''
placement: string       default：‘top’


#### 用法：
引用 
```
import {NameCardHover} from '@/components/nameCard/NameCard';
```

hover使用
```html
<NameCardHover :useruuid="form.endUser" :placement="'top-start'">
  slot...
</NameCardHover>
```

click使用
```html
<NameCardClick :useruuid="form.endUser" :placement="'top-start'">
  slot...
</NameCardClick>
```
