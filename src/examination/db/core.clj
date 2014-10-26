(ns examination.db.core
  (:use korma.core
        [korma.db :only [defdb with-db]])
  (:require [examination.db.schema :as schema]
            ))

(defdb db schema/db-spec)
(defdb mysqldb schema/db-mysql)
(defdb sqlitedb schema/db-spec-sqlite)

(defdb postgresdb schema/db-postgres)

(defdb sqlserverdb schema/db-sqlserver)

(defdb dboracle schema/db-oracle)

(declare users roles functorole functions enumerate divisions
         systemlog registRelation patientMainIndex checkitem
        examinationPackage
  )

(defentity t_doorplate
  (database dboracle)
  )

(defentity users
  (pk :roleid)
  (has-one roles {:fk :id})
  (database sqlitedb)
  )
(defentity roles
  (has-many functorole {:fk :roleid})
  (database sqlitedb)
  )
(defentity functorole
  (pk :funcid)
  (has-one functions {:fk :id})
  (database sqlitedb)
  )
(defentity functions

  (database sqlitedb)
  )
(defentity checkdept

  (database sqlitedb)
  )
(defentity deptCustomDescript

  (database sqlitedb)
  )
(defentity checkItemDetail

  (database sqlitedb)
  )

(defentity afterRegist
  (pk :relationid)
  (belongs-to checkitem {:fk :itemcode})
  (belongs-to examinationPackage {:fk :packagecode})

  (database sqlitedb)
  )
(defentity beforeRegist
  (database sqlitedb)
  )

(defentity registRelation
  (pk :pation_no)
  (has-one patientMainIndex {:fk :id})
  (database sqlitedb)
  )

(defentity patientMainIndex
  ;;(pk :id)
  ;;(has-many afterRegist {:fk :pation_no})
  ;;(has-many beforeRegist {:fk :pation_no})
  (database sqlitedb)
  )
(defentity unitWithGroupAndItem

  (database sqlitedb)
  )
(defentity unitWithGroup

  (database sqlitedb)
  )
(defentity examinationPackage

  (database sqlitedb)
  )
(defentity packageWithItem
  (belongs-to checkitem {:fk :itemcode})
  (database sqlitedb)
  )

(defentity controlItemDescript

  (database sqlitedb)
  )

(defentity examinationMember

  (database sqlitedb)
  )

(defentity examinationUnit
  (database sqlitedb)
  )
(defentity chargeDetail
  (belongs-to checkitem {:fk :itemcode})
  (database sqlitedb)
  )
(defentity checkitem
  ;(pk :id)
  (belongs-to checkdept {:fk :deptid})
  (database sqlitedb)
  )
(defentity enumerate
  (entity-fields :enumeratetype :enumeratevalue :enumeratelabel :id)
  (database sqlitedb)
  )
(defentity divisions
  (database sqlitedb)
  )
(defentity systemlog
  (pk :userid)
  (has-one users {:fk :id})
  (database sqlitedb)
  )

(defn create-user [user]
  (insert users
    (values user)))

(defn addnewunit [unit]
  (insert examinationUnit
    (values unit))
  )

(defn adddept [dept]
  (insert checkdept
    (values dept)
    )
  )

(defn update-user [id passwordold passwordnew]
  (update users
    (set-fields {:password passwordnew
                 })
    (where {:id id})))

(defn updateuser [fields id]
  (update users
    (set-fields fields)
    (where {:id id})
    )
  )
(defn updatedept [fields id]
  (update checkdept
    (set-fields fields)
    (where {:id id})
    )
  )

(defn outcheck [date blhno]
  (delete chargeDetail
    (where (and
             {:blh_no blhno}
             {:inspect_date date}
             ))
    )
  )
(defn getchargeDetailbyblhno [date blhno]

  (select chargeDetail
    (where (and
             {:blh_no blhno}
             {:inspect_date date}
             ))
    )

  )
(defn getpation [keyword isunit]
  (select patientMainIndex
    (where (and {:blh_no [like (str "%" (if (nil? keyword)"" keyword) "%")]}
             {:isunit [in is]}
             ))
    )

  )
(defn getpationbyblh [blh]
  (select patientMainIndex
    (where {:blh_no  blh})
    )
  )

(defn addnewpation [fields]
  (insert patientMainIndex
    (values fields)
    )
 )

