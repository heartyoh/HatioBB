Ext.define('HatioBB.view.driver.Track', {
	extend : 'Ext.Panel',
	
	xtype : 'driver_track',
	
	config : {
		cls : 'grayBg',
		
        layout: {
            type: 'vbox',
            align: 'stretch'
        },

		items : [{
			xtype: 'panel',
			height : 45,
			cls : 'shotHList',
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [{
                xtype: 'button',
				flex : 1,
				maxWidth : 160,
                html: '<a href="#">오늘</a><span>'
			}, 	{
                xtype: 'button',
				flex : 1,
				maxWidth : 160,
                html: '<a href="#">어제</a><span>'
			}, 	{
                xtype: 'button',
				flex : 1,
				maxWidth : 160,
                html: '<a href="#">2일전</a><span>'
			}, 	{
                xtype: 'button',
				flex : 1,
				maxWidth : 160,
                html: '<a href="#">3일전</a><span>'
			}]
        }, 	{
            xtype: 'map',
		    useCurrentLocation: false,
			flex : 1,
			mapOptions : {
				zoom : 10,
				maxZoom : 19,
				minZoom : 3,
				// center : null,
				center : new google.maps.LatLng(System.props.lat, System.props.lng),
				mapTypeId : google.maps.MapTypeId.ROADMAP
			}	
		}]

	}
});