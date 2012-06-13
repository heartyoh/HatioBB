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
		HatioBB.nav.monitor('monitor_map');
	},
	
    onMap: function(button, e) {
		HatioBB.nav.monitor('monitor_map');
    },

	onInfo: function(button, e) {
		HatioBB.nav.monitor('monitor_info');
    },
    
	onIncident: function(comp, e) {
		var view = HatioBB.nav.monitor('monitor_incident');

		/* 여러 경로의 button동작을 통해서 들어오는 것을 감안함. */
		if(comp && comp.config && comp.config.incident)
			view.setIncident(comp.config.incident);
		else
			view.setIncident();
    },

    onCollapse : function(button, e) {
		if(this.getNav().getDocked()) {
			this.getNav().setDocked(null).hide();
		} else {
			this.getNav().setDocked(HatioBB.setting.get('dockPosition')).show();
		}
	},

	onSetting : function(button, e) {
		Ext.create('HatioBB.view.Setting', {}).showBy(button);
	},
	
	onRefresh : function(button, e) {
		var active = this.getContent().getActiveItem();
		if(typeof(active.refresh) === 'function')
			active.refresh();
	},
  	
    onMapTrackTap: function(vehicle) {
		HatioBB.nav.monitor('monitor_info');

		HatioBB.setting.set('monitoring_vehicle', vehicle.get('id'));
		HatioBB.setting.set('vehicle', vehicle.get('id'));
		HatioBB.setting.set('driver', vehicle.get('driver_id'));
    },

    onMapDriverTap: function(driver) {
		HatioBB.setting.set('driver', driver.get('id'));

		HatioBB.nav.driver();
    },

    onMapVehicleTap: function(vehicle) {
		HatioBB.setting.set('vehicle', vehicle.get('id'));

		HatioBB.nav.vehicle();
    },

	onImage : function(comp) {
		if(comp.config.itemId === 'driverImage')
			HatioBB.nav.driver();
		else
			HatioBB.nav.vehicle();
	},

    onShowMap: function(vehicle) {
		HatioBB.nav.monitor('monitor_map');

		HatioBB.setting.set('vehicle', vehicle);
    },

    onShowTrack: function(vehicle) {
		HatioBB.nav.monitor('monitor_info');

		HatioBB.setting.set('vehicle', vehicle);
    }

});
