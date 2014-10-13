/**
 * Created by jack on 14-1-6.
 */
define(function(){



    function initroutnavigation(){

               $('#westpanel').panel({
                    onLoad:function(){
                        require(['../js/ManagerTree.js','../js/commonfuncs/AjaxForm.js'],
                            function(ManagerTree,ajaxfrom){

                                var params={};
                                params.leaf=true;
                                params.type="系统菜单";
                                var success=function(res){
                                    for(var i=0;i<res.length;i++){
                                        $('#menu_qxgl').accordion('add', {
                                            title: res[i].text,
                                            name:res[i].value,
                                            bodyCls:"main_menu_tree",
                                            //content: 'New Content',
                                            selected: (i==0)
                                        });
                                    }
                                    ManagerTree.render();
                                };
                                var errorfunc=function(){
                                    //$.messager.alert('操作失败','新增用户失败!');
                                }
                                ajaxfrom.ajaxsend('post','json','../auth/getfuncsbyrole',params,success,null,errorfunc,true);


                        });
                    }

                });

                $('#westpanel').panel('refresh','../html/menu_qxgl.html');

    }

     return {
         initroutnavigation:initroutnavigation
     }

})