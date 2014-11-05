define(function () {


    function render(parameters) {

        require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
            ,function(easyuiform,ajaxform){
                $('#daysstaticpanel .beginday').datebox('setValue', $.format.date((new Date()).add({ months: -3}), "yyyy-MM-dd"));
                $('#daysstaticpanel .endday').datebox('setValue', $.format.date(new Date(), "yyyy-MM-dd"));

                $('#daysstaticpanel .static').click(function(){

                    //alert(1);
                    var params={
                        beginday: $('#daysstaticpanel .beginday').datebox('getValue'),
                        endday: $('#daysstaticpanel .endday').datebox('getValue')

                    };
                    var succ=function(data){

                        //console.log(data);

                    };
                    var errorfunc=function(){
                        $.messager.alert('提示','error!');
                    };

                    ajaxform.ajaxsend('post','json','maintain/getdaystatic',params,succ,null,errorfunc,true);














                });



        });




    }

    return {
        render: render

    };
});