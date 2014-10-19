define(function () {

    var editIndex = undefined;
    var endEditing=function (){
        if (editIndex == undefined){return true}
        if ($('#suggestmanagerpaneltable').datagrid('validateRow', editIndex)){
            /* var ed = $('#suggestmanagerpaneltabledetail').datagrid('getEditor', {index:editIndex,field:'productid'});
             var productname = $(ed.target).combobox('getText');
             $('#suggestmanagerpaneltabledetail').datagrid('getRows')[editIndex]['productname'] = productname;*/
            $('#suggestmanagerpaneltable').datagrid('endEdit', editIndex);
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
                $('#suggestmanagerpaneltable').datagrid('selectRow', index)
                    .datagrid('beginEdit', index);
                editIndex = index;
            } else {
                $('#suggestmanagerpaneltable').datagrid('selectRow', editIndex);
            }
        }
    }
    var append =function (){
        if (endEditing()){
            $('#suggestmanagerpaneltable').datagrid('appendRow',{status:'是'});
            editIndex = $('#suggestmanagerpaneltable').datagrid('getRows').length-1;
            $('#suggestmanagerpaneltable').datagrid('selectRow', editIndex)
                .datagrid('beginEdit', editIndex);
        }
    }
    var removeit=function (){
        if (editIndex == undefined){return}
        $('#suggestmanagerpaneltable').datagrid('cancelEdit', editIndex)
            .datagrid('deleteRow', editIndex);
        editIndex = undefined;
    }
    var accept=function (){
        if (endEditing()){
            var inserted=$('#suggestmanagerpaneltable').datagrid('getChanges','inserted');
            var deleted=$('#suggestmanagerpaneltable').datagrid('getChanges','deleted');
            var updated=$('#suggestmanagerpaneltable').datagrid('getChanges','updated');
            if(inserted.length>0){
                require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                    ,function(easyform,ajaxfrom){
//                        var params=$('#suggestinfoform form').form("serialize");
//                        var deptid=params.deptid;
                        for(var i=0;i<inserted.length;i++){
                            inserted[i].deptid=$('#suggestmanagerpanel').datagrid('getSelected').id;
                        }
                        var success=function(){
                            $.messager.alert('操作成功','成功!');
                            $('#suggestmanagerpaneltable').datagrid('acceptChanges');
                            editIndex=undefined;
                            $('#suggestmanagerpaneltable').datagrid('reload');
                        };
                        var errorfunc=function(){
                            $.messager.alert('操作失败','失败!');
                        };
                        var params= {suggets:$.toJSON(inserted)};
                        ajaxfrom.ajaxsend('post','json','maintain/addnewsuggests',params,success,null,errorfunc)

                    });
            }

            if(updated.length>0){
                require(['js/commonfuncs/AjaxForm.js']
                    ,function(ajaxfrom){

                        var success=function(){
                            $.messager.alert('操作成功','成功!');
                            $('#suggestmanagerpaneltable').datagrid('acceptChanges');
                            editIndex=undefined;
                            $('#suggestmanagerpaneltable').datagrid('reload');
                        };
                        var errorfunc=function(){
                            $.messager.alert('操作失败','失败!');
                        };
                        var params= {packages:$.toJSON(updated)};
                        ajaxfrom.ajaxsend('post','json','maintain/editsuggests',params,success,null,errorfunc);

                    });

            }

            if(deleted.length>0){
                require(['js/commonfuncs/AjaxForm.js']
                    ,function(ajaxfrom){

                        var success=function(){
                            $.messager.alert('操作成功','成功!');
                            $('#suggestmanagerpaneltable').datagrid('acceptChanges');
                            editIndex=undefined;
                            $('#suggestmanagerpaneltable').datagrid('reload');
                        };
                        var errorfunc=function(){
                            $.messager.alert('操作失败','失败!');
                        };
                        var params= {packages:$.toJSON(deleted)};
                        ajaxfrom.ajaxsend('post','json','maintain/delsuggests',params,success,null,errorfunc);

                    });

            }


            //console.log(inserted);
            //console.log(deleted);
            //console.log(updated);


        }
    }
    var reject =function (){
        $('#suggestmanagerpaneltable').datagrid('rejectChanges');
        editIndex = undefined;
    }
    
    
    

    function render(parameters) {
        var combox=$('#suggestmanagerlayout .lazy-combobox');
        combox.combobox({
            url:'auth/getenumbytype?type='+ combox.attr('searchtype')
            /*onShowPanel: function () {
             var searchtype = $(this).attr('searchtype');
             var url = 'auth/getenumbytype?type='+searchtype;
             $(this).combobox('reload', url);
             }*/

        });


        $('#suggestpaneltb .keyword').bind('click keypress',function(e){
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if($(this).attr("type")==='keyword'&&keycode!=13)return;

                $('#suggestmanagerpanel').datagrid('load',{keyword:$('#suggestpaneltb .keyword').val()});
            }
        );

        $('#suggestinfoformcontent').textbox(
            {
                onChange:function(newValue,oldValue){
                    endEditing();
                    var data=$('#suggestmanagerpaneltable').datagrid('getSelected');
                    var index=$('#suggestmanagerpaneltable').datagrid('getRowIndex',data);
                    data.content=newValue;
                    //console.log(data);
                    $('#suggestmanagerpaneltable').datagrid('updateRow',{
                        index:index,
                        row:data
                    });

        }});

        $('#suggestmanagerpaneltable').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            fitColumns:true,
            url:'maintain/getsuggests',
            remoteSort: false,
            /*sortName:'time',
             sortOrder:'desc',*/
            fit:true,
            //toolbar:'#packagepaneltb',
            pagination:true,
            pageSize:10,


            toolbar:'#suggestpaneldetailtb',
            onBeforeLoad: function (params) {
                //alert(1);
                var options = $('#suggestmanagerpaneltable').datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:onClickRow

        });



        $('#suggestmanagerpanel').datagrid({
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
            toolbar:'#suggestpaneltb',
            pagination:true,
            pageSize:10,
            onBeforeLoad: function (params) {
                var options = $('#suggestmanagerpanel').datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:function(index, rowData){
                var deptid=rowData.id;
                $('#suggestinfoform').form('load',{deptid:deptid});

                $('#suggestformbtns .save,#suggestformbtns .del').linkbutton('enable');
                $('#suggestmanagerlayout').layout('expand','east');
                $('#suggestmanagerpaneltable').datagrid('loadData',[]);

                $('#suggestmanagerpaneltable').datagrid('reload',{deptid: deptid});
            }

        });

        $('#suggestpaneldetailtb .add').click(append);
        $('#suggestpaneldetailtb .del').click(removeit);
        $('#suggestpaneldetailtb .save').click(accept);
        $('#suggestpaneldetailtb .undo').click(reject);





    }

    return {
        render: render

    };
});