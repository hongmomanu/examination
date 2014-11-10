define(function () {

    function render(parameters) {
        $('#grouppackagechoosewin').dialog({
            title: '套餐选择窗口',
            width: '100%',
            height: '100%',
            //resizable:true,
            //fit:true,
            closed: false,
            draggable:false,
            /*onResize:function(){
                $(this).dialog('center');
            },*/
            cache: false,
            buttons:[{
                text:'确定',
                id:'confirmselectitems',
                disabled:false,
                handler:function(){

                    require(['js/commonfuncs/AjaxForm.js']
                        ,function(ajaxfrom){
                            var params={relationid:$('#groupsregistedperson').datagrid('getSelected').relationid};
                            var items=$('#grouppackagechoosepanelselecteditems').datagrid('getRows');
                            if(items.length>0){
                                var members=[];
                                $.each(items,function(index,item){
                                    var obj={
                                        itemcode:item.itemcode,
                                        relationid:params.relationid,
                                        packagecode:(item.packageid?item.packageid:item.packagecode)
                                    };
                                    members.push(obj);
                                });
                                var success=function(data){
                                    $('#grouppackagechoosewin').dialog('close');
                                    $('#groupscheckeditems').datagrid('reload');
                                    $('#groupsregistedperson').datagrid('reload');
                                };
                                var errorfunc=function(){

                                    $.messager.alert('操作失败','失败!');
                                }
                                params.items=$.toJSON(members);
                                ajaxfrom.ajaxsend('post','json','maintain/addcheckitemsbyrid',params,success,null,errorfunc)

                            }else{
                                $('#grouppackagechoosewin').dialog('close');
                            }

                        });

                    //alert(1);
                    //$('#checkeditems').datagrid('loadData',$('#grouppackagechoosepanelselecteditems').datagrid('getRows'));

                }
            },{
                text:'取消',
                handler:function(){
                    $('#grouppackagechoosewin').dialog('close');
                }
            }],
            //href: 'get_content.php',
            modal: true
        });


        $('#grouppackagechoosepanel').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            url:'maintain/getpackages',
            remoteSort: false,
            fitColumns:true,
            fit:true,
            //toolbar:'#enumpaneltb',
            pagination:true,
            pageSize:10,
            onBeforeLoad: function (params) {
                var options = $('#grouppackagechoosepanel').datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },

            onClickRow:function(index, rowData){
                require(['js/commonfuncs/AjaxForm.js']
                    ,function(ajaxfrom){
                        var params={id:rowData.id};
                        var success=function(data){
                            $('#grouppackagechoosepanelitems').datagrid('loadData',data);
                        };
                        var errorfunc=function(){
                            $.messager.alert('操作失败','删除用户失败!');
                        }
                        ajaxfrom.ajaxsend('post','json','maintain/getcheckitemsbypid',params,success,null,errorfunc)

                    });

            }

        });

        $('#grouppackagechoosepanelselecteditems').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,

            //fitColumns:true,
            fit:true,
            //toolbar:'#enumpaneltb',
            pagination:false,
            pageSize:10,

            onClickRow:function(index, rowData){

            }

        });
        var rows=$('#groupscheckeditems').datagrid('getRows');

        $('#grouppackagechoosepanelselecteditems').datagrid('loadData',rows);

        var isitemexist=function(rows,data,div){
            var flag=false;
            var index=null;
            for(var i=0;i<rows.length;i++){
                if(data.itemcode==rows[i].itemcode){
                    flag=true;
                    index=div.datagrid('getRowIndex',rows[i]);
                    break;
                }
            }
            return {flag:flag,index:index};

        };
        var addselectitem=function(data){
            data.packagename= $('#grouppackagechoosepanel').datagrid('getSelected').packagename;
            if(!isitemexist($('#grouppackagechoosepanelselecteditems').datagrid('getRows'),data,$('#grouppackagechoosepanelselecteditems')).flag)$('#grouppackagechoosepanelselecteditems').datagrid('appendRow',data);
        };
        var delselectitem=function(data){
            var isexist=isitemexist($('#grouppackagechoosepanelselecteditems').datagrid('getRows'),data,$('#grouppackagechoosepanelselecteditems'));
            var flag=isexist.flag;
            var index=isexist.index;
            if(flag)$('#grouppackagechoosepanelselecteditems').datagrid('deleteRow',index);
        };
        $('#grouppackagechoosepanelitems').datagrid({
            singleSelect: false,
            collapsible: true,
            rownumbers: true,
            onSelectAll:function(rows){
                $.each(rows,function(index,item){
                    addselectitem(item);
                });
            },
            onUnselectAll:function(rows){

                $.each(rows,function(index,item){
                    delselectitem(item);
                });
            },
            onSelect:function(rowIndex, rowData){
                addselectitem(rowData);
            },
            onUnselect:function(rowIndex, rowData){
                delselectitem(rowData);
            },

            onLoadSuccess:function(data){
                var selected=$('#grouppackagechoosepanelselecteditems').datagrid('getRows');
                var rows=$('#grouppackagechoosepanelitems').datagrid('getRows');
                $.each(selected,function(index,item)
                    {
                        var isexist=isitemexist(rows,item,$('#grouppackagechoosepanelitems'));
                        //console.log(isexist);
                        if(isexist.flag)$('#grouppackagechoosepanelitems').datagrid('selectRow',isexist.index);
                    }
                )


            },

            //fitColumns:true,
            fit:true,
            //toolbar:'#enumpaneltb',
            pagination:false,
            pageSize:10,

            onClickRow:function(index, rowData){

            }

        });


    }

    return {
        render: render

    };
});