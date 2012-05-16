Ext.define('HatioBB.view.driver.Driver', {
	extend : 'Ext.tab.Panel',
	
	requires : [
	'HatioBB.view.driver.Info',
	'HatioBB.view.driver.EchoDriving'
	],
	
	xtype : 'driver',
	
	id : 'driver',
	
	config : {
		tabBarPosition: 'bottom',
	    
		items : [{
			xtype : 'driver_info',
			title : 'Info'
		}, {
			xtype : 'driver_echo_driving',
			title : 'Echo Driving'
		}]
	}
});