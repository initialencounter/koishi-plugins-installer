const https_1 = require('https');
const spawn = require('child_process').spawn;
const Yml2arr = /** @class */ (function () {
    // 构造函数 
    class Yml2arr {
        constructor(yml_path) {
            this.yml_path = yml_path;
            this.yaml = require('js-yaml');
            this.fs = require('fs');
            this.json_obj = this.yaml.load(this.fs.readFileSync(this.yml_path, 'utf8'));
            this.plugins_on = this.get_plugins(this.json_obj["plugins"])[0];
            this.plugins_off = this.get_plugins(this.json_obj["plugins"])[1];
        }
        // 方法 
        get_plugins(obj = this.json_obj["plugins"]) {
            if (!obj) {
                return null;
            }
            const keys = Object.keys(obj);
            const plugins_on = [];
            const plugins_off = [];
            keys.forEach((i) => {
                if (i.slice(0, 6) == 'group:') {
                    const [on_arr, off_arr] = this.get_plugins(obj[i]);
                    on_arr.forEach((i) => {
                        plugins_on.push(i);
                    });
                    off_arr.forEach((i) => {
                        plugins_off.push(i);
                    });
                } else {
                    if (i.indexOf(':') == -1) {
                        i = i
                    } else {
                        i = i.slice(0, i.indexOf(':'))
                    }
                    if (i.slice(0, 1) == '~') {

                        plugins_off.push(i.slice(1));
                    } else {
                        plugins_on.push(i);
                    }
                }
            });
            return [plugins_on, plugins_off];
        }
    }
    return Yml2arr;
}());

// spawn cmd args
function install(pkg_name){
    var spawn_execution = spawn('npm', ["i", pkg_name]);
    spawn_execution.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });
}

// get full name and call install fnc
function package_search_install (plugin_name) {
    var i = plugin_name
    https_1.get(`https://www.npmjs.com/package/koishi-plugin-${i}`, (res) => {
        if (res.statusCode == 200) {
            console.log(`koishi-plugin-${i} Installing...`)
            install(`koishi-plugin-${i}`)
        } else {
            https_1.get(`https://www.npmjs.com/package/@koishijs/plugin-${i}`, (res) => {
                if (res.statusCode == 200) {
                    console.log(`@koishijs/plugin-${i} Installing...`)
                    install( `@koishijs/plugin-${i}`)
                }else{
                    console.log(`${i} install failed`)
                }
            })
        }
        

    })
}


// List plug-ins
const ls = new Yml2arr("koishi.yml")
console.log(ls.plugins_off)
console.log(ls.plugins_on)
const pkg_arr = ls.plugins_on
pkg_arr.forEach((i) => {
    package_search_install(i)
})
// package_search_install('auth')
