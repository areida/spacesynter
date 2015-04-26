node[:deploy].each do |applicaction, deploy|
    execute "pm2 delete #{applicaction}" do
        returns [0, 1]
    end

    execute 'npm link docker.io' do
        cwd "#{deploy[:deploy_to]}#{deploy[:current_symlink]}"
    end

    execute "pm2 start #{deploy[:deploy_to]}#{deploy[:current_symlink]}/server/#{applicaction}.js"

    template "/etc/nginx/sites-available/#{deploy[:domains].first}" do
        mode 0644
        source 'nginx.conf.erb'
        variables node[:webserver].merge(deploy)
    end
end

execute 'ln -snf /vagrant/servers.temp /etc/nginx/sites-available/servers'

service 'nginx' do
    action :restart
end