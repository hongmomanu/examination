(ns examination.routes.home
  (:require [compojure.core :refer :all]
            [examination.layout :as layout]
            [noir.session :as session]
            [noir.response :as resp]
            [noir.io :as io]
            [examination.controller.auth :as auth]
            [examination.util :as util]))

(defn home-page []
  (layout/render
    "home.html" {:content (util/md->html "/md/docs.md")}))
(defn main-page [name]
  (let [
         content (auth/getapps)
         userid   (:userid content)
         roleid   (:roleid content)
         displayname   (:displayname content)
         ]
    (if (nil? userid)
      (layout/render
        "login.html" {:login-error  (session/get :login-error)})
      (layout/render name
        {:userid userid :roleid roleid :displayname displayname}
         ) )
    )
  )
(defn login-page []
  (layout/render
    "login.html" )
  )
(defn about-page []
  (layout/render "about.html"))

(defroutes home-routes
  (GET "/" [] (main-page "main.html"))
  (GET "/maintab" [] (main-page "maintab.html"))
  (GET "/login" [] (login-page))
  (GET "/test1" []
    (layout/render "maintab.html"
      {:htmlpath "text!views/doctorcheckpanel.htm" :jspath  "views/doctorcheckpanel"}
      )
                    )
  (GET "/about" [] (about-page)))
