Ext.define('HatioBB.view.monitor.Info', {
    extend: 'Ext.Panel',

    xtype: 'monitor_info',

    id: 'monitor_info',

    config: {
	    layout: 'fit',
	
		items : [{
            xtype: 'container',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'container',
				height : 135,
				cls : 'grayBg',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
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
		                xtype: 'image',
		                itemId: 'driverImage',
		                cls: 'imgDriver'
		            },
					{
						xtype: 'panel',
		                itemId: 'briefInfo',
		                height: 100,
		                data: null,
		                tpl: [
		                '<div class="infoID {status}">{id} ({registration_number})</div>',
						'<tpl if="driver_id">',
		                '<div class="infoText">'+ T('label.driver') +' : {driver_id} ({driver_name})</div>',
						'<tpl else>',
		                '<div class="infoText">'+ T('label.driver') +' : ' + T('label.nodriver') + '</div>',
						'</tpl>',
		                '<div class="infoText">'+ T('label.location') +' : {location}</div>'
		                ]
					}]
		        }]
			}, {
	            xtype: 'track',
				queryOn : null,// vehicle, driver 를 조회 설정으로 한다. 
				flex : 1
	        }]
		}]
    },

	refresh : function() {
		this.setVehicle();
		this.down('track').fireEvent('refresh');
	},
	
    setVehicle: function(vehicle) {
		var self = this;
		
        if (!vehicle) {
			var vid = HatioBB.setting.get('vehicle');
			if(vid) {
				vehicle = Ext.getStore('VehicleMapStore').findRecord('id', vid);
				if(!vehicle && !this.isHidden()) {
					setTimeout(function() {
						self.setVehicle();
					}, 3000);
					return;
				}
			} else {
				var did = HatioBB.setting.get('driver');
				if(did) {
					vehicle = Ext.getStore('VehicleMapStore').findRecord('driver_id', vid);
				} else {
		        	return;
				}
			}
		}
		
		if(!vehicle)
			return;
	
		var vid = vid || vehicle.get('id');
		var did = did || vehicle.get('driver_id');
		
		try {
			this.onProcessing = true;
			if(vid && (vid !== HatioBB.setting.get('vehicle')))
				HatioBB.setting.set('vehicle', vid);
			if(did && (did !== HatioBB.setting.get('driver_id')))
				HatioBB.setting.set('driver', did);
		} finally {
			this.onProcessing = false;
		}
		
		/*
		 * Get Vehicle Information (Image, Registration #, ..) from
		 * VehicleStore
		 */
		var vehicleStore = Ext.getStore('VehicleMapStore');
		var vehicleRecord = vehicleStore.findRecord('id', vehicle.get('id'));
		var vehicleImageClip = vehicleRecord.get('image_clip');
		var vimage = self.sub('vehicleImage');

		if (vehicleImageClip) {
			if(HatioBB.setting.get('app_mode'))
				vimage.setSrc('/download?blob-key=' + vehicleImageClip);
			else
				vimage.setSrc(vehicleImageClip);
		} else {
			vimage.setSrc('resources/images/bgVehicle.png');
		}

		/*
		 * Get Driver Information (Image, Name, ..) from DriverStore
		 */
		var driverStore = Ext.getStore('DriverBriefStore');
		var driverRecord = driverStore.findRecord('id', vehicle.get('driver_id'));
		var driver, driverImageClip;
		if(driverRecord) {
			driver = driverRecord.get('id');
			driverImageClip = driverRecord.get('image_clip');
		}
		var dimage = self.sub('driverImage');
		
		if (driverImageClip) {
			if(HatioBB.setting.get('app_mode'))
				dimage.setSrc('/download?blob-key=' + driverImageClip);
			else
				dimage.setSrc(driverImageClip);
		} else {
			dimage.setSrc('resources/images/bgDriver.png');
		}
		if(driverRecord) {
			vehicle.set('driver_name', driverRecord.get('name'));
		}

		vehicle.set('location', 'Resolving ..');
		HatioBB.map.getLocation(vehicle.get('lat'), vehicle.get('lng'), function(location) {
			vehicle.set('location', location);
			var info = self.down('[itemId=briefInfo]');
			if(info) {
				info.setData(vehicle.getData());
			}
		});
        this.sub('briefInfo').setData(vehicle.getData());
    }
});