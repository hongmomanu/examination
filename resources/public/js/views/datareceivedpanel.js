define(function () {


    function render(parameters) {

        require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
            ,function(easyuiform,ajaxform){

                $('#datareceivedpanel .easyui-tabs').tabs().tabs({

                    onSelect:function(title,index){
                        if(index==2){
                            var content_div=$('#datareceivedpanel .reportlist');
                            content_div.html('');
                            //var params=$('#doctorcheckpanel .pationinfoform').form("serialize");

                            content_div.append('<table  class="controltable"></table>');
                            content_div.append('<table  class="reporttable"></table>');
                            var controltable=content_div.find('.controltable');
                            var head_line='<tr><td height="70px;" colspan="4"   style="text-align: center;font-size: 20px;" class="smallerline"><b>绍兴市人民医院体检报告</b></td>'+
                                '</tr>';
                            controltable.append(head_line);

                            if(isblh_select){
                                var sex_name_line='<tr>' +
                                    '<td width="15%" height="40px" style="text-align: right;font-size: 16px;vertical-align:bottom;" ><a style="color: blue">姓名:</a></td>'
                                    +'<td width="35%" style="text-align: left;font-size: 16px;vertical-align:bottom;" >'+isblh_select.name+'</td>' +
                                    '<td width="15%" style="text-align: right;font-size: 16px;vertical-align:bottom;" ><a style="color: blue">性别:</a></td>'
                                    +'<td width="35%" style="text-align: left;font-size: 16px;vertical-align:bottom;">'+isblh_select.sex+'</td>'+
                                    '</tr>';
                                controltable.append(sex_name_line);
                                var blh_line='<tr>' +
                                    '<td width="15%" height="40px" style="text-align: right;font-size: 16px;" ><a style="color: blue">病人卡号:</a></td>'
                                    +'<td colspan="3" style="text-align: left;font-size: 16px;" >'+isblh_select.blh_no+'</td>' +
                                    '</tr>';
                                controltable.append(blh_line);
                                var result_line='<tr>' +
                                    '<td width="15%" height="120px" style="text-align: right;font-size: 16px;vertical-align:top;" ><a style="color: blue">检查结果:</a></td>'
                                    +'<td colspan="3" style="text-align: left;font-size: 16px;vertical-align:top;" >'+
                                    $('#datareceivedpanel form').form("serialize").result+'</td>' +
                                    '</tr>';
                                controltable.append(result_line);
                                var healthhelp_line='<tr>' +
                                    '<td width="15%" height="120px" style="text-align: right;font-size: 16px;vertical-align:top;" ><a style="color: blue">健康指南:</a></td>'
                                    +'<td colspan="3" style="text-align: left;font-size: 16px;vertical-align:top;" >'+
                                    $('#datareceivedpanel form').form("serialize").suggestion+'</td>' +
                                    '</tr>';
                                controltable.append(healthhelp_line);

                                makedetailreport();

                            }


                            //contenttable.append('<tr><td colspan="3" height="3"><hr style="border-bottom:5px solid #000000;margin: 0 0 0 0;"/></td></tr>');

                            //contenttable.append(dept_line);


                        }
                    }
                });

                var makedetailreport=function(){

                    var params={
                        relationid:isblh_select.relationid
                    };
                    var succ=function(data){

                        var items={};
                        for(var i=0;i<data.length;i++){
                            if(items[data[i].deptname]){
                                if(items[data[i].deptname].data[data[i].itemname]){
                                    items[data[i].deptname].data[data[i].itemname].push(data[i]);
                                }else{
                                    items[data[i].deptname].data[data[i].itemname]=[];
                                    items[data[i].deptname].data[data[i].itemname].push(data[i]);
                                }
                            }else{

                                items[data[i].deptname]={id:data[i].deptid,data:{}};
                                items[data[i].deptname].data[data[i].itemname]=[data[i]];
                            }
                        }
                        var content_div=$('#datareceivedpanel .reportlist');
                        var contenttable=content_div.find('.reporttable');
                        for(var deptitem in items){
                            var dept_line='<tr><td colspan="5" class="smallerline"><b>'
                                +deptitem+
                                '</b></td>'+
                                '</tr>';
                            contenttable.append(dept_line);
                            var head_line='<tr ><td width="20%" class="biggerline">'
                                +"项目名称"+
                                '</td><td width="20%" class="biggerline">检查结果</td>' +
                                '<td width="20%" class="biggerline">单位</td>'+
                                '<td width="20%" class="biggerline">参考范围</td>' +
                                '<td width="20%" class="biggerline">提示</td>'+
                                '</tr>';
                            contenttable.append(head_line);

                            var checkitems=items[deptitem].data;


                            var params={
                                start:0,
                                limit:200,
                                deptid:items[deptitem].id,
                                relationid:isblh_select.relationid,
                                totalname: "total",
                                rowsname : "rows"
                            };
                            var succ=function(data){
                                console.log(data);
                            };
                            var errorfunc=function(){

                            };

                            ajaxform.ajaxsend('post','json','maintain/getdeptconclusionbyrid',params,succ,null,errorfunc,true);



                            console.log(checkitems);
                            for(var checkitem in checkitems){
                                //console.log(items[item]);

                                if(checkitems[checkitem].length>0){
                                    var checkdate= checkitems[checkitem][0].DATETIME.split(" ")[0];
                                    var item_line='<tr><td width="20%">'
                                        +checkitem+
                                        '<td width="20%" colspan="2">检查日期&nbsp;&nbsp;'+(checkdate?checkdate:"未检查")+'</td>'+
                                        '<td width="20%" colspan="2">检查医生&nbsp;&nbsp;'
                                        +(checkitems[checkitem][0].displayname?checkitems[checkitem][0].displayname:"未检查")+'</td>'+
                                        '</tr>';
                                    contenttable.append(item_line);

                                    for(var i=0;i<checkitems[checkitem].length;i++){
                                        var itemdetail_line='<tr><td width="20%">'
                                            +checkitems[checkitem][i].detailname+
                                            '<td width="20%" >'+(checkitems[checkitem][i].result?checkitems[checkitem][i].result:"未检查")+'</td>'+
                                            '<td width="20%" >'+checkitems[checkitem][i].unit+'</td>'+
                                            '<td width="20%" >'+(checkitems[checkitem][i].downlimit
                                            +"~"+checkitems[checkitem][i].uplimit)+'</td>'+
                                            '<td width="20%" >'+(checkitems[checkitem][i].result_mess?checkitems[checkitem][i].result_mess:"未检查")
                                            +'</td>'+
                                        '</tr>';
                                        contenttable.append(itemdetail_line);

                                    }


                                }


                            }

                            var conclusion_line='<tr ><td colspan="5"><b>'
                                +"小结"+
                                '</b></td>'+
                                '</tr>';
                            contenttable.append(conclusion_line);





                        }




                        //console.log(items);

                    };
                    var errorfunc=function(){
                        //error.apply(this, arguments);
                        $.messager.alert('操作失败','获取服务失败');
                    };

                    ajaxform.ajaxsend('post','json','maintain/getdetaireportbyrid',params,succ,null,errorfunc,true);

                };


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
                    isblh_select=record;
                    getcontolmsgbyrid(isblh_select.relationid);
                };
                var myloader = function(param,success,error){
                    var q = param.q || '';
                    if (q.length < 1){return false}

                        var params={
                            keyword: q,
                            date:$('#datareceivedpanel .checkingday').datebox('getValue'),
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

                        ajaxform.ajaxsend('post','json','maintain/getregistedperson',params,succ,null,errorfunc,true);


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

                var getcontolmsgbyrid=function(relationid){

                    var params={
                        relationid:relationid
                    };
                    var succ=function(data){
                        if(data.length>0){
                            $('#datareceivedpanel form').form('load',data[0]);
                        }
                    };
                    var errorfunc=function(){

                    };

                    ajaxform.ajaxsend('post','json','maintain/getcontolmsgbyrid',params,succ,null,errorfunc,true);



                };

                $('#datareceivedpanel .printlnbtns').find('.print').click(function(){
                    if(isblh_select){
                        $("#datareceivedpanel .controltable,#datareceivedpanel .reporttable").printThis()
                    }else{
                        $.messager.alert('提示','未选择体检人员!');
                    }

                });

                $('#datareceivedpanel .savebtns').find('.save').click(function(){

                    var formdata=$('#datareceivedpanel form').form("serialize");
                    var params=formdata;
                    params.relationid=isblh_select.relationid;
                    var succ=function(data){
                        $.messager.alert('操作成功','保存成功!');
                    };
                    var errorfunc=function(){
                        $.messager.alert('操作失败','保存失败!');
                    };

                    ajaxform.ajaxsend('post','json','maintain/savecontolmsgbyrid',params,succ,null,errorfunc,true);


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

                                }
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

        });




    }

    return {
        render: render

    };
});