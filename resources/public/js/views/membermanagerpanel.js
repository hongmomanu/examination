define(function () {

    function render(parameters) {
        var combox=$('#membermanagertable .lazy-combobox');
        combox.combobox({
            onShowPanel: function () {
                var searchtype = $(this).attr('searchtype');
                var url = 'auth/getenumbytype?type='+searchtype;
                $(this).combobox('reload', url);
            }

        });
        /*var combox=$('#membermanagerlayout .lazy-combobox');
        combox.combobox({
            url:'auth/getroles?start=0&limit=100',
            onShowPanel: function () {
             var url = 'auth/getroles?start=0&limit=100';
             $(this).combobox('reload', url);
            }

        });
        $('#membermanagerlayout .loaded-combobox').combobox({
            url:'auth/getdepts?start=0&limit=100'
        });  */

        $('#memberpaneltb .keyword').bind('click keypress',function(e){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if($(this).attr("type")==='keyword'&&keycode!=13)return;

                $('#membermanagerpanel').datagrid('load',{keyword:$('#memberpaneltb .keyword').val()});
            }
        );
        $('#membermanagerpanel').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            fitColumns:true,
            url:'maintain/getunits',
            remoteSort: false,
            /*sortName:'time',
            sortOrder:'desc',*/
            fit:true,
            toolbar:'#memberpaneltb',
            pagination:true,
            pageSize:10,
            onBeforeLoad: function (params) {
                //alert(1);
                var options = $('#membermanagerpanel').datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:function(index, rowData){
                var deptids=rowData.deptids;
                deptids=deptids?deptids.split(","):[];
                rowData.deptids=deptids;
                $('#memberinfoform').form('load',rowData);
                $('#memberformbtns .save,#memberformbtns .del').linkbutton('enable');

                $('#membermanagerlayout').layout('expand','east');

            }

        });

        $('#membermanagerpaneldetail').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            fitColumns:true,
            url:'maintain/getunitmembers',
            remoteSort: false,
            /*sortName:'time',
            sortOrder:'desc',*/
            fit:true,
            //toolbar:'#memberpaneltb',
            pagination:true,
            pageSize:10,
            onBeforeLoad: function (params) {
                //alert(1);
                var options = $('#membermanagerpaneldetail').datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:function(index, rowData){


            }

        });

        $('#memberformbtns .del').click(function(){
            $.messager.confirm('确定要删除用户么?', '你正在试图删除用户?', function(r){
                if (r){
                    require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                        ,function(easyuifrom,ajaxfrom){
                            var params=$('#memberinfoform').form("serialize");
                            var success=function(){
                                $.messager.alert('操作成功','删除用户成功!');
                                $('#membermanagerpanel').datagrid('reload');
                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','删除用户失败!');
                            }
                            ajaxfrom.ajaxsend('post','json','maintain/delmember',params,success,null,errorfunc)

                        });
                }
            });
        });
        $('#memberformbtns .save').click(function(){
            $.messager.confirm('确定要修改单位么?', '你正在试图修改单位?', function(r){
                    if (r){
                        require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                            ,function(easyform,ajaxfrom){


                            var params=$('#memberinfoform').form("serialize");
                            //params.password=CryptoJS.enc.Base64.stringify(CryptoJS.MD5(params.password));
                            params.iscommon=false;
                            var success=function(res){
                                if(res.success){
                                    $.messager.alert('操作成功','修改成功!');
                                    $('#membermanagerpanel').datagrid('reload');
                                }else{
                                    $.messager.alert('操作失败',res.msg);
                                }

                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','修改单位失败!');
                            }
                            ajaxfrom.ajaxsend('post','json','maintain/editmember',params,success,null,errorfunc)

                        });
                    }
                }
            );

        });

        $('#memberpaneltb .newmember').click(function(){
            if($('#newmemberwin').length>0){
                $('#newmemberwin').dialog('open');
            }else{
                require(['text!views/newmemberwin.htm','views/newmemberwin'],
                    function(div,newmemberjs){
                        $('body').append(div);
                        newmemberjs.render();
                    });
            }

        });

    }

    return {
        render: render

    };
});