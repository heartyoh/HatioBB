Ext.define('HatioBB.controller.Login', {
    extend: 'Ext.app.Controller',

    config: {
        routes: {
            login: 'onLogin'
        },

        refs: {
            login: 'login',
            resetButton: 'login button[itemId=resetButton]',
            loginButton: 'login button[itemId=loginButton]'
        },

        control: {
            login: {
                activate: 'onActivate'
            },
            resetButton: {
                tap: 'onButtonReset'
            },
            loginButton: {
                tap: 'onButtonLogin'
            }
        }
    },

    onLogin: function() {
    },

    onButtonLogin: function() {
		this.getLogin().destroy();
		Ext.Viewport.add(Ext.create('HatioBB.view.Main'));
		
        // Ext.dispatch({
        //     controller: test.controllers.loginController,
        //     action: 'submit',
        //     data: test.views.loginForm
        // });
    },

    onButtonReset: function() {
        this.getLogin().reset();
    },

    onActivate: function() {
    }
});