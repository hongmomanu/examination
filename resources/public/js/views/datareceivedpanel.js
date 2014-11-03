define(function () {

    function render(parameters) {
        $('#datareceivedpanel .checkingday').datebox('setValue', $.format.date(new Date(), "yyyy-MM-dd"));

        $('#datareceivedpanel .itemdetailtable').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            fitColumns:true,
            url:'maintain/getitemdetaibydeptid',
            remoteSort: false,
            fit:true,
            pagination:false,
            pageSize:1000,
            onBeforeLoad: function (params) {
                var options = $(this).datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";

                //if(!params.deptid){
                    /*var relationid=$('#doctorcheckpanel .pationinfoform').form("serialize").relationid;
                    var deptid=$('#doctorcheckpanel .depttable').datagrid('getSelected').id;
                    var data=$('#doctorcheckpanel .checkingitems').datagrid('getRows');
                    var deptids=[];
                    for(var i=0;i<data.length;i++){
                        if(data[i].deptid==deptid)deptids.push(data[i].itemcode);
                    }*/
                    //params.deptid=deptid;
                    //params.relationid=relationid;
                    //params.itemcodes= $.toJSON(deptids);

                //}
            },
            onClickRow:function(index){
                //onClickRow(index,$('#checkpationwithitemwin .itemdetailtable'));
            }

        });


        var isblh_select=false;
        var blhselect=function(record){
            //console.log(record);
            $('#datareceivedpanel .username').text(record.name);
            $('#datareceivedpanel .sex').text(record.sex);
            $('#datareceivedpanel .unitname').text(record.unitname);
            $('#datareceivedpanel .age').text((new Date()).getFullYear()- Date.parse(record.birthday).getFullYear()+1);
            $('#datareceivedpanel .checkingitems').datagrid('load',{relationid:record.relationid});
            /*$('#altercheckingitempanel .altercheckingration').form('load',record);
            $('#altercheckingitempanel .checkingitems').datagrid('load',{relationid:record.relationid});*/
            isblh_select=true;
        };
        var myloader = function(param,success,error){
            var q = param.q || '';
            if (q.length < 1){return false}

            require(['js/commonfuncs/AjaxForm.js']
                ,function(ajaxfrom){
                    var params={
                        keyword: q,
                        time:$('#datareceivedpanel .checkingday').datebox('getValue'),
                        start:0,
                        limit:20,
                        isunit:$.toJSON([0,1]),
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

        $('#datareceivedpanel .checkingpationblhno').combobox({
            required:true,
            hasDownArrow:false,
            loader: myloader,
            onSelect:blhselect,
            mode: 'remote',
            valueField: 'blh_no',
            textField: 'blh_no'

        });

        $('#datareceivedpanel .controlmanagerpanel').tree({
            method: 'post',
            url: 'maintain/getcontroltree',
            treeField: 'text',
            idField: 'id',
            onBeforeLoad: function (row, params) {

                if (!row)params.node = -1;
                else {
                    params.node=params.id;
                    params.value=row.value;
                    /*params.node = row.nodeid;
                     params.pid=parent.id;*/
                }

            },
            onContextMenu: function(e,node){


            },
            onLoadSuccess: function (row, data) {

            },
            onClick: function (node) {
                if(isblh_select){
                    if(node.id>0){
                        var pid=$('#datareceivedpanel .controlmanagerpanel').tree('getParent',node.target)

                        if(pid){
                            var type=node.type;
                            var textitem=null;
                            var text="";
                            if(type==="结果"){
                                textitem=$('#datareceivedpanel .result');
                            }else if(type==="建议"){
                                textitem=$('#datareceivedpanel .healthhelp');
                            }else if(type==="其它"){
                                textitem=$('#datareceivedpanel .other');
                            }
                            text=textitem.textbox('getValue');
                            textitem.textbox('setValue',
                                    text+node.content+"\n");

                        }else{
                            //$('#controlmanagerlayout').layout('collapse','east');
                        }

                    }else{
                        //$('#controlmanagerlayout').layout('collapse','east');
                    }
                }


            }
        });



        $('#datareceivedpanel .checkingitems').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            url:'maintain/getregistedcheckitems',
            remoteSort: false,
            //fitColumns:true,
            fit:true,
            //toolbar:'#enumpaneltb',
            pagination:false,
            pageSize:300,
            onBeforeLoad: function (params) {
                var options = $(this).datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:function(index, rowData){

                $('#datareceivedpanel .itemdetailtable').datagrid('load',
                    {
                        relationid:rowData.relationid,
                        deptid:rowData.deptid,
                        itemcodes:$.toJSON([rowData.itemcode])
                    })
            }

        });

    }

    return {
        render: render

    };
});