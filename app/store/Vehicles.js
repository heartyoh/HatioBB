Ext.define('HatioBB.store.Vehicles', {
    extend: 'Ext.data.Store',

    config: {
		fields : ['vehicle_id', 'reg_number'],

        autoLoad: false,
        sorters: 'id',
		grouper : 'group',

        proxy: {
            type: 'ajax',
            url: 'data/VehicleList.json'
        }
    }
});
