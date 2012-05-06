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
			center : new google.maps.LatLng(System.props.lattitude, System.props.longitude),
			mapTypeId : google.maps.MapTypeId.ROADMAP
		}	
	},

	initialize : function() {
		this.callParent();
		
		var self = this;
		
		var vehicleFilteredStore = Ext.getStore('VehicleFilteredStore');
		
		this.on('painted', function() {
			self.refreshMap(vehicleFilteredStore);
			vehicleFilteredStore.on('refresh', self.refreshMap, self);
		});
		
		this.on('erased', function() {
			vehicleFilteredStore.un('refresh', self.refreshMap, self);
		});
		
		this.on('resize', function() {
			google.maps.event.trigger(self.getMap(), 'resize');
		});
		
		this.element.on({
			delegate : 'div.showVehicleInfo',
			tap : function() {
				self.fireEvent('vehicletap', self.selectedMarker.record);
			}
		});
	},
	
	refresh : function() {
		Ext.getStore('VehicleMapStore').load();
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
		if(this.infowindow)
			this.infowindow.close();
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
			
			self.selectedMarker = marker;
			
			var content = [
				'<div>vehicle : ' + vr.get('id') + '('+ vr.get('registration_number') + ')</div>',
				'<div>driver : ' + dr.get('id') + '('+ dr.get('name') + ')</div>',
				'<div>status : '+ vr.get('status') +'</div>',
				'<div class="showVehicleInfo">Show Details</div>'
			].join('');

			self.infowindow = new google.maps.InfoWindow({ 
				content: content
			});

			self.infowindow.open(self.getMap(), marker);
		}

		store.each(function(record) {
			var vehicle = record.get('id');
			
			var latlng = new google.maps.LatLng(record.get('lattitude'), record.get('longitude'));
			
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
			this.getMap().setCenter(new google.maps.LatLng(System.props.lattitude, System.props.longitude));
		} else if(bounds.isEmpty() || bounds.getNorthEast().equals(bounds.getSouthWest())) {
			this.getMap().setCenter(bounds.getNorthEast());
		} else if(HatioBB.setting.get('autofit')){ 
			this.getMap().fitBounds(bounds);
		}
	}
});
