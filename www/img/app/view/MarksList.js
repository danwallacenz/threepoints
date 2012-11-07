Ext.define("GMarks.view.MarksList", {
    extend: "Ext.dataview.List",
    alias: "widget.markslist",
    config: {
        loadingText: "Loading Marks...",
        emptyText: '</pre><div class="notes-list-empty-text">No marks found.</div><pre>',
        onItemDisclosure: true,
        //grouped: true,
        itemTpl: '</pre><div class="list-item-title">{current_mark_name}</div><div class="list-item-narrative">{description}</div><pre>',
    }
});