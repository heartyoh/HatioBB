Ext.define('HatioBB.controller.Main', {
    extend: 'Ext.app.Controller',

	requires : ['HatioBB.store.SubMenus'],
	
    config: {
        refs: {
            main: 'main',
            nav: 'nav',
            content: 'content',
			nav1 :'nav1'
        },
        control: {
            '#nav_menu button' : {
                tap: 'onMenu'
            },
			'#nav_oper' : {
				tap : 'onDriver'
			},
			'#nav_res' : {
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
			}
        }
    },

    onMenu: function(button, e) {
		this.getNav().setNavigationBar(true);
		
		var text = button.getText();
		var topMenu = Ext.getStore('Menus').findRecord('text', text);
		var store = Ext.create('HatioBB.store.SubMenus', {
			data : topMenu.get('children')
		});
		
		this.getNav().push({
			xtype : 'nav_menu',
			title : text,
			store : store
		});
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
