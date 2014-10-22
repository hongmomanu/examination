define(function () {

    function render(parameters) {
        $('#packagechoosewin').dialog({
            title: '套餐选择窗口',
            width: '100%',
            height: '100%',
            closed: false,
            draggable:false,
            cache: false,
            buttons:[{
                text:'确定',
                id:'confirmselectitems',
                disabled:false,
                handler:function(){
                    //alert(1);

                }
            },{
                text:'取消',
                handler:function(){
                    $('#packagechoosewin').dialog('close');
                }
            }],
            //href: 'get_content.php',
            modal: true
        });


        $('#packagechoosepanel').datagrid({
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
                var options = $('#packagechoosepanel').datagrid('options');
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
                            $('#packagechoosepanelitems').datagrid('loadData',data);
                        };
                        var errorfunc=function(){
                            $.messager.alert('操作失败','删除用户失败!');
                        }
                        ajaxfrom.ajaxsend('post','json','maintain/getcheckitemsbypid',params,success,null,errorfunc)

                    });

            }

        });

        $('#packagechoosepanelselecteditems').datagrid({
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

        var isitemexist=function(data){
            console.log(data);
             var rows=$('#packagechoosepanelselecteditems').datagrid('getRows');
            console.log(rows);
            var flag=false;
            var index=null;
            for(var i=0;i<rows.length;i++){
                if(data.itemcode==rows[i].itemcode){
                    console.log("wwwww");
                    flag=true;
                    index=$('#packagechoosepanelselecteditems').datagrid('getRowIndex',rows[i]);
                    break;
                }
            }
            return {flag:flag,index:index};

        };
        var addselectitem=function(data){
            data.packagename= $('#packagechoosepanel').datagrid('getSelected').packagename;
            if(!isitemexist(data).flag)$('#packagechoosepanelselecteditems').datagrid('appendRow',data);
        };
        var delselectitem=function(data){
            var flag=isitemexist(data).flag;
            var index=isitemexist(data).index;
            if(flag)$('#packagechoosepanelselecteditems').datagrid('deleteRow',index);
        };
        $('#packagechoosepanelitems').datagrid({
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