Ext.define('HatioBB.view.Nav', {
    extend: 'Ext.navigation.View',

    xtype: 'nav',

    config: {
        // useTitleForBackButtonText: false,
		// navigationBar : false,

        items: [
        {
			title : 'Menu',

            items: [{
                xtype: 'button',
                text: 'Setup'
            },
            {
                xtype: 'button',
                text: 'Report'
            }]
        }
        ]
    }
});