Ext.define('HatioBB.view.driver.EchoDriving', {
	extend : 'Ext.Panel',
	
	requires : ['HatioBB.view.chart.driver.EchoRadar'],
	
	xtype : 'driver_echo_driving',
	
	config : {
		layout : 'fit',
		
		items : [{
			xtype : 'chart_d_echo_radar'
		}]
	}
});
