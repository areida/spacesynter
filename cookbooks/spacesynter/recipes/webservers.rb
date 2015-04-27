node[:deploy].each do |application, deploy|
    if (application != 'frontend')
        template "/etc/nginx/sites-available/#{application}" do
            mode 0644
            source 'nginx.site.erb'
            variables node[:webserver].merge(node[:webservers][application])
            cookbook 'spacesynter'
        end
    end
end

service 'nginx' do
    action :restart
end