node[:deploy].each do |application, deploy|
    if (application != 'frontend')
        execute "pm2 delete #{application}" do
            returns [0, 1, 127]
        end

        node[:packages][:npm].each do |pkg|
            execute 'npm link ' + pkg do
                cwd "#{deploy[:deploy_to]}#{deploy[:current_symlink]}"
            end
        end

        execute "pm2 start #{deploy[:deploy_to]}#{deploy[:current_symlink]}/server/#{application}.js"
    end
end

# execute 'ln -snf /vagrant/servers.temp /etc/nginx/sites-available/servers'