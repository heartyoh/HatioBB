Ext.define('HatioBB.view.Header', {
	extend : 'Ext.TitleBar',
	
	xtype : 'header',
	
	config : {
		title : 'HatioBB',
		items : [
			{
				itemId : 'map',
				align : 'left',
				cls : 'headerView navMap',
				width : 50
			},
			{
				itemId : 'info',
				align : 'left',
				cls : 'headerView navInfo'
			},
			{
				itemId : 'incident',
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
				itemId : 'collapse',
	            iconCls : 'window',
	            iconMask : true,
	            align : 'right'
	        }
	    ]
	},
	
	setActiveStatus : function(active) {
		/* Header 내의 동일 그룹에서는 하나의 active 버튼이 있는 것으로 함. */
		Ext.Array.each(active.up().query('button'), function(item) {
			if(active === item)
				item.addCls('active');
			else
				item.removeCls('active');
		});
	}
});