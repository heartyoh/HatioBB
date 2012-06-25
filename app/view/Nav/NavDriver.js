Ext.define('HatioBB.view.nav.NavDriver', {
    extend: 'Ext.dataview.List',

    xtype: 'nav_driver',

    requires: [
    'Ext.dataview.List'
    ],

    initialize: function() {
        this.callParent();

		var self = this;
		
		this.on('painted', function() {
			HatioBB.setting.on('driver', self.onDriver, self);
			
			self.onDriver();
		});
		
		this.on('erased', function() {
			HatioBB.setting.un('driver', self.onDriver, self);
		});
    },

    config: {
        title: T('title.driver_list'),

        disclosure: true,

        store: 'DriverBriefStore',

        itemTpl: '<div class="iconDriver"><strong>{id}</strong> {name}</div>',

		onItemDisclosure : true
    },

	onDriver : function() {
		var driver = HatioBB.setting.get('driver');

		if(driver)
			this.select(this.getStore().find('id', driver));
	}
});
