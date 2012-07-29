Ext.define('HatioBB.controller.Nav', {
    extend: 'Ext.app.Controller',

	requires : ['HatioBB.view.driver.Driver', 'HatioBB.view.vehicle.Vehicle'],
	
    config: {
        refs: {
            main : 'main',
            nav : 'nav',
            content : 'content',
			header : 'header',
			incidents : 'nav #incidents',
			status : 'nav #status',
			stateRunning: 'nav #state_running',
			stateIdle: 'nav #state_idle',
			stateIncident: 'nav #state_incident',
			stateMaint: 'nav #state_maint',
			vgroups : 'nav #vgroups',
			dgroups : 'nav #dgroups'
        },

        control: {
			nav : {
				initialize : 'onInitialize',
				destroy : 'onDestroy' //TODO 이런 이벤트는 발생하지 않음. 처리 요망.
			},
			'#nav_driver' : {
				tap : 'onDriver'
			},
			'#nav_vehicle' : {
				tap : 'onVehicle'
			},
			'#nav_report' : {
				tap : 'onReport'
			},

			'#nav_fav' : {
				tap : 'onFav'
			},
			'#nav_comm' : {
				tap : 'onComm'
			},
			'#nav_noti' : {
				tap : 'onNoti'
			},

			'nav #incidents button' : {
				tap : 'onIncident'
			},
			'nav #status button' : {
				tap : 'onStatus'
			},
			'nav #vgroups button' : {
				tap : 'onVGroup'
			},
			'nav #dgroups button' : {
				tap : 'onDGroup'
			},
			
            'nav_driver' : {
                itemtap: 'onDriverItemTap',
				disclose : 'onDriverDisclose'
            },

            'nav_vehicle' : {
                itemtap: 'onVehicleItemTap',
				disclose : 'onVehicleDisclose'
            }
        }
    },

	onInitialize: function() {
        var self = this;

        /* Incident 상태 처리 */
        var incidentStore = Ext.getStore('RecentIncidentStore');
		incidentStore.filter('confirm', false);
        incidentStore.load();

        /* Vehicle 상태 처리 */
        var vehicleMapStore = Ext.getStore('VehicleMapStore');
        vehicleMapStore.load();

        /* Driver 상태 처리 */
        var driverStore = Ext.getStore('DriverBriefStore');
        driverStore.load();

		/* refreshTerm 에 따라 자동 리프레쉬 기능을 동작시킴. */
		function onRefreshTerm(val) {
			if(self.incidentInterval)
				clearInterval(self.incidentInterval);
			if(val > 0)
				self.incidentInterval = setInterval(function() {
		            incidentStore.load();
		        }, val * 1000);

			if(self.vehicleMapInterval)
	        	clearInterval(self.vehicleMapInterval);
			if(val > 0)
		        self.vehicleMapInterval = setInterval(function() {
		            vehicleMapStore.load();
		        }, val * 1000);
		}

		HatioBB.setting.on({
			refreshTerm : onRefreshTerm
		});

		onRefreshTerm(HatioBB.setting.get('refreshTerm'));

        /* 자동 리프레쉬 처리 */
        this.getIncidents().on({
            painted: function() {
				self.refreshIncidents(incidentStore);
                incidentStore.on('load', self.refreshIncidents, self);
            },
            erased: function() {
                incidentStore.un('load', self.refreshIncidents, self);
            },
            scope: self
        });

        this.getStatus().on({
            painted: function() {
				self.refreshStatus(vehicleMapStore);
                vehicleMapStore.on('load', self.refreshStatus, self);
            },
            erased: function() {
                vehicleMapStore.un('load', self.refreshStatus, self);
            },
            scope: self
        });

		/* Vehicle, Driver 그룹 처리 */
		Ext.getStore('VehicleGroupStore').load(function(store) {
			self.refreshVGroups(this);
		});

		Ext.getStore('DriverGroupStore').load(function(store) {
			self.refreshDGroups(this);
		});
    },

	onDestroy: function() {
        clearInterval(this.incidentInterval);
        clearInterval(this.vehicleMapInterval);
	},

    onDriver: function(button, e) {
		this.getNav().setNavigationBar(true);
		this.getNav().push({
			xtype : 'nav_driver'
		});
    },

    onVehicle: function(button, e) {
		this.getNav().setNavigationBar(true);
		this.getNav().push({
			xtype : 'nav_vehicle'
		});
    },

	onReport: function(button, e) {
		this.getNav().setNavigationBar(true);
		this.getNav().push({
			xtype : 'nav_report'
		});
    },

    onFav: function(button, e) {
		this.getNav().setNavigationBar(true);
		this.getNav().push({
			xtype : 'nav_fav'
		});
    },

    onComm: function(button, e) {
		this.getNav().setNavigationBar(true);
		this.getNav().push({
			xtype : 'nav_comm'
		});
    },

    onNoti: function(button, e) {
		this.getNav().setNavigationBar(true);
		this.getNav().push({
			xtype : 'nav_noti'
		});
    },

    onIncident: function(comp, e) {
		var view = HatioBB.nav.monitor('monitor_incident');

		/* 여러 경로의 button동작을 통해서 들어오는 것을 감안함. */
		if(comp && comp.config && comp.config.incident)
			view.setIncident(comp.config.incident);
		else
			view.setIncident();
    },

	onStatus : function(button, e) {
		var store = Ext.getStore('VehicleFilteredStore');
		
		var status = this.getNav().down('#status');
		status['_filtered'] = !status['_filtered'];

		if(status._filtered) {
			store.clearFilter(true);
			store.filter('status', button.config.state);
		} else {
			store.clearFilter();
		}

		HatioBB.nav.monitor('monitor_map');
	},
 
	onVGroup : function(button, e) {
		var groupId = button.config.group.get('id');
		var group = Ext.getStore('VehicleGroupStore').findRecord('id', groupId);
		var vehicles = group ? group.get('vehicles') : [];

		var store = Ext.getStore('VehicleFilteredStore');
		store.clearFilter(true);
		store.filterBy(function(record) {
			return Ext.Array.indexOf(vehicles, record.get('id')) >= 0;
		});

		HatioBB.nav.monitor('monitor_map');
	},
	
	onDGroup : function(button, e) {
		var groupId = button.config.group.get('id');
		var group = Ext.getStore('DriverGroupStore').findRecord('id', groupId);
		var drivers = group ? group.get('drivers') : [];

		var store = Ext.getStore('VehicleFilteredStore');
		store.clearFilter(true);
		store.filterBy(function(record) {
			return Ext.Array.indexOf(drivers, record.get('driver_id')) >= 0;
		});

		HatioBB.nav.monitor('monitor_map');
	},
	
    onDriverItemTap: function(view, index, target, record) {
		HatioBB.setting.set('driver', record.get('id'));
    },

    onDriverDisclose: function(list, record, el, index, e) {
		list.select(index);

		HatioBB.nav.driver();
		
		HatioBB.setting.set('driver', record.get('id'));
    },

    onVehicleItemTap: function(view, index, target, record) {
		HatioBB.setting.set('vehicle', record.get('id'));
    },

    onVehicleDisclose: function(list, record, el, index, e) {
		list.select(index);

		HatioBB.nav.vehicle();

		HatioBB.setting.set('vehicle', record.get('id'));
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

        this.getStateRunning().setHtml(T('label.state_running') + '</br><span>' + running + '</span>');
        this.getStateIdle().setHtml(T('label.state_idle') + '</br><span>' + idle + '</span>');
        this.getStateIncident().setHtml(T('label.state_incident') + '</br><span>' + incident + '</span>');
        this.getStateMaint().setHtml(T('label.state_maint') + '</br><span>' + maint + '</span>');
    },

    refreshIncidents: function(store) {
        var incidents = this.getIncidents();

        incidents.removeAll();
        var count = store.getCount();

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
		var groups = this.getVgroups();
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
		var groups = this.getDgroups();
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
	}
});
