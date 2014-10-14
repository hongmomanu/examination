define(function () {

    function render(parameters) {
        $('#newdeptwin').dialog({
            title: '新增科室窗口',
            width: 300,
            height: 250,
            closed: false,
            cache: false,
            buttons:[{
                text:'保存',
                id:'savenewdeptbtn',
                disabled:true,
                handler:function(){
                   //alert(1);
                    require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                        ,function(easyform,ajaxfrom){


                            var params=$('#newdeptwin form').form("serialize");
                            params.iscommon=false;
                            var success=function(){
                                $.messager.alert('操作成功','新增科室成功!');
                                $('#newdeptwin').dialog('close');
                                $('#deptmanagerpanel').datagrid('reload');
                            };
                            var errorfunc=function(){
                                $.messager.alert('操作失败','新增科室失败!');
                            }
                            ajaxfrom.ajaxsend('post','json','auth/addnewdept',params,success,null,errorfunc)

                        });

                }
            },{
                text:'取消',
                handler:function(){
                    $('#newdeptwin').dialog('close');
                }
            }],
            //href: 'get_content.php',
            modal: true
        });

        $.extend($.fn.validatebox.defaults.rules, {
            equals: {
                validator: function(value,param){
                    return value == $(param[0]).val();
                },
                message: '密码不一致！'
            }
        });
        var divitiontree=$('#newdeptwin .easyui-combotree');
        divitiontree.combotree({
            url:'auth/gettreedivision?node=-1',
            method: 'get',
            textField:'textold',
            onLoadSuccess:function(){
                /*if(!this.firstloaded){
                    //alert(1);
                    console.log(divitiontree.combotree('find',-1))
                    //divitiontree.combotree('setValue', divisionpath);
                    //this.firstloaded=true;
                }*/
            },
            onBeforeExpand: function (node) {
                divitiontree.combotree("tree").tree("options").url
                    = "auth/gettreedivision?onlychild=true&node=" + node.id;
            },
            onHidePanel: function () {
               /* divitiontree.combotree('setValue',
                    divitiontree.combotree('tree').tree('getSelected').divisionpath);*/
            }
        });


        $('#newdeptwin .lazy-combobox').combobox({
            onShowPanel: function () {
                var url = 'auth/getroles?start=0&limit=100' ;
                $(this).combobox('reload', url);
            }

        });


        $.parser.parse($('#newdeptwin'));

        $('#newdeptwin input').on('change',function(){
            var form=$('#newdeptwin form');
            if(form.form('validate')){
                $('#savenewdeptbtn').linkbutton('enable');
            }
            else{
                $('#savenewdeptbtn').linkbutton('disable');
            }
        });

        $('#newdeptwin .easyui-combobox,#newdeptwin .easyui-combotree').combobox({
            onHidePanel:function(){
                var form=$('#newdeptwin form');
                if(form.form('validate')){
                    $('#savenewdeptbtn').linkbutton('enable');
                }else{
                    $('#savenewdeptbtn').linkbutton('disable');
                }
            }
        })

    }

    return {
        render: render

    };
});