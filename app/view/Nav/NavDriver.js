Ext.define('HatioBB.view.Nav.NavDriver', {
    extend: 'Ext.dataview.List',

    xtype: 'nav_driver',

    requires: [
    'Ext.dataview.List'
    ],

    initialize: function() {
        this.callParent();

        this.getStore().load();
    },

    config: {
        title: 'Drivers',

        disclosure: true,

        grouped: true,

        store: 'Drivers',

        itemTpl: '<div class="oper"><strong>{id}</strong> {name}</div>'
    }
});
