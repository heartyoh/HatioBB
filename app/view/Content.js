Ext.define('HatioBB.view.Content', {
    extend: 'Ext.navigation.View',

    xtype: 'content',

    config: {
        items: [
        {
            id: 'launch',
			title : 'Hatio BB',
            cls: 'card',
            scrollable: true,
            html: '<div><h2>Welcome to Hatio BB.</h2></div>'
        // },
        // {
        //     id: 'content',
        //     xtype: 'titlebar',
        //     docked: 'top',
        //     title: 'Hatio BB',
        //     items: [{
        //         xtype: 'button',
        //         id: 'btnSup',
        //         hidden: true,
        //         align: 'light',
        //         ui: 'action',
        //         action: 'viewSupplement',
        //         text: 'Supplement'
        //     }]
        }
        ]
    }
});