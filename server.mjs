import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.pdf':'application/pdf','.webp':'image/webp'};
const server = http.createServer(async(req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if (pathname === '/__mobile') {res.writeHead(200,{'Content-Type':'text/html'});res.end('<!doctype html><html><head><title>Mobile layout verification</title></head><body style="margin:0;background:#ccc"><iframe title="390px mobile preview" src="/" style="display:block;border:0;width:390px;height:844px;margin:auto"></iframe></body></html>');return;}
    const file = path.resolve(root,'.'+(pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep)) {res.writeHead(403);res.end();return;}
    const data = await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream'});res.end(data);
  } catch {res.writeHead(404);res.end('Not found');}
});
server.listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
