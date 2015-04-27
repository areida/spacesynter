node[:deploy].each do |application, deploy|
    if (application != 'frontend')
        execute "pm2 delete #{application}" do
            returns [0, 1, 127]
        end

        execute 'npm link docker.io' do
            cwd "#{deploy[:deploy_to]}#{deploy[:current_symlink]}"
        end

        execute 'npm link mongodb' do
            cwd "#{deploy[:deploy_to]}#{deploy[:current_symlink]}"
        end

        execute "pm2 start #{deploy[:deploy_to]}#{deploy[:current_symlink]}/server/#{application}.js"

        template "/etc/nginx/sites-available/#{application}" do
            mode 0644
            source 'nginx.conf.erb'
            variables node[:webserver].merge(deploy)
        end
    end
end

execute 'ln -snf /vagrant/servers.temp /etc/nginx/sites-available/servers'

service 'nginx' do
    action :restart
end