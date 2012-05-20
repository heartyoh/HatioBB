Ext.define('HatioBB.view.Header', {
	extend : 'Ext.TitleBar',
	
	xtype : 'header',
	
	config : {
		title : 'GreenFleets',
		items : [
			{
				itemId : 'map',
				target : 'monitor_map',
				align : 'left',
				cls : 'headerView navMap',
				width : 50
			},
			{
				itemId : 'info',
				target : 'monitor_info',
				align : 'left',
				cls : 'headerView navInfo'
			},
			{
				itemId : 'incident',
				target : 'monitor_incident',
				align : 'left',
				cls : 'headerView navIncident'
			},
	        {
				itemId : 'setting',
	            iconCls : 'settings9',
	            iconMask : true,
	            align : 'right'
	        },
			// {
			// 	xtype : 'setting',
			// 	id : 'settingPopup'
			// },
			{
	            iconCls : 'chat3',
	            iconMask : true,
	            align : 'right'
	        },
			{
				itemId : 'refresh',
	            iconCls : 'refresh',
	            iconMask : true,
	            align : 'right'
	        },
			{
				itemId : 'search',
	            iconCls : 'search2',
	            iconMask : true,
	            align : 'right'
	        },
			{
				xtype : 'search',
				id : 'searchPopup'
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
		/* active : active content view id */
		var button = this.down('button[target=' + active + ']');
		
		/* Header 내의 동일 그룹에서는 하나의 active 버튼이 있는 것으로 함. */
		Ext.Array.each(button.up().query('button'), function(item) {
			if(button === item)
				item.addCls('active');
			else
				item.removeCls('active');
		});
	},

	clearActiveStatus : function() {
		Ext.Array.each(this.query('button'), function(item) {
			item.removeCls('active');
		});
	}
});