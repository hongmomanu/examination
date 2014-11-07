(ns examination.routes.maintain
  (:use compojure.core)

  (:require [examination.layout :as layout]
            [examination.util :as util]
            [examination.controller.maintain :as maintain]
            [clj-http.client :as client]

            ))



(defroutes maintain-routes

  (POST "/maintain/gettreeitem" [node roleid pid packageid unitid groupid callback]
    (maintain/gettreeitem node roleid pid packageid unitid groupid callback))

  (POST "/maintain/getunitgroup" [node  pid rootname callback]
    (maintain/getunitgroup node  pid rootname callback))

  (POST "/maintain/getcheckitemsbypid" [id]
    (maintain/getcheckitemsbypid id)
    )

  (POST "/maintain/getallcheckitems" [start limit  totalname rowsname keywords]
    (maintain/getallcheckitems start limit  totalname rowsname keywords)
    )
  (POST "/maintain/getunitgroupperson" [start limit  totalname rowsname keyword fields downbirth upbirth]
    (maintain/getunitgroupperson start limit  totalname rowsname keyword fields downbirth upbirth)
    )

  (POST "/maintain/getdeptsbyuser" [ rowsname totalname]
    (maintain/getdeptsbyuser rowsname totalname)
    )

  (POST "/maintain/getcontroltree" [node  value  callback]
    (maintain/getcontroltree node  value  callback))
  (POST "/maintain/addnewitem" [pycode itemname price sortnum deptid]
    (maintain/addnewitem pycode itemname price sortnum deptid))
  (POST "/maintain/edititem" [pycode itemname price sortnum itemid]
    (maintain/edititem pycode itemname price sortnum itemid))



  (POST "/maintain/delitem" [itemid]
    (maintain/delitem itemid))
  (POST "/maintain/delunit" [id]
    (maintain/delunit id))
  (POST "/maintain/delunitmember" [id]
    (maintain/delunitmember id))
  (POST "/maintain/delunitmembers" [members]
    (maintain/delunitmembers members))
  (POST "/maintain/deldetailtips" [tips]
    (maintain/deldetailtips tips))
  (POST "/maintain/delsuggests" [suggets]
    (maintain/delsuggests suggets))
  (POST "/maintain/delpackages" [packages]
    (maintain/delpackages packages))
  (POST "/maintain/delitemdeatail" [id]
    (maintain/delitemdeatail id))
(POST "/maintain/makepackageitems" [deleteid itemid packageid]
    (maintain/makepackageitems deleteid itemid packageid))

  (POST "/maintain/getsuggests" [start limit  totalname rowsname deptid keyword]
    (maintain/getsuggests start limit  totalname rowsname deptid keyword))

  (POST "/maintain/getdeptconclusionbyrid" [start limit  totalname rowsname deptid relationid]
    (maintain/getdeptconclusionbyrid start limit  totalname rowsname deptid relationid))



  (POST "/maintain/getdetailtips" [start limit  totalname rowsname detaiid]
    (maintain/getdetailtips start limit  totalname rowsname detaiid))

  (POST "/maintain/getunits" [start limit  totalname rowsname keyword]
    (maintain/getunits start limit  totalname rowsname keyword))

  (POST "/maintain/getpackages" [start limit  totalname rowsname keyword]
    (maintain/getpackages start limit  totalname rowsname keyword))

  (POST "/maintain/getregistedperson" [start limit  totalname rowsname isunit isinto keyword date]
    (maintain/getregistedperson start limit  totalname rowsname isunit  isinto keyword date))

  (POST "/maintain/getfinishedperson" [start limit  totalname rowsname beginday endday
                                       beginno endno unitname sex]
    (maintain/getfinishedperson start limit  totalname rowsname beginday endday
                                beginno endno unitname sex))

  (POST "/maintain/getdetaireportbyrid" [relationid]
    (maintain/getdetaireportbyrid relationid))

  (POST "/maintain/getdaystatic" [beginday endday]
    (maintain/getdaystatic beginday endday))

  (POST "/maintain/getillstatic" [beginday endday unitname]
    (maintain/getillstatic beginday endday unitname))


(POST "/maintain/deptworkquerystatic" [beginday endday ]
    (maintain/deptworkquerystatic beginday endday ))


  (POST "/maintain/finishcontrolcheck" [id relationid result suggestion other]
    (maintain/finishcontrolcheck id relationid result suggestion other)
    )




  (POST "/maintain/getcheckornopation" [start limit  totalname rowsname keyword deptid ischecked]
    (maintain/getcheckornopation start limit  totalname rowsname keyword deptid ischecked))



  (POST "/maintain/getregistedpersonbyrange" [start limit  totalname rowsname isunit isinto bgno endno date]
    (maintain/getregistedpersonbyrange start limit  totalname rowsname isunit  isinto bgno endno date))


  (POST "/maintain/intocheck" [relationid]
    (maintain/intocheck relationid)
    )
  (POST "/maintain/outcheck" [relationid]
    (maintain/outcheck relationid)
    )

  (POST "/maintain/getregistedcheckitems" [start limit  totalname rowsname keyword relationid]
    (maintain/getregistedcheckitems start limit  totalname rowsname keyword relationid))

  (POST "/maintain/getcheckingitems" [start limit  totalname rowsname blh_no keyword ]
    (maintain/getcheckingitems start limit  totalname rowsname blh_no keyword ))

  (POST "/maintain/getitemdetaibydeptid" [start limit  totalname rowsname deptid itemcodes relationid]
    (maintain/getitemdetaibydeptid start limit  totalname rowsname deptid itemcodes relationid))

  (POST "/maintain/addcheckitemsbyrid" [relationid items]
    (maintain/addrelationitems relationid items)
    )

  (POST "/maintain/addcheckingitemsbyrid" [relationid items]
    (maintain/addrelationnewtems relationid items)
    )
  (POST "/maintain/addcheckingitemsbyrids" [rids items]
    (maintain/addrelationnewtemsbyrids rids items)
    )

  (POST "/maintain/delcheckingitemsbyrid" [ids]
    (maintain/delcheckingitemsbyrid ids)
    )
  (POST "/maintain/delcheckingitemsbyrids" [rids itemcodes]
    (maintain/delcheckingitemsbyrids rids itemcodes)
    )



  (POST "/maintain/getunitmembers" [id start limit  totalname rowsname keyword]
    (maintain/getunitmembers id start limit  totalname rowsname keyword))

  (POST "/maintain/getpackageitems" [id start limit  totalname rowsname keyword]
    (maintain/getpackageitems id start limit  totalname rowsname keyword))


  (POST "/maintain/addnewcheckitemdetail" [itemid  itemdetailname
                                           unit  downlimit
                                           uplimit	 std_mess
                                           down_mess  up_mess
                                           sortnum  pycode ]
    (maintain/addnewcheckitemdetail itemid  itemdetailname unit  downlimit uplimit	 std_mess
                        down_mess  up_mess sortnum  pycode))

  (POST "/maintain/addnewsuggests" [suggets]
    (maintain/addnewsuggests suggets))


  (POST "/maintain/adddetailtips" [tips]
    (maintain/adddetailtips tips))


  (POST "/maintain/addunitgroup" [unitid  groupname marry  sex
                                  downage	 upage duty  title ]
    (maintain/addunitgroup unitid  groupname marry  sex
                           downage	 upage duty  title))

  (POST "/maintain/addnewcontrolitem" [type  title content]
    (maintain/addnewcontrolitem type  title content))

  (POST "/maintain/getpation" [keyword isunit ]
    (maintain/getpation keyword isunit ))
(POST "/maintain/addpation" [blh_no name sex marry address telephone
                             email birthday unitname duty title checkday isunit unitid groupid]
    (maintain/addpation blh_no name sex marry address telephone
      email birthday unitname duty title checkday isunit unitid groupid))

  (POST "/maintain/savepation" [blh_no name sex marry address telephone
                             email birthday unitname duty title checkday]
    (maintain/savepation blh_no name sex marry address telephone
      email birthday unitname duty title checkday))

  (POST "/maintain/editcontrolitem" [type  title content id]
    (maintain/editcontrolitem type  title content id))

  (POST "/maintain/editunitgroup" [unitid  groupname marry  sex
                                  downage	 upage duty  title itemid deleteid id]
    (maintain/editunitgroup unitid  groupname marry  sex
                           downage	 upage duty  title itemid deleteid id))
(POST "/maintain/delunitgroup" [id]
    (maintain/delunitgroup id))

(POST "/maintain/addnewunitmembers" [members ]
  (maintain/addnewunitmembers members)
  )
(POST "/maintain/addsuggessionbyrid" [items ]
  (maintain/addsuggessionbyrid items)
  )
(POST "/maintain/delsuggessuonbyrid" [delids]
  (maintain/delsuggessuonbyrid delids)
  )
(POST "/maintain/additemdetailtable" [details]
  (maintain/additemdetailtable details)
  )
(POST "/maintain/getcontolmsgbyrid" [relationid]
  (maintain/getcontolmsgbyrid relationid)
  )
 (POST "/maintain/savecontolmsgbyrid" [id relationid result suggestion other]
  (maintain/savecontolmsgbyrid id relationid result suggestion other)
  )
(POST "/maintain/editdetailtips" [tips ]
  (maintain/editdetailtips tips)
  )
(POST "/maintain/editsuggests" [suggets ]
    (maintain/editsuggests suggets)
    )

  (POST "/maintain/editunitmembers" [members ]
    (maintain/editunitmembers members)
    )

  (POST "/maintain/editpackages" [packages ]
    (maintain/editpackages packages)
    )
  (POST "/maintain/addnewunitmember" [unitid  membername  marry
                                      cardnum   sex  birthday		 duty
                                      address   telephone		 ischeck   title ]
    (maintain/addnewunitmember unitid  membername  marry
                              cardnum   sex  birthday		 duty
                              address   telephone		 ischeck   title ))

  (POST "/maintain/editunitmember" [unitid  membername  marry
                                      cardnum   sex  birthday		 duty
                                      address   telephone		 ischeck   title id]
    (maintain/editunitmember unitid  membername  marry
                              cardnum   sex  birthday		 duty
                              address   telephone		 ischeck   title id))



  (POST "/maintain/edititemdetail" [itemid  itemdetailname
                                           unit  downlimit
                                           uplimit	 std_mess
                                           down_mess  up_mess
                                           sortnum  pycode id]
    (maintain/edititemdetail itemid  itemdetailname unit  downlimit uplimit	 std_mess
                        down_mess  up_mess sortnum  pycode id))
  (POST "/maintain/addnewunit" [unitcode unitname manager   contacter  telephone	 email	address
                                postcode bank  bank_no  remark  sortnum  useflag]
    (maintain/addnewunit unitcode unitname manager   contacter  telephone	 email	address
                         postcode bank  bank_no  remark  sortnum  useflag
      ))

  (POST "/maintain/addnewunitpackages" [packages]
    (maintain/addnewunitpackages packages
      ))

  (POST "/maintain/saveunitgroupitem" [unitid groupid itemid deleteid ]
    (maintain/saveunitgroupitem unitid groupid itemid deleteid
      ))

  (POST "/maintain/editunit" [unitcode unitname manager   contacter  telephone	 email	address
                                postcode bank  bank_no  remark  sortnum  useflag id]
    (maintain/editunit unitcode unitname manager   contacter  telephone	 email	address
                         postcode bank  bank_no  remark  sortnum  useflag id
      ))

  )
