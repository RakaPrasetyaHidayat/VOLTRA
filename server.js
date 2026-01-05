const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  const cpus = os.cpus().length || 1;
  console.log(`Primary process ${process.pid} — forking ${cpus} workers`);
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.warn(`Worker ${worker.process.pid} exited — restarting`);
    cluster.fork();
  });
} else {
  // Worker: start app
  const app = require('./app');
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} listening on ${PORT}`);
  });
}
