Ext.define('HatioBB.controller.monitor.Track', {
    extend: 'Ext.app.Controller',

	requires : ['HatioBB.view.monitor.Track'],
	
    config: {
        refs: {
            track : 'track',
			map : 'track map',
			buttonDays : 'track button',
			buttonToday : 'track button[itemId=today]',
			buttonYesterday : 'track button[itemId=yesterday]',
			buttonAgo2days : 'track button[itemId=ago2days]',
			buttonAgo3days : 'track button[itemId=ago3days]'
        },

        control: {
			track : {
				initialize : 'onInit',
				activate : 'onActivate'
            },
			buttonDays : {
				tap : 'onButtonDays'
			}
        }
    },

	onInit : function() {
		var self = this;
		
		var now = new Date();
		this.getButtonToday().setData({date : Ext.Date.format(now, 'D Y-m-d')});
		now.setDate(now.getDate() - 1);
		this.getButtonYesterday().setData({date : Ext.Date.format(now, 'D Y-m-d')})
		now.setDate(now.getDate() - 1);
		this.getButtonAgo2days().setData({date : Ext.Date.format(now, 'D Y-m-d')})
		now.setDate(now.getDate() - 1);
		this.getButtonAgo3days().setData({date : Ext.Date.format(now, 'D Y-m-d')})
		
		this.getTrack().on('painted', function() {
			if(self.getTrack().config.queryOn === 'vehicle')
				HatioBB.setting.on('vehicle', self.refresh, self);
			else
				HatioBB.setting.on('driver', self.refresh, self);
		});
		
		this.getTrack().on('erased', function() {
			if(self.getTrack().config.queryOn === 'vehicle')
				HatioBB.setting.un('vehicle', self.refresh, self);
			else
				HatioBB.setting.un('driver', self.refresh, self);
		});
	},

	onActivate: function() {
		this.refresh();
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
		
		if(!this.from || !this.to) {
			var from, to;

			from = new Date();
			from.setHours(0);
			from.setMinutes(0);
			from.setSeconds(0);
			from.setMilliseconds(0);

			to = new Date(from.getTime() + 24 * 60 * 60 * 1000);
			
			this.from = from;
			this.to = to;
		}
				
		if(this.getTrack().config.queryOn === 'driver')
			var driver = HatioBB.setting.get('driver');
		else
			var vehicle = HatioBB.setting.get('vehicle');

		var store = Ext.getStore('TrackStore');
		var filter = [{
			property : 'date',
			/* for Unix timestamp (in seconds) */
			value : Math.round(this.from.getTime() / 1000)
		}];

		if(driver) {
			filter.push({
				property : 'driver_id',
				value : driver
			});
		} else {
			filter.push({
				property : 'vehicle_id',
				value : vehicle
			});
		}
		
		store.clearFilter(true);
		store.filter(filter);
		store.load(function(records) {
			self.refreshMap(records);
		});
	},
	
	refreshMap : function(records) {
		var self = this;
		var map = this.getMap().getMap();
		
		this.getTrack().resetTrackLines();
		this.getTrack().setTripMarkers(null);
		this.getTrack().resetPathMarkers();
		this.getTrack().clearInfoWindow();

		var trip;
		var traces = [];
		var bounds, latlng, last;

		// TODO PathMarkers must be here.
		Ext.Array.each(records, function(record) {
			if(!trip) {
				trip = new google.maps.Polyline({
					map : map,
					strokeColor : '#FF0000',
					strokeOpacity : 1.0,
					strokeWeight : 4
				});
				path = trip.getPath();
				if(last) {
					path.push(latlng);
					traces.push(last);
				}
			}
			
			var lat = record.get('lat');
			var lng = record.get('lng');

			if(lat !== 0 || lng !== 0) {
				latlng = new google.maps.LatLng(lat, lng);
				if (!bounds)
					bounds = new google.maps.LatLngBounds(latlng, latlng);
				else
					bounds.extend(latlng);
			}
			
			// 30분 Gap은 새로운 Trip으로 판단한다.
			if(last && (last.get('datetime') > record.get('datetime') + 30 * 60 * 1000)) {
				// TODO ... How to make this informations.
				// var tripInfo = {
				// 	velocity : 100,
				// 	distance : 200,
				// 	startTime : ,
				// 	endTime : ,
				// 	startPos : ,
				// 	endPos : ,
				// 	vehicle : ,
				// 	driver : 
				// };
				self.getTrack().addTrackLine(map, traces, trip);

				trip = null;
				path = null;
			}
				
			if(trip) {
				path.push(latlng);
				traces.push(record);
			}

			last = record;
		});

		if (!bounds) {
			var defaultLatlng = new google.maps.LatLng(System.props.lat, System.props.lng);
			bounds = new google.maps.LatLngBounds(defaultLatlng, defaultLatlng);

			var content = [
				'<div class="bubbleWrap">',
				'<div>기간내 주행이력이 없습니다.</div>',
				'</div>'
			].join('');

			if(!this.getTrack().getInfoWindow()) {
				this.getTrack().setInfoWindow(HatioBB.label.create({
					map : map,
					xoffset : -110,
					yoffset : -100
				}));
			} else {
				this.getTrack().getInfoWindow().setMap(map);
			}
			this.getTrack().getInfoWindow().set('position', defaultLatlng);
			this.getTrack().getInfoWindow().set('text', content);

			this.getTrack().getInfoWindow().setVisible(true);
		} else {
			this.getTrack().addTrackLine(map, traces, trip);
		}

		if (bounds.isEmpty() || bounds.getNorthEast().equals(bounds.getSouthWest())) {
			map.setCenter(bounds.getNorthEast());
		} else {
			map.fitBounds(bounds);
		}
	}
	
});
