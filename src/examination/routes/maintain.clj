(ns examination.routes.maintain
  (:use compojure.core)

  (:require [examination.layout :as layout]
            [examination.util :as util]
            [examination.controller.maintain :as maintain]
            [clj-http.client :as client]

            ))



(defroutes maintain-routes

  (POST "/maintain/gettreeitem" [node roleid pid callback]
    (maintain/gettreeitem node roleid pid callback))
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
  (POST "/maintain/delpackages" [packages]
    (maintain/delpackages packages))
  (POST "/maintain/delitemdeatail" [id]
    (maintain/delitemdeatail id))

  (POST "/maintain/getunits" [start limit  totalname rowsname keyword]
    (maintain/getunits start limit  totalname rowsname keyword))

  (POST "/maintain/getpackages" [start limit  totalname rowsname keyword]
    (maintain/getpackages start limit  totalname rowsname keyword))

  (POST "/maintain/getunitmembers" [id start limit  totalname rowsname keyword]
    (maintain/getunitmembers id start limit  totalname rowsname keyword))

  (POST "/maintain/addnewcheckitemdetail" [itemid  itemdetailname
                                           unit  downlimit
                                           uplimit	 std_mess
                                           down_mess  up_mess
                                           sortnum  pycode ]
    (maintain/addnewcheckitemdetail itemid  itemdetailname unit  downlimit uplimit	 std_mess
                        down_mess  up_mess sortnum  pycode))

  (POST "/maintain/addnewunitmembers" [members ]
    (maintain/addnewunitmembers members)
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

  (POST "/maintain/editunit" [unitcode unitname manager   contacter  telephone	 email	address
                                postcode bank  bank_no  remark  sortnum  useflag id]
    (maintain/editunit unitcode unitname manager   contacter  telephone	 email	address
                         postcode bank  bank_no  remark  sortnum  useflag id
      ))

  )
