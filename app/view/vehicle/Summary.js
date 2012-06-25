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
				'<div class="iconTime">' + T('label.total_run_time') + '<span>{total_run_time} ' + T('label.parentheses_min') + '</span></div>',
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
			var consumables = record.consumables;
			var maintenance = record.maint;

			// Vehicle Info ...
			if(!vehicleInfo.eco_index) {
				vehicleInfo.eco_index = Math.floor((vehicleInfo.avg_effcc / vehicleInfo.official_effcc) * 100);
			}
			
			vehicleInfo.total_distance_mile = (vehicleInfo.total_distance * 0.621371192237334).toFixed(2);
			vehicleInfo.run_dist_mile_of_month = (vehicleInfo.run_dist_of_month * 0.621371192237334).toFixed(2);
			var idx = Math.floor(vehicleInfo.eco_index / 20);
			vehicleInfo.eco_level = ['E', 'D', 'C', 'B', 'A'][idx];
			vehicleInfo.cost_reduction = [50, 40, 30, 20, 10][idx];
			
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
			self.down('[itemId=runningInfo]').setData(vehicleInfo);
			
			// Consumables
			var sorted = Ext.Array.sort(consumables, function(a, b) {
				return b.health_rate - a.health_rate;
			});
			
			self.down('[itemId=consumableInfo]').setData(Ext.Array.map(sorted.slice(0,3), function(record) {
				record.health_rate = (record.health_rate * 100).toFixed(2);
				record.health_rate_max = Math.min(1, record.health_rate).toFixed(2) * 100;
				return record;
			}));
						
			// Maintenance
			var tpl = ['<div class="subtitle">'+ T('title.maintenance') +'</div>'];
			var maintMsg = maintenance ? T('msg.maint_on_x_next_y', {x : maintenance.repair_date, y : maintenance.next_repair_date}) : T('msg.no_maint_history');
			tpl.push('<div class="itemCell">' + maintMsg + '</div>');
			self.down('[itemId=maintInfo]').setHtml(tpl.join(''));		
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
				'<div class="current">' + T('label.mileage_of_month') + '<span class="km">{run_dist_of_month} km</span><span class="mile">{run_dist_mile_of_month} mile</span></div>',
			'</div>',
			'<div class="fuel">',
				'<div>' + T('label.consumption_of_month') + ' : <span>{consmpt_of_month} ℓ</span></div>',
				'<div>' + T('label.fuel_efficiency') + ' : <span>{effcc_of_month} km/ℓ</span></div>',
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
			'<div class="subtitle">' + T('title.consumable_item') + '</div>',
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
			html : ''
		}
	}, 
	
	buildEcoDrivingInfo : function() {
		return {
			xtype : 'component',
			itemId : 'ecoInfo',
			cls : 'bgHGrident',
			width : 265,
			tpl : [
			'<div class="subtitle">' + T('label.eco_level') + '</div>',
			'<div class="ecoLevel {eco_level}"></div>',
			'<div class="ecoHBox">',
				'<div>'+ T('label.avg_effcc') + ' / ' + T('label.official_effcc') + ' <span>{eco_index}%</span></div>',
				'<div>' + T('label.eco_run_rate') + '<span>{eco_run_rate}%</span></div>',
			'</div>',	
			'<div class="ecoComment">' + T('msg.vehicle_eco_drv_result_msg', {x : '{eco_level}', y : '{cost_reduction}'})
			].join('')
		}
	}
});