Ext.define('HatioBB.view.Login', {
    extend: 'Ext.form.Panel',

    xtype: 'login',

    config: {

        // fullscreen: true,

        scroll: 'vertical',

        centered: true,

        height: Ext.Viewport.getWindowHeight() * .4,
        width: Ext.Viewport.getWindowWidth() * .4,
        modal: true,

        url: '/login',

        items: [{
            xtype: 'textfield',
            label: 'Login',
            name: 'j_username'
        },
        {
            xtype: 'passwordfield',
            label: 'Password',
            name: 'j_password'
        },
        {
            xtype: 'container',
            layout: 'hbox',
            docked: 'bottom',
            items: [{
                xtype: 'button',
                itemId: 'resetButton',
                flex: 1,
                text: 'Reset'
            },
            {
                xtype: 'button',
                itemId: 'loginButton',
                flex: 1,
                text: 'Login',
                ui: 'confirm'
            }]
        }]
    }
});
