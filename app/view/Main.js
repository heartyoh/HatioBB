Ext.define('HatioBB.view.Main', {
    extend: 'Ext.Container',

    requires: ['Ext.TitleBar', 'HatioBB.view.Nav', 'HatioBB.view.Content'],

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
            xtype: 'nav',
            docked: 'left',
            width: 250
        },
        {
            id: 'content',
			xtype : 'content'
        }
        ]
    }
});