Ext.define('HatioBB.view.Header', {
	extend : 'Ext.TitleBar',
	
	xtype : 'header',
	config : {
		title : 'HatioBB',
		items : [
			{
				id : 'nav_map',
				align : 'left',
				cls : 'headerView navMap',
				width : 50
			},
			{
				id : 'nav_info',
				align : 'left',
				cls : 'headerView navInfo'
			},
			{
				id : 'nav_incident',
				align : 'left',
				cls : 'headerView navIncident'
			},
	        {
	            iconCls : 'settings9',
	            iconMask : true,
	            align : 'right'
	        },
			{
	            iconCls : 'chat3',
	            iconMask : true,
	            align : 'right'
	        },
			{
	            iconCls : 'refresh',
	            iconMask : true,
	            align : 'right'
	        },
			{
	            iconCls : 'search2',
	            iconMask : true,
	            align : 'right'
	        },
			{
	            iconCls : 'window',
	            iconMask : true,
	            align : 'right'
	        }
	    ]
	}
});