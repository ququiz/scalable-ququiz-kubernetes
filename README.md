# Scalable Ququiz
QuQuiz adalah aplikasi kuis online scalable yang melayani pembuatan kuis yang akan tersedia bagi seluruh pengguna. QuQuiz menyediakan fitur scoring real-time sekaligus dapat menampilkan leaderboard real-time. Setiap pengguna dapat melakukan manajemen kuis lengkap dengan scheduling akan kapan quiz akan dimulai dan ditutup. Saat ini, QuQuiz masih terbatas dengan hanya menyediakan pembuatan soal pilihan ganda.


# List
- [Architecture](#Architecture)
- [Anggota Kelompok](#Anggota-Kelompok)
- [Deployment Scenario](#Deployment-Scenario)
- [Code Repository](#Code-Repository)
- [Quick Start](#QuickStart)
- [Testing](#Testing)
- [Dokumentasi](#Dokumentasi)


# Architecture
![microservices kubernetes](https://res.cloudinary.com/dex4u3rw4/image/upload/v1718547171/ququiz_scalable/ququiz_3_prrgnp.png)



# Flow architecture
![figma flow](https://res.cloudinary.com/dex4u3rw4/image/upload/v1718548611/ququiz_scalable/Architecture_V2_1_ugkrwt.png)



# Anggota-Kelompok
```
1. Andreas Notokusumo (Quiz Command Service)
2. Alexander Adam Mukhaer (Auth Service & Quiz Command Service)
3. David Lois (Frontend Ququiz)
4. Azhar Bagaskara (Notification Service)
5. Lintang Birda Saputra (Quiz Query Service, Scoring Service, Kubernetes Deployment)
```

# Deployment-Scenario
1. Multiple Kubernetes Node (beberapa vm cloud, vps, dan laptop Lintang). Cluster kubernetes dibuat menggunakan Kubespray dan Wireguard VPN. Total Sumber daya komputasi: 48 Virtual Core CPU & 80 GB RAM.
![pods](https://res.cloudinary.com/dex4u3rw4/image/upload/v1718548976/ququiz_scalable/pods_skc5ii.png)
2. Semua kubernetes manifest ada di directory k8s-deployment

# Code-Repository
1. Frontend: https://github.com/ququiz/ququiz-fe.git
2. Auth Service: https://github.com/ququiz/auth-service.git
3. Quiz Command Service: https://github.com/ququiz/quiz-service.git
4. Quiz Query Service: https://github.com/ququiz/quiz-query-service.git
5. Scoring Service: https://github.com/ququiz/scoring-service.git
6. Notification Service: https://github.com/ququiz/ququiz-notification.git


# QuickStart
### Prequisite
1. Kubernetes cluster dengan total resource 48 Virtual Core CPU & 80 GB RAM. Kalau lebih kecil bisa sesuaikan jumlah replica & resource limit di setiap manifest .


### Setup Redis, Mongodb, dll.

```
--- install argocd ----
https://argo-cd.readthedocs.io/en/stable/getting_started/
- argocd login  <ip_public_vps>:<port_argocd>
- argocd repo add  git@github.com:ququiz/argocd-k8s-ququiz.git  --ssh-private-key-path ./id_rsa

---- list namespace----
default: buat microservices, dkron
redis,mongodb,rabbitmq

----setup storageclass & pv----
- buat storageclass
cat << EOF | kubectl apply -f -
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
EOF

-- buat volume dir buat redis
sudo mkdir -p /data/volumes/redis
sudo chmod 777 /data/volumes/redis
sudo mkdir -p /data/volumes/redis1
sudo chmod 777 /data/volumes/redis1
sudo mkdir -p /data/volumes/redis2
sudo chmod 777 /data/volumes/redis2
sudo mkdir -p /data/volumes/redis3
sudo chmod 777 /data/volumes/redis3


NOTES: node sesuain nama k8s node yang mau dideploy redis/dbnya

- create pv buat redis
cat << EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-redis
spec:
  capacity:
    storage: 5Gi
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: local-storage
  local:
    path: /data/volumes/redis
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - nodeoracle1
EOF





------redis------
- helm repo add bitnami https://charts.bitnami.com/bitnami
- cd redis
- install redis pake argocd app (redis-app-argocd.yaml)


---setup volume mongodb
sudo rm -rf /data/volumes/pv-mongodb-st
sudo rm -rf /data/volumes/pv-mongodb-st2
sudo rm -rf /data/volumes/pv-mongodb-st3
cd mongodb
sudo mkdir /data/volumes/pv-mongodb-st
sudo mkdir /data/volumes/pv-mongodb-st2
sudo mkdir /data/volumes/pv-mongodb-st3

sudo chmod 777  /data/volumes/pv-mongodb-st (oracle)
sudo chmod 777  /data/volumes/pv-mongodb-st2 (biznet)
sudo chmod 777  /data/volumes/pv-mongodb-st3

kubectl apply -f pv1.yaml
kubectl apply -f pv2.yaml
kubectl apply -f pv3.yaml


---- mongodb (operator community , bitnami gak bisa ,justmeandopensource jg gakbisa)----

https://irshitmukherjee55.hashnode.dev/a-tale-of-deploying-mongodb-in-k8s-statefulsetsheadless-service
- install mongo via kubectl (file ada di k8s-deployment/mongodb)

k apply -f configmap.yaml

- bikin mongodb replicaset (3 replica)
kubectl exec -it mongo-0 -- mongo



rs.initiate({
        "_id" : "rs0",
        "members" : [
                {
                        "_id" : 0,
                        "host" : "mongo-0.mongo:27017",
                },
                {
                        "_id" : 1,
                        "host" : "mongo-1.mongo:27017",
                },
                {
                        "_id" : 2,
                        "host" : "mongo-2.mongo:27017",
                }
        ]
})

rs.status()


---- rabbitmq----

sudo mkdir -p /data/volumes/rabbitmq
sudo chmod 777 /data/volumes/rabbitmq

cat << EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-rabbitmq
spec:
  capacity:
    storage: 10Gi
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: local-storage
  local:
    path: /data/volumes/rabbitmq
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - nodegcp1
EOF




1. kubectl apply -f https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml
1b. tunggu sampai operator running  (kubectl get pod -n rabbitmq-system)
2a. deploy rabbitmq apps (argocd) (rabbitmq-app-argocd.yaml)

https://www.rabbitmq.com/kubernetes/operator/kubectl-plugin

2d. dapetin user rabbitmq : kubectl  get secret rabbitmq-default-user -o jsonpath="{.data.username}" | base64 --decode

2e. dapetin password rabbitmq:  kubectl  get secret rabbitmq-default-user -o jsonpath="{.data.password}" | base64 --decode

2f. kubectl get service rabbitmq -o jsonpath='{.spec.clusterIP}'

conURL := amqp://<yang_didapet_dari_2c>:<yang_didapet_dari2d>@<yang_didapet_dari_2g>:5672/
contoh:
connURL= amqp://default_user_Z4KRpZEzc-7wictHAsl:0vpV52fDOzbx2UtHFMRDotjw27pvzB1w@10.102.74.165:5672/

2i. copy conn url ke ennvironement k8s-deployment/app/*  (RABBIT_URL)



---- dkron ----

kubectl label nodes <your-node-name> dkron-node=true

4a. kubectl  create configmap dkroncurl  --from-file ./dkron_curl.sh
4b. apply dkron-app di argocd (argocd aja) (dkron-app-argocd.yaml)
4c. kubectl get pod
kubectl exec -it <nama_pod_dkron>  -- bash -c "cp curl/* bisa/ && chmod 777 bisa/dkron_curl.sh && bisa/dkron_curl.sh"


4e. connURL = http://dkron-svc:8080/v1/jobs
4f. copy connURl dkron ke environment  k8s-deployment/app/*  (DKRON_URL)




---- postgres ----
- helm repo add cloudnative-pg https://cloudnative-pg.io/charts/
- helm install my-cloudnative-pg cloudnative-pg/cloudnative-pg --version 0.20.2

sudo mkdir -p /data/volumes/postgres
sudo chmod 777 /data/volumes/postgres


kubectl apply -f postgres/pv-postgres.yaml



- install  postgres-app-argocd.yaml di argocd node
- kubectl exec -n postgres -it my-pgsql-cluster-1 bash

- psql -U postgres
- CREATE DATABASE ququiz;
- create user lintang with password 'lintang';
- GRANT ALL PRIVILEGES ON DATABASE ququiz to lintang;
- GRANT ALL ON SCHEMA public to lintang;
- ALTER DATABASE ququiz OWNER  TO lintang;


```

### Daftar queue RabbitMQ (wajib tambahin di web rabbitmq)

```

- delete-cache-queue
routingKey: delete-cache
exchange: scoring-quiz-query

- quiz.email.queue


- scoringQuizQueryQueue
routingKey: correct-answer
exchange: scoring-quiz-query

- userAnswerQueue
routingKey: user-answer
EXCHANGE_NAME: quiz-command-quiz-query

```

### Install istio


```

- taint noschedule dulu di semua node yg bukan jadi tempat deploy istio ingress..
- install istio sesuai https://istio.io/latest/docs/setup/getting-started/
- install gateway & virtual service istio (file ada di istio/ingress.yaml)

```



### Daftar queue RabbitMQ (wajib ditambahin di web rabbitmq management)

```
- k port-forward svc/rabbitmq 15672
- ssh -L 15672:localhost:15672 lintang@10.70.70.1

- delete-cache-queue
routingKey: delete-cache
exchange: scoring-quiz-query

- quiz.email.queue


- scoringQuizQueryQueue
routingKey: correct-answer
exchange: scoring-quiz-query

- userAnswerQueue
routingKey: user-answer
EXCHANGE_NAME: quiz-command-quiz-query

```

### Install Setiap Microservice lewat argocd
```
- argocd login  <ip_public_vps>:<port_argocd>
- argocd repo add  git@github.com:ququiz/argocd-k8s-ququiz.git  --ssh-private-key-path ./id_rsa
- add argocd app , pake semua manifest argocd app yg ada di root repo ini 

- quiz-command-app-argocd.yaml
- quiz-query-app-argocd.yaml
- auth-app-argocd.yaml
- notification-app-argocd.yaml
- scoring-service-app-argocd.yaml
```


## TODO

```

oracle vm harus ufw allow any & ufw enable
- scale istio ingress:

 k taint nodes  nodelintang  node-role.kubernetes.io/control-plane:NoSchedule
k taint nodes  nodealibaba  node-role.kubernetes.io/control-plane:NoSchedule
k taint nodes  nodegcp1  node-role.kubernetes.io/control-plane:NoSchedule
k taint nodes  nodebiznet  node-role.kubernetes.io/control-plane:NoSchedule
- k edit  deployment/istio-ingressgateway -n istio-system
- limit cpu : 6, memory 3Gi




cilium hubble port-forward &
hubble config set tls true
hubble config set tls-allow-insecure true

cat ~/.config/hubble/config.yaml
tls: true
tls-allow-insecure: true

hubble status
Healthcheck (via localhost:4245): Ok
Current/Max Flows: 24,570/24,570 (100.00%)
Flows/s: 51.15
Connected Nodes: 6/6


cilium hubble ui --open-browser=false
dari laptopku: ssh -L 8000:localhost:12000 lintang@10.70.70.1



### nginx ingress di node oracle
k taint nodes  nodelintang  node-role.kubernetes.io/control-plane:NoSchedule
k taint nodes  nodealibaba  node-role.kubernetes.io/control-plane:NoSchedule
k taint nodes  nodegcp1  node-role.kubernetes.io/control-plane:NoSchedule
k taint nodes  nodebiznet  node-role.kubernetes.io/control-plane:NoSchedule

k taint nodes  nodelintang  node-role.kubernetes.io/control-plane:NoSchedule-
k taint nodes  nodealibaba  node-role.kubernetes.io/control-plane:NoSchedule-
k taint nodes  nodegcp1  node-role.kubernetes.io/control-plane:NoSchedule-
k taint nodes  nodebiznet  node-role.kubernetes.io/control-plane:NoSchedule-

```



### troubleshooting

```
https://stackoverflow.com/questions/46852169/no-primary-detected-for-set-mongo-shell

argocd repo add  git@github.com:ququiz/argocd-k8s-ququiz.git  --ssh-private-key-path ./id_rsa

pull image lama : sudo systemctl restart kubelet
coredns crashloopbackoff:
kubectl edit configmap coredns -n kube-system
isinya:
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health
        kubernetes cluster.local in-addr.arpa ip6.arpa {
            pods insecure
            fallthrough in-addr.arpa ip6.arpa
        }
        prometheus :9153
        forward . 8.8.8.8 8.8.4.4
        cache 30
        loop
        reload
        loadbalance
    }


    yg line ini diganti :  forward . /etc/resolv.conf {
          prefer_udp
          max_concurrent 1000
        }
delete coredns yg crashloopbackoff


- crypto invalid?
rm -rf $HOME/.kube || true
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

```


## Notes

```
jangan run rabbitmq lewat argocd, bikin gak bisa connect
k apply -f aja langsung di vpsnya
```

# Testing
- Semua k6 file ada di directory load-testing
1. Quiz Query Service
![quiz query svc](https://res.cloudinary.com/dex4u3rw4/image/upload/v1718549742/ququiz_scalable/quiz_all_k6_tfbv6a.png)

2. Scoring Service
![Scoring Service](https://res.cloudinary.com/dex4u3rw4/image/upload/v1718549815/ququiz_scalable/scoring-service_urzkzt.png)

3. Semua Unit Test ada di masing masing repo microservice

# Dokumentasi
1. argocd
![argocd](https://res.cloudinary.com/dex4u3rw4/image/upload/v1718549477/ququiz_scalable/argocd_pa2eni.png)
2. Grafana
![grafana cpu](https://res.cloudinary.com/dex4u3rw4/image/upload/v1718549649/ququiz_scalable/grafana-cpu_ekvoeq.png)
![prome grafana per pod](https://res.cloudinary.com/dex4u3rw4/image/upload/v1718549888/ququiz_scalable/prome_grafana_kkpkld.png)
3. istio kiali
![istio](https://res.cloudinary.com/dex4u3rw4/image/upload/v1718549941/ququiz_scalable/istio-kiali_v29djn.png)
4. Cilium Hubble ui
![hubble](https://res.cloudinary.com/dex4u3rw4/image/upload/v1718550043/ququiz_scalable/hubble_ui_p6pnj7.png)