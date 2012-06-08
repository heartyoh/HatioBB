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
			html : [
				'<div class="iconTime">Total Drive Time<span>5,500 min</span></div>',
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
			
		var store = Ext.getStore('DriverStore');
		this.driver = HatioBB.setting.get('driver');
		
		store.filter('id', this.driver);
		store.load(function(records) {
			self.setRecord(records[0]);

			self.down('[itemId=briefInfo]').setData(records[0].getData());
			self.down('[itemId=briefInfo2]').setData(records[0].getData());
			self.down('[itemId=runningInfo]').setData(records[0].getData());

			// ImageClip을 리프레쉬한다.
			var imageClip = records[0].get('image_clip');
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
				xtype: 'panel',
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
				xtype: 'panel',
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
			xtype : 'panel',
			itemId : 'runningInfo',
			data : null,
			flex : 1,
			cls : 'paddingT25 paddingR10 paddingL10',
			tpl : [
			
			'<div class="distance">',
				'<div class="total">총 주행거리<span class="km">{total_distance} km</span><span class="mile">159071.025 mile</span></div>',
				'<div class="current">이달 주행거리<span class="km">202.7 km</span><span class="mile">0.125952 mile</span></div>',
			'</div>',
			'<div class="fuel">',
				'<div>이달 연료 소모량 : <span>170ℓ</span></div>',
				'<div>이달 연비 : <span>7km/ℓ</span></div>',
			'</div>'
			]
		}
	},

	buildEcoDrivingInfo : function() {
		return {
			xtype : 'panel',
			flex : 1,
			cls : 'bgHGrident',
			width : 265,
			html : [
			'<div class="subtitle">my eco level</div>',
			'<div class="ecoLevel D"></div>',
			'<div class="ecoHBox">',
				'<div>공인연비 <span>70%</span></div>',
				'<div>경제주행 비율<span>34%</span></div>',
			'</div>',	
			'<div class="ecoComment">이 차의 에코드라이브 지수는 B레벨입니다.<br/> 공회전시간을 적절하게 관리하면, <span>연간 40만원 이상의</span>유류비 절약이 가능합니다.'
			].join('')
		}
	}
});