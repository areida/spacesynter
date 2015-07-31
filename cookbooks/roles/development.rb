name 'vagrant'

override_attributes(
    'deploy' => {
        'api' => {
            'deploy_to'              => '/vagrant',
            'domains'                => ['api.spacesynter.vm'],
            'environment_variables'  => {}
        },
        'app' => {
            'deploy_to'              => '/vagrant',
            'document_root'          => 'build',
            'absolute_document_root' => '/vagrant/build/',
            'proxies'                => {
                'api' => 'http://localhost:8000'
            },
            'proxy_pass' => 'http://localhost:9090'
        }
    },
    'environment' => {
        'APP_ENV'  => 'development',
        'APP_NAME' => 'spacesynter',
        'NODE_ENV' => 'development'
    },
    'packages' => {
        'apt' => ['git', 'mongodb', 'nodejs', 'npm', 'redis-server', 'unzip'],
        'npm' => ['mongodb', 'mongoose', 'pm2']
    },
    'webservers' => {
        'app' => {
            'proxy_pass' => 'http://localhost:9090'
        }
    }
)

run_list(
    'recipe[spacesynter]'
)
