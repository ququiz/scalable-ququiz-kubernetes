# argocd-k8s-ququiz

## TODO

```
- load test && apply rekomen cpu & mem setiap pod/db/mq pake goldilocks
```
### troubleshooting
```
https://stackoverflow.com/questions/46852169/no-primary-detected-for-set-mongo-shell


```
### Setup Redis, Mongodb, dll.

```
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
    storage: 2Gi
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
          - node1
EOF



cat << EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-redis1
spec:
  capacity:
    storage: 2Gi
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: local-storage
  local:
    path: /data/volumes/redis1
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - node1
EOF


cat << EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-redis2
spec:
  capacity:
    storage: 2Gi
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: local-storage
  local:
    path: /data/volumes/redis2
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - node1
EOF



cat << EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-redis3
spec:
  capacity:
    storage: 2Gi
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: local-storage
  local:
    path: /data/volumes/redis3
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - node1
EOF







------redis------
- helm repo add bitnami https://charts.bitnami.com/bitnami
- cd redis
- helm install redis bitnami/redis --version 19.3.4 -f values.yaml --namespace redis (ini gakusah argocd aja yg deploy)


---setup volume mongodb
cd mongodb
sudo mkdir /data/volumes/pv-mongodb-data
sudo mkdir /data/volumes/pv-mongodb-data-2

sudo mkdir /data/volumes/pv-mongodb-data-3

sudo mkdir /data/volumes/pv-mongodb-logs

sudo mkdir /data/volumes/pv-mongodb-logs-2
sudo mkdir /data/volumes/pv-mongodb-logs-3

sudo chmod 777  /data/volumes/pv-mongodb-data
sudo chmod 777  /data/volumes/pv-mongodb-data-2
sudo chmod 777  /data/volumes/pv-mongodb-data-3
sudo chmod 777 /data/volumes/pv-mongodb-logs
sudo chmod 777 /data/volumes/pv-mongodb-logs-2
sudo chmod 777 /data/volumes/pv-mongodb-logs-3


kubectl apply -f pv-logs.yaml
kubectl apply -f pv-logs2.yaml
kubectl apply -f pv-logs3.yaml
kubectl apply -f pv-data.yaml
kubectl apply -f pv-data2.yaml
kubectl apply -f pv-data3.yaml




----mongodb------

-  helm repo add mongodb https://mongodb.github.io/helm-charts
- helm install community-operator mongodb/community-operator --namespace mongodb  --create-namespace
- kubectl apply -f mongo_sample_cr.yaml --namespace mongodb (ini gakusah biar argo cd yang deploy)
 kubectl get secret ququiz-db-mongodb-admin-admin    -n mongodb \
-o json | jq -r '.data | with_entries(.value |= @base64d)'

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
    storage: 5Gi
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
          - node1
EOF




1. kubectl apply -f https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml
1b. tunggu sampai operator running  (kubectl get pod -n rabbitmq-system)
deploy rabbitmq apps



---- dkron ----
4a. kubectl  create configmap dkroncurl  --from-file ./dkron_curl.sh
4b. apply dkron-app di argocd (argocd aaja)
4c. kubectl get pod

4d. kubectl exec -it <nama_pod_dkron>  -- bash -c "cp curl/* bisa/ && chmod 777 bisa/dkron_curl.sh && bisa/dkron_curl.sh"

4e. connURL = http://dkron-svc:8080/v1/jobs
4f. copy connURl dkron ke environment  k8s-deployment/app/*  (DKRON_URL)



---- postgres ----
- helm repo add cloudnative-pg https://cloudnative-pg.io/charts/
- helm install my-cloudnative-pg cloudnative-pg/cloudnative-pg --version 0.20.2

sudo mkdir -p /data/volumes/postgres
sudo chmod 777 /data/volumes/postgres


kubectl apply -f postgres/pv-postgres.yaml


- install  postgres-app.yaml di argocd node
- kubectl exec -n postgres -it my-pgsql-cluster-1 bash

- psql -U postgres
- CREATE DATABASE ququiz;
- create user lintang with password 'lintang';
- GRANT ALL PRIVILEGES ON DATABASE ququiz to lintang;
- GRANT ALL ON SCHEMA public to lintang;
- ALTER DATABASE ququiz OWNER  TO lintang;


```

