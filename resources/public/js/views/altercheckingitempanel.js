define(function () {



    function render(parameters) {
        var editIndex = undefined;
        var endEditing=function (){
            if (editIndex == undefined){return true}
            if ($('#checkingitems').datagrid('validateRow', editIndex)){
                /* var ed = $('#packagemanagerpaneldetail').datagrid('getEditor', {index:editIndex,field:'productid'});
                 var productname = $(ed.target).combobox('getText');
                 $('#packagemanagerpaneldetail').datagrid('getRows')[editIndex]['productname'] = productname;*/
                $('#checkingitems').datagrid('endEdit', editIndex);
                //editIndex = undefined;
                return true;
            } else {
                return false;
            }
        }


        var removeit=function (){
            if (editIndex == undefined){return}
            $('#checkingitems').datagrid('cancelEdit', editIndex)
                .datagrid('deleteRow', editIndex);
            editIndex = undefined;
        }
        var accept=function (){
            if (endEditing()){
                var inserted=$('#checkingitems').datagrid('getChanges','inserted');
                var deleted=$('#checkingitems').datagrid('getChanges','deleted');
                var updated=$('#checkingitems').datagrid('getChanges','updated');
                if(inserted.length>0){
                    require(['js/commonfuncs/AjaxForm.js']
                        ,function(ajaxfrom){
                            for(var i=0;i<inserted.length;i++){
                                inserted[i].relationid=isblh_select;
                               delete inserted[i].deptname;
                               delete inserted[i].itemname;
                            }
                            var success=function(){
                                $.messager.alert('操作成功','成功!');
                                $('#checkingitems').datagrid('acceptChanges');
                                editIndex=undefined;
                                $('#checkingitems').datagrid('reload');
                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','失败!');
                            };
                            console.log(inserted);
                            var params= {items:$.toJSON(inserted),relationid:isblh_select};
                            ajaxfrom.ajaxsend('post','json','maintain/addcheckingitemsbyrid',params,success,null,errorfunc)

                        });
                }

                if(updated.length>0){
                    require(['js/commonfuncs/AjaxForm.js']
                        ,function(ajaxfrom){

                            var success=function(){
                                $.messager.alert('操作成功','成功!');
                                $('#checkingitems').datagrid('acceptChanges');
                                editIndex=undefined;
                                $('#checkingitems').datagrid('reload');
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
                                $('#checkingitems').datagrid('acceptChanges');
                                editIndex=undefined;
                                $('#checkingitems').datagrid('reload');
                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','失败!');
                            };
                            var params= {packages:$.toJSON(deleted)};
                            ajaxfrom.ajaxsend('post','json','maintain/delcheckingitems',params,success,null,errorfunc);

                        });

                }


                //console.log(inserted);
                //console.log(deleted);
                //console.log(updated);


            }
        }
        var reject =function (){
            $('#checkingitems').datagrid('rejectChanges');
            editIndex = undefined;
        }
        function getChanges(){
            var rows = $('#checkingitems').datagrid('getChanges');
            alert(rows.length+' rows are changed!');
        }



        $('#altercheckingitempanel .tabletoolbar').find('.del').click(removeit);
        $('#altercheckingitempanel .tabletoolbar').find('.save').click(accept);
        $('#altercheckingitempanel .tabletoolbar').find('.undo').click(reject);

      var isblh_select=false;  

      $('#altercheckingitempanel .itemtree').tree({
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
                if(isblh_select&&$(this).tree('isLeaf',node.target)){

                    if(!isexsits(node,$('#checkingitems').datagrid('getRows'))){
                        var rowdata={
                            deptname:$(this).tree('getParent',node.target).value,
                            itemcode:node.nodeid,
                            itemname:node.value,
                            status:node.finish

                        }

                       $('#checkingitems').datagrid('appendRow',rowdata) ;
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


        $('#checkingitems').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            toolbar:'#altercheckingitempanel .tabletoolbar',
            method:'post',
            url:'maintain/getregistedcheckitems',
            remoteSort: false,
            //fitColumns:true,
            fit:true,
            //toolbar:'#enumpaneltb',
            pagination:false,
            pageSize:300,
            onBeforeLoad: function (params) {
                var options = $('#checkingitems').datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:function(index, rowData){

            }

        });

        var blhselect=function(record){
            $('#altercheckingration').form('load',record);
            $('#checkingitems').datagrid('load',{relationid:record.relationid});
            isblh_select=record.relationid;
        };
        var myloader = function(param,success,error){
            var q = param.q || '';
            if (q.length < 1){return false}

            require(['js/commonfuncs/AjaxForm.js']
                ,function(ajaxfrom){
                    var params={
                        keyword: q,
                        time:$('#checkingday').datebox('getValue'),
                        start:0,
                        limit:20,
                        isunit:0,
                        isinto:$.toJSON([1]),
                        totalname: "total",
                        rowsname : "rows"
                };
                    var succ=function(data){
                        success(data.rows);
                    };
                    var errorfunc=function(){
                        error.apply(this, arguments);
                    };

                    ajaxfrom.ajaxsend('post','json','maintain/getregistedperson',params,succ,null,errorfunc,true);

                });

        }
        var date=new Date();
        $('#checkingday').datebox('setValue', date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate());

        $('#checkingpationblhno').combobox({
            required:true,
            hasDownArrow:false,
            loader: myloader,
            onSelect:blhselect,
            mode: 'remote',
            valueField: 'blh_no',
            textField: 'blh_no'

        });


        $('#checkitemmenu .selectpackage').click(function(e){
            if($('#packagechoosewin').length>0){
                $('#packagechoosewin').dialog('open');
            }else{
                require(['text!views/packagechoose.htm','views/packagechoose'],
                    function(div,packagechoosewin){
                        $('body').append(div);
                        $.parser.parse('#packagechoosewin');
                        packagechoosewin.render();
                    });
            }
        });


    }

    return {
        render: render

    };
});