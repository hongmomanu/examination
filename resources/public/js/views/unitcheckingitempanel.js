define(function () {



    function render(parameters) {
        var editIndex = undefined;
        var endEditing=function (){
            if (editIndex == undefined){return true}
            if ($('#unitcheckingitempanel .checkingitems').datagrid('validateRow', editIndex)){
                /* var ed = $('#packagemanagerpaneldetail').datagrid('getEditor', {index:editIndex,field:'productid'});
                 var productname = $(ed.target).combobox('getText');
                 $('#packagemanagerpaneldetail').datagrid('getRows')[editIndex]['productname'] = productname;*/
                $('#unitcheckingitempanel .checkingitems').datagrid('endEdit', editIndex);
                //editIndex = undefined;
                return true;
            } else {
                return false;
            }
        }


        var removeit=function (){
            //console.log(editIndex);
            if (editIndex == undefined){return;}
            $('#unitcheckingitempanel .checkingitems').datagrid('cancelEdit', editIndex)
                .datagrid('deleteRow', editIndex);
            editIndex = undefined;
        }
        var accept=function (){
            if (endEditing()){
                var inserted=$('#unitcheckingitempanel .checkingitems').datagrid('getChanges','inserted');
                var deleted=$('#unitcheckingitempanel .checkingitems').datagrid('getChanges','deleted');
                var updated=$('#unitcheckingitempanel .checkingitems').datagrid('getChanges','updated');
                if(inserted.length>0){
                    require(['js/commonfuncs/AjaxForm.js']
                        ,function(ajaxfrom){
                            var rids=[];
                            var rowdata=$('#unitcheckingitempanel .unitmembers').datagrid('getRows');
                            for(var i=0;i<rowdata.length;i++){
                                rids.push(rowdata[i].relationid);
                            }

                            for(var i=0;i<inserted.length;i++){
                               delete inserted[i].deptname;
                               delete inserted[i].itemname;
                            }
                            var success=function(){
                                $.messager.alert('操作成功','成功!');
                                $('#unitcheckingitempanel .checkingitems').datagrid('acceptChanges');
                                editIndex=undefined;
                                $('#unitcheckingitempanel .checkingitems').datagrid('reload');
                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','失败!');
                            };
                            var params= {items:$.toJSON(inserted),rids:$.toJSON(rids)};
                            ajaxfrom.ajaxsend('post','json','maintain/addcheckingitemsbyrids',params,success,null,errorfunc)

                        });
                }

                if(updated.length>0){
                    require(['js/commonfuncs/AjaxForm.js']
                        ,function(ajaxfrom){

                            var success=function(){
                                $.messager.alert('操作成功','成功!');
                                $('#unitcheckingitempanel .checkingitems').datagrid('acceptChanges');
                                editIndex=undefined;
                                $('#unitcheckingitempanel .checkingitems').datagrid('reload');
                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','失败!');
                            };
                            var params= {packages:$.toJSON(updated)};
                            ajaxfrom.ajaxsend('post','json','maintain/editcheckingitems',params,success,null,errorfunc);

                        });

                }

                if(deleted.length>0){
                    require(['js/commonfuncs/AjaxForm.js']
                        ,function(ajaxfrom){

                            var success=function(){
                                $.messager.alert('操作成功','成功!');
                                $('#unitcheckingitempanel .checkingitems').datagrid('acceptChanges');
                                editIndex=undefined;
                                $('#unitcheckingitempanel .checkingitems').datagrid('reload');
                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','失败!');
                            };
                            var rids=[];
                            var rowdata=$('#unitcheckingitempanel .unitmembers').datagrid('getRows');
                            for(var i=0;i<rowdata.length;i++){
                                rids.push(rowdata[i].relationid);
                            }
                            var itemcodes=[];
                            for(var i=0;i<deleted.length;i++){
                                itemcodes.push(deleted[i].itemcode);
                            }
                            var params= {rids: $.toJSON(rids),itemcodes: $.toJSON(itemcodes)};
                            ajaxfrom.ajaxsend('post','json','maintain/delcheckingitemsbyrids',params,success,null,errorfunc);

                        });

                }


                //console.log(inserted);
                //console.log(deleted);
                //console.log(updated);


            }
        }
        var reject =function (){
            $('#unitcheckingitempanel .checkingitems').datagrid('rejectChanges');
            editIndex = undefined;
        }
        function getChanges(){
            var rows = $('#unitcheckingitempanel .checkingitems').datagrid('getChanges');
            alert(rows.length+' rows are changed!');
        }



        $('#unitcheckingitempanel .tabletoolbar').find('.del').click(removeit);
        $('#unitcheckingitempanel .tabletoolbar').find('.save').click(accept);
        $('#unitcheckingitempanel .tabletoolbar').find('.undo').click(reject);

      var isblh_select=false;  

      $('#unitcheckingitempanel .itemtree').tree({
            //rownumbers: true,
            checkbox:false,
            //onlyLeafCheck:true,
            method: 'post',
            url: 'maintain/gettreeitem',
            treeField: 'text',
            idField: 'id',
            onBeforeLoad: function (row, params) {
                params.packageid=0;
                if (!row)params.node = -1;
                else {
                    var parent =$(this).tree('getParent',row.target);
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
            onClick: function (node) {
                if($(this).tree('isLeaf',node.target)){

                    if(!isexsits(node,$('#unitcheckingitempanel .checkingitems').datagrid('getRows'))){
                        var rowdata={
                            deptname:$(this).tree('getParent',node.target).value,
                            itemcode:node.nodeid,
                            itemname:node.value

                        }

                       $('#unitcheckingitempanel .checkingitems').datagrid('appendRow',rowdata) ;
                    }
                }
                


            }
        });


        var isexsits=function(node,rowdata){

            var flag=false;
            for(var i=0;i<rowdata.length;i++){
                if(node.nodeid==rowdata[i].itemcode){
                    flag=true;
                    break;
                }

            }
            return flag;
        }


        $('#unitcheckingitempanel .checkingitems').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            toolbar:'#unitcheckingitempanel .tabletoolbar',
            method:'post',
            url:'maintain/getregistedcheckitems',
            remoteSort: false,
            //fitColumns:true,
            fit:true,
            //toolbar:'#enumpaneltb',
            pagination:false,
            pageSize:300,
            onBeforeLoad: function (params) {
                var options = $('#unitcheckingitempanel .checkingitems').datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:function(index, rowData){
                editIndex=index;
            }

        });
        $('#unitcheckingitempanel .addmembers').click(function(){

            $('#unitcheckingitempanel .unitmembers').datagrid('load',{
               bgno:$('#unitcheckingitempanel .bgno').val(),
               endno:$('#unitcheckingitempanel .endno').val()

            });
        });
        $('#unitcheckingitempanel .unitmembers').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            url:'maintain/getregistedpersonbyrange',
            remoteSort: false,
            //fitColumns:true,
            fit:true,
            toolbar:'#unitcheckingitempanel .searchtoolbar',
            pagination:false,
            pageSize:30000,
            onBeforeLoad: function (params) {
                var options = $(this).datagrid('options');
                params.isunit=$.toJSON([1]);
                params.isinto= $.toJSON([1]);
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:function(index, rowData){

                $('#unitcheckingitempanel .checkingitems').datagrid('load',{relationid:rowData.relationid});
            }

        });

        var datagrid=$('#unitcheckingitempanel .itemgrid').datagrid();

        datagrid.datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            url:'maintain/getallcheckitems',
            remoteSort: false,
            fitColumns:true,
            //fit:true,
            //toolbar:'#enumpaneltb',
            pagination:true,
            pageSize:10,
            onBeforeLoad: function (params) {
                var options =$(this).datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = 'total';
                params.rowsname = 'rows';
            },

            onClickRow:function(index,rowData){
                var item={
                    deptname:rowData.deptname,
                    itemcode:rowData.id,
                    itemname:rowData.itemname

                };
                $('#unitcheckingitempanel .checkingitems').datagrid('appendRow',item) ;
            }
        });

        var pager = datagrid.datagrid('getPager');	// get the pager of datagrid
        var b=pager.find('table').find('tr').append('<td><input class="search" type="text" style="width: 100"></td>');
        $(b).keyup(function() {
            var value=b.find('.search').val();
            $('#unitcheckingitempanel .itemgrid').datagrid('load',{keywords:value});
        });

        var date=new Date();
        $('#unitcheckingitempanel .checkingday').datebox('setValue', date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate());






    }

    return {
        render: render

    };
});