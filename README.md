# OpenCMDB

- 官网网站： http://opencmdb.cn
- 产品定位：全开源轻量级CMDB项目
- 我们的口号：让中国所有的运维工程师不再使用Excel管理资产！
- 项目成员：赵班长（PO）、母红英（Dev）、张亚庆（Dev）、张龙（Dev）

# OpenCMDB前端项目介绍

    OpenCMDB采用前后端分离的开发模式，前端使用Vue.js + Elementui进行开发。

# Dashboard截图

   ![OpenCMDB](https://github.com/unixhot/opencmdb-frontend/blob/master/example/opencmdb.png)

# 环境部署

## 版本详情：
	
	- NodeJs >= v6.10.2
	- 所依赖的软件包请参考package.json
	
1.安装NodeJS

```
[root@linux-node1 ~]# cd /usr/local/src
[root@linux-node1 src]# wget https://nodejs.org/dist/v8.12.0/node-v8.12.0-linux-x64.tar.xz
[root@linux-node1 src]# tar xf node-v8.12.0-linux-x64.tar.xz 
[root@linux-node1 src]# mv node-v8.12.0-linux-x64 /usr/local/
[root@linux-node1 src]# ln -s /usr/local/node-v8.12.0-linux-x64/ /usr/local/node
[root@linux-node1 ~]# vim ~/.bash_profile 
PATH=$PATH:$HOME/bin:/usr/local/node/bin
[root@linux-node1 ~]# source ~/.bash_profile 
[root@linux-node1 ~]# node -v
v8.12.0
```

2.克隆代码

```
[root@linux-node1 ~]# cd /opt/
[root@linux-node1 opt]# git clone git@github.com:unixhot/opencmdb-frontend.git

```

3.安装依赖

```
[root@linux-node1 ~]# npm install -g cnpm --registry=https://registry.npm.taobao.org
[root@linux-node1 ~]# cd /opt/opencmdb-frontend
[root@linux-node1 opencmdb-frontend]# cnpm install

```

### 本地开发环境发布

```
[root@linux-node1 opencmdb-frontend]# npm run dev
```

### 生产环境发布

1.生产部署文件

```
[root@linux-node1 opencmdb-frontend]# npm run build
[root@linux-node1 opencmdb-frontend]# ls -l
total 128
drwxr-xr-x    2 root root   214 Sep 15 11:35 build
drwxr-xr-x    2 root root    59 Sep 15 11:35 config
drwxr-xr-x    3 root root    38 Sep 15 11:55 dist
-rw-r--r--    1 root root   398 Sep 15 11:35 index.html
-rw-r--r--    1 root root  1067 Sep 15 11:35 LICENSE
drwxr-xr-x 1082 root root 81920 Sep 15 11:54 node_modules
-rw-r--r--    1 root root  2620 Sep 15 11:35 package.json
-rw-r--r--    1 root root   436 Sep 15 11:35 README.md
drwxr-xr-x   12 root root   171 Sep 15 11:35 src
drwxr-xr-x    2 root root    22 Sep 15 11:35 static


```

2.使用Nginx发布dist目录1

```
[root@linux-node1 ~]# yum install -y nginx
[root@linux-node1 ~]# vim /etc/nginx/conf.d/opencmdb.conf
server {
        listen 80;
        server_name  opencmdb.devopsedu.com;

        location / {
                root /opt/opencmdb-frontend/dist/;
                index index.html;
        }
        location ~ /api\/v0.1/{
                proxy_pass   http://127.0.0.1:5000;
        }
        location ~ /api\/docs/ {
                root /opt/opencmdb-backend;
        }
        access_log /var/log/nginx/opencmdb.log main;
}

[root@linux-node1 ~]# nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
[root@linux-node1 ~]# systemctl start nginx

```

3.访问OpenCMDB http://opencmdb.devopsedu.com/
