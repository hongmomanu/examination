(ns examination.routes.maintain
  (:use compojure.core)

  (:require [examination.layout :as layout]
            [examination.util :as util]
            [examination.controller.maintain :as maintain]
            [clj-http.client :as client]

            ))



(defroutes maintain-routes

  (POST "/maintain/gettreeitem" [node roleid callback] (maintain/gettreeitem node roleid callback))

  )
