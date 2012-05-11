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

    initialize: function() {
        var self = this;

        this.callParent();

        /* Incident 상태 처리 */
        var incidentStore = Ext.getStore('RecentIncidentStore');
        incidentStore.load();

        /* Vehicle 상태 처리 */
        var vehicleMapStore = Ext.getStore('VehicleMapStore');
        vehicleMapStore.load();

		/* refreshTerm 에 따라 자동 리프레쉬 기능을 동작시킴. */
		function onRefreshTerm(val) {
			if(this.incidentInterval)
				clearInterval(this.incidentInterval);
			if(val > 0)
				this.incidentInterval = setInterval(function() {
		            incidentStore.load();
		        }, val * 1000);

			if(this.vehicleMapInterval)
	        	clearInterval(this.vehicleMapInterval);
			if(val > 0)
		        this.vehicleMapInterval = setInterval(function() {
		            vehicleMapStore.load();
		        }, val * 1000);
		}
		
		HatioBB.setting.on({
			refreshTerm : onRefreshTerm
		});

		onRefreshTerm(HatioBB.setting.get('refreshTerm'));

		/* Vehicle, Driver 그룹 처리 */
		var vehicleGroupStore = Ext.getStore('VehicleGroupStore');
		var driverGroupStore = Ext.getStore('DriverGroupStore');

        /* 자동 리프레쉬 처리 */
        this.sub('incidents').on({
            painted: function() {
				self.refreshIncidents(incidentStore);
                incidentStore.on('load', self.refreshIncidents, self);
            },
            erased: function() {
                incidentStore.un('load', self.refreshIncidents, self);
            },
            scope: self
        });

        this.sub('status').on({
            painted: function() {
				self.refreshStatus(vehicleMapStore);
                vehicleMapStore.on('load', self.refreshStatus, self);
            },
            erased: function() {
                vehicleMapStore.un('load', self.refreshStatus, self);
            },
            scope: self
        });

		this.sub('vgroups').on({
            painted: function() {
                vehicleGroupStore.on('load', self.refreshVGroups, self);
				vehicleGroupStore.load();
            },
            erased: function() {
                vehicleGroupStore.un('load', self.refreshVGroups, self);
            },
            scope: self
		});

		this.sub('dgroups').on({
            painted: function() {
                driverGroupStore.on('load', self.refreshDGroups, self);
				driverGroupStore.load();
            },
            erased: function() {
                driverGroupStore.un('load', self.refreshDGroups, self);
            },
            scope: self
		});
    },

    destroy: function() {
        clearInterval(this.incidentInterval);
        clearInterval(this.vehicleMapInterval);
    },

    refreshStatus: function(store) {
        var running = 0;
        var idle = 0;
        var incident = 0;
        var maint = 0;

        store.each(function(record) {
            switch (record.get('status')) {
            case 'Running':
                running++;
                break;
            case 'Idle':
                idle++;
                break;
            case 'Incident':
                incident++;
                break;
            case 'Maint':
                maint++;
                break;
            }
        });

        this.sub('state_running').setHtml(T('label.state_driving') + '</br><span>' + running + '</span>');
        this.sub('state_idle').setHtml(T('label.state_idle') + '</br><span>' + idle + '</span>');
        this.sub('state_incident').setHtml(T('label.state_incident') + '</br><span>' + incident + '</span>');
        this.sub('state_maint').setHtml(T('label.state_maint') + '</br><span>' + maint + '</span>');
    },

    refreshIncidents: function(store) {
        var incidents = this.sub('incidents');

        incidents.removeAll();
        var count = store.getCount() > 5 ? 5: store.getCount();

        for (var i = 0; i < count; i++) {
            var incident = store.getAt(i);
            incidents.add({
                xtype: 'button',
                incident: incident,
                html: '<a href="#">'
                + incident.get('vehicle_id')
                + ', '
                + incident.get('driver_id')
                + '<span>'
                + Ext.Date.format(incident.get('datetime'),
                'D Y-m-d H:i:s') + '</span></a>'
            });
        }
    },

	refreshVGroups : function(store) {
		var groups = this.sub('vgroups');
		groups.removeAll();
		
		store.each(function(record) {
			groups.add({
				xtype : 'button',
				group : record,
				html : '<a href="#">'
						+ record.data.desc
						+ '<span>('
						+ record.data.vehicles.length
						+ ')</span></a>'
			});			
		});
	},
	
	refreshDGroups : function(store) {
		var groups = this.sub('dgroups');
		groups.removeAll();
		
		store.each(function(record) {
			groups.add({
				xtype : 'button',
				group : record,
				html : '<a href="#">'
						+ record.data.desc
						+ '<span>('
						+ record.data.drivers.length
						+ ')</span></a>'
			});			
		});
	},
	
    config: {

        items: [
        {
            xtype: 'container',
            cls: 'mainNav',
            layout: {
                type: 'vbox'
            },
            items: [
            {
                xtype: 'button',
                id: 'nav_vehicle',
                text: 'Vehicle',
				cls : 'navBtn',
                iconCls: 'iconVehicle'
            },
            {
                xtype: 'button',
                id: 'nav_driver',
                text: 'Driver',
				cls : 'navBtn',
                iconCls: 'iconDriver'
            },
            {
                xtype: 'button',
                id: 'nav_report',
                text: 'Report',
				cls : 'navBtn',
                iconCls: 'iconReport'
            },
            {
                xtype: 'panel',
                itemId: 'status',
                height: 115,
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                cls: 'statusPanel',
                items: [{
                    xtype: 'button',
                    itemId: 'state_running',
                    flex: 1,
                    cls: 'btnDriving',
					state : 'Running'
                },
                {
                    xtype: 'button',
                    itemId: 'state_idle',
                    flex: 1,
                    cls: 'btnStop',
					state : 'Idle'
                },
                {
                    xtype: 'button',
                    itemId: 'state_incident',
                    flex: 1,
                    cls: 'btnIncident',
					state : 'Incident'
                },
                {
                    xtype: 'button',
                    itemId: 'state_maint',
                    flex: 1,
                    cls: 'btnMaint',
					state : 'Maint'
                }]
            },
            {
                xtype: 'carousel',
                direction: 'horizontal',
                flex: 1,
                items: [{
                    xtype: 'panel',
                    itemId: 'incidents',
                    cls: 'incidentPanel',
					html : T('title.incidents_alarm'),
                },
                {
                    xtype: 'panel',
                    itemId: 'vgroups',
                    cls: 'groupPanel vGroup',
					html: T('title.vehicle_group'),
                },
				{
                    xtype: 'panel',
                    itemId: 'dgroups',
                    cls: 'groupPanel dGroup',
					html: T('title.driver_group'),
                }]
            }]
        }]
    }
});