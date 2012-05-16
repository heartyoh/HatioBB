Ext.define('HatioBB.view.vehicle.Info', {
	extend : 'Ext.form.Panel',

	requires: ['Ext.form.FieldSet'],
	
	xtype : 'vehicle_info',
	
	constructor : function(config) {
        this.callParent(arguments);

		var self = this;

		Ext.getStore('VehicleStore').on('load', this.refreshVehicle, self);
	},
	
	destroy : function() {
		Ext.getStore('VehicleStore').un('load', this.refreshVehicle, self);
	},
	
	refreshVehicle : function(store) {
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
				name : 'registration_number',
				label : T('label.reg_no')
			}, {
				name : 'manufacturer',
				label : T('label.manufacturer')
			}, {
				name : 'vehicle_type',
				label : T('label.x_type', {x : T('label.vehicle')})
			}, {
				name : 'fuel_type',
				label : T('label.fuel_type')
			}, {
				name : 'birth_year',
				label : T('label.birth_year')
			}, {
				name : 'ownership_type',
				label : T('label.x_type', {x : T('label.ownership')})
			}, {
				name : 'status',
				label : T('label.status')
			}, {
				name : 'total_distance',
				label : T('label.total_x', {x : T('label.distance')})
			}, {
				name : 'remaining_fuel',
				label : T('label.remaining_fuel')
			}, {
				name : 'driver_id',
				label : T('label.driver'),
				disabled : true
			}, {
				name : 'terminal_id',
				label : T('label.terminal'),
				disabled : true
			}, {
				name : 'lattitude',
				label : T('label.lattitude'),
				disabled : true
			}, {
				name : 'longitude',
				label : T('label.longitude'),
				disabled : true				
			}]
		}]
		
		// {
			    	//     	    	xtype : 'image',
			    	//     	    	anchor : '25%',
			    	//     	    	height : '150',
			    	//     	    	itemId : 'image',
			    	//     	    	cls : 'paddingBottom10'
			    	//     	    },			    	         
			    	// {
			// }, {
			// 	xtype : 'codecombo',
			// 	name : 'manufacturer',
			// 	group : 'V-Maker',
			// 	label : T('label.manufacturer')
			// }, {
			// 	xtype : 'codecombo',
			// 	name : 'vehicle_type',
			// 	group : 'V-Type1',
			// 	label : T('label.x_type', {x : T('label.vehicle')})
			// }, {
			// 	xtype : 'codecombo',
			// 	name : 'fuel_type',
			// 	group : 'V-Fuel',
			// 	label : T('label.fuel_type')
			// }, {
			// 	xtype : 'filefield',
			// 	name : 'image_file',
			// 	label : T('label.image_upload'),
			// 	msgTarget : 'side',
			// 	allowBlank : true,
			// 	buttonText : T('button.file')
			// }, {
			// 	xtype : 'codecombo',
			// 	name : 'birth_year',
			// 	group : 'V-BirthYear',
			// 	name : 'birth_year',
			// 	label : T('label.birth_year')
			// }, {
			// 	xtype : 'combo',
			// 	name : 'ownership_type',
			// 	queryMode : 'local',
			// 	store : 'OwnershipStore',
			// 	displayField : 'desc',
			// 	valueField : 'name',
			// 	label : T('label.x_type', {x : T('label.ownership')})
			// }, {
			// 	xtype : 'combo',
			// 	name : 'status',
			// 	queryMode : 'local',
			// 	store : 'VehicleStatusStore',
			// 	displayField : 'desc',
			// 	valueField : 'status',
			// 	label : T('label.status')
			// }, {
			// 	xtype : 'datefield',
			// 	name : 'updated_at',
			// 	disabled : true,
			// 	label : T('label.updated_at'),
			// 	format : F('datetime')
			// }, {
			// 	xtype : 'datefield',
			// 	name : 'created_at',
			// 	disabled : true,
			// 	label : T('label.created_at'),
			// 	format : F('datetime')
			// }, {
			// 	xtype : 'displayfield',
			// 	name : 'image_clip',
			// 	itemId : 'image_clip',
			// 	hidden : true
			// } 
	}
});