import Vue from 'vue'
import noDataDirective from './noData'
import infiniteTotalDirective from './infiniteTotal'
import noAuthDirective from './noAuth'
import copyrightStrDirective from './copyrightText'
import noBtnDirective from './noBtn'
import loadmoredata from './moreDataScroll'
import dialogclose from './dialogScroll'

Vue.directive('nodata', noDataDirective)
Vue.directive('noAuth', noAuthDirective)
Vue.directive('infiniteTotal', infiniteTotalDirective)
Vue.directive('copyright', copyrightStrDirective)
Vue.directive('noBtn', noBtnDirective)
Vue.directive('loadmoredata', loadmoredata)
Vue.directive('dialogclose', dialogclose)
