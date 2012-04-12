Ext.define('HatioBB.view.Nav.NavMenu', {
	extend: 'Ext.dataview.List',
	
    xtype: 'nav_menu',

    requires: [
    'Ext.dataview.List'
    ],

    initialize: function() {
        this.callParent();

    },

    config: {
        disclosure: true,
		grouped :true,
        itemTpl: '<div class="menu"><strong>{text}</strong></div>'
    }
});
