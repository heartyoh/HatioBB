Ext.define('HatioBB.view.Nav.NavReport', {
    extend: 'Ext.dataview.List',

    xtype: 'nav_report',

    requires: [
    'Ext.dataview.List'
    ],

    initialize: function() {
        this.callParent();

        this.getStore().load();
    },

    config: {
        title: 'Reports',

        disclosure: true,

        grouped: true,

        store: 'Reports',

        itemTpl: '<div class="report"><strong>{reportId}</strong> {desc}</div>'
    }
});
