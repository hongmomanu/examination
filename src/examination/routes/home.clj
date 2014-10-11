(ns examination.routes.home
  (:require [compojure.core :refer :all]
            [examination.layout :as layout]
            [examination.util :as util]))

(defn home-page []
  (layout/render
    "home.html" {:content (util/md->html "/md/docs.md")}))
(defn main-page []
  (layout/render
    "main.html" )
  )
(defn about-page []
  (layout/render "about.html"))

(defroutes home-routes
  (GET "/" [] (main-page))
  (GET "/about" [] (about-page)))
