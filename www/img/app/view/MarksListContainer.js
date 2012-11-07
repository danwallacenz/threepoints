Ext.define("GMarks.view.MarksListContainer", {
    extend: "Ext.Container",
    alias: "widget.markslistcontainer",

    requires: [
        'Ext.Toolbar',
        'GMarks.view.MarksList'
    ],

    initialize: function () {
        console.log("MarksListContainer-initialize");
        this.callParent(arguments);
        
        var homeButton = {
            xtype: "button",
            ui: "back",
            //text: "Home",
            iconMask: true,
            iconCls: 'reply',
            handler: this.onHomeButtonTap,
            scope: this
        };

        var topToolbar = {
            xtype: "toolbar",
            title: 'Saved Marks',
            docked: "top",
            items: [
                homeButton
            ]
        };

        var marksList = {
            xtype: "markslist",
            store: Ext.getStore("Marks"),
            listeners: {
                disclose: { fn: this.onMarksListDisclose, scope: this }
            }
        };        

        this.add([topToolbar, marksList]);
    },

    onMarksListDisclose: function (list, record, target, index, evt, options) {
        console.log("editMarkerCommand");
        
        this.fireEvent('editMarkerCommand', this, record);
    },
    onHomeButtonTap: function () {
        console.log("backToHomeCommand");

        this.fireEvent("backToHomeCommand", this);
    },

    config: {
        layout: {
            type: 'fit'
        }
    }
});
