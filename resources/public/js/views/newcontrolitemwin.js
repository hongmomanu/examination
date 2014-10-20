define(function () {

    function render(parameters) {
        $('#newcontrolitemwin').dialog({
            title: '新增项目明细窗口',
            width: 450,
            height: 230,
            closed: false,
            cache: false,
            buttons:[{
                text:'保存',
                id:'savenewcontrolitembtn',
                disabled:false,
                handler:function(){
                   //alert(1);
                    var form=$('#newcontrolitemwin form');
                    if(form.form('validate')){
                        require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                            ,function(easyform,ajaxfrom){

                                var params=$('#newcontrolitemwin form').form("serialize");
                                //params.iscommon=false;
                                params.type=$('#controlmanagerpanel').tree('getSelected').value;
                                var success=function(){
                                    $.messager.alert('操作成功','新增成功!');
                                    $('#newcontrolitemwin').dialog('close');
                                    $('#controlmanagerpanel').tree('reload');//,$('#controlmanagerpanel').tree('getSelected').target
                                };
                                var errorfunc=function(){
                                    $.messager.alert('操作失败','新增失败!');
                                }
                                ajaxfrom.ajaxsend('post','json','maintain/addnewcontrolitem',params,success,null,errorfunc)

                            });

                    }


                }
            },{
                text:'取消',
                handler:function(){
                    $('#newcontrolitemwin').dialog('close');
                }
            }],
            //href: 'get_content.php',
            modal: true
        });


        var divitiontree=$('#newcontrolitemwin .easyui-combotree');
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


        $('#newcontrolitemwin .lazy-combobox').combobox({
            onShowPanel: function () {
                var url = 'auth/getroles?start=0&limit=100' ;
                $(this).combobox('reload', url);
            }

        });


        $.parser.parse($('#newcontrolitemwin'));





    }

    return {
        render: render

    };
});