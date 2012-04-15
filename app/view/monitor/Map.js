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
		
		var interval = null;
		var vehicleMapStore = null;
		// var incidentStore = null;
		
		vehicleMapStore = Ext.getStore('VehicleMapStore');
		// incidentStore = Ext.getStore('RecentIncidentStore');
		var vehicleFilteredStore = Ext.getStore('VehicleFilteredStore');
		
		vehicleFilteredStore.on('refresh', function() {
			// if(self.isVisible()) {
				// self.refreshMap(vehicleFilteredStore, self.sub('autofit').getValue());
				self.refreshMap(vehicleFilteredStore, true);
			// }
		});
		
		vehicleMapStore.load();
		
		/*
		 * TODO 디폴트로 1분에 한번씩 리프레쉬하도록 함.
		 */
		this.on('painted', function() {
			interval = setInterval(function() {
				vehicleMapStore.load();
				// incidentStore.load(); // TODO Incident Store는 Map과 관련이 없으므로, 다른 화면으로 이주시켜라.
			}, 10000);
		});
		
		this.on('erased', function() {
			clearInterval(interval);
			// this.resetMarkers();
		});
		// });
		
		// this.on('show', function() {
			// google.maps.event.trigger(self, 'resize');
			// if(self.sub('autofit').getValue())
				// self.refreshMap(Ext.getStore('VehicleFilteredStore'), true);
		// });
		
		// this.sub('autofit').on('change', function(check, newValue) {
		// 	if(newValue)
		// 		self.refreshMap(Ext.getStore('VehicleFilteredStore'), newValue);
		// });

		// this.sub('refreshterm').on('change', function(combo, newValue) {
		// 	if(newValue) {
		// 		clearInterval(interval);
		// 		interval = setInterval(function() {
		// 			vehicleMapStore.load();
		// 			incidentStore.load();
		// 		}, newValue * 1000);
		// 	}
		// });
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
	
	// getLabels : function() {
	// 	if(!this.labels)
	// 		this.labels = {};
	// 	return this.labels;
	// },
	
	// resetLabels : function() {
	// 	for ( var vehicle in this.labels) {
	// 		this.labels[vehicle].setMap(null);
	// 	}
	// 	this.labels = {};
	// },
	
	resetMarkers : function() {
		for ( var vehicle in this.markers) {
			google.maps.event.clearListeners(this.markers[vehicle]);
			this.markers[vehicle].setMap(null);
		}
		this.markers = {};
	},
	
	/*
	 * refreshMap : scope
	 */
	refreshMap : function(store, autofit) {
		this.resetMarkers();
		// this.resetLabels();
		
		var images = {
			'Running' : 'resources/images/statusDriving.png',
			'Idle' : 'resources/images/statusStop.png',
			'Incident' : 'resources/images/statusIncident.png',
			'Maint' : 'resources/images/statusMaint.png'
		};

		var bounds;
		
		store.each(function(record) {
			var vehicle = record.get('id');
			var driver = record.get('driver_id');
			var driverRecord = Ext.getStore('DriverBriefStore').findRecord('id', driver);
			
			var latlng = new google.maps.LatLng(record.get('lattitude'), record.get('longitude'));
			
			var marker = new google.maps.Marker({
				position : latlng,
				map : this.getMap(),
				status : record.get('status'),
				icon : images[record.get('status')],
				title : driverRecord ? driverRecord.get('name') : driver,
				tooltip : record.get('registration_number') + "(" + (driverRecord ? driverRecord.get('name') : driver) + ")"
			});

			if(!bounds)
				bounds = new google.maps.LatLngBounds(latlng, latlng);
			else
				bounds.extend(latlng);
			
			// var label = new Label({
			// 	map : this.getMap()
			// });
			// label.bindTo('position', marker, 'position');
			// label.bindTo('text', marker, 'tooltip');

			this.getMarkers()[vehicle] = marker;
			// this.getLabels()[vehicle] = label;

			google.maps.event.addListener(marker, 'click', function() {
				GreenFleet.doMenu('information');
				GreenFleet.getMenu('information').setVehicle(record);
			});
		}, this);
		
		if(!bounds) {
			this.getMap().setCenter(new google.maps.LatLng(System.props.lattitude, System.props.longitude));
		} else if(bounds.isEmpty() || bounds.getNorthEast().equals(bounds.getSouthWest())) {
			this.getMap().setCenter(bounds.getNorthEast());
		} else if(autofit){ // 자동 스케일 조정 경우 
			this.getMap().fitBounds(bounds);
//		} else { // 자동 스케일 조정이 아니어도, 센터에 맞추기를 한다면, 이렇게.
//			this.getMap().setCenter(bounds.getCenter());
		}
	}
});
