define(function () {



    function render(parameters) {

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
                    console.log(node);
                    if(!isexsits(node,$('#checkingitems').datagrid('getRows'))){
                        node.deptname=$(this).tree('getParent',node.target).value;
                        node.itemcode=node.nodeid;
                       $('#checkingitems').datagrid('appendRow',{})     
                    }
                }
                


            }
        });


        var isexsits=function(node,rowdata){

            var flag=false;
            for(var i=0;i<rowdata.length;i++){
                if(node.nodeid==rowdata.itemcode){
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
            isblh_select=true;
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