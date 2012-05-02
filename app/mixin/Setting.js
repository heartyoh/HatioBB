Ext.define('HatioBB.mixin.Setting', function() {
	var defaultSettings = [{
		key : 'autofit',
		value : false
	}, {
		key : 'refreshTerm',
		value : 0
	}, {
		key : 'dockPosition',
		value : 'right'
	}];
	
	Ext.define('HatioBB.mixin.LocalSetting.Model', {
	    extend: 'Ext.data.Model',
	    config: {
	        fields: [{
				name : 'key',
				type : 'string'
			}, {
				name : 'value',
				type : 'auto'
			}],
	        proxy: {
	            type: 'localstorage',
	            id  : 'hatiobb-settings'
	        }
	    }
	});

	var store = Ext.create('Ext.data.Store', {
		model : 'HatioBB.mixin.LocalSetting.Model',
		autoSync : true
	});
	
	function getLocalSetting(name) {
		var record = store.findRecord('key', name);
		if(record)
			return record.get('value');
		else
			return null;
	};
	
	function setLocalSetting(name, value) {
		var record = store.findRecord('key', name);
		if(record) {
			record.set('value', value);
			record.commit();
		} else {
			var set = Ext.create('HatioBB.mixin.LocalSetting.Model', {
				key : name,
				value : value
			});
			store.add(set);
		}
	};
	
	Ext.define('HatioBB.mixin.Setting.Inner', {
		mixins: ['Ext.mixin.Observable'],
		
		set : function(key, val) {
			var old = getLocalSetting(key);
			setLocalSetting(key, val);
			this.fireEvent(key, val, old);
		},
		
		get : function(key) {
			return getLocalSetting(key);
		}
	});
	
	store.on('load', function(store, records) {
		for(var i = 0;i < defaultSettings.length;i++) {
			if(store.find('key', defaultSettings[i].key) === -1) {
				store.add(defaultSettings[i]);
			}
		}
	});
	
	store.load();
	
	return {
		setting : Ext.create('HatioBB.mixin.Setting.Inner')
	}
}());