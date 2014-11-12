define(function () {

    function render(parameters) {
        $('#newunitwin').dialog({
            title: '新增单位窗口',
            width: 480,
            height: 330,
            closed: false,
            cache: false,
            buttons:[{
                text:'保存',
                id:'savenewunitbtn',
                disabled:false,
                handler:function(){
                   //alert(1);
                    var form=$('#newunitwin form');
                    if(form.form('validate')){
                        require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                            ,function(easyform,ajaxfrom){


                                var params=$('#newunitwin form').form("serialize");
                                params.iscommon=false;
                                var success=function(){
                                    $.messager.alert('操作成功','新增单位成功!');
                                    $('#newunitwin').dialog('close');
                                    $('#unitmanagerpanel').datagrid('reload');
                                };
                                var errorfunc=function(){
                                    $.messager.alert('操作失败','新增单位失败!');
                                }
                                ajaxfrom.ajaxsend('post','json','maintain/addnewunit',params,success,null,errorfunc)

                            });
                    }


                }
            },{
                text:'取消',
                handler:function(){
                    $('#newunitwin').dialog('close');
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
        var divitiontree=$('#newunitwin .easyui-combotree');
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


        var combox=$('#newunitwin .lazy-combobox');
        combox.combobox({
            onBeforeLoad:function(param){
                var searchtype = $(this).attr('searchtype');
                param.type=searchtype;
            },
            onShowPanel: function () {
             //var searchtype = $(this).attr('searchtype');
             var url = 'auth/getenumbytype';
             $(this).combobox('reload', url);
            }

        });


        $.parser.parse($('#newunitwin'));

        /**$('#newunitwin input').on('change  keyup paste',function(){
            var form=$('#newunitwin form');
            if(form.form('enableValidation').form('validate')){
                $('#savenewunitbtn').linkbutton('enable');
            }
            else{
                $('#savenewunitbtn').linkbutton('disable');
            }
        });

        $('#newunitwin .easyui-combobox,#newunitwin .easyui-combotree').combobox({
            onHidePanel:function(){
                var form=$('#newunitwin form');
                if(form.form('validate')){
                    $('#savenewunitbtn').linkbutton('enable');
                }else{
                    $('#savenewunitbtn').linkbutton('disable');
                }
            }
        }) **/

    }

    return {
        render: render

    };
});