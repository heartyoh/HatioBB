//<debug>
Ext.Loader.setPath({
    'Ext': 'sdk/src',
	'HatioBB': 'app'
});
//</debug>

Ext.define('HatioBB', {
	singleton : true,
	mixins : {
		// msg : 'HatioBB.mixin.Msg',
		user : 'HatioBB.mixin.User',
		// mixin : 'HatioBB.mixin.Mixin',
		// ui : 'HatioBB.mixin.UI',
		// state : 'HatioBB.mixin.State',
		// util : 'HatioBB.mixin.Import'
		subitem : 'HatioBB.mixin.SubItem'
	}
});

Ext.application({
    controllers: ["Main"],

    name: 'HatioBB',

    requires: [
        'Ext.MessageBox'
    ],

    controllers: ['Main', 'Vehicle', 'Driver','Report'],
    views: ['Main'],
    stores: ['Menus', 'Vehicles', 'Drivers','Reports', 'VehicleFilteredStore', 'RecentIncidentStore', 'VehicleMapStore', 'DriverBriefStore', 'VehicleGroupStore'],

    icon: {
        57: 'resources/icons/Icon.png',
        72: 'resources/icons/Icon~ipad.png',
        114: 'resources/icons/Icon@2x.png',
        144: 'resources/icons/Icon~ipad@2x.png'
    },
    
    phoneStartupScreen: 'resources/loading/Homescreen.jpg',
    tabletStartupScreen: 'resources/loading/Homescreen~ipad.jpg',

    launch: function() {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        // Initialize the main view
        Ext.Viewport.add(Ext.create('HatioBB.view.Main'));
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function() {
                window.location.reload();
            }
        );
    }
});
