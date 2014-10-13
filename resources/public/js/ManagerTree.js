/**
 * Created by jack on 13-12-31.
 */
define(function(){

    var a={

        render:function(parameters){
            $('.main_menu_tree').tree({
                onClick: function (node){
                    var tree=$(this);
                    var me=this;
                    if(tree.tree('isLeaf', node.target)){
                        var isnew=false;
                        var tabs=$('#tabs').tabs('tabs');
                        for(var i=0;i<tabs.length;i++){
                            if(tabs[i].panel('options').id==node.id){
                                $('#tabs').tabs('select',i);
                                return;
                            }
                        }

                        var folder="views/";
                        var htmlfile='text!'+folder+node.value+'.htm';
                        var jsfile=folder+node.value;
                        var value=node.value;
                        var title=node.text;
                        require(['../js/TreeClickEvent.js'],function(TreeClickEvent){
                            TreeClickEvent.ShowContent(htmlfile,jsfile,title,value,folder,null,node.id);
                            me.nodeid=node.id;
                        });

                    }
                },
                onBeforeLoad:function(node, param){
                    param.leaf=true;
                    //param.roleid=$.getUrlParam('roleid');
                    param.type=$(this).panel('options').name;
                },
                url:'../auth/getfuncsbyrole'

            });

        }
    }

    return a;
});