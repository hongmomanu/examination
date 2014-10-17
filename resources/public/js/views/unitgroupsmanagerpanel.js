define(function () {

    var editIndex = undefined;
    var endEditing=function (){
        if (editIndex == undefined){return true}
        if ($('#unitgroupsmanagerpanel').datagrid('validateRow', editIndex)){
           /* var ed = $('#unitgroupsmanagerpaneldetail').datagrid('getEditor', {index:editIndex,field:'productid'});
            var productname = $(ed.target).combobox('getText');
            $('#unitgroupsmanagerpaneldetail').datagrid('getRows')[editIndex]['productname'] = productname;*/
            $('#unitgroupsmanagerpanel').datagrid('endEdit', editIndex);
            //editIndex = undefined;
            return true;
        } else {
            return false;
        }
    }
    var onClickRow=function (index,rowData){
        //var unitgroupsid=rowData.id;
        $('#unitgroupsitemmanagerpanel').tree('reload');

        $('#unitgroupsmanagerlayout').layout('expand','east');
        if (editIndex != index){
            if (endEditing()){
                $('#unitgroupsmanagerpanel').datagrid('selectRow', index)
                    .datagrid('beginEdit', index);
                editIndex = index;
            } else {
                $('#unitgroupsmanagerpanel').datagrid('selectRow', editIndex);
            }
        }
    }
    var append =function (){
        if (endEditing()){
            $('#unitgroupsmanagerpanel').datagrid('appendRow',{useflag:'是'});
            editIndex = $('#unitgroupsmanagerpanel').datagrid('getRows').length-1;
            $('#unitgroupsmanagerpanel').datagrid('selectRow', editIndex)
                .datagrid('beginEdit', editIndex);
        }
    }
    var removeit=function (){
        if (editIndex == undefined){return}
        $('#unitgroupsmanagerpanel').datagrid('cancelEdit', editIndex)
            .datagrid('deleteRow', editIndex);
        editIndex = undefined;
    }
    var accept=function (){
        if (endEditing()){
            var inserted=$('#unitgroupsmanagerpanel').datagrid('getChanges','inserted');
            var deleted=$('#unitgroupsmanagerpanel').datagrid('getChanges','deleted');
            var updated=$('#unitgroupsmanagerpanel').datagrid('getChanges','updated');
            if(inserted.length>0){
                require(['js/commonfuncs/AjaxForm.js']
                    ,function(ajaxfrom){
                        for(var i=0;i<inserted.length;i++){
                            inserted[i].unitid=$('#unitgroupsmanagerpanel').datagrid('getSelected').id;
                        }
                        var success=function(){
                            $.messager.alert('操作成功','成功!');
                            $('#unitgroupsmanagerpanel').datagrid('acceptChanges');
                            editIndex=undefined;
                            $('#unitgroupsmanagerpanel').datagrid('reload');
                        };
                        var errorfunc=function(){
                            $.messager.alert('操作失败','失败!');
                        };
                        var params= {unitgroupss:$.toJSON(inserted)};
                        ajaxfrom.ajaxsend('post','json','maintain/addnewunitunitgroupss',params,success,null,errorfunc)

                    });
            }

            if(updated.length>0){
                require(['js/commonfuncs/AjaxForm.js']
                    ,function(ajaxfrom){

                        var success=function(){
                            $.messager.alert('操作成功','成功!');
                            $('#unitgroupsmanagerpanel').datagrid('acceptChanges');
                            editIndex=undefined;
                            $('#unitgroupsmanagerpanel').datagrid('reload');
                        };
                        var errorfunc=function(){
                            $.messager.alert('操作失败','失败!');
                        };
                        var params= {unitgroupss:$.toJSON(updated)};
                        ajaxfrom.ajaxsend('post','json','maintain/editunitgroupss',params,success,null,errorfunc);

                    });

            }

            if(deleted.length>0){
                require(['js/commonfuncs/AjaxForm.js']
                    ,function(ajaxfrom){

                        var success=function(){
                            $.messager.alert('操作成功','成功!');
                            $('#unitgroupsmanagerpanel').datagrid('acceptChanges');
                            editIndex=undefined;
                            $('#unitgroupsmanagerpanel').datagrid('reload');
                        };
                        var errorfunc=function(){
                            $.messager.alert('操作失败','失败!');
                        };
                        var params= {unitgroupss:$.toJSON(deleted)};
                        ajaxfrom.ajaxsend('post','json','maintain/delunitgroupss',params,success,null,errorfunc);

                    });

            }


            //console.log(inserted);
            //console.log(deleted);
            //console.log(updated);


        }
    }
    var reject =function (){
        $('#unitgroupsmanagerpanel').datagrid('rejectChanges');
        editIndex = undefined;
    }
    function getChanges(){
        var rows = $('#unitgroupsmanagerpanel').datagrid('getChanges');
        alert(rows.length+' rows are changed!');
    }


    function render(parameters) {
        var combox=$('#unitgroupsmanagertable .lazy-combobox');
        combox.combobox({
            onShowPanel: function () {
                var searchtype = $(this).attr('searchtype');
                var url = 'auth/getenumbytype?type='+searchtype;
                $(this).combobox('reload', url);
            }

        });
        /*var combox=$('#unitgroupsmanagerlayout .lazy-combobox');
        combox.combobox({
            url:'auth/getroles?start=0&limit=100',
            onShowPanel: function () {
             var url = 'auth/getroles?start=0&limit=100';
             $(this).combobox('reload', url);
            }

        });
        $('#unitgroupsmanagerlayout .loaded-combobox').combobox({
            url:'auth/getdepts?start=0&limit=100'
        });  */

//        $('#unitgroupspaneltb .keyword').bind('click keypress',function(e){
//            var keycode = (event.keyCode ? event.keyCode : event.which);
//            if($(this).attr("type")==='keyword'&&keycode!=13)return;
//
//                $('#unitgroupsmanagerpanel').datagrid('load',{keyword:$('#unitgroupspaneltb .keyword').val()});
//            }
//        );
        $('#unitgroupsmanagerpanel').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            fitColumns:true,
            url:'maintain/getunitgroupss',
            remoteSort: false,
            /*sortName:'time',
            sortOrder:'desc',*/
            fit:true,
            //toolbar:'#unitgroupspaneltb',
            pagination:true,
            pageSize:10,


            toolbar:'#unitgroupspaneldetailtb',
            onBeforeLoad: function (params) {
                //alert(1);
                var options = $('#unitgroupsmanagerpanel').datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:onClickRow

        });

        $('#unitgroupsitemmanagerpanel').tree({
            //rownumbers: true,
            checkbox:true,
            onlyLeafCheck:true,
            method: 'post',
            url: 'maintain/gettreeitem',
            treeField: 'text',
            idField: 'id',
            onBeforeLoad: function (row, params) {

                var select=$('#unitgroupsmanagerpanel').datagrid('getSelected');
                //params.unitgroupsid=select?select.id:null;
                if(select)params.unitgroupsid=select.id;
                if (!row)params.node = -1;
                else {
                    var parent =$('#unitgroupsitemmanagerpanel').tree('getParent',row.target);
                    params.node = row.nodeid;
                    params.pid=parent.id;
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

            },
            onClickRow: function (rowData) {


            }
        });

        $('#unitgroupspaneldetailtb .add').click(append);
        $('#unitgroupspaneldetailtb .del').click(removeit);
        $('#unitgroupspaneldetailtb .save').click(accept);
        $('#unitgroupspaneldetailtb .undo').click(reject);
        $('#unitgroupsitemmanagebtns .save').click(function(){


            $.messager.confirm('确定要修改角色配置么?', '你正在试图角色配置?', function(r){
                if (r){
                    require(['js/commonfuncs/AjaxForm.js']
                        ,function(ajaxfrom){
                            var selectItems=$('#unitgroupsitemmanagerpanel').tree('getChecked');
                            var unselectItems=$('#unitgroupsitemmanagerpanel').tree('getChecked','unchecked');
                            if(selectItems.length==0&&unselectItems.length==0){
                                $.messager.alert('提示','未设置项目!');
                                return;
                            }
                            var itemid_arr=[];
                            var delete_arr=[];
                            $.each(selectItems,function(index,item){
                                itemid_arr.push(item.nodeid);
                            });
                            $.each(unselectItems,function(index,item){
                                delete_arr.push(item.nodeid);
                            });
                            var params={};
                            params.deleteid=$.toJSON(delete_arr);
                            params.itemid=$.toJSON(itemid_arr);
                            params.unitgroupsid=$('#unitgroupsmanagerpanel').datagrid('getSelected').id;




                            var success=function(){
                                $.messager.alert('操作成功','配置成功!');
                                $('#unitgroupsmanagerpanel').datagrid('reload');
                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','配置失败!');
                            };
                            ajaxfrom.ajaxsend('post','json','maintain/makeunitgroupsitems',params,success,null,errorfunc);

                        })
                }
            });


        });



    }

    return {
        render: render

    };
});