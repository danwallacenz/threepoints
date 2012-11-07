    keywordsSearchStore = new Ext.data.Store({        fields: ['keyword'],
        //sorters: sortingVariable,
        pageSize: 15,
        clearOnPageLoad: false,
        data: [{'keyword':['hp1']},{'keyword':['hp2']},{'keyword':['hp3']},{'keyword':['hp1']},{'keyword':['hp2']},{'keyword':['hp3']}
        ,{'keyword':['hp1']},{'keyword':['hp2']},{'keyword':['hp3']},{'keyword':['hp1']}]
    });


    keywordsSearchDataList = new Ext.List({
      store: keywordsSearchStore,
      itemTpl: '<span>{keyword}</span>',
      emptyText: '',
      style: {height: '92%'},
      listeners:  {
        itemtap: function (list, index, element, event) {
          var record = list.getRecord(element);
          searchFieldKeyWord.setValue(record.data.keyword);
          keyWordsSearchPopup.hide();
        }
      }
    });


    keyWordsSearchPopup =  new Ext.Panel({
      cls: "x-simulator-popup",
      floating: true,
      modal: true,
      //centered: true,
      style: {top: '65px', left: '0'},
      width: "80%",
      height: "40%",
      dockedItems: [
        keywordsSearchDataList
      ]
    });


    var searchFieldKeyWord = new Ext.form.Text({
        name: 'keywordSearch',
        id:'search_bar',
        placeHolder: sessionStorage.getItem(NEWLNDG_ENTR_PRO), //"Instant product search", // replace this placeholder with obj
        style: 'width: 91%; font-family:"Times New Roman",Times,serif;margin-left:0;',
        listeners: {
            action: function(){
                Ext.dispatch({
                    controller: 'Guide',
                    action    : 'results',
                });
            },
            keyup: function(field, e){
              var value = searchFieldKeyWord.getValue();
              if(value.length < 1){
                keyWordsSearchPopup.hide();
              }
              else if(value.length >= 1){
                 // Load new keywords from source and store them in variable newKeywords
                 keywordsSearchStore.loadData(newKeywords, false); 
                 keyWordsSearchPopup.show();
              }
            }
        }
    });