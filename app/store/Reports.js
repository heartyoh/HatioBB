Ext.define('HatioBB.store.Reports', {
    extend: 'Ext.data.Store',

    config: {
		fields : ['reportId', 'desc'],

        autoLoad: false,
        sorters: 'reportId',
		grouper : 'group',

        proxy: {
            type: 'ajax',
            url: 'data/ReportList.json'
        }
    }
});
