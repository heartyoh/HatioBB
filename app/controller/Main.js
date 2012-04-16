Ext.define('HatioBB.controller.Main', {
    extend: 'Ext.app.Controller',

	requires : ['HatioBB.store.SubMenus'],
	
    config: {
        refs: {
            main: 'main',
            nav: 'nav',
            content: 'content'
        },
        control: {
			'#ext-viewport':{
				orientationchange: 'onOC'
			},
            '#nav_map' : {
                tap: 'onMap'
            },
            '#nav_info' : {
                tap: 'onInfo'
            },
            '#nav_incident' : {
                tap: 'onIncident'
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
			// this.getNav().setDocked('top');
			// this.getNav().setDocked('bottom');
			this.getNav().setDocked(null);
			// Ext.Anim.run(this.getNav(), 'fade', {
			//     out: true,
			// 	direction : 'left',
			//     autoClear: false
			// });
			// this.getNav().hide();
			// Ext.Msg.alert('hide');
		} else {
			this.getNav().setDocked('left');
			// Ext.Anim.run(this.getNav(), 'fade', {
			//     out: false,
			// 	direction : 'right',
			//     autoClear: false
			// });
			// this.getNav().show();
			// Ext.Msg.alert('show');
		}
			
		// Ext.Msg.alert('Orientation', newOrient + ':' + w + ':' + h);
	},

    onMap: function(button, e) {
		var monitor_map = this.getContent().getComponent('monitor_map');
		if(!monitor_map)
			monitor_map = this.getContent().add({
				xtype : 'monitor_map'
			});
		monitor_map.show();
		this.getContent().setActiveItem(monitor_map);
    },

    onInfo: function(button, e) {
		var monitor_info = this.getContent().getComponent('monitor_info');
		if(!monitor_info)
			monitor_info = this.getContent().add({
				xtype : 'monitor_info'
			});
		this.getContent().setActiveItem(monitor_info);
    },

    onIncident: function(button, e) {
		var monitor_incident = this.getContent().getComponent('monitor_incident');
		if(!monitor_incident)
			monitor_incident = this.getContent().add({
				xtype : 'monitor_incident',
				incident : button.config.incident
			});
		this.getContent().setActiveItem(monitor_incident);
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
