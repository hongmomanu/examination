define(function () {



    function render(parameters) {
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

            }

        });


        var myloader = function(param,success,error){
            var q = param.q || '';
            if (q.length < 1){return false}
            $.ajax({
                url: 'http://ws.geonames.org/searchJSON',
                dataType: 'jsonp',
                data: {
                    featureClass: "P",
                    style: "full",
                    maxRows: 20,
                    name_startsWith: q
                },
                success: function(data){
                    var items = $.map(data.geonames, function(item){
                        return {
                            blh_no: item.geonameId

                        };
                    });
                    success(items);
                },
                error: function(){
                    error.apply(this, arguments);
                }
            });
        }


        $('#pationblhno').combobox({
            required:true,
            hasDownArrow:false,
            loader: myloader,
            mode: 'remote',
            valueField: 'blh_no',
            textField: 'blh_no'

        })

        $('#pationformtb .add').click(function(e){
            var form=$('#registration') ;
            if(form.form('validate')) {
                alert(1);

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