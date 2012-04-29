Ext.define('HatioBB.view.Search', {
	extend: 'Ext.form.Panel',
    
    xtype: 'search',

	config : {
		layout : 'fit',
		
		left: 0,
        top: 0,

        modal: true,
        hideOnMaskTap: true,
        hidden: true,

        width: 400,
        height: 700,

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