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
				cls : 'trackTab today x-button-active',
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
	
	resetTrackLines : function() {
		if(this.tracklines) {
			Ext.Array.each(this.tracklines, function(line) {
				line.setMap(null);
			});
		}
		
		this.tracklines = [];
	},
	
	addTrackLine : function(line, map) {
		var self = this;
		this.tracklines.push(line);
		
		var path = line.getPath();

		var first = new google.maps.Marker({
			// position : new google.maps.LatLng(path.getAt(0).lat(), path.getAt(0).lng()),
			position : path.getAt(0),
			map : map
		});
		var end = new google.maps.Marker({
			// position : new google.maps.LatLng(path.getAt(path.getLength() - 1).lat(), path.getAt(path.getLength() - 1).lng()),
			position : path.getAt(path.getLength() - 1),
			icon : 'resources/images/iconStartPoint.png',
			map : map
		});
		this.addTripMarkers(first);
		this.addTripMarkers(end);
		
		path.forEach(function(point) {
			var marker = new google.maps.Marker({
				position : point,
				icon : 'resources/images/iconPin.png',
				map : map,
				visible : false,
				// animation : google.maps.Animation.DROP
			});
			self.addPathMarkers(marker);
			google.maps.event.addListener(marker, 'click', selectPath);
		});
		
		// for (var i =0; i < path.length; i++) {
		// 	setTimeout(function() {
		// 		var marker = new google.maps.Marker({
		// 			position : path[i],
		// 			icon : 'resources/images/iconPin.png',
		// 			map : map,
		// 			visible : false,
		// 			animation : google.maps.Animation.DROP
		// 		});
		// 		self.addPathMarkers(marker);
		// 		google.maps.event.addListener(marker, 'click', selectPath);
		// 	}, i * 200);
		// }
		
		function selectPath(e) {
			self.clearInfoWindow();
			
			console.log(arguments);
			
			var content = [
				'<div class="bubbleWrap">',
					'<div class="close"></div>',
					'<div class="trackBubble">',
						'<div>경기도 성남시 분당구 수내동 경기도 성남시 분당구 수내동</div>',
						'<div><span>위도/경도</span>'+ '1111111/22222222' + '</div>',
						'<div><span>속도</span>'+ '36 KM/H' + '</div>',
						'<div><span>시간</span>'+ '2012-06-30 12:22:33' + '</div>',
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

		function selectTrip(e) {
			unselectTrip();

			self.selectedTrack = line;
			
			line.setOptions({
				strokeColor : '#CF0000',
				strokeOpacity : 0.7,
				strokeWeight : 6
			});
			
			var path = line.getPath();
			
			var content = [
				'<div class="bubbleWrap">',
					'<div class="close"></div>',
					'<div class="trackBubble">',
						'<div><span>차량</span>V001 - 가 1234</div>',
						'<div><span>운전자</span>D001 - 오현석</div>',
						'<div><span>주행시작</span>2012년 1월 3일 12:00:00</div>',
						'<div><span>주행종류</span>2012년 1월 3일 12:05:00</div>',
						'<div><span>평균시속</span>35 KM/H</div>',
						'<div><span>주행거리</span>12.5 KM</div>',
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
		
		function unselectTrip() {
			self.clearInfoWindow();
			if(self.selectedTrack) {
				self.selectedTrack.setOptions({
					strokeColor : '#FF0000',
					strokeOpacity : 1,
					strokeWeight : 4
				});
			}
		}
		
		function showPathMarkers() {
			var pathMarkers = self.getPathMarkers();
			if(!pathMarkers)
				return;
			
			var density = Math.max(1, (16 - map.getZoom()) * 3);
			for(var i = 0;i < pathMarkers.length;i++) {
				pathMarkers[i].setOptions({
					visible : (i % density) ? false : true,
					animation : google.maps.Animation.DROP
				});
			}
		}
		
		google.maps.event.addListener(line, 'click', selectTrip);
		google.maps.event.addListener(first, 'click', selectTrip);
		google.maps.event.addListener(end, 'click', selectTrip);
		
		// TODO 뷰에 하나만으로 옮겨야.
		google.maps.event.addListener(map, 'click', unselectTrip);
		google.maps.event.addListener(map, 'zoom_changed', showPathMarkers);
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