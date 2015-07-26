node[:deploy].each do |application, deploy|
    template "/etc/nginx/sites-available/#{application}" do
        mode 0644
        source 'nginx.site.erb'
        variables ({
            :deploy => deploy,
            :webserver => node[:webserver].merge(node[:webservers][application])
        })
        cookbook 'spacesynter'
    end
end

service 'nginx' do
    action :restart
end