(defproject
  examination
  "0.1.0-SNAPSHOT"
  :repl-options
  {:init-ns examination.repl}
  :dependencies
  [[ring-server "0.3.1"]
   [noir-exception "0.2.2"]
   [environ "1.0.0"]
   [com.taoensso/timbre "3.3.1"]
   [markdown-clj "0.9.54"]
   [selmer "0.7.1"]
   [org.clojure/clojure "1.6.0"]
   [prone "0.6.0"]
   [com.taoensso/tower "3.0.2"]
   [log4j
    "1.2.17"
    :exclusions
    [javax.mail/mail
     javax.jms/jms
     com.sun.jdmk/jmxtools
     com.sun.jmx/jmxri]]
   [korma "0.4.0"]
   [im.chit/cronj "1.4.2"]
   [lib-noir "0.9.1"]
   [com.h2database/h2 "1.4.181"]]
  :ring
  {:handler examination.handler/app,
   :init examination.handler/init,
   :destroy examination.handler/destroy}
  :profiles
  {:uberjar {:aot :all},
   :production
   {:ring
    {:open-browser? false, :stacktraces? false, :auto-reload? false}},
   :dev
   {:dependencies
    [[ring-mock "0.1.5"]
     [ring/ring-devel "1.3.1"]
     [pjstadig/humane-test-output "0.6.0"]],
    :injections
    [(require 'pjstadig.humane-test-output)
     (pjstadig.humane-test-output/activate!)],
    :env {:dev true}}}
  :url
  "http://example.com/FIXME"
  :jvm-opts
  ["-server"]
  :plugins
  [[lein-ring "0.8.12"] [lein-environ "0.5.0"] [lein-ancient "0.5.5"]]
  :description
  "FIXME: write description"
  :min-lein-version "2.0.0")