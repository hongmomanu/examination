define(function () {


    function render(parameters) {

        require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
            ,function(easyuiform,ajaxform){
                $('#illquerypanel .beginday').datebox('setValue', $.format.date((new Date()).add({ months: -3}), "yyyy-MM-dd"));
                $('#illquerypanel .endday').datebox('setValue', $.format.date(new Date(), "yyyy-MM-dd"));

                $('#illquerypanel .print').click(function(){
                    $("#illquerypanel .content").printThis();

                })
                $('#illquerypanel .static').click(function(){

                    //alert(1);
                    var params={
                        beginday: $('#illquerypanel .beginday').datebox('getValue'),
                        endday: $('#illquerypanel .endday').datebox('getValue')

                    };
                    var succ=function(data){
                        //console.log(data);
                        var illrows=data.datas;
                        var div=$('#illquerypanel .content');
                        div.html("");
                        div.append("<a>日期："+$('#illquerypanel .beginday').datebox('getValue')+
                            "-->"+$('#illquerypanel .endday').datebox('getValue')+
                            "</a>");
                        div.append('<table class="formtable"></table>');
                        var row_head='<tr><td width="50%">疾病名称</td><td width="25%">人数</td>' +
                            '<td width="15%">百分率</td>'+
                            '</tr>'
                        var table=$('#illquerypanel .formtable');
                        table.append(row_head);
                        for(var i=0;i<illrows.length;i++){
                           var row_str='<tr><td width="50%">'+illrows[i].reason+'</td><td width="25%">'+illrows[i].counts+'</td>' +
                               '<td width="25%">'+(illrows[i].counts/data.totalnum*100).toFixed(3)+'</td>'+
                               '</tr>' ;
                            table.append(row_str);
                        }




                    };
                    var errorfunc=function(){
                        $.messager.alert('提示','error!');
                    };

                    ajaxform.ajaxsend('post','json','maintain/getillstatic',params,succ,null,errorfunc,false);














                });



        });




    }

    return {
        render: render

    };
});