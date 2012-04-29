Ext.define('HatioBB.view.monitor.Incident', {
	extend : 'Ext.TabPanel',
	
	requires: ['Ext.chart.Chart',
        'Ext.chart.axis.Numeric',
        'Ext.chart.axis.Category',
        'Ext.chart.series.Area',
		'Ext.chart.series.Line'],
		
	xtype : 'monitor_incident',
	
	id : 'monitor_incident',
	
	config : {
		tabBarPosition : 'bottom'
	},
	
	constructor : function(config) {
		config.items = [
			this.zInfo,
			this.zVideo,
			this.zChart()
		];

		this.callParent(arguments);
	},
	
	setIncident : function(incident) {
		if(!incident) {
			incident = Ext.getStore('RecentIncidentStore').first();
			if(!incident)
				return;
		}
		
		var self = this;
		
		this.incident = incident;
		
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

		this.getLocation(incident.get('lattitude'), incident.get('longitude'), function(location) {
			incident.set('location', location);
			self.sub('briefInfo').setData(incident.getData());
		});
        this.sub('briefInfo').setData(incident.getData());
		console.log(incident);
		this.sub('detailInfo').setData(incident.getData());
		this.sub('confirm').setValue(incident.get('confirm'));
		
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

		/*
		 * LogStore를 다시 로드함.
		 */
		this.getLogStore().clearFilter(true);
		this.getLogStore().filter([ {
			property : 'incident',
			value : incident.get('key')
		} ]);
		
		this.getLogStore().load({
			callback : function(records) {
				self.refreshMap(records);
				self.refreshTrack(records);
				self.refreshChart(records);
			}
		});
		// this.getTrackStore().load({
		// 	params : {
		// 		vehicle_id : vehicle.get('id'),
		// 		/* for Unix timestamp (in seconds) */
		// 		date : Math.round((new Date().getTime() - (60 * 60 * 24 * 1000)) / 1000),
		// 		start : 0,
		// 		limit : 1000
		// 	},
		// 	callback : function(records) {
		// 		self.refreshMap(records, vehicle);
		// 	}
		// });
		
		/* Now, It's turn to chart */
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
		if(!this.map)
			this.map = this.down('#map').getMap();
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
	
	refreshMap : function(records) {
		this.setMarker(null);

		var incident = this.getIncident();
		var location = null;
		if (!incident)
			location = new google.maps.LatLng(System.props.lattitude, System.props.longitude);
		else
			location = new google.maps.LatLng(incident.get('lattitude'), incident.get('longitude'));

		this.getMap().setCenter(location);

		if (!incident)
			return;

		this.setMarker(new google.maps.Marker({
			position : location,
			map : this.getMap()
		}));
	},

	refreshTrack : function(records) {
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
	},

	refreshChart : function(records) {
		
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
				'<div class="infoID">{driver_name} , {vehicle_id}</div>',
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
					label : T('label.confirm'),
					name : 'confirm'
				}, {
					xtype : 'container',
					itemId : 'detailInfo',
					flex : 1,
					data : {
						impulse_abs : '',
						engine_temp : ''
					},
					tpl : ['<div>Impulse <span>{impulse_abs}({impulse_x},{impulse_y},{impulse_z})</span></div>',
					'<div>Engine Temp <span>{engine_temp}</span></div>',
					'<div>Engine Temp Threshold <span>{engine_temp_threshold}</span></div>',
					'<div>Velocity <span>{velocity}</span></div>',
					'<div>OBD Connected <span>{obd_connected}</span></div>']
				// }, {
				// 	xtype : 'container',
				// 	itemId : 'engine_temp',
				// 	data : {
				// 		engine_temp : ''
				// 	},
				// 	tpl : '<div>Engine Temp <span>{engine_temp}</span></div>'
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
				center : new google.maps.LatLng(System.props.lattitude, System.props.longitude),
				mapTypeId : google.maps.MapTypeId.ROADMAP
			}	
		}]
	},
	
	zVideo : {
		xtype : 'panel',
		title : 'Movie',
		layout : 'fit',
		items : [{
			xtype    : 'video',
			itemId : 'video',
			posterUrl: 'porsche.png'
		}]
	},
	
	zChart : function() {
		return {
			xtype : 'panel',
			title : 'Chart',
			html : 'XXX'
		}
	},
	
	zzChart : function() {
		var store = Ext.getStore('IncidentLogStore');
		
		return {
			xtype : 'chart',
			itemId : 'chart',
			legend : {
				position: {
	                portrait: 'right',
	                landscape: 'bottom'
	            },
	            labelFont: '20px Arial',
				itemSpacing:5,
				padding:0,
				boxStroke:"transparent",
				boxFill : "transparent"
			},
			store : store,
			axes : [ {
				title : T('title.acceleration'),
				type : 'Numeric',
				position : 'left',
				fields : [ 'accelate_x', 'accelate_y', 'accelate_z' ]
	//			minimum : -2,
	//			maximum : 2
			}, {
				title : T('label.time'),
				type : 'Category',
				position : 'bottom',
				fields : [ 'datetime' ]
	//			dateFormat : 'M d g:i:s',
	//			step : [Ext.Date.SECOND, 1]
			} ],
			series : [ {
				type : 'line',
	            highlight: {
	                size: 7,
	                radius: 7
	            },
	            fill: true,
	            smooth: true,
	            axis: 'left',
	            title: 'Accelate X',

				xField : 'datetime',
				yField : 'accelate_x'
			}, {
				type : 'line',
	            highlight: {
	                size: 7,
	                radius: 7
	            },
	            fill: true,
	            smooth: true,
	            axis: 'left',
	            title: 'Accelate Y',

				xField : 'datetime',
				yField : 'accelate_y'
			}, {
				type : 'line',
	            highlight: {
	                size: 7,
	                radius: 7
	            },
	            fill: true,
	            smooth: true,
	            axis: 'left',
	            title: 'Accelate Z',

				xField : 'datetime',
				yField : 'accelate_z'
			} ]
		}
	}
});