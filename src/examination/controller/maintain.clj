(ns examination.controller.maintain


  (:import
            (java.io File)

    )
  (:use compojure.core)
  (:use korma.core
        [korma.db :only [transaction with-db]])



  (:require [examination.db.core :as db]
            [noir.response :as resp]
            [examination.db.schema :as schema]
            [examination.controller.auth :as auth]
            [me.raynes.fs :as fs]
            [clj-http.client :as client]
            [clojure.data.json :as json]
            [examination.layout :as layout]
            [noir.session :as session]
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
(defn getunits [start limit  totalname rowsname keywords]
  (let [results (db/getunits start limit keywords )
        nums  (:counts (first (db/getunitnums keywords)))
        ]
    (resp/json (assoc {} rowsname results totalname nums))
    )
  )

(defn getunitgroupperson [start limit  totalname rowsname keywords fields downbirth upbirth]
  (if (nil? fields) (resp/json (assoc {} rowsname [] totalname 0))

    (let [
           searchfields (json/read-str fields :key-fn keyword)

           results (db/getunitgroupperson start limit  keywords searchfields downbirth upbirth)
           nums  (:counts (first (db/getunitgrouppersonnums keywords searchfields downbirth upbirth)))
           ]
      (resp/json (assoc {} rowsname results totalname nums))
      )
    )


  )

(defn getdeptsbyuser [rowsname totalname]
  (let [
         userid (session/get :userid)
         deptids (:deptids (first(db/getuserbyid userid)))
         results (db/getdeptsbuids (clojure.string/split deptids #","))
         nums (count results)
         ]
    (resp/json (assoc {} rowsname results totalname nums))

    )

  )

(defn getregistedcheckitems [start limit  totalname rowsname keywords relationid]
  (let [
         results (if(nil? relationid)[](db/getregistedcheckitems start limit keywords relationid))

         nums    (if(nil? relationid)[](:counts (first (db/getregistedcheckitemnums keywords relationid))))
         ]
    (resp/json (assoc {} rowsname results totalname nums))
    )

  )

(defn getcheckingitems [start limit  totalname rowsname blh_no keywords ]
  (let [
         results (db/getcheckingitems start limit  keywords blh_no )

         nums    (:counts (first (db/getcheckingitemnums keywords blh_no )))
         ]
    (resp/json (assoc {} rowsname results totalname nums))
    )

  )
(defn getitemdetaibydeptid [start limit  totalname rowsname deptid itemcodes relationid]
  (let [
         ids    (json/read-str itemcodes)
         results (db/getitemdetaibydeptid start limit  deptid ids)
         result (map #(conj   % (first (db/getdetaireportbyid relationid (:detailid %)))) results)
         nums    (:counts (first (db/getitemdetaibydeptidnums deptid ids)))
         ]
    (resp/json (assoc {} rowsname result totalname nums))
    )
  )

(defn getcheckitemsbypid [id]
  (resp/json (db/getitemidbypackage id))
  )
(defn addrelationitems [relationid items]
   (let [

          checkitems (json/read-str items :key-fn keyword)

          ]
     (with-db db/sqlitedb (transaction

         (db/delregistedcheckitem relationid)
           (db/addregistedcheckitem checkitems)

       )
       )



     (resp/json {:success true})
     )
  )

(defn addrelationnewtems [relationid items]
   (let [

          checkitems (json/read-str items :key-fn keyword)

          ]

           (db/addregistedcheckitem checkitems)

     (resp/json {:success true})
     )
  )

(defn itemsaddrid [items rid]
  (map #(conj {:relationid rid} %) items)
  )
(defn addrelationnewtemsbyrids [rids items]
   (let [

          checkitems (json/read-str items :key-fn keyword)
          rids (json/read-str rids)
          ]
     (dorun (map #(db/addregistedcheckitem (itemsaddrid checkitems %)) rids))
     (resp/json {:success true})
     )
  )


(defn getregistedperson [start limit  totalname rowsname  isunit  isinto keywords date]
  (let [
         custom-formatter (f/formatter "yyyy-MM-dd")
         now (if (nil? date) (f/unparse custom-formatter (l/local-now)) date)
         isinto (json/read-str isinto)
         isunit (json/read-str isunit)
         results (db/getregistedperson start limit keywords now isunit isinto)
         test (println results)
         res (map #(conj {:itemnums (:counts (first (db/getafterRegistnums (:relationid %))))
                          } %) results)
         nums  (:counts (first (db/getregistedpersonnums keywords now isunit isinto)))
        ]
    (resp/json (assoc {} rowsname res totalname nums))
    )
  )

(defn getcheckornopation [start limit  totalname rowsname keywords deptid ischecked]
  (if (nil? deptid)(resp/json (assoc {} rowsname [] totalname 0))
    (let [
           results (db/getcheckornopation start limit keywords deptid ischecked)
           test (println results)
           nums  (:counts (first (db/getcheckornopationnums keywords deptid ischecked)))
           ]
      (resp/json (assoc {} rowsname results totalname nums))
      )
    )

  )

(defn getregistedpersonbyrange [start limit  totalname rowsname  isunit  isinto bgno endno date]
  (let [
         custom-formatter (f/formatter "yyyy-MM-dd")
         now (if (nil? date) (f/unparse custom-formatter (l/local-now)) date)
         isinto (json/read-str isinto)
         results (db/getregistedpersonbyrange start limit bgno endno now isunit isinto)
         test (println results)
         res (map #(conj {:itemnums (:counts (first (db/getafterRegistnums (:relationid %))))
                          } %) results)
         nums  (:counts (first (db/getregistedpersonbyrangenums bgno endno now isunit isinto)))
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
    ;(db/outcheck (:check_date pation) (:blh_no pation))
    (db/updateregistRelation {:status 0} relationid)
    (resp/json {:success true})
    )


)
(defn intocheck [relationid]

  (let [
         pation (first (db/getregistedpersonbyid relationid))
         timenow (if(nil?(:times pation)) 0 (:times pation))
         ;items (db/getregistedcheckitems 0 10000 nil relationid)
         ]
    (db/updateregistRelation {:status 1} relationid)
      (db/updatepation {:times (+ timenow 1)} (:id  pation))
    #_(dorun (map #(db/addnewintocheck {
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
                 email birthday unitname duty title checkday isunit  unitid groupid]

  (let [
         pation (first (db/getpationbyblh blh_no))
         isexists (> (count pation) 0)
         newid (when-not isexists (db/addnewpation {:blh_no blh_no :name name
                                              :sex sex :marry marry
                                              :address address :telephone telephone
                                              :email email :birthday birthday   :isunit isunit
                                              :unitname unitname :duty duty :title title
                                              }))
         pationid (if (nil? newid) (:id pation) (first (vals newid)))
         registered (db/getrelationbypationid pationid checkday)
         ]

    (when (= (count registered) 0) (let [newid (db/addRegistRelation pationid checkday)
                                         relationid (first (vals newid))
                                         ]
                                     (when-not (nil? groupid)
                                       (let [
                                              items (db/getitemidbyunitgroup unitid groupid)
                                              filteritmes (map #(conj {} {:itemcode (:itemcode %)
                                                                          :packagecode (:packageid %)
                                                                          :relationid relationid
                                                                          }) items)
                                             ]
                                         (db/delregistedcheckitem relationid)
                                         (db/addregistedcheckitem filteritmes)

                                                                ))
                                     ))

    (resp/json {:success true :msg "新增病人信息成功" })


    )


  )

(defn getallcheckitems [start limit  totalname rowsname keywords]
  (let [results (db/getallcheckitems start limit  keywords)
        nums  (:counts (first (db/getallcheckitemnums keywords)))
        ]
    (resp/json (assoc {} rowsname results totalname nums))
    )

  )

(defn getsuggests [start limit  totalname rowsname deptid keywords]
  (let [results (db/getsuggests start limit deptid keywords)
        nums  (:counts (first (db/getsuggestnums deptid keywords)))
        ]
    (resp/json (assoc {} rowsname results totalname nums))
    )
  )
(defn getdeptconclusionbyrid [start limit  totalname rowsname deptid relationid]
  (let [results (db/getdeptconclusionbyrid start limit deptid relationid)
        nums  (:counts (first (db/getdeptconclusionbyridnums deptid relationid)))
        ]
    (resp/json (assoc {} rowsname results totalname nums))
    )
  )
(defn getdetailtips [start limit  totalname rowsname detailid]

  (let [results (db/getdetailtips start limit detailid)
        nums  (:counts (first (db/getdetailtipnums detailid )))
        ]
    (println results)
    (if (nil? rowsname)(resp/json results) (resp/json (assoc {} rowsname results totalname nums)))
    )
  )

(defn getpackages [start limit  totalname rowsname keywords]
  (let [results (db/getpackages start limit keywords )
        nums  (:counts (first (db/getpackagenums keywords)))
        ]
    (resp/json (assoc {} rowsname results totalname nums))
    )
  )

(defn getunitmembers [id start limit  totalname rowsname keywords]
  (let [results (db/getunitmembers id start limit keywords )
        nums  (:counts (first (db/getunitmembernums id keywords)))
        ]
    (resp/json (assoc {} rowsname results totalname nums))
    )
  )

(defn getpackageitems [id start limit  totalname rowsname keywords]
  #_(let [results (db/getunitmembers id start limit keywords )
        nums  (:counts (first (db/getunitmembernums id keywords)))
        ]
    (resp/json (assoc {} rowsname results totalname nums))
    )
  (resp/json (assoc {} rowsname [{:itemname 1111 :ck true :id 1}] totalname 1))
  )

(defn getpation [keywords isunit]
  (resp/json (db/getpation keywords (json/read-str isunit)))
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

(defn additemdetailtable [details]
  (let [
        items (json/read-str details :key-fn keyword)
        relationid (:relationid (first items))
        detailids (map #(:detailcode %) items)
        userid (session/get :userid)
        items (map #(conj {:userid userid} %) items)
        ]
    (with-db db/sqlitedb (transaction
                           (db/delitemdetailtable relationid detailids)
                           (db/additemdetailtable  items)
                           )
      )

    (resp/json {:success true})
    )
  )
(defn deldetailtips [tips]
  (let [items (json/read-str tips :key-fn keyword)]
    (dorun (map #(db/deldetailtip (:id %)) items))
    (resp/json {:success true})
    )
  )
(defn delsuggests [suggets]
  (let [items (json/read-str suggets :key-fn keyword)]
    (dorun (map #(db/delsuggest (:id %)) items))
    (resp/json {:success true})
    )
  )
(defn delcheckingitemsbyrid [ids]
  (let [items (json/read-str ids :key-fn keyword)]
    (dorun (map #(db/delrelationitems (:id %)) items))
    (resp/json {:success true})
    )
  )

(defn delcheckingitemsbyrids [rids itemcodes]
  (let [ids (json/read-str rids)
        codes (json/read-str itemcodes)
        ]
    (dorun (map #(db/delrelationitemsbyrid  % codes) ids))
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
(defn savecontolmsgbyrid [id relationid result suggestion other]
  (let [
         filelds {
                   :relatioid relationid :result result
                  :suggestion suggestion :other other
                  }
        ]
    (if (or (nil? id)(= id ""))(db/insertcontolmsgbyrid
                                 filelds

                                 )(db/savecontolmsgbyrid filelds id))
    )

  (resp/json {:success true})
  )
(defn getcontolmsgbyrid [relationid]

  (resp/json (db/getcontolmsgbyrid relationid))
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
(defn addsuggessionbyrid [items]
  (let [items (json/read-str items :key-fn keyword)]
    (db/addsuggessionbyrid items)
    (resp/json {:success true})
    )
  )
(defn delsuggessuonbyrid [delids]
  (let [ids (json/read-str delids :key-fn keyword)]
    (db/delsuggessuonbyrid ids)
    (resp/json {:success true})
    )
  )

(defn addnewsuggests [suggets]
  (let [items (json/read-str suggets :key-fn keyword)]
    (dorun (map #(db/addnewsuggest %) items))
    (resp/json {:success true})
    )

  )
(defn adddetailtips [tips]
  (let [items (json/read-str tips :key-fn keyword)]
    (println items)
    (db/adddetailtip  items)
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
(defn editsuggests [suggets]
  (let [items (json/read-str suggets :key-fn keyword)]
    (dorun (map #(do (println % (:id %))(db/editsuggest % (:id %))) items))
    (resp/json {:success true})
    )

  )
(defn editdetailtips [tips]
  (let [items (json/read-str tips :key-fn keyword)]
    (dorun (map #(db/editdetailtip % (:id %)) items))
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