(defn savepation [fields blh_no]
  (update patientMainIndex
    (set-fields fields)
      (where {:blh_no blh_no})
    )
  )

(defn getafterRegistnums [id]
  (select afterRegist
    (where {:relationid id} )
    (aggregate (count :id) :counts)
    )
  )

(defn getusers [start limits keyword]
  (select users

    (fields :username :password :id :roleid :time :displayname :usercode :deptids)
    (with roles
      (fields :rolename )
      )
    (where {:username [like (str "%" (if (nil? keyword)"" keyword) "%")]})
    (limit limits)
    (offset start))
  )
(defn getunits [start limits keyword]
  (select examinationUnit
    (where {:unitname [like (str "%" (if (nil? keyword)"" keyword) "%")]})
    (limit limits)
    (offset start))
  )


(defn getunitgroupperson [ start limits  keyword fields downbirth upbirth]
  (select examinationMember
    (where (and {:cardnum [like (str "%" (if (nil? keyword)"" keyword) "%")]}
                fields
             {:birthday [<= downbirth]}
             {:birthday [>= upbirth]}
             ))
    (limit limits)
    (offset start))
  )

(defn getunitgrouppersonnums [keyword fields downbirth upbirth]

  (select examinationMember
    (where (and {:cardnum [like (str "%" (if (nil? keyword)"" keyword) "%")]}
             fields
             {:birthday [<= downbirth]}
             {:birthday [>= upbirth]}
             ))
    (aggregate (count :id) :counts)
    )
  )

(defn addregistedcheckitem [fields]
  (insert afterRegist
    (values fields)
    )

  )
(defn delregistedcheckitem  [relationid]

  (delete afterRegist
    (where {:relationid relationid})
    )
  )

(defn getregistedcheckitems [start limits keyword relationid]
  (select afterRegist
    (with checkitem
      (fields :itemname :price [:id :itemcode])
      (with checkdept
        (fields :deptname [:id :deptid])
        )
      )
    (with examinationPackage
      (fields :packagename)
      )
    (where (and {:relationid relationid}
             ;;{:itemname [like (str "%" (if (nil? keyword)"" keyword) "%")]}
             ))
    (limit limits)
    (offset start)
    )

  )

(defn getcheckingitems [start limits chec blh_no]
  (select chargeDetail
    (with checkitem
      (fields :itemname :price )
      (with checkdept
        (fields :deptname )
        )
      )
    (where (and {:blh_no blh_no}
             ;;{:itemname [like (str "%" (if (nil? keyword)"" keyword) "%")]}
             ))
    (limit limits)
    (offset start)
    )

  )
(defn getcheckingitemnums [keyword blh_no]
  (select chargeDetail
    (where (and {:blh_no blh_no}
             ;{:itemname [like (str "%" (if (nil? keyword)"" keyword) "%")]}
             ))
    (aggregate (count :id) :counts)
    )

  )


(defn getregistedpersonbyid [relationid]
  (select registRelation
    (fields [:id :relationid] :check_date)
    (with patientMainIndex
      (fields :id :blh_no :name :sex :times)
      )
    (where {:id relationid} )
    )
  )
(defn updatepation [fileds id]
  (update patientMainIndex
    (set-fields fileds)
    (where {:id id})
    )
  )
(defn addnewintocheck [fields]
  (insert chargeDetail
    (values fields)
    )
  )
(defn getregistedperson [start limits keyword now isunit]

  (select registRelation
    (fields [:id :relationid] :status)
    (with patientMainIndex
      (fields :id :blh_no :name :sex :address)
      (where (and
               {:blh_no [like (str "%" (if (nil? keyword)"" keyword) "%")]}
               {:isunit isunit}
               ))
      )
    (where {:check_date now} )
    (limit limits)
    (offset start)
    )

  )
(defn addRegistRelation [pationid check_date]
  (insert registRelation
    (values {:pation_no pationid :check_date check_date})
    )
  )
(defn updateregistRelation [fields relationid]
  (update registRelation
    (set-fields fields)
    (where {:id relationid})
    )
  )
(defn getrelationbypationid [pationid check_date]
  (select registRelation
    (where (and
             {:pation_no pationid}
             {:check_date check_date}
             ))
    )
  )
