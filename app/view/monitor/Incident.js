Ext.define('HatioBB.view.monitor.Incident', {
	extend : 'Ext.TabPanel',
	
	xtype : 'monitor_incident',
	
	id : 'monitor_incident',
	
	config : {
		tabBarPosition : 'bottom'
	},
	
	constructor : function(config) {
		config.items = [
			this.zInfo,
			this.zVideo
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
		
		this.sub('incident_form').setRecord(incident);
		
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

		/* Map */
		/*
		 * TrackStore를 다시 로드함.
		 */
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
			height :135,
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
					driver_name : 'xxx',
					vehicle_name : 'yyy',
					location : 'zzz',
					datetime : 'vvv'
				},
				tpl : [
				'<div class="infoID">{driver_name} , {vehicle_id}</div>',
                '<div class="infoText">Location : {location}</div>',
                '<div class="infoText">Data Time : {datetime} </div>'
				]
			}]
		}, {
			xtype: 'panel',
			height : 45,
			itemId : 'incidents',
			cls : 'incidentList',
			flex : 1,
			layout : {
				type : 'hbox',
				align : 'stretch'
			}
		}, {
			xtype : 'panel',
			height : 400,
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [{
				xtype : 'formpanel',
				itemId : 'incident_form',
				width : 230,
				items : [{
					xtype : 'textfield',
					name : 'key',
					label : 'Key',
					hidden : true
				}, {
					xtype : 'textfield',
					label : 'Driver Id.',
					name : 'driver_id',
					disabled : true
				}, {
					xtype : 'textfield',
					label : 'Vehicle Id.',
					name : 'vehicle_id',
					disabled : true
				}, {
					xtype : 'textfield',
					label : 'Latitude',
					name : 'lattitude',
					disabled : true
				}, {
					xtype : 'textfield',
					label : 'Longitude',
					name : 'longitude',
					disabled : true
				}, {
					xtype : 'textfield',
					label : 'Impulse',
					name : 'impulse_abs',
					disabled : true
				}, {
					xtype : 'textfield',
					label : 'Engine Temp.',
					name : 'engine_temp',
					disabled : true
				}, {
				  // xtype : 'textfield',
				  // 				label : 'Date/Time',
				  // 				name : 'datetime',
				  // 				disabled : true
				  // 			}, {
					xtype : 'togglefield',
					itemId : 'confirm',
					name : 'confirm',
					label : T('label.confirm')
				}]
			}, {
				xtype : 'map',
				itemId : 'map',
				cls : 'marginL10',
				flex : 1,
			    useCurrentLocation: false,
				mapOptions : {
					zoom : 10,
					maxZoom : 19,
					minZoom : 3,
					center : new google.maps.LatLng(System.props.lattitude, System.props.longitude),
					mapTypeId : google.maps.MapTypeId.ROADMAP
				}	
			} ]
		}, {
			xtype : 'panel',
			itemId : 'chart',
			flex : 1,
			html : 'chart here'
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
	}
// 	,
// 
// 	zVideoAndMap : {
// 		xtype : 'container',
// 		layout : {
// 			type : 'hbox',
// 			align : 'stretch'
// 		},
// 		flex : 1,
// 		items : [
// 		{
// 			xtype : 'panel',
// 		 // title : T('title.incident_details'),
// 			cls : 'paddingAll10 incidentVOD',
// 			width : 690,
// 			layout : {
// 				type : 'vbox',
// 				align : 'stretch'
// 			},
// 			items : [
// 					{
// 						xtype : 'box',
// 						itemId : 'fullscreen',
// 						html : '<div class="btnFullscreen"></div>'
// 					},
// 					{
// 						xtype : 'box',
// 						cls : 'incidentDetail',
// 						itemId : 'video',
// 						tpl : [ '<video width="100%" height="100%" controls="controls">', '<source {value} type="video/mp4" />',
// 								'Your browser does not support the video tag.', '</video>' ]
// 					} ]
// 		}, {
// 			xtype : 'panel',
// 			//title : T('title.position_of_incident'),
// 			cls : 'backgroundGray borderLeftGray',
// 			flex : 1,
// 			layout : {
// 				type : 'vbox',
// 				align : 'stretch'
// 			},
// 			items : [
// 			{
// 				xtype : 'box',
// 				itemId : 'map',
// 				html : '<div class="map"></div>',
// 				flex : 3
// 			},
// 			{
// 				xtype : 'chart',
// 				itemId : 'chart',
// 				flex : 1,
// 				legend : {
// 					position: 'bottom',
// 					itemSpacing:5,
// 					padding:0,
// 					labelFont : "10px Helvetica, sans-serif",
// 					boxStroke:"transparent",
// 					boxFill : "transparent"
// 				},
// 				store : 'IncidentLogStore',
// 				axes : [ {
// //					title : T('title.acceleration'),
// 					type : 'Numeric',
// 					position : 'left',
// 					fields : [ 'accelate_x', 'accelate_y', 'accelate_z' ]
// //					minimum : -2,
// //					maximum : 2
// 				}, {
// 					title : T('label.time'),
// 					type : 'Category',
// 					position : 'bottom',
// 					fields : [ 'datetime' ]
// //					dateFormat : 'M d g:i:s',
// //					step : [Ext.Date.SECOND, 1]
// 				} ],
// 				series : [ {
// 					type : 'line',
// 					xField : 'datetime',
// 					yField : 'accelate_x'
// 				}, {
// 					type : 'line',
// 					xField : 'datetime',
// 					yField : 'accelate_y'
// 				}, {
// 					type : 'line',
// 					xField : 'datetime',
// 					yField : 'accelate_z'
// 				} ],
// 				flex : 2
// 			}]
// 		} ]
// 	}
});