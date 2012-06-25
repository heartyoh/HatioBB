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
				cls : 'trackTab today',
				flex : 1,
				maxWidth : 160,
                tpl: '<div class="trackLabel"><span>{date}</span>' + T('label.today') + '</div>'
			}, 	{
                xtype: 'button',
				itemId : 'yesterday',
				cls : 'trackTab yesterday',
				flex : 1,
				maxWidth : 160,
                tpl: '<div class="trackLabel"><span>{date}</span>' + T('label.yesterday') + '</div>'
			}, 	{
                xtype: 'button',
				itemId : 'ago2days',
				cls : 'trackTab ago2days',
				flex : 1,
				maxWidth : 160,
                tpl: '<div class="trackLabel"><span>{date}</span>' + T('label.ago2days') + '</div>'
			}, 	{
                xtype: 'button',
				itemId : 'ago3days',
				cls : 'trackTab ago3days',
				flex : 1,
				maxWidth : 160,
                tpl: '<div class="trackLabel"><span>{date}</span>' + T('label.ago3days') + '</div>'
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
	
	// Maybe called by refresh button of header
	refresh: function() {
		// You may want delegate to controller..
		this.fireEvent('refresh');
	},
	
	resetTrackLines : function() {
		if(this.tracklines) {
			Ext.Array.each(this.tracklines, function(line) {
				line.setMap(null);
			});
		}
		
		this.tracklines = [];
	},
	
	unselectTrip: function() {
		this.clearInfoWindow();
		if(this.selectedTrack) {
			this.selectedTrack.setOptions({
				strokeColor : '#FF0000',
				strokeOpacity : 1,
				strokeWeight : 4
			});
		}
	},
	
	addTrackLine : function(map, traces, line, avg_v, distance) {
		var self = this;
		this.tracklines.push(line);
		
		var path = line.getPath();

		var first = new google.maps.Marker({
			position : path.getAt(0),
			map : map
		});
		var end = new google.maps.Marker({
			position : path.getAt(path.getLength() - 1),
			icon : 'resources/images/iconStartPoint.png',
			map : map
		});
		this.addTripMarkers(first);
		this.addTripMarkers(end);
		
		var i = 0;
		path.forEach(function(point) {
			var marker = new google.maps.Marker({
				position : point,
				icon : 'resources/images/iconPin.png',
				map : map,
				visible : false,
				trace : traces[i++]
			});
			self.addPathMarkers(marker);
			google.maps.event.addListener(marker, 'click', selectPath);
		});
		
		function selectPath(e) {
			var marker = this;
			self.clearInfoWindow();

			var trace = this.trace;
			var lat = trace.get('lat');
			var lng = trace.get('lng');
			
			HatioBB.map.getLocation(lat, lng, function(address) {
				var content = [
					'<div class="bubbleWrap">',
						'<div class="close"></div>',
						'<div class="trackBubble">',
							'<div>' + address + '</div>',
							'<div><span>'+ T('label.latitude') + '/' + T('label.longitude') +'</span>' + trace.get('lat').toFixed(2) + ' / ' + trace.get('lng').toFixed(2) + '</div>',
							'<div><span>'+ T('label.velocity') +'</span>' + trace.get('velocity') + ' KM/H' + '</div>',
							'<div><span>'+ T('label.time') +'</span>' + Ext.Date.format(trace.get('datetime'), 'Y-m-d H:i:s') + '</div>',
						'</div>',
					'</div>'
				].join('');

				if(!self.infowindow) {
					self.infowindow = HatioBB.label.create({
						map : marker.getMap(),
						xoffset : -110,
						yoffset : -150
					});
				}
				self.infowindow.set('position', e.latLng);
				self.infowindow.set('text', content);

				self.infowindow.setVisible(true);
			});
		}

		function selectTrip(e) {
			var marker = this;
			self.unselectTrip();

			self.selectedTrack = line;
			
			line.setOptions({
				strokeColor : '#CF0000',
				strokeOpacity : 0.7,
				strokeWeight : 6
			});
			
			var path = line.getPath();
			
			var startTime = Ext.Date.format(traces[traces.length - 1].get('datetime'), 'Y-m-d H:i:s');
			var endTime = Ext.Date.format(traces[0].get('datetime'), 'Y-m-d H:i:s');
			var driverId = traces[0].get('driver_id');
			var vehicleId = traces[0].get('vehicle_id');
			
			var driver = Ext.getStore('DriverBriefStore').getById(driverId);
			var vehicle = Ext.getStore('VehicleMapStore').getById(vehicleId);
			
			var content = [
				'<div class="bubbleWrap">',
					'<div class="close"></div>',
					'<div class="trackBubble">',
						'<div><span>'+ T('label.vehicle') +'</span>' + vehicleId + ' - ' + vehicle.get('registration_number') + '</div>',
						'<div><span>'+ T('label.driver') +'</span>' + driverId + ' - ' + driver.get('name') + '</div>',
						'<div><span>주행시작</span>' + startTime + '</div>',
						'<div><span>주행종료</span>' + endTime + '</div>',
						'<div><span>'+ T('label.average_speed') +'</span>' + Math.floor(avg_v) + ' KM/H</div>',
						'<div><span>'+ T('label.run_dist') +'</span>' + distance.toFixed(2) + ' KM</div>',
					'</div>',
				'</div>'
			].join('');

			if(!self.infowindow) {
				self.infowindow = HatioBB.label.create({
					map : marker.getMap(),
					xoffset : -110,
					yoffset : -150
				});
			}
			self.infowindow.set('position', e.latLng);
			self.infowindow.set('text', content);

			self.infowindow.setVisible(true);
		}

		// TODO Remove EventListeners
		google.maps.event.addListener(line, 'click', selectTrip);
		google.maps.event.addListener(first, 'click', selectTrip);
		google.maps.event.addListener(end, 'click', selectTrip);
	},
	
	getTrackLines : function() {
		return this.tracklines;
	},
	
	getPathMarkers : function() {
		return this.pathMarkers;
	},
	
	setPathMarkers : function(markers) {
		if(this.pathMarkers) {
			Ext.each(this.pathMarkers, function(marker) {
				marker.setMap(null);
			});
		}
		this.pathMarkers = markers;
	},
	
	addPathMarkers : function(markers) {
		if(!this.pathMarkers)
			this.pathMarkers = [];
		this.pathMarkers.push(markers);
	},
	
	resetPathMarkers : function() {
		if(this.pathMarkers) {
			Ext.each(this.pathMarkers, function(marker) {
				marker.setMap(null);
			});
		}
		
		this.pathMarkers = null;
	},

	getTripMarkers : function() {
		return this.tripMarkers;
	},

	setTripMarkers : function(markers) {
		if (this.tripMarkers) {
			Ext.each(this.tripMarkers, function(marker) {
				marker.setMap(null);
			});
		}

		this.tripMarkers = markers;
	},
	
	addTripMarkers : function(markers) {
		if(!this.tripMarkers)
			this.tripMarkers = [];
		this.tripMarkers.push(markers);
	},

	resetTripMarkers : function() {
		if (this.tripMarkers) {
			Ext.each(this.tripMarkers, function(marker) {
				marker.setMap(null);
			});
		}

		this.tripMarkers = null;
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