(defn getregistedcheckitemnums [keyword relationid]
  (select afterRegist
    (where (and {:relationid relationid}
             ;{:itemname [like (str "%" (if (nil? keyword)"" keyword) "%")]}
             ))
    (aggregate (count :id) :counts)
    )
  )

(defn getregistedpersonnums [ keyword now isunit]

  (select registRelation
    (with patientMainIndex
      (where (and
               {:blh_no [like (str "%" (if (nil? keyword)"" keyword) "%")]}
               {:isunit isunit}
               ))
      )
    (where {:check_date now} )
    (aggregate (count :id) :counts)

    )
  )
(defn getsuggests [start limits deptid keyword]
  (select deptCustomDescript
    (where (and
             {:name [like (str "%" (if (nil? keyword)"" keyword) "%")]}
             {:deptid deptid}
             ))
    (limit limits)
    (offset start))
  )
(defn getitemidbypackage [pid]
  (select packageWithItem
    (with checkitem
      (with checkdept
        (fields :deptname)
        )
      )

    (where {:packageid pid})
    )
  )
(defn getitemsbycontroltype [type]
  (select controlItemDescript
    (where {:type type})
    )
  )
(defn getitemidbyunitgroup [unitid groupid]
  (select unitWithGroupAndItem
    (where (and
             {:unitid unitid}
             {:groupid groupid}
             ))
    )
  )
(defn getgroupsbyunit [unitid]
  (select unitWithGroup
    (where {:unitid unitid})
    )
  )
(defn delitembypid [packageid itemid]
  (delete packageWithItem
    (where (and {:packageid packageid }
             {:itemcode itemid}
             ))
    )
  )
(defn insertitembypid  [packageid itemid]
  (insert packageWithItem
    (values {:packageid packageid :itemcode itemid})
    )
  )
(defn getpackages [start limits keyword]
  (select examinationPackage
    (where {:packagename [like (str "%" (if (nil? keyword)"" keyword) "%")]})
    (limit limits)
    (offset start))
  )
(defn getunitmembers [id start limits keyword]
  (select examinationMember
    (where (and {:membername [like (str "%" (if (nil? keyword)"" keyword) "%")]}
             {:unitid id}
             )

      )
    (limit limits)
    (offset start))
  )
(defn getdepts [start limits keyword]
  (select checkdept

    (fields :deptname :depttype :id :pycode  )

    (where {:deptname [like (str "%" (if (nil? keyword)"" keyword) "%")]})
    (limit limits)
    (offset start))
  )

(defn getcheckitem [deptid]
  (select checkitem
    (fields :itemname :price :id :pycode :sortnum )
    (where {:deptid deptid})
    )

  )
(defn getcheckitemdetail [itemid]
  (select checkItemDetail
    (fields :itemdetailname :itemid :unit :uplimit :std_mess :up_mess :down_mess :sortnum :downlimit :id :pycode  )
    (where {:itemid itemid})
    )

  )

(defn deluser [userid]
  (delete users
    (where {:id userid})
    )
  )
(defn deldept [deptid]
  (delete checkdept
    (where {:id deptid})
    )
  )

(defn getenumskey [keyword ]
  (select enumerate
    (where {:enumeratetype [like (str "%" (if (nil? keyword)"" keyword) "%")]})
    )
  )
(defn getenums [keyword start limits]
  (select enumerate
    (where {:enumeratetype [like (str "%" (if (nil? keyword)"" keyword) "%")]})
    (limit limits)
    (offset start))
  )
(defn getroles [keyword start limits]

  (select roles
    (where {:rolename [like (str "%" (if (nil? keyword)"" keyword) "%")]})
    (limit limits)
    (offset start))

  )
(defn getlogs [keyword start limits bgtime edtime]

  (select systemlog
    (with users
      (fields :username )
      )
    (where (and {:logcontent [like (str "%" (if (nil? keyword)"" keyword) "%")]
                 }
             {:time [>= (sqlfn timestamp bgtime)]}
             {:time [<= (sqlfn timestamp edtime)]}
             ))
    (limit limits)
    (offset start))

  )
(defn getitemnums [id]
  (select checkitem
    (where {:deptid id})
    (aggregate (count :id) :counts)
    )

  )
(defn getitemdetailnums [id]
  (select checkItemDetail
    (where {:itemid id})
    (aggregate (count :id) :counts)
    )

  )
