import Header from './header';
import Hero from './hero';
import Features from './features';
import Working from './working';
import Support from './support';
import Footer from './footer';

const Home = () => {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-black dark:text-white">
      <Header />
      <Hero />
      <Features />
      <Working />
      <Support />
      <Footer />
    </main>
  );
};

export default Home;
