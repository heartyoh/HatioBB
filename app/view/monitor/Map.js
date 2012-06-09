Ext.define('HatioBB.view.monitor.Map', {
	extend : 'Ext.Map',

	xtype : 'monitor_map',
	
	id : 'monitor_map',
	
	config : {
	    useCurrentLocation: false,
		mapOptions : {
			zoom : 10,
			maxZoom : 19,
			minZoom : 3,
			center : new google.maps.LatLng(System.props.lat, System.props.lng),
			mapTypeId : google.maps.MapTypeId.ROADMAP
		}	
	},

	initialize : function() {
		this.callParent();
		
		var self = this;
		
		var vehicleFilteredStore = Ext.getStore('VehicleFilteredStore');
		
		this.on('painted', function() {
			if(vehicleFilteredStore.isLoaded())
				self.refreshMap(vehicleFilteredStore);
			vehicleFilteredStore.on('refresh', self.refreshMap, self);
			HatioBB.setting.on('vehicle', self.onSelectVehicle, self);
			HatioBB.setting.on('driver', self.onSelectDriver, self);
		});
		
		this.on('erased', function() {
			vehicleFilteredStore.un('refresh', self.refreshMap, self);
			HatioBB.setting.un('vehicle', self.onSelectVehicle, self);
			HatioBB.setting.un('driver', self.onSelectDriver, self);
		});
		
		this.on('resize', function() {
			google.maps.event.trigger(self.getMap(), 'resize');
		});
		
		this.element.on({
			delegate : 'div.showVehicleTrack',
			tap : function(e) {
				self.fireEvent('tracktap', self.selectedMarker.record);
				e.stopEvent();
			}
		});
		
		this.element.on({
			delegate : 'div.showVehicleInfo',
			tap : function(e) {
				self.fireEvent('vehicletap', self.selectedMarker.record);
				e.stopEvent();
			}
		});
		
		this.element.on({
			delegate : 'div.showDriverInfo',
			tap : function(e) {
				self.fireEvent('drivertap', self.selectedMarker.driver_record);
				e.stopEvent();
			}
		});
	},
	
	refresh : function() {
		Ext.getStore('VehicleMapStore').load();
	},
	
	onSelectVehicle : function() {
		var store = Ext.getStore('VehicleFilteredStore');
		store.clearFilter(true);
		store.filter('id', HatioBB.setting.get('vehicle'));
	},
	
	onSelectDriver : function() {
		var store = Ext.getStore('VehicleFilteredStore');
		store.clearFilter(true);
		store.filter('driver_id', HatioBB.setting.get('driver'));
	},
	
	destroy : function() {
		this.resetMarkers();
		this.callParent();
	},
	
	getMarkers : function() {
		if(!this.markers)
			this.markers = {};
		return this.markers;
	},
	
	resetMarkers : function() {
		for(var vehicle in this.markers) {
			google.maps.event.clearListeners(this.markers[vehicle]);
			this.markers[vehicle].setMap(null);
		}
		this.clearInfoWindow();
		this.markers = {};
	},
	
	clearInfoWindow : function() {
		if(this.infowindow) {
			this.infowindow.setVisible(false);
		}
	},
	
	refreshMap : function(store) {
		var self = this;
		
		this.resetMarkers();
		
		var images = {
			'Running' : 'resources/images/statusDriving.png',
			'Idle' : 'resources/images/statusStop.png',
			'Incident' : 'resources/images/statusIncident.png',
			'Maint' : 'resources/images/statusMaint.png'
		};

		var bounds;
		
		var markerHandler = function() {
			self.clearInfoWindow();
			
			/* 'this' should be marker */
			var marker = this;
			var vr = marker.record;
			var dr = Ext.getStore('DriverBriefStore').getById(vr.get('driver_id'));
			marker.driver_record = dr;
			
			self.selectedMarker = marker;
			
			var imgsrc = 'resources/images/bgDriver.png';
			
			if(dr && dr.get('image_clip')) {
				if(HatioBB.setting.get('app_mode'))
					imgsrc = '/download?blob-key=' + dr.get('image_clip');
				else
					imgsrc = dr.get('image_clip');
			}
			
			var content = [
				'<div class="bubbleWrap status'+ vr.get('status') +'">',
					'<img src="' + imgsrc + '">',
					'<div class="showVehicleInfo">Vehicle : ' + vr.get('id') + '('+ vr.get('registration_number') + ')</div>',
					dr ? '<div class="showDriverInfo">Driver : ' + dr.get('id') + '('+ dr.get('name') + ')</div>'
					: '<div class="showDriverInfo">driver : ' + T('label.nodriver') + '</div>',
					//'<div class="showVehicleTrack">Show Recent Track</div>',
				'</div>'
			].join('');

			if(!self.infowindow) {
				self.infowindow = new Label({
					map : this.getMap()
				});
			}
			self.infowindow.bindTo('position', marker, 'position');
			self.infowindow.set('text', content);

			self.infowindow.setVisible(true);
		}

		store.each(function(record) {
			var vehicle = record.get('id');
			
			var latlng = new google.maps.LatLng(record.get('lat'), record.get('lng'));
			var marker = new google.maps.Marker({
				position : latlng,
				map : self.getMap(),
				icon : images[record.get('status')],
				record : record
			});

			if(!bounds)
				bounds = new google.maps.LatLngBounds(latlng, latlng);
			else
				bounds.extend(latlng);
			
			self.getMarkers()[vehicle] = marker;

			google.maps.event.addListener(marker, 'click', markerHandler);
		}, this);
		
		if(!bounds) {
			/* 아무런 위치 정보도 찾지 못한 경우 */
			var defaultPosition = new google.maps.LatLng(System.props.lat, System.props.lng)
			this.getMap().setCenter(defaultPosition);
	
			if(store.isLoaded()) {
				var content = [
					'<div class="bubbleWrap statusIdle">',
					'<div>위치 정보를 찾을 수 없습니다.</div>',
					'</div>'
				].join('');

				if(!self.infowindow) {
					self.infowindow = new Label({
						map : this.getMap()
					});
				}
				self.infowindow.set('position', defaultPosition);
				self.infowindow.set('text', content);

				self.infowindow.setVisible(true);
			}
		} else if(bounds.isEmpty() || bounds.getNorthEast().equals(bounds.getSouthWest())) {
			/* 한개짜리 디스플레이는 너무 시간이 짧아서인지, 센터를 잘 잡지 못한다.(새로 화면이 열리는 경우), 따라서 부득이 딜레이를 주었다.*/
			setTimeout(function() {
				self.getMap().setCenter(bounds.getNorthEast());
				self.getMap().setZoom(HatioBB.setting.get('auto_max_zoom') || 16);
				/* 한개짜리는 자동으로 마커 클릭이벤트를 발생시킨다. */
				var markers = self.getMarkers();
				for(var v in markers) {
					google.maps.event.trigger(markers[v], 'click');
				}
			}, 500);
		} else if(HatioBB.setting.get('autofit')){ 
			this.getMap().fitBounds(bounds);
		}
	}
});
