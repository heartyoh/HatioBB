Ext.define('HatioBB.mixin.Setting', function() {
	var defaultSettings = [{
		id : 'autofit',
		value : false
	}, {
		id : 'refreshTerm',
		value : -1
	}, {
		id : 'dockPosition',
		value : 'right'
	}];
	
	Ext.define('HatioBB.mixin.LocalSetting.Model', {
	    extend: 'Ext.data.Model',
	    config: {
	        fields: [{
				name : 'id',
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
		var record = store.getById(name);
		if(record)
			return record.get('value');
		else
			return null;
	};
	
	function setLocalSetting(name, value) {
		var record = store.getById(name);
		var old;
		if(!record) {
			var set = Ext.create('HatioBB.mixin.LocalSetting.Model', {
				id : name,
				value : undefined
			});
			store.add(set);
			record = store.getById(name);
		}

		record.set('value', value);
		record.commit();
		
		return old;
	};
	
	Ext.define('HatioBB.mixin.Setting.Inner', {
		mixins: ['Ext.mixin.Observable'],
		
		set : function(id, val) {
			var old = setLocalSetting(id, val);
			this.fireEvent(id, val, old);
		},
		
		get : function(id) {
			return getLocalSetting(id);
		}
	});
	
	store.on('load', function(store, records) {
		for(var i = 0;i < defaultSettings.length;i++) {
			if(!store.getById(defaultSettings[i].id)) {
				setLocalSetting(defaultSettings[i].id, defaultSettings[i].value);
				// store.add(defaultSettings[i]);
			}
		}
		// console.log(store.sync());
	});
	
	store.load();

	return {
		setting : Ext.create('HatioBB.mixin.Setting.Inner')
	}
}());