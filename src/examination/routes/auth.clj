(ns examination.routes.auth
  (:require [compojure.core :refer :all]
            [examination.layout :as layout]
            [examination.util :as util]
            [noir.session :as session]
            [noir.response :as resp]
            [noir.validation :as vali]
            [noir.util.crypt :as crypt]
            [examination.controller.auth :as auth]

            ))

(defroutes auth-routes
  (GET "/register" []
    (auth/register))

  (GET "/auth/sessioncheck" []
    (auth/sessioncheck)
    )
  (GET "/auth/getsessionid" req
    (auth/getsessionid req)
    )
  (GET "/auth/getsessionidjs" req
    (auth/getsessionidjs req)
    )

  (POST "/register" [username password pass1]
    (auth/handle-registration username password pass1))

  (GET "/profile" [] (auth/profile nil))

  (POST "/update-profile" {params :params} (auth/update-profile params))

  (POST "/login" [username password]
    (auth/handle-login username password))
  (GET "/login" [username password]
    (auth/handle-login username password))

  (POST "/auth/getfuncsbyrole" [type roleid callback]
    (auth/getfuncsbyroletouter type roleid callback))

  (GET "/auth/getfuncsbyrole" [type roleid callback]
    (auth/getfuncsbyroletouter type roleid callback))

  (GET "/auth/getenumbytype" [type  callback]
    (auth/getenumbytype type  callback))
  (POST "/auth/getenumbytype" [type  callback]
    (auth/getenumbytype type  callback))
  (POST "/auth/edituser" [username displayname password usercode deptids id ]
    (auth/edituser username displayname password usercode deptids id )
    )
  (POST "/auth/editdept" [deptname depttype pycode  id]
    (auth/editdept deptname depttype pycode  id)
    )
  (POST "/auth/getusers" [start limit  totalname rowsname keyword]
    (auth/getusers start limit  totalname rowsname keyword))

  (POST "/auth/getdepts" [start limit  totalname rowsname keyword]
    (auth/getdepts start limit  totalname rowsname keyword))

  (POST "/auth/addnewuser" [username displayname  password divisionid roleid]
    (auth/addnewuser username displayname  password divisionid roleid))

  (POST "/auth/gettreefunc" [node roleid callback]
    (auth/gettreefunc node roleid callback))



  (GET "/auth/gettreefunc" [node roleid callback]
    (auth/gettreefunc node roleid callback))

  (GET "/auth/gettreedivision" [node  callback]
    (auth/gettreedivision node  callback))

  (GET "/files/:filename" [filename]
    (auth/getuploadfile filename)
    )

  (POST "/auth/getsessionuserinfo"[]
    (auth/getsessionuserinfo)
    )

  (POST "/auth/editdivision" [divisionname signaturepath divisionid parentid divisionpath]
    (auth/savedivision divisionname signaturepath divisionid parentid divisionpath)

    )

  (POST "/auth/gettreedivision" [node  callback]
    (auth/gettreedivision node  callback))
  (POST "/auth/adddivision" [divisionid divisionname signaturepath divisionpath]
    (auth/adddivision divisionid divisionname signaturepath divisionpath))
  (POST "/auth/deldivision" [divisionid]
    (auth/deldivision divisionid))

  (POST "/auth/delrole" [roleid]
    (auth/delrole roleid))



  (POST "/auth/editfunc" [funcname label funcid pid imgcss sortnum]
    (auth/editfunc funcname label funcid pid imgcss sortnum))

  (POST "/auth/editenum" [enumeratelabel enumeratetype enumeratevalue id]
    (auth/editenum enumeratelabel enumeratetype enumeratevalue id))

  (POST "/auth/addnewfunc" [funcname label funcid  imgcss sortnum]
    (auth/addfunc funcname label funcid  imgcss sortnum))

  (POST "/auth/delfunc" [funcid]
    (auth/delfunc funcid))

  (POST "/auth/makerolefunc" [roleid deleteid funcid]
    (auth/makerolefunc roleid deleteid funcid))


  (POST "/auth/getroles" [start limit totalname rowsname keyword]
    (auth/getroles start limit  totalname rowsname keyword))

  (POST "/auth/getlogs" [start limit totalname rowsname keyword bgtime edtime]
    (auth/getlogs start limit  totalname rowsname keyword bgtime edtime))

  (POST "/auth/delenum" [id]
    (auth/delenum id))
  (POST "/auth/deluser" [id]
    (auth/deluser id))
  (POST "/auth/deldept" [id]
    (auth/deldept id))

  (POST "/auth/addnewrole" [rolename]
    (auth/addnewrole rolename))


  (POST "/auth/addnewenum" [enumlabel enumtype enumvalue]
    (auth/addnewenum enumlabel enumtype enumvalue))

  (POST "/auth/getenums" [start limit totalname rowsname keyword]
    (auth/getenums start limit totalname rowsname keyword))

  (GET "/auth/getenumskey" [keyword callback]
    (auth/getenumskey keyword callback))

  (GET "/auth/addlog" [logcontent userid callback]
    (auth/addlog logcontent userid callback))

  (GET "/auth/proxy" req
    (auth/getproxy req))
  (POST "/auth/proxy" req
    (auth/postproxy req))

  (POST "/auth/addnewdept" [deptname pycode depttype]
    (auth/addnewdept deptname pycode depttype)
    )

  (POST "/auth/uploadfile"  [file]

    (auth/uploadfile file)
    )

  (GET "/auth/proxylogin" req
    (let [{:keys [params query-string]} req]
      (auth/proxylogin (:loginurl params) (:viewurl params) (:loginparams params)
        (:method params) (:proxykey params) (:baseurl params) query-string)

      )


    )
  (GET "/authcrossdomain/proxylogin" req
    (let [{:keys [params query-string]} req]
      (auth/proxylogin (:loginurl params) (:viewurl params) (:loginparams params)
        (:method params) (:proxykey params) (:baseurl params) query-string)

      )
    )



  (GET "/authcrossdomain/simpleproxy" [loginurl method loginparams]
    (auth/simpleproxy loginurl method loginparams)
    )




  (GET "/logout" []
    (auth/logout)))
