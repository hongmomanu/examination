define(function () {

    function render(parameters) {
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
                console.log(rowData);
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

    }

    return {
        render: render

    };
});