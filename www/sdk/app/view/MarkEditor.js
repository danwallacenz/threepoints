Ext.define("GMarks.view.MarkEditor", {
    extend: "Ext.form.Panel",
    requires: [
        "Ext.form.FieldSet",
        'Ext.field.Text',
        'Ext.field.TextArea'
    ],
    alias: "widget.markeditor",
    config:{
        scrollable:'vertical'
    },
    initialize: function () {
        console.log('MarkEditor - initialize start');
        this.callParent(arguments);

        var homeButton = {
            xtype: "button",
            //ui: "back",
            //text: "Home",
            iconMask: true,
            iconCls: 'home',
            handler: this.onHomeButtonTap,
            scope: this
        };

        var backButton = {
            xtype: "button",
            ui: "back",
            //text: "Home",
            iconMask: true,
            iconCls: 'reply',
            handler: this.onBackButtonTap,
            scope: this
        };

        var saveButton = {
            xtype: "button",
            //ui: "action",
            // text: "Save",
            iconMask: true,
            iconCls: 'organize',
            handler: this.onSaveButtonTap,
            scope: this
        };
        var sendButton = {
            xtype: "button",
            //ui: "action",
            // text: "Send",
            iconMask: true,
            iconCls: 'action',
            handler: this.onSendButtonTap,
            scope: this
        };

        var topToolbar = {
            xtype: "toolbar",
            docked: "top",
            //title: "Edit GMark",
            items: [
                backButton,
                homeButton,
                { xtype: "spacer" }
            ]
        };

        var deleteButton = {
            xtype: "button",
            iconCls: "trash",
            iconMask: true,
            handler: this.onDeleteButtonTap,
            scope: this
        };


        var bottomToolbar = {
            xtype: "toolbar",
            docked: "bottom",
            items: [
                deleteButton,
                { xtype: "spacer" },
                saveButton,
                sendButton
            ]
        };

        var markTitleEditor = {
            xtype: 'textfield',
            name: 'title',
            label: 'Title',
            required: true
        };

        var markNarrativeEditor = {
            xtype: 'textareafield',
            name: 'narrative',
            label: 'Narrative'
        };

        var markBeaconTypeEditor = {
            xtype: 'textfield',
            name: 'beacon_type',
            label: 'beacon_type'
        };

        var markCurrentMarkNameEditor = {
            xtype: 'textfield',
            name: 'current_mark_name',
            label: 'current_mark_name'
        };

        var markDescriptionEditor = {
            xtype: 'textareafield',
            name: 'description',
            label: 'description'
        };

        var markEllipsoidalHeightEditor = {
            xtype: 'textfield',
            name: 'ellipsoidal_height',
            label: 'ellipsoidal_height'
        };

        var markGeodeticCodeEditor = {
            xtype: 'textfield',
            name: 'geodetic_code',
            label: 'geodetic_code'
        };

        var markIdEditor = {
            xtype: 'textfield',
            name: 'id',
            label: 'id'
        };

        var markLandDistrictEditor = {
            xtype: 'textfield',
            name: 'land_district',
            label: 'land_district'
        };

        var markLatitudeEditor = {
            xtype: 'textfield',
            name: 'latitude',
            label: 'latitude'
        };
        var markLongitudeEditor = {
            xtype: 'textfield',
            name: 'longitude',
            label: 'longitude'
        };

        var markMarkConditionEditor = {
            xtype: 'textfield',
            name: 'mark_condition',
            label: 'mark_condition'
        };

        var markMarkTypeEditor = {
            xtype: 'textfield',
            name: 'mark_type',
            label: 'mark_type'
        };

        var markOrderEditor = {
            xtype: 'textfield',
            name: 'order',
            label: 'order'
        };

        this.add([
            topToolbar,
            { xtype: "fieldset",
                items: [
                    markBeaconTypeEditor,
                    markCurrentMarkNameEditor,
                    markDescriptionEditor,
                    markEllipsoidalHeightEditor,
                    markGeodeticCodeEditor,
                    markIdEditor,
                    markLandDistrictEditor,
                    markLatitudeEditor,
                    markLongitudeEditor,
                    markMarkConditionEditor,
                    markMarkTypeEditor,
                    markOrderEditor
                ]
            },
            bottomToolbar
        ]);
        console.log('MarkEditor - initialize end');
    },

    onSaveButtonTap: function () {
        console.log("saveMarkCommand");

        this.fireEvent("saveMarkCommand", this);
    },

    onSendButtonTap: function () {
        console.log("sendMarkCommand");

        this.fireEvent("sendMarkCommand", this);
    },

    onDeleteButtonTap: function () {
        console.log("deleteMarkCommand");
        
        this.fireEvent("deleteMarkCommand", this);
    },

    onHomeButtonTap: function () {
        console.log("backToHomeCommand");

        this.fireEvent("backToHomeCommand", this);
    },

    onBackButtonTap: function () {
        console.log("editorBackCommand");

        this.fireEvent("editorBackCommand", this);
    }
});
