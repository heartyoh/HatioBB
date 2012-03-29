Ext.define('HatioBB.store.TopMenus', {
    extend: 'Ext.data.TreeStore',
	alias : 'store.Menus',
	
	requires: ['HatioBB.model.Menu'],
	
	config: {
		model : 'HatioBB.model.Menu',
		root : root,
		defaultRootProperty:'items'
	}

});