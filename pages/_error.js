function Error({ statusCode }) {
  return (
    <div className="min-h-screen bg-[#F8F5ED] dark:bg-[#1A1916] flex items-center justify-center p-6 text-[#24231F] dark:text-[#FFFDF8]">
      <div className="text-center max-w-md w-full p-8 rounded-2xl bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] shadow-sm space-y-4">
        <h1 className="text-5xl font-black text-[#EF592A] font-mono">
          {statusCode || '500'}
        </h1>
        <h2 className="text-xl font-bold tracking-tight">
          {statusCode === 404 ? 'Page Not Found' : 'Something went wrong'}
        </h2>
        <p className="text-xs text-[#69665F] dark:text-[#A09D95] font-mono leading-relaxed">
          {statusCode === 404
            ? 'The requested page or algorithm visualizer could not be found.'
            : 'An unexpected application error occurred. Return to home to resume learning.'}
        </p>
        <div className="pt-2">
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-mono text-xs font-bold bg-[#24231F] dark:bg-[#FFFDF8] text-[#FFFDF8] dark:text-[#24231F] hover:bg-[#EF592A] dark:hover:bg-[#EF592A] dark:hover:text-[#FFFDF8] transition-all shadow-xs"
          >
            Return to Home →
          </a>
        </div>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  if (err) {
    console.error('[AlgoMania Error Boundary]', err);
  }
  const statusCode = res && res.statusCode && res.statusCode !== 200
    ? res.statusCode
    : err
      ? (err.statusCode || 500)
      : 404;
  return { statusCode: statusCode || 500 };
};

export default Error;
