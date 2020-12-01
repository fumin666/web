import NameCardClick from './NameCardClick';
import NameCardHover from './NameCardHover';

NameCardClick.install = function(Vue) {
  Vue.component(NameCardClick.name, NameCardClick)
}

NameCardHover.install = function(Vue) {
  Vue.component(NameCardHover.name, NameCardHover)
}
export {NameCardClick, NameCardHover};