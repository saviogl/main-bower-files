var nodePath = require('path');
require('shelljs/global');

require('should');

describe('mbf-cli', function() {
    describe('errors', function() {
        it('should exit with a simulated range error', function (done){
            exec('mbfiles', { silent: true }, function (code, stdout, stderr){
                code.should.be.eql(1);
                var stdoutMsg = stdout.split('\n').filter(function (s){return s;});
                stdoutMsg.should.be.an.instanceOf(Array).and.have.lengthOf(3);
                done();
            });
        });

        it('should exit with an invalid destination type', function (done){
            exec('mbfiles test/main.js', { silent: true }, function (code, stdout, stderr){
                code.should.be.eql(1);
                var stdoutMsg = stdout.split('\n').filter(function (s){return s;});
                stdoutMsg.should.be.an.instanceOf(Array).and.have.lengthOf(1);
                done();
            });
        });
    });

    describe('copying', function() {
        var destiationFolder = nodePath.join(__dirname, 'dist');
        before('boferaAll: clean destination folder', function (){
            rm('-rf', destiationFolder);
        });

        afterEach('afterEach: clean destination fodler', function() {
            rm('-rf', destiationFolder);
        });

        it('should copy the expected files into destination folder', function (done){
            expect([
                'simple.js',
                'another.js',
                'multi.js',
                'multi.css',
                'hasPackageNoBower.js',
                'deeppaths.js',
                'decoy.js'
            ])
            .args(['--bowerJsonPath=test/_bower.json', '--bowerRcPath=test/.bowerrc'])
            .to(destiationFolder)
            .when(done);
        });

        it('should copy only the files that match the glob filter', function (done){
            expect([
                'multi.css'
            ])
            .args(['--bowerJsonPath=test/_bower.json', '--bowerRcPath=test/.bowerrc', '--filter=**/*.css'])
            .to(destiationFolder)
            .when(done);
        });
    });
});

function expect(filenames) {
    filenames = filenames.sort();
    function run(args, dest, done) {
        args = args || [];
        args.push(dest);

        exec('mbfiles ' + args.join(' '), { silent: true }, function (code, stdout, stderr){
            code.should.be.eql(0);
            getFiles(dest).should.be.eql(filenames);

            done();
        });
    }

    return {
        args: function(args) {
            return {
                to: function (dest){
                    return {
                        when: function(done) {
                            run(args, dest, done);
                        }
                    }
                }
            };
        }
    };
}

function getFiles(path){
    return find(path)
    .map(function (f){ return nodePath.basename(f); })
    .filter(function (f){ return f.match(/^\w*\.\w*$/); })
    .sort();
}