(defn getenumnums [keyword]

  (select enumerate
    (where {:enumeratetype [like (str "%" (if (nil? keyword)"" keyword) "%")]})
    (aggregate (count :id) :counts)
    )
  )
(defn getrolenums [keyword]

  (select roles
    (where {:rolename [like (str "%" (if (nil? keyword)"" keyword) "%")]})
    (aggregate (count :id) :counts)
    )
  )
(defn addlog [logcontent userid]
  (insert systemlog
    (values {:userid userid :logcontent logcontent})
    )

  )
(defn addnewunitgroup [fields]
  (insert unitWithGroup
    (values fields)
    )

  )
(defn savedivision [fields divisionid]
  (update divisions
    (set-fields fields)
    (where {:id divisionid})
    )
  )
(defn updateitem [fields itemid]
  (update checkitem
    (set-fields fields)
    (where {:id itemid})
    )
  )
(defn editcheckitemdetail [fields id]
  (update checkItemDetail
    (set-fields fields)
    (where {:id id})
    )
  )

(defn editcontrolitem [fields id]
  (update controlItemDescript
    (set-fields fields)
    (where {:id id})
    )
  )

(defn editunit [fields id]
  (update examinationUnit
    (set-fields fields)
    (where {:id id})
    )
  )
(defn editunitgroup [fields id]
  (update unitWithGroup
    (set-fields fields)
    (where {:id id})
    )
  )
(defn delunitgroup [id]
  (delete unitWithGroup
    (where {:id id})
    )
  )
(defn editpackage [fields id]
  (update examinationPackage
    (set-fields fields)
    (where {:id id})
    )
  )
(defn editunitmember [fields id]
  (update examinationMember
    (set-fields fields)
    (where {:id id})
    )
  )

(defn getlognums [keyword bgtime edtime]

  (select systemlog
    (where (and {:logcontent [like (str "%" (if (nil? keyword)"" keyword) "%")]
                 }
             {:time [>= (sqlfn timestamp bgtime)]}
             {:time [<= (sqlfn timestamp edtime)]}
             ))
    (aggregate (count :id) :counts)
    )
  )
(defn getusernums [keyword]
  (select users
    (where {:username [like (str "%" (if (nil? keyword)"" keyword) "%")]})
    (aggregate (count :id) :counts)
    )
  )
(defn getpackagenums [keyword]
  (select examinationPackage
    (where {:packagename [like (str "%" (if (nil? keyword)"" keyword) "%")]})
    (aggregate (count :id) :counts)
    )
  )
(defn getunitnums [keyword]
  (select examinationUnit
    (where {:unitname [like (str "%" (if (nil? keyword)"" keyword) "%")]})
    (aggregate (count :id) :counts)
    )
  )
(defn getsuggestnums [deptid keyword]
  (select deptCustomDescript
    (where (and
             {:name [like (str "%" (if (nil? keyword)"" keyword) "%")]}
             {:deptid deptid}
             )
      )
    (aggregate (count :id) :counts)

  ))

(defn getunitmembernums [id keyword ]
  (select examinationMember
    (where (and {:membername [like (str "%" (if (nil? keyword)"" keyword) "%")]}
             {:unitid id}
             ))
    (aggregate (count :id) :counts)
    )
  )

(defn getdeptnums [keyword]
  (select checkdept
    (where {:deptname [like (str "%" (if (nil? keyword)"" keyword) "%")]})
    (aggregate (count :id) :counts)
    )
  )
(defn get-user [user]
  (first (select users

           (fields :username :password :id :roleid :displayname)
           (with roles
             (fields :rolename )
             )
           (where {:username user})
           (limit 1))))

(defn get-apps [roleid]
  (select functorole
    (with functions
      (fields :label :funcname :imgcss)
      (where {:pid -1} )
      )
    (where {:roleid roleid} )
    )
  )

(defn delcheckitem [itemid]
  (delete checkitem
    (where {:id itemid})
    )
  )
(defn delpackage [pid]
  (delete examinationPackage
    (where {:id pid})
    )
  )
(defn delgroupitembyid [unitid groupid itemid]
  (delete unitWithGroupAndItem
    (where (and {:unitid unitid} {:groupid groupid} {:itemcode itemid}))
    )
  )
