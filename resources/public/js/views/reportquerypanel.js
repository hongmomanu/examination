define(function () {


    function render(parameters) {

        require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
            ,function(easyuiform,ajaxform){

                $('#reportquerypanel .endday').datebox('setValue', $.format.date(new Date(), "yyyy-MM-dd"));
                $('#reportquerypanel .beginday').datebox('setValue',  $.format.date((new Date()).add({ months: -3}), "yyyy-MM-dd"));

                $('#reportquerypanel .maintable').datagrid({
                    singleSelect: true,
                    collapsible: true,
                    rownumbers: true,
                    method:'post',
                    url:'maintain/getregistedpersossssss',
                    remoteSort: false,
                    //fitColumns:true,
                    fit:true,
                    toolbar:'#reportquerypanel .searchtoolbar',
                    pagination:true,
                    pageSize:20,
                    onBeforeLoad: function (params) {
                        var options = $(this).datagrid('options');
                        params.start = (options.pageNumber - 1) * options.pageSize;
                        params.limit = options.pageSize;
                        params.totalname = "total";
                        params.rowsname = "rows";
                    },
                    onClickRow:function(index, rowData){

                        //$('#unitcheckingitempanel .checkingitems').datagrid('load',{relationid:rowData.relationid});
                    }

                });


            });




    }

    return {
        render: render

    };
});