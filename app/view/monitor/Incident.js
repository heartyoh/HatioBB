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
		
		this.sub('incident_form').setRecord(incident);
		
		var url = '';
		var video_clip = incident.get('video_clip');
		if (video_clip != null && video_clip.length > 1) {
			if(video_clip.indexOf('http') == 0)
				url = video_clip;
			else
				url = 'download?blob-key=' + video_clip;
		}
		this.sub('video').updateUrl([url]);
		
		this.sub('brief').setData(incident.raw);
		
		var geo = this.sub('map').getGeo();
		geo.latitude = incident.get('lattitude');
		geo.longitude = incident.get('longitude');
	},
	
	zInfo : {
		xtype : 'panel',
		title : '개요',
		// cls : 'incidentSummary',
		// height : 50,
		layout : {
			type : 'vbox',
			align : 'stretch'
		},
		items : [ {
			xtype : 'panel',
			itemId : 'brief',
			layout : 'hbox',
			items : [{
				xtype : 'image',
				itemId : 'driverImage',
				height : 64,
				width : 64
			}, {
				xtype : 'image',
				itemId : 'vehicleImage',
				height : 64,
				width : 64
			}, {
				xtype : 'panel',
				flex : 1,
				data : {
					driver_name : 'xxx',
					vehicle_name : 'yyy',
					location : 'zzz',
					datetime : 'vvv'
				},
				tpl : [
				'<div>{driver_name}이 운전한 {vehicle_name}차량이</div>',
				'<div>{location} 부근에서</div>',
				'<div>{datetime} 경에 발생한 이상 상황임</div>'
				]
			}]
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
				flex : 1,
				items : [{
					xtype : 'textfield',
					name : 'key',
					label : 'Key',
					hidden : true
				}, {
					xtype : 'textfield',
					label : 'Latitude',
					name : 'lattitude'
				}, {
					xtype : 'textfield',
					label : 'Longitude',
					name : 'longitude'
				}, {
					xtype : 'textfield',
					label : 'Impulse',
					name : 'impulse_abs'
				}, {
					xtype : 'textfield',
					label : 'Engine Temp.',
					name : 'engine_temp'
				}, {
					xtype : 'togglefield',
					itemId : 'confirm',
					name : 'confirm',
					label : T('label.confirm')
				}]
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
			url      : "http://commondatastorage.googleapis.com/green-fleets/vitizen/v.mp4",
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