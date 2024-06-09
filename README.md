# argocd-k8s-ququiz

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

- load test && apply rekomen cpu & mem setiap pod/db/mq pake goldilocks
- reset cluster buat config hubble metrics httpv2 (biar bisa nampilin http request metrics)
- gak usah pake linkerd & istio karena udah coba install  (& pake cilium) tetep gakbisa
https://play.instruqt.com/embed/isovalent/tracks/cilium-envoy-l7-proxy/challenges/observability/assignment

https://github.com/cilium/cilium/issues/20130
https://isovalent.com/videos/back-to-basics-l7-flow-visibility/
- biar ada metrics http per pod: 
kubectl label pods -n default --all hubble-metrics=default
kubectl label pods -n ingress-nginx --all hubble-metrics=default
kubectl label pods -n postgres --all hubble-metrics=default
kubectl label pods -n redis --all hubble-metrics=default
kubectl label pods -n rabbitmq-system --all hubble-metrics=default
kubectl label pods --all-namespaces --all hubble-metrics=default




GAK USAH PAKE all.yaml  BIKIN LATENCYNYA MAKIN TINGGI

k delete -f all.yaml
k delete -f all.yaml -n argocd
k delete -f all.yaml -n cilium-monitoring

k delete -f all.yaml -n cilium-monitoring

k delete -f all.yaml -n kube-node-lease
k delete -f all.yaml -n kube-public
k delete -f all.yaml -n kube-system
k delete -f all.yaml -n postgres
k delete -f all.yaml -n rabbitmq-system
k delete -f all.yaml -n redis

- emang bawaannya cilium has no deployed resources
- kalau mau ganti config harus reset & ganti config




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

emang dari awal: Error: Unable to enable Hubble: release: not found



kubectl -n kube-system get pods -l k8s-app=cilium
kubectl -n kube-system exec cilium-69rfw -- cilium endpoint list




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

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/baremetal/deploy.yaml --kubeconfig=/home/lintang/.kube/config

cilium
jangan pernah install ulang cilium cni, bakal errror networkingnya cluster nanti

jangan pernah hapus cni di /etc/cni.d tau di /opt/bin/cni,bikin error clusternya

https://github.com/cilium/hubble/issues/1356
https://github.com/cilium/cilium/issues/13738 apply l7 ke all endpoint ingress ke semua pod di semua namespaces..

```

```

## Notes

```
jangan run rabbitmq lewat argocd, bikin gak bisa connect
k apply -f aja langsung di vpsnya

https://github.com/cilium/cilium/blob/main/examples/kubernetes/addons/prometheus/README.md


rm -rf $HOME/.kube || true    
mkdir -p $HOME/.kube   
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config   
sudo chown $(id -u):$(id -g) $HOME/.kube/config

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


```

### serice mesh? gak usah pake cilium & hubble aja

```
gak usah pake service mesh, udah coba install linkerd & istio malah error pod ingress istio/pod linkerdnya


cilium hubble ui --open-browser=false
dari laptopku: ssh -L 8000:localhost:12000 lintang@10.70.70.1


```

### Linkerd

```
https://linkerd.io/2.15/getting-started/ (gakbisa)

linkerd install --crds | kubectl apply -f - --kubeconfig=/home/lintang/.kube/config

https://linkerd.io/2.15/features/cni/#using-the-cli, sama aja gabisa

https://github.com/linkerd/linkerd2/issues/7493


linkerd install-cni | kubectl apply -f -
linkerd install --crds | kubectl apply -f -
linkerd install --linkerd-cni-enabled | kubectl apply -f -
gakbisa semua

https://linkerd.io/2.15/reference/cluster-configuration/#gke
pake linkerd-control-plane  + cni  + disable poststart, await=false sama aja tetep gakbisa

kubespray gak bisa pake service mesh ...
```

### istio

```

tar -zxvf https://github.com/istio/istio/releases/download/1.15.0/istio-1.15.0-linux-amd64.tar.gz

taint noschedule dulu di semua node yg bukan jadi tempat deploy istio ingress..
istioctl install

https://docs.tigera.io/calico/latest/network-policy/istio/app-layer-policy
istio biasa tanpa cni gakbisa, 403 forbidden di google gak ada solusi
gak bisa semua

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
- helm install redis bitnami/redis --version 19.3.4 -f values.yaml --namespace redis (ini gakusah argocd aja yg deploy)


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

k apply -f configmap.yaml

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
deploy rabbitmq apps (argocd)

https://www.rabbitmq.com/kubernetes/operator/kubectl-plugin

2d. dapetin user rabbitmq : kubectl  get secret rabbitmq-default-user -o jsonpath="{.data.username}" | base64 --decode

2e. dapetin password rabbitmq:  kubectl  get secret rabbitmq-default-user -o jsonpath="{.data.password}" | base64 --decode

2f. kubectl get service rabbitmq -o jsonpath='{.spec.clusterIP}'

conURL := amqp://<yang_didapet_dari_2c>:<yang_didapet_dari2d>@<yang_didapet_dari_2g>:5672/
contoh:
connURL= amqp://default_user_Z4KRpZEzc-7wictHAsl:0vpV52fDOzbx2UtHFMRDotjw27pvzB1w@10.102.74.165:5672/

2i. copy conn url ke ennvironement k8s-deployment/app/*  (RABBIT_URL)



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

2d. dapetin user rabbitmq : kubectl -n default  get secret rabbitmq-default-user -o jsonpath="{.data.username}" | base64 --decode

2e. dapetin password rabbitmq:  kubectl -n default get secret rabbitmq-default-user -o jsonpath="{.data.password}" | base64 --decode

2f. kubectl get service rabbitmq -o jsonpath='{.spec.clusterIP}' -n default

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






7. minikube addons enable metrics-server
```
