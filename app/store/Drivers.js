Ext.define('HatioBB.store.Drivers', {
    extend: 'Ext.data.Store',

    config: {
		fields : ['id', 'name'],

        autoLoad: false,
        sorters: 'id',
		grouper : 'group',

        proxy: {
            type: 'ajax',
            url: 'data/DriverList.json'
        }
    }
});
