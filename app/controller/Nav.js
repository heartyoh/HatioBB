Ext.define('HatioBB.controller.Nav', {
    extend: 'Ext.app.Controller',

	requires : ['HatioBB.view.driver.Driver', 'HatioBB.view.vehicle.Vehicle'],
	
    config: {
        refs: {
            main: 'main',
            nav: 'nav',
            content: 'content',
			header : 'header'
        },

        control: {
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
    }
});
