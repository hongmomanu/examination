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

                        var personobj= data.person[0];
                        var unitobj= data.unit[0];
                        var div=$('#daysstaticpanel .content');
                        div.html("");
                        div.append("<a>日期："+$('#daysstaticpanel .beginday').datebox('getValue')+
                            "-->"+$('#daysstaticpanel .endday').datebox('getValue')+
                            "</a>");
                        div.append('<table class="formtable">' +
                            '<tr><td>个人人数：</td><td>'+personobj.counts+'</td>' +
                            '<td>团体人数：</td><td>'+unitobj.counts+'</td>'+
                            '<td>总人数：</td><td>'+(unitobj.counts+personobj.counts)+'</td>'+
                            '</tr>' +
                            '<tr><td>个人费用：</td><td>'+personobj.sums+'</td>' +
                            '<td>团体费用：</td><td>'+unitobj.sums+'</td>'+
                            '<td>总费用：</td><td>'+(unitobj.sums+personobj.sums)+'</td>'+
                            '</tr>' +
                            '</table>') ;

                        //console.log(data);

                    };
                    var errorfunc=function(){
                        $.messager.alert('提示','error!');
                    };

                    ajaxform.ajaxsend('post','json','maintain/getdaystatic',params,succ,null,errorfunc,false);














                });



        });




    }

    return {
        render: render

    };
});