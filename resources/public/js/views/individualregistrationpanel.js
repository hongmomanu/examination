define(function () {



    function render(parameters) {
        $('#registedperson').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            url:'auth/getregistedperson',
            remoteSort: false,
            fitColumns:true,
            fit:true,
            //toolbar:'#enumpaneltb',
            pagination:true,
            pageSize:10,
            onBeforeLoad: function (params) {
                var options = $('#enummanagerpanel').datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:function(index, rowData){

            }

        });
    }

    return {
        render: render

    };
});