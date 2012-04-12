Ext.define('HatioBB.view.Nav.NavComm', {
    extend: 'Ext.Panel',
    xtype: 'nav_comm',

    requires: [
    'Ext.dataview.List'
    ],

    config: {
        title: 'Communication',
        layout: 'vbox',

        items: [
            {
                tpl: [
                      '<div>123</div>'
                ].join('')
            }
        ],

        record: null
    }
});
