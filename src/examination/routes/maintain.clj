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
  (POST "/maintain/addnewcheckitemdetail" [itemid  itemdetailname
                                           unit  downlimit
                                           uplimit	 std_mess
                                           down_mess  up_mess
                                           sortnum  pycode ]
    (maintain/addnewcheckitemdetail itemid  itemdetailname unit  downlimit uplimit	 std_mess
                        down_mess  up_mess sortnum  pycode))

  )