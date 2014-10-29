define(function () {

    var editIndex = undefined;
    var endEditing=function (){
        if (editIndex == undefined){return true}
        if ($('#itemmanagerlayout .detailtip').datagrid('validateRow', editIndex)){
            /* var ed = $('#suggestmanagerpaneltabledetail').datagrid('getEditor', {index:editIndex,field:'productid'});
             var productname = $(ed.target).combobox('getText');
             $('#suggestmanagerpaneltabledetail').datagrid('getRows')[editIndex]['productname'] = productname;*/
            $('#itemmanagerlayout .detailtip').datagrid('endEdit', editIndex);
            //editIndex = undefined;
            return true;
        } else {
            return false;
        }
    }
    var onClickRow=function (index,rowData){
        //console.log(rowData);
        //var packageid=rowData.id;
        //$('#packageitemmanagerpanel').tree('reload');
        //console.log(rowData);
        $('#suggestinfoform').form('load',rowData);
        //$('#suggestmanagerlayout').layout('expand','east');

        if (editIndex != index){
            if (endEditing()){
                $('#itemmanagerlayout .detailtip').datagrid('selectRow', index)
                    .datagrid('beginEdit', index);
                editIndex = index;
            } else {
                $('#itemmanagerlayout .detailtip').datagrid('selectRow', editIndex);
            }
        }
    }
    var append =function (){
        if (endEditing()){
            $('#itemmanagerlayout .detailtip').datagrid('appendRow',{useflag:'是'});
            editIndex = $('#itemmanagerlayout .detailtip').datagrid('getRows').length-1;
            $('#itemmanagerlayout .detailtip').datagrid('selectRow', editIndex)
                .datagrid('beginEdit', editIndex);
        }
    }
    var removeit=function (){
        if (editIndex == undefined){return}
        $('#itemmanagerlayout .detailtip').datagrid('cancelEdit', editIndex)
            .datagrid('deleteRow', editIndex);
        editIndex = undefined;
    }
    var accept=function (){
        if (endEditing()){
            var inserted=$('#itemmanagerlayout .detailtip').datagrid('getChanges','inserted');
            var deleted=$('#itemmanagerlayout .detailtip').datagrid('getChanges','deleted');
            var updated=$('#itemmanagerlayout .detailtip').datagrid('getChanges','updated');
            if(inserted.length>0){
                require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                    ,function(easyform,ajaxfrom){

                        for(var i=0;i<inserted.length;i++){
                            inserted[i].itemdetailcode=$('#itemmanagerpanel').treegrid('getSelected').id;
                        }
                        var success=function(){
                            $.messager.alert('操作成功','成功!');
                            $('#itemmanagerlayout .detailtip').datagrid('acceptChanges');
                            editIndex=undefined;
                            $('#itemmanagerlayout .detailtip').datagrid('reload');
                        };
                        var errorfunc=function(){
                            $.messager.alert('操作失败','失败!');
                        };
                        var params= {tips:$.toJSON(inserted)};
                        ajaxfrom.ajaxsend('post','json','maintain/adddetailtips',params,success,null,errorfunc)

                    });
            }

            if(updated.length>0){
                require(['js/commonfuncs/AjaxForm.js']
                    ,function(ajaxfrom){

                        var success=function(){
                            $.messager.alert('操作成功','成功!');
                            $('#itemmanagerlayout .detailtip').datagrid('acceptChanges');
                            editIndex=undefined;
                            $('#itemmanagerlayout .detailtip').datagrid('reload');
                        };
                        var errorfunc=function(){
                            $.messager.alert('操作失败','失败!');
                        };
                        var params= {tips:$.toJSON(updated)};
                        ajaxfrom.ajaxsend('post','json','maintain/editdetailtips',params,success,null,errorfunc);

                    });

            }

            if(deleted.length>0){
                require(['js/commonfuncs/AjaxForm.js']
                    ,function(ajaxfrom){

                        var success=function(){
                            $.messager.alert('操作成功','成功!');
                            $('#itemmanagerlayout .detailtip').datagrid('acceptChanges');
                            editIndex=undefined;
                            $('#itemmanagerlayout .detailtip').datagrid('reload');
                        };
                        var errorfunc=function(){
                            $.messager.alert('操作失败','失败!');
                        };
                        var params= {tips:$.toJSON(deleted)};
                        ajaxfrom.ajaxsend('post','json','maintain/deldetailtips',params,success,null,errorfunc);

                    });

            }


            //console.log(inserted);
            //console.log(deleted);
            //console.log(updated);


        }
    }
    var reject =function (){
        $('#itemmanagerlayout .detailtip').datagrid('rejectChanges');
        editIndex = undefined;
    }




    function render(parameters) {

        $('#itemmanagerlayout .detailtip').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            fitColumns:true,
            url:'maintain/getdetailtips',
            remoteSort: false,
            fit:false,
            pagination:true,
            pageSize:10,
            toolbar:'#itemmanagerlayout .detailtiptb',
            onBeforeLoad: function (params) {
                //alert(1);
                var options = $(this).datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:onClickRow

        });





        $('#itemmanagerpanel').treegrid({
            rownumbers: true,
            method: 'post',

            url: 'maintain/gettreeitem',
            treeField: 'text',
            idField: 'id',
            onBeforeLoad: function (row, params) {
                if (!row)params.node = -1;
                else {
                    params.node = row.nodeid;
                    params.pid=row._parentId;
                }

            },
            /*onContextMenu: function(e,node){
                e.preventDefault();
                $(this).tree('select',node.target);
                $('#mm').menu('show',{
                    left: e.pageX,
                    top: e.pageY
                });
            },*/
            onLoadSuccess: function (row, data) {
                /*require(['commonfuncs/treegridtip'], function () {
                    $("#funcmanagerpanel").treegrid('tooltip', ['text']);
                });*/

            },
            onClickRow: function (rowData) {
                //console.log(rowData);
                if (rowData._parentId == undefined) {

                } else if (rowData._parentId == 0) {
                    //rowData.itemname = rowData.textold;
                    var item = {deptid: rowData.nodeid, pid: rowData._parentId,
                        itemname:"",pycode:"",price:"",sortnum:""};
                    //rowData.label = rowData.value;
                    $('#itemdetailinfodiv').hide();
                    $('#iteminfodiv').show();
                    $('#iteminfoform').form('load', item);
                    $('#newitemformbtns').show();
                    $('#edititemformbtns').hide();
                    $('#itemmanagerlayout').layout('expand', 'east');
                }
                else if (rowData._parentId.indexOf("dept") >= 0) {
                    $('#itemdetailinfodiv').hide();
                    $('#iteminfodiv').show();
                    rowData.itemid=rowData.nodeid;
                    rowData.pid= rowData._parentId;
                    $('#iteminfodiv').form('load', rowData);
                    //$('#itemdetailformbtns .save,#itemformbtns .del').linkbutton('enable');
                    $('#newitemformbtns').hide();
                    $('#edititemformbtns').show();
                    $('#itemmanagerlayout').layout('expand', 'east');
                }else if (rowData._parentId.indexOf("item") >= 0) {
                    $('#iteminfodiv').hide();
                    $('#itemdetailinfodiv').show();
                    //rowData.itemid=rowData.nodeid;
                    rowData.pid= rowData._parentId;
                    $('#itemdetailinfodiv').form('load', rowData);
                    $('#itemmanagerlayout .detailtip').datagrid('load',{detaiid:rowData.id});
                    //$('#itemdetailformbtns .save,#itemformbtns .del').linkbutton('enable');
                    //$('#newitemformbtns').hide();
                    //$('#edititemformbtns').show();
                    $('#itemmanagerlayout').layout('expand', 'east');
                }


            }
        });

        $('#edititemformbtns .del').click(function () {
            $.messager.confirm('确定要删除功能么?', '你正在试图删除功能?', function (r) {
                if (r) {
                    require(['js/jqueryplugin/easyui-form.js', 'js/commonfuncs/AjaxForm.js']
                        , function (easyuifrom, ajaxfrom) {
                            var params = $('#iteminfoform').form("serialize");
                            var success = function () {
                                $.messager.alert('操作成功', '删除成功!');
                                $('#itemmanagerpanel').treegrid('reload',$('#itemmanagerpanel').treegrid('getSelected')._parentId)
                            };
                            var errorfunc = function () {
                                $.messager.alert('操作失败', '删除功能失败!');
                            }
                            ajaxfrom.ajaxsend('post', 'json', 'maintain/delitem', params, success, null, errorfunc)

                        });
                }
            });
        });
        $('#itemdetailformbtns .del').click(function () {
            $.messager.confirm('确定要删除么项目明细?', '你正在试图删除项目明细?', function (r) {
                if (r) {
                    require(['js/jqueryplugin/easyui-form.js', 'js/commonfuncs/AjaxForm.js']
                        , function (easyuifrom, ajaxfrom) {
                            var params ={id:$('#itemmanagerpanel').treegrid('getSelected').id};
                            var success = function () {
                                $.messager.alert('操作成功', '删除成功!');
                                $('#itemmanagerpanel').treegrid('reload',$('#itemmanagerpanel').treegrid('getSelected')._parentId)
                            };
                            var errorfunc = function () {
                                $.messager.alert('操作失败', '删除功能失败!');
                            };
                            ajaxfrom.ajaxsend('post', 'json', 'maintain/delitemdeatail', params, success, null, errorfunc)

                        });
                }
            });
        });

        $('#edititemformbtns .save').click(function () {
            $.messager.confirm('确定要修改项目么?', '你正在试图修改项目?', function (r) {
                    if (r) {
                        require(['js/jqueryplugin/easyui-form.js', 'js/commonfuncs/AjaxForm.js']
                            , function (easyform, ajaxfrom) {
                                var params = $('#iteminfoform').form("serialize");
                                //testobj= $('#iteminfoform');
                                var success = function (res) {

                                    if(res.success){
                                        $.messager.alert('操作成功', '修改功能成功!');
                                        if(params.pid<0){
                                            $('#itemmanagerpanel').treegrid('reload') ;
                                        }else{
                                            $('#itemmanagerpanel').treegrid('reload', params.pid);
                                        }

                                    }else{
                                        $.messager.alert('操作失败', res.msg);
                                    }

                                };
                                var errorfunc = function () {
                                    $.messager.alert('操作失败', '修改功能失败!');
                                };

                                ajaxfrom.ajaxsend('post', 'json', 'maintain/edititem', params, success, null, errorfunc);
                            });
                    }
                }
            );

        });
    $('#itemdetailformbtns .save').click(function () {
            $.messager.confirm('确定要修改项目明细么?', '你正在试图修改项目明细?', function (r) {
                    if (r) {
                        require(['js/jqueryplugin/easyui-form.js', 'js/commonfuncs/AjaxForm.js']
                            , function (easyform, ajaxfrom) {
                                var params = $('#itemdetailinfoform').form("serialize");
                                params.id=$('#itemmanagerpanel').treegrid('getSelected').id;
                                params.itemid=$('#itemmanagerpanel').treegrid('getSelected').itemid;
                                //testobj= $('#iteminfoform');
                                var success = function (res) {

                                    if(res.success){
                                        $.messager.alert('操作成功', '修改成功!');
                                        $('#itemmanagerpanel').treegrid('reload',$('#itemmanagerpanel').treegrid('getSelected')._parentId)

                                    }else{
                                        $.messager.alert('操作失败', res.msg);
                                    }

                                };
                                var errorfunc = function () {
                                    $.messager.alert('操作失败', '修改功能失败!');
                                };

                                ajaxfrom.ajaxsend('post', 'json', 'maintain/edititemdetail', params, success, null, errorfunc);
                            });
                    }
                }
            );

        });

        $('#edititemformbtns .newdetail').click(function () {

            if($('#newcheckitemwin').length>0){
                $('#newcheckitemwin').dialog('open');
            }else{
                require(['text!views/newcheckitemwin.htm','views/newcheckitemwin'],
                    function(div,newcheckitem){
                        $('body').append(div);
                        newcheckitem.render();
                    });
            }
            }

        );
        $('#newitemformbtns .new').click(function () {

                require(['js/jqueryplugin/easyui-form.js', 'js/commonfuncs/AjaxForm.js']
                    , function (easyform, ajaxfrom) {
                        var params = $('#iteminfoform').form("serialize");
                        //params.parentid = params.itemid;
                        var success = function (res) {
                            if(res.success){
                                $.messager.alert('操作成功', '新增功能成功!');

                                $('#itemmanagerpanel').treegrid('reload') ;



                            }else{
                                $.messager.alert('操作失败', res.msg);
                            }

                        };
                        var errorfunc = function () {
                            $.messager.alert('操作失败', '新增功能失败!');
                        };
                        ajaxfrom.ajaxsend('post', 'json', 'maintain/addnewitem', params, success, null, errorfunc);
                    });
            }
        );


        $('#itempaneltb .newitem').click(function () {
            if ($('#newitemwin').length > 0) {
                $('#newitemwin').dialog('open');
            } else {
                require(['text!views/manager/newitemwin.htm', 'views/manager/newitemwin'],
                    function (div, newitemjs) {
                        $('body').append(div);
                        newitemjs.render();
                    });
            }

        });
        $('#iteminfoform .resetchapter').click(function () {
            if ($('#newchapterwin').length > 0) {
                $('#newchapterwin').dialog('open');
            } else {
                require(['text!views/manager/newchapter.htm', 'views/manager/newchapter'],
                    function (div, newchapterjs) {
                        $('body').append(div);
                        newchapterjs.render();
                    });
            }

        });


        $('#itemmanagerlayout .detailtiptb').find('.add').click(append);
        $('#itemmanagerlayout .detailtiptb').find('.del').click(removeit);
        $('#itemmanagerlayout .detailtiptb').find('.save').click(accept);
        $('#itemmanagerlayout .detailtiptb').find('.undo').click(reject);


    }

    return {
        render: render

    };
});