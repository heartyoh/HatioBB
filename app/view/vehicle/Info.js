Ext.define('HatioBB.view.vehicle.Info', {
	extend : 'Ext.form.Panel',

	requires: ['Ext.form.FieldSet'],
	
	xtype : 'vehicle_info',
	
	constructor : function(config) {
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
		
		store.filter('vehicle_id', this.vehicle);
		store.load(function(records) {
			// TODO 아래 라인을 삭제한다. 테스트 용임.
			records[0].set('remaining_fuel', Math.floor(Math.random() * 50));
			
			self.setRecord(records[0]);

			// ImageClip을 리프레쉬한다.
			var imageClip = records[0].get('image_clip');
			if(imageClip)
				self.down('image').setSrc(imageClip);
			else
				self.down('image').setSrc('resources/images/bgVehicle.png');
		});
	},
	
	config : {
		scrollable : true,
		
		cls : 'paddingAll15',
		
		layout : 'hbox',
		
		items : [{
				xtype : 'image',
				itemId : 'vehicleImage',
				cls: 'imgVehicle'
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