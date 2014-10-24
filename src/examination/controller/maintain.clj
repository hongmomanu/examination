(ns examination.controller.maintain


  (:import
            (java.io File)

    )
  (:use compojure.core)



  (:require [examination.db.core :as db]
            [noir.response :as resp]
            [examination.db.schema :as schema]
            [examination.controller.auth :as auth]
            [me.raynes.fs :as fs]
            [clj-http.client :as client]
            [clojure.data.json :as json]
            [examination.layout :as layout]
            [clj-time.local :as l]
            [clj-time.format :as f]

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

(defn getunitgroupperson [start limit  totalname rowsname keywords fields downbirth upbirth]
  (let [
         searchfields (json/read-str fields :key-fn keyword)

         results (db/getunitgroupperson start limit  keywords searchfields downbirth upbirth)
        nums  (:counts (first (db/getunitgrouppersonnums keywords searchfields downbirth upbirth)))
        ]
    (resp/json (assoc {} rowsname results totalname nums))
    )
  )

(defn getregistedcheckitems [start limit  totalname rowsname keyword relationid]
  (let [
         results (db/getregistedcheckitems start limit keyword relationid)

         nums    (:counts (first (db/getregistedcheckitemnums keyword relationid)))
         ]
    (resp/json (assoc {} rowsname results totalname nums))
    )

  )

(defn getcheckitemsbypid [id]
  (resp/json (db/getitemidbypackage id))
  )
(defn addrelationitems [relationid items]
   (let [

          checkitems (json/read-str items :key-fn keyword)

          ]
       (db/delregistedcheckitem relationid)
       (db/addregistedcheckitem checkitems)

     (resp/json {:success true})
     )
  )
(defn getregistedperson [start limit  totalname rowsname keyword]
  (let [
         custom-formatter (f/formatter "yyyy-MM-dd")
         now (f/unparse custom-formatter (l/local-now))
         results (db/getregistedperson start limit keyword now)
         res (map #(conj {:itemnums (:counts (first (db/getafterRegistnums (:relationid %))))
                          :isinto (count (db/getchargeDetailbyblhno now (:blh_no %)))} %) results)
         nums  (:counts (first (db/getregistedpersonnums keyword now)))
        ]
    (resp/json (assoc {} rowsname res totalname nums))
    )
  )
(defn outcheck [relationid]
  (let [
         pation (first (db/getregistedpersonbyid relationid))
         timenow (if (nil?(:times pation)) 0 (:times pation))
         items (db/getregistedcheckitems 0 10000 nil relationid)
         ]
    (db/updatepation {:times (- timenow 1)} (:id  pation))
    (db/outcheck (:check_date pation) (:blh_no pation))
    (resp/json {:success true})
    )


)
(defn intocheck [relationid]

  (let [
         pation (first (db/getregistedpersonbyid relationid))
         timenow (if(nil?(:times pation)) 0 (:times pation))
         items (db/getregistedcheckitems 0 10000 nil relationid)
         ]
      (db/updatepation {:times (+ timenow 1)} (:id  pation))
    (dorun (map #(db/addnewintocheck {
                                 :times  (+ timenow 1)
                                 :itemcode (:itemcode %)
                                 :itemname  (:itemname %)
                                 :packagename  (:packagename %)
                                 :price (:price %)
                                 :deptid (:deptid %)
                                 :blh_no   (:blh_no pation)
                                 :inspect_mark  0
                                 :inspect_date (:check_date pation)
                                  }) items) )
      (resp/json {:success true})
    )

  )

(defn savepation [blh_no name sex marry address telephone
                  email birthday unitname duty title checkday]
  (db/savepation {:blh_no blh_no :name name
                  :sex sex :marry marry
                  :address address :telephone telephone
                  :email email :birthday birthday
                  :unitname unitname :duty duty :title title
                  } blh_no)
  (resp/json {:success true :msg "保存病人信息成功" })

  )
(defn addpation [blh_no name sex marry address telephone
                 email birthday unitname duty title checkday]

  (let [
         pation (first (db/getpationbyblh blh_no))
         isexists (> (count pation) 0)
         newid (when-not isexists (db/addnewpation {:blh_no blh_no :name name
                                              :sex sex :marry marry
                                              :address address :telephone telephone
                                              :email email :birthday birthday
                                              :unitname unitname :duty duty :title title
                                              }))
         pationid (if (nil? newid) (:id pation) (first (vals newid)))
         registered (db/getrelationbypationid pationid checkday)
         ]

    (when (= (count registered) 0) (db/addRegistRelation pationid checkday))

    (resp/json {:success true :msg "新增病人信息成功" })


    )


  )

