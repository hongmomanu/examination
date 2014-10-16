define(function () {

    var editIndex = undefined;
    var endEditing=function (){
        if (editIndex == undefined){return true}
        if ($('#membermanagerpaneldetail').datagrid('validateRow', editIndex)){
           /* var ed = $('#membermanagerpaneldetail').datagrid('getEditor', {index:editIndex,field:'productid'});
            var productname = $(ed.target).combobox('getText');
            $('#membermanagerpaneldetail').datagrid('getRows')[editIndex]['productname'] = productname;*/
            $('#membermanagerpaneldetail').datagrid('endEdit', editIndex);
            //editIndex = undefined;
            return true;
        } else {
            return false;
        }
    }
    var onClickRow=function (index){
        if (editIndex != index){
            if (endEditing()){
                $('#membermanagerpaneldetail').datagrid('selectRow', index)
                    .datagrid('beginEdit', index);
                editIndex = index;
            } else {
                $('#membermanagerpaneldetail').datagrid('selectRow', editIndex);
            }
        }
    }
    var append =function (){
        if (endEditing()){
            $('#membermanagerpaneldetail').datagrid('appendRow',{ischeck:'是'});
            editIndex = $('#membermanagerpaneldetail').datagrid('getRows').length-1;
            $('#membermanagerpaneldetail').datagrid('selectRow', editIndex)
                .datagrid('beginEdit', editIndex);
        }
    }
    var removeit=function (){
        if (editIndex == undefined){return}
        $('#membermanagerpaneldetail').datagrid('cancelEdit', editIndex)
            .datagrid('deleteRow', editIndex);
        editIndex = undefined;
    }
    var accept=function (){
        if (endEditing()){
            var inserted=$('#membermanagerpaneldetail').datagrid('getChanges','inserted');
            var deleted=$('#membermanagerpaneldetail').datagrid('getChanges','deleted');
            var updated=$('#membermanagerpaneldetail').datagrid('getChanges','updated');
            if(inserted.length>0){
                require(['js/commonfuncs/AjaxForm.js']
                    ,function(ajaxfrom){
                        for(var i=0;i<inserted.length;i++){
                            inserted[i].unitid=$('#membermanagerpanel').datagrid('getSelected').id;
                        }
                        var success=function(){
                            $.messager.alert('操作成功','成功!');
                            $('#membermanagerpaneldetail').datagrid('acceptChanges');
                            editIndex=undefined;
                            $('#membermanagerpaneldetail').datagrid('reload');
                        };
                        var errorfunc=function(){
                            $.messager.alert('操作失败','失败!');
                        };
                        var params= {members:$.toJSON(inserted)};
                        ajaxfrom.ajaxsend('post','json','maintain/addnewunitmembers',params,success,null,errorfunc)

                    });
            }

            if(updated.length>0){
                require(['js/commonfuncs/AjaxForm.js']
                    ,function(ajaxfrom){

                        var success=function(){
                            $.messager.alert('操作成功','成功!');
                            $('#membermanagerpaneldetail').datagrid('acceptChanges');
                            editIndex=undefined;
                            $('#membermanagerpaneldetail').datagrid('reload');
                        };
                        var errorfunc=function(){
                            $.messager.alert('操作失败','失败!');
                        };
                        var params= {members:$.toJSON(updated)};
                        ajaxfrom.ajaxsend('post','json','maintain/editunitmembers',params,success,null,errorfunc);

                    });

            }

            if(deleted.length>0){
                require(['js/commonfuncs/AjaxForm.js']
                    ,function(ajaxfrom){

                        var success=function(){
                            $.messager.alert('操作成功','成功!');
                            $('#membermanagerpaneldetail').datagrid('acceptChanges');
                            editIndex=undefined;
                            $('#membermanagerpaneldetail').datagrid('reload');
                        };
                        var errorfunc=function(){
                            $.messager.alert('操作失败','失败!');
                        };
                        var params= {members:$.toJSON(deleted)};
                        ajaxfrom.ajaxsend('post','json','maintain/delunitmembers',params,success,null,errorfunc);

                    });

            }


            //console.log(inserted);
            //console.log(deleted);
            //console.log(updated);


        }
    }
    var reject =function (){
        $('#membermanagerpaneldetail').datagrid('rejectChanges');
        editIndex = undefined;
    }
    function getChanges(){
        var rows = $('#membermanagerpaneldetail').datagrid('getChanges');
        alert(rows.length+' rows are changed!');
    }


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
                //console.log(rowData);
                var unitid=rowData.id;
                $('#membermanagerpaneldetail').datagrid('load',{id:unitid});
                //$('#memberinfoform').form('load',rowData);
                //$('#memberformbtns .save,#memberformbtns .del').linkbutton('enable');

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
            toolbar:'#memberpaneldetailtb',
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
            onClickRow:onClickRow

        });

        $('#memberpaneldetailtb .add').click(append);
        $('#memberpaneldetailtb .del').click(removeit);
        $('#memberpaneldetailtb .save').click(accept);
        $('#memberpaneldetailtb .undo').click(reject);

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