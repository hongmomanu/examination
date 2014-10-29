define(function () {

    function render(parameters) {
        $('#checkpationwithitemwin').dialog({
            title: '项目录入',
            width: '100%',
            height: '100%',
            closed: false,
            cache: false,
            buttons:[{
                text:'保存',

                handler:function(){



                }
            },{
                text:'取消',
                handler:function(){
                    $('#checkpationwithitemwin').dialog('close');
                }
            }],
            modal: true
        });
        $.parser.parse('#checkpationwithitemwin');



    }

    return {
        render: render

    };
});