## Quick Start (Minikube/k8s) (yg kujelasin works di minikube)

- aku ambil dari hehe https://github.com/lintang-b-s/distributed-video-transcoder
- setup mongodb operator, rabbitmq operator, dkron, nginx-ingress (eksekusi semua commadn dibawah sebelum deploy app)

```

0. pastikan udah install, helm, minikube, docker
0b. minikube start --cpus max --memory=9000mb --driver=docker (kalau sebelumnya pernah init cluster minikube, delete dulu `minikube delete`)
0c. helm repo add mongodb https://mongodb.github.io/helm-charts
0d. helm install community-operator mongodb/community-operator --namespace mongodb  --create-namespace

1. kubectl apply -f k8s-deployment/mongodb/mongo_cr.yaml --namespace mongodb
1b. kubectl describe pod example-mongodb-0 -n mongodb (tunggu sampai pod started)
1c. kubectl get pod -n mongodb (tunggu sampai example-mongodb-0, example-mongodb-1, example-mongodb-2 started)

1d.dapetin connection string mongodb:  kubectl get secret example-mongodb-admin-admin    -n mongodb \
-o json | jq -r '.data | with_entries(.value |= @base64d)'

1e. contoh hasil dari command diatas:
{
  "connectionString.standard": "mongodb://admin:lintang@example-mongodb-0.example-mongodb-svc.mongodb.svc.cluster.local:27017,example-mongodb-1.example-mongodb-svc.mongodb.svc.cluster.local:27017,example-mongodb-2.example-mongodb-svc.mongodb.svc.cluster.local:27017/admin?replicaSet=example-mongodb&ssl=false",
  "connectionString.standardSrv": "mongodb+srv://admin:lintang@example-mongodb-svc.mongodb.svc.cluster.local/admin?replicaSet=example-mongodb&ssl=false",
  "password": "lintang",
  "username": "admin"
}


1f. copy connectionString.standarrd ke ennvironement k8s-deployment/app/* (MONGO_URL)



1j. minikube addons enable ingress

--- rabbitmq----
2. kubectl apply -f https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml
2b. tunggu sampai operator running  (kubectl get pod -n rabbitmq-system)
2c. kubectl apply -f k8s-deployment/rabbitmq/rmq_cr.yaml

2d. dapetin user rabbitmq : kubectl -n rabbitmq  get secret rabbitmq-default-user -o jsonpath="{.data.username}" | base64 --decode

2e. dapetin password rabbitmq:  kubectl -n rabbitmq get secret rabbitmq-default-user -o jsonpath="{.data.password}" | base64 --decode

2f. kubectl get service rabbitmq -o jsonpath='{.spec.clusterIP}' -n rabbitmq

conURL := amqp://<yang_didapet_dari_2c>:<yang_didapet_dari2d>@<yang_didapet_dari_2g>:5672/
contoh:
connURL= amqp://default_user_Z4KRpZEzc-7wictHAsl:0vpV52fDOzbx2UtHFMRDotjw27pvzB1w@10.102.74.165:5672/

2i. copy conn url ke ennvironement k8s-deployment/app/*  (RABBIT_URL)



---- dkron ----
4a. kubectl  create configmap dkroncurl  --from-file ./dkron_curl.sh
4b. kubectl apply -f k8s-deployment/dkron/dkron-deployment.yaml
4c. kubectl get pod

4d. kubectl exec -it <nama_pod_dkron>  -- bash -c "cp curl/* bisa/ && chmod 777 bisa/dkron_curl.sh && bisa/dkron_curl.sh"

4e. connURL = http://dkron-svc:8080/v1/jobs
4f. copy conURl dkron ke environment  k8s-deployment/app/*  (DKRON_URL)


---nginx ingress---
5a. minikube addons enable ingress
5b. minikube ip (copy ip nya)




7. minikube addons enable metrics-server
```
