Ext.define('HatioBB.controller.monitor.Track', {
    extend: 'Ext.app.Controller',

	requires : ['HatioBB.view.monitor.Track'],
	
    config: {
        refs: {
            track : 'track',
			map : 'track map',
			buttonDays : 'track button'
        },

        control: {
			track : {
				initialize : 'onInitialize'
            },
			buttonDays : {
				tap : 'onButtonDays'
			}
        }
    },

	onInitialize: function() {
    },

	onButtonDays: function(day) {
		var from, to;
		
		from = new Date();
		from.setHours(0);
		from.setMinutes(0);
		from.setSeconds(0);
		from.setMilliseconds(0);

		switch(day.getItemId()) {
			case 'today' :
				break;
			case 'yesterday' :
				from.setDate(from.getDate() - 1);
				break;
			case 'ago2days' :
			from.setDate(from.getDate() - 2);
			break;
			case 'ago3days' :
			from.setDate(from.getDate() - 3);
			break;
		}

		to = new Date(from.getTime() + 24 * 60 * 60 * 1000);

		this.from = from;
		this.to = to;
		
		this.refresh();
	},

	refresh : function() {
		var self = this;
		
		var driver = HatioBB.setting.get('driver');

		if(driver === this.driver) 
			return;
			
		var store = Ext.getStore('TrackStore');
		var filter = [{
			property : 'date',
			/* for Unix timestamp (in seconds) */
			value : Math.round(this.from.getTime() / 1000)
		}];

		// TODO driver, vehicle 중의 한가지 filter 를 적용할 수 있도록 조건 처리할 것.
		if(driver) {
			filter.push({
				property : 'driver_id',
				value : ''
			});
		} else {
			filter.push({
				property : 'vehicle_id',
				value : ''
			});
		}
		
		store.clearFilter(true);
		store.filter(filter);
		store.load(function(records) {
			self.refreshMap(records);
		});
	},
	
	refreshMap : function(records) {
		var map = this.getMap().getMap();
		this.getTrack().setTrackLine(new google.maps.Polyline({
			map : map,
			strokeColor : '#FF0000',
			strokeOpacity : 1.0,
			strokeWeight : 4
		}));
		this.getTrack().setMarkers(null);
		this.getTrack().clearInfoWindow();

		var path = this.getTrack().getTrackLine().getPath();
		// var bounds;
		// var latlng;

		// var path = [];
		var bounds, latlng, last;

		Ext.Array.each(records, function(record) {
			var lat = record.get('lat');
			var lng = record.get('lng');

			if(lat !== 0 || lng !== 0) {
				latlng = new google.maps.LatLng(lat, lng);
				path.push(latlng);
				if (!bounds)
					bounds = new google.maps.LatLngBounds(latlng, latlng);
				else
					bounds.extend(latlng);
			}
			
			if(last) {
				console.log(last.get('datetime') - record.get('datetime'));
				if(last.get('datetime') > record.get('datetime') + 10000) {
					console.log('new trip');
				}
			}
			last = record;
		});

		if (path.getLength() === 0) {
			var lat = record.get('lat');
			var lng = record.get('lng');
			var defaultLatlng = null;
			
			if(!lat && !lng) {
				defaultLatlng = new google.maps.LatLng(System.props.lat, System.props.lng);
			} else {
				defaultLatlng = new google.maps.LatLng(lat, lng);
			}
			path.push(defaultLatlng);
			bounds = new google.maps.LatLngBounds(defaultLatlng, defaultLatlng);
		}

		if (bounds.isEmpty() || bounds.getNorthEast().equals(bounds.getSouthWest())) {
			map.setCenter(bounds.getNorthEast());
		} else {
			map.fitBounds(bounds);
		}

		var first = path.getAt(0);

		if (first) {
			var start = new google.maps.Marker({
				position : new google.maps.LatLng(first.lat(), first.lng()),
				map : map
			});

			var last = path.getAt(path.getLength() - 1);

			var end = new google.maps.Marker({
				position : new google.maps.LatLng(last.lat(), last.lng()),
				icon : 'resources/images/iconStartPoint.png',
				map : map
			});

			this.getTrack().setMarkers([ start, end ]);
			
			if(records.length === 0) {
				var content = [
					'<div class="bubbleWrap status'+ record.get('status') +'">',
					'<div>최근 24시간 이내 주행이력이 없습니다.</div>',
					'</div>'
				].join('');

				if(!self.getTrack().getInfoWindow()) {
					self.getTrack().setInfoWindow(HatioBB.label.create({
						map : map,
						xoffset : -110,
						yoffset : -100
					}));
				} else {
					self.getTrack().getInfoWindow().setMap(map);
				}
				self.getTrack().getInfoWindow().bindTo('position', end, 'position');
				self.getTrack().getInfoWindow().set('text', content);

				self.getTrack().getInfoWindow().setVisible(true);
			}
		}
	},
	
	buildTrip : function() {
		
	}
});
