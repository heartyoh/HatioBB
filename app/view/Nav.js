Ext.define('HatioBB.view.Nav', {
    extend: 'Ext.navigation.View',

    xtype: 'nav',

    requires: [
    'Ext.dataview.List',
    'HatioBB.view.nav.NavMenu',
    'HatioBB.view.nav.NavVehicle',
    'HatioBB.view.nav.NavDriver',
    'HatioBB.view.nav.NavFav',
    'HatioBB.view.nav.NavComm',
    'HatioBB.view.nav.NavNoti',
    'HatioBB.view.nav.NavReport'
    ],

    config: {

        items: [
        {
            xtype: 'container',
            cls: 'mainNav',
            layout: {
                type: 'vbox'
            },
            items: [
            {
                xtype: 'button',
                id: 'nav_vehicle',
                text: T('menu.vehicle'),
				cls : 'navBtn',
                iconCls: 'iconVehicle'
            },
            {
                xtype: 'button',
                id: 'nav_driver',
                text: T('menu.driver'),
				cls : 'navBtn',
                iconCls: 'iconDriver'
            },
            {
                xtype: 'button',
                id: 'nav_report',
                text: T('menu.report'),
				cls : 'navBtn',
                iconCls: 'iconReport'
            },
            {
                xtype: 'panel',
                itemId: 'status',
                height: 115,
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                cls: 'statusPanel',
                items: [{
                    xtype: 'button',
                    itemId: 'state_running',
                    flex: 1,
                    cls: 'btnDriving',
					state : 'Running'
                },
                {
                    xtype: 'button',
                    itemId: 'state_idle',
                    flex: 1,
                    cls: 'btnStop',
					state : 'Idle'
                },
                {
                    xtype: 'button',
                    itemId: 'state_incident',
                    flex: 1,
                    cls: 'btnIncident',
					state : 'Incident'
                },
                {
                    xtype: 'button',
                    itemId: 'state_maint',
                    flex: 1,
                    cls: 'btnMaint',
					state : 'Maint'
                }]
            },
            {
                xtype: 'carousel',
                direction: 'horizontal',
                flex: 1,
                items: [{
                    xtype: 'panel',
                    itemId: 'incidents',
					scrollable : {
					    direction: 'vertical',
					    directionLock: true
					},
                    cls: 'incidentPanel',
					html : T('title.incidents_alarm'),
                },
                {
                    xtype: 'panel',
                    itemId: 'vgroups',
                    cls: 'groupPanel vGroup',
					html: T('title.vehicle_group'),
                },
				{
                    xtype: 'panel',
                    itemId: 'dgroups',
                    cls: 'groupPanel dGroup',
					html: T('title.driver_group'),
                }]
            }]
        }]
    }
});