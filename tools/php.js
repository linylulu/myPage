import phpServer from 'php-server';


const server = phpServer({base: 'public_html', port: 3000, open: true});
console.log(`PHP server running at ${server.url}`);