(defn getsuggests [start limit  totalname rowsname deptid keyword]
  (let [results (db/getsuggests start limit deptid keyword)
        nums  (:counts (first (db/getsuggestnums deptid keyword)))
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

(defn getpackageitems [id start limit  totalname rowsname keyword]
  #_(let [results (db/getunitmembers id start limit keyword )
        nums  (:counts (first (db/getunitmembernums id keyword)))
        ]
    (resp/json (assoc {} rowsname results totalname nums))
    )
  (resp/json (assoc {} rowsname [{:itemname 1111 :ck true :id 1}] totalname 1))
  )

(defn getpation [keyword]
  (resp/json (db/getpation keyword))
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
(defn isitemcheck [item ids]
  (if (nil? (some #(= (:id item) %) ids)) false true)
  )


(defn getunitgroup [node pid rootname callback]
  (let [

         ])
  (if(= node "-1")(resp/json [{:id 0 :text rootname :value rootname
                               :children (map #(conj % {:state "closed" :value (:unitname %)
                               :text (str (:unitname %) "(" (count (db/getgroupsbyunit (:id %))) ")")})
                               (db/getunits 0 1000000 ""))}])
    (resp/json (map #(conj {:text (:groupname %)} %) (db/getgroupsbyunit node)))

    )
  )
(defn getcontroltree [node value callback]
  (let [
         types (db/getenumeratebytype "总控室类别")

         ]

    (if(= node "-1")(resp/json (map #(conj % {:text (str (:enumeratelabel %) "(" (count (db/getitemsbycontroltype (:enumeratevalue %))) ")") :value (:enumeratevalue %) :state "closed"}) types))
      (resp/json (map #(conj {:text (:title %)} %) (db/getitemsbycontroltype value)))

      )
    )

  )
(defn gettreeitem [node roleid pid packageid unitid groupid callback]
  (let [
         itemids (into [](map #(:itemcode %) (if (nil? groupid) (db/getitemidbypackage packageid)
                                               (db/getitemidbyunitgroup unitid groupid) )))
         ]
    (if (= node "-1")
      (resp/json [{:id 0 :text "体检科室" :value "体检科室"
                   :children (map #(conj % {:state "closed" :value (:deptname %) :id (str "dept" (:id %)) :nodeid (:id %)
                                            :text (str (:deptname %) "(" (getitemnums (:id %)) ")")})
                               (db/getdepts 0 100 nil)) }])
      (if (= pid "0")(resp/json (map #(conj % {:state (if (and (nil? packageid) (nil? groupid)) "closed" "open") :value (:itemname %) :checked (isitemcheck % itemids) :id (str "item" (:id %)) :nodeid (:id %)
                                               :text (str (:itemname %) "(" (getitemdetailnums (:id %)) ")")}) (db/getcheckitem node)))
        (resp/json (map #(conj % {:value (:itemdetailname %) :id (:id %)
                                  :text (:itemdetailname %)}) (db/getcheckitemdetail node)))
        ))
    )


  )
(defn makepackageitems [deleteid itemid packageid]
  (let[
        delids (read-string deleteid)
        itemids (read-string itemid)
        ]
    (dorun (map #(db/delitembypid packageid %) delids))
    (dorun (map #(db/insertitembypid packageid %) itemids))
    (resp/json {:success true})

    )

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
(defn addnewcontrolitem  [type  title content]
  (resp/json {:success true :msg (db/addnewcontrolitem {
                                                 :type type
                                                 :title title
                                                 :content content
                                                  })})
  )
(defn addunitgroup [unitid  groupname marry  sex
                    downage	 upage duty  title]
  (resp/json {:success true :msg (db/addnewunitgroup {
                                                 :unitid unitid
                                                 :groupname groupname
                                                 :marry marry
                                                 :sex sex
                                                 :downage downage
                                                 :upage upage
                                                 :duty duty
                                                 :title title
                                                  })})
  )
(defn saveunitgroupitem [unitid groupid itemid deleteid]
  (let[
        delids (read-string deleteid)
        itemids (read-string itemid)
        ]
    (dorun (map #(db/delgroupitembyid unitid groupid %) delids))
    (dorun (map #(db/insertgroupitembyid unitid groupid %) itemids))
    (resp/json {:success true})

    )

  )
(defn editcontrolitem [type  title content id]
  (resp/json {:success true :msg (db/editcontrolitem {
                                                       :type type
                                                       :title title
                                                       :content content
                                                       } id)})

  )
(defn editunitgroup [unitid  groupname marry  sex
                    downage	 upage duty  title itemid deleteid id]
  (db/editunitgroup {
                      :unitid unitid
                      :groupname groupname
                      :marry marry
                      :sex sex
                      :downage downage
                      :upage upage
                      :duty duty
                      :title title
                      } id)

  (saveunitgroupitem unitid id itemid deleteid)

  (resp/json {:success true})
  )

(defn delunitgroup [id]
  (resp/json {:success true :msg (db/delunitgroup id)})
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
(defn addnewsuggests [suggets]
  (let [items (json/read-str suggets :key-fn keyword)]
    (dorun (map #(db/addnewsuggest %) items))
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





