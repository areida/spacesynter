node[:deploy].each do |application, deploy|
    if (application != 'frontend')
        node[:packages][:npm].each do |pkg|
            execute 'npm link ' + pkg do
                cwd "#{deploy[:deploy_to]}#{deploy[:current_symlink]}"
            end
        end

        execute "pm2 start #{deploy[:deploy_to]}#{deploy[:current_symlink]}/server/#{application}.js" do
            not_if "pm2 info #{application}"
        end

        execute "pm2 restart #{application}" do
            only_if "pm2 info #{application}"
        end
    end
end

# execute 'ln -snf /vagrant/servers.temp /etc/nginx/sites-available/servers'