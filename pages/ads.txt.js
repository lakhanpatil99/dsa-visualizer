export default function Ads() {} 
Ads.getInitialProps = ({ res }) => { res.setHeader('Content-Type','text/plain'); res.write('google.com, pub-860233070445192, DIRECT, f08c47fec0942fa0'); res.end(); return {}; };
