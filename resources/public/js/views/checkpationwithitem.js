define(function () {

    function render(parameters) {
        require(['js/jqueryplugin/easyui-form.js']
            ,function(seriform){
                var onClickRow=function (index,table){
                    if (editIndex != index){
                        if (endEditing()){
                            table.datagrid('selectRow', index)
                                .datagrid('beginEdit', index);
                            editIndex = index;
                        } else {
                            table.datagrid('selectRow', editIndex);
                        }
                    }
                }

                var editIndex = undefined;
                var endEditing=function (){
                    if (editIndex == undefined){return true}
                    if ($('#checkpationwithitemwin .itemdetailtable').datagrid('validateRow', editIndex)){
                        /* var ed = $('#packagemanagerpaneldetail').datagrid('getEditor', {index:editIndex,field:'productid'});
                         var productname = $(ed.target).combobox('getText');
                         $('#packagemanagerpaneldetail').datagrid('getRows')[editIndex]['productname'] = productname;*/
                        $('#checkpationwithitemwin .itemdetailtable').datagrid('endEdit', editIndex);
                        //editIndex = undefined;
                        return true;
                    } else {
                        return false;
                    }
                }


                var removeit=function (table){
                    if (editIndex == undefined){return;}
                   table.datagrid('cancelEdit', editIndex)
                        .datagrid('deleteRow', editIndex);
                    editIndex = undefined;
                }
                var accept=function (table,addurl,editurl,delurl){
                    if (endEditing()){
                        var inserted=table.datagrid('getChanges','inserted');
                        var deleted=table.datagrid('getChanges','deleted');
                        var updated=table.datagrid('getChanges','updated');
                        if(inserted.length>0){
                            require(['js/commonfuncs/AjaxForm.js']
                                ,function(ajaxfrom){
                                    var rids=[];
                                    var rowdata=$('#checkpationwithitemwin .unitmembers').datagrid('getRows');
                                    for(var i=0;i<rowdata.length;i++){
                                        rids.push(rowdata[i].relationid);
                                    }

                                    for(var i=0;i<inserted.length;i++){
                                        delete inserted[i].deptname;
                                        delete inserted[i].itemname;
                                    }
                                    var success=function(){
                                        $.messager.alert('操作成功','成功!');
                                        table.datagrid('acceptChanges');
                                        editIndex=undefined;
                                        table.datagrid('reload');
                                    };
                                    var errorfunc=function(){
                                        $.messager.alert('操作失败','失败!');
                                    };
                                    var params= {items:$.toJSON(inserted),rids:$.toJSON(rids)};
                                    ajaxfrom.ajaxsend('post','json',addurl,params,success,null,errorfunc)

                                });
                        }


                        if(updated.length>0){
                            require(['js/commonfuncs/AjaxForm.js']
                                ,function(ajaxfrom){
                                    var params=$('#doctorcheckpanel .pationinfoform').form("serialize");
                                    var success=function(){
                                        $.messager.alert('操作成功','成功!');
                                        table.datagrid('acceptChanges');
                                        editIndex=undefined;
                                        table.datagrid('reload');
                                    };
                                    var errorfunc=function(){
                                        $.messager.alert('操作失败','失败!');
                                    };
                                    var relationid=params.relationid;
                                    var details=[];
                                    for(var i=0;i<updated.length;i++){
                                        var item={
                                            relationid:relationid,itemcode:updated[i].id,
                                            itemname: updated[i].itemname,deptid:updated[i].deptid,
                                            downlimit:updated[i].downlimit,uplimit:updated[i].uplimit,
                                            unit:updated[i].unit,result: updated[i].result,
                                            result_mess:updated[i].result_mess,
                                            detailcode:updated[i].detailid,detailname:updated[i].itemdetailname,
                                            pycode:updated[i].pycode
                                        };
                                        details.push(item);
                                    }
                                    var params= {details:$.toJSON(details)};
                                    ajaxfrom.ajaxsend('post','json',editurl,params,success,null,errorfunc);

                                });

                        }

                        if(deleted.length>0){
                            require(['js/commonfuncs/AjaxForm.js']
                                ,function(ajaxfrom){

                                    var success=function(){
                                        $.messager.alert('操作成功','成功!');
                                        table.datagrid('acceptChanges');
                                        editIndex=undefined;
                                        table.datagrid('reload');
                                    };
                                    var errorfunc=function(){
                                        $.messager.alert('操作失败','失败!');
                                    };
                                    var rids=[];
                                    var rowdata=table.datagrid('getRows');
                                    for(var i=0;i<rowdata.length;i++){
                                        rids.push(rowdata[i].relationid);
                                    }
                                    var itemcodes=[];
                                    for(var i=0;i<deleted.length;i++){
                                        itemcodes.push(deleted[i].itemcode);
                                    }
                                    var params= {rids: $.toJSON(rids),itemcodes: $.toJSON(itemcodes)};
                                    ajaxfrom.ajaxsend('post','json',delurl,params,success,null,errorfunc);

                                });

                        }


                        //console.log(inserted);
                        //console.log(deleted);
                        //console.log(updated);


                    }
                }
                var reject =function (table){
                    table.datagrid('rejectChanges');
                    editIndex = undefined;
                }
                function getChanges(table){
                    /*var rows = $('#checkpationwithitemwin .itemdetailtable').datagrid('getChanges');
                    alert(rows.length+' rows are changed!');*/
                }



                /*$('#checkpationwithitemwin .tabletoolbar').find('.del').click(function(){
                    removeit ($('#checkpationwithitemwin .itemdetailtable'));
                });*/
                $('#checkpationwithitemwin .tabletoolbar').find('.save').click(function(){
                    var addurl="";
                    var editurl='maintain/additemdetailtable';
                    var delurl="";
                    accept($('#checkpationwithitemwin .itemdetailtable'),addurl,editurl,delurl);
                });
                $('#checkpationwithitemwin .tabletoolbar').find('.undo').click(
                    function(){
                        return reject($('#checkpationwithitemwin .itemdetailtable'))
                    }

                );




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
                    toolbar:'#checkpationwithitemwin .tabletoolbar',
                    onBeforeLoad: function (params) {
                        var options = $(this).datagrid('options');
                        params.start = (options.pageNumber - 1) * options.pageSize;
                        params.limit = options.pageSize;
                        params.totalname = "total";
                        params.rowsname = "rows";

                        if(!params.deptid){
                            var relationid=$('#doctorcheckpanel .pationinfoform').form("serialize").relationid;
                            var deptid=$('#doctorcheckpanel .depttable').datagrid('getSelected').id;
                            var data=$('#doctorcheckpanel .checkingitems').datagrid('getRows');
                            var deptids=[];
                            for(var i=0;i<data.length;i++){
                                if(data[i].deptid==deptid)deptids.push(data[i].itemcode);
                            }
                            params.deptid=deptid;
                            params.relationid=relationid;
                            params.itemcodes= $.toJSON(deptids);

                        }
                    },
                    onClickRow:function(index){
                        onClickRow(index,$('#checkpationwithitemwin .itemdetailtable'));
                    }

                });

                $('#checkpationwithitemwin .deptconclusion').datagrid({
                    singleSelect: true,
                    collapsible: true,
                    rownumbers: true,
                    method:'post',
                    fitColumns:true,
                    url:'maintain/getdeptconclusionbyrid',
                    remoteSort: false,
                    fit:true,
                    pagination:false,
                    pageSize:1000,
                    toolbar:'#checkpationwithitemwin .conclusiontabletoolbar',
                    onBeforeLoad: function (params) {
                        var options = $(this).datagrid('options');
                        params.start = (options.pageNumber - 1) * options.pageSize;
                        params.limit = options.pageSize;
                        params.totalname = "total";
                        params.rowsname = "rows";

                        if(!params.deptid){
                            var relationid=$('#doctorcheckpanel .pationinfoform').form("serialize").relationid;
                            var deptid=$('#doctorcheckpanel .depttable').datagrid('getSelected').id;

                            params.deptid=deptid;
                            params.relationid=relationid;

                        }
                    },
                    onClickRow:function(index){
                        onClickRow(index,$('#checkpationwithitemwin .deptconclusion'))
                    }

                })



            })



    }

    return {
        render: render

    };
});