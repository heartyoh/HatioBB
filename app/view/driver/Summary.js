Ext.define('HatioBB.view.driver.Summary', {
	extend : 'Ext.form.Panel',

	requires: ['Ext.form.FieldSet'],
	
	xtype : 'driver_summary',
	
	config : {
		scrollable : true,
		
		cls : 'paddingAll15 grayBg',
		
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
				this.buildEchoDrivingInfo()
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
	},
	
	refresh : function() {
		var self = this;
		
		if(HatioBB.setting.get('driver') === this.driver) 
			return;
			
		var store = Ext.getStore('DriverStore');
		this.driver = HatioBB.setting.get('driver');
		
		store.filter('id', this.driver);
		store.load(function(records) {
			// TODO 아래 라인을 삭제한다. 테스트 용임.
			records[0].set('social_id', Math.floor(Math.random() * 1000000000));
			
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
                '<div class="infoText">' + T('label.birth_year') + ' : {birth_year}</div>'
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
                '<div class="infoText">' + T('label.phone_x', {x : 2}) + ' : {phone_no_2}</div>'
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

	buildEchoDrivingInfo : function() {
		return {
			xtype : 'panel',
			flex : 1,
			html : [
			'<div>이 운전자의 경제운전 지수는 B 등급으로</div>',
			'<div>공인연비의 70% 이상 달성한 상태입니다.</div>',
			'<div>경제속도 주행 비율은 34% 이며,</div>',
			'<div>공회전시간을 적절하게 관리하면, 연간 40만원 이상의</div>',
			'<div>유류비 절약이 가능합니다.</div>'
			].join('')
		}
	}
});