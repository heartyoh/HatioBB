Ext.define('HatioBB.view.monitor.Track', {
	extend : 'Ext.Panel',
	
	xtype : 'track',
	
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
				itemId : 'today',
				flex : 1,
				maxWidth : 160,
                html: '<a href="#">오늘</a><span>'
			}, 	{
                xtype: 'button',
				itemId : 'yesterday',
				flex : 1,
				maxWidth : 160,
                html: '<a href="#">어제</a><span>'
			}, 	{
                xtype: 'button',
				itemId : 'ago2days',
				flex : 1,
				maxWidth : 160,
                html: '<a href="#">2일전</a><span>'
			}, 	{
                xtype: 'button',
				itemId : 'ago3days',
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

	},
	
	getTrackLine : function() {
		return this.trackline;
	},

	setTrackLine : function(trackline) {
		if (this.trackline)
			this.trackline.setMap(null);
		this.trackline = trackline;
	},
	
	getMarkers : function() {
		return this.markers;
	},

	setMarkers : function(markers) {
		if (this.markers) {
			Ext.each(this.markers, function(marker) {
				marker.setMap(null);
			});
		}

		this.markers = markers;
	},

	resetMarkers : function() {
		if (this.markers) {
			Ext.each(this.markers, function(marker) {
				marker.setMap(null);
			});
		}

		this.markers = null;
	},

	clearInfoWindow : function() {
		if(this.infowindow)
			this.infowindow.setVisible(false);
	},
	
	getInfoWindow : function() {
		return this.infowindow;
	},

	setInfoWindow : function(infowindow) {
		if (this.infowindow) {
			this.infowindow.setMap(null);
		}
		
		this.infowindow = infowindow;
	}

});