define(function () {

    function render(parameters) {
        $('#edituserpasswin').dialog({
            title: '修改密码窗口',
            width: 300,
            height: 180,
            closed: false,
            cache: false,
            buttons:[{
                text:'保存',
                id:'savenewpasswordbtn',
                handler:function(){
                   //alert(1);
                    require(['jqueryplugin/easyui-form','commonfuncs/AjaxForm']
                        ,function(easyform,ajaxfrom){


                            var params=$('#edituserpasswin form').form("serialize");

                            var success=function(res){
                                if(res.success){
                                    $.messager.alert('操作成功','修改密码成功!');
                                    $('#edituserpasswin').dialog('close');
                                }else{
                                    $.messager.alert('操作失败','原始密码错误!');
                                }

                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','原始密码错误!');
                            }
                            ajaxfrom.ajaxsend('post','json','update-profile',params,success,null,errorfunc)

                        });

                }
            },{
                text:'取消',
                handler:function(){
                    $('#edituserpasswin').dialog('close');
                }
            }],
            //href: 'get_content.php',
            modal: true
        });


    }

    return {
        render: render

    };
});