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
				'<div class="iconTime">Total Drive Time<span>{total_run_time} min</span></div>',
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
			var data = records[0].getData();
			
			self.down('[itemId=briefInfo]').setData(data);
			self.down('[itemId=briefInfo2]').setData(data);
			self.down('[itemId=links]').setData(data);
			
			// Driver Info ...
			
			if(data.eco_run_rate == 0) {
				data.eco_run_rate = Math.floor((data.eco_drv_time_of_month / data.run_time_of_month) * 100);
			}
			
			var idx = Math.floor(data.eco_run_rate / 20);
			data.eco_level = ['E', 'D', 'C', 'B', 'A'][idx];
			data.cost_reduction = [50, 40, 30, 20, 10][idx];
			self.down('[itemId=ecoInfo]').setData(data);

			data.total_distance_mile = (data.total_distance * 0.621371192237334).toFixed(2);
			data.run_dist_mile = (data.run_dist * 0.621371192237334).toFixed(2);
			data.run_dist_mile_of_month = (data.run_dist_of_month * 0.621371192237334).toFixed(2);
			self.down('[itemId=runningInfo]').setData(data);
			

			// ImageClip을 리프레쉬한다.
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
                //'<div class="infoText">' + T('label.birth_year') + ' : {birth_year}</div>'
                ]
            },
			{
				xtype: 'component',
                itemId: 'briefInfo2',
				flex : 1,
                data: null,
                tpl: [
                '<div class="infoID">' + T('label.name') + ' : {name}</div>',
                '<div class="infoText">' + T('label.x_id', {x : T('label.social')}) + ' : {social_id}</div>',
                '<div class="infoText">' + T('label.phone_x', {x : 1}) + ' : {phone_no_1}</div>',
                //'<div class="infoText">' + T('label.phone_x', {x : 2}) + ' : {phone_no_2}</div>'
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
				'<div class="current">이달 주행거리<span class="km">{run_dist_of_month} km</span><span class="mile">{run_dist_mile_of_month} mile</span></div>',
			'</div>',
			'<div class="fuel">',
				'<div>이달 연료 소모량 : <span>{consmpt_of_month} ℓ</span></div>',
				'<div>연비 : <span>{effcc_of_month} km/ℓ</span></div>',
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
			'<div class="subtitle">eco level</div>',
			'<div class="ecoLevel {eco_level}"></div>',
			'<div class="ecoHBox">',
				'<div>'+ T('label.avg_effcc') + '/' + T('label.official_effcc') +' <span>{eco_index}%</span></div>',
				'<div>경제주행 비율<span>{eco_run_rate}%</span></div>',
			'</div>',	
			'<div class="ecoComment">이 운전자의 에코드라이브 지수는 {eco_level}레벨입니다.<br/> 운전습관을 적절하게 관리하면, <span>연간 {cost_reduction}만원 이상의</span>유류비 절약이 가능하며, 사고 위험을 현저히 낮출 수 있습니다.'
			].join('')
		}
	}
});