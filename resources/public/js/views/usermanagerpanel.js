define(function () {

    function render(parameters) {
        var combox=$('#usermanagerlayout .lazy-combobox');
        combox.combobox({
            url:'auth/getroles?start=0&limit=100',
            onShowPanel: function () {
             var url = 'auth/getroles?start=0&limit=100';
             $(this).combobox('reload', url);
            }

        });
        $('#usermanagerlayout .loaded-combobox').combobox({
            url:'auth/getdepts?start=0&limit=100'
        });

        $('#userpaneltb .keyword').bind('click keypress',function(e){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if($(this).attr("type")==='keyword'&&keycode!=13)return;

                $('#usermanagerpanel').datagrid('load',{keyword:$('#userpaneltb .keyword').val()});
            }
        );
        $('#usermanagerpanel').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            fitColumns:true,
            url:'auth/getusers',
            remoteSort: false,
            sortName:'time',
            sortOrder:'desc',
            fit:true,
            toolbar:'#userpaneltb',
            pagination:true,
            pageSize:10,
            onBeforeLoad: function (params) {
                var options = $('#usermanagerpanel').datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:function(index, rowData){
                var deptids=rowData.deptids;
                deptids=deptids?deptids.split(","):[];
                rowData.deptids=deptids;
                $('#userinfoform').form('load',rowData);
                $('#userformbtns .save,#userformbtns .del').linkbutton('enable');

                $('#usermanagerlayout').layout('expand','east');

            }

        });

        $('#userformbtns .del').click(function(){
            $.messager.confirm('确定要删除用户么?', '你正在试图删除用户?', function(r){
                if (r){
                    require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                        ,function(easyuifrom,ajaxfrom){
                            var params=$('#userinfoform').form("serialize");
                            var success=function(){
                                $.messager.alert('操作成功','删除用户成功!');
                                $('#usermanagerpanel').datagrid('reload');
                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','删除用户失败!');
                            }
                            ajaxfrom.ajaxsend('post','json','auth/deluser',params,success,null,errorfunc)

                        });
                }
            });
        });
        $('#userformbtns .save').click(function(){
            $.messager.confirm('确定要修改用户么?', '你正在试图修改用户?', function(r){
                    if (r){
                        require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                            ,function(easyform,ajaxfrom){


                            var params=$('#userinfoform').form("serialize");
                            //params.password=CryptoJS.enc.Base64.stringify(CryptoJS.MD5(params.password));
                            params.iscommon=false;
                            var success=function(res){
                                if(res.success){
                                    $.messager.alert('操作成功','修改用户成功!');
                                    $('#usermanagerpanel').datagrid('reload');
                                }else{
                                    $.messager.alert('操作失败',res.msg);
                                }

                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','修改用户失败!');
                            }
                            ajaxfrom.ajaxsend('post','json','auth/edituser',params,success,null,errorfunc)

                        });
                    }
                }
            );

        });

        $('#userpaneltb .newuser').click(function(){
            if($('#newuserwin').length>0){
                $('#newuserwin').dialog('open');
            }else{
                require(['text!views/newuserwin.htm','views/newuserwin'],
                    function(div,newuserjs){
                        $('body').append(div);
                        newuserjs.render();
                    });
            }

        });

    }

    return {
        render: render

    };
});