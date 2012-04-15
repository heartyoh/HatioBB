Ext.define('HatioBB.view.Header', {
	extend : 'Ext.TitleBar',
	
	xtype : 'header',
	config : {
		title : 'HatioBB',
		items : [
			{
				iconCls : 'add',
				id : 'nav_map',
	            iconMask : true,
				align : 'left',
				iconCls : 'iconMap'
			},
			{
				iconCls : 'add',
				id : 'nav_info',
	            iconMask : true,
				align : 'left',
				iconCls : 'iconInfo'
			},
			{
				iconCls : 'add',
				id : 'nav_incident',
	            iconMask : true,
				align : 'left',
				iconCls : 'iconIncident'
			},
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