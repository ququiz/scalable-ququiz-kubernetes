# argocd-k8s-ququiz



## Quick Start (Minikube/k8s) (yg kujelasin works di minikube)
- aku ambil dari  hehe https://github.com/lintang-b-s/distributed-video-transcoder
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

2f. kubectl get service rabbitmq -o jsonpath='{.spec.clusterIP}'

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


