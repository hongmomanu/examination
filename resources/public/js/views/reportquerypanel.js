define(function () {


    function render(parameters) {

        require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
            ,function(easyuiform,ajaxform){

               /* var combox=$('#reportquerypanel .lazy-combobox');
                combox.combobox({
                    onShowPanel: function () {
                        var searchtype = $(this).attr('searchtype');
                        var url = 'auth/getenumbytype?type='+searchtype;
                        $(this).combobox('reload', url);
                    }

                });*/

                $('#reportquerypanel .search').click(function(){
                    $('#reportquerypanel .maintable').datagrid('reload');
                });
                $('#reportquerypanel .print').click(function(){
                    $('#reportquerypanel .datagrid-view').printThis();
                });

                $('#reportquerypanel .endday').datebox('setValue', $.format.date(new Date(), "yyyy-MM-dd"));
                $('#reportquerypanel .beginday').datebox('setValue',  $.format.date((new Date()).add({ months: -3}), "yyyy-MM-dd"));

                $('#reportquerypanel .maintable').datagrid({
                    singleSelect: true,
                    collapsible: true,
                    rownumbers: true,
                    method:'post',
                    url:'maintain/getfinishedperson',
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
                        params.beginday = $('#reportquerypanel .beginday').datebox('getValue');
                        params.endday = $('#reportquerypanel .endday').datebox('getValue');
                        params.unitname = $('#reportquerypanel .easyui-combogrid').combogrid('getValue');
                        params.beginno=$('#reportquerypanel .beginno').textbox('getValue');
                        params.endno=$('#reportquerypanel .endno').textbox('getValue');
                        params.sex=$('#reportquerypanel .sex').combobox('getValue');
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