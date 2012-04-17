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
		
		var interval;

		this.on('painted', function() {
			var incidentStore = Ext.getStore('RecentIncidentStore');
			
			incidentStore.on('load', self.refreshIncidents, self);
			incidentStore.load();

			interval = setInterval(function() {
				incidentStore.load();
			}, 10000);
		});
		
		this.on('erased', function() {
			clearInterval(interval);
			Ext.getStore('RecentIncidentStore').un('load', self.refreshIncidents, self);
		});		
	},
	
	refreshIncidents : function(store) {
		// if (!store)
		// 	store = Ext.getStore('RecentIncidentStore');
		
		var incidents = this.sub('incidents');
		// if(!incidents)
		// 	incidents = this.up('viewport.east').sub('incidents');

		incidents.removeAll();
		var count = store.getCount() > 5 ? 5 : store.getCount();

		for (var i = 0; i < count; i++) {			
			var incident = store.getAt(i);
			incidents.add(
			{
				xtype : 'button',
				// listeners : {
				// 	tap : function(button) {
				// 		// TODO move to controller
				// 		var monitor_incident = Ext.getCmp('content').getComponent('monitor_incident');
				// 		if(!monitor_incident)
				// 			monitor_incident = Ext.getCmp('content').add({
				// 				xtype : 'monitor_incident'
				// 			});
				// 		Ext.getCmp('content').setActiveItem(monitor_incident);
				// 		// GreenFleet.doMenu('monitor_incident');
				// 		// GreenFleet.getMenu('monitor_incident').setIncident(button.incident, true);
				// 	}
				// },
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
					flex : 1,
					itemId : 'incidents',
					cls : 'incidentPanel'
			}]
		}]
    }
});