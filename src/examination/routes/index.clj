(ns examination.routes.index
  (:use compojure.core)

  (:require [examination.layout :as layout]
            [examination.util :as util]
            [examination.controller.index :as lindex]
            [clj-http.client :as client]

            ))



(defroutes index-routes

  (GET "/index/addindex" [text indexname] (lindex/addindex text indexname))
  (GET "/index/searchindex" [text indexname] (lindex/searchindex text indexname))
  (GET "/index/delindex" [id indexname] (lindex/delindex id indexname))
  (GET "/index/updateindex" [id text indexname] (lindex/updateindex id text indexname))
  (GET "/index/makeindexfromdb" [dbtype address user pass table idfield indexfields indexname]
    (lindex/makeindexfromdb dbtype address user pass table idfield indexfields indexname)
    )
  (GET "/index/searchtest" [] (lindex/index-searchtest))
  )
