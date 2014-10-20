define(function () {




    function render(parameters) {
        var combox=$('#controlmanagertable .lazy-combobox');
        combox.combobox({
            onShowPanel: function () {
                var searchtype = $(this).attr('searchtype');
                var url = 'auth/getenumbytype?type='+searchtype;
                $(this).combobox('reload', url);
            }

        });


        $('#controlmanagerpanel').tree({
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

             var parent=$(this).tree('getParent',node.target);
             if(!parent){
                 e.preventDefault();
                 $(this).tree('select',node.target);
                 $('#controlmenu').menu('show',{
                     left: e.pageX,
                     top: e.pageY
                 })
             }
             ;
             },
            onLoadSuccess: function (row, data) {

            },
            onClick: function (node) {
                if(node.id>0){
                    var pid=$('#controlmanagerpanel').tree('getParent',node.target)

                    if(pid){
                        $('#controlmanagerlayout').layout('expand','east');
                        $('#controlitemform').form('load',node);

                    }else{
                        $('#controlmanagerlayout').layout('collapse','east');
                    }

                }else{
                    $('#controlmanagerlayout').layout('collapse','east');
                }

            }
        });



        $('#controlitemmanagebtns .save').click(function(){
            if(!$('#controlitemform').form('validate')){
                return;
            }

            $.messager.confirm('确定要修改么?', '你正在试图修改?', function(r){
                if (r){
                    require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                        ,function(easyform,ajaxfrom){
                            var params=$('#controlitemform').form("serialize");
                            var success=function(){
                                $.messager.alert('操作成功','修改成功!');
                                $('#controlmanagerpanel').tree('reload',
                                    $('#controlmanagerpanel').tree('getParent',
                                    $('#controlmanagerpanel').tree('getSelected').target).target);
                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','修改失败!');
                            };



                            ajaxfrom.ajaxsend('post','json','maintain/editcontrolitem',params,success,null,errorfunc);

                        })
                }
            });


        });


        $('#controlmenu .add').click(function(){
            if($('#newcontrolitemwin').length>0){
                $('#newcontrolitemwin').dialog('open');
            }else{
                require(['text!views/newcontrolitemwin.htm','views/newcontrolitemwin'],
                    function(div,newcontroljs){
                        $('body').append(div);
                        newcontroljs.render();
                    });
            }


        });


        $('#controlitemmanagebtns .del').click(function(){


            $.messager.confirm('确定要删除分组么?', '你正在试图删除分组', function(r){
                if (r){
                    require(['jqueryplugin/easyui-form','js/commonfuncs/AjaxForm.js']
                        ,function(easyform,ajaxfrom){
                            var params=$('#controlitemform').form("serialize");

                            var success=function(){
                                $.messager.alert('删除成功','删除成功!');
                                $('#controlmanagerpanel').tree('reload',
                                    $('#controlmanagerpanel').tree('getParent',
                                    $('#controlmanagerpanel').tree('getSelected').target).target);
                            };
                            var errorfunc=function(){
                                $.messager.alert('删除失败','删除失败!');
                            };
                            //params.unitid= $('#controlmanagerpanel').tree('getSelected').id;
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