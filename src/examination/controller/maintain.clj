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

(defn gettreeitem [node roleid callback]

  (if (= node "-1")(resp/json [{:id 1 :text "体检科室" :value "体检科室" :children [{:text "体检科室" :value "体检科室"}] }])(resp/json {:text "wu" :value "wu"}))
  #_(let [

         results (db/getfuncsbypid node)
         roleid (auth/getroleid roleid)
         funcids (into [](map #(:funcid %) (db/getfuncsbyid roleid)))
         resultsformat (map #(auth/functreeformat % funcids) results)

         ]
    (if (nil? callback) (resp/json resultsformat)(resp/jsonp callback resultsformat))
    )
  )





