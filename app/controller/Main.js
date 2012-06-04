Ext.define('HatioBB.controller.Main', {
    extend: 'Ext.app.Controller',

	requires : ['HatioBB.view.Setting', 'HatioBB.view.driver.Driver', 'HatioBB.view.vehicle.Vehicle'],
	
    config: {
		routes : {
			map : 'onMap',
			info : 'onInfo',
			incident : 'onIncident'
		},
		
        refs: {
            main: 'main',
            nav: 'nav',
            content: 'content',
			header : 'header'
        },

        control: {
			'#ext-viewport':{
				orientationchange: 'onOC'
			},
			'#content' : {
				painted : 'onHome'
			},
            'header #map' : {
                tap: 'onMap'
            },
            'header #info' : {
                tap: 'onInfo'
            },
            'header #incident' : {
                tap: 'onIncident'
            },
			'header #collapse' : {
				tap : 'onCollapse'
			},
			'header #setting' : {
				tap : 'onSetting'
			},
			'header #refresh' : {
				tap : 'onRefresh'
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
			
			'monitor_map' : {
				drivertap : 'onMapDriverTap',
				vehicletap : 'onMapVehicleTap',
				tracktap : 'onMapTrackTap'
			},
			'monitor_info #incidents button' : {
				tap : 'onIncident'
			},
			'monitor_info image' : {
				tap : 'onImage'
			},
			'monitor_incident image' : {
				tap : 'onImage'
			},
			
            'nav_driver' : {
                itemtap: 'onDriverItemTap',
				disclose : 'onDriverDisclose'
            },

            'nav_vehicle' : {
                itemtap: 'onVehicleItemTap',
				disclose : 'onVehicleDisclose'
            },

			'vehicle_summary' : {
				showMap : 'onShowMap',
				showTrack : 'onShowTrack'
            },

			'driver_summary' : {
				showMap : 'onShowMap',
				showTrack : 'onShowTrack'
			}

        }
    },

	onOC : function(me, newOrient,w,h) {
		if(newOrient === 'portrait') {
			this.getNav().setDocked(null).hide();
		} else {
			this.getNav().setDocked(HatioBB.setting.get('dockPosition')).show();
		}
	},
	
	onHome : function() {
		this.showMonitor('monitor_map');
	},
	
	showMonitor : function(monitor) {
		var view = this.getContent().getComponent(monitor);
		if(!view) {
			this.getContent().removeAll();
			view = this.getContent().add({
				xtype : monitor
			});
		}
		this.getContent().setActiveItem(view);
		this.getHeader().setActiveStatus(view.getId());
		
		return view;
	},
	
	showVehicle: function() {
		var view = this.getContent().getComponent('vehicle');
		if(!view) {
			this.getContent().removeAll();
			view = this.getContent().add({
				xtype : 'vehicle'
			});
		}
		this.getContent().setActiveItem(view);
		this.getHeader().clearActiveStatus();
		
		return view;
	},
	
	showDriver: function() {
		var view = this.getContent().getComponent('driver');
		if(!view) {
			this.getContent().removeAll();
			view = this.getContent().add({
				xtype : 'driver'
			});
		}
		this.getContent().setActiveItem(view);
		this.getHeader().clearActiveStatus();
		
		return view;
	},
	
    onMap: function(button, e) {
		var view = this.showMonitor('monitor_map');
    },

    onInfo: function(button, e) {
		var view = this.showMonitor('monitor_info');
    },

    onMapTrackTap: function(vehicle) {
		var view = this.showMonitor('monitor_info');

		HatioBB.setting.set('monitoring_vehicle', vehicle.get('id'));
		HatioBB.setting.set('vehicle', vehicle.get('id'));
		HatioBB.setting.set('driver', vehicle.get('driver_id'));
    },

    onMapDriverTap: function(driver) {
		HatioBB.setting.set('driver', driver.get('id'));

		this.showDriver();
    },

    onMapVehicleTap: function(vehicle) {
		HatioBB.setting.set('vehicle', vehicle.get('id'));

		this.showVehicle();
    },

    onIncident: function(comp, e) {
		var view = this.showMonitor('monitor_incident');

		/* 여러 경로의 button동작을 통해서 들어오는 것을 감안함. */
		if(comp && comp.config && comp.config.incident)
			view.setIncident(comp.config.incident);
		else
			view.setIncident();
    },

	onSetting : function(button, e) {
		Ext.create('HatioBB.view.Setting', {}).showBy(button);
	},
	
	onRefresh : function(button, e) {
		var active = this.getContent().getActiveItem();
		if(typeof(active.refresh) === 'function')
			active.refresh();
	},
  	
	onCollapse : function(button, e) {
		if(this.getNav().getDocked()) {
			this.getNav().setDocked(null).hide();
		} else {
			this.getNav().setDocked(HatioBB.setting.get('dockPosition')).show();
		}
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

		this.showMonitor('monitor_map');
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

		this.showMonitor('monitor_map');
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

		this.showMonitor('monitor_map');
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

	onImage : function(comp) {
		if(comp.config.itemId === 'driverImage')
			this.showDriver();
		else
			this.showVehicle();
	},

    onDriverItemTap: function(view, index, target, record) {
		HatioBB.setting.set('driver', record.get('id'));
    },

    onDriverDisclose: function(list, record, el, index, e) {
		list.select(index);

		this.showDriver();
		
		HatioBB.setting.set('driver', record.get('id'));
    },

    onVehicleItemTap: function(view, index, target, record) {
		HatioBB.setting.set('vehicle', record.get('id'));
    },

    onVehicleDisclose: function(list, record, el, index, e) {
		list.select(index);

		this.showVehicle();

		HatioBB.setting.set('vehicle', record.get('id'));
    },

    onShowMap: function(vehicle) {
		var view = this.showMonitor('monitor_map');

		HatioBB.setting.set('vehicle', vehicle);
    },

    onShowTrack: function(vehicle) {
		var view = this.showMonitor('monitor_info');

		HatioBB.setting.set('vehicle', vehicle);
    }
});
