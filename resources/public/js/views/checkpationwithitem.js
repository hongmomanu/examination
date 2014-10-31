define(function () {

    function render(parameters) {

        $('#checkpationwithitemwin .easyui-tabs').tabs().tabs({

            onSelect:function(title,index){
                if(index==2){
                    var content_div=$('#checkpationwithitemwin .reportlist');
                    content_div.html('');
                    var params=$('#doctorcheckpanel .pationinfoform').form("serialize");
                    content_div.append('<table class="reporttable"></table>');
                    var contenttable=content_div.find('.reporttable');
                    var head_line='<tr><td width="20%">'+params.blh_no+ '&nbsp;'+params.name+'&nbsp;'+
                        '</td><td width="20%">'+params.sex+'</td>' +
                        '<td width="20%"></td>'+
                        '<td width="20%"></td><td width="20%"></td>'+
                        '</tr>';
                    contenttable.append(head_line);
                    var dept_line='<tr><td width="20%">'
                        +$('#doctorcheckpanel .depttable').datagrid('getSelected').deptname+
                        '</td><td width="20%"></td>' +
                        '<td width="20%"></td>'+
                        '<td width="20%"></td><td width="20%"></td>'+
                        '</tr>';
                    contenttable.append(dept_line);
                    /*var items={};
                    var data=$('#doctorcheckpanel .checkingitems').datagrid('getRows');
                    for(var i=0;i<data.length;i++){
                        if(items[data[i].itemname]){
                            items[data[i].itemname].push();
                        }
                    }*/

                    //content_div.html('<table class="reporttable"></table>');

                    /*require(['js/commonfuncs/AjaxForm.js']
                        ,function(ajaxfrom){
                            var url="auth/getsessionuserinfo";
                            var success=function(data){
                                 console.log(data);
                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','服务异常!');
                            };
                            ajaxfrom.ajaxsend('post','json',url,{},success,null,errorfunc)

                        });*/





                }
            }
        })

        require(['js/jqueryplugin/easyui-form.js']
            ,function(seriform){
                var onClickRow=function (index,table){
                    if (editIndex != index){
                        if (endEditing(table)){
                            table.datagrid('selectRow', index)
                                .datagrid('beginEdit', index);
                            editIndex = index;
                        } else {
                            table.datagrid('selectRow', editIndex);
                        }
                    }
                }

                var editIndex = undefined;
                var endEditing=function (table){
                    if (editIndex == undefined){return true}
                    if (table.datagrid('validateRow', editIndex)){
                        /* var ed = $('#packagemanagerpaneldetail').datagrid('getEditor', {index:editIndex,field:'productid'});
                         var productname = $(ed.target).combobox('getText');
                         $('#packagemanagerpaneldetail').datagrid('getRows')[editIndex]['productname'] = productname;*/
                        table.datagrid('endEdit', editIndex);
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
                    if (endEditing(table)){
                        var inserted=table.datagrid('getChanges','inserted');
                        var deleted=table.datagrid('getChanges','deleted');
                        var updated=table.datagrid('getChanges','updated');
                        if(inserted.length>0){
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
                                    var params= {items:$.toJSON(inserted)};
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

                                    var delids=[];
                                    for(var i=0;i<deleted.length;i++){
                                        delids.push(deleted[i].id);
                                    }
                                    var params= {delids: $.toJSON(delids)};
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
                };
                var append =function (table){
                    if (endEditing(table)){
                        table.datagrid('appendRow',{status:'是'});
                        editIndex = table.datagrid('getRows').length-1;
                        table.datagrid('selectRow', editIndex)
                            .datagrid('beginEdit', editIndex);
                    }
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

                $('#checkpationwithitemwin .conclusiontabletoolbar').find('.del').click(function(){
                 removeit ($('#checkpationwithitemwin .deptconclusion'));
                 });
                $('#checkpationwithitemwin .conclusiontabletoolbar').find('.save').click(function(){
                    var addurl="maintain/addsuggessionbyrid";
                    var editurl='maintain/editsugessionbyrid';
                    var delurl="maintain/delsuggessuonbyrid";
                    accept($('#checkpationwithitemwin .deptconclusion'),addurl,editurl,delurl);
                });
                $('#checkpationwithitemwin .conclusiontabletoolbar').find('.undo').click(
                    function(){
                        return reject($('#checkpationwithitemwin .deptconclusion'))
                    }

                );
                $('#checkpationwithitemwin .conclusiontabletoolbar').find('.add').click(
                    function(){
                        return append($('#checkpationwithitemwin .deptconclusion'));
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

            $('#checkpationwithitemwin .deptconclusiontips').datagrid({
                    singleSelect: true,
                    collapsible: true,
                    rownumbers: true,
                    method:'post',
                    fitColumns:true,
                    url:'maintain/getsuggests',
                    remoteSort: false,
                    fit:true,
                    pagination:false,
                    pageSize:1000,
                    onBeforeLoad: function (params) {
                        var options = $(this).datagrid('options');
                        params.start = (options.pageNumber - 1) * options.pageSize;
                        params.limit = options.pageSize;
                        params.totalname = "total";
                        params.rowsname = "rows";
                        params.deptid=$('#doctorcheckpanel .depttable').datagrid('getSelected').id;

                    },
                    onClickRow:function(index,rowData){

                        var relationid=$('#doctorcheckpanel .pationinfoform').form("serialize").relationid;
                        var deptid=$('#doctorcheckpanel .depttable').datagrid('getSelected').id;
                        var newrow={
                            suggestion:rowData.content,
                            reason:rowData.name,
                            relationid:relationid,
                            deptid:deptid,
                            suggestid:rowData.id
                        };
                        var addeddata=$('#checkpationwithitemwin .deptconclusion').datagrid('getRows');
                        var flag=false;
                        for(var i=0;i<addeddata.length;i++){
                            if(addeddata[i].suggestid==rowData.id){
                                flag=true;
                                break;
                            }
                        }
                        if(!flag){
                            $('#checkpationwithitemwin .deptconclusion').datagrid('appendRow',newrow);
                        }

                    }

                })



            })



    }

    return {
        render: render

    };
});