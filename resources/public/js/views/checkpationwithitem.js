define(function () {

    function render(parameters) {

        var onClickRow=function (index){
            if (editIndex != index){
                if (endEditing()){
                    $('#checkpationwithitemwin .itemdetailtable').datagrid('selectRow', index)
                        .datagrid('beginEdit', index);
                    editIndex = index;
                } else {
                    $('#checkpationwithitemwin .itemdetailtable').datagrid('selectRow', editIndex);
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


        var removeit=function (){
            console.log(editIndex);
            if (editIndex == undefined){return;}
            $('#checkpationwithitemwin .itemdetailtable').datagrid('cancelEdit', editIndex)
                .datagrid('deleteRow', editIndex);
            editIndex = undefined;
        }
        var accept=function (){
            if (endEditing()){
                var inserted=$('#checkpationwithitemwin .itemdetailtable').datagrid('getChanges','inserted');
                var deleted=$('#checkpationwithitemwin .itemdetailtable').datagrid('getChanges','deleted');
                var updated=$('#checkpationwithitemwin .itemdetailtable').datagrid('getChanges','updated');
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
                                $('#checkpationwithitemwin .itemdetailtable').datagrid('acceptChanges');
                                editIndex=undefined;
                                $('#checkpationwithitemwin .itemdetailtable').datagrid('reload');
                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','失败!');
                            };
                            var params= {items:$.toJSON(inserted),rids:$.toJSON(rids)};
                            ajaxfrom.ajaxsend('post','json','maintain/additemdetailtablebyrids',params,success,null,errorfunc)

                        });
                }


                if(updated.length>0){
                    require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                        ,function(seriform,ajaxfrom){
                            var params=$('#doctorcheckpanel .pationinfoform').form("serialize");
                            var success=function(){
                                $.messager.alert('操作成功','成功!');
                                $('#checkpationwithitemwin .itemdetailtable').datagrid('acceptChanges');
                                editIndex=undefined;
                                $('#checkpationwithitemwin .itemdetailtable').datagrid('reload');
                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','失败!');
                            };
                            var relationid=params.relationid;
                            var details=[];
                            for(var i=0;i<updated.length;i++){
                                var item={relationid:relationid,itemcode:updated[i].id,
                                    itemname: updated[i].itemname,deptid:updated[i].deptid,
                                    downlimit:updated[i].downlimit,uplimit:updated[i]. uplimit,
                                    unit:updated[i].unit,result: updated[i].result,

                                    result_mess:updated[i].result_mess,
                                    detailcode:updated[i].detailid,detailname:updated[i].itemdetailname,
                                    pycode:updated[i].pycode
                                };
                                details.push(item);
                            }
                            var params= {details:$.toJSON(details)};
                            ajaxfrom.ajaxsend('post','json','maintain/edititemdetailtable',params,success,null,errorfunc);

                        });

                }

                if(deleted.length>0){
                    require(['js/commonfuncs/AjaxForm.js']
                        ,function(ajaxfrom){

                            var success=function(){
                                $.messager.alert('操作成功','成功!');
                                $('#checkpationwithitemwin .itemdetailtable').datagrid('acceptChanges');
                                editIndex=undefined;
                                $('#checkpationwithitemwin .itemdetailtable').datagrid('reload');
                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','失败!');
                            };
                            var rids=[];
                            var rowdata=$('#checkpationwithitemwin .unitmembers').datagrid('getRows');
                            for(var i=0;i<rowdata.length;i++){
                                rids.push(rowdata[i].relationid);
                            }
                            var itemcodes=[];
                            for(var i=0;i<deleted.length;i++){
                                itemcodes.push(deleted[i].itemcode);
                            }
                            var params= {rids: $.toJSON(rids),itemcodes: $.toJSON(itemcodes)};
                            ajaxfrom.ajaxsend('post','json','maintain/delitemdetailtablebyrids',params,success,null,errorfunc);

                        });

                }


                //console.log(inserted);
                //console.log(deleted);
                //console.log(updated);


            }
        }
        var reject =function (){
            $('#checkpationwithitemwin .itemdetailtable').datagrid('rejectChanges');
            editIndex = undefined;
        }
        function getChanges(){
            var rows = $('#checkpationwithitemwin .itemdetailtable').datagrid('getChanges');
            alert(rows.length+' rows are changed!');
        }



       /* $('#checkpationwithitemwin .tabletoolbar').find('.del').click(removeit);*/
        $('#checkpationwithitemwin .tabletoolbar').find('.save').click(accept);
        $('#checkpationwithitemwin .tabletoolbar').find('.undo').click(reject);




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
                    var deptid=$('#doctorcheckpanel .depttable').datagrid('getSelected').id;
                    var data=$('#doctorcheckpanel .checkingitems').datagrid('getRows');
                    var deptids=[];
                    for(var i=0;i<data.length;i++){
                        if(data[i].deptid==deptid)deptids.push(data[i].itemcode);
                    }
                    params.deptid=deptid;
                    params.itemcodes= $.toJSON(deptids);

                }
            },
            onClickRow:onClickRow

        })



    }

    return {
        render: render

    };
});