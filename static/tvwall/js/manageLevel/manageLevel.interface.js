define(function(require, exports, module) {

	require('./jquery.manageLevel');

	var manageLevel = {};

	manageLevel.manageLevel = function(_box,config){
		var $p = $(_box || document);
		$p.manageLevel(config);
	};

	module.exports = manageLevel;
});
