Ext.define('HatioBB.view.vehicle.Summary', {
	extend : 'Ext.Panel',
		
	xtype : 'vehicle_summary',
	
	requires : [ 'HatioBB.store.VehicleSummaryStore' ],
	
	config : {
		scrollable : true,
		
		cls : 'grayBg',
		
		layout : {
			type : 'vbox',
			align : 'stretch'
		}
	},

	constructor : function(config) {
        config.items = [this.buildVehicleInfo(), {
			xtype : 'component',
			itemId : 'links',
			height : 45,
			data : {},
			cls : 'shotHList marginT10 divHAlign',
			tpl : [
				'<div class="iconFuel">' + T('label.remaining_fuel') + '<span>{remaining_fuel}</span></div>',
				'<div class="iconTime">' + T('label.total_run_time') + '<span>{total_run_time} min</span></div>',
				'<div class="iconMap">Move to<span>Current Position Map</span></div>',
				'<div class="iconTrack">Move to<span>Recent Running Track</span></div>'
			].join('')
        }, {
			xtype : 'container',
			flex : 1,
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [
				{
					xtype : 'container',
					flex : 1,
					layout : {
						type : 'vbox',
						align : 'stretch'
					},
					items : [
						this.buildRunningInfo(),
						this.buildConsumableInfo(),
						this.buildMaintenenceInfo()
					]
				},
				this.buildEcoDrivingInfo()
			]
		}];

        this.callParent(arguments);

		var self = this;

		this.on('painted', function() {
			HatioBB.setting.on('vehicle', this.refresh, this);
			
			this.refresh();
		});
		
		this.on('erased', function() {
			HatioBB.setting.un('vehicle', this.refresh, this);
		});
		
		this.element.on({
			delegate : 'div.iconMap',
			tap : function() {
				self.fireEvent('showMap', self.vehicle);
			}
		});
		
		this.element.on({
			delegate : 'div.iconTrack',
			tap : function() {
				self.fireEvent('showTrack', self.vehicle);
			}
		});
		
	},

	refresh : function() {
		var self = this;
		
		if(HatioBB.setting.get('vehicle') === this.vehicle) 
			return;
		
		var store = Ext.getStore('VehicleSummaryStore');
		this.vehicle = HatioBB.setting.get('vehicle');
		store.clearFilter(true);
		store.filter('id', this.vehicle);
		
		store.load(function(records) {
			var record = records[0].getData();
			var vehicleInfo = record.vehicle;
			var monthSummary = record.vehicle_month_sum;
			var consumables = record.consumables;
			var maintanence = record.maint;

			// Vehicle Info ...
			if(vehicleInfo.eco_index == 0) {
				vehicleInfo.eco_index = Math.floor((vehicleInfo.avg_effcc / vehicleInfo.official_effcc) * 100);
			}
			vehicleInfo.eco_rate = Math.floor(10 + vehicleInfo.eco_index / 4);
			vehicleInfo.total_distance_mile = (vehicleInfo.total_distance * 0.621371192237334).toFixed(2);
			var idx = Math.floor(vehicleInfo.eco_index / 20);
			vehicleInfo.eco_level = ['E', 'D', 'C', 'B', 'A'][idx];
			vehicleInfo.cost_reduction = [50, 40, 30, 20, 10][idx];
			
			// ImageClip을 리프레쉬한다.
			var vimage = self.down('[itemId=vehicleImage]');
			if(vehicleInfo.image_clip) {
				if(HatioBB.setting.get('app_mode'))
					vimage.setSrc('/download?blob-key=' + vehicleInfo.image_clip);
				else
					vimage.setSrc(vehicleInfo.image_clip);				
			} else {
				vimage.setSrc('resources/images/bgVehicle.png');
			}
			
			self.down('[itemId=briefInfo]').setData(vehicleInfo);
			self.down('[itemId=briefInfo2]').setData(vehicleInfo);
			self.down('[itemId=links]').setData(vehicleInfo);				
			self.down('[itemId=ecoInfo]').setData(vehicleInfo);			
			
			// Vehicle Month Summary
			var run_sum_data = self.down('[itemId=runningInfo]').getData() || {};
			Ext.apply(run_sum_data, monthSummary);
			run_sum_data.total_distance = vehicleInfo.total_distance;
			run_sum_data.total_distance_mile = vehicleInfo.total_distance_mile;
			run_sum_data.run_dist_mile = (run_sum_data.run_dist * 0.621371192237334).toFixed(2);
			run_sum_data.effcc = run_sum_data.effcc.toFixed(1);
			self.down('[itemId=runningInfo]').setData(run_sum_data);
			
			// Consumables
			var sorted = Ext.Array.sort(consumables, function(a, b) {
				return b.health_rate - a.health_rate;
			});
			
			self.down('[itemId=consumableInfo]').setData(Ext.Array.map(sorted.slice(0,3), function(record) {
				record.health_rate = (record.health_rate * 100).toFixed(2);
				record.health_rate_max = Math.min(1, record.health_rate).toFixed(2) * 100;
				return record;
			}));
						
			// Maintanence
			self.down('[itemId=maintInfo]').setData(maintanence);
		});		
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
				xtype: 'component',
                itemId: 'briefInfo',
				flex : 1,
                data: null,
                tpl: [
                '<div class="infoID {status}">{id}</div>',
                '<div class="infoText">' + T('label.vehicle_type') + ' : {vehicle_type}</div>',
                '<div class="infoText">' + T('label.manufacturer') + ' : {manufacturer}</div>',
                ]
            },
			{
				xtype: 'component',
                itemId: 'briefInfo2',
				flex : 1,
                data: null,
                tpl: [
                '<div class="infoID">' + T('label.reg_no') + ' : {registration_number}</div>',
				'<div class="infoText">' + T('label.birth_year') + ' : {birth_year}</div>',
                '<div class="infoText">' + T('label.fuel_type') + ' : {fuel_type}</div>'
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
				'<div class="current">이달 주행거리<span class="km">{run_dist} km</span><span class="mile">{run_dist_mile} mile</span></div>',
			'</div>',
			'<div class="fuel">',
				'<div>이달 연료 소모량 : <span>{consmpt} ℓ</span></div>',
				'<div>' + T('label.fuel_efficiency') + ' : <span>{effcc} km/ℓ</span></div>',
			'</div>'	
			]
		}
	},
	
	buildConsumableInfo : function() {
		return {
			xtype : 'component',
			itemId : 'consumableInfo',
			flex : 1,
			cls : 'summaryConsumable',
			tpl : [
			'<div class="subtitle">consumable</div>',
			'<tpl for=".">',
			'<div class="itemCell">{consumable_item} <div class="percent"><span style="width:{health_rate_max}%">{health_rate}%</span></div></div>',
			'</tpl>'
			],
		}
	}, 
	
	buildMaintenenceInfo : function() {
		return {
			xtype : 'component',
			itemId : 'maintInfo',
			flex : 1,
			cls : 'summaryRepair',
			tpl : [
			'<div class="subtitle">'+ T('label.repair') +'</div>',
			'<div class="itemCell">{repair_date}에 정비를 하였으며,<br/>다음 정비 예정일은 {next_repair_date}일 입니다.</div>'
			].join('')
		}
	}, 
	
	buildEcoDrivingInfo : function() {
		return {
			xtype : 'component',
			itemId : 'ecoInfo',
			cls : 'bgHGrident',
			width : 265,
			tpl : [
			'<div class="subtitle">eco level</div>',
			'<div class="ecoLevel {eco_level}"></div>',
			'<div class="ecoHBox">',
				'<div>'+ T('label.avg_effcc') + '/' + T('label.official_effcc') +' <span>{eco_index}%</span></div>',
				'<div>경제주행 비율<span>{eco_rate}%</span></div>',
			'</div>',	
			'<div class="ecoComment">이 차의 에코드라이브 지수는 {eco_level}레벨입니다.<br/> 공회전시간을 적절하게 관리하면, <span>연간 {cost_reduction}만원 이상의</span>유류비 절약이 가능합니다.'
			].join('')
		}
	}
});