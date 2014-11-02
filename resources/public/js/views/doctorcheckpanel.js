define(function () {



    function render(parameters) {
        $('#doctorcheckpanel .checkingitems').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            url:'maintain/getregistedcheckitems',
            remoteSort: false,
            //fitColumns:true,
            fit:true,
            //toolbar:'#enumpaneltb',
            pagination:false,
            pageSize:300,
            onBeforeLoad: function (params) {
                var options = $(this).datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:function(index, rowData){
            }

        });

    $('#doctorcheckpanel .uncheckingpations').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            url:'maintain/getcheckornopation',
            remoteSort: false,
            //fitColumns:true,
            fit:true,
            //toolbar:'#enumpaneltb',
            pagination:false,
            pageSize:300,
            onBeforeLoad: function (params) {
                var options = $(this).datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.ischecked = 0;
                params.rowsname = "rows";
            },
            onClickRow:function(index, rowData){

                showpationinfo(rowData);
            }

        });

var showpationinfo=function(data){


    $('#doctorcheckpanel .pationinfoform').form('load',data);
    $('#doctorcheckpanel .checkingitems').datagrid('load',{relationid:data.relationid});

};
$('#doctorcheckpanel .finishitem').click(function(){

    require(['js/jqueryplugin/easyui-form.js']
        ,function(easyuifrom){
            var params=$('#doctorcheckpanel .pationinfoform').form("serialize");

            if(params.relationid){
                var deptid=$('#doctorcheckpanel .depttable').datagrid('getSelected').id;
                var data=$('#doctorcheckpanel .checkingitems').datagrid('getRows');
                var relationid=$('#doctorcheckpanel .pationinfoform').form("serialize").relationid;
                var deptids=[];
                for(var i=0;i<data.length;i++){
                    if(data[i].deptid==deptid)deptids.push(data[i].itemcode);
                }

                if($('#checkpationwithitemwin').length>0){
                    $('#checkpationwithitemwin').dialog('open');
                    $('#checkpationwithitemwin .itemdetailtable').datagrid('load',{deptid:deptid,
                        relationid:relationid,
                        itemcodes: $.toJSON(deptids)});
                }else{
                    require(['text!views/checkpationwithitem.htm','views/checkpationwithitem'],
                        function(div,js){
                            $('body').append(div);
                            js.render();
                            /**
                                $('#checkpationwithitemwin .itemdetailtable').datagrid('load',{
                                    deptid:deptid,
                                    relationid:relationid,
                                    itemcodes: $.toJSON(deptids)
                                });
                             **/
                        });
                }
            }else{
                $.messager.alert('提示信息','尚未选中病人');
            }

        });


})
$('#doctorcheckpanel .checkedpations').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            url:'maintain/getcheckornopation',
            remoteSort: false,
            //fitColumns:true,
            fit:true,
            //toolbar:'#enumpaneltb',
            pagination:false,
            pageSize:300,
            onBeforeLoad: function (params) {
                var options = $(this).datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.ischecked = 1;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:function(index, rowData){
                showpationinfo(rowData);
            }

        });




        $('#doctorcheckpanel .depttable').datagrid({
            singleSelect: true,
            collapsible: true,
            //rownumbers: true,
            method:'post',
            url:'/maintain/getdeptsbyuser',
            remoteSort: false,
            fitColumns:true,
            fit:true,
            //toolbar:'#enumpaneltb',
            pagination:false,
            pageSize:300,
            onSelect:function(rowIndex, rowData){
                $('#doctorcheckpanel .pationinfoform').form("reset");
                $('#doctorcheckpanel .checkingitems').datagrid('load',{relationid:null});
                $('#doctorcheckpanel .uncheckingpations').datagrid('load',{deptid:rowData.id});
                $('#doctorcheckpanel .checkedpations').datagrid('load',{deptid:rowData.id});
            },
            onBeforeLoad: function (params) {
                var options = $(this).datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:function(index, rowData){
            },
            onLoadSuccess:function(data){
                if(data.total>0){
                    $(this).datagrid('selectRow',0);
                }


            }
        });




    }

    return {
        render: render

    };
});