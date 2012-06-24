Ext.define('HatioBB.view.vehicle.Summary', {
	extend : 'Ext.Panel',
		
	xtype : 'vehicle_summary',
	
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
				'<div class="iconFuel">Remaining Fuel<span>{remaining_fuel}</span></div>',
				'<div class="iconTime">Total Drive Time<span>5,500 min</span></div>',
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
			
		var store = Ext.getStore('VehicleStore');
		this.vehicle = HatioBB.setting.get('vehicle');

		store.clearFilter(true);
		store.filter('id', this.vehicle);
		store.load(function(records) {
			var data = records[0].getData();
			
			self.down('[itemId=briefInfo]').setData(data);
			self.down('[itemId=briefInfo2]').setData(data);
			self.down('[itemId=links]').setData(records[0].getData());
			
			data.eff_rate = data.eco_index;
			data.eco_rate = Math.floor(10 + data.eff_rate / 4);
			var idx = Math.floor(data.eff_rate / 20);
			data.eco_level = ['E', 'D', 'C', 'B', 'A'][idx];
			data.cost_reduction = [50, 40, 30, 20, 10][idx];
			self.down('[itemId=ecoInfo]').setData(data);

			var run_data = self.down('[itemId=runningInfo]').getData() || {};
			run_data.total_distance = data.total_distance;
			run_data.total_distance_mile = (data.total_distance * 0.621371192237334).toFixed(2);
			self.down('[itemId=runningInfo]').setData(run_data);

			// ImageClip을 리프레쉬한다.
			var imageClip = records[0].get('image_clip');
			var vimage = self.down('[itemId=vehicleImage]');
			if(imageClip) {
				if(HatioBB.setting.get('app_mode'))
					vimage.setSrc('/download?blob-key=' + imageClip);
				else
					vimage.setSrc(imageClip);
				
			} else {
				vimage.setSrc('resources/images/bgVehicle.png');
			}
		});
		
		var run_store = Ext.getStore('VehicleRunStore');
		var now = new Date();
		run_store.clearFilter(true);
		run_store.filter([{
			property : 'vehicle',
			value : this.vehicle
		}, {
			property : 'year',
			value : now.getFullYear()
		}, {
			property : 'month',
			value : now.getMonth() + 1
		}]);
		run_store.load(function(records) {
			var data = records[0].getData();

			var run_data = self.down('[itemId=runningInfo]').getData() || {};
			Ext.apply(run_data, data);
			run_data.run_dist_mile = (run_data.run_dist * 0.621371192237334).toFixed(2);
			run_data.effcc = run_data.effcc.toFixed(1);
			self.down('[itemId=runningInfo]').setData(run_data);
		});
		
		var consumable_store = Ext.getStore('VehicleConsumableStore');

		consumable_store.load({
			params : {
				vehicle_id : this.vehicle
			},
			callback : function(records) {
				var sorted = Ext.Array.sort(records, function(a, b) {
					return b.get('health_rate') - a.get('health_rate');
				});
				self.down('[itemId=consumableInfo]').setData(Ext.Array.map(sorted.slice(0,3), function(record) {
					var data = record.getData();
					data.health_rate = data.health_rate.toFixed(2);
					data.health_rate_max = Math.min(1, data.health_rate).toFixed(2);
					return data;
				}));
			}
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
                '<div class="infoText">' + T('label.x_type', {x : T('label.vehicle')}) + ' : {vehicle_type}</div>',
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
				'<div class="total">총 주행거리<span class="km">{total_distance} km</span><span class="mile">{total_distance_mile} mile</span></div>',
				'<div class="current">이달 주행거리<span class="km">{run_dist} km</span><span class="mile">{run_dist_mile} mile</span></div>',
			'</div>',
			'<div class="fuel">',
				'<div>이달 연료 소모량 : <span>{consmpt} ℓ</span></div>',
				'<div>연비 : <span>{effcc} km/ℓ</span></div>',
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
			'<div class="itemCell">{consumable_item} <div class="percent"><span style="width:{health_rate_max * 100}%">{health_rate * 100}%</span></div></div>',
			'</tpl>'
			],
		}
	}, 
	
	buildMaintenenceInfo : function() {
		return {
			xtype : 'component',
			flex : 1,
			cls : 'summaryRepair',
			html : [
			'<div class="subtitle">repair</div>',
			'<div class="itemCell">2012년 1월 31일에 정비를 하였으며,<br/>다음 정비 예정일은 2012년 6월 30일 입니다.</div>'
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
				'<div>평균/공인 연비 <span>{eff_rate}%</span></div>',
				'<div>경제주행 비율<span>{eco_rate}%</span></div>',
			'</div>',	
			'<div class="ecoComment">이 차의 에코드라이브 지수는 {eco_level}레벨입니다.<br/> 공회전시간을 적절하게 관리하면, <span>연간 {cost_reduction}만원 이상의</span>유류비 절약이 가능합니다.'
			].join('')
		}
	}
});