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
				cls : 'navGroup',
	            defaults: {
	                xtype: 'button'
	            },
	            items: [{
					id : 'nav_map',
	                text: 'Map',
					iconCls : 'iconMap'
	            },
	            {
					id : 'nav_info',
	                text: 'Information',
					iconCls : 'iconInformation'
	            },
	            {
					id : 'nav_incident',
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