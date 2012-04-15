Ext.define('HatioBB.view.Nav', {
    extend: 'Ext.navigation.View',

    xtype: 'nav',

    requires: [
    'Ext.dataview.List',
    'HatioBB.view.nav.NavMenu',
    'HatioBB.view.nav.NavVehicle',
    'HatioBB.view.nav.NavDriver',
    'HatioBB.view.nav.NavFav',
    'HatioBB.view.nav.NavComm',
    'HatioBB.view.nav.NavNoti',
	'HatioBB.view.nav.NavReport'
    ],

	initialize : function() {
		var self = this;
		
		this.callParent();
		
		var incidentStore = Ext.getStore('RecentIncidentStore');

		this.on('painted', function() {
			console.log('painted');
			// Ext.getStore('VehicleMapStore').on('load',self.refreshVehicleCounts, self);
			Ext.getStore('RecentIncidentStore').on('load', self.refreshIncidents, self);			
			// Ext.getStore('VehicleGroupStore').on('load', self.refreshVehicleGroups, self);
		});
		
		this.on('painted', function() {
			interval = setInterval(function() {
				vehicleMapStore.load();
				// incidentStore.load(); // TODO Incident Store는 Map과 관련이 없으므로, 다른 화면으로 이주시켜라.
			}, 10000);
		});
		
		this.on('erased', function() {
			clearInterval(interval);
			// this.resetMarkers();
		});		
	},
	
	refreshIncidents : function(store) {
		console.log('refreshIncidents');
		if (!store)
			store = Ext.getStore('RecentIncidentStore');
		
		var incidents = this.sub('incidents');
		if(!incidents)
			incidents = this.up('viewport.east').sub('incidents');

		incidents.removeAll();
		var count = store.count() > 5 ? 5 : store.count();

		for (var i = 0; i < count; i++) {			
			var incident = store.getAt(i);
			incidents.add(
			{
				xtype : 'button',
				listeners : {
					click : function(button) {
						// GreenFleet.doMenu('monitor_incident');
						// GreenFleet.getMenu('monitor_incident').setIncident(button.incident, true);
					}
				},
				incident : incident,
				html : '<a href="#">'
						+ incident.get('vehicle_id')
						+ ', '
						+ incident.get('driver_id')
						+ '<span>'
						+ Ext.Date.format(incident.get('datetime'),
								'D Y-m-d H:i:s') + '</span></a>'
			});
		}
	},
	
    config: {
        
        items: [
		{
			xtype : 'container',
			cls: 'mainNav',
			layout : {
				type : 'vbox'
			},
			items : [
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
	        },
			{
					xtype : 'panel',
					title : T('title.incidents_alarm'),
					itemId : 'incidents',
					cls : 'incidentPanel'
			}]
		}]
    }
});