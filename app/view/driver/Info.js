Ext.define('HatioBB.view.driver.Info', {
	extend : 'Ext.form.Panel',

	requires: ['Ext.form.FieldSet'],
	
	xtype : 'driver_info',
	
	constructor : function(config) {
        this.callParent(arguments);

		var self = this;

		Ext.getStore('DriverStore').on('load', this.refresh, self);
	},
	
	destroy : function() {
		Ext.getStore('DriverStore').un('load', this.refresh, self);

		this.callParent(arguments);
	},
	
	refresh : function(store) {
		this.setRecord(store.first());
	},
	
	config : {
		scrollable : true,
		
		cls : 'paddingAll15',
		
		items : [{
			xtype : 'fieldset',
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