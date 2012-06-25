Ext.define('HatioBB.view.nav.NavVehicle', {
    extend: 'Ext.dataview.List',

    xtype: 'nav_vehicle',

    requires: [
    'Ext.dataview.List'
    ],

    initialize: function() {
        this.callParent();

		var self = this;
		
		this.on('painted', function() {
			HatioBB.setting.on('vehicle', self.onVehicle, self);
			
			self.onVehicle();
		});
		
		this.on('erased', function() {
			HatioBB.setting.un('vehicle', self.onVehicle, self);
		});
    },

    config: {
        title: T('title.vehicle_list'),
		cls : 'x-button-icon',

        disclosure: true,

        store: 'VehicleMapStore',

        itemTpl: '<div class="iconVehicle"><strong>{id}</strong> {registration_number}</div>',

		onItemDisclosure : true
    },

	onVehicle : function() {
		var vehicle = HatioBB.setting.get('vehicle');

		if(vehicle)
			this.select(this.getStore().find('id', vehicle));
	}
});
