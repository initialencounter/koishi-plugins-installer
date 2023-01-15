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
                    if(i.indexOf(':')==-1){
                        i = i
                    }else{
                        i = i.slice(0,i.indexOf(':'))
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

if (require.main === module) {
    const ls = new Yml2arr("koishi.yml")
    console.log(ls.plugins_on)
    console.log(ls.plugins_off)
    const pkg_arr = ls.plugins_on
    pkg_arr.forEach((i) => {
        var spawn_execution = spawn('npm', ["i", `koishi-plugin-${i}`]);
        spawn_execution.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });
    })
}
            });
            return [plugins_on, plugins_off];
        }
    }
    return Yml2arr;
}());

if (require.main === module) {
    const ls = new Yml2arr("./koishi.yml")
    console.log(ls.plugins_on)
    console.log(ls.plugins_off)
    const pkg_arr = ls.plugins_on
    pkg_arr.forEach((i) => {
        var spawn_execution = spawn('npm', ["i", `koishi-plugin-${i}`]);
        spawn_execution.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });
    })
}

