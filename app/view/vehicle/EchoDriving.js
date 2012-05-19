Ext.define('HatioBB.view.vehicle.EchoDriving', {
	extend : 'Ext.Panel',
	
	requires : ['HatioBB.view.chart.vehicle.EchoRadar'],

	xtype : 'vehicle_echo_driving',
	
	config : {
		layout : 'fit',
		
		items : [{
			xtype : 'chart_v_echo_radar'
		}]
	}
});