execute 'pm2 delete all' do
    returns [0, 1]
end

node[:servers].each do |server, config|
    execute "pm2 start server/#{server} --watch server" do
        cwd '/vagrant'
    end
    template "/etc/nginx/sites-available/#{config[:server_name]}" +  do
        mode 0644
        source 'nginx.conf.erb'
        variables node[:webserver].merge(server).merge({:server => server})
    end
end

execute 'ln -snf /vagrant/servers.temp /etc/nginx/sites-available/servers'

service 'nginx' do
    action :restart
end