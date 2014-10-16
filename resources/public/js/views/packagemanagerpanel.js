define(function () {

    var editIndex = undefined;
    var endEditing=function (){
        if (editIndex == undefined){return true}
        if ($('#packagemanagerpaneldetail').datagrid('validateRow', editIndex)){
           /* var ed = $('#packagemanagerpaneldetail').datagrid('getEditor', {index:editIndex,field:'productid'});
            var productname = $(ed.target).combobox('getText');
            $('#packagemanagerpaneldetail').datagrid('getRows')[editIndex]['productname'] = productname;*/
            $('#packagemanagerpaneldetail').datagrid('endEdit', editIndex);
            //editIndex = undefined;
            return true;
        } else {
            return false;
        }
    }
    var onClickRow=function (index){
        if (editIndex != index){
            if (endEditing()){
                $('#packagemanagerpaneldetail').datagrid('selectRow', index)
                    .datagrid('beginEdit', index);
                editIndex = index;
            } else {
                $('#packagemanagerpaneldetail').datagrid('selectRow', editIndex);
            }
        }
    }
    var append =function (){
        if (endEditing()){
            $('#packagemanagerpaneldetail').datagrid('appendRow',{ischeck:'是'});
            editIndex = $('#packagemanagerpaneldetail').datagrid('getRows').length-1;
            $('#packagemanagerpaneldetail').datagrid('selectRow', editIndex)
                .datagrid('beginEdit', editIndex);
        }
    }
    var removeit=function (){
        if (editIndex == undefined){return}
        $('#packagemanagerpaneldetail').datagrid('cancelEdit', editIndex)
            .datagrid('deleteRow', editIndex);
        editIndex = undefined;
    }
    var accept=function (){
        if (endEditing()){
            var inserted=$('#packagemanagerpaneldetail').datagrid('getChanges','inserted');
            var deleted=$('#packagemanagerpaneldetail').datagrid('getChanges','deleted');
            var updated=$('#packagemanagerpaneldetail').datagrid('getChanges','updated');
            if(inserted.length>0){
                require(['js/commonfuncs/AjaxForm.js']
                    ,function(ajaxfrom){
                        for(var i=0;i<inserted.length;i++){
                            inserted[i].unitid=$('#packagemanagerpanel').datagrid('getSelected').id;
                        }
                        var success=function(){
                            $.messager.alert('操作成功','成功!');
                            $('#packagemanagerpaneldetail').datagrid('acceptChanges');
                            editIndex=undefined;
                            $('#packagemanagerpaneldetail').datagrid('reload');
                        };
                        var errorfunc=function(){
                            $.messager.alert('操作失败','失败!');
                        };
                        var params= {packages:$.toJSON(inserted)};
                        ajaxfrom.ajaxsend('post','json','maintain/addnewunitpackages',params,success,null,errorfunc)

                    });
            }

            if(updated.length>0){
                require(['js/commonfuncs/AjaxForm.js']
                    ,function(ajaxfrom){

                        var success=function(){
                            $.messager.alert('操作成功','成功!');
                            $('#packagemanagerpaneldetail').datagrid('acceptChanges');
                            editIndex=undefined;
                            $('#packagemanagerpaneldetail').datagrid('reload');
                        };
                        var errorfunc=function(){
                            $.messager.alert('操作失败','失败!');
                        };
                        var params= {packages:$.toJSON(updated)};
                        ajaxfrom.ajaxsend('post','json','maintain/editunitpackages',params,success,null,errorfunc);

                    });

            }

            if(deleted.length>0){
                require(['js/commonfuncs/AjaxForm.js']
                    ,function(ajaxfrom){

                        var success=function(){
                            $.messager.alert('操作成功','成功!');
                            $('#packagemanagerpaneldetail').datagrid('acceptChanges');
                            editIndex=undefined;
                            $('#packagemanagerpaneldetail').datagrid('reload');
                        };
                        var errorfunc=function(){
                            $.messager.alert('操作失败','失败!');
                        };
                        var params= {packages:$.toJSON(deleted)};
                        ajaxfrom.ajaxsend('post','json','maintain/delunitpackages',params,success,null,errorfunc);

                    });

            }


            //console.log(inserted);
            //console.log(deleted);
            //console.log(updated);


        }
    }
    var reject =function (){
        $('#packagemanagerpaneldetail').datagrid('rejectChanges');
        editIndex = undefined;
    }
    function getChanges(){
        var rows = $('#packagemanagerpaneldetail').datagrid('getChanges');
        alert(rows.length+' rows are changed!');
    }


    function render(parameters) {
        var combox=$('#packagemanagertable .lazy-combobox');
        combox.combobox({
            onShowPanel: function () {
                var searchtype = $(this).attr('searchtype');
                var url = 'auth/getenumbytype?type='+searchtype;
                $(this).combobox('reload', url);
            }

        });
        /*var combox=$('#packagemanagerlayout .lazy-combobox');
        combox.combobox({
            url:'auth/getroles?start=0&limit=100',
            onShowPanel: function () {
             var url = 'auth/getroles?start=0&limit=100';
             $(this).combobox('reload', url);
            }

        });
        $('#packagemanagerlayout .loaded-combobox').combobox({
            url:'auth/getdepts?start=0&limit=100'
        });  */

        $('#packagepaneltb .keyword').bind('click keypress',function(e){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if($(this).attr("type")==='keyword'&&keycode!=13)return;

                $('#packagemanagerpanel').datagrid('load',{keyword:$('#packagepaneltb .keyword').val()});
            }
        );
        $('#packagemanagerpanel').datagrid({
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
            toolbar:'#packagepaneltb',
            pagination:true,
            pageSize:10,
            onBeforeLoad: function (params) {
                //alert(1);
                var options = $('#packagemanagerpanel').datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:function(index, rowData){
                //console.log(rowData);
                var unitid=rowData.id;
                $('#packagemanagerpaneldetail').datagrid('load',{id:unitid});
                //$('#packageinfoform').form('load',rowData);
                //$('#packageformbtns .save,#packageformbtns .del').linkbutton('enable');

                $('#packagemanagerlayout').layout('expand','east');

            }

        });

        $('#packagemanagerpaneldetail').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            fitColumns:true,
            url:'maintain/getunitpackages',
            remoteSort: false,
            /*sortName:'time',
            sortOrder:'desc',*/
            fit:true,
            toolbar:'#packagepaneldetailtb',
            pagination:true,
            pageSize:10,
            onBeforeLoad: function (params) {
                //alert(1);
                var options = $('#packagemanagerpaneldetail').datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:onClickRow

        });

        $('#packagepaneldetailtb .add').click(append);
        $('#packagepaneldetailtb .del').click(removeit);
        $('#packagepaneldetailtb .save').click(accept);
        $('#packagepaneldetailtb .undo').click(reject);

        $('#packageformbtns .del').click(function(){
            $.messager.confirm('确定要删除用户么?', '你正在试图删除用户?', function(r){
                if (r){
                    require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                        ,function(easyuifrom,ajaxfrom){
                            var params=$('#packageinfoform').form("serialize");
                            var success=function(){
                                $.messager.alert('操作成功','删除用户成功!');
                                $('#packagemanagerpanel').datagrid('reload');
                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','删除用户失败!');
                            }
                            ajaxfrom.ajaxsend('post','json','maintain/delpackage',params,success,null,errorfunc)

                        });
                }
            });
        });
        $('#packageformbtns .save').click(function(){
            $.messager.confirm('确定要修改单位么?', '你正在试图修改单位?', function(r){
                    if (r){
                        require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                            ,function(easyform,ajaxfrom){


                            var params=$('#packageinfoform').form("serialize");
                            //params.password=CryptoJS.enc.Base64.stringify(CryptoJS.MD5(params.password));
                            params.iscommon=false;
                            var success=function(res){
                                if(res.success){
                                    $.messager.alert('操作成功','修改成功!');
                                    $('#packagemanagerpanel').datagrid('reload');
                                }else{
                                    $.messager.alert('操作失败',res.msg);
                                }

                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','修改单位失败!');
                            }
                            ajaxfrom.ajaxsend('post','json','maintain/editpackage',params,success,null,errorfunc)

                        });
                    }
                }
            );

        });

        $('#packagepaneltb .newpackage').click(function(){
            if($('#newpackagewin').length>0){
                $('#newpackagewin').dialog('open');
            }else{
                require(['text!views/newpackagewin.htm','views/newpackagewin'],
                    function(div,newpackagejs){
                        $('body').append(div);
                        newpackagejs.render();
                    });
            }

        });

    }

    return {
        render: render

    };
});