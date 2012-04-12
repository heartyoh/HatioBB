Ext.define('HatioBB.view.Content', {
    extend : 'Ext.Panel',

    xtype : 'content',

    config : {
		title : 'HatioBB',
		
		layout : 'fit',

        items : [
        {
            id : 'launch',
            cls : 'launchscreen',
            scrollable : true,
			html : 'Hello, Hatio BB'
            // html: '<div style="text-align:center;padding-top:20%"><img src="resources/images/intro.png"/></div>'
        }
        ]
    }
});
