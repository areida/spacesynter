# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = '2'

Vagrant.require_version '>= 1.7.0'

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    # All Vagrant configuration is done here. The most common configuration
    # options are documented and commented below. For a complete reference,
    # please see the online documentation at vagrantup.com.

    environment = ENV['APP_ENV'] || 'development'

    # CHANGEME
    app_name = ENV['APP_NAME'] || 'spacesynter'
    app_subdomain = 'api'

    static_ip = ENV['STATIC_IP'] || '192.168.50.1'
    # See wiki: https://github.com/synapsestudios/wiki/blob/master/developers/setup/using-vagrant.md

    config.vm.box = 'chef/ubuntu-14.04'
    # Change to chef/ubuntu-14.04 for building a new base vm

    # END CHANGEME

    config.vm.hostname = app_name + '.vm'

    # Set the version of chef to install using the vagrant-omnibus plugin
    # NOTE: You will need to install the vagrant-omnibus plugin:
    #
    #   $ vagrant plugin install vagrant-omnibus
    #
    #if Vagrant.has_plugin?('vagrant-omnibus')
    #  config.omnibus.chef_version = 'latest'
    #end

    if environment == 'qa'
        # Sync the project directory to /vagrant on the VM
        config.vm.synced_folder '.', '/vagrant', type: 'rsync', rsync__exclude: '.git/'
        # Switch to following or copy following line to Vagrantfile.local in project directory to use virtualbox' folder sharing
        # config.vm.synced_folder '.', '/vagrant', owner: 'www-data', group: 'www-data', mount_options: ['dmode=777','fmode=777']

        # QA environment uses DHCP on the host-only network adapter
        config.vm.network 'private_network', type: :dhcp

        # Need this to enable DNS host resolution through NAT so our VM can access
        # the internet
        config.vm.provider 'virtualbox' do |vb|
            vb.customize ['modifyvm', :id, '--natdnshostresolver1', 'on', '--memory', '1024']
        end

      config.vm.provision 'chef_solo' do |chef|
          chef.roles_path     = './cookbooks/roles'
          chef.cookbooks_path = './cookbooks'
          chef.add_role 'qa'
      end
  else
    # NFS file share
    config.vm.synced_folder '.', '/vagrant', type: 'nfs', mount_options: ['acregmax=5']
    config.vm.network 'private_network', ip: static_ip

    config.hostmanager.include_offline   = true
    config.hostmanager.ignore_private_ip = false
    config.hostmanager.manage_host       = true
    config.hostmanager.aliases           = [
        app_name + '.vm',
        app_subdomain + '.' + app_name + '.vm'
    ]

    config.vm.provider 'virtualbox' do |vb|
        vb.customize ['modifyvm', :id, '--natdnshostresolver1', 'on', '--memory', '2048']
        vb.customize ['modifyvm', :id, '--cpus', '2']
    end

    config.vm.provision 'chef_solo' do |chef|
        chef.roles_path     = './cookbooks/roles'
        chef.cookbooks_path = './cookbooks'
        chef.add_role 'development'
    end
end