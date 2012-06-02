Ext.define('HatioBB.store.Menus', {
    extend: 'Ext.data.Store',

    requires: ['HatioBB.model.Menu'],

    config: {
        model: 'HatioBB.model.Menu',
        autoLoad: true,
        sorters: 'index',

        proxy: {
            type: 'ajax',
            url: 'data/Menu.json'
        }
    }
});
