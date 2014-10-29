define(function () {

    function render(parameters) {
        $('#checkpationwithitemwin').dialog({
            title: '项目录入',
            width: '100%',
            height: '100%',
            closed: false,
            cache: false,
            buttons:[{
                text:'保存',

                handler:function(){



                }
            },{
                text:'取消',
                handler:function(){
                    $('#checkpationwithitemwin').dialog('close');
                }
            }],
            modal: true
        });
        $.parser.parse('#checkpationwithitemwin');

        $('#checkpationwithitemwin .itemdetailtable').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            fitColumns:true,
            url:'maintain/getitemdetaibydeptid',
            remoteSort: false,
            fit:true,
            pagination:false,
            pageSize:1000,
            //toolbar:'#suggestpaneldetailtb',
            onBeforeLoad: function (params) {
                var options = $(this).datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            }

        })



    }

    return {
        render: render

    };
});