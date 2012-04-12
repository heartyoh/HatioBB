Ext.define('HatioBB.view.Nav.NavNoti', {
    extend: 'Ext.Panel',
    xtype: 'nav_noti',

    requires: [
    'Ext.dataview.List'
    ],

    config: {
        title: 'Notification',
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
