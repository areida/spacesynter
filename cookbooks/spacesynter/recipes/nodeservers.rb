node[:deploy].each do |application, deploy|
    if (application != 'frontend')
        node[:packages][:npm].each do |pkg|
            execute 'npm link ' + pkg do
                cwd "#{deploy[:deploy_to]}#{node[:current_symlink]}"
            end
        end

        execute "pm2 restart #{application}" do
            only_if "pm2 info #{application}"
        end

        execute "pm2 start #{deploy[:deploy_to]}#{node[:current_symlink]}/server/#{application}.js" do
            not_if "pm2 info #{application}"
        end

        execute "touch #{deploy[:deploy_to]}/shared/servers.conf"
        execute "ln -snf #{deploy[:deploy_to]}/shared/servers.conf /etc/nginx/sites-available/servers"
        execute 'nginx_ensite servers'
    end
end
