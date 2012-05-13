Ext.define('HatioBB.view.monitor.Incident', {
	extend : 'Ext.TabPanel',
	
	requires: [
	'HatioBB.view.chart.vehicle.Accel'
	],
		
	xtype : 'monitor_incident',
	
	id : 'monitor_incident',
	
	config : {
		tabBarPosition : 'bottom'
	},
	
	constructor : function(config) {
		config.items = [
			this.zInfo,
			this.zVideo,
			this.zChart
		];

		this.callParent(arguments);
		
		var self = this;
		
		this.getLogStore().on('load', function(store, records) {
			self.refreshTrack(store, records);
		});
	},
	
	refresh : function() {
		this.setIncident();
	},
	
	setIncident : function(incident) {
		var self = this;
		
		if(!incident) {
			if(this.incident) {
				incident = this.incident;
			} else {
				incident = Ext.getStore('RecentIncidentStore').first();
				if(!incident && !this.isHidden()) {
					setTimeout(function() {
						self.setIncident();
					}, 3000);
					return;
				}
			}
		}
		
		this.incident = incident;
		this.incident.set('obd_connected_text', this.incident.get('obd_connected') ? 'connected' : 'disconnected');
		
		/*
		 * Get Vehicle Information (Image, Registration #, ..) from
		 * VehicleStore
		 */
		var vehicleStore = Ext.getStore('VehicleBriefStore');
		var vehicleRecord = vehicleStore.findRecord('id', incident.get('vehicle_id'));
		var vehicleImageClip = vehicleRecord.get('image_clip');
		if (vehicleImageClip) {
			this.sub('vehicleImage').setSrc('download?blob-key=' + vehicleImageClip);
		} else {
			this.sub('vehicleImage').setSrc('resources/images/bgVehicle.png');
		}
		incident.set('registration_number', vehicleRecord.get('registration_number'));

		/*
		 * Get Driver Information (Image, Name, ..) from DriverStore
		 */
		var driverStore = Ext.getStore('DriverBriefStore');
		var driverRecord = driverStore.findRecord('id', incident.get('driver_id'));
		var driver = driverRecord.get('id');
		var driverImageClip = driverRecord.get('image_clip');
		if (driverImageClip) {
			this.sub('driverImage').setSrc('download?blob-key=' + driverImageClip);
		} else {
			this.sub('driverImage').setSrc('resources/images/bgDriver.png');
		}
		incident.set('driver_name', driverRecord.get('name'));

		incident.set('location', 'Resolving ..');
		this.getLocation(incident.get('lattitude'), incident.get('longitude'), function(location) {
			incident.set('location', location);
			self.sub('briefInfo').setData(incident.getData());
		});
        this.sub('briefInfo').setData(incident.getData());
		this.sub('detailInfo').setData(incident.getData());
		this.sub('confirm').setValue(incident.get('confirm'));
		
		/*
		 * LogStore를 다시 로드함.
		 */
		this.getLogStore().clearFilter(true);
		this.getLogStore().filter([ {
			property : 'incident',
			value : incident.get('key')
		} ]);
		
		this.getLogStore().load();
		
		/*
		 * 동영상 정보를 업데이트 함.
		 */
		var url = '';
		var video_clip = incident.get('video_clip');
		if (video_clip != null && video_clip.length > 1) {
			if(video_clip.indexOf('http') == 0)
				url = video_clip;
			else
				url = 'download?blob-key=' + video_clip;
		}
		this.sub('video').updateUrl([url]);

	},
	
	getIncident : function() {
		return this.incident;
	},

	getLogStore : function() {
		if (!this.logStore)
			this.logStore = Ext.getStore('IncidentLogStore');
		return this.logStore;	
	},
	
	getMap : function() {
		/* chart 가 문제가 없을 때까지는 아래처럼 해야한다. */
		if(!this.map)
			this.map = this.items.items[0].down('#map').getMap();
		return this.map;
	},

	getTrackLine : function() {
		return this.trackline;
	},

	setTrackLine : function(trackline) {
		if (this.trackline)
			this.trackline.setMap(null);
		this.trackline = trackline;
	},

	getMarker : function() {
		return this.marker;
	},

	setMarker : function(marker) {
		if (this.marker)
			this.marker.setMap(null);
		this.marker = marker;
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

	refreshTrack : function(store, records) {
		this.setTrackLine(new google.maps.Polyline({
			map : this.getMap(),
			strokeColor : '#FF0000',
			strokeOpacity : 1.0,
			strokeWeight : 4
		}));

		var path = this.getTrackLine().getPath();
		var bounds;
		var latlng;

		Ext.Array.each(records, function(record) {
			latlng = new google.maps.LatLng(record.get('lattitude'), record.get('longitude'));
			path.push(latlng);
			if (!bounds)
				bounds = new google.maps.LatLngBounds(latlng, latlng);
			else
				bounds.extend(latlng);
		});

		if (!bounds)
			return;

		if (bounds.isEmpty() || bounds.getNorthEast().equals(bounds.getSouthWest())) {
			this.getMap().setCenter(bounds.getNorthEast());
		} else {
			this.getMap().fitBounds(bounds);
		}
		
		/* Start-End Marker */
		var first = path.getAt(0);

		if (first) {
			var start = new google.maps.Marker({
				position : new google.maps.LatLng(first.lat(), first.lng()),
				icon : 'resources/images/iconStartPoint.png',
				map : this.getMap()
			});

			var last = path.getAt(path.getLength() - 1);

			var end = new google.maps.Marker({
				position : new google.maps.LatLng(last.lat(), last.lng()),
				map : this.getMap()
			});

			this.setMarkers([ start, end ]);
		}

		/* Incident Marker */
		var location = new google.maps.LatLng(this.getIncident().get('lattitude'), this.getIncident().get('longitude'));
		this.setMarker(new google.maps.Marker({
			position : location,
			icon : new google.maps.MarkerImage('resources/images/iconIncidentPoint.png',
				null, null, new google.maps.Point(60, 80)),
			map : this.getMap(),
			title:"incidentPoint"
		}));
	},

	refreshChart : function(store, records) {
		console.log('ZZZ');
		this.down('#chart').refresh();
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
	
	zInfo : {
		xtype : 'panel',
		title : '개요',
		iconCls : 'iconsTab tabMap',
		cls : 'grayBg',
		layout : {
			type : 'vbox',
			align : 'stretch'
		},
		items : [ {
			xtype : 'panel',
			itemId : 'brief',
			layout : 'hbox',
			cls : 'marginT10 marginL10',
			height :125,
			items : [{
				xtype : 'image',
				itemId : 'driverImage',
				cls: 'imgDriver'
			}, {
				xtype : 'image',
				itemId : 'vehicleImage',
				cls: 'imgVehicle'
			}, {
				xtype : 'panel',
				itemId : 'briefInfo',
				flex : 1,
				data : {
					driver_name : '',
					vehicle_name : '',
					location : '',
					datetime : ''
				},
				tpl : [
				'<div class="infoID">{driver_id}({driver_name}) , {vehicle_id}({registration_number})</div>',
                '<div class="infoText">Location : {location}</div>',
                '<div class="infoText">Time : {datetime} </div>'
				]
			}]
		}, {
			xtype: 'panel',
			height : 45,
			cls : 'shotHList',
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [{
					xtype : 'togglefield',
					itemId : 'confirm',
					name : 'confirm'
				}, {
					xtype : 'container',
					itemId : 'detailInfo',
					flex : 1,
					cls : 'divHAlign',
					data : {
						impulse_abs : '',
						engine_temp : ''
					},
					tpl : ['<div class="iconImplus">Impulse <span>{impulse_abs}({impulse_x},{impulse_y},{impulse_z})/{impulse_threshold}</span></div>',
					'<div class="iconETemp">Engine Temp <span>{engine_temp}/{engine_temp_threshold}</span></div>',
					'<div class="iconVelocity">Velocity <span>{velocity}</span></div>',
					'<div class="iconOBD">OBD Connected <span>{obd_connected_text}</span></div>']
				}
			]	
		}, {
			xtype : 'map',
			itemId : 'map',
			flex : 1,
		    useCurrentLocation: false,
			mapOptions : {
				zoom : 10,
				maxZoom : 19,
				minZoom : 3,
				center : null,
				// center : new google.maps.LatLng(System.props.lattitude, System.props.longitude),
				mapTypeId : google.maps.MapTypeId.ROADMAP
			}	
		}]
	},
	
	zVideo : {
		xtype : 'panel',
		title : 'Movie',
		layout : 'fit',
		iconCls : 'iconsTab tabMovie',
		items : [{
			xtype    : 'video',
			itemId : 'video',
			posterUrl: 'porsche.png'
		}]
	},
	
	zChart : {
		xtype : 'chart_v_accel',
		title : 'Chart',
		layout : 'fit',
		iconCls : 'iconsTab tabChart',
	}
});