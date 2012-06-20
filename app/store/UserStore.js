Ext.define('HatioBB.store.UserStore', {
    extend: 'Ext.data.Store',

    config: {
        autoLoad: false,

        pageSize: 1,

        fields: [{
            name: 'key',
            type: 'string'
        },
        {
            name: 'email',
            type: 'string'
        },
        {
            name: 'company',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'admin',
            type: 'boolean'
        },
        {
            name: 'enabled',
            type: 'boolean'
        },
        {
            name: 'language',
            type: 'string'
        },
        {
            name: 'image_clip',
            type: 'string'
        },
        {
            name: 'created_at',
            type: 'date',
            dateFormat: 'time'
        },
        {
            name: 'updated_at',
            type: 'date',
            dateFormat: 'time'
        }],

        proxy: {
            type: 'ajax',
            url: 'user',
            reader: {
                type: 'json',
                rootProperty: 'items',
                totalProperty: 'total'
            }
        }
    }

});