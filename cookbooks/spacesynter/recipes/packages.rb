node[:packages][:apt].each do |pkg|
    package pkg do
        action [:install, :upgrade]
    end
end

node[:packages][:npm].each do |pkg|
    execute 'npm install -g ' + pkg do
        not if 'which ' + pkg
    end
end
