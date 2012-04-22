Ext.define('HatioBB.mixin.Setting', function() {
	var settings = {
		autofit : true,
		refreshTerm : 10,
		dockPosition : 'right'
	};
	
	Ext.define('HatioBB.mixin.Setting.Inner', {
		mixins: ['Ext.mixin.Observable'],
		
		set : function(key, val) {
			var old = settings[key];
			settings[key] = val;
			this.fireEvent(key, val, old);
		},
		
		get : function(key) {
			return settings[key];
		}
	});
	
	return {
		setting : Ext.create('HatioBB.mixin.Setting.Inner')
	}
}());