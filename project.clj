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

   [org.clojure/data.json "0.2.5"]

   [org.apache.lucene/lucene-core "4.3.1"]
   [org.apache.lucene/lucene-highlighter "4.2.0"]
   [com.chenlb.mmseg4j/mmseg4j-core "1.10.0"]
   [com.chenlb.mmseg4j/mmseg4j-analysis "1.9.1"]



   [org.xerial/sqlite-jdbc "3.7.15-M1"]
   [com.oracle/ojdbc6 "11.2.0.3"]
   [postgresql/postgresql "9.1-901.jdbc4"]
   [org.mariadb.jdbc/mariadb-java-client "1.1.7"]
   [net.sourceforge.jtds/jtds "1.2.4"]  ;;sqlserver jdbc

   [clj-http "0.9.2"]
   [me.raynes/fs "1.4.5"]


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
  :repositories [
                  ["java.net" "http://download.java.net/maven/2"]
                  ["nexus" "https://code.lds.org/nexus/content/groups/main-repo"]
                  ["sonatype" {:url "http://oss.sonatype.org/content/repositories/releases"
                               ;; If a repository contains releases only setting
                               ;; :snapshots to false will speed up dependencies.
                               :snapshots false
                               ;; Disable signing releases deployed to this repo.
                               ;; (Not recommended.)
                               :sign-releases false
                               ;; You can also set the policies for how to handle
                               ;; :checksum failures to :fail, :warn, or :ignore.
                               :checksum :fail
                               ;; How often should this repository be checked for
                               ;; snapshot updates? (:daily, :always, or :never)
                               :update :always
                               ;; You can also apply them to releases only:
                               :releases {:checksum :fail :update :always}}]

                  ]
  :description
  "FIXME: write description"
  :min-lein-version "2.0.0")