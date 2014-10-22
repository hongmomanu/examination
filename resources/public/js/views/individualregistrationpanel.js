define(function () {



    function render(parameters) {

        var combox=$('#registmanagerlayout .lazy-combobox');
        combox.combobox({
            onShowPanel: function () {
                var searchtype = $(this).attr('searchtype');
                var url = 'auth/getenumbytype?type='+searchtype;
                $(this).combobox('reload', url);
            }

        });

        $('#registedperson').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            url:'maintain/getregistedperson',
            remoteSort: false,
            //fitColumns:true,
            fit:true,
            //toolbar:'#enumpaneltb',
            pagination:true,
            pageSize:10,
            onBeforeLoad: function (params) {
                var options = $('#registedperson').datagrid('options');
                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
            },
            onClickRow:function(index, rowData){
                $('#checkeditems').datagrid('reload');
            }

        });

        $('#checkeditems').datagrid({
            singleSelect: true,
            collapsible: true,
            rownumbers: true,
            method:'post',
            url:'maintain/getregistedcheckitems',
            remoteSort: false,
            //fitColumns:true,
            fit:true,
            //toolbar:'#enumpaneltb',
            pagination:true,
            pageSize:10,
            onBeforeLoad: function (params) {
                var options = $('#checkeditems').datagrid('options');
                var selected=$('#registedperson').datagrid('getSelected');
                if(selected)params.relationid=selected.relationid;

                params.start = (options.pageNumber - 1) * options.pageSize;
                params.limit = options.pageSize;
                params.totalname = "total";
                params.rowsname = "rows";
                console.log(selected);
                console.log(params);
            },
            onClickRow:function(index, rowData){

            }

        });

        var blhselect=function(record){
            $('#registration').form('load',record);
        };
        var myloader = function(param,success,error){
            var q = param.q || '';
            if (q.length < 1){return false}

            require(['js/commonfuncs/AjaxForm.js']
                ,function(ajaxfrom){
                    var params={keyword:q};
                    var succ=function(data){
                        console.log(data);
                        success(data);
                    };
                    var errorfunc=function(){
                        error.apply(this, arguments);
                    };

                    ajaxfrom.ajaxsend('post','json','maintain/getpation',params,succ,null,errorfunc,true);

                });

        }
        var date=new Date();
        $('#checkday').datebox('setValue', date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate());

        $('#pationblhno').combobox({
            required:true,
            hasDownArrow:false,
            loader: myloader,
            onSelect:blhselect,
            mode: 'remote',
            valueField: 'blh_no',
            textField: 'blh_no'

        });

        $('#pationformtb .add').click(function(e){
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
                    var params=$('#registration').form("serialize");
                    if(params.blh_no) {
                        alert(3);
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


        });

    }

    return {
        render: render

    };
});