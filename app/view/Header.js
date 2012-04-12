Ext.define('HatioBB.view.Header', {
	extend : 'Ext.TitleBar',
	
	xtype : 'header',
	config : {
		docked :'top',
		title : 'HatioBB',
		items : [
		        {
		            iconCls : 'add',
		            iconMask : true,
		            align : 'left'
		        },
		        {
		            iconCls : 'home',
		            iconMask : true,
		            align : 'right'
		        }
		    ]
	}
});