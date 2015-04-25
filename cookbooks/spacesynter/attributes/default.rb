default[:environment][:PATH]      = '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games'
default[:webserver][:listen]      = 80
default[:webserver][:proxies]     = {}
default[:webserver][:proxy_pass]  = 'localhost'
default[:webserver][:server_name] = 'default'
default[:webserver][:root]        = false