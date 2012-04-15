Ext.define('HatioBB.view.nav.NavFav', {
    extend: 'Ext.Panel',
    xtype: 'nav_fav',

    requires: [
    'Ext.dataview.List'
    ],

    config: {
        title: 'Favorites',
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
