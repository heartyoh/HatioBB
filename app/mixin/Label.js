Ext.define('HatioBB.mixin.Label', function() {
	function Label(opt_options) {
		// Initialization
		this.setValues(opt_options);

		// Label specific
		var span = this.span_ = document.createElement('div');
		this.span_.setAttribute('class', 'mapTipID');

		var div = this.div_ = document.createElement('div');
		div.appendChild(span);
		div.style.cssText = 'position: absolute; display: none';;
	};
	Label.prototype = new google.maps.OverlayView;

	// Implement onAdd
	Label.prototype.onAdd = function() {
		var pane = this.getPanes().overlayMouseTarget;
		pane.appendChild(this.div_);

		this.show = true;

		// Ensures the label is redrawn if the text or position is changed.
		var me = this;
		this.listeners_ = [ google.maps.event.addListener(this, 'position_changed', function() {
			me.draw();
		}), google.maps.event.addListener(this, 'text_changed', function() {
			me.draw();
		}),	google.maps.event.addListener(this, 'zindex_changed', function() {
			me.draw();
		}) ];
	};

	Label.prototype.setVisible= function(showOrNot) {
		this.show = showOrNot;
		this.draw();
	};

	// Implement onRemove
	Label.prototype.onRemove = function() {
		this.div_.parentNode.removeChild(this.div_);

		// Label is removed from the map, stop updating its position/text.
		for ( var i = 0, I = this.listeners_.length; i < I; ++i) {
			google.maps.event.removeListener(this.listeners_[i]);
		}
	};

	// Implement draw
	Label.prototype.draw = function() {
		var projection = this.getProjection();
		if(!projection)
			return;
		var position = projection.fromLatLngToDivPixel(this.get('position'));

		var div = this.div_;

		var xoffset = parseInt(this.get('xoffset')) || 0;
		var yoffset = parseInt(this.get('yoffset')) || 0;

		div.style.left = position.x + xoffset + 'px';
		div.style.top = position.y + yoffset + 'px';
		div.style.display = this.show ? 'block' : 'none';

		this.span_.innerHTML = this.get('text').toString();
	};
	
	return {
		label : {
			create : function(config) {
				return new Label(config);
			}
		}
	};
}());