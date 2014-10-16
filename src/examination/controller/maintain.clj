(ns examination.controller.maintain


  (:import
            (java.io File)

    )
  (:use compojure.core)
  (:use korma.core
        [korma.db :only [oracle]])


  (:require [examination.db.core :as db]
            [noir.response :as resp]
            [examination.db.schema :as schema]
            [examination.controller.auth :as auth]
            [me.raynes.fs :as fs]
            [clj-http.client :as client]
            [clojure.data.json :as json]
            [examination.layout :as layout]

            )
  )

(defn getitemnums [deptid]
  (:counts (first (db/getitemnums deptid)))
  )
(defn getitemdetailnums [itemid]
  (:counts (first (db/getitemdetailnums itemid)))
  )
(defn getunits [start limit  totalname rowsname keyword]
  (let [results (db/getunits start limit keyword )
        nums  (:counts (first (db/getunitnums keyword)))
        ]
    (resp/json (assoc {} rowsname results totalname nums))
    )
  )
(defn getpackages [start limit  totalname rowsname keyword]
  (let [results (db/getpackages start limit keyword )
        nums  (:counts (first (db/getpackagenums keyword)))
        ]
    (resp/json (assoc {} rowsname results totalname nums))
    )
  )
(defn getunitmembers [id start limit  totalname rowsname keyword]
  (let [results (db/getunitmembers id start limit keyword )
        nums  (:counts (first (db/getunitmembernums id keyword)))
        ]
    (resp/json (assoc {} rowsname results totalname nums))
    )
  )
(defn delitem [itemid]
  (resp/json {:success true :msg (db/delcheckitem itemid)})
  )
(defn delunitmember [memberid]
  (resp/json {:success true :msg (db/delunitmember memberid)})
  )
(defn delunitmembers [members]
  (let [items (json/read-str members :key-fn keyword)]
    (dorun (map #(db/delunitmember (:id %)) items))
    (resp/json {:success true})
    )
  )
(defn delpackages [members]
  (let [items (json/read-str members :key-fn keyword)]
    (dorun (map #(db/delpackage (:id %)) items))
    (resp/json {:success true})
    )
  )
(defn delunit [id]
  (resp/json {:success true :msg (db/delunit id)})
  )
(defn delitemdeatail [id]
  (resp/json {:success true :msg (db/delcheckitemdeatil id)})
  )
(defn gettreeitem [node roleid pid callback]

  (if (= node "-1")
    (resp/json [{:id 0 :text "体检科室" :value "体检科室"
                 :children (map #(conj % {:state "closed" :value (:deptname %) :id (str "dept" (:id %)) :nodeid (:id %)
                                          :text (str (:deptname %) "(" (getitemnums (:id %)) ")")})
                             (db/getdepts 0 100 nil)) }])
    (if (= pid "0")(resp/json (map #(conj % {:state "closed" :value (:itemname %) :id (str "item" (:id %)) :nodeid (:id %)
                                             :text (str (:itemname %) "(" (getitemdetailnums (:id %)) ")")}) (db/getcheckitem node)))
      (resp/json (map #(conj % {:value (:itemdetailname %) :id (:id %)
                                           :text (:itemdetailname %)}) (db/getcheckitemdetail node)))
      ))

  )
(defn addnewitem [pycode itemname price sortnum deptid]
  (resp/json {:success true :msg (db/addnewitem {
                                                 :pycode pycode
                                                 :itemname itemname
                                                 :price price
                                                 :sortnum sortnum
                                                 :deptid deptid
                                                  })})
  )

