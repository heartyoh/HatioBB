Ext.define('HatioBB.model.Menu', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            'text',
            'icon',
            'index',
			'module',
			'children'
        ]
    }
});