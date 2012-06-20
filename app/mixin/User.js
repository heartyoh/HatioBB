Ext.define('HatioBB.mixin.User', function() {
	var _user;
	
	var set = function(user) {
		_user = user;
	};
	
	var get = function(prop) {
		return _user[prop];
	};
	
	return {
		login : {
			set : set,
			get : get
		}
	};
}());