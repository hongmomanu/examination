define(function () {


    function render(parameters) {

        require(['js/jqueryplugin/easyui-form.js','js/commonfuncs/AjaxForm.js']
            ,function(easyuiform,ajaxform){
                $('#deptworkquerypanel .beginday').datebox('setValue', $.format.date((new Date()).add({ months: -3}), "yyyy-MM-dd"));
                $('#deptworkquerypanel .endday').datebox('setValue', $.format.date(new Date(), "yyyy-MM-dd"));

                $('#deptworkquerypanel .print').click(function(){
                    $("#deptworkquerypanel .content").printThis();

                })
                $('#deptworkquerypanel .static').click(function(){

                    //alert(1);
                    var params={
                        beginday: $('#deptworkquerypanel .beginday').datebox('getValue'),
                        endday: $('#deptworkquerypanel .endday').datebox('getValue')

                    };
                    var succ=function(data){
                        console.log(data);
                        var results=data.results;

                        var div=$('#deptworkquerypanel .content');
                        div.html("");
                        div.append("<a>日期："+$('#deptworkquerypanel .beginday').datebox('getValue')+
                            "-->"+$('#deptworkquerypanel .endday').datebox('getValue')+
                            "</a>");

                        for(var i=0;i<results.length;i++){
                            var sum=0;
                            var append_arr=[];
                            for(var j=0;j<results[i].results.length;j++){
                                sum+=results[i].results[j].counts;
                                append_arr.push('<div style="width: 600px;">'+$.repeat("&nbsp;",10)+results[i].results[j].displayname+ $.repeat("&nbsp;",120)
                                    +results[i].results[j].counts+"</div>");
                                append_arr.push('<div style="width: 600px;"><hr align=right width=570 style="left: 80px;"  size=1 color=black ></div>');
                            }

                            div.append('<div style="width: 600px;"><hr  size=1 color=black></div>');
                            div.append('<div style="width: 600px;">'+$.repeat("&nbsp;",4)+results[i].deptname+ $.repeat("&nbsp;",100)+"人数"
                                +$.repeat("&nbsp;",26)+sum+'</div>');
                            div.append('<div style="width: 600px;"><hr align=right  width=570  size=1 color=black></div>');
                            div.append(append_arr);


                        }






                        /*var illrows=data.datas;
                        var div=$('#deptworkquerypanel .content');
                        div.html("");
                        div.append("<a>日期："+$('#deptworkquerypanel .beginday').datebox('getValue')+
                            "-->"+$('#deptworkquerypanel .endday').datebox('getValue')+
                            "</a>");
                        div.append('<table class="formtable"></table>');
                        var row_head='<tr><td width="50%">疾病名称</td><td width="25%">人数</td>' +
                            '<td width="15%">百分率</td>'+
                            '</tr>'
                        var table=$('#deptworkquerypanel .formtable');
                        table.append(row_head);
                        for(var i=0;i<illrows.length;i++){
                           var row_str='<tr><td width="50%">'+illrows[i].reason+'</td><td width="25%">'+illrows[i].counts+'</td>' +
                               '<td width="25%">'+(illrows[i].counts/data.totalnum*100).toFixed(3)+'</td>'+
                               '</tr>' ;
                            table.append(row_str);
                        }

*/


                    };
                    var errorfunc=function(){
                        $.messager.alert('提示','error!');
                    };

                    ajaxform.ajaxsend('post','json','maintain/deptworkquerystatic',params,succ,null,errorfunc,false);














                });



        });




    }

    return {
        render: render

    };
});