Ext.define('HatioBB.view.monitor.Info', {
    extend: 'Ext.Panel',

    xtype: 'monitor_info',

    id: 'monitor_info',

    config: {
	    layout: 'fit'
    },

    constructor: function(config) {
        config.items = [{
            xtype: 'container',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'container',
				height : 135,
				cls : 'grayBg',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: this.buildVehicleInfo()
            }, {
				xtype: 'panel',
				height : 45,
				itemId : 'incidents',
				cls : 'shotHList',
				layout : {
					type : 'hbox',
					align : 'stretch'
				}
			}, {
	            xtype: 'map',
			    useCurrentLocation: false,
				flex : 1,
				mapOptions : {
					zoom : 10,
					maxZoom : 19,
					minZoom : 3,
					center : null,
					// center : new google.maps.LatLng(System.props.lattitude, System.props.longitude),
					mapTypeId : google.maps.MapTypeId.ROADMAP
				}	
	        }
            ]
        }];

        this.callParent(arguments);

		var self = this;

		this.on('painted', function() {
			HatioBB.setting.on('vehicle', self.onSelectVehicle, self);
			HatioBB.setting.on('driver', self.onSelectDriver, self);
			
			self.refresh();
		});
		
		this.on('erased', function() {
			HatioBB.setting.un('vehicle', self.onSelectVehicle, self);
			HatioBB.setting.un('driver', self.onSelectDriver, self);
		});
		
		this.on('resize', function() {
			google.maps.event.trigger(self.getMap(), 'resize');
		});
    },

	refresh : function() {
		this.setVehicle();
	},
	
	onSelectDriver : function() {
		if(this.onProcessing)
			return;
		
		var store = Ext.getStore('VehicleMapStore');
		var vehicle = store.findRecord('driver_id', HatioBB.setting.get('driver'));

		this.setVehicle(vehicle);
	},
	
	onSelectVehicle : function() {
		if(this.onProcessing)
			return;
		
		var store = Ext.getStore('VehicleMapStore');
		var vehicle = store.findRecord('id', HatioBB.setting.get('vehicle'));

		this.setVehicle(vehicle);
	},
	
    setVehicle: function(vehicle) {
		var self = this;
		
        if (!vehicle) {
			var vid = HatioBB.setting.get('vehicle');
			if(vid) {
				vehicle = Ext.getStore('VehicleMapStore').findRecord('id', vid);
				if(!vehicle && !this.isHidden()) {
					setTimeout(function() {
						self.setVehicle();
					}, 3000);
					return;
				}
			} else {
				var did = HatioBB.setting.get('driver');
				if(did) {
					vehicle = Ext.getStore('VehicleMapStore').findRecord('driver_id', vid);
				} else {
		        	return;
				}
			}
		}
		
		if(!vehicle)
			return;
	
		var vid = vid || vehicle.get('id');
		var did = did || vehicle.get('driver_id');
		
		try {
			this.onProcessing = true;
			if(vid && (vid !== HatioBB.setting.get('vehicle')))
				HatioBB.setting.set('vehicle', vid);
			if(did && (did !== HatioBB.setting.get('driver_id')))
				HatioBB.setting.set('driver', did);
		} finally {
			this.onProcessing = false;
		}
		
		/*
		 * Get Vehicle Information (Image, Registration #, ..) from
		 * VehicleStore
		 */
		var vehicleStore = Ext.getStore('VehicleMapStore');
		var vehicleRecord = vehicleStore.findRecord('id', vehicle.get('id'));
		var vehicleImageClip = vehicleRecord.get('image_clip');
		var vimage = self.sub('vehicleImage');

		if (vehicleImageClip) {
			if(HatioBB.setting.get('app_mode'))
				vimage.setSrc('/download?blob-key=' + vehicleImageClip);
			else
				vimage.setSrc(vehicleImageClip);
		} else {
			vimage.setSrc('resources/images/bgVehicle.png');
		}

		/*
		 * Get Driver Information (Image, Name, ..) from DriverStore
		 */
		var driverStore = Ext.getStore('DriverBriefStore');
		var driverRecord = driverStore.findRecord('id', vehicle.get('driver_id'));
		var driver = driverRecord.get('id');
		var driverImageClip = driverRecord.get('image_clip');
		var dimage = self.sub('driverImage');
		
		if (driverImageClip) {
			if(HatioBB.setting.get('app_mode'))
				dimage.setSrc('/download?blob-key=' + driverImageClip);
			else
				dimage.setSrc(driverImageClip);
		} else {
			dimage.setSrc('resources/images/bgDriver.png');
		}
		vehicle.set('driver_name', driverRecord.get('name'));

		vehicle.set('location', 'Resolving ..');
		this.getLocation(vehicle.get('lattitude'), vehicle.get('longitude'), function(location) {
			vehicle.set('location', location);
			self.sub('briefInfo').setData(vehicle.getData());
		});
        this.sub('briefInfo').setData(vehicle.getData());

		/*
		 * TrackStore를 다시 로드함.
		 */
		this.getTrackStore().load({
			params : {
				vehicle_id : vehicle.get('id'),
				/* for Unix timestamp (in seconds) */
				date : Math.round((new Date().getTime() - (60 * 60 * 24 * 1000)) / 1000),
				start : 0,
				limit : 1000
			},
			callback : function(records) {
				self.refreshMap(records, vehicle);
			}
		});

		/*
		 * IncidentStore를 다시 로드함.
		 */
		this.getIncidentStore().load({
			params : {
				vehicle_id : vehicle.get('id'),
				confirm : false,
				start : 0,
				limit : 4
			},
			callback : this.refreshIncidents,
			scope : this
		});
    },

	getLocation : function(latitude, longitude, callback) {
		if (latitude !== undefined && longitude !== undefined) {
			var latlng = new google.maps.LatLng(latitude, longitude);

			geocoder = new google.maps.Geocoder();
			geocoder.geocode({
				'latLng' : latlng
			}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[0]) {
						callback(results[0].formatted_address);
					}
				} else {
					console.log("Geocoder failed due to: " + status);
				}
			});
		}
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

	getTrackStore : function() {
		if (!this.trackStore)
			this.trackStore = Ext.getStore('TrackByVehicleStore');
		return this.trackStore;
	},

	getIncidentStore : function() {
		if (!this.incidentStore)
			this.incidentStore = Ext.getStore('IncidentByVehicleStore');
		return this.incidentStore;
	},

	getMap : function() {
		if (!this.map)
			this.map = this.down('map').getMap();
		return this.map;
	},
	
	refreshMap : function(records, record) {
		this.setTrackLine(new google.maps.Polyline({
			map : this.getMap(),
			strokeColor : '#FF0000',
			strokeOpacity : 1.0,
			strokeWeight : 4
		}));
		this.setMarkers(null);

		var path = this.getTrackLine().getPath();
		var bounds;
		var latlng;

		Ext.Array.each(records, function(record) {
			var lat = record.get('lattitude');
			var lng = record.get('longitude');

			if(lat !== 0 || lng !== 0) {
				latlng = new google.maps.LatLng(lat, lng);
				path.push(latlng);
				if (!bounds)
					bounds = new google.maps.LatLngBounds(latlng, latlng);
				else
					bounds.extend(latlng);
			}
		});

		if (path.getLength() === 0) {
			var lat = record.get('lattitude');
			var lng = record.get('longitude');
			var defaultLatlng = null;
			
			if(lat === 0 && lng === 0) {
				defaultLatlng = new google.maps.LatLng(System.props.lattitude, System.props.longitude);
			} else {
				defaultLatlng = new google.maps.LatLng(lat, lng);
			}
			path.push(defaultLatlng);
			bounds = new google.maps.LatLngBounds(defaultLatlng, defaultLatlng);
		}

		if (bounds.isEmpty() || bounds.getNorthEast().equals(bounds.getSouthWest())) {
			this.getMap().setCenter(bounds.getNorthEast());
		} else {
			this.getMap().fitBounds(bounds);
		}

		var first = path.getAt(0);

		if (first) {
			var start = new google.maps.Marker({
				position : new google.maps.LatLng(first.lat(), first.lng()),
				map : this.getMap()
			});

			var last = path.getAt(path.getLength() - 1);

			var end = new google.maps.Marker({
				position : new google.maps.LatLng(last.lat(), last.lng()),
				icon : 'resources/images/iconStartPoint.png',
				map : this.getMap()
			});

			this.setMarkers([ start, end ]);
		}
		
	},

	refreshIncidents : function(records) {
		var incidents = this.sub('incidents');
		incidents.removeAll();
		var min = Math.min(records.length, 4);
		for ( var i = 0; i < 4; i++) {
			var incident = records[i];
			if(incident) {
				incidents.add({
		                xtype: 'button',
						flex : 1,
						maxWidth : 160,
		                incident: incident,
		                html: '<a href="#">'
		                + incident.get('vehicle_id')
		                + ', '
		                + incident.get('driver_id')
		                + '</a><span>'
		                + Ext.Date.format(incident.get('datetime'),
		                'D Y-m-d H:i:s') + '</span>'
				})
			} else {
				incidents.add({
					xtype : 'container',
					flex : 1
				})
			}
		}
	},

    buildVehicleInfo: function() {
        return {
            xtype: 'panel',
            title: T('title.vehicle_information'),
			cls : 'marginT10 marginL10',
            layout: {
                type: 'hbox',
				align : 'stretch'
            },
            items: [{
                xtype: 'image',
                itemId: 'vehicleImage',
                cls: 'imgVehicle'
            },
            {
                xtype: 'image',
                itemId: 'driverImage',
                cls: 'imgDriver'
            },
			{
				xtype: 'panel',
                itemId: 'briefInfo',
                height: 100,
                data: null,
                tpl: [
                '<div class="infoID {status}">{id} ({registration_number})</div>',
                '<div class="infoText">Driver ID : {driver_id} ({driver_name})</div>',
                '<div class="infoText">Location : {location}</div>'
                ]
			}]
        }
    }

});