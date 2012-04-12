Ext.define('HatioBB.store.SubMenus', {
    extend: 'Ext.data.Store',

    requires: ['HatioBB.model.Menu'],

    config: {
        model: 'HatioBB.model.Menu',

        sorters: 'index',
		
		grouper : 'module'
    }
});
