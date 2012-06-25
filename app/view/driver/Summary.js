Ext.define('HatioBB.view.driver.Summary', {
	extend : 'Ext.form.Panel',

	requires: ['Ext.form.FieldSet'],
	
	xtype : 'driver_summary',
	
	config : {
		scrollable : true,
		
		cls : 'grayBg',
		
		layout : {
			type : 'vbox',
			align : 'stretch'
		}
	},

	constructor : function(config) {
        config.items = [this.buildDriverInfo(), {
			xtype : 'container',
			itemId : 'links',
			height : 45,
			cls : 'shotHList marginT10 divHAlign',
			data: null,
            tpl: [
				'<div class="iconTime">' + T('label.total_run_time') + '<span>{total_run_time} ' + T('label.parentheses_min') + '</span></div>',
				'<div class="iconMap">Move to<span>Current Position Map</span></div>',
				'<div class="iconTrack">Move to<span>Recent Running Track</span></div>',
			].join('')
        }, {
			xtype : 'container',
			flex : 1,
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [
				this.buildRunningInfo(),
				this.buildEcoDrivingInfo()
			]
		}];

        this.callParent(arguments);

		var self = this;

		this.on('painted', function() {
			HatioBB.setting.on('driver', this.refresh, this);
			
			this.refresh();
		});
		
		this.on('erased', function() {
			HatioBB.setting.un('driver', this.refresh, this);
		});
		
		this.element.on({
			delegate : 'div.iconMap',
			tap : function() {
				var vehicle = Ext.getStore('VehicleMapStore').findRecord('driver_id', self.driver);
				if(vehicle)
					self.fireEvent('showMap', vehicle.get('id'));
			}
		});
		
		this.element.on({
			delegate : 'div.iconTrack',
			tap : function() {
				var vehicle = Ext.getStore('VehicleMapStore').findRecord('driver_id', self.driver);
				if(vehicle)
					self.fireEvent('showTrack', vehicle.get('id'));
			}
		});
		
	},
	
	refresh : function() {
		var self = this;
		
		if(HatioBB.setting.get('driver') === this.driver) 
			return;
			
		var store = Ext.getStore('DriverSummaryStore');
		this.driver = HatioBB.setting.get('driver');		
		store.clearFilter(true);
		store.filter('id', this.driver);
		
		store.load(function(records) {
			var data = records[0].data;
			
			if(data.eco_run_rate == 0) {
				data.eco_run_rate = Math.floor((data.eco_drv_time_of_month / data.run_time_of_month) * 100);
			}
			
			var idx = Math.floor(data.eco_run_rate / 20);
			data.eco_level = ['E', 'D', 'C', 'B', 'A'][idx];
			data.cost_reduction = [50, 40, 30, 20, 10][idx];
			data.total_distance_mile = (data.total_distance * 0.621371192237334).toFixed(2);
			data.run_dist_mile = (data.run_dist * 0.621371192237334).toFixed(2);
			data.run_dist_mile_of_month = (data.run_dist_of_month * 0.621371192237334).toFixed(2);

			self.down('[itemId=briefInfo]').setData(data);
			self.down('[itemId=briefInfo2]').setData(data);
			self.down('[itemId=links]').setData(data);			
			self.down('[itemId=ecoInfo]').setData(data);			
			self.down('[itemId=runningInfo]').setData(data);
			
			var imageClip = data.image_clip;
			var dimage = self.down('[itemId=driverImage]');
			if(imageClip) {
				if(HatioBB.setting.get('app_mode'))
					dimage.setSrc('/download?blob-key=' + imageClip);
				else
					dimage.setSrc(imageClip);
			} else {
				dimage.setSrc('resources/images/bgDriver.png');
			}
		});
	},
	
	buildDriverInfo: function() {
        return {
            xtype: 'panel',
            title: T('title.driver_information'),
			cls : 'marginT10 marginL10',
            layout: {
                type: 'hbox',
				align : 'stretch'
            },
            items: [{
                xtype: 'image',
                itemId: 'driverImage',
                cls: 'imgDriver'
            },
			{
				xtype: 'component',
                itemId: 'briefInfo',
				flex : 1,
                data: null,
                tpl: [
                '<div class="infoID">'  + T('label.id') + ' : {id}</div>',
                '<div class="infoText">' + T('label.division') + ' : {division}</div>',
                '<div class="infoText">' + T('label.title') + ' : {title}</div>',
                ]
            },
			{
				xtype: 'component',
                itemId: 'briefInfo2',
				flex : 1,
                data: null,
                tpl: [
                '<div class="infoID">' + T('label.name') + ' : {name}</div>',
                '<div class="infoText">' + T('label.social_id') + ' : {social_id}</div>',
                '<div class="infoText">' + T('label.phone_x', {x : 1}) + ' : {phone_no_1}</div>',
                ]
			}]
        }
    },

	buildRunningInfo : function() {
		return {
			xtype : 'component',
			itemId : 'runningInfo',
			data : null,
			flex : 1,
			cls : 'paddingT25 paddingR10 paddingL10',
			tpl : [
			'<div class="distance">',
				'<div class="total">'+ T('label.total_distance') +'<span class="km">{total_distance} km</span><span class="mile">{total_distance_mile} mile</span></div>',
				'<div class="current">' + T('label.mileage_of_month') + '<span class="km">{run_dist_of_month} km</span><span class="mile">{run_dist_mile_of_month} mile</span></div>',
			'</div>',
			'<div class="fuel">',
				'<div>' + T('label.consumption_of_month') + ' : <span>{consmpt_of_month} ℓ</span></div>',
				'<div>' + T('label.fuel_efficiency') + ' : <span>{effcc_of_month} km/ℓ</span></div>',
			'</div>'	
			]
		}
	},

	buildEcoDrivingInfo : function() {
		return {
			xtype : 'component',
			itemId : 'ecoInfo',
			flex : 1,
			cls : 'bgHGrident',
			width : 265,
			tpl : [
			'<div class="subtitle">' + T('label.eco_level') + '</div>',
			'<div class="ecoLevel {eco_level}"></div>',
			'<div class="ecoHBox">',
				'<div>'+ T('label.avg_effcc') + '/' + T('label.official_effcc') +' <span>{eco_index}%</span></div>',
				'<div>' + T('label.eco_run_rate') + '<span>{eco_run_rate}%</span></div>',
			'</div>',	
			'<div class="ecoComment">' + T('msg.driver_eco_drv_result_msg', {x : '{eco_level}', y : '{cost_reduction}'})
			].join('')
		}
	}
});