define(function () {

    function render(parameters) {
        var combox=$('#unitmanagertable .lazy-combobox');
        combox.combobox({
            onShowPanel: function () {
                var searchtype = $(this).attr('searchtype');
                var url = 'auth/getenumbytype?type='+searchtype;
                $(this).combobox('reload', url);
            }

        });
        /*var combox=$('#unitmanagerlayout .lazy-combobox');
        combox.combobox({
            url:'auth/getroles?start=0&limit=100',
            onShowPanel: function () {
             var url = 'auth/getroles?start=0&limit=100';
             $(this).combobox('reload', url);
            }

        });
        $('#unitmanagerlayout .loaded-combobox').combobox({
            url:'auth/getdepts?start=0&limit=100'
        });  */

        $('#unitpaneltb .keyword').bind('click keypress',function(e){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if($(this).attr("type")==='keyword'&&keycode!=13)return;

                $('#unitmanagerpanel').datagrid('load',{keyword:$('#unitpaneltb .keyword').val()});
            }
        );
        $('#unitmanagerpanel').datagrid({
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
            toolbar:'#unitpaneltb',
            pagination:true,
            pageSize:10,
            onBeforeLoad: function (params) {
                //alert(1);
                var options = $('#unitmanagerpanel').datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:function(index, rowData){
                var deptids=rowData.deptids;
                deptids=deptids?deptids.split(","):[];
                rowData.deptids=deptids;
                $('#unitinfoform').form('load',rowData);
                $('#unitformbtns .save,#unitformbtns .del').linkbutton('enable');

                $('#unitmanagerlayout').layout('expand','east');

            }

        });

        $('#unitformbtns .del').click(function(){
            $.messager.confirm('确定要删除用户么?', '你正在试图删除用户?', function(r){
                if (r){
                    require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                        ,function(easyuifrom,ajaxfrom){
                            var params=$('#unitinfoform').form("serialize");
                            var success=function(){
                                $.messager.alert('操作成功','删除用户成功!');
                                $('#unitmanagerpanel').datagrid('reload');
                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','删除用户失败!');
                            }
                            ajaxfrom.ajaxsend('post','json','maintain/delunit',params,success,null,errorfunc)

                        });
                }
            });
        });
        $('#unitformbtns .save').click(function(){
            $.messager.confirm('确定要修改单位么?', '你正在试图修改单位?', function(r){
                    if (r){
                        require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                            ,function(easyform,ajaxfrom){


                            var params=$('#unitinfoform').form("serialize");
                            //params.password=CryptoJS.enc.Base64.stringify(CryptoJS.MD5(params.password));
                            params.iscommon=false;
                            var success=function(res){
                                if(res.success){
                                    $.messager.alert('操作成功','修改成功!');
                                    $('#unitmanagerpanel').datagrid('reload');
                                }else{
                                    $.messager.alert('操作失败',res.msg);
                                }

                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','修改单位失败!');
                            }
                            ajaxfrom.ajaxsend('post','json','maintain/editunit',params,success,null,errorfunc)

                        });
                    }
                }
            );

        });

        $('#unitpaneltb .newunit').click(function(){
            if($('#newunitwin').length>0){
                $('#newunitwin').dialog('open');
            }else{
                require(['text!views/newunitwin.htm','views/newunitwin'],
                    function(div,newunitjs){
                        $('body').append(div);
                        newunitjs.render();
                    });
            }

        });

    }

    return {
        render: render

    };
});