(defn insertgroupitembyid [unitid groupid itemid]
  (insert unitWithGroupAndItem
    (values {:unitid unitid :groupid groupid :itemcode itemid})
    )
  )
(defn delunitmember [memberid]
  (delete examinationMember
    (where {:id memberid})
    )
  )
(defn delunit [unitid]
  (delete examinationUnit
    (where {:id unitid})
    )
  )
(defn delcheckitemdeatil [id]
  (delete checkItemDetail
    (where {:id id})
    )
  )
(defn delrolefucbyid [roleid funcid]
  (delete functorole
    (where {:roleid roleid :funcid funcid} )
    )

  )
(defn deldivision [divisionid]
  (delete divisions
    (where {:id divisionid})
    )
  )
(defn delrole [roleid]
  (delete roles
    (where {:id roleid})
    )
  )
(defn getfuncsbyid [roleid]

  (select functorole
    (with functions
      (fields :label :funcname )
      )
    (where {:roleid roleid} )
    )
  )
(defn isrolehasfunc [roleid funcid]

  (select functorole
    (where {:roleid roleid :funcid funcid} )
    )
  )

(defn insertrolefucbyid [roleid funcid]
  (insert functorole
    (values {:roleid roleid :funcid funcid})
    )
  )

(defn getfuncsbytype [type]

  (select functions
    (fields :id)
    (where {:funcname type})
    )
  )

(defn delfunc [funcid]
  (delete functions
    (where {:id funcid})
    )
  )
(defn delenum [enumid]
  (delete enumerate
    (where {:id enumid})
    )
  )
(defn getfuncsbypid [pid]
  (select functions
    (fields :id [:funcname :text] :pid [:label :value] :imgcss :sortnum)
    (where {:pid pid})
    )
  )

(defn getdivisionsbypid [pid]
  (select divisions
    (fields :id [:divisionname :text] :parentid [:divisionpath :value] :divisionpath :signaturepath)
    (where {:parentid pid})
    )

  )
(defn getdivisionbypath [path]
  (select divisions
    (fields :id)
    (where {:divisionpath path})
    )
  )
(defn updatefunc [fields funcid]
  (update functions
    (set-fields fields)
    (where {:id funcid}))

  )
(defn updateenum [fields enumid]
  (update enumerate
    (set-fields fields)
    (where {:id enumid}))
  )

(defn addfunc [fields]
  (insert functions
    (values fields)
    )
  )
(defn addrole [rolename]
  (insert roles
    (values {:rolename rolename})
    )
  )

(defn addenumerate [fields]
  (insert enumerate
    (values fields)
    )
  )
(defn addnewitem [fields]
  (insert checkitem
    (values fields)
    )
  )
(defn addnewcontrolitem [fields]
  (insert controlItemDescript
    (values fields)
    )
  )
(defn addnewunitmember [fields]
  (insert examinationMember
    (values fields)
    )
  )
(defn addnewsuggest [fields]
  (insert deptCustomDescript
    (values fields)
    )
  )
(defn addnewunitpackage [fields]
  (insert examinationPackage
    (values fields)
    )
  )

(defn addnewcheckitemdetail [fields]
  (insert checkItemDetail
    (values fields)
    )
  )


(defn adddivision [fields]
  (insert divisions
    (values fields)
    )
  )

(defn getenumeratebytype [type]
  (select enumerate
    (where {:enumeratetype type})
    )
  )

(defn fields-test []
  (let [fieldsQuery enumerate]
    (:fields fieldsQuery))

  )
(defn postgres-test[]

  (with-db postgresdb
    (exec-raw ["SELECT 1 WHERE 1 = ? " [1]] :results))
  )
(defn mysql-test[]

  (with-db mysqldb
    (exec-raw ["SELECT 2222 " []] :results))
  )
(defn sqlserver-test[]

  (with-db sqlserverdb
    (exec-raw ["SELECT 2 WHERE 1 = ? " [1]] :results))
  )



(defn oracltest [pageids]
  (with-db dboracle
    (select t_doorplate (where {:id [in pageids]})))
  )

#_(defn oraclepage []
  (with-db dboracle
    (exec-raw [(hvitmd/create-oraclequery-paging {:table "t_doorplate" :properties ["id"] :order ["id"] :from 12 :max 14} ) []] :results))
  )