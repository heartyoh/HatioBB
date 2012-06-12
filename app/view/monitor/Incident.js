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
		
		this.storeHandler = function(store, records) {
			self.refreshTrack(store, records);
		};
		
		self.getLogStore().on('load', this.storeHandler);
		
		/* chart 가 문제가 없을 때까지는 아래처럼 해야한다. - self.down(..)이 안된다. 아마도 차트 때문이다. */
		self.items.items[0].on('activate', function() {
			self.refresh();
		});
		
		self.items.items[0].down('[itemId=confirm]').on('change', function(field, b, c, d, value) {
			Ext.Ajax.request({
			    url : '/incident/save',
				method : 'POST',
			    params : {
					key : self.incident.get('key'),
			        confirm : value[0] ? 'on' : 'off'
			    },
			    success : function(response) {
					if(value[0])
						Ext.Msg.alert('성공', '이상상황 정보가 확인 처리되었습니다. 이상상황 리스트에서 잠시 후 사라지게 됩니다. 리스트에서 유지하고 싶으면, 다시 미확인으로 변경하시기 바랍니다.', Ext.emptyFn);
					else
						Ext.Msg.alert('성공', '이상상황 정보가 미확인 처리되었습니다. 이상상황 리스트에 다시 유지되게 됩니다. 리스트에서 제거하고 싶으면, 다시 확인으로 변경하시기 바랍니다.', Ext.emptyFn);
			    },
				failure : function(response) {
					Ext.Msg.alert('실패', '이상상황 정보가 확인 처리가 실패되였습니다.(' + response.status + ')', Ext.emptyFn);
					field.setValue(self.incident.get('confirm'));
				}
			});
		});
	},
	
	destroy : function() {
		this.getLogStore().un('load', this.storeHandler);
		
		this.callParent(arguments);
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

		if(!incident || incident.isDestroyed)
			return;
			
		this.incident = incident;
		this.incident.set('obd_connected_text', this.incident.get('obd_connected') ? 'connected' : 'disconnected');
		
		HatioBB.setting.set('driver', incident.get('driver_id'));
		HatioBB.setting.set('vehicle', incident.get('vehicle_id'));
		
		/*
		 * Get Vehicle Information (Image, Registration #, ..) from
		 * VehicleStore
		 */
		var vehicleStore = Ext.getStore('VehicleMapStore');
		var vehicleRecord = vehicleStore.findRecord('id', incident.get('vehicle_id'));
		var vehicleImageClip = vehicleRecord.get('image_clip');
		var vimage = this.sub('vehicleImage');

		if (vehicleImageClip) {
			if(HatioBB.setting.get('app_mode'))
				vimage.setSrc('/download?blob-key=' + vehicleImageClip);
			else
				vimage.setSrc(vehicleImageClip);
		} else {
			vimage.setSrc('resources/images/bgVehicle.png');
		}
		incident.set('registration_number', vehicleRecord.get('registration_number'));

		/*
		 * Get Driver Information (Image, Name, ..) from DriverStore
		 */
		var driverStore = Ext.getStore('DriverBriefStore');
		var driverRecord = driverStore.findRecord('id', incident.get('driver_id'));
		var driver = driverRecord.get('id');
		var driverImageClip = driverRecord.get('image_clip');
		var dimage = this.sub('driverImage');

		if (driverImageClip) {
			if(HatioBB.setting.get('app_mode'))
				dimage.setSrc('/download?blob-key=' + driverImageClip);
			else
				dimage.setSrc(driverImageClip);
		} else {
			dimage.setSrc('resources/images/bgDriver.png');
		}
		incident.set('driver_name', driverRecord.get('name'));

		incident.set('location', 'Resolving ..');
		this.getLocation(incident.get('lat'), incident.get('lng'), function(location) {
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
				url = '/download?blob-key=' + video_clip;
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
			this.map = this.getAt(0).down('#map').getMap();
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

	clearInfoWindow : function() {
		if(this.infowindow)
			this.infowindow.setVisible(false);
	},

	refreshTrack : function(store, records) {
		this.setTrackLine(new google.maps.Polyline({
			map : this.getMap(),
			strokeColor : '#FF0000',
			strokeOpacity : 1.0,
			strokeWeight : 4
		}));
		
		this.clearInfoWindow();

		var path = this.getTrackLine().getPath();
		var bounds;
		var latlng;

		Ext.Array.each(records, function(record) {
			latlng = new google.maps.LatLng(record.get('lat'), record.get('lng'));
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
		var location = new google.maps.LatLng(this.getIncident().get('lat'), this.getIncident().get('lng'));
		this.setMarker(new google.maps.Marker({
			position : location,
			icon : new google.maps.MarkerImage('resources/images/iconIncidentPoint.png',
				null, null, new google.maps.Point(60, 80)),
			map : this.getMap(),
			title:"incidentPoint"
		}));
		
		var strmovie = this.incident.get('video_clip') ? '동영상 정보를 추가로 확인해보실 수 있습니다.' : '동영상 정보가 아직 도착하지 않았습니다. 잠시 후 다시 확인해 보세요.';
		var strtrack = records.length > 0 ? '가속 및 속도 정보를 더 확인해보실 수 있습니다.' : '트래킹 정보가 아직 도착하지 않았습니다. 잠시 후 다시 확인해 보세요.';
		var content = [
			'<div class="bubbleWrap statusIncident">',
			'<div>' + strtrack + '</div>',
			'<div>' + strmovie + '</div>',
			'</div>'
		].join('');

		if(!self.infowindow) {
			self.infowindow = HatioBB.label.create({
				map : this.getMap(),
				xoffset : -110,
				yoffset : -170
			});
		} else {
			self.infowindow.setMap(this.getMap());
		}
		self.infowindow.set('position', location);
		self.infowindow.set('text', content);

		self.infowindow.setVisible(true);
		
		if(self.iw_pending) {
			clearTimeout(self.iw_pending);
		};
		
		self.iw_pending = setTimeout(function() {
			self.infowindow.setVisible(false);
		}, 10000);
		
	},

	refreshChart : function(store, records) {
		this.down('#chart').refresh();
	},

	getLocation : function(lat, lng, callback) {
		if (lat !== undefined && lng !== undefined) {
			var latlng = new google.maps.LatLng(lat, lng);

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
		itemId : 'info',
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
				// center : new google.maps.LatLng(System.props.lat, System.props.lng),
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