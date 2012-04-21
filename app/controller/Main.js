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
			'#nav #incidents button' : {
				tap : 'onIncident'
			}
        }
    },

	onOC : function(me, newOrient,w,h) {
		if(newOrient === 'portrait') {
			this.getNav().setDocked(null).hide();
		} else {
			this.getNav().setDocked('left').show();
		}
	},
	
    onMap: function(button, e) {
		var monitor_map = this.getContent().getComponent('monitor_map');
		if(!monitor_map)
			monitor_map = this.getContent().add({
				xtype : 'monitor_map'
			});
		this.getContent().setActiveItem(monitor_map);
		this.getHeader().setActiveStatus(button);
    },

    onInfo: function(button, e) {
		var monitor_info = this.getContent().getComponent('monitor_info');
		if(!monitor_info)
			monitor_info = this.getContent().add({
				xtype : 'monitor_info'
			});
		this.getContent().setActiveItem(monitor_info);
		this.getHeader().setActiveStatus(button);
    },

    onIncident: function(button, e) {
		var monitor_incident = this.getContent().getComponent('monitor_incident');
		if(!monitor_incident)
			monitor_incident = this.getContent().add({
				xtype : 'monitor_incident'
			});
		this.getContent().setActiveItem(monitor_incident);
		/* 여러 경로의 button동작을 통해서 들어오는 것을 감안함. */
		if(button.config.incident)
			monitor_incident.setIncident(button.config.incident);

		this.getHeader().setActiveStatus(button);
    },

	onCollapse : function(button, e) {
		if(this.getNav().getDocked()) {
			this.getNav().setDocked(null).hide();
		} else {
			this.getNav().setDocked('left').show();
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
    }

});
