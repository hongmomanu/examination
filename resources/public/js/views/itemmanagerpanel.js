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
                else params.node = row.id;
                //params.roleid=$.getUrlParam('roleid');

            },
            onLoadSuccess: function (row, data) {
                /*require(['commonfuncs/treegridtip'], function () {
                    $("#funcmanagerpanel").treegrid('tooltip', ['text']);
                });*/

            },
            onClickRow: function (rowData) {
                rowData.itemname = rowData.textold;
                rowData.itemid = rowData.id;
                rowData.label = rowData.value;
                $('#iteminfoform').form('load', rowData);
                $('#itemformbtns .save,#itemformbtns .del').linkbutton('enable');
                $('#itemmanagerlayout').layout('expand', 'east');
            }

        });

        $('#itemformbtns .del').click(function () {
            $.messager.confirm('确定要删除功能么?', '你正在试图删除功能?', function (r) {
                if (r) {
                    require(['js/jqueryplugin/easyui-form.js', 'js/commonfuncs/AjaxForm.js']
                        , function (easyuifrom, ajaxfrom) {
                            var params = $('#iteminfoform').form("serialize");
                            var success = function () {
                                $.messager.alert('操作成功', '删除功能成功!');
                                if (params.pid == -1)$('#itemmanagerpanel').treegrid('reload');
                                else $('#itemmanagerpanel').treegrid('reload', params.pid);
                            };
                            var errorfunc = function () {
                                $.messager.alert('操作失败', '删除功能失败!');
                            }
                            ajaxfrom.ajaxsend('post', 'json', 'auth/delitem', params, success, null, errorfunc)

                        });
                }
            });
        });
        $('#itemformbtns .save').click(function () {
            $.messager.confirm('确定要修改功能配置么?', '你正在试图功能配置?', function (r) {
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

                                ajaxfrom.ajaxsend('post', 'json', 'auth/edititem', params, success, null, errorfunc);
                            });
                    }
                }
            );

        });

        $('#itemformbtns .new').click(function () {

                require(['js/jqueryplugin/easyui-form.js', 'js/commonfuncs/AjaxForm.js']
                    , function (easyform, ajaxfrom) {
                        var params = $('#iteminfoform').form("serialize");
                        //params.parentid = params.itemid;
                        var success = function (res) {
                            if(res.success){
                                $.messager.alert('操作成功', '新增功能成功!');
                                if(params.pid<0){
                                    $('#itemmanagerpanel').treegrid('reload') ;
                                }
                                else{
                                    $('#itemmanagerpanel').treegrid('reload',params.pid);
                                }

                            }else{
                                $.messager.alert('操作失败', res.msg);
                            }

                        };
                        var errorfunc = function () {
                            $.messager.alert('操作失败', '新增功能失败!');
                        };
                        ajaxfrom.ajaxsend('post', 'json', 'auth/addnewitem', params, success, null, errorfunc);
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