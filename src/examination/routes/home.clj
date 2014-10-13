(ns examination.routes.home
  (:require [compojure.core :refer :all]
            [examination.layout :as layout]
            [noir.session :as session]
            [noir.response :as resp]
            [examination.controller.auth :as auth]
            [examination.util :as util]))

(defn home-page []
  (layout/render
    "home.html" {:content (util/md->html "/md/docs.md")}))
(defn main-page []
  (let [
         content (auth/getapps)
         userid   (:userid content)
         roleid   (:roleid content)
         ]
    (if (nil? userid)
      (layout/render
        "login.html" {:login-error  (session/get :login-error)})
      (layout/render "main.html"
        {:userid userid :roleid roleid}
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
  (GET "/" [] (main-page))
  (GET "/login" [] (login-page))
  (GET "/about" [] (about-page)))
