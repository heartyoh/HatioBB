Ext.define('HatioBB.mixin.Nav', function() {
	var content, header;
	
	var getContent = function() {
		if(!content)
			content = Ext.getCmp('content');
		return content;
	};
	
	var getHeader = function() {
		if(!header)
			header = Ext.getCmp('header');
		return header;
	};
	
	function showMonitor(monitor) {
		var view = getContent().getComponent(monitor);
		if(!view) {
			getContent().removeAll();
			view = getContent().add({
				xtype : monitor
			});
		}
		getContent().setActiveItem(view);
		getHeader().setActiveStatus(view.getId());
		
		return view;
	};
	
	function showVehicle() {
		var view = getContent().getComponent('vehicle');
		if(!view) {
			getContent().removeAll();
			view = getContent().add({
				xtype : 'vehicle'
			});
		}
		getContent().setActiveItem(view);
		getHeader().clearActiveStatus();
		
		return view;
	};
	
	function showDriver() {
		var view = getContent().getComponent('driver');
		if(!view) {
			getContent().removeAll();
			view = getContent().add({
				xtype : 'driver'
			});
		}
		getContent().setActiveItem(view);
		getHeader().clearActiveStatus();
		
		return view;
	};
	
	return {
		nav : {
			monitor : showMonitor,
			vehicle : showVehicle,
			driver : showDriver
		}
	};
}());