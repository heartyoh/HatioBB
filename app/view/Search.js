Ext.define('HatioBB.view.Search', {
	extend: 'Ext.form.Panel',
    
    xtype: 'search',

	config : {
		layout : 'fit',
		
		left: 0,
        top: 0,

        modal: true,

		showAnimation : 'fadeIn',
        hideOnMaskTap: true,
		hideAnimation : 'fadeOut',
        hidden: true,

        width: 400,
        height: 640,

        disclosure: true,

		items : {
			xtype : 'list',
			
	        scrollable: true,

			itemTpl: '<div class="search"><strong>{id}</strong> ({registration_number})</div>',
			
	        indexBar: true,

	        store: 'VehicleBriefStore'
		}
	}
});