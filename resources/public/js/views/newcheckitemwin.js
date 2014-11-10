define(function () {

    function render(parameters) {
        $('#newcheckitemwin').dialog({
            title: '新增项目明细窗口',
            width: 450,
            height: 230,
            closed: false,
            cache: false,
            buttons:[{
                text:'保存',
                id:'savenewcheckitembtn',
                disabled:false,
                handler:function(){
                   //alert(1);
                    require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
                        ,function(easyform,ajaxfrom){
                            var form=$('#newcheckitemwin form');
                            if(form.form('validate')) {
                                var params = form.form("serialize");
                                params.iscommon = false;
                                params.itemid = $('#itemmanagerpanel').treegrid('getSelected').itemid;
                                var success = function () {
                                    $.messager.alert('操作成功', '新增成功!');
                                    $('#newcheckitemwin').dialog('close');
                                    //$('#itemmanagerpanel').treegrid('reload', params.pid);
                                    $('#itemmanagerpanel').treegrid('reload', $('#itemmanagerpanel').treegrid('getSelected')._parentId)
                                    //$('#checkitemmanagerpanel').datagrid('reload');
                                };
                                var errorfunc = function () {
                                    $.messager.alert('操作失败', '新增失败!');
                                }
                                ajaxfrom.ajaxsend('post', 'json', 'maintain/addnewcheckitemdetail', params, success, null, errorfunc)
                            }
                        });

                }
            },{
                text:'取消',
                handler:function(){
                    $('#newcheckitemwin').dialog('close');
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
        var divitiontree=$('#newcheckitemwin .easyui-combotree');
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


        $('#newcheckitemwin .lazy-combobox').combobox({
            onShowPanel: function () {
                var url = 'auth/getroles?start=0&limit=100' ;
                $(this).combobox('reload', url);
            }

        });


        $.parser.parse($('#newcheckitemwin'));

        $('#newcheckitemwin input').on('change',function(){
            var form=$('#newcheckitemwin form');
            if(form.form('validate')){
                $('#savenewcheckitembtn').linkbutton('enable');
            }
            else{
                $('#savenewcheckitembtn').linkbutton('disable');
            }
        });

        $('#newcheckitemwin .easyui-combobox,#newcheckitemwin .easyui-combotree').combobox({
            onHidePanel:function(){
                var form=$('#newcheckitemwin form');
                if(form.form('validate')){
                    $('#savenewcheckitembtn').linkbutton('enable');
                }else{
                    $('#savenewcheckitembtn').linkbutton('disable');
                }
            }
        })

    }

    return {
        render: render

    };
});