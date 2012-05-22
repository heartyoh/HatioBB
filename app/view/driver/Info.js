Ext.define('HatioBB.view.driver.Info', {
	extend : 'Ext.form.Panel',

	requires: ['Ext.form.FieldSet'],
	
	xtype : 'driver_info',
	
	constructor : function(config) {
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
		
		store.filter('driver_id', this.driver);
		store.load(function(records) {
			// TODO 아래 라인을 삭제한다. 테스트 용임.
			records[0].set('social_id', Math.floor(Math.random() * 1000000000));
			
			self.setRecord(records[0]);

			// ImageClip을 리프레쉬한다.
			var imageClip = records[0].get('image_clip');
			if(imageClip)
				self.down('image').setSrc(imageClip);
			else
				self.down('image').setSrc('resources/images/bgDriver.png');
		});
	},
	
	config : {
		scrollable : true,
		
		layout : 'hbox',
		
		cls : 'paddingAll15',
		
		items : [{
			xtype : 'image',
			itemId : 'driverImage',
			cls: 'imgDriver'
		},{
			xtype : 'fieldset',
			flex : 1,
			defaults : {
				xtype : 'textfield'
			},
			items : [{
				name : 'key',
				label : 'Key',
				hidden : true
			}, {
				name : 'id',
				label : T('label.id')
			}, {
				name : 'name',
				label : T('label.name')
			}, {
				name : 'division',
				label : T('label.division')
			}, {
				name : 'title',
				label : T('label.title')
			}, {
				name : 'social_id',
				label : T('label.x_id', {x : T('label.social')})
			}, {
				name : 'phone_no_1',
				label : T('label.phone_x', {x : 1})
			}, {
				name : 'phone_no_2',
				label : T('label.phone_x', {x : 2})
			} ]
		}]
	}
});