const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { VM } = require('vm2');

exports.runCode = (code, language) => {
  return new Promise((resolve) => {
    const timestamp = Date.now();

    if (language === 'javascript') {
      try {
        const output = [];
        const vm = new VM({
          timeout: 1000,
          sandbox: {
            console: {
              log: (...args) => output.push(args.join(' ')),
            },
          },
        });

        vm.run(code);
        resolve(output.join('\n') || 'Code executed successfully!');
      } catch (err) {
        resolve('Error: ' + err.message);
      }
    }

    else if (language === 'python') {
      const filePath = `temp_${timestamp}.py`;
      fs.writeFileSync(filePath, code);

      exec(`python3 ${filePath}`, (err, stdout, stderr) => {
        fs.unlinkSync(filePath);
        if (err || stderr) {
          resolve(stderr || err.message);
        } else {
          resolve(stdout);
        }
      });
    }

    else if (language === 'cpp') {
      const cppPath = `temp_${timestamp}.cpp`;
      const exePath = `temp_${timestamp}.out`;
      fs.writeFileSync(cppPath, code);

      const command = `g++ ${cppPath} -o ${exePath} && ./${exePath}`;
      exec(command, (err, stdout, stderr) => {
        fs.unlinkSync(cppPath);
        try { fs.unlinkSync(exePath); } catch (_) {}
        if (err || stderr) {
          resolve(stderr || err.message);
        } else {
          resolve(stdout);
        }
      });
    }

    else {
      resolve('Unsupported language!');
    }
  });
};
