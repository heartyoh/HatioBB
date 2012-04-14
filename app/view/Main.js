Ext.define('HatioBB.view.Main', {
    extend: 'Ext.Container',

    xtype: 'main',

    requires: [
    'Ext.navigation.View',
    'Ext.navigation.Bar',
    'HatioBB.view.Nav',
    'HatioBB.view.Content',
	'HatioBB.view.Header'
    ],

    config: {
        fullscreen: true,

        layout: {
            type: 'card',
            animation: {
                type: 'slide',
                direction: 'left',
                duration: 250
            }
        },

        items: [
        {
            id: 'nav',
			cls : 'nav',
            xtype: 'nav',
            docked: 'left',
            // navigationBar: false,
            width: 255
        },
		// {
		// 	id: 'header',
		// 	xtype : 'header',
		//             docked: 'top'
		// },
        {
            id: 'content',
            xtype: 'content'
        }
        ]
    }
});