(defn addnewcheckitemdetail [itemid  itemdetailname unit  downlimit uplimit	 std_mess
                             down_mess  up_mess sortnum  pycode]

  (resp/json {:success true :msg (db/addnewcheckitemdetail {
                                                  :itemid itemid
                                                  :itemdetailname itemdetailname
                                                  :unit unit
                                                  :downlimit downlimit
                                                  :uplimit uplimit
                                                  :std_mess std_mess
                                                  :down_mess down_mess
                                                  :up_mess up_mess
                                                  :sortnum sortnum
                                                  :pycode pycode
                                                  })})

)
(defn addnewunitmembers [members]
  (let [items (json/read-str members :key-fn keyword)]
    (dorun (map #(db/addnewunitmember %) items))
    (resp/json {:success true})
    )

  )

(defn addnewunitpackages [members]
  (let [items (json/read-str members :key-fn keyword)]
    (dorun (map #(db/addnewunitpackage %) items))
    (resp/json {:success true})
    )

  )

(defn addnewunitmember [unitid  membername  marry
                        cardnum   sex  birthday		 duty
                        address   telephone		 ischeck   title ]

  (resp/json {:success true :msg (db/addnewunitmember {
                                                  :unitid unitid
                                                  :membername membername
                                                  :marry marry
                                                  :cardnum cardnum
                                                  :sex sex
                                                  :duty duty
                                                  :address address
                                                  :telephone telephone
                                                  :ischeck ischeck
                                                  :title title
                                                  })})

)
(defn editunitmembers [members]
  (let [items (json/read-str members :key-fn keyword)]
    (dorun (map #(do (println % (:id %))(db/editunitmember % (:id %))) items))
    (resp/json {:success true})
    )

  )
(defn editpackages [packages]
  (let [items (json/read-str packages :key-fn keyword)]
    (dorun (map #(do (println % (:id %))(db/editpackage % (:id %))) items))
    (resp/json {:success true})
    )

  )
(defn editunitmember [unitid  membername  marry
                        cardnum   sex  birthday		 duty
                        address   telephone		 ischeck   title id]

  (resp/json {:success true :msg (db/editunitmember {
                                                  :unitid unitid
                                                  :membername membername
                                                  :marry marry
                                                  :cardnum cardnum
                                                  :sex sex
                                                  :duty duty
                                                  :address address
                                                  :telephone telephone
                                                  :ischeck ischeck
                                                  :title title
                                                  } id)})

)
(defn addnewunit [unitcode unitname manager   contacter  telephone	 email	address
                  postcode bank  bank_no  remark  sortnum  useflag]

  (resp/json {:success true :msg (db/addnewunit {
                                                  :unitcode unitcode
                                                  :unitname unitname
                                                  :manager manager
                                                  :contacter contacter
                                                  :telephone telephone
                                                  :email email
                                                  :address address
                                                  :postcode postcode
                                                  :bank bank
                                                  :bank_no bank_no
                                                  :remark remark
                                                  :sortnum sortnum
                                                  :useflag useflag
                                                  })}))
  (defn editunit [unitcode unitname manager   contacter  telephone	 email	address
                  postcode bank  bank_no  remark  sortnum  useflag id]

  (resp/json {:success true :msg (db/editunit {
                                                  :unitcode unitcode
                                                  :unitname unitname
                                                  :manager manager
                                                  :contacter contacter
                                                  :telephone telephone
                                                  :email email
                                                  :address address
                                                  :postcode postcode
                                                  :bank bank
                                                  :bank_no bank_no
                                                  :remark remark
                                                  :sortnum sortnum
                                                  :useflag useflag
                                                  } id)})

)
(defn edititemdetail [itemid  itemdetailname unit  downlimit uplimit	 std_mess
                             down_mess  up_mess sortnum  pycode id]

  (resp/json {:success true :msg (db/editcheckitemdetail {
                                                  :itemid itemid
                                                  :itemdetailname itemdetailname
                                                  :unit unit
                                                  :downlimit downlimit
                                                  :uplimit uplimit
                                                  :std_mess std_mess
                                                  :down_mess down_mess
                                                  :up_mess up_mess
                                                  :sortnum sortnum
                                                  :pycode pycode
                                                  } id)})

)

(defn edititem [pycode itemname price sortnum itemid]
  (resp/json {:success true :msg (db/updateitem {
                                                  :pycode pycode
                                                  :itemname itemname
                                                  :price price
                                                  :sortnum sortnum
                                                  } itemid)})
  )





