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
	
	resetTrackLines : function() {
		if(this.tracklines) {
			Ext.Array.each(this.tracklines, function(line) {
				line.setMap(null);
			});
		}
		
		this.tracklines = [];
	},
	
	addTrackLine : function(line) {
		var self = this;
		this.tracklines.push(line);
		
		function mouseclick(e) {
			self.clearInfoWindow();
			if(self.selectedTrack) {
				self.selectedTrack.setOptions({
					strokeOpacity : 1,
					strokeWeight : 4
				});
			}
			
			self.selectedTrack = line;
			
			line.setOptions({
				strokeOpacity : 0.5,
				strokeWeight : 10
			});
			
			var path = line.getPath();
			
			var content = [
				'<div class="bubbleWrap">',
					'<div class="close"></div>',
					'<div>',
						'<div>차량 : '+ 'V001 - 가 1234' + '</div>',
						'<div>운전자 : '+ 'D001 - 오현석' + '</div>',
					'</div>',
					'<div>',
						'<div>주행 시작 : '+ '2012년 1월 3일 12:00:00' + '</div>',
						'<div>주행 종류 : '+ '2012년 1월 3일 12:05:00' + '</div>',
					'</div>',
					'<div>',
						'<div>평균 시속 : '+ '35 KM/H' + '</div>',
						'<div>주행 거리 : '+ '12.5 KM' + '</div>',
					'</div>',
				'</div>'
			].join('');

			if(!self.infowindow) {
				self.infowindow = HatioBB.label.create({
					map : this.getMap(),
					xoffset : -110,
					yoffset : -150
				});
			}
			self.infowindow.set('position', e.latLng);
			self.infowindow.set('text', content);

			self.infowindow.setVisible(true);
		}
		
		google.maps.event.addListener(line, 'click', mouseclick);
	},
	
	getTrackLines : function() {
		return this.tracklines;
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