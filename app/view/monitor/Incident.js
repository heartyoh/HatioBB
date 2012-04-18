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
	},
	
	zInfo : {
		xtype : 'formpanel',
		title : '개요',
		itemId : 'incident_form',
		// cls : 'incidentSummary',
		// height : 50,
		// layout : {
		// 	type : 'hbox',
		// 	align : 'stretch'
		// },
		autoScroll : true,
		// defaults : {
		// 	anchor : '100%',
		// 	// labelAlign : 'top',
		// 	// cls : 'summaryCell'
		// },
		items : [ {
			xtype : 'textfield',
			name : 'key',
			label : 'Key',
			hidden : true
		}, {
			xtype : 'image',
			itemId : 'driverImage',
			cls : 'imgDriverSmall',
			height : 37
		}, {
			// xtype : 'datepickerfield',
			// name : 'datetime',
			// hidden : true,
			// format : 'd-m-Y H:i:s'
		// }, {
			xtype : 'textfield',
			itemId : 'incident_time',
			name : 'datetime',
			label : T('label.x_time', {x : T('label.incident')})
		}, {
			xtype : 'textfield',
			name : 'vehicle_id',
			label : T('label.vehicle')
		}, {
			xtype : 'textfield',
			name : 'driver_id',
			label : T('label.driver')
		}, {
			xtype : 'textfield',
			name : 'impulse_abs',
			label : T('label.impulse')
		}, {
			xtype : 'textfield',
			name : 'engine_temp',
			label : T('label.engine_temp')
		}, {
			xtype : 'checkboxfield',
			name : 'confirm',
			itemId : 'confirm',
			label : T('label.confirm'),
			uncheckedValue : 'off',
			labelCls : 'labelStyle1',
			cls : 'backgroundNone'
		} ]
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