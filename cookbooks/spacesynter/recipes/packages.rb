node[:packages][:apt].each do |pkg|
    package pkg do
        action [:install, :upgrade]
    end
end

node[:packages][:npm].each do |pkg|
    execute 'npm install -g ' + pkg do
        not_if 'which ' + pkg
    end
end

if (node[:packages].include?('nodejs'))
    execute 'ln -snf /usr/bin/nodejs /usr/bin/node'
end