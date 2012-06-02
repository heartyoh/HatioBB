Ext.define('HatioBB.view.vehicle.Summary', {
	extend : 'Ext.Panel',
		
	xtype : 'vehicle_summary',
	
	config : {
		scrollable : true,
		
		cls : 'paddingAll15 grayBg',
		
		layout : {
			type : 'vbox',
			align : 'stretch'
		}
	},

	constructor : function(config) {
        config.items = [this.buildVehicleInfo(), {
			xtype : 'container',
			itemId : 'links',
			height : 45,
			cls : 'divHAlign',
			html : ['<div class="iconMap"><span>Current Position Map</span></div>',
			'<div class="iconTrack"><span>Recent Running Track</span></div>'].join('')
        }, {
			xtype : 'container',
			flex : 1,
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [
				this.buildRunningInfo(),
				{
					xtype : 'container',
					flex : 1,
					layout : {
						type : 'vbox',
						align : 'stretch'
					},
					items : [
						this.buildConsumableInfo(),
						this.buildMaintenenceInfo()
					]
				},
				this.buildEchoDrivingInfo()
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
	},

	refresh : function() {
		var self = this;
		
		if(HatioBB.setting.get('vehicle') === this.vehicle) 
			return;
			
		var store = Ext.getStore('VehicleStore');
		this.vehicle = HatioBB.setting.get('vehicle');
		
		store.filter('id', this.vehicle);
		store.load(function(records) {
			// TODO 아래 라인을 삭제한다. 테스트 용임.
			records[0].set('remaining_fuel', Math.floor(Math.random() * 50));
			
			self.setRecord(records[0]);

			self.down('[itemId=briefInfo]').setData(records[0].getData());
			self.down('[itemId=briefInfo2]').setData(records[0].getData());
			self.down('[itemId=runningInfo]').setData(records[0].getData());

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
				xtype: 'panel',
                itemId: 'briefInfo',
				flex : 1,
                data: null,
                tpl: [
                '<div class="infoID {status}">{id}</div>',
                '<div class="infoText">' + T('label.x_type', {x : T('label.vehicle')}) + ' : {vehicle_type}</div>',
                '<div class="infoText">' + T('label.manufacturer') + ' : {manufacturer}</div>',
                '<div class="infoText">' + T('label.birth_year') + ' : {birth_year}</div>'
                ]
            },
			{
				xtype: 'panel',
                itemId: 'briefInfo2',
				flex : 1,
                data: null,
                tpl: [
                '<div class="infoID">' + T('label.reg_no') + ' : {registration_number}</div>',
                '<div class="infoText">' + T('label.fuel_type') + ' : {fuel_type}</div>',
                '<div class="infoText">' + T('label.remaining_fuel') + ' : {remaining_fuel}</div>',
                '<div class="infoText">' + T('label.total_x', {x : T('label.distance')}) + ' : {total_distance}</div>'
                ]
			}]
        }
    },

	buildRunningInfo : function() {
		return {
			xtype : 'panel',
			itemId : 'runningInfo',
			data : null,
			flex : 1,
			tpl : [
			'<div>총 주행거리 : {total_distance} 킬로미터</div>',
			'<div>이달 주행거리 : 202.7 킬로미터</div>',
			'<div>이달 주행시간 : 1,670 분</div>',
			'<div>이달 연료 소모량 : 170 리터</div>',
			'<div>이달 연비 : 7 킬로미터/리터</div>'
			]
		}
	},
	
	buildConsumableInfo : function() {
		return {
			xtype : 'panel',
			flex : 1,
			html : [
			'<div>이 차는</div>',
			'<div>엔진오일의 교체시기가 초과되었으며,</div>',
			'<div>배터리와 휠얼라인먼트의 교체주기가 임박하였습니다.</div>'
			].join('')
		}
	}, 
	
	buildMaintenenceInfo : function() {
		return {
			xtype : 'panel',
			flex : 1,
			html : [
			'<div>이 차는</div>',
			'<div>2012년 1월 31일에 정비를 하였으며,</div>',
			'<div>다음 정비 예정일은 2012년 6월 30일 입니다.</div>'
			].join('')
		}
	}, 
	
	buildEchoDrivingInfo : function() {
		return {
			xtype : 'panel',
			flex : 1,
			html : [
			'<div>이 차의 경제운전 지수는 B 등급으로</div>',
			'<div>공인연비의 70% 이상 달성한 상태입니다.</div>',
			'<div>경제속도 주행 비율은 34% 이며,</div>',
			'<div>공회전시간을 적절하게 관리하면, 연간 40만원 이상의</div>',
			'<div>유류비 절약이 가능합니다.</div>'
			].join('')
		}
	}
});