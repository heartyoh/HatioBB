Ext.define('HatioBB.view.Nav', {
    extend: 'Ext.navigation.View',

    xtype: 'nav',

    requires: [
    'Ext.dataview.List',
    'HatioBB.view.Nav.NavMenu',
    'HatioBB.view.Nav.NavVehicle',
    'HatioBB.view.Nav.NavDriver',
    'HatioBB.view.Nav.NavFav',
    'HatioBB.view.Nav.NavComm',
    'HatioBB.view.Nav.NavNoti',
	'HatioBB.view.Nav.NavReport'
    ],

	layout : {
		type : 'vbox'
	},
	
    config: {
        

        items: [
		{
			xtype : 'container',
			cls: 'mainNav',
			items : [{
	            xtype: 'container',
				id : 'nav_menu',
				cls : 'navGroup',
	            defaults: {
	                xtype: 'button'
	            },
	            items: [{
	                text: 'Map',
					iconCls : 'iconMap'
	            },
	            {
	                text: 'Information',
					iconCls : 'iconInformation'
	            },
	            {
	                text: 'Incident',
					iconCls : 'iconIncident'
	            }]
	        },
	        {
	            xtype: 'container',
				cls : 'navGroup',
	            defaults: {
	                xtype: 'button'
	            },
	            items: [{
					id : 'nav_vehicle',
	                text: 'Vehicle',
					iconCls : 'iconVehicle'
	            },
	            {
					id : 'nav_driver',
	                text: 'Driver',
					iconCls : 'iconDriver'
	            },
				{
					id : 'nav_report',
	                text: 'Report',
					iconCls : 'iconReport'
				}]
	        },
	        {
	            xtype: 'container',
				cls : 'navGroup',
	            defaults: {
	                xtype: 'button'
	            },
	            items: [{
					id : 'nav_fav',
	                text: 'Favorite',
					iconCls : 'iconFavorite'
	            },
	            {
					id : 'nav_comm',
	                text: 'Communication',
					iconCls : 'iconCommunication'
	            },
	            {
					id : 'nav_noti',
	                text: 'Notification',
					iconCls : 'iconNotification'
	            }]
	        }]
		}
        ]
    }
});