define(function () {



    function render(parameters) {



        $('#groupsregistedperson').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            url:'maintain/getregistedperson',
            remoteSort: false,
            rowStyler: function(index,row){
                if (row.isinto == 0){
                    return 'color:#857E7E;font-weight:bold;';
                }else{
                    return 'color:green;font-weight:bold;';
                }
            },
            //fitColumns:true,
            fit:true,
            onRowContextMenu:function(e, rowIndex, rowData){
                e.preventDefault();
                $(this).datagrid('selectRow',rowIndex);
                if(rowData.isinto>0){
                    $('#groupscheckitemmenu .outcheck').show();
                    $('#groupscheckitemmenu .intocheck').hide();
                    $('#groupscheckitemmenu .selectpackage').hide();
                    $('#groupscheckitemmenu .selectitem').hide();
                }else{
                    $('#groupscheckitemmenu .outcheck').hide();
                    if(rowData.itemnums>0){
                        $('#groupscheckitemmenu .intocheck').show();
                    }else{
                        $('#groupscheckitemmenu .intocheck').hide();
                    }
                    $('#groupscheckitemmenu .selectpackage').show();
                    $('#groupscheckitemmenu .selectitem').show();

                }
                $('#groupscheckitemmenu').menu('show',{
                    left: e.pageX,
                    top: e.pageY
                })
            },
            //toolbar:'#enumpaneltb',
            pagination:true,
            pageSize:10,
            onBeforeLoad: function (params) {
                var options = $('#groupsregistedperson').datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.isunit=1;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onSelect:function(index, rowData){
                $('#groupscheckeditems').datagrid('reload');
            }

        });

        $('#groupscheckeditems').datagrid({
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
                var options = $('#groupscheckeditems').datagrid('options');
                var selected=$('#groupsregistedperson').datagrid('getSelected');
                if(selected)params.relationid=selected.relationid;

                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:function(index, rowData){

            }

        });

        $('#unitgroupsperson').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            url:'maintain/getunitgroupperson',
            remoteSort: false,
            //fitColumns:true,
            fit:true,
            //toolbar:'#enumpaneltb',
            pagination:true,
            pageSize:10,
            onRowContextMenu:function(e, rowIndex, rowData){
                e.preventDefault();
                $(this).datagrid('selectRow',rowIndex);
                $('#groupspersonmenu').menu('show',{
                    left: e.pageX,
                    top: e.pageY
                })
            },
            onBeforeLoad: function (params) {
                var options = $(this).datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:function(index, rowData){

            }

        });

        var blhselect=function(record){
            $('#groupsregistration').form('load',record);
        };

        var date=new Date();
        $('#groupcheckday').datebox('setValue', date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate());



        $('#unitwithgrouptree').tree({
            method: 'post',
            url: 'maintain/getunitgroup',
            treeField: 'text',
            idField: 'id',
            onBeforeLoad: function (row, params) {
                params.rootname="体检单位";
                if (!row)params.node = -1;
                else {
                    params.node=params.id;
                    /*params.node = row.nodeid;
                     params.pid=parent.id;*/
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

                if($(this).tree("isLeaf",node.target)){
                    var datedown=(new Date()).addYears(-node.downage).toString('yyyy-MM-dd');
                    var dateup=(new Date()).addYears(-node.upage).toString('yyyy-MM-dd');
                    var params={
                        fields:{unitid:node.unitid},
                        downbirth:datedown,
                        upbirth:dateup
                    };
                    if(node.duty!="不限")params.fields.duty=node.duty;
                    if(node.sex!="不限")params.fields.sex=node.sex;
                    if(node.title!="不限")params.fields.title=node.title;
                    if(node.marry!="不限")params.fields.marry=node.marry;
                    params.fields= $.toJSON(params.fields);

                    $('#unitgroupsperson').datagrid('load',params)

                }


            }
        });





        /*$('#pationformtb .add').click(function(e){
            var form=$('#registration') ;
            if(form.form('validate')) {
                require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                    ,function(easyform,ajaxfrom){
                        var params=$('#registration').form("serialize");

                        var succ=function(data){
                            $.messager.alert('操作成功',data.msg);
                            $('#registedperson').datagrid('reload');

                        };
                        var errorfunc=function(){

                        };
                        ajaxfrom.ajaxsend('post','json','maintain/addpation',params,succ,null,errorfunc,true);

                    }
                );

            }

        });
        $('#pationformtb .save').click(function(e){
            require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                ,function(easyform,ajaxfrom){
                    var form=$('#registration');
                    var params=form.form("serialize");
                    if(form.form("validate")&&params.blh_no) {
                        var succ=function(data){
                            $.messager.alert('操作成功',data.msg);
                            $('#registedperson').datagrid('reload');

                        };
                        var errorfunc=function(){

                        };
                        ajaxfrom.ajaxsend('post','json','maintain/savepation',params,succ,null,errorfunc,true);
                        //alert(222);
                    }
                }
            );

        });

        $('#pationformtb .del').click(function(e){
            require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                ,function(easyform,ajaxfrom){
                    var params=$('#registration').form("serialize");
                    if(params.blh_no) {
                        alert(2);
                    }
                }
            );


        });*/




        $('#groupspersonmenu .addpation').click(function(e){

            require(['js/commonfuncs/AjaxForm.js']
                ,function(ajaxfrom){
                    var data=$('#unitgroupsperson').datagrid('getSelected');
                    data.name=data.membername;
                    data.blh_no=data.cardnum;
                    data.isunit=1;
                    data.checkday=$('#groupcheckday').datebox('getValue');
                    data.unitname=($('#unitwithgrouptree').tree('getParent',
                        $('#unitwithgrouptree').tree('getSelected').target)).unitname;
                    data.unitid=$('#unitwithgrouptree').tree('getSelected').unitid;
                    data.groupid=$('#unitwithgrouptree').tree('getSelected').id;
                    /*var params=$('#registration').form("serialize"); */

                    var succ=function(data){
                        $.messager.alert('操作成功',data.msg);
                        $('#groupsregistedperson').datagrid('reload');

                    };
                    var errorfunc=function(){

                    };
                    ajaxfrom.ajaxsend('post','json','maintain/addpation',data,succ,null,errorfunc);


                }
            );

        });

        $('#groupscheckitemmenu .selectpackage').click(function(e){
            if($('#grouppackagechoosewin').length>0){
                $('#grouppackagechoosewin').dialog('open');
            }else{
                require(['text!views/grouppackagechoose.htm','views/grouppackagechoose'],
                    function(div,packagechoosewin){
                        $('body').append(div);
                        $.parser.parse('#grouppackagechoosewin');
                        packagechoosewin.render();
                    });
            }
        });

        $('#groupscheckitemmenu .selectitem').click(function(e){
            alert(2);
        });

        $('#groupscheckitemmenu .intocheck').click(function(e){

            require(['js/commonfuncs/AjaxForm.js']
                ,function(ajaxfrom){
                    var params={relationid:$('#groupsregistedperson').datagrid('getSelected').relationid};
                    var succ=function(data){
                        $.messager.alert('操作成功','已进入体检室');
                        $('#groupsregistedperson').datagrid('reload');
                    };
                    var errorfunc=function(){
                    };

                    ajaxfrom.ajaxsend('post','json','maintain/intocheck',params,succ,null,errorfunc,false);

                });

        });
        $('#groupscheckitemmenu .outcheck').click(function(e){
            require(['js/commonfuncs/AjaxForm.js']
                ,function(ajaxfrom){
                    var params={relationid:$('#groupsregistedperson').datagrid('getSelected').relationid};
                    var succ=function(data){
                        $.messager.alert('操作成功','已从体检室撤销');
                        $('#groupsregistedperson').datagrid('reload');
                    };
                    var errorfunc=function(){
                    };

                    ajaxfrom.ajaxsend('post','json','maintain/outcheck',params,succ,null,errorfunc,false);

                });

        });

    }

    return {
        render: render

    };
});