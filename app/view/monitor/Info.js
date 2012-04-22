Ext.define('HatioBB.view.monitor.Info', {
    extend: 'Ext.Panel',

    xtype: 'monitor_info',

    id: 'monitor_info',

    layout: 'fit',

    constructor: function(config) {
        config.items = [{
            xtype: 'container',
            height: 320,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'container',
                width: 620,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [
                this.buildVehicleInfo(),
                this.buildIncidents()
                ]
            },
            this.buildMap()
            ]
        }];

        this.callParent(arguments);
    },

    config: {
        scrollable: true
    },

    setVehicle: function(vehicle) {
        if (!vehicle)
        return;

        // this.sub('vehicleImage').
        // this.sub('driverImage).
        this.sub('briefInfo').setData(vehicle.getData());
    },

    buildVehicleInfo: function() {
        return {
            xtype: 'panel',
            title: T('title.vehicle_information'),
            // cls : 'paddingPanel',
            layout: {
                type: 'hbox'
            },
            items: [{
                xtype: 'image',
                itemId: 'vehicleImage',
                width: 160,
                height: 160,
                cls: 'imgVehicle'
            },
            {
                xtype: 'image',
                itemId: 'driverImage',
                width: 160,
                height: 160,
                cls: 'imgDriver'
            },
            {
                xtype: 'panel',
                itemId: 'briefInfo',
                height: 160,
                data: null,
                flex: 1,
                tpl: [
                '<div>ID : {id}</div>',
                '<div>Driver ID : {driver_id}</div>',
                '<div>Terminal ID : {terminal_id}</div>',
                '<div>Location : {location}</div>',
                '<div>Distance : {distance}</div>',
                '<div>Running Time : {running_time}</div>'
                ]
            }]
        }
    },

    buildIncidents: function() {
        return {
            xtype: 'panel',
            html: 'incident info'
        }
    },

    buildMap: function() {
        return {
            xtype: 'panel',
            html: 'Map'
        }
    }

});