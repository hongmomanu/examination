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

(declare users roles functorole functions enumerate divisions systemlog)

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
(defn getdepts [start limits keyword]
  (select checkdept

    (fields :deptname :depttype :id :pycode  )

    (where {:deptname [like (str "%" (if (nil? keyword)"" keyword) "%")]})
    (limit limits)
    (offset start))
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
(defn savedivision [fields divisionid]
  (update divisions
    (set-fields fields)
    (where {:id divisionid})
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