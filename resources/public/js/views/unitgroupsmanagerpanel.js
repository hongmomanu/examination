define(function () {




    function render(parameters) {
        var combox=$('#unitgroupsmanagertable .lazy-combobox');
        combox.combobox({
            onShowPanel: function () {
                var searchtype = $(this).attr('searchtype');
                var url = 'auth/getenumbytype?type='+searchtype;
                $(this).combobox('reload', url);
            }

        });


        $('#unitgroupsmanagerpanel').tree({
            method: 'post',
            url: 'maintain/getunitgroup',
            treeField: 'text',
            idField: 'id',
            onBeforeLoad: function (row, params) {

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
                if(node.id>0){
                    var pid=$('#unitgroupsmanagerpanel').tree('getParent',node.target).id;
                    $('#unitgroupsmanagerlayout').layout('expand','east');
                    if(pid>0){
                        $('#unitgroupform').form('load',node);
                        $('#unitgroupsitemmanagebtns .del').show();
                        $('#unitgroupsitemmanagebtns .save').show();
                        $('#unitgroupcheckitemtree').show();
                        $('#unitgroupcheckitemtree').tree('reload');
                        $('#unitgroupsitemmanagebtns .new').hide();
                    }else{
                        $('#unitgroupform').form('reset');
                        $('#unitgroupcheckitemtree').hide();
                        $('#unitgroupsitemmanagebtns .save').hide();
                        $('#unitgroupsitemmanagebtns .del').hide();
                        $('#unitgroupsitemmanagebtns .new').show();
                    }

                }else{
                    $('#unitgroupsmanagerlayout').layout('collapse','east');
                }

            }
        });


        $('#unitgroupsitemmanagebtns .new').click(function(){
            if(!$('#unitgroupform').form('validate')){
                return;
            }

            $.messager.confirm('确定要新增分组么?', '你正在试图新增分组', function(r){
                if (r){
                    require(['jqueryplugin/easyui-form','js/commonfuncs/AjaxForm.js']
                        ,function(easyform,ajaxfrom){

                            var params=$('#unitgroupform').form("serialize");
                            var success=function(){
                                $.messager.alert('操作成功','配置成功!');
                                $('#unitgroupsmanagerpanel').tree('reload',
                                    $('#unitgroupsmanagerpanel').tree('getSelected').target);
                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','配置失败!');
                            };
                            params.unitid= $('#unitgroupsmanagerpanel').tree('getSelected').id;
                            ajaxfrom.ajaxsend('post','json','maintain/addunitgroup',params,success,null,errorfunc);

                        })
                }
            });


        });


        $('#unitgroupsitemmanagebtns .save').click(function(){
            if(!$('#unitgroupform').form('validate')){
                return;
            }

            $.messager.confirm('确定要修改分组么?', '你正在试图修改分组?', function(r){
                if (r){
                    require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                        ,function(easyform,ajaxfrom){
                            var params=$('#unitgroupform').form("serialize");
                            var success=function(){
                                $.messager.alert('操作成功','修改成功!');
                                $('#unitgroupsmanagerpanel').tree('reload',
                                    $('#unitgroupsmanagerpanel').tree('getParent',
                                    $('#unitgroupsmanagerpanel').tree('getSelected').target).target);
                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','修改失败!');
                            };

                            var itemid_arr=[];
                            var delete_arr=[];
                            $.each($('#unitgroupcheckitemtree').tree('getChecked'),function(index,item){
                                itemid_arr.push(item.nodeid);
                            });
                            $.each($('#unitgroupcheckitemtree').tree('getChecked','unchecked'),function(index,item){
                                delete_arr.push(item.nodeid);
                            });

                            params.deleteid=$.toJSON(delete_arr);
                            params.itemid=$.toJSON(itemid_arr);

                            ajaxfrom.ajaxsend('post','json','maintain/editunitgroup',params,success,null,errorfunc);

                        })
                }
            });


        });

        $('#unitgroupcheckitemtree').tree({
            //rownumbers: true,
            checkbox:true,
            onlyLeafCheck:true,
            method: 'post',
            url: 'maintain/gettreeitem',
            treeField: 'text',
            idField: 'id',
            onBeforeLoad: function (row, params) {

                var select=$('#unitgroupsmanagerpanel').tree('getSelected');
                //params.packageid=select?select.id:null;
                if(select){
                    params.groupid=select.id;
                    params.unitid=select.unitid;
                }
                if (!row)params.node = -1;
                else {
                    var parent =$('#unitgroupcheckitemtree').tree('getParent',row.target);
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



        $('#unitgroupsitemmanagebtns .del').click(function(){


            $.messager.confirm('确定要删除分组么?', '你正在试图删除分组', function(r){
                if (r){
                    require(['jqueryplugin/easyui-form','js/commonfuncs/AjaxForm.js']
                        ,function(easyform,ajaxfrom){
                            var params=$('#unitgroupform').form("serialize");

                            var success=function(){
                                $.messager.alert('删除成功','删除成功!');
                                $('#unitgroupsmanagerpanel').tree('reload',
                                    $('#unitgroupsmanagerpanel').tree('getParent',
                                    $('#unitgroupsmanagerpanel').tree('getSelected').target).target);
                            };
                            var errorfunc=function(){
                                $.messager.alert('删除失败','删除失败!');
                            };
                            //params.unitid= $('#unitgroupsmanagerpanel').tree('getSelected').id;
                            ajaxfrom.ajaxsend('post','json','maintain/delunitgroup',params,success,null,errorfunc);

                        })
                }
            });


        });



    }

    return {
        render: render

    };
});