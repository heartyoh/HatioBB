//<debug>
Ext.Loader.setPath({
    'Ext': 'sdk/src',
	'HatioBB': 'app'
});
//</debug>

Ext.define('HatioBB', {
	singleton : true,
	mixins : {
		user : 'HatioBB.mixin.User',
		subitem : 'HatioBB.mixin.SubItem',
		setting : 'HatioBB.mixin.Setting'
	}
});

Ext.application({
    controllers: ["Main"],

    name: 'HatioBB',

    requires: [
        'Ext.MessageBox'
    ],

    controllers: ['Main', 'Vehicle', 'Driver','Report'],
    views: ['Main', 'Search', 'Setting'],
    stores: ['Menus', 'Reports', 'VehicleFilteredStore', 'RecentIncidentStore', 'VehicleMapStore', 
			'VehicleBriefStore', 'DriverBriefStore', 'VehicleGroupStore', 'TrackByVehicleStore', 
			'IncidentByVehicleStore', 'IncidentLogStore'],

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
