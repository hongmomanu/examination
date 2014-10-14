define(function () {

    function render(parameters) {
        var combox=$('#deptmanagerlayout .lazy-combobox');
        combox.combobox({
            url:'auth/getenumbytype?type='+ combox.attr('searchtype')
            /*onShowPanel: function () {
                var searchtype = $(this).attr('searchtype');
                var url = 'auth/getenumbytype?type='+searchtype;
                $(this).combobox('reload', url);
            }*/

        });


        $('#deptpaneltb .keyword').bind('click keypress',function(e){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if($(this).attr("type")==='keyword'&&keycode!=13)return;

                $('#deptmanagerpanel').datagrid('load',{keyword:$('#deptpaneltb .keyword').val()});
            }
        );
        $('#deptmanagerpanel').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            url:'auth/getdepts',
            remoteSort: false,
            sortName:'time',
            sortOrder:'desc',
            fitColumns:true,
            fit:true,
            toolbar:'#deptpaneltb',
            pagination:true,
            pageSize:10,
            onBeforeLoad: function (params) {
                var options = $('#deptmanagerpanel').datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:function(index, rowData){
                $('#deptinfoform').form('load',rowData);
                $('#deptformbtns .save,#deptformbtns .del').linkbutton('enable');
                $('#deptmanagerlayout').layout('expand','east');
            }

        });

        $('#deptformbtns .del').click(function(){
            $.messager.confirm('确定要删除科室么?', '你正在试图删除科室?', function(r){
                if (r){
                    require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                        ,function(easyuifrom,ajaxfrom){
                            var params=$('#deptinfoform').form("serialize");
                            var success=function(){
                                $.messager.alert('操作成功','删除科室成功!');
                                $('#deptmanagerpanel').datagrid('reload');
                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','删除科室失败!');
                            }
                            ajaxfrom.ajaxsend('post','json','auth/deldept',params,success,null,errorfunc)

                        });
                }
            });
        });
        $('#deptformbtns .save').click(function(){
            $.messager.confirm('确定要修改科室么?', '你正在试图修改科室?', function(r){
                    if (r){
                        require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                            ,function(easyform,ajaxfrom){


                            var params=$('#deptinfoform').form("serialize");
                            //params.password=CryptoJS.enc.Base64.stringify(CryptoJS.MD5(params.password));
                            params.iscommon=false;
                            var success=function(res){
                                if(res.success){
                                    $.messager.alert('操作成功','修改科室成功!');
                                    $('#deptmanagerpanel').datagrid('reload');
                                }else{
                                    $.messager.alert('操作失败',res.msg);
                                }

                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','修改科室失败!');
                            }
                            ajaxfrom.ajaxsend('post','json','auth/editdept',params,success,null,errorfunc)

                        });
                    }
                }
            );

        });

        $('#deptpaneltb .newdept').click(function(){
            if($('#newdeptwin').length>0){
                $('#newdeptwin').dialog('open');
            }else{
                require(['text!views/newdeptwin.htm','views/newdeptwin'],
                    function(div,newdeptjs){
                        $('body').append(div);
                        newdeptjs.render();
                    });
            }

        });

    }

    return {
        render: render

    };
});