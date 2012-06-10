Ext.define('HatioBB.mixin.User', function() {
	return {
		login : {
			key : login.key,
			email : Ext.String.htmlDecode(login.email),
			id : Ext.String.htmlDecode(login.username),
			name : Ext.String.htmlDecode(login.username),
			language : login.language
		}
	};
}());