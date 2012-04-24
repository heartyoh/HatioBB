Ext.define('HatioBB.controller.Main', {
    extend: 'Ext.app.Controller',

	requires : ['HatioBB.store.SubMenus'],
	
    config: {
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
			'nav #groups button' : {
				tap : 'onGroup'
			},
			
			'monitor_map' : {
				vehicletap : 'onVehicleInfo'
			},
			'monitor_info #incidents button' : {
				tap : 'onIncident'
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
		if(!view)
			view = this.getContent().add({
				xtype : monitor
			});
		this.getContent().setActiveItem(view);
		this.getHeader().setActiveStatus(view.getId());
		
		return view;
	},
	
    onMap: function(button, e) {
		var view = this.showMonitor('monitor_map');
    },

    onInfo: function(button, e) {
		var view = this.showMonitor('monitor_info');
    },

    onVehicleInfo: function(vehicle) {
		var view = this.showMonitor('monitor_info');
		view.setVehicle(vehicle);
    },

    onIncident: function(comp, e) {
		var view = this.showMonitor('monitor_incident');

		/* 여러 경로의 button동작을 통해서 들어오는 것을 감안함. */
		if(comp.config.incident)
			view.setIncident(comp.config.incident);
    },

	onSetting : function(button, e) {
		var popup = Ext.create('HatioBB.view.Setting', {});
		popup.showBy(button);
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
		button.unfiltered = !(button.unfiltered);
		
		var store = Ext.getStore('VehicleFilteredStore');

		var filter = this.getNav().buildFilter();
		
		store.clearFilter();
		
		if(filter)
			store.filter([filter]);
		
		this.showMonitor('monitor_map');
	},
 
	onGroup : function(button, e) {

		// this.sub('search').setValue('');  //TODO.. clear search item..
		this.getNav().clearFilter();

		var groupId = button.config.group.get('id');
		var group = Ext.getStore('VehicleGroupStore').findRecord('id', groupId);
		var vehicles = group ? group.get('vehicles') : [];

		var store = Ext.getStore('VehicleFilteredStore');
		store.clearFilter();
		store.filter([ {
			filterFn : function(record) {
				return Ext.Array.indexOf(vehicles, record.get('id')) >= 0;
			}
		} ]);

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
    }

});
