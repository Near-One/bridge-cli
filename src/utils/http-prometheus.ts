import * as client from 'prom-client';
import * as http from 'http';

export default class HttpPrometheus {
  metricsPrefix: string;

  server: http.Server;

  constructor(port: number, metricsPrefix: string) {
    this.metricsPrefix = metricsPrefix;
    client.collectDefaultMetrics({
      register: new client.Registry()
    });

    this.server = http.createServer(async function (req, res) {
      if (req.url === '/metrics') {
        const metrics = await client.register.metrics();
        res.write(metrics); // write a response to the client
        res.end(); // end the response
        return;
      }
      res.write('Not Found');
      res.end();
    });

    this.server.listen(port);
  }

  gauge(name: string, help: string, labels = {}): client.Gauge<string> {
    const gauge = new client.Gauge({
      name: this.metricsPrefix + name,
      help,
      labelNames: Object.keys(labels)
    });
    client.register.registerMetric(gauge);
    return gauge;
  }

  counter(name: string, help: string, labels = {}): client.Counter<string> {
    const counter = new client.Counter({
      name: this.metricsPrefix + name,
      help,
      labelNames: Object.keys(labels)
    });
    client.register.registerMetric(counter);
    return counter;
  }
}
