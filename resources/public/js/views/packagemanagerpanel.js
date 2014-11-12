define(function () {

    var editIndex = undefined;
    var endEditing=function (){
        if (editIndex == undefined){return true}
        if ($('#packagemanagerpanel').datagrid('validateRow', editIndex)){
           /* var ed = $('#packagemanagerpaneldetail').datagrid('getEditor', {index:editIndex,field:'productid'});
            var productname = $(ed.target).combobox('getText');
            $('#packagemanagerpaneldetail').datagrid('getRows')[editIndex]['productname'] = productname;*/
            $('#packagemanagerpanel').datagrid('endEdit', editIndex);
            //editIndex = undefined;
            return true;
        } else {
            return false;
        }
    }
    var onClickRow=function (index,rowData){
        //console.log(rowData);
        //var packageid=rowData.id;
        $('#packageitemmanagerpanel').tree('reload');

        $('#packagemanagerlayout').layout('expand','east');
        if (editIndex != index){
            if (endEditing()){
                $('#packagemanagerpanel').datagrid('selectRow', index)
                    .datagrid('beginEdit', index);
                editIndex = index;
            } else {
                $('#packagemanagerpanel').datagrid('selectRow', editIndex);
            }
        }
    }
    var append =function (){
        if (endEditing()){
            $('#packagemanagerpanel').datagrid('appendRow',{useflag:'是'});
            editIndex = $('#packagemanagerpanel').datagrid('getRows').length-1;
            $('#packagemanagerpanel').datagrid('selectRow', editIndex)
                .datagrid('beginEdit', editIndex);
        }
    }
    var removeit=function (){
        if (editIndex == undefined){return}
        $('#packagemanagerpanel').datagrid('cancelEdit', editIndex)
            .datagrid('deleteRow', editIndex);
        editIndex = undefined;
    }
    var accept=function (){
        if (endEditing()){
            var inserted=$('#packagemanagerpanel').datagrid('getChanges','inserted');
            var deleted=$('#packagemanagerpanel').datagrid('getChanges','deleted');
            var updated=$('#packagemanagerpanel').datagrid('getChanges','updated');
            if(inserted.length>0){
                require(['js/commonfuncs/AjaxForm.js']
                    ,function(ajaxfrom){
                        for(var i=0;i<inserted.length;i++){
                            inserted[i].unitid=$('#packagemanagerpanel').datagrid('getSelected').id;
                        }
                        var success=function(){
                            $.messager.alert('操作成功','成功!');
                            $('#packagemanagerpanel').datagrid('acceptChanges');
                            editIndex=undefined;
                            $('#packagemanagerpanel').datagrid('reload');
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
                            $('#packagemanagerpanel').datagrid('acceptChanges');
                            editIndex=undefined;
                            $('#packagemanagerpanel').datagrid('reload');
                        };
                        var errorfunc=function(){
                            $.messager.alert('操作失败','失败!');
                        };
                        var params= {packages:$.toJSON(updated)};
                        ajaxfrom.ajaxsend('post','json','maintain/editpackages',params,success,null,errorfunc);

                    });

            }

            if(deleted.length>0){
                require(['js/commonfuncs/AjaxForm.js']
                    ,function(ajaxfrom){

                        var success=function(){
                            $.messager.alert('操作成功','成功!');
                            $('#packagemanagerpanel').datagrid('acceptChanges');
                            editIndex=undefined;
                            $('#packagemanagerpanel').datagrid('reload');
                        };
                        var errorfunc=function(){
                            $.messager.alert('操作失败','失败!');
                        };
                        var params= {packages:$.toJSON(deleted)};
                        ajaxfrom.ajaxsend('post','json','maintain/delpackages',params,success,null,errorfunc);

                    });

            }


            //console.log(inserted);
            //console.log(deleted);
            //console.log(updated);


        }
    }
    var reject =function (){
        $('#packagemanagerpanel').datagrid('rejectChanges');
        editIndex = undefined;
    }
    function getChanges(){
        var rows = $('#packagemanagerpanel').datagrid('getChanges');
        alert(rows.length+' rows are changed!');
    }


    function render(parameters) {
        var combox=$('#packagemanagertable .lazy-combobox');
        combox.combobox({
            onBeforeLoad:function(param){
                var searchtype = $(this).attr('searchtype');
                param.type=searchtype;
            },
            onShowPanel: function () {
                //var searchtype = $(this).attr('searchtype');
                var url = 'auth/getenumbytype';
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

//        $('#packagepaneltb .keyword').bind('click keypress',function(e){
//            var keycode = (event.keyCode ? event.keyCode : event.which);
//            if($(this).attr("type")==='keyword'&&keycode!=13)return;
//
//                $('#packagemanagerpanel').datagrid('load',{keyword:$('#packagepaneltb .keyword').val()});
//            }
//        );
        $('#packagemanagerpanel').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            fitColumns:true,
            url:'maintain/getpackages',
            remoteSort: false,
            /*sortName:'time',
            sortOrder:'desc',*/
            fit:true,
            //toolbar:'#packagepaneltb',
            pagination:true,
            pageSize:10,


            toolbar:'#packagepaneldetailtb',
            onBeforeLoad: function (params) {
                //alert(1);
                var options = $('#packagemanagerpanel').datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:onClickRow

        });

        $('#packageitemmanagerpanel').tree({
            //rownumbers: true,
            checkbox:true,
            onlyLeafCheck:true,
            method: 'post',
            url: 'maintain/gettreeitem',
            treeField: 'text',
            idField: 'id',
            onBeforeLoad: function (row, params) {

                var select=$('#packagemanagerpanel').datagrid('getSelected');
                //params.packageid=select?select.id:null;
                if(select)params.packageid=select.id;
                if (!row)params.node = -1;
                else {
                    var parent =$('#packageitemmanagerpanel').tree('getParent',row.target);
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

        $('#packagepaneldetailtb .add').click(append);
        $('#packagepaneldetailtb .del').click(removeit);
        $('#packagepaneldetailtb .save').click(accept);
        $('#packagepaneldetailtb .undo').click(reject);
        $('#packageitemmanagebtns .save').click(function(){


            $.messager.confirm('确定要修改角色配置么?', '你正在试图角色配置?', function(r){
                if (r){
                    require(['js/commonfuncs/AjaxForm.js']
                        ,function(ajaxfrom){
                            var selectItems=$('#packageitemmanagerpanel').tree('getChecked');
                            var unselectItems=$('#packageitemmanagerpanel').tree('getChecked','unchecked');
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
                            params.packageid=$('#packagemanagerpanel').datagrid('getSelected').id;




                            var success=function(){
                                $.messager.alert('操作成功','配置成功!');
                                $('#packagemanagerpanel').datagrid('reload');
                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','配置失败!');
                            };
                            ajaxfrom.ajaxsend('post','json','maintain/makepackageitems',params,success,null,errorfunc);

                        })
                }
            });


        });



    }

    return {
        render: render

    };
});