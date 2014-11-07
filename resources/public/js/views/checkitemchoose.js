define(function () {

    function render(parameters) {


        $('#checkitemchoosewin').dialog({
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
                //id:'confirmselectitems',
                disabled:false,
                handler:function(){

                    require(['js/commonfuncs/AjaxForm.js']
                        ,function(ajaxfrom){
                            var params={relationid:$('#registedperson').datagrid('getSelected').relationid};
                            var items=$('#checkitemchoosewin .checkitemchoosepanelselecteditems').datagrid('getRows');
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
                                    $('#checkitemchoosewin').dialog('close');
                                    $('#checkeditems').datagrid('reload');
                                    $('#registedperson').datagrid('reload');
                                };
                                var errorfunc=function(){

                                    $.messager.alert('操作失败','失败!');
                                }
                                params.items=$.toJSON(members);
                                ajaxfrom.ajaxsend('post','json','maintain/addcheckitemsbyrid',params,success,null,errorfunc)

                            }else{
                                $('#checkitemchoosewin').dialog('close');
                            }

                        });

                    //alert(1);
                    //$('#checkeditems').datagrid('loadData',$('#packagechoosepanelselecteditems').datagrid('getRows'));

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

        $('#checkitemchoosewin .checkitemchoosepanelselecteditems').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,

            //fitColumns:true,
            fit:true,
            //toolbar:'#enumpaneltb',
            pagination:false,
            pageSize:10,
            onRowContextMenu:function(e, rowIndex, rowData) {
                e.preventDefault();
                $(this).datagrid('selectRow', rowIndex);
                $('#checkitemchoosewincheckitemmenu').menu('show', {
                    left: e.pageX,
                    top: e.pageY
                })
            },
            onClickRow:function(index, rowData){


            }

        });
        $('#checkitemchoosewincheckitemmenu .remove').click(function(){
            var datagrid=$('#checkitemchoosewin .checkitemchoosepanelselecteditems');
            var row=datagrid.datagrid('getSelected');
            var rowindex=datagrid.datagrid('getRowIndex',row);
            datagrid.datagrid('deleteRow',rowindex);

        });
        var rows=$('#checkeditems').datagrid('getRows');

        $('#checkitemchoosewin .checkitemchoosepanelselecteditems').datagrid('loadData',rows);

        $('#checkitemchoosewin .itemtree').tree({
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

                    if(!isexsits(node,$('#checkitemchoosewin .checkitemchoosepanelselecteditems').datagrid('getRows'))){
                        var rowdata={
                            deptname:$(this).tree('getParent',node.target).value,
                            itemcode:node.nodeid,
                            price:node.price,
                            itemname:node.value
                        }

                        $('#checkitemchoosewin .checkitemchoosepanelselecteditems').datagrid('appendRow',rowdata) ;
                    }
                }
            }
        });

        var datagrid=$('#checkitemchoosewin .itemgrid').datagrid();

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
                $('#checkitemchoosewin .checkitemchoosepanelselecteditems').datagrid('appendRow',item) ;
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
            data.packagename= $('#packagechoosepanel').datagrid('getSelected').packagename;
            if(!isitemexist($('#packagechoosepanelselecteditems').datagrid('getRows'),data,$('#packagechoosepanelselecteditems')).flag)$('#packagechoosepanelselecteditems').datagrid('appendRow',data);
        };
        var delselectitem=function(data){
            var isexist=isitemexist($('#packagechoosepanelselecteditems').datagrid('getRows'),data,$('#packagechoosepanelselecteditems'));
            var flag=isexist.flag;
            var index=isexist.index;
            if(flag)$('#packagechoosepanelselecteditems').datagrid('deleteRow',index);
        };



    }

    return {
        render: render

    };
});