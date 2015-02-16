packages = %w{git nginx mysql-server postgresql curl}

packages.each do |pkg|
    package pkg do
        action  [:install, :upgrade]
        version node[:versions][pkg]
    end
end