Ext.define("GMarks.store.Marks", {
    extend: "Ext.data.Store",
    requires:"Ext.data.proxy.LocalStorage",
    config: {
        model: "GMarks.model.Mark",
        proxy: {
            type: 'localstorage',
            id: 'linz-marks-store'
        },
        sorters: [{ property: 'id', direction: 'DESC'}]